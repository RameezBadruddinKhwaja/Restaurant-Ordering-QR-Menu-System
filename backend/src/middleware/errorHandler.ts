import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import logger from '../utils/logger';
import { Prisma } from '@prisma/client';

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  logger.error('Error:', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Handle Prisma errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      res.status(409).json({
        success: false,
        message: 'Duplicate entry. Resource already exists.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
      return;
    }

    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Resource not found.',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined,
      });
      return;
    }
  }

  // Handle custom AppError
  if (err instanceof AppError) {
    const response: any = {
      success: false,
      message: err.message,
    };

    if ('errors' in err && err.errors) {
      response.errors = err.errors;
    }

    res.status(err.statusCode).json(response);
    return;
  }

  // Handle JWT errors
  if (err.name === 'JsonWebTokenError') {
    res.status(401).json({
      success: false,
      message: 'Invalid token',
    });
    return;
  }

  if (err.name === 'TokenExpiredError') {
    res.status(401).json({
      success: false,
      message: 'Token expired',
    });
    return;
  }

  // Handle validation errors
  if (err.name === 'ValidationError') {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: err.message,
    });
    return;
  }

  // Default internal server error
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
};

export const notFoundHandler = (req: Request, res: Response): void => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
  });
};
