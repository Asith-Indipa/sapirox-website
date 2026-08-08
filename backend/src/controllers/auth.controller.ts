import { Response } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../config/prisma';
import { supabase } from '../config/supabase';
import { AuthRequest } from '../middlewares/auth';

/**
 * POST /api/auth/login
 * Authenticates admin user via Supabase Auth, then issues a JWT.
 */
export const login = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ success: false, message: 'Email and password are required.' });
      return;
    }

    // 1. Authenticate via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError || !authData.user) {
      res.status(401).json({ success: false, message: 'Invalid email or password.' });
      return;
    }

    // 2. Check if user exists in our DB with an admin role
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // First-time admin login — create user record linked to Supabase auth ID
      user = await prisma.user.create({
        data: {
          id: authData.user.id, // Use Supabase auth user ID
          email: authData.user.email!,
          role: 'EDITOR', // Default role; promote via DB manually
        },
      });
    }

    // 3. Verify the user has admin-level access
    if (!['SUPER_ADMIN', 'ADMIN', 'EDITOR'].includes(user.role)) {
      res.status(403).json({ success: false, message: 'Access denied. Not an admin user.' });
      return;
    }

    // 4. Generate JWT
    const secret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '7d';

    if (!secret) {
      res.status(500).json({ success: false, message: 'Server configuration error.' });
      return;
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      secret,
      { expiresIn: expiresIn as jwt.SignOptions['expiresIn'] }
    );

    res.status(200).json({
      success: true,
      message: 'Login successful.',
      data: {
        token,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    res.status(500).json({ success: false, message: 'Login failed. Please try again.' });
  }
};

/**
 * GET /api/auth/me
 * Returns the currently authenticated user's profile.
 * Requires: authenticate middleware
 */
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated.' });
      return;
    }

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, role: true, createdAt: true },
    });

    if (!user) {
      res.status(404).json({ success: false, message: 'User not found.' });
      return;
    }

    res.status(200).json({
      success: true,
      message: 'User profile retrieved.',
      data: { user },
    });
  } catch (error) {
    console.error('❌ GetMe error:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve profile.' });
  }
};

/**
 * POST /api/auth/logout
 * Logs out the user from Supabase session.
 * JWT is stateless, so client should discard the token.
 */
export const logout = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    // Sign out from Supabase (invalidates Supabase session, not JWT)
    await supabase.auth.signOut();

    res.status(200).json({
      success: true,
      message: 'Logged out successfully. Please discard your token.',
    });
  } catch (error) {
    console.error('❌ Logout error:', error);
    res.status(500).json({ success: false, message: 'Logout failed.' });
  }
};
