'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

interface YearMonthFilterProps {
  currentYear: number;
  currentMonth?: number;
  showMonth?: boolean;
  basePath: string;
}

const MONTHS = [
  { value: '1', label: 'January' },
  { value: '2', label: 'February' },
  { value: '3', label: 'March' },
  { value: '4', label: 'April' },
  { value: '5', label: 'May' },
  { value: '6', label: 'June' },
  { value: '7', label: 'July' },
  { value: '8', label: 'August' },
  { value: '9', label: 'September' },
  { value: '10', label: 'October' },
  { value: '11', label: 'November' },
  { value: '12', label: 'December' },
];

export function YearMonthFilter({
  currentYear,
  currentMonth,
  showMonth = true,
  basePath,
}: YearMonthFilterProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentYearNow = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => currentYearNow - 2 + i);

  const handleYearChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('year', value);
    router.push(`${basePath}?${params.toString()}`);
  };

  const handleMonthChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('month', value);
    router.push(`${basePath}?${params.toString()}`);
  };

  return (
    <Card className="w-full sm:w-auto">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="space-y-2">
            <Label htmlFor="year-filter">Year</Label>
            <Select value={currentYear.toString()} onValueChange={handleYearChange}>
              <SelectTrigger id="year-filter" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {years.map((year) => (
                  <SelectItem key={year} value={year.toString()}>
                    {year}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {showMonth && currentMonth && (
            <div className="space-y-2">
              <Label htmlFor="month-filter">Month</Label>
              <Select value={currentMonth.toString()} onValueChange={handleMonthChange}>
                <SelectTrigger id="month-filter" className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Months</SelectItem>
                  {MONTHS.map((month) => (
                    <SelectItem key={month.value} value={month.value}>
                      {month.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
