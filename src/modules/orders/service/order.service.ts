import { randomUUID } from 'crypto';
import { Order } from '../domain/order.entity.js';
import { CreateOrderDTO } from '../dtos/create-order.dto.js';
import { PrismaOrderRepository } from '../repository/order.repository.js';
import { AppError } from '../../../core/app-error.js';

export class OrderService {
  constructor(private readonly orderRepository: PrismaOrderRepository) {}

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      throw new AppError('Sipariş toplam tutarı geçersiz.', 400);
    }

    const newOrder: Order = {
      id: randomUUID(),
      userId: dto.userId,
      items: dto.items,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'PENDING',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return await this.orderRepository.create(newOrder.userId, newOrder.items);
  }

  async getOrderById(id: string): Promise<Order> {
    const order = await this.orderRepository.findById(id);
    if (!order) {
      throw new AppError(`ID numarası '${id}' olan sipariş bulunamadı.`, 404);
    }
    return order;
  }
}