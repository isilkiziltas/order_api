import { z } from 'zod';

export const registerSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'E-posta zorunludur.' })
      .email('Geçerli bir e-posta adresi giriniz.'),
    password: z
      .string({ required_error: 'Şifre zorunludur.' })
      .min(6, 'Şifre en az 6 karakter olmalıdır.')
      .max(64, 'Şifre en fazla 64 karakter olabilir.'),
    name: z
      .string({ required_error: 'İsim zorunludur.' })
      .min(2, 'İsim en az 2 karakter olmalıdır.'),
  }),
};

export const loginSchema = {
  body: z.object({
    email: z
      .string({ required_error: 'E-posta zorunludur.' })
      .email('Geçerli bir e-posta adresi giriniz.'),
    password: z
      .string({ required_error: 'Şifre zorunludur.' })
      .min(1, 'Şifre alanı boş bırakılamaz.'),
  }),
};

export type RegisterInput = z.infer<typeof registerSchema.body>;
export type LoginInput = z.infer<typeof loginSchema.body>;