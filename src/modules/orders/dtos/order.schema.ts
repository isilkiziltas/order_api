import { z } from 'zod';

export const listOrdersQuerySchema = {
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => val > 0, { message: 'Sayfa 1 veya daha büyük olmalıdır.' }),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10))
      .refine((val) => val > 0 && val <= 100, { message: 'Limit 1 ile 100 arasında olmalıdır.' }),
    status: z.enum(['PENDING', 'CONFIRMED', 'CANCELLED', 'DELIVERED']).optional(),
  }),
};

export type ListOrdersQuery = z.infer<typeof listOrdersQuerySchema.query>;