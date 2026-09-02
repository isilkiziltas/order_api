import { Request, Response, NextFunction } from 'express';
import { OrderService } from '../service/order.service.js';
import { CreateOrderDTO } from '../dtos/create-order.dto.js';
import { AppError } from '../../../core/app-error.js';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  create = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const order = await this.orderService.createOrder(req.body as CreateOrderDTO);
      res.status(201).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  getById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;

      if (!id || typeof id !== 'string') {
        throw new AppError('Geçersiz sipariş ID parametresi.', 400);
      }

      const order = await this.orderService.getOrderById(id);
      res.status(200).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };
}