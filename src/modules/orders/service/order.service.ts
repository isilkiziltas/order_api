import { randomUUID } from 'crypto';
import { CreateOrderDTO } from '../dtos/create-order.dto.js';
import { PrismaOrderRepository } from '../repository/order.repository.js';
import { AppError } from '../../../core/app-error.js';
import { Order, OrderStatus } from '../domain/order.entity.js';

export class OrderService {
  constructor(private readonly orderRepository: PrismaOrderRepository) {}

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      throw new AppError('Sipariş toplam tutarı geçersiz.', 400);
    }

    const newOrder = {
      id: randomUUID(),
      userId: dto.userId,
      items: dto.items,
      totalAmount: Number(totalAmount.toFixed(2)),
      status: 'PENDING' as OrderStatus,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const createdOrder = await this.orderRepository.create(newOrder.userId, newOrder.items);
    return createdOrder as unknown as Order;
  }

  async updateOrderStatus(id: string, newStatus: OrderStatus): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError(`ID numarası '${id}' olan sipariş bulunamadı.`, 404);
    }

    if (order.status === 'CANCELLED') {
      throw new AppError('İptal edilmiş bir siparişin durumu güncellenemez.', 400);
    }

    return (await this.orderRepository.updateStatus(id, newStatus as any)) as unknown as Order;
  }

  async getOrderById(id: string, requester: { userId: string; role: string }): Promise<Order> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new AppError(`ID numarası '${id}' olan sipariş bulunamadı.`, 404);
    }

    if (requester.role !== 'ADMIN' && order.userId !== requester.userId) {
      throw new AppError('Bu siparişi görüntülemek için yetkiniz yok.', 403);
    }

    return order as unknown as Order;
  }
}