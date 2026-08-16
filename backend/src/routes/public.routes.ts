import { Router } from 'express';
import { getPublicServices, getPublicServiceBySlug } from '../controllers/service.controller';
import { getPublicProducts, getPublicProductBySlug } from '../controllers/product.controller';
import { getPublicProjects, getPublicProjectBySlug } from '../controllers/project.controller';
import { getPublicBlogs, getPublicBlogBySlug } from '../controllers/blog.controller';
import { submitContactMessage, getPublicTestimonials, getCategories, getTags, getSeoByPath, getPageContent } from '../controllers/general.controller';

const router = Router();

// ── Services ────────────────────────────────────────────────────────────────────
router.get('/services', getPublicServices);
router.get('/services/:slug', getPublicServiceBySlug);

// ── Products ────────────────────────────────────────────────────────────────────
router.get('/products', getPublicProducts);
router.get('/products/:slug', getPublicProductBySlug);

// ── Portfolio / Projects ────────────────────────────────────────────────────────
router.get('/portfolio', getPublicProjects);
router.get('/portfolio/:slug', getPublicProjectBySlug);

// ── Blog ────────────────────────────────────────────────────────────────────────
router.get('/blogs', getPublicBlogs);
router.get('/blogs/:slug', getPublicBlogBySlug);

// ── Blog Taxonomy ───────────────────────────────────────────────────────────────
router.get('/categories', getCategories);
router.get('/tags', getTags);

// ── Testimonials ────────────────────────────────────────────────────────────────
router.get('/testimonials', getPublicTestimonials);

// ── Contact ─────────────────────────────────────────────────────────────────────
router.post('/contact', submitContactMessage);

// ── Page Content ────────────────────────────────────────────────────────────────
router.get('/page-content/:pageName', getPageContent);

// ── SEO ─────────────────────────────────────────────────────────────────────────
router.get('/seo/:path', getSeoByPath);

export default router;
