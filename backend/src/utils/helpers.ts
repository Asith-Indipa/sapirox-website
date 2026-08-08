import { Request, Response, NextFunction } from 'express';

// Generic async handler to avoid try/catch in every controller
export const asyncHandler = (fn: (req: Request, res: Response, next: NextFunction) => Promise<void>) =>
  (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };

// Standard API response helpers
export const sendSuccess = (res: Response, data: unknown, message = 'Success', statusCode = 200) => {
  res.status(statusCode).json({ success: true, message, data });
};

export const sendError = (res: Response, message = 'Something went wrong', statusCode = 500) => {
  res.status(statusCode).json({ success: false, message });
};
