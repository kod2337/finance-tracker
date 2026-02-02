'use client';

import { useState } from 'react';
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
import { createPayoutAction, updatePayoutAction, deletePayoutAction } from '@/lib/actions/payout-actions';
import type { Payout } from '@/lib/actions/payouts';
import type { PayoutCategory } from '@/lib/actions/payout-categories';

interface PayoutFormProps {
  payout?: Payout;
  categories: PayoutCategory[];
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-gray-500' },
  { value: 'not_paid', label: 'Not Paid', color: 'bg-red-500' },
  { value: 'partially_paid', label: 'Partially Paid', color: 'bg-yellow-500' },
  { value: 'paid', label: 'Fully Paid', color: 'bg-green-500' },
];

export function PayoutForm({ payout, categories }: PayoutFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [date, setDate] = useState(payout?.date || new Date().toISOString().split('T')[0]);
  const [categoryId, setCategoryId] = useState(payout?.category_id || categories[0]?.id || '');
  const [status, setStatus] = useState<'paid' | 'partially_paid' | 'not_paid' | 'pending'>(
    payout?.status || 'pending'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (payout) {
      await updatePayoutAction(payout.id, formData);
    } else {
      await createPayoutAction(formData);
    }
  };

  const handleDelete = async () => {
    if (!payout) return;
    if (!confirm('Are you sure you want to delete this payout?')) return;
    
    setIsDeleting(true);
    await deletePayoutAction(payout.id);
  };

  if (categories.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>No Payout Categories</CardTitle>
          <CardDescription>
            You need to create at least one payout category before adding payouts.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button onClick={() => router.push('/categories/new')}>
            Create Category
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{payout ? 'Edit' : 'Add'} Payout</CardTitle>
        <CardDescription>
          {payout ? 'Update the details of this payout' : 'Record a new payout or expense'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
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
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date">Due Date (Optional)</Label>
              <Input
                id="due_date"
                name="due_date"
                type="date"
                defaultValue={payout?.due_date || ''}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="category_id">Category</Label>
            <Select name="category_id" value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    <div className="flex items-center gap-2">
                      {category.icon && <span>{category.icon}</span>}
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: category.color }}
                      />
                      <span>{category.name}</span>
                      {category.target_amount && (
                        <span className="text-muted-foreground text-xs">
                          (₱{category.target_amount.toLocaleString()})
                        </span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Amount (₱)</Label>
              <Input
                id="amount"
                name="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                defaultValue={payout?.amount}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Payment Status</Label>
              <Select name="status" value={status} onValueChange={(value) => setStatus(value as typeof status)} required>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {statusOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${option.color}`} />
                        {option.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              name="notes"
              placeholder="Add any notes about this payout..."
              defaultValue={payout?.notes || ''}
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {payout ? 'Update Payout' : 'Create Payout'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            {payout && (
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
