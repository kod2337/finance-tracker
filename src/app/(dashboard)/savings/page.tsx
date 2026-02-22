import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSavingsByYear } from '@/lib/actions/savings';
import { YearMonthFilter } from '@/components/shared/YearMonthFilter';
import { formatCurrency } from '@/lib/utils';

export default async function SavingsPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>;
}) {
  const params = await searchParams;
  const currentYear = params.year ? parseInt(params.year) : new Date().getFullYear();
  const monthsData = await getSavingsByYear(currentYear);

  const yearlyNetTotal = monthsData.reduce((sum, m) => sum + m.totalNetAmount, 0);
  const yearlyPayouts = monthsData.reduce((sum, m) => sum + m.totalPayouts, 0);
  const yearlySavings = monthsData.reduce((sum, m) => sum + m.totalSavings, 0);

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Savings Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Savings = Net Income &minus; Payouts (expenses)
            </p>
          </div>
          <YearMonthFilter
            currentYear={currentYear}
            showMonth={false}
            basePath="/savings"
          />
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3 mb-8">
        <Card>
          <CardHeader>
            <CardTitle>Total Net Income</CardTitle>
            <CardDescription>{currentYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {formatCurrency(yearlyNetTotal)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Payouts</CardTitle>
            <CardDescription>Expenses for {currentYear}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">
              {formatCurrency(yearlyPayouts)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Savings</CardTitle>
            <CardDescription>Net Income &minus; Payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(yearlySavings)}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              {monthsData.length} {monthsData.length === 1 ? 'month' : 'months'} with income
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {monthsData.length === 0 ? (
          <Card>
            <CardContent className="py-10 text-center text-muted-foreground">
              No income entries found for {currentYear}. Add income entries to see your savings breakdown.
            </CardContent>
          </Card>
        ) : (
          monthsData.map((monthData) => (
            <Card key={`${monthData.year}-${monthData.month}`}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{monthData.monthName} {monthData.year}</CardTitle>
                    <CardDescription>Weekly savings breakdown</CardDescription>
                  </div>
                  <div className="text-right space-y-1">
                    <div className="text-sm text-muted-foreground">Net Income</div>
                    <div className="text-xl font-semibold">
                      {formatCurrency(monthData.totalNetAmount)}
                    </div>
                    <div className="text-sm text-orange-600">
                      &minus; {formatCurrency(monthData.totalPayouts)} (payouts)
                    </div>
                    <div className="text-lg font-bold text-green-600 pt-1 border-t">
                      = {formatCurrency(monthData.totalSavings)}
                    </div>
                    <div className="text-xs text-muted-foreground">saved</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead className="text-right">Net Income</TableHead>
                      <TableHead className="text-right">% of Month</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthData.weeks.map((week) => (
                      <TableRow key={week.week}>
                        <TableCell>
                          <Badge variant="outline">Week {week.week}</Badge>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(week.netAmount)}
                        </TableCell>
                        <TableCell className="text-right text-muted-foreground">
                          {monthData.totalNetAmount > 0
                            ? ((week.netAmount / monthData.totalNetAmount) * 100).toFixed(1)
                            : '0.0'}%
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total Income</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(monthData.totalNetAmount)}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
                    </TableRow>
                    <TableRow className="text-orange-600">
                      <TableCell className="font-medium">Payouts (expenses)</TableCell>
                      <TableCell className="text-right font-medium">
                        &minus; {formatCurrency(monthData.totalPayouts)}
                      </TableCell>
                      <TableCell />
                    </TableRow>
                    <TableRow className="bg-green-50 dark:bg-green-950/20 font-bold text-green-700 dark:text-green-400">
                      <TableCell>Savings</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(monthData.totalSavings)}
                      </TableCell>
                      <TableCell className="text-right">
                        {monthData.totalNetAmount > 0
                          ? ((monthData.totalSavings / monthData.totalNetAmount) * 100).toFixed(1)
                          : '0.0'}%
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
