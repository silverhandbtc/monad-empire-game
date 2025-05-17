import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(2)}T`;
  } else if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(2)}B`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(2)}M`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(2)}K`;
  } else {
    return amount.toFixed(2);
  }
}

export function formatNumber(amount: number): string {
  if (amount === undefined || amount === null) {
    return '0';
  }

  if (amount >= 1e15) {
    return `${(amount / 1e15).toFixed(2)}Q`;
  } else if (amount >= 1e12) {
    return `${(amount / 1e12).toFixed(2)}T`;
  } else if (amount >= 1e9) {
    return `${(amount / 1e9).toFixed(2)}B`;
  } else if (amount >= 1e6) {
    return `${(amount / 1e6).toFixed(2)}M`;
  } else if (amount >= 1e3) {
    return `${(amount / 1e3).toFixed(2)}K`;
  } else {
    return amount.toFixed(0);
  }
}
