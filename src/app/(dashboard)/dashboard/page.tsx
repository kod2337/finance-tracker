import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { getIncomeEntries, getMonthlySummary, getYearlyIncomeSummary } from '@/lib/actions/income-entries';
import { getYearlyPayoutsSummary } from '@/lib/actions/payouts';
import { TrendingUp, Wallet, PiggyBank, DollarSign } from 'lucide-react';
import { YearMonthFilter } from '@/components/shared/YearMonthFilter';
import { DashboardCharts } from '@/components/dashboard/DashboardCharts';

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string; month?: string }>;
}) {
  const params = await searchParams;
  const currentDate = new Date();
  const year = params.year ? parseInt(params.year) : currentDate.getFullYear();
  const month = params.month && params.month !== 'all' ? parseInt(params.month) : currentDate.getMonth() + 1;

  const [summary, recentEntries, yearlyIncome, yearlyPayouts] = await Promise.all([
    getMonthlySummary(year, month),
    getIncomeEntries(year, month),
    getYearlyIncomeSummary(year),
    getYearlyPayoutsSummary(year),
  ]);

  const currentMonthPayoutsData = yearlyPayouts.find((p) => p.month === month);
  const currentMonthPayouts = currentMonthPayoutsData?.totalPayouts ?? 0;
  const currentMonthName = new Date(year, month - 1).toLocaleString('default', { month: 'long' });

  const stats = [
    {
      title: 'Total Gross Income',
      value: formatCurrency(summary.totalGrossIncome),
      description: `${currentMonthName} ${year}`,
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
    },
    {
      title: 'Total Net Income',
      value: formatCurrency(summary.totalNetIncome),
      description: 'After deductions',
      icon: Wallet,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
    },
    {
      title: 'Income Entries',
      value: summary.entryCount.toString(),
      description: 'This month',
      icon: DollarSign,
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
    },
    {
      title: 'Avg per Entry',
      value: summary.entryCount > 0 
        ? formatCurrency(summary.totalNetIncome / summary.entryCount)
        : formatCurrency(0),
      description: 'Average income',
      icon: PiggyBank,
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
    },
  ];

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            Overview of your financial status
          </p>
        </div>
        <YearMonthFilter
          currentYear={year}
          currentMonth={month}
          basePath="/dashboard"
        />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-4 w-4 ${stat.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts */}
      <DashboardCharts
        incomeData={yearlyIncome}
        payoutsData={yearlyPayouts}
        currentMonthNetIncome={summary.totalNetIncome}
        currentMonthPayouts={currentMonthPayouts}
        currentMonthName={currentMonthName}
      />

      {/* Recent Entries */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Income Entries</CardTitle>
          <CardDescription>
            Your latest income entries for this month
          </CardDescription>
        </CardHeader>
        <CardContent>
          {recentEntries.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <p>No income entries for this month yet.</p>
              <p className="text-sm mt-1">Start by adding your first income entry!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {recentEntries.slice(0, 5).map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between py-3 border-b last:border-0"
                >
                  <div className="flex items-center gap-3">
                    {entry.income_sources && (
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: entry.income_sources.color }}
                      />
                    )}
                    <div>
                      <p className="font-medium">
                        {entry.income_sources?.name || 'Unknown Source'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(entry.date).toLocaleDateString()} • Week {entry.week}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">{formatCurrency(entry.net_amount)}</p>
                    <p className="text-sm text-muted-foreground">
                      Gross: {formatCurrency(entry.gross_amount)}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Add Income Entry
            </CardTitle>
            <CardDescription>
              Record a new income from your sources
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="hover:shadow-md transition-shadow cursor-pointer">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Manage Sources
            </CardTitle>
            <CardDescription>
              Add or edit your income sources
            </CardDescription>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}
