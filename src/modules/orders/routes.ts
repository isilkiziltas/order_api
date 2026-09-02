import { Router } from 'express';
import { PrismaOrderRepository } from './repository/order.repository.js';
import { OrderService } from './service/order.service.js';
import { OrderController } from './controller/order.controller.js';
import { validateRequest } from '../../middlewares/validate.middleware.js';
import { createOrderSchema } from './dtos/create-order.dto.js';

export const orderRouter = Router();

const orderRepository = new PrismaOrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

orderRouter.post(
  '/',
  validateRequest({ body: createOrderSchema }),
  orderController.create
);

orderRouter.get('/:id', orderController.getById);