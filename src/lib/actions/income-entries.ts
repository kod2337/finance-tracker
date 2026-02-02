import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

export type IncomeEntry = Database['public']['Tables']['income_entries']['Row'];
export type IncomeEntryInsert = Database['public']['Tables']['income_entries']['Insert'];

export interface IncomeEntryWithSource extends IncomeEntry {
  income_sources: {
    name: string;
    type: string;
    color: string;
  } | null;
}

export async function getIncomeEntries(year?: number, month?: number) {
  const supabase = await createClient();
  let query = supabase
    .from('income_entries')
    .select(`
      *,
      income_sources (
        name,
        type,
        color
      )
    `)
    .order('date', { ascending: false });

  if (year) {
    query = query.eq('year', year);
  }
  if (month) {
    query = query.eq('month', month);
  }

  const { data, error } = await query;

  if (error) throw error;
  return data as IncomeEntryWithSource[];
}

export async function getIncomeEntry(id: string) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_entries')
    .select(`
      *,
      income_sources (
        name,
        type,
        color
      )
    `)
    .eq('id', id)
    .single();

  if (error) {
    // PGRST116 = No rows found
    if (error.code === 'PGRST116') {
      return null;
    }
    throw new Error(`Failed to fetch income entry: ${error.message}`);
  }
  return data as IncomeEntryWithSource;
}

export async function createIncomeEntry(entry: IncomeEntryInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_entries')
    .insert(entry)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIncomeEntry(id: string, updates: Partial<IncomeEntryInsert>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_entries')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIncomeEntry(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('income_entries')
    .delete()
    .eq('id', id);

  if (error) throw error;
}

export async function getMonthlySummary(year: number, month: number) {
  const entries = await getIncomeEntries(year, month);
  
  const totalGross = entries.reduce((sum, entry) => sum + entry.gross_amount, 0);
  const totalNet = entries.reduce((sum, entry) => sum + entry.net_amount, 0);
  
  return {
    totalGrossIncome: totalGross,
    totalNetIncome: totalNet,
    entryCount: entries.length,
  };
}
