export type OrderStatus = string;

export interface OrderItemEntity {
  id?: string;
  orderId?: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  createdAt?: Date;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus; // string yerine doğrudan OrderStatus enum'ı
  items: OrderItemEntity[];
  createdAt: Date;
  updatedAt: Date;
}