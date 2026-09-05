import { Request, Response, NextFunction } from 'express';

type AppErrorLike = Error & {
  statusCode: number;
};

const isAppError = (err: Error): err is AppErrorLike =>
  typeof (err as Partial<AppErrorLike>).statusCode === 'number';

export const errorHandler = (
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      success: false,
      status: 'fail',
      message: err.message,
    });
    return;
  }

  // Bilinmeyen / yakalanmamış sistem hataları
  console.error('UNEXPECTED ERROR 💥:', err);
  res.status(500).json({
    success: false,
    status: 'error',
    message: 'Sunucu tarafında beklenmeyen bir hata oluştu.',
  });
};