'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIncomeEntry, updateIncomeEntry, deleteIncomeEntry } from './income-entries';
import { incomeEntrySchema } from '@/lib/validations/income';

export async function createIncomeEntryAction(formData: FormData) {
  const date = formData.get('date') as string;
  const dateObj = new Date(date);
  
  const data = {
    date,
    week: parseInt(formData.get('week') as string),
    month: dateObj.getMonth() + 1,
    year: dateObj.getFullYear(),
    source_id: formData.get('source_id') as string,
    gross_amount: parseFloat(formData.get('gross_amount') as string),
    net_amount: parseFloat(formData.get('net_amount') as string),
    payment_frequency: formData.get('payment_frequency') as 'weekly' | 'bi_weekly' | 'monthly',
    currency: 'PHP',
    notes: formData.get('notes') as string || '',
  };

  const validated = incomeEntrySchema.parse(data);
  await createIncomeEntry(validated);
  
  revalidatePath('/income');
  redirect('/income');
}

export async function updateIncomeEntryAction(id: string, formData: FormData) {
  const date = formData.get('date') as string;
  const dateObj = new Date(date);
  
  const data = {
    date,
    week: parseInt(formData.get('week') as string),
    month: dateObj.getMonth() + 1,
    year: dateObj.getFullYear(),
    source_id: formData.get('source_id') as string,
    gross_amount: parseFloat(formData.get('gross_amount') as string),
    net_amount: parseFloat(formData.get('net_amount') as string),
    payment_frequency: formData.get('payment_frequency') as 'weekly' | 'bi_weekly' | 'monthly',
    currency: 'PHP',
    notes: formData.get('notes') as string || '',
  };

  const validated = incomeEntrySchema.parse(data);
  await updateIncomeEntry(id, validated);
  
  revalidatePath('/income');
  redirect('/income');
}

export async function deleteIncomeEntryAction(id: string) {
  await deleteIncomeEntry(id);
  revalidatePath('/income');
  redirect('/income');
}
