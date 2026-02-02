import { createClient } from '@/lib/supabase/server';

export interface WeeklySavings {
  week: number;
  netAmount: number;
  savings: number; // 40% of net amount
  savingsRate: number; // percentage (default 0.4)
}

export interface MonthlySavings {
  month: number;
  year: number;
  monthName: string;
  weeks: WeeklySavings[];
  totalNetAmount: number;
  totalSavings: number;
}

export async function getSavingsByYear(
  year: number,
  savingsRate: number = 0.4
): Promise<MonthlySavings[]> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('income_entries')
    .select('week, month, year, net_amount')
    .eq('year', year)
    .order('month', { ascending: true })
    .order('week', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch savings data: ${error.message}`);
  }

  // Group by month and week
  const monthsMap = new Map<number, MonthlySavings>();
  
  data.forEach((entry) => {
    if (!monthsMap.has(entry.month)) {
      monthsMap.set(entry.month, {
        month: entry.month,
        year: entry.year,
        monthName: getMonthName(entry.month),
        weeks: [],
        totalNetAmount: 0,
        totalSavings: 0,
      });
    }
    
    const monthData = monthsMap.get(entry.month)!;
    
    // Find or create week entry
    let weekEntry = monthData.weeks.find(w => w.week === entry.week);
    if (!weekEntry) {
      weekEntry = {
        week: entry.week,
        netAmount: 0,
        savings: 0,
        savingsRate,
      };
      monthData.weeks.push(weekEntry);
    }
    
    // Accumulate amounts
    weekEntry.netAmount += entry.net_amount;
    weekEntry.savings = weekEntry.netAmount * savingsRate;
    
    monthData.totalNetAmount += entry.net_amount;
    monthData.totalSavings = monthData.totalNetAmount * savingsRate;
  });

  // Sort weeks within each month
  monthsMap.forEach((month) => {
    month.weeks.sort((a, b) => a.week - b.week);
  });

  return Array.from(monthsMap.values());
}

export async function getSavingsByMonth(
  year: number,
  month: number,
  savingsRate: number = 0.4
): Promise<MonthlySavings | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('income_entries')
    .select('week, month, year, net_amount')
    .eq('year', year)
    .eq('month', month)
    .order('week', { ascending: true });

  if (error) {
    throw new Error(`Failed to fetch savings data: ${error.message}`);
  }

  if (data.length === 0) {
    return null;
  }

  const monthData: MonthlySavings = {
    month,
    year,
    monthName: getMonthName(month),
    weeks: [],
    totalNetAmount: 0,
    totalSavings: 0,
  };

  data.forEach((entry) => {
    let weekEntry = monthData.weeks.find(w => w.week === entry.week);
    if (!weekEntry) {
      weekEntry = {
        week: entry.week,
        netAmount: 0,
        savings: 0,
        savingsRate,
      };
      monthData.weeks.push(weekEntry);
    }
    
    weekEntry.netAmount += entry.net_amount;
    weekEntry.savings = weekEntry.netAmount * savingsRate;
    
    monthData.totalNetAmount += entry.net_amount;
    monthData.totalSavings = monthData.totalNetAmount * savingsRate;
  });

  monthData.weeks.sort((a, b) => a.week - b.week);

  return monthData;
}

function getMonthName(month: number): string {
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  return months[month - 1] || '';
}
