import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { IncomeSourceForm } from '@/components/income/IncomeSourceForm';

export default async function EditIncomeSourcePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: source, error } = await supabase
    .from('income_sources')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !source) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <IncomeSourceForm source={source} />
    </div>
  );
}
