import { Request, Response, NextFunction } from 'express';

interface OrderService {
  createOrder(input: { userId: string; items: unknown }): Promise<unknown>;
  getAllOrders(input: {
    page: number;
    limit: number;
    status?: OrderStatus;
  }): Promise<unknown>;
  getOrderById(id: string, requester: { userId: string; role: unknown }): Promise<unknown>;
  updateOrderStatus(id: string, status: OrderStatus): Promise<unknown>;
}

// The order entity module is not available in this module's current layout.
type OrderStatus = any;
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  // POST /orders
  createOrder = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user.id;
      const order = await this.orderService.createOrder({
        userId,
        items: req.body.items,
      });

      res.status(201).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /orders (Admin için Sayfalamalı & Filtreli Listeleme)
  getAllOrders = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
      const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 10;
      const status = req.query.status as OrderStatus | undefined;

      const result = await this.orderService.getAllOrders({
        page,
        limit,
        status,
      });

      res.status(200).json({
        status: 'success',
        data: result,
      });
    } catch (error) {
      next(error);
    }
  };

  // GET /orders/:id
  getOrderById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const requester = {
        userId: (req as any).user.id,
        role: (req as any).user.role,
      };

      const order = await this.orderService.getOrderById(id, requester);

      res.status(200).json({
        status: 'success',
        data: { order },
      });
    } catch (error) {
      next(error);
    }
  };

  // PATCH /orders/:id/status
  updateOrderStatus = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const updatedOrder = await this.orderService.updateOrderStatus(id, status as OrderStatus);

      res.status(200).json({
        status: 'success',
        data: { order: updatedOrder },
      });
    } catch (error) {
      next(error);
    }
  };
}