'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { createPayoutCategoryAction, updatePayoutCategoryAction, deletePayoutCategoryAction } from '@/lib/actions/payout-category-actions';
import type { PayoutCategory } from '@/lib/actions/payout-categories';

interface PayoutCategoryFormProps {
  category?: PayoutCategory;
}

const categoryTypes = [
  { value: 'savings', label: 'Savings' },
  { value: 'obligation', label: 'Obligation' },
  { value: 'personal', label: 'Personal' },
  { value: 'expense', label: 'Expense' },
  { value: 'other', label: 'Other' },
];

const predefinedColors = [
  '#22C55E', // Green
  '#3B82F6', // Blue
  '#EAB308', // Yellow
  '#EF4444', // Red
  '#8B5CF6', // Purple
  '#EC4899', // Pink
  '#F97316', // Orange
  '#14B8A6', // Teal
];

export function PayoutCategoryForm({ category }: PayoutCategoryFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(category?.color || predefinedColors[0]);
  const [selectedType, setSelectedType] = useState<'savings' | 'obligation' | 'personal' | 'expense' | 'other'>(
    category?.type || 'savings'
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (category) {
      await updatePayoutCategoryAction(category.id, formData);
    } else {
      await createPayoutCategoryAction(formData);
    }
  };

  const handleDelete = async () => {
    if (!category) return;
    if (!confirm('Are you sure you want to delete this category? This will also delete all associated payouts.')) return;
    
    setIsDeleting(true);
    await deletePayoutCategoryAction(category.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{category ? 'Edit' : 'Add'} Payout Category</CardTitle>
        <CardDescription>
          {category ? 'Update the details of this payout category' : 'Create a new payout category for tracking expenses'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Category Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Savings, Parents, Pocket Money"
              defaultValue={category?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Category Type</Label>
            <Select name="type" value={selectedType} onValueChange={(value) => setSelectedType(value as typeof selectedType)} required>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categoryTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="target_amount">Monthly Target Amount (₱)</Label>
            <Input
              id="target_amount"
              name="target_amount"
              type="number"
              step="0.01"
              min="0"
              placeholder="Optional monthly target"
              defaultValue={category?.target_amount || ''}
            />
            <p className="text-sm text-muted-foreground">
              Set a monthly target to track progress
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="icon">Icon (Optional)</Label>
            <Input
              id="icon"
              name="icon"
              placeholder="e.g., 💰, 🏦, 👨‍👩‍👧‍👦"
              defaultValue={category?.icon || ''}
              maxLength={10}
            />
            <p className="text-sm text-muted-foreground">
              Add an emoji or short text as icon
            </p>
          </div>

          <div className="space-y-2">
            <Label>Color</Label>
            <div className="grid grid-cols-8 gap-2">
              {predefinedColors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className="w-10 h-10 rounded-md border-2 transition-all"
                  style={{
                    backgroundColor: color,
                    borderColor: selectedColor === color ? '#000' : 'transparent',
                    transform: selectedColor === color ? 'scale(1.1)' : 'scale(1)',
                  }}
                />
              ))}
            </div>
            <Input
              type="hidden"
              name="color"
              value={selectedColor}
            />
            <div className="flex items-center gap-2 mt-2">
              <Label htmlFor="custom-color" className="text-sm">Custom:</Label>
              <Input
                id="custom-color"
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-20 h-10"
              />
              <span className="text-sm text-muted-foreground">{selectedColor}</span>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="submit" className="flex-1">
              {category ? 'Update Category' : 'Create Category'}
            </Button>
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            {category && (
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
