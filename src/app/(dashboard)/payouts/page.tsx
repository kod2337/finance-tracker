import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getPayouts } from '@/lib/actions/payouts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { format } from 'date-fns';
import { YearMonthFilter } from '@/components/shared/YearMonthFilter';

export default async function PayoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const currentDate = new Date();
  const year = params.year ? parseInt(params.year) : currentDate.getFullYear();
  const month = params.month && params.month !== 'all' ? parseInt(params.month) : undefined;

  const allPayouts = await getPayouts();
  
  // Filter payouts by year and optionally month
  const payouts = allPayouts.filter((payout) => {
    if (payout.year !== year) return false;
    if (month && payout.month !== month) return false;
    return true;
  });

  const totalAmount = payouts.reduce((sum, payout) => sum + payout.amount, 0);
  const paidAmount = payouts
    .filter((p) => p.status === 'paid')
    .reduce((sum, payout) => sum + payout.amount, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500">Fully Paid</Badge>;
      case 'partially_paid':
        return <Badge className="bg-yellow-500">Partially Paid</Badge>;
      case 'not_paid':
        return <Badge className="bg-red-500">Not Paid</Badge>;
      case 'pending':
        return <Badge variant="outline">Pending</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Payouts</h1>
            <p className="text-muted-foreground mt-1">
              Track all your payouts and expenses
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/categories">Manage Categories</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/payouts/new">Add Payout</Link>
            </Button>
          </div>
        </div>
        <YearMonthFilter
          currentYear={year}
          currentMonth={month || currentDate.getMonth() + 1}
          basePath="/payouts"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Payouts</div>
          <div className="text-2xl font-bold">{formatCurrency(totalAmount)}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Paid Amount</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(paidAmount)}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Entries</div>
          <div className="text-2xl font-bold">{payouts.length}</div>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Due Date</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {payouts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-10 text-muted-foreground">
                  No payouts yet. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              payouts.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell>
                    {format(new Date(payout.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {payout.payout_categories && (
                        <>
                          {payout.payout_categories.icon && (
                            <span>{payout.payout_categories.icon}</span>
                          )}
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: payout.payout_categories.color }}
                          />
                          <span>{payout.payout_categories.name}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(payout.amount)}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payout.status)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {payout.due_date ? format(new Date(payout.due_date), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {payout.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/payouts/${payout.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
