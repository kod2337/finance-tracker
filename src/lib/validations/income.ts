import { z } from 'zod';

export const incomeSourceSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name too long'),
  type: z.enum(['salary', 'freelance', 'business', 'investment', 'other']),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
  is_active: z.boolean().default(true),
});

export const incomeEntrySchema = z.object({
  date: z.string().min(1, 'Date is required'),
  week: z.number().int().min(1).max(5),
  month: z.number().int().min(1).max(12),
  year: z.number().int().min(2020).max(2100),
  source_id: z.string().uuid('Invalid source'),
  payment_frequency: z.enum(['weekly', 'bi_weekly', 'monthly']).default('monthly'),
  gross_amount: z.number().positive('Gross amount must be positive').max(10000000),
  net_amount: z.number().positive('Net amount must be positive').max(10000000),
  currency: z.string().default('PHP'),
  notes: z.string().max(500).optional().or(z.literal('')),
});

export type IncomeSourceFormData = z.infer<typeof incomeSourceSchema>;
export type IncomeEntryFormData = z.infer<typeof incomeEntrySchema>;
