import { createClient } from '@/lib/supabase/server';
import { Database } from '@/types/supabase';

export type IncomeSource = Database['public']['Tables']['income_sources']['Row'];
export type IncomeSourceInsert = Database['public']['Tables']['income_sources']['Insert'];

export async function getIncomeSources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_sources')
    .select('*')
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function getActiveIncomeSources() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_sources')
    .select('*')
    .eq('is_active', true)
    .order('name', { ascending: true });

  if (error) throw error;
  return data;
}

export async function createIncomeSource(source: IncomeSourceInsert) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_sources')
    .insert(source)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function updateIncomeSource(id: string, updates: Partial<IncomeSourceInsert>) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from('income_sources')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteIncomeSource(id: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('income_sources')
    .delete()
    .eq('id', id);

  if (error) throw error;
}
