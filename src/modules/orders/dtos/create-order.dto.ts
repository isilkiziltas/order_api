import { z } from 'zod';

export const createOrderSchema = z.object({
  userId: z.string().uuid({ message: 'Geçersiz kullanıcı ID formatı (UUID olmalı)' }),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, 'Ürün ID zorunludur'),
        quantity: z.number().int().positive({ message: 'Adet en az 1 olmalıdır' }),
        unitPrice: z.number().positive({ message: 'Birim fiyat 0 dan büyük olmalıdır' }),
      })
    )
    .min(1, { message: 'Siparişte en az 1 ürün olmalıdır' }),
});

export type CreateOrderDTO = z.infer<typeof createOrderSchema>;