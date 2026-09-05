import { Request, Response } from 'express';
import { OrderService } from '../service/order.service.js';
import { catchAsync } from '../../../core/utils/catch-async.js';
import { AppError } from '../../../core/app-error.js';

export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  createOrder = catchAsync(async (req: Request, res: Response) => {
    const orderData = {
      ...req.body,
      userId: req.user!.userId,
    };

    const order = await this.orderService.createOrder(orderData);
    
    res.status(201).json({
      success: true,
      data: order,
    });
  });

 getOrderById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  // req.user bilgisini Service katmanına gönder
  const order = await this.orderService.getOrderById(id, req.user!);

  res.status(200).json({
    success: true,
    data: order,
  });
});
updateStatus = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;

  if (!status) {
    throw new AppError('Durum (status) alanı zorunludur.', 400);
  }

  const updatedOrder = await this.orderService.updateOrderStatus(id, status);

  res.status(200).json({
    success: true,
    data: updatedOrder,
  });
});
}