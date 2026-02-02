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

interface SavingsRateSelectorProps {
  currentRate: number;
}

const RATE_OPTIONS = [
  { value: '0.2', label: '20%' },
  { value: '0.25', label: '25%' },
  { value: '0.3', label: '30%' },
  { value: '0.35', label: '35%' },
  { value: '0.4', label: '40% (Recommended)' },
  { value: '0.45', label: '45%' },
  { value: '0.5', label: '50%' },
  { value: '0.6', label: '60%' },
  { value: '0.7', label: '70%' },
];

export function SavingsRateSelector({ currentRate }: SavingsRateSelectorProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleRateChange = (value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('rate', value);
    router.push(`/savings?${params.toString()}`);
  };

  return (
    <Card className="w-full sm:w-64">
      <CardContent className="pt-6">
        <div className="space-y-2">
          <Label htmlFor="savings-rate">Savings Rate</Label>
          <Select
            value={currentRate.toString()}
            onValueChange={handleRateChange}
          >
            <SelectTrigger id="savings-rate">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {RATE_OPTIONS.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-muted-foreground">
            Percentage of net income allocated to savings
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
