import { Request, Response, NextFunction } from 'express';

export function errorHandler(
  err: Error & { statusCode?: number },
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err);
  res.status(err.statusCode || 500).json({
    message: err.message || 'Error interno del servidor',
  });
}
