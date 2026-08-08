import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';

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
    const { title, slug, description, gallery, technology, category, status, seoTitle, seoDescription } = req.body;

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
        gallery: gallery || [],
        technology: technology || [],
        status: status || 'DRAFT',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });
    res.status(201).json({ success: true, message: 'Project created.', data: project });
  } catch (error) {
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
    await prisma.project.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Project deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete project.' });
  }
};
