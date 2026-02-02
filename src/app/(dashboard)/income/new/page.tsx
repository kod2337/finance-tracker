import { getActiveIncomeSources } from '@/lib/actions/income-sources';
import { IncomeEntryForm } from '@/components/income/IncomeEntryForm';

export default async function NewIncomeEntryPage() {
  const sources = await getActiveIncomeSources();

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <IncomeEntryForm sources={sources} />
    </div>
  );
}
