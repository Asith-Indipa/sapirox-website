import { Router } from 'express';
import { login, getMe, logout } from '../controllers/auth.controller';
import { authenticate } from '../middlewares/auth';

const router = Router();

// Public route — no token needed
router.post('/login', login);

// Protected routes — token required
router.get('/me', authenticate, getMe);
router.post('/logout', authenticate, logout);

export default router;
