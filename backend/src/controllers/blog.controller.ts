import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { deleteFileFromStorage } from '../utils/storage';

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
    const { 
      title, 
      slug, 
      coverImage, 
      coverImageAlt,
      excerpt,
      content, 
      categoryId, 
      tagIds, 
      status, 
      publishedDate, 
      featured,
      seoTitle, 
      seoDescription, 
      ogImage 
    } = req.body;

    // Resolve categoryId if category object is sent
    let resolvedCategoryId = categoryId;
    if (!resolvedCategoryId && req.body.category) {
      const { name, slug: catSlug } = req.body.category;
      if (name && catSlug) {
        const cat = await prisma.category.upsert({
          where: { slug: catSlug },
          update: { name },
          create: { name, slug: catSlug }
        });
        resolvedCategoryId = cat.id;
      }
    }

    if (!title || !slug || !coverImage || !content || !resolvedCategoryId) {
      res.status(400).json({ success: false, message: 'Title, slug, coverImage, content, and category are required.' });
      return;
    }

    const existing = await prisma.blog.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'A blog with this slug already exists.' });
      return;
    }

    // Resolve tag connections if tags array is sent
    let tagsConnect: any = undefined;
    if (tagIds && Array.isArray(tagIds)) {
      tagsConnect = { connect: tagIds.map((id: string) => ({ id })) };
    } else if (req.body.tags && Array.isArray(req.body.tags)) {
      const tagsToConnect = [];
      for (const t of req.body.tags) {
        if (t.name && t.slug) {
          const tag = await prisma.tag.upsert({
            where: { slug: t.slug },
            update: { name: t.name },
            create: { name: t.name, slug: t.slug }
          });
          tagsToConnect.push({ id: tag.id });
        }
      }
      tagsConnect = { connect: tagsToConnect };
    }

    // Automatically calculate reading time (approx. 200 words per minute)
    const wordsCount = content ? content.trim().split(/\s+/).filter((w: string) => w.length > 0).length : 0;
    const computedReadingTime = Math.ceil(wordsCount / 200) || 1;

    const blog = await prisma.blog.create({
      data: {
        title, 
        slug, 
        coverImage, 
        coverImageAlt: coverImageAlt || null,
        excerpt: excerpt || '',
        content, 
        categoryId: resolvedCategoryId,
        authorId: req.user!.id,
        tags: tagsConnect,
        status: status || 'DRAFT',
        publishedDate: status === 'PUBLISHED' ? (publishedDate || new Date()) : null,
        featured: featured === true || featured === 'true',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        ogImage: ogImage || null,
        readingTime: computedReadingTime,
      },
    });
    res.status(201).json({ success: true, data: blog });
  } catch (error) {
    console.error("Failed to create blog:", error);
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

    const { tagIds, category, ...rest } = req.body;

    // Clean up replaced images asynchronously
    const cleanupPromises: Promise<void>[] = [];

    if (rest.coverImage !== undefined && existing.coverImage && existing.coverImage !== rest.coverImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.coverImage));
    }

    if (rest.ogImage !== undefined && existing.ogImage && existing.ogImage !== rest.ogImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.ogImage));
    }

    if (cleanupPromises.length > 0) {
      Promise.all(cleanupPromises).catch(err => {
        console.error('Error during blog images update cleanup:', err);
      });
    }

    const updateData: Record<string, any> = { ...rest };

    if (rest.content) {
      const wordsCount = rest.content.trim().split(/\s+/).filter((w: string) => w.length > 0).length;
      updateData.readingTime = Math.ceil(wordsCount / 200) || 1;
    }

    if (rest.status === 'PUBLISHED') {
      if (!existing.publishedDate) {
        updateData.publishedDate = new Date();
      }
    } else if (rest.status === 'DRAFT') {
      updateData.publishedDate = null;
    }

    if (rest.featured !== undefined) {
      updateData.featured = rest.featured === true || rest.featured === 'true';
    }

    if (category) {
      const { name, slug: catSlug } = category;
      if (name && catSlug) {
        const cat = await prisma.category.upsert({
          where: { slug: catSlug },
          update: { name },
          create: { name, slug: catSlug }
        });
        updateData.categoryId = cat.id;
      }
    }

    if (tagIds && Array.isArray(tagIds)) {
      updateData.tags = { set: tagIds.map((id: string) => ({ id })) };
    } else if (req.body.tags && Array.isArray(req.body.tags)) {
      const tagsToConnect = [];
      for (const t of req.body.tags) {
        if (t.name && t.slug) {
          const tag = await prisma.tag.upsert({
            where: { slug: t.slug },
            update: { name: t.name },
            create: { name: t.name, slug: t.slug }
          });
          tagsToConnect.push({ id: tag.id });
        }
      }
      updateData.tags = { set: tagsToConnect };
    }

    const blog = await prisma.blog.update({
      where: { id },
      data: updateData,
    });
    res.status(200).json({ success: true, data: blog });
  } catch (error) {
    console.error("Failed to update blog:", error);
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

    // Clean up coverImage and ogImage from storage asynchronously
    const cleanupPromises: Promise<void>[] = [];
    
    if (existing.coverImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.coverImage));
    }
    
    if (existing.ogImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.ogImage));
    }

    Promise.all(cleanupPromises).catch(err => {
      console.error('Error during blog images cleanup:', err);
    });

    await prisma.blog.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Blog deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete blog.' });
  }
};
