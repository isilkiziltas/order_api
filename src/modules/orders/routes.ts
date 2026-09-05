import { Router } from 'express';
import { OrderController } from './controller/order.controller.js';
import { OrderService } from './service/order.service.js';
import { PrismaOrderRepository } from './repository/order.repository.js';
import { authenticate, authorize } from '../../middlewares/auth.middleware.js';

const orderRepository = new PrismaOrderRepository();
const orderService = new OrderService(orderRepository);
const orderController = new OrderController(orderService);

export const orderRouter = Router();

// Bu rotanın altındaki tüm sipariş işlemleri token gerektirir
orderRouter.use(authenticate);

orderRouter.post('/', orderController.createOrder);
orderRouter.get('/:id', orderController.getOrderById);

orderRouter.patch('/:id/status', authorize('ADMIN'), orderController.updateStatus);