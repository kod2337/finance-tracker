import { notFound } from 'next/navigation';
import { getIncomeEntry } from '@/lib/actions/income-entries';
import { getActiveIncomeSources } from '@/lib/actions/income-sources';
import { IncomeEntryForm } from '@/components/income/IncomeEntryForm';

export default async function EditIncomeEntryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  try {
    const [entry, sources] = await Promise.all([
      getIncomeEntry(id),
      getActiveIncomeSources(),
    ]);

    if (!entry) {
      notFound();
    }

    return (
      <div className="container mx-auto py-10 max-w-2xl">
        <IncomeEntryForm entry={entry} sources={sources} />
      </div>
    );
  } catch (error) {
    notFound();
  }
}
