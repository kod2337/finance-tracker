import { notFound } from 'next/navigation';
import { getPayoutById } from '@/lib/actions/payouts';
import { getPayoutCategories } from '@/lib/actions/payout-categories';
import { PayoutForm } from '@/components/payout/PayoutForm';

export default async function EditPayoutPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  
  const [payout, categories] = await Promise.all([
    getPayoutById(id),
    getPayoutCategories(),
  ]);

  if (!payout) {
    notFound();
  }

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <PayoutForm payout={payout} categories={categories} />
    </div>
  );
}
