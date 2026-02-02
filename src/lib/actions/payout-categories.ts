import { createClient } from '@/lib/supabase/server';

export interface PayoutCategory {
  id: string;
  name: string;
  type: 'savings' | 'obligation' | 'personal' | 'expense' | 'other';
  target_amount: number | null;
  color: string;
  icon: string | null;
  created_at: string;
  updated_at: string;
}

export async function getPayoutCategories(): Promise<PayoutCategory[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payout_categories')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching payout categories:', error);
    throw new Error('Failed to fetch payout categories');
  }

  return data || [];
}

export async function getPayoutCategoryById(id: string): Promise<PayoutCategory | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payout_categories')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116 = No rows found
    if (error.code === 'PGRST116') {
      console.log(`Payout category not found: ${id}`);
      return null;
    }
    console.error('Error fetching payout category:', error.message || error);
    return null;
  }

  return data;
}

export async function createPayoutCategory(
  category: Omit<PayoutCategory, 'id' | 'created_at' | 'updated_at'>
): Promise<PayoutCategory> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payout_categories')
    .insert(category)
    .select()
    .single();

  if (error) {
    console.error('Error creating payout category:', error);
    throw new Error('Failed to create payout category');
  }

  return data;
}

export async function updatePayoutCategory(
  id: string,
  category: Partial<Omit<PayoutCategory, 'id' | 'created_at' | 'updated_at'>>
): Promise<PayoutCategory> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payout_categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating payout category:', error);
    throw new Error('Failed to update payout category');
  }

  return data;
}

export async function deletePayoutCategory(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('payout_categories')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payout category:', error);
    throw new Error('Failed to delete payout category');
  }
}
