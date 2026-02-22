import { createClient } from '@/lib/supabase/server';

export interface WeeklyIncome {
  week: number;
  netAmount: number;
}

export interface MonthlySavings {
  month: number;
  year: number;
  monthName: string;
  weeks: WeeklyIncome[];
  totalNetAmount: number;
  totalPayouts: number;
  totalSavings: number; // = totalNetAmount - totalPayouts
}

export async function getSavingsByYear(year: number): Promise<MonthlySavings[]> {
  const supabase = await createClient();

  const [incomeResult, payoutsResult] = await Promise.all([
    supabase
      .from('income_entries')
      .select('week, month, year, net_amount')
      .eq('year', year)
      .order('month', { ascending: true })
      .order('week', { ascending: true }),
    supabase
      .from('payouts')
      .select('month, amount')
      .eq('year', year),
  ]);

  if (incomeResult.error) throw new Error(`Failed to fetch income: ${incomeResult.error.message}`);
  if (payoutsResult.error) throw new Error(`Failed to fetch payouts: ${payoutsResult.error.message}`);

  // Group income by month/week
  const monthsMap = new Map<number, MonthlySavings>();

  incomeResult.data.forEach((entry) => {
    if (!monthsMap.has(entry.month)) {
      monthsMap.set(entry.month, {
        month: entry.month,
        year: entry.year,
        monthName: getMonthName(entry.month),
        weeks: [],
        totalNetAmount: 0,
        totalPayouts: 0,
        totalSavings: 0,
      });
    }

    const monthData = monthsMap.get(entry.month)!;
    let weekEntry = monthData.weeks.find((w) => w.week === entry.week);
    if (!weekEntry) {
      weekEntry = { week: entry.week, netAmount: 0 };
      monthData.weeks.push(weekEntry);
    }

    weekEntry.netAmount += entry.net_amount;
    monthData.totalNetAmount += entry.net_amount;
  });

  // Add payouts per month
  payoutsResult.data.forEach((payout) => {
    const monthData = monthsMap.get(payout.month);
    if (monthData) {
      monthData.totalPayouts += payout.amount;
    }
  });

  // Compute savings = net income - payouts
  monthsMap.forEach((monthData) => {
    monthData.totalSavings = Math.max(0, monthData.totalNetAmount - monthData.totalPayouts);
    monthData.weeks.sort((a, b) => a.week - b.week);
  });

  return Array.from(monthsMap.values());
}

export async function getSavingsByMonth(year: number, month: number): Promise<MonthlySavings | null> {
  const supabase = await createClient();

  const [incomeResult, payoutsResult] = await Promise.all([
    supabase
      .from('income_entries')
      .select('week, month, year, net_amount')
      .eq('year', year)
      .eq('month', month)
      .order('week', { ascending: true }),
    supabase
      .from('payouts')
      .select('amount')
      .eq('year', year)
      .eq('month', month),
  ]);

  if (incomeResult.error) throw new Error(`Failed to fetch income: ${incomeResult.error.message}`);
  if (payoutsResult.error) throw new Error(`Failed to fetch payouts: ${payoutsResult.error.message}`);

  if (incomeResult.data.length === 0) return null;

  const totalPayouts = payoutsResult.data.reduce((sum, p) => sum + p.amount, 0);

  const monthData: MonthlySavings = {
    month,
    year,
    monthName: getMonthName(month),
    weeks: [],
    totalNetAmount: 0,
    totalPayouts,
    totalSavings: 0,
  };

  incomeResult.data.forEach((entry) => {
    let weekEntry = monthData.weeks.find((w) => w.week === entry.week);
    if (!weekEntry) {
      weekEntry = { week: entry.week, netAmount: 0 };
      monthData.weeks.push(weekEntry);
    }
    weekEntry.netAmount += entry.net_amount;
    monthData.totalNetAmount += entry.net_amount;
  });

  monthData.totalSavings = Math.max(0, monthData.totalNetAmount - monthData.totalPayouts);
  monthData.weeks.sort((a, b) => a.week - b.week);

  return monthData;
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return months[month - 1] || '';
}
