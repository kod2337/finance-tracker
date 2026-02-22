import { createClient } from '@/lib/supabase/server';

export interface Payout {
  id: string;
  date: string;
  month: number;
  year: number;
  category_id: string;
  amount: number;
  status: 'paid' | 'partially_paid' | 'not_paid' | 'pending';
  due_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  payout_categories?: {
    name: string;
    type: string;
    color: string;
    icon: string | null;
  };
}

export async function getPayouts(month?: number, year?: number): Promise<Payout[]> {
  const supabase = await createClient();
  
  let query = supabase
    .from('payouts')
    .select(`
      *,
      payout_categories (
        name,
        type,
        color,
        icon
      )
    `)
    .order('date', { ascending: false });

  if (month !== undefined) {
    query = query.eq('month', month);
  }
  
  if (year !== undefined) {
    query = query.eq('year', year);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching payouts:', error);
    throw new Error('Failed to fetch payouts');
  }

  return data || [];
}

export async function getPayoutById(id: string): Promise<Payout | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payouts')
    .select(`
      *,
      payout_categories (
        name,
        type,
        color,
        icon
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116 = No rows found
    if (error.code === 'PGRST116') {
      console.log(`Payout not found: ${id}`);
      return null;
    }
    console.error('Error fetching payout:', error.message || error);
    return null;
  }

  return data;
}

export async function createPayout(
  payout: Omit<Payout, 'id' | 'created_at' | 'updated_at' | 'payout_categories'>
): Promise<Payout> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('payouts')
    .insert({ ...payout, user_id: user.id })
    .select()
    .single();

  if (error) {
    console.error('Error creating payout:', error);
    throw new Error('Failed to create payout');
  }

  return data;
}

export async function updatePayout(
  id: string,
  payout: Partial<Omit<Payout, 'id' | 'created_at' | 'updated_at' | 'payout_categories'>>
): Promise<Payout> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payouts')
    .update(payout)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating payout:', error);
    throw new Error('Failed to update payout');
  }

  return data;
}

export async function deletePayout(id: string): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from('payouts')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting payout:', error);
    throw new Error('Failed to delete payout');
  }
}

export async function getMonthlySummaryByCategory(month: number, year: number) {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('payouts')
    .select(`
      amount,
      status,
      payout_categories (
        name,
        type,
        target_amount,
        color
      )
    `)
    .eq('month', month)
    .eq('year', year);

  if (error) {
    console.error('Error fetching monthly payout summary:', error);
    throw new Error('Failed to fetch monthly payout summary');
  }

  return data || [];
}

export async function getYearlyPayoutsSummary(year: number) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from('payouts')
    .select('month, amount')
    .eq('year', year);

  if (error) throw new Error(`Failed to fetch yearly payouts: ${error.message}`);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const months = Array.from({ length: 12 }, (_, i) => ({
    month: i + 1,
    monthName: monthNames[i],
    totalPayouts: 0,
  }));

  (data || []).forEach((entry) => {
    months[entry.month - 1].totalPayouts += entry.amount;
  });

  return months;
}
