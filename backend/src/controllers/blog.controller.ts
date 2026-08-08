import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getPublicBlogs = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, tag, page = '1', limit = '10' } = req.query;
    const skip = (Number(page) - 1) * Number(limit);

    const where: Record<string, unknown> = { status: 'PUBLISHED' };
    if (category) where.category = { slug: category as string };
    if (tag) where.tags = { some: { slug: tag as string } };

    const [blogs, total] = await Promise.all([
      prisma.blog.findMany({
        where,
        include: {
          category: { select: { id: true, name: true, slug: true } },
          tags: { select: { id: true, name: true, slug: true } },
          author: { select: { id: true, email: true } },
        },
        orderBy: { publishedDate: 'desc' },
        skip,
        take: Number(limit),
      }),
      prisma.blog.count({ where }),
    ]);

    res.status(200).json({
      success: true,
      data: blogs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs.' });
  }
};

export const getPublicBlogBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const blog = await prisma.blog.findFirst({
      where: { slug: req.params.slug, status: 'PUBLISHED' },
      include: {
        category: { select: { id: true, name: true, slug: true } },
        tags: { select: { id: true, name: true, slug: true } },
        author: { select: { id: true, email: true } },
      },
    });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found.' });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllBlogs = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blogs = await prisma.blog.findMany({
      include: {
        category: { select: { id: true, name: true } },
        tags: { select: { id: true, name: true } },
        author: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ success: true, data: blogs });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blogs.' });
  }
};

export const getBlogById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const blog = await prisma.blog.findUnique({
      where: { id: req.params.id },
      include: { category: true, tags: true, author: { select: { id: true, email: true } } },
    });
    if (!blog) {
      res.status(404).json({ success: false, message: 'Blog not found.' });
      return;
    }
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch blog.' });
  }
};

export const createBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, slug, coverImage, content, categoryId, tagIds, status, publishedDate, seoTitle, seoDescription, ogImage } = req.body;

    if (!title || !slug || !coverImage || !content || !categoryId) {
      res.status(400).json({ success: false, message: 'Title, slug, coverImage, content, and categoryId are required.' });
      return;
    }

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'A blog with this slug already exists.' });
      return;
    }

    const blog = await prisma.blog.create({
      data: {
        title, slug, coverImage, content, categoryId,
        authorId: req.user!.id,
        tags: tagIds ? { connect: tagIds.map((id: string) => ({ id })) } : undefined,
        status: status || 'DRAFT',
        publishedDate: status === 'PUBLISHED' ? (publishedDate || new Date()) : null,
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        ogImage: ogImage || null,
      },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create blog.' });
  }
};

export const updateBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Blog not found.' });
      return;
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = await prisma.blog.findUnique({ where: { slug: req.body.slug } });
      if (slugExists) {
        res.status(409).json({ success: false, message: 'A blog with this slug already exists.' });
        return;
      }
    }

    const { tagIds, ...rest } = req.body;
    const updateData: Record<string, unknown> = { ...rest };
    if (tagIds) {
      updateData.tags = { set: tagIds.map((id: string) => ({ id })) };
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update blog.' });
  }
};

export const deleteBlog = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.blog.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Blog not found.' });
      return;
    }
    await prisma.blog.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Blog deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog.' });
  }
};
