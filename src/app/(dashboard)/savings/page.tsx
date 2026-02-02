import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { getSavingsByYear } from '@/lib/actions/savings';
import { SavingsRateSelector } from '@/components/savings/SavingsRateSelector';
import { YearMonthFilter } from '@/components/shared/YearMonthFilter';

export default async function SavingsPage({
  searchParams,
}: {
  searchParams: Promise<{ rate?: string; year?: string }>;
}) {
  const params = await searchParams;
  const currentYear = params.year ? parseInt(params.year) : new Date().getFullYear();
  const savingsRate = params.rate ? parseFloat(params.rate) : 0.4;
  const monthsData = await getSavingsByYear(currentYear, savingsRate);

  const yearlyTotal = monthsData.reduce((sum, month) => sum + month.totalSavings, 0);
  const yearlyNetTotal = monthsData.reduce((sum, month) => sum + month.totalNetAmount, 0);
  const yearlyRemaining = yearlyNetTotal - yearlyTotal;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-PH', {
      style: 'currency',
      currency: 'PHP',
    }).format(amount);
  };

  return (
    <div className="container mx-auto py-10">
      <div className="mb-8">
        <div className="flex flex-col gap-4">
          <div>
            <h1 className="text-3xl font-bold">Savings Tracker</h1>
            <p className="text-muted-foreground mt-2">
              Track your savings breakdown by month and week
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <YearMonthFilter
              currentYear={currentYear}
              showMonth={false}
              basePath="/savings"
            />
            <SavingsRateSelector currentRate={savingsRate} />
          </div>
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
            <CardTitle>Total Savings</CardTitle>
            <CardDescription>{(savingsRate * 100).toFixed(0)}% rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {formatCurrency(yearlyTotal)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Remaining After Savings</CardTitle>
            <CardDescription>Available for payouts</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {formatCurrency(yearlyRemaining)}
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
                    <div className="text-sm text-green-600">
                      - {formatCurrency(monthData.totalSavings)} (savings)
                    </div>
                    <div className="text-lg font-bold text-blue-600 pt-1 border-t">
                      = {formatCurrency(monthData.totalNetAmount - monthData.totalSavings)}
                    </div>
                    <div className="text-xs text-muted-foreground">remaining</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Week</TableHead>
                      <TableHead className="text-right">Net Income</TableHead>
                      <TableHead className="text-right">Savings ({(savingsRate * 100).toFixed(0)}%)</TableHead>
                      <TableHead className="text-right">Remaining</TableHead>
                      <TableHead className="text-right">% of Month</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {monthData.weeks.map((week) => {
                      const remaining = week.netAmount - week.savings;
                      return (
                        <TableRow key={week.week}>
                          <TableCell>
                            <Badge variant="outline">Week {week.week}</Badge>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(week.netAmount)}
                          </TableCell>
                          <TableCell className="text-right font-bold text-green-600">
                            {formatCurrency(week.savings)}
                          </TableCell>
                          <TableCell className="text-right font-bold text-blue-600">
                            {formatCurrency(remaining)}
                          </TableCell>
                          <TableCell className="text-right text-muted-foreground">
                            {((week.savings / monthData.totalSavings) * 100).toFixed(1)}%
                          </TableCell>
                        </TableRow>
                      );
                    })}
                    <TableRow className="bg-muted/50 font-semibold">
                      <TableCell>Total</TableCell>
                      <TableCell className="text-right">
                        {formatCurrency(monthData.totalNetAmount)}
                      </TableCell>
                      <TableCell className="text-right text-green-600">
                        {formatCurrency(monthData.totalSavings)}
                      </TableCell>
                      <TableCell className="text-right text-blue-600">
                        {formatCurrency(monthData.totalNetAmount - monthData.totalSavings)}
                      </TableCell>
                      <TableCell className="text-right">100%</TableCell>
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
