import { prisma } from '../../../lib/prisma.js';
import { Order, OrderStatus } from '@prisma/client';

export class PrismaOrderRepository {
  
  async create(userId: string, items: { productId: string; quantity: number; unitPrice: number }[]) {
    const totalAmount = items.reduce((total, item) => total + (item.quantity * item.unitPrice), 0);

    const order = await prisma.order.create({
      data: {
        userId,
        totalAmount,
        items: {
          create: items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    return order;
  }

  async findById(orderId: string) {
    return await prisma.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });
  }

  async findAll() {
    return await prisma.order.findMany({
      include: { items: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateStatus(id: string, status: OrderStatus): Promise<Order> {
    return await prisma.order.update({
      where: { id },
      data: { status },
      include: { items: true },
    });
  }
}