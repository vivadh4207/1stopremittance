import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import { Prisma } from '@prisma/client';
import { JsonWebTokenError, TokenExpiredError } from 'jsonwebtoken';
import { logger } from '../utils/logger';
import { sendError } from '../utils/apiResponse';

export function errorHandler(
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next: NextFunction,
): void {
  logger.error('Unhandled error', {
    message: err.message,
    stack: err.stack,
    path: req.path,
    method: req.method,
  });

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[]) || [];
      sendError(res, `A record with this ${fields.join(', ')} already exists`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
    if (err.code === 'P2003') {
      sendError(res, 'Related record not found', 400);
      return;
    }
    sendError(res, 'Database error', 500);
    return;
  }

  // Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    sendError(res, 'Invalid data provided', 400);
    return;
  }

  // Zod validation error
  if (err instanceof ZodError) {
    const errors: Record<string, string[]> = {};
    err.issues.forEach((issue) => {
      const path = issue.path.join('.');
      if (!errors[path]) errors[path] = [];
      errors[path].push(issue.message);
    });
    sendError(res, 'Validation failed', 422, errors);
    return;
  }

  // JWT errors
  if (err instanceof TokenExpiredError) {
    sendError(res, 'Token expired', 401);
    return;
  }
  if (err instanceof JsonWebTokenError) {
    sendError(res, 'Invalid token', 401);
    return;
  }

  // Custom AppError
  if ((err as AppError).statusCode) {
    const appError = err as AppError;
    sendError(res, appError.message, appError.statusCode);
    return;
  }

  // Default internal server error
  sendError(
    res,
    process.env['NODE_ENV'] === 'production' ? 'Internal server error' : err.message,
    500,
  );
}

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
  ) {
    super(message);
    this.name = 'AppError';
    Error.captureStackTrace(this, this.constructor);
  }
}
