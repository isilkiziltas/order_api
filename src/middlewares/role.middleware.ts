import { Request, Response, NextFunction } from 'express';
import { AppError } from '../core/app-error.js';

export const authorize = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = (req as any).user;

    if (!user) {
      return next(new AppError('Yetkilendirme başarısız: Kullanıcı oturumu bulunamadı.', 401));
    }

    if (!allowedRoles.includes(user.role)) {
      return next(new AppError('Bu işlem için yetkiniz bulunmuyor.', 403));
    }

    next();
  };
};