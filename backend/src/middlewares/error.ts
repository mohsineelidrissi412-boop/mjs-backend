import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
}

export const errorHandler = (
  err: AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Erreur serveur interne.';

  console.error(`[error] ${req.method} ${req.path} → ${statusCode}: ${message}`);

  return res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export const notFound = (req: Request, res: Response) => {
  return res.status(404).json({
    success: false,
    message: `Route non trouvée : ${req.method} ${req.originalUrl}`
  });
};
