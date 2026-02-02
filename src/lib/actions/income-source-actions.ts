'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createIncomeSource, updateIncomeSource, deleteIncomeSource } from './income-sources';
import { incomeSourceSchema } from '@/lib/validations/income';

export async function createIncomeSourceAction(formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as 'salary' | 'freelance' | 'business' | 'investment' | 'other',
    color: formData.get('color') as string,
    is_active: formData.get('is_active') === 'true',
  };

  const validated = incomeSourceSchema.parse(data);
  await createIncomeSource(validated);
  
  revalidatePath('/sources');
  redirect('/sources');
}

export async function updateIncomeSourceAction(id: string, formData: FormData) {
  const data = {
    name: formData.get('name') as string,
    type: formData.get('type') as 'salary' | 'freelance' | 'business' | 'investment' | 'other',
    color: formData.get('color') as string,
    is_active: formData.get('is_active') === 'true',
  };

  const validated = incomeSourceSchema.parse(data);
  await updateIncomeSource(id, validated);
  
  revalidatePath('/sources');
  redirect('/sources');
}

export async function deleteIncomeSourceAction(id: string) {
  await deleteIncomeSource(id);
  revalidatePath('/sources');
  redirect('/sources');
}
