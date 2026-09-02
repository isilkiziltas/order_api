import express, { Express, Request, Response, NextFunction } from 'express';
import { AppError } from './core/app-error.js';
import { orderRouter } from './modules/orders/routes.js';

export const app: Express = express();

// 1. Body Parser
app.use(express.json());

// 2. Healthcheck Route
app.get('/api/v1/health', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// 3. Domain Rotaları
app.use('/api/v1/orders', orderRouter);

// 4. 404 Handler (Tanımsız Rotalar İçin)
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Bu sunucuda '${req.originalUrl}' endpoint'i bulunamadı.`, 404));
});

// 5. Global Error Handler (Her zaman en altta tek bir tane olmalı)
app.use((err: Error | AppError, _req: Request, res: Response, _next: NextFunction) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      status: 'error',
      statusCode: err.statusCode,
      message: err.message,
    });
    return;
  }

  console.error('💥 Kritik Sistem Hatası:', err);
  res.status(500).json({
    status: 'error',
    statusCode: 500,
    message: 'Sunucuda beklenmeyen bir hata meydana geldi.',
  });
});