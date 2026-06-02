import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  phone: z.string().optional(),
  avatar: z.string().url().optional(),
});

const addressSchema = z.object({
  label: z.string().default('Home'),
  name: z.string().min(2),
  phone: z.string().min(10),
  addressLine1: z.string().min(5),
  addressLine2: z.string().optional(),
  city: z.string().min(2),
  state: z.string().min(2),
  pincode: z.string().regex(/^\d{6}$/, 'Pincode must be 6 digits'),
  isDefault: z.boolean().default(false),
});

export const addAddressSchema = z.object({ address: addressSchema });
export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).regex(/[A-Z]/).regex(/[0-9]/),
});
export const createUserSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(8).regex(/[A-Z]/, 'Must contain uppercase').regex(/[0-9]/, 'Must contain number'),
  phone: z.string().optional(),
  role: z.enum(['customer', 'admin', 'superadmin']).default('customer'),
  isVerified: z.boolean().default(true),
});

export const updateRoleSchema = z.object({ role: z.enum(['customer', 'admin', 'superadmin']) });
export const userQuerySchema = z.object({
  page: z.string().optional(),
  limit: z.string().optional(),
  search: z.string().optional(),
  role: z.enum(['customer', 'admin', 'superadmin']).optional(),
  isActive: z.enum(['true', 'false']).optional(),
  sort: z.string().optional(),
});

export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;
export type AddAddressInput = z.infer<typeof addAddressSchema>;
