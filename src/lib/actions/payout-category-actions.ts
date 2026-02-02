'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPayoutCategory, updatePayoutCategory, deletePayoutCategory } from './payout-categories';

export async function createPayoutCategoryAction(formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'savings' | 'obligation' | 'personal' | 'expense' | 'other';
  const targetAmount = formData.get('target_amount') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;

  try {
    await createPayoutCategory({
      name,
      type,
      target_amount: targetAmount ? parseFloat(targetAmount) : null,
      color,
      icon: icon || null,
    });

    revalidatePath('/categories');
    redirect('/categories');
  } catch (error) {
    console.error('Error creating payout category:', error);
    throw error;
  }
}

export async function updatePayoutCategoryAction(id: string, formData: FormData) {
  const name = formData.get('name') as string;
  const type = formData.get('type') as 'savings' | 'obligation' | 'personal' | 'expense' | 'other';
  const targetAmount = formData.get('target_amount') as string;
  const color = formData.get('color') as string;
  const icon = formData.get('icon') as string;

  try {
    await updatePayoutCategory(id, {
      name,
      type,
      target_amount: targetAmount ? parseFloat(targetAmount) : null,
      color,
      icon: icon || null,
    });

    revalidatePath('/categories');
    redirect('/categories');
  } catch (error) {
    console.error('Error updating payout category:', error);
    throw error;
  }
}

export async function deletePayoutCategoryAction(id: string) {
  try {
    await deletePayoutCategory(id);
    revalidatePath('/categories');
    redirect('/categories');
  } catch (error) {
    console.error('Error deleting payout category:', error);
    throw error;
  }
}
