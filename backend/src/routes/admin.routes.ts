import { Router } from 'express';
import { authenticate, authorize } from '../middlewares/auth';
import {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
} from '../controllers/service.controller';
import {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from '../controllers/product.controller';
import {
  getAllProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject,
} from '../controllers/project.controller';
import {
  getAllBlogs,
  getBlogById,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../controllers/blog.controller';
import {
  getAllMessages,
  updateMessageStatus,
  deleteMessage,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createCategory,
  deleteCategory,
  createTag,
  deleteTag,
  upsertSeoSetting,
  getDashboardStats,
} from '../controllers/general.controller';

const router = Router();

// Apply authenticate middleware to ALL admin routes
router.use(authenticate);

// ── Dashboard ──────────────────────────────────────────────────────────────────
router.get('/dashboard', getDashboardStats);

// ── Services CRUD ──────────────────────────────────────────────────────────────
router.get('/services', getAllServices);
router.get('/services/:id', getServiceById);
router.post('/services', authorize('SUPER_ADMIN', 'ADMIN'), createService);
router.put('/services/:id', authorize('SUPER_ADMIN', 'ADMIN'), updateService);
router.delete('/services/:id', authorize('SUPER_ADMIN'), deleteService);

// ── Products CRUD ──────────────────────────────────────────────────────────────
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.post('/products', authorize('SUPER_ADMIN', 'ADMIN'), createProduct);
router.put('/products/:id', authorize('SUPER_ADMIN', 'ADMIN'), updateProduct);
router.delete('/products/:id', authorize('SUPER_ADMIN'), deleteProduct);

// ── Projects / Portfolio CRUD ───────────────────────────────────────────────────
router.get('/portfolio', getAllProjects);
router.get('/portfolio/:id', getProjectById);
router.post('/portfolio', authorize('SUPER_ADMIN', 'ADMIN'), createProject);
router.put('/portfolio/:id', authorize('SUPER_ADMIN', 'ADMIN'), updateProject);
router.delete('/portfolio/:id', authorize('SUPER_ADMIN'), deleteProject);

// ── Blogs CRUD ─────────────────────────────────────────────────────────────────
router.get('/blogs', getAllBlogs);
router.get('/blogs/:id', getBlogById);
router.post('/blogs', createBlog); // Editors, Admins, SuperAdmins can write blogs
router.put('/blogs/:id', updateBlog);
router.delete('/blogs/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteBlog);

// ── Blog Taxonomy ──────────────────────────────────────────────────────────────
router.post('/categories', authorize('SUPER_ADMIN', 'ADMIN'), createCategory);
router.delete('/categories/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteCategory);
router.post('/tags', createTag);
router.delete('/tags/:id', authorize('SUPER_ADMIN', 'ADMIN'), deleteTag);

// ── Testimonials CRUD ──────────────────────────────────────────────────────────
router.post('/testimonials', authorize('SUPER_ADMIN', 'ADMIN'), createTestimonial);
router.put('/testimonials/:id', authorize('SUPER_ADMIN', 'ADMIN'), updateTestimonial);
router.delete('/testimonials/:id', authorize('SUPER_ADMIN'), deleteTestimonial);

// ── Contact Messages ───────────────────────────────────────────────────────────
router.get('/messages', authorize('SUPER_ADMIN', 'ADMIN'), getAllMessages);
router.patch('/messages/:id/status', authorize('SUPER_ADMIN', 'ADMIN'), updateMessageStatus);
router.delete('/messages/:id', authorize('SUPER_ADMIN'), deleteMessage);

import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { supabase } from '../config/supabase';

// Configure multer storage in memory
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|gif/;
    const mimeType = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    if (mimeType && extName) {
      return cb(null, true);
    }
    cb(new Error('Only images (JPEG, JPG, PNG, WEBP, GIF) are allowed.'));
  }
});

// ── File Upload Endpoint ────────────────────────────────────────────────────────
router.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, message: 'No file uploaded.' });
      return;
    }

    const file = req.file;
    const ext = path.extname(file.originalname);
    const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    const bucketName = 'sapirox-uploads';

    // 1. Try uploading to Supabase first if credentials exist
    if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
      try {
        const { data, error } = await supabase.storage
          .from(bucketName)
          .upload(fileName, file.buffer, {
            contentType: file.mimetype,
            cacheControl: '3600',
            upsert: false
          });

        if (!error) {
          const { data: publicUrlData } = supabase.storage
            .from(bucketName)
            .getPublicUrl(fileName);
          res.status(200).json({ success: true, url: publicUrlData.publicUrl });
          return;
        }
        console.warn('⚠️ Supabase upload failed, trying local upload fallback:', error);
      } catch (supabaseErr) {
        console.warn('⚠️ Supabase upload threw error, trying local upload fallback:', supabaseErr);
      }
    }

    // 2. Local fallback storage
    const uploadDir = path.join(__dirname, '../../uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    const localFilePath = path.join(uploadDir, fileName);
    fs.writeFileSync(localFilePath, file.buffer);

    // Return the relative URL (e.g. /uploads/123456.jpg)
    const relativeUrl = `/uploads/${fileName}`;
    res.status(200).json({ success: true, url: relativeUrl });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message || 'File upload failed.' });
  }
});

// ── SEO Settings ───────────────────────────────────────────────────────────────
router.post('/seo', authorize('SUPER_ADMIN', 'ADMIN'), upsertSeoSetting);

export default router;
