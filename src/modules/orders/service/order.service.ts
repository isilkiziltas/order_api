import { CreateOrderDTO } from '../dtos/create-order.dto.js';
import { PrismaOrderRepository } from '../repository/order.repository.js';
import { AppError } from '../../../core/app-error.js';
import { Order } from '../domain/order.entity.js';
import { OrderStatus } from '@prisma/client';

export interface ListOrdersParams {
  page: number;
  limit: number;
  status?: OrderStatus;
}

export class OrderService {
  constructor(private readonly orderRepository: PrismaOrderRepository) {}

  async createOrder(dto: CreateOrderDTO): Promise<Order> {
    const totalAmount = dto.items.reduce((sum, item) => {
      return sum + item.unitPrice * item.quantity;
    }, 0);

    if (totalAmount <= 0) {
      throw new AppError('Sipariş toplam tutarı geçersiz.', 400);
    }

    try {
      const createdOrder = await this.orderRepository.createWithStockCheck(
        dto.userId,
        dto.items,
        Number(totalAmount.toFixed(2))
      );
      return createdOrder as unknown as Order;
    } catch (error: any) {
      if (error.message?.startsWith('PRODUCT_NOT_FOUND:')) {
        const productId = error.message.split(':')[1];
        throw new AppError(`ID'si '${productId}' olan ürün bulunamadı.`, 404);
      }
      if (error.message?.startsWith('INSUFFICIENT_STOCK:')) {
        const productName = error.message.split(':')[1];
        throw new AppError(`'${productName}' için yetersiz stok.`, 400);
      }
      throw error;
    }
  }

  async getAllOrders(params: ListOrdersParams) {
    const { page, limit, status } = params;
    const skip = (page - 1) * limit;

    const { total, orders } = await this.orderRepository.findAll({
      skip,
      take: limit,
      status: status as OrderStatus,
    });

    return {
      orders: orders as unknown as Order[],
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
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