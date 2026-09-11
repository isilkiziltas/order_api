import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import { OrderController } from './controller/order.controller.js';
import { OrderService } from './service/order.service.js';
import { PrismaOrderRepository } from './repository/order.repository.js';
import { authenticate } from '../../middlewares/auth.middleware.js';
import { authorize } from '../../middlewares/role.middleware.js';

const prisma = new PrismaClient();
const orderRepository = new PrismaOrderRepository(prisma);
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

export const orderRouter = Router();

orderRouter.use(authenticate);

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/', authorize('ADMIN'), orderController.getAllOrders);
orderRouter.get('/:id', orderController.getOrderById);
orderRouter.patch('/:id/status', authorize('ADMIN'), orderController.updateOrderStatus);