import { getPayoutCategories } from '@/lib/actions/payout-categories';
import { PayoutForm } from '@/components/payout/PayoutForm';

export default async function NewPayoutPage() {
  const categories = await getPayoutCategories();

  return (
    <div className="container mx-auto py-10 max-w-2xl">
      <PayoutForm categories={categories} />
    </div>
  );
}
