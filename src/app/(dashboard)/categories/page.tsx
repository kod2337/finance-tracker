import Link from 'next/link';
import { formatCurrency } from '@/lib/utils';
import { getPayoutCategories } from '@/lib/actions/payout-categories';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default async function CategoriesPage() {
  const categories = await getPayoutCategories();

  const getTypeBadge = (type: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'outline'> = {
      savings: 'default',
      obligation: 'secondary',
      personal: 'outline',
      expense: 'outline',
      other: 'outline',
    };
    return variants[type] || 'outline';
  };

  return (
    <div className="container mx-auto py-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Payout Categories</h1>
          <p className="text-muted-foreground mt-1">
            Manage your payout and expense categories
          </p>
        </div>
        <Button asChild size="sm">
          <Link href="/categories/new">Add Category</Link>
        </Button>
      </div>

      <div className="border rounded-lg overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Monthly Target</TableHead>
              <TableHead>Color</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {categories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-10 text-muted-foreground">
                  No categories yet. Add one to get started!
                </TableCell>
              </TableRow>
            ) : (
              categories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {category.icon && <span className="text-lg">{category.icon}</span>}
                      {category.name}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getTypeBadge(category.type)}>
                      {category.type}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {category.target_amount ? formatCurrency(category.target_amount) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div
                        className="w-6 h-6 rounded-full border"
                        style={{ backgroundColor: category.color }}
                      />
                      <span className="text-xs text-muted-foreground">{category.color}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`/categories/${category.id}`}>Edit</Link>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
