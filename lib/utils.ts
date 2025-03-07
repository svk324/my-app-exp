// lib/utils.ts
import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { format } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(amount);
}

export function formatDate(date: Date): string {
  return format(date, "dd MMM yyyy");
}

export function getCurrentYear(): number {
  return new Date().getFullYear();
}

export function calculateYearProgress(): number {
  const now = new Date();
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const endOfYear = new Date(now.getFullYear() + 1, 0, 1);

  const totalMilliseconds = endOfYear.getTime() - startOfYear.getTime();
  const elapsedMilliseconds = now.getTime() - startOfYear.getTime();

  return (elapsedMilliseconds / totalMilliseconds) * 100;
}

export function parseAmount(amount: string): number {
  return parseFloat(amount.replace(/[^\d.-]/g, ""));
}
