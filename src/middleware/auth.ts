import { Request as ExRequest, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// 1) Usamos el Request de express, no el global del DOM
export interface AuthRequest extends ExRequest {
  userId?: number;
}

// 2) Firmamos la función con la misma firma que espera Express
export function authenticate(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const header = req.headers.authorization;
  if (!header) {
    res.status(401).json({ message: 'No token' });
    return;
  }
  const [, token] = header.split(' ');

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as {
      userId: number;
      email: string;
    };
    req.userId = payload.userId;  // ya es AuthRequest
    next();
  } catch {
    res.status(401).json({ message: 'Token inválido' });
    return;
  }
}
