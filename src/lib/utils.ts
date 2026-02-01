import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format amount as currency
 * @param amount - The amount to format
 * @param currency - Currency code (default: PHP)
 */
export function formatCurrency(
  amount: number,
  currency: string = "PHP"
): string {
  return new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}
