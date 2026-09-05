import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/app-error.js';
import { verifyToken } from '../core/utils/jwt.util.js';

export const authenticate = (req: Request, _res: Response, next: NextFunction): void => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Yetkilendirme başarısız. Lütfen geçerli bir token sağlayın.', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = verifyToken(token);
    req.user = decoded;
    next();
  } catch {
    throw new AppError('Geçersiz veya süresi dolmuş token.', 401);
  }
};

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      throw new AppError('Bu işlemi gerçekleştirmek için yetkiniz yok.', 403);
    }
    next();
  };
};