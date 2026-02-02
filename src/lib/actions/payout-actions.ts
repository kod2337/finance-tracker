'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createPayout, updatePayout, deletePayout } from './payouts';

export async function createPayoutAction(formData: FormData) {
  const date = formData.get('date') as string;
  const categoryId = formData.get('category_id') as string;
  const amount = formData.get('amount') as string;
  const status = formData.get('status') as 'paid' | 'partially_paid' | 'not_paid' | 'pending';
  const dueDate = formData.get('due_date') as string;
  const notes = formData.get('notes') as string;

  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  try {
    await createPayout({
      date,
      month,
      year,
      category_id: categoryId,
      amount: parseFloat(amount),
      status,
      due_date: dueDate || null,
      notes: notes || null,
    });

    revalidatePath('/payouts');
    redirect('/payouts');
  } catch (error) {
    console.error('Error creating payout:', error);
    throw error;
  }
}

export async function updatePayoutAction(id: string, formData: FormData) {
  const date = formData.get('date') as string;
  const categoryId = formData.get('category_id') as string;
  const amount = formData.get('amount') as string;
  const status = formData.get('status') as 'paid' | 'partially_paid' | 'not_paid' | 'pending';
  const dueDate = formData.get('due_date') as string;
  const notes = formData.get('notes') as string;

  const parsedDate = new Date(date);
  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  try {
    await updatePayout(id, {
      date,
      month,
      year,
      category_id: categoryId,
      amount: parseFloat(amount),
      status,
      due_date: dueDate || null,
      notes: notes || null,
    });

    revalidatePath('/payouts');
    redirect('/payouts');
  } catch (error) {
    console.error('Error updating payout:', error);
    throw error;
  }
}

export async function deletePayoutAction(id: string) {
  try {
    await deletePayout(id);
    revalidatePath('/payouts');
    redirect('/payouts');
  } catch (error) {
    console.error('Error deleting payout:', error);
    throw error;
  }
}
