import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AuthRequest } from '../middlewares/auth';
import { deleteFileFromStorage } from '../utils/storage';

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
    const {
      name, slug, category, shortDescription, description, productImage, gallery,
      screenshots, features, benefits, targetUsers, howItWorks, technology, integrations,
      status, demoUrl, ctaText, seoTitle, seoDescription, showOnHomepage
    } = req.body;

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
        name, slug,
        category: category || 'Other',
        shortDescription, description, productImage,
        screenshots: screenshots || [],
        features: features || [],
        benefits: benefits || [],
        targetUsers: targetUsers || [],
        howItWorks: howItWorks || [],
        technology: technology || [],
        integrations: integrations || [],
        status: status || 'COMING_SOON',
        demoUrl: demoUrl || null,
        ctaText: ctaText || 'Learn More',
        seoTitle: seoTitle || null,
        seoDescription: seoDescription || null,
        gallery: gallery || [],
        showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : true,
      },
    });
    res.status(201).json({ success: true, message: 'Product created.', data: product });
  } catch (error) {
    console.error('Create product error:', error);
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

    const {
      name, slug, category, shortDescription, description, productImage, gallery,
      screenshots, features, benefits, targetUsers, howItWorks, technology, integrations,
      status, demoUrl, ctaText, seoTitle, seoDescription, showOnHomepage
    } = req.body;

    // Clean up replaced images asynchronously
    const cleanupPromises: Promise<void>[] = [];

    // 1. Check if main productImage is changed/replaced
    if (productImage !== undefined && existing.productImage && existing.productImage !== productImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.productImage));
    }

    // 2. Check screenshots that were in existing but are not in req.body.screenshots
    if (screenshots !== undefined && existing.screenshots && Array.isArray(existing.screenshots)) {
      const newScreenshotUrls = (Array.isArray(screenshots) ? screenshots : [])
        .map((s: any) => s?.imageUrl)
        .filter(url => typeof url === 'string' && url.length > 0);

      existing.screenshots.forEach((s: any) => {
        const oldUrl = s?.imageUrl;
        if (typeof oldUrl === 'string' && oldUrl.length > 0 && !newScreenshotUrls.includes(oldUrl)) {
          cleanupPromises.push(deleteFileFromStorage(oldUrl));
        }
      });
    }

    // 3. Check gallery images that were in existing but are not in req.body.gallery
    if (gallery !== undefined && existing.gallery && Array.isArray(existing.gallery)) {
      const newGallery = Array.isArray(gallery) ? gallery : [];
      existing.gallery.forEach(img => {
        if (!newGallery.includes(img as string)) {
          cleanupPromises.push(deleteFileFromStorage(img as string));
        }
      });
    }

    if (cleanupPromises.length > 0) {
      Promise.all(cleanupPromises).catch(err => {
        console.error('Error during product image updates cleanup:', err);
      });
    }

    const product = await prisma.product.update({
      where: { id },
      data: {
        name, slug, category, shortDescription, description, productImage,
        screenshots: screenshots !== undefined ? screenshots : undefined,
        features: features !== undefined ? features : undefined,
        benefits: benefits !== undefined ? benefits : undefined,
        targetUsers: targetUsers !== undefined ? targetUsers : undefined,
        howItWorks: howItWorks !== undefined ? howItWorks : undefined,
        technology: technology !== undefined ? technology : undefined,
        integrations: integrations !== undefined ? integrations : undefined,
        status, demoUrl, ctaText, seoTitle, seoDescription,
        gallery: gallery !== undefined ? gallery : undefined,
        showOnHomepage: showOnHomepage !== undefined ? Boolean(showOnHomepage) : undefined,
      }
    });
    res.status(200).json({ success: true, message: 'Product updated.', data: product });
  } catch (error) {
    console.error('Update product error:', error);
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

    // Clean up images from storage asynchronously (so database delete is not blocked)
    const cleanupPromises: Promise<void>[] = [];
    
    if (existing.productImage) {
      cleanupPromises.push(deleteFileFromStorage(existing.productImage));
    }
    
    if (existing.screenshots && Array.isArray(existing.screenshots)) {
      existing.screenshots.forEach((s: any) => {
        if (s?.imageUrl && typeof s.imageUrl === 'string') {
          cleanupPromises.push(deleteFileFromStorage(s.imageUrl));
        }
      });
    }
    
    if (existing.gallery && Array.isArray(existing.gallery)) {
      existing.gallery.forEach(img => {
        cleanupPromises.push(deleteFileFromStorage(img as string));
      });
    }

    // Run cleanup asynchronously
    Promise.all(cleanupPromises).catch(err => {
      console.error('Error during product image cleanup:', err);
    });

    await prisma.product.delete({ where: { id } });
    res.status(200).json({ success: true, message: 'Product deleted.' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete product.' });
  }
};
