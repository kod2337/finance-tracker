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
import { createIncomeSourceAction, updateIncomeSourceAction, deleteIncomeSourceAction } from '@/lib/actions/income-source-actions';
import type { IncomeSource } from '@/lib/actions/income-sources';

interface IncomeSourceFormProps {
  source?: IncomeSource;
}

const INCOME_TYPES = [
  { value: 'salary', label: 'Salary' },
  { value: 'freelance', label: 'Freelance' },
  { value: 'business', label: 'Business' },
  { value: 'investment', label: 'Investment' },
  { value: 'other', label: 'Other' },
] as const;

type IncomeType = 'salary' | 'freelance' | 'business' | 'investment' | 'other';

const DEFAULT_COLORS = [
  '#3B82F6', '#22C55E', '#EAB308', '#EF4444', '#8B5CF6',
  '#EC4899', '#F97316', '#14B8A6', '#6366F1', '#84CC16'
];

export function IncomeSourceForm({ source }: IncomeSourceFormProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectedColor, setSelectedColor] = useState(source?.color || DEFAULT_COLORS[0]);
  const [selectedType, setSelectedType] = useState<IncomeType>(source?.type || 'salary');
  const [isActive, setIsActive] = useState(source?.is_active ?? true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    if (source) {
      await updateIncomeSourceAction(source.id, formData);
    } else {
      await createIncomeSourceAction(formData);
    }
  };

  const handleDelete = async () => {
    if (!source) return;
    if (!confirm('Are you sure you want to delete this income source?')) return;
    
    setIsDeleting(true);
    await deleteIncomeSourceAction(source.id);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{source ? 'Edit' : 'Create'} Income Source</CardTitle>
        <CardDescription>
          {source ? 'Update the details of your income source' : 'Add a new income source to track'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="e.g., Main Job, Side Hustle"
              defaultValue={source?.name}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="type">Type</Label>
            <Select
              name="type"
              value={selectedType}
              onValueChange={(value) => setSelectedType(value as IncomeType)}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select type" />
              </SelectTrigger>
              <SelectContent>
                {INCOME_TYPES.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    {type.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="color">Color</Label>
            <div className="flex items-center gap-2">
              <Input
                id="color"
                name="color"
                type="color"
                value={selectedColor}
                onChange={(e) => setSelectedColor(e.target.value)}
                className="w-20 h-10"
                required
              />
              <div className="flex gap-1">
                {DEFAULT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    className="w-8 h-8 rounded border-2 hover:scale-110 transition-transform"
                    style={{ 
                      backgroundColor: color,
                      borderColor: selectedColor === color ? '#000' : 'transparent'
                    }}
                    onClick={() => setSelectedColor(color)}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              value="true"
              checked={isActive}
              onChange={(e) => setIsActive(e.target.checked)}
              className="w-4 h-4"
            />
            <Label htmlFor="is_active" className="cursor-pointer">
              Active (can be used for new income entries)
            </Label>
          </div>

          <div className="flex gap-2">
            <Button type="submit" className="flex-1">
              {source ? 'Update' : 'Create'} Source
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.back()}
            >
              Cancel
            </Button>
            {source && (
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
