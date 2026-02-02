import { notFound } from 'next/navigation';
import { getPayoutCategoryById } from '@/lib/actions/payout-categories';
import { PayoutCategoryForm } from '@/components/payout/PayoutCategoryForm';

export default async function EditCategoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const category = await getPayoutCategoryById(id);

  if (!category) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <PayoutCategoryForm category={category} />
    </div>
  );
}
