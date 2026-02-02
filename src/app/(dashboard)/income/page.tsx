import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getIncomeEntries } from '@/lib/actions/income-entries';
import { Button } from '@/components/ui/button';
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
import { Badge } from '@/components/ui/badge';

export default async function IncomePage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const currentDate = new Date();
  const year = params.year ? parseInt(params.year) : currentDate.getFullYear();
  const month = params.month && params.month !== 'all' ? parseInt(params.month) : undefined;

  const entries = await getIncomeEntries(year, month);

  const totalGross = entries.reduce((sum, entry) => sum + (entry.gross_amount || 0), 0);
  const totalNet = entries.reduce((sum, entry) => sum + (entry.net_amount || 0), 0);

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Income Entries</h1>
            <p className="text-muted-foreground mt-1">
              Track all your income entries
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild variant="outline" size="sm">
              <Link href="/sources">Manage Sources</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/income/new">Add Income</Link>
            </Button>
          </div>
        </div>
        <YearMonthFilter
          currentYear={year}
          currentMonth={month || currentDate.getMonth() + 1}
          basePath="/income"
        />
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-6">
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Gross Income</div>
          <div className="text-2xl font-bold">{formatCurrency(totalGross)}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Total Net Income</div>
          <div className="text-2xl font-bold text-green-600">{formatCurrency(totalNet)}</div>
        </div>
        <div className="p-4 border rounded-lg">
          <div className="text-sm text-muted-foreground">Entries</div>
          <div className="text-2xl font-bold">{entries.length}</div>
        </div>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Source</TableHead>
              <TableHead>Frequency</TableHead>
              <TableHead>Week</TableHead>
              <TableHead className="text-right">Gross Amount</TableHead>
              <TableHead className="text-right">Net Amount</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-10 text-muted-foreground">
                  No income entries yet. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>
                    {format(new Date(entry.date), 'MMM d, yyyy')}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {entry.income_sources && (
                        <>
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: entry.income_sources.color }}
                          />
                          <span>{entry.income_sources.name}</span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-primary/10 text-primary">
                      {entry.payment_frequency === 'weekly' ? 'Weekly' : 
                       entry.payment_frequency === 'bi_weekly' ? 'Bi-Weekly' : 
                       'Monthly'}
                    </span>
                  </TableCell>
                  <TableCell>Week {entry.week}</TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(entry.gross_amount)}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {formatCurrency(entry.net_amount)}
                  </TableCell>
                  <TableCell className="text-muted-foreground max-w-xs truncate">
                    {entry.notes || '-'}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/income/${entry.id}`}>Edit</Link>
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
