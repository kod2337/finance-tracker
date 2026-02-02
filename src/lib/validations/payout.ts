import { z } from 'zod';

export const payoutCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['savings', 'obligation', 'personal', 'expense', 'other']),
  target_amount: z.number().positive('Target must be positive').optional().or(z.literal(0)),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  icon: z.string().max(50).optional().or(z.literal('')),
});

export const payoutSchema = z.object({
  date: z.string().min(1, 'Date is required'),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  category_id: z.string().uuid('Invalid category'),
  amount: z.number().positive('Amount must be positive').max(10000000),
  status: z.enum(['paid', 'partially_paid', 'not_paid', 'pending']).default('pending'),
  due_date: z.string().optional().or(z.literal('')),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type PayoutCategoryFormData = z.infer<typeof payoutCategorySchema>;
export type PayoutFormData = z.infer<typeof payoutSchema>;
