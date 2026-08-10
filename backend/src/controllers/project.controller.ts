import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { deleteFileFromStorage } from '../utils/storage';

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getPublicProjects = async (_req: Request, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({
      where: { status: 'PUBLISHED' },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

export const getPublicProjectBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
    });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllProjects = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const projects = await prisma.project.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch projects.' });
  }
};

export const getProjectById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const project = await prisma.project.findUnique({ where: { id: req.params.id } });
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.status(200).json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch project.' });
  }
};

export const createProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      title, slug, description, coverImage, gallery, technology, category, status,
      seoTitle, seoDescription, serviceId, liveUrl, githubUrl,
      projectType, projectOverview, challenge, solution,
      keyFeatures, servicesDelivered, projectGallery, projectOutcome
    } = req.body;

    if (!title || !slug || !description || !category) {
      res.status(400).json({ success: false, message: 'Title, slug, description, and category are required.' });
      return;
    }

    const existing = await prisma.project.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'A project with this slug already exists.' });
      return;
    }

    const project = await prisma.project.create({
      data: {
        title, slug, description, category,
        coverImage: coverImage || null,
        gallery: gallery || [],
        technology: technology || [],
        status: status || 'DRAFT',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        serviceId: serviceId || null,
        liveUrl: liveUrl || null,
        githubUrl: githubUrl || null,
        projectType: projectType || 'CLIENT_PROJECT',
        projectOverview: projectOverview || null,
        challenge: challenge || null,
        solution: solution || null,
        keyFeatures: keyFeatures || [],
        servicesDelivered: servicesDelivered || [],
        projectGallery: projectGallery || [],
        projectOutcome: projectOutcome || [],
      },
    });
    res.status(201).json({ success: true, message: 'Project created.', data: project });
  } catch (error) {
    console.error('Failed to create project:', error);
    res.status(500).json({ success: false, message: 'Failed to create project.' });
  }
};

export const updateProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = await prisma.project.findUnique({ where: { slug: req.body.slug } });
      if (slugExists) {
        res.status(409).json({ success: false, message: 'A project with this slug already exists.' });
        return;
      }
    }

    const cleanupPromises: Promise<void>[] = [];

    // Clean up replaced coverImage asynchronously
    if (req.body.coverImage !== undefined && existing.coverImage && existing.coverImage !== req.body.coverImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.coverImage));
    }

    // Clean up gallery images that were in existing but are not in req.body.gallery
    if (req.body.gallery !== undefined && existing.gallery && Array.isArray(existing.gallery)) {
      const newGallery = Array.isArray(req.body.gallery) ? req.body.gallery : [];
      existing.gallery.forEach(img => {
        if (!newGallery.includes(img as string)) {
          cleanupPromises.push(deleteFileFromStorage(img as string));
        }
      });
    }

    // Clean up projectGallery images that were in existing but are not in req.body.projectGallery
    if (req.body.projectGallery !== undefined && existing.projectGallery) {
      const oldGallery = Array.isArray(existing.projectGallery) ? (existing.projectGallery as any[]) : [];
      const newGallery = Array.isArray(req.body.projectGallery) ? (req.body.projectGallery as any[]) : [];
      const newUrls = newGallery.map(img => img.url).filter(Boolean);
      
      oldGallery.forEach(img => {
        if (img && img.url && !newUrls.includes(img.url)) {
          cleanupPromises.push(deleteFileFromStorage(img.url));
        }
      });
    }

    if (cleanupPromises.length > 0) {
      Promise.all(cleanupPromises).catch(err => {
        console.error('Error during project images update cleanup:', err);
      });
    }

    const project = await prisma.project.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Project updated.', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update project.' });
  }
};

export const deleteProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.project.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    // Clean up gallery and cover images from storage asynchronously
    const cleanupPromises: Promise<void>[] = [];
    
    if (existing.coverImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.coverImage));
    }

    if (existing.gallery && Array.isArray(existing.gallery)) {
      existing.gallery.forEach(img => {
        cleanupPromises.push(deleteFileFromStorage(img as string));
      });
    }

    if (existing.projectGallery && Array.isArray(existing.projectGallery)) {
      (existing.projectGallery as any[]).forEach(img => {
        if (img && img.url) {
          cleanupPromises.push(deleteFileFromStorage(img.url));
        }
      });
    }

    if (cleanupPromises.length > 0) {
      Promise.all(cleanupPromises).catch(err => {
        console.error('Error during project images cleanup:', err);
      });
    }

    await prisma.project.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};
