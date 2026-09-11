import { PrismaClient, OrderStatus } from '@prisma/client';

export interface CreateOrderItemInput {
  productId: string;
  quantity: number;
  unitPrice: number;
}

export class PrismaOrderRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: string) {
    return await this.prisma.order.findUnique({
      where: { id },
      include: {
        items: true,
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
  }

  async updateStatus(id: string, status: OrderStatus) {
    return await this.prisma.order.update({
      where: { id },
      data: { status },
      include: {
        items: true,
      },
    });
  }

  async findAll(params: { skip: number; take: number; status?: OrderStatus }) {
    const { skip, take, status } = params;
    const where = status ? { status } : {};

    const [total, orders] = await Promise.all([
      this.prisma.order.count({ where }),
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          items: true,
          user: {
            select: { id: true, email: true },
          },
        },
      }),
    ]);

    return { total, orders };
  }

  async createWithStockCheck(
    userId: string,
    items: CreateOrderItemInput[],
    totalAmount: number
  ) {
    return await this.prisma.$transaction(async (tx) => {
      // 1. Stok kontrolü ve atomik düşüş
      for (const item of items) {
        const product = await (tx as any).product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`PRODUCT_NOT_FOUND:${item.productId}`);
        }

        if (product.stock < item.quantity) {
          throw new Error(`INSUFFICIENT_STOCK:${product.name}`);
        }

        await (tx as any).product.update({
          where: { id: item.productId },
          data: {
            stock: {
              decrement: item.quantity,
            },
          },
        });
      }

      // 2. Siparişi oluştur
      return await tx.order.create({
        data: {
          userId,
          totalAmount,
          status: 'PENDING',
          items: {
            create: items.map((i) => ({
              productId: i.productId,
              quantity: i.quantity,
              unitPrice: i.unitPrice,
            })),
          },
        },
        include: {
          items: true,
        },
      });
    });
  }
}