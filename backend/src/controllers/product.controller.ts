import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';

// ═══════════════════════════════════════════════════════════════════════════════
// PUBLIC ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getPublicProducts = async (_req: Request, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

export const getPublicProductBySlug = async (req: Request, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findFirst({ where: { slug: req.params.slug } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN ROUTES
// ═══════════════════════════════════════════════════════════════════════════════

export const getAllProducts = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: 'desc' } });
    res.status(200).json({ success: true, data: products });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch products.' });
  }
};

export const getProductById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const product = await prisma.product.findUnique({ where: { id: req.params.id } });
    if (!product) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    res.status(200).json({ success: true, data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch product.' });
  }
};

export const createProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, slug, shortDescription, description, productImage, gallery, features, benefits, technology, status, demoUrl, ctaText, seoTitle, seoDescription } = req.body;

    if (!name || !slug || !shortDescription || !description || !productImage) {
      res.status(400).json({ success: false, message: 'Name, slug, shortDescription, description, and productImage are required.' });
      return;
    }

    const existing = await prisma.product.findUnique({ where: { slug } });
    if (existing) {
      res.status(409).json({ success: false, message: 'A product with this slug already exists.' });
      return;
    }

    const product = await prisma.product.create({
      data: {
        name, slug, shortDescription, description, productImage,
        gallery: gallery || [],
        features: features || [],
        benefits: benefits || [],
        technology: technology || [],
        status: status || 'COMING_SOON',
        demoUrl: demoUrl || null,
        ctaText: ctaText || 'Learn More',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
      },
    });
    res.status(201).json({ success: true, message: 'Product created.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to create product.' });
  }
};

export const updateProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }

    if (req.body.slug && req.body.slug !== existing.slug) {
      const slugExists = await prisma.product.findUnique({ where: { slug: req.body.slug } });
      if (slugExists) {
        res.status(409).json({ success: false, message: 'A product with this slug already exists.' });
        return;
      }
    }

    const product = await prisma.product.update({ where: { id }, data: req.body });
    res.status(200).json({ success: true, message: 'Product updated.', data: product });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update product.' });
  }
};

export const deleteProduct = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const existing = await prisma.product.findUnique({ where: { id } });
    if (!existing) {
      res.status(404).json({ success: false, message: 'Product not found.' });
      return;
    }
    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};
