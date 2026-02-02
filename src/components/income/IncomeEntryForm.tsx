'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createIncomeEntryAction, updateIncomeEntryAction, deleteIncomeEntryAction } from '@/lib/actions/income-entry-actions';
import type { IncomeEntry } from '@/lib/actions/income-entries';
import type { IncomeSource } from '@/lib/actions/income-sources';

interface IncomeEntryFormProps {
  entry?: IncomeEntry;
  sources: IncomeSource[];
}

export function IncomeEntryForm({ entry, sources }: IncomeEntryFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [grossAmount, setGrossAmount] = useState(entry?.gross_amount?.toString() || '');
  const [netAmount, setNetAmount] = useState(entry?.net_amount?.toString() || '');
  const [date, setDate] = useState(entry?.date || new Date().toISOString().split('T')[0]);
  const [sourceId, setSourceId] = useState(entry?.source_id || sources[0]?.id || '');
  const [paymentFrequency, setPaymentFrequency] = useState<'weekly' | 'bi_weekly' | 'monthly'>(
    (entry?.payment_frequency as 'weekly' | 'bi_weekly' | 'monthly') || 'monthly'
  );

  // Calculate week of month from date
  const getWeekOfMonth = (dateString: string): number => {
    const selectedDate = new Date(dateString);
    const dayOfMonth = selectedDate.getDate();
    return Math.ceil(dayOfMonth / 7);
  };

  const week = getWeekOfMonth(date);

  // Auto-calculate net amount (80% of gross by default)
  useEffect(() => {
    if (grossAmount && !entry) {
      const gross = parseFloat(grossAmount);
      if (!isNaN(gross)) {
        setNetAmount((gross * 0.8).toFixed(2));
      }
    }
  }, [grossAmount, entry]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (entry) {
      await updateIncomeEntryAction(entry.id, formData);
    } else {
      await createIncomeEntryAction(formData);
    }
  };

  const handleDelete = async () => {
    if (!entry) return;
    if (!confirm('Are you sure you want to delete this income entry?')) return;
    
    setIsDeleting(true);
    await deleteIncomeEntryAction(entry.id);
  };

  if (sources.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Income Sources</CardTitle>
          <CardDescription>
            You need to create at least one income source before adding entries.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/sources/new')}>
            Create Income Source
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{entry ? 'Edit' : 'Add'} Income Entry</CardTitle>
        <CardDescription>
          {entry ? 'Update the details of this income entry' : 'Record a new income entry'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="date">Date</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
            <p className="text-sm text-muted-foreground">
              Week {week} of the month (auto-calculated)
            </p>
            <input type="hidden" name="week" value={week} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="source_id">Income Source</Label>
            <Select name="source_id" value={sourceId} onValueChange={setSourceId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select source" />
              </SelectTrigger>
              <SelectContent>
                {sources.map((source) => (
                  <SelectItem key={source.id} value={source.id}>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: source.color }}
                      />
                      {source.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_frequency">Payment Frequency</Label>
            <Select value={paymentFrequency} onValueChange={(value) => setPaymentFrequency(value as 'weekly' | 'bi_weekly' | 'monthly')} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="weekly">Weekly</SelectItem>
                <SelectItem value="bi_weekly">Bi-Weekly</SelectItem>
                <SelectItem value="monthly">Monthly</SelectItem>
              </SelectContent>
            </Select>
            <input type="hidden" name="payment_frequency" value={paymentFrequency} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="gross_amount">Gross Amount (₱)</Label>
              <Input
                id="gross_amount"
                name="gross_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={grossAmount}
                onChange={(e) => setGrossAmount(e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="net_amount">Net Amount (₱)</Label>
              <Input
                id="net_amount"
                name="net_amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={netAmount}
                onChange={(e) => setNetAmount(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any additional notes..."
              defaultValue={entry?.notes || ''}
              rows={3}
            />
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {entry ? 'Update' : 'Add'} Entry
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            {entry && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
