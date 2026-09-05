import { errorHandler } from './middlewares/error.middleware.js';
import express, { Express, Request, Response, NextFunction } from 'express';
import { AppError } from './core/app-error.js';
import { orderRouter } from './modules/orders/routes.js';
import { authRouter } from './modules/auth/routes.js';


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
app.get('/', (_req: Request, res: Response) => {
  res.status(200).json({
    status: 'success',
    message: 'Enterprise Order API servisi ayakta.',
  });
});

// 3. Domain Rotaları
app.use('/api/v1/orders', orderRouter);
// Domain rotalarının arasına ekle:
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/orders', orderRouter);
// 4. 404 Handler (Tanımsız Rotalar İçin)
app.use((req: Request, _res: Response, next: NextFunction) => {
  next(new AppError(`Bu sunucuda '${req.originalUrl}' endpoint'i bulunamadı.`, 404));
});

// 5. Global Error Handler (Her zaman en altta tek bir tane olmalı)
app.use(errorHandler);
