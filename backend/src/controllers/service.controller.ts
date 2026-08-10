import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { deleteFileFromStorage } from '../utils/storage';

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getPublicServices = async (_req: Request, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({
      where: { status: 'PUBLISHED', showOnHomepage: true },
      orderBy: { order: 'asc' },
    });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    console.error('❌ Get public services error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};

export const getPublicServiceBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const service = await prisma.service.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: {
        projects: {
          where: { status: 'PUBLISHED' },
          orderBy: { createdAt: 'desc' }
        }
      }
    });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    console.error('❌ Get service by slug error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch service.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES (Protected)
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllServices = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: 'asc' } });
    res.status(200).json({ success: true, data: services });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch services.' });
  }
};

export const getServiceById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const service = await prisma.service.findUnique({ where: { id: req.params.id } });
    if (!service) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }
    res.status(200).json({ success: true, data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch service.' });
  }
};

export const createService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, shortDescription, fullDescription, icon, image, features, order, isFeatured, showOnHomepage, status, seoTitle, seoDescription, technologies } = req.body;

    if (!title || !slug || !shortDescription || !fullDescription || !icon) {
      res.status(400).json({ success: false, message: 'Title, slug, shortDescription, fullDescription, and icon are required.' });
      return;
    }

    const existing = await prisma.service.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'A service with this slug already exists.' });
      return;
    }

    const service = await prisma.service.create({
      data: {
        title, slug, shortDescription, fullDescription, icon,
        image: image || null,
        features: features || [],
        order: order || 0,
        isFeatured: isFeatured ?? false,
        showOnHomepage: showOnHomepage ?? true,
        status: status || 'DRAFT',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        technologies: technologies || [],
      },
    });
    res.status(201).json({ success: true, message: 'Service created.', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create service.' });
  }
};

export const updateService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = await prisma.service.findUnique({ where: { slug: req.body.slug } });
      if (slugExists) {
        res.status(409).json({ success: false, message: 'A service with this slug already exists.' });
        return;
      }
    }

    // Clean up replaced image asynchronously
    if (req.body.image !== undefined && existing.image && existing.image !== req.body.image) {
      deleteFileFromStorage(existing.image).catch(err => {
        console.error('Error during service image update cleanup:', err);
      });
    }

    const service = await prisma.service.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Service updated.', data: service });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update service.' });
  }
};

export const deleteService = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.service.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Service not found.' });
      return;
    }

    // Clean up image from storage asynchronously
    if (existing.image) {
      deleteFileFromStorage(existing.image).catch(err => {
        console.error('Error during service image cleanup:', err);
      });
    }

    await prisma.service.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Service deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete service.' });
  }
};
