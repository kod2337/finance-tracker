'use client';

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';

interface MonthlyIncomeData {
  month: number;
  monthName: string;
  grossIncome: number;
  netIncome: number;
}

interface MonthlyPayoutsData {
  month: number;
  monthName: string;
  totalPayouts: number;
}

interface DashboardChartsProps {
  incomeData: MonthlyIncomeData[];
  payoutsData: MonthlyPayoutsData[];
  currentMonthNetIncome: number;
  currentMonthPayouts: number;
  currentMonthName: string;
}

const COLORS = {
  gross: '#3b82f6',
  net: '#22c55e',
  payouts: '#f97316',
  savings: '#a855f7',
  remaining: '#06b6d4',
};

const formatYAxis = (value: number) => {
  if (value >= 1000000) return `₱${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `₱${(value / 1000).toFixed(0)}k`;
  return `₱${value}`;
};

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color }} />
            <span className="text-muted-foreground">{entry.name}:</span>
            <span className="font-medium">{formatCurrency(entry.value)}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PieTooltip = ({ active, payload }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; payload: { color: string } }>;
}) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border rounded-lg shadow-lg p-3 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full" style={{ backgroundColor: payload[0].payload.color }} />
          <span className="text-muted-foreground">{payload[0].name}:</span>
          <span className="font-medium">{formatCurrency(payload[0].value)}</span>
        </div>
      </div>
    );
  }
  return null;
};

export function DashboardCharts({
  incomeData,
  payoutsData,
  currentMonthNetIncome,
  currentMonthPayouts,
  currentMonthName,
}: DashboardChartsProps) {
  // Combine income and payouts by month for the bar chart
  const barData = incomeData.map((inc) => {
    const payout = payoutsData.find((p) => p.month === inc.month);
    return {
      monthName: inc.monthName,
      'Gross Income': Math.round(inc.grossIncome),
      'Net Income': Math.round(inc.netIncome),
      'Payouts': Math.round(payout?.totalPayouts ?? 0),
    };
  });

  // Savings = Net Income - Payouts
  const savings = Math.max(0, currentMonthNetIncome - currentMonthPayouts);
  const pieData = [
    { name: 'Payouts (Expenses)', value: Math.round(currentMonthPayouts), color: COLORS.payouts },
    { name: 'Savings', value: Math.round(savings), color: COLORS.savings },
  ].filter((d) => d.value > 0);

  const hasBarData = barData.some((d) => d['Gross Income'] > 0 || d['Net Income'] > 0 || d['Payouts'] > 0);
  const hasPieData = pieData.length > 0 && currentMonthNetIncome > 0;

  return (
    <div className="grid gap-4 md:grid-cols-2">
      {/* Bar Chart: Monthly Income vs Payouts */}
      <Card className="md:col-span-2">
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>Gross income, net income, and payouts per month</CardDescription>
        </CardHeader>
        <CardContent>
          {hasBarData ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={barData} margin={{ top: 5, right: 20, left: 10, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis
                  dataKey="monthName"
                  tick={{ fontSize: 12 }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={formatYAxis}
                  tick={{ fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={60}
                />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }} />
                <Bar dataKey="Gross Income" fill={COLORS.gross} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Net Income" fill={COLORS.net} radius={[4, 4, 0, 0]} />
                <Bar dataKey="Payouts" fill={COLORS.payouts} radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground text-sm">
              No data available for this year yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Pie Chart: Current month breakdown */}
      <Card>
        <CardHeader>
          <CardTitle>{currentMonthName} Breakdown</CardTitle>
          <CardDescription>How your net income is allocated this month</CardDescription>
        </CardHeader>
        <CardContent>
          {hasPieData ? (
            <div className="flex flex-col items-center gap-4">
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
                    ))}
                  </Pie>
                  <Tooltip content={<PieTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-wrap justify-center gap-4 text-xs">
                {pieData.map((entry) => (
                  <div key={entry.name} className="flex items-center gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted-foreground">{entry.name}</span>
                    <span className="font-semibold">{formatCurrency(entry.value)}</span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-[220px] flex items-center justify-center text-muted-foreground text-sm">
              No income data for this month yet.
            </div>
          )}
        </CardContent>
      </Card>

      {/* Income vs Payouts Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{currentMonthName} Income vs Payouts</CardTitle>
          <CardDescription>Net Income &minus; Payouts = Savings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 pt-2">
          {[
            { label: 'Net Income', value: currentMonthNetIncome, color: COLORS.net },
            { label: 'Payouts (Expenses)', value: currentMonthPayouts, color: COLORS.payouts },
            { label: 'Savings', value: savings, color: COLORS.savings },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-sm font-semibold">{formatCurrency(item.value)}</span>
            </div>
          ))}
          {currentMonthNetIncome > 0 && (
            <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden flex">
              {currentMonthPayouts > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, (currentMonthPayouts / currentMonthNetIncome) * 100)}%`,
                    backgroundColor: COLORS.payouts,
                  }}
                />
              )}
              {savings > 0 && (
                <div
                  className="h-full"
                  style={{
                    width: `${Math.min(100, (savings / currentMonthNetIncome) * 100)}%`,
                    backgroundColor: COLORS.savings,
                  }}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
