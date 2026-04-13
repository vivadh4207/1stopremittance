import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency: string = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(Number(amount));
}

export function formatDate(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy');
}

export function formatDateTime(date: string | Date): string {
  return format(new Date(date), 'MMM dd, yyyy HH:mm');
}

export function formatRelativeTime(date: string | Date): string {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    COMPLETED: 'green',
    PENDING: 'yellow',
    PROCESSING: 'blue',
    FAILED: 'red',
    CANCELLED: 'gray',
    APPROVED: 'green',
    REJECTED: 'red',
    SUBMITTED: 'blue',
  };
  return colors[status] || 'gray';
}

export const SUPPORTED_CURRENCIES = [
  'USD', 'KES', 'GHS', 'NGN', 'PHP', 'INR', 'MXN', 'GBP', 'EUR', 'CAD', 'AUD',
];

export const SUPPORTED_COUNTRIES = [
  { code: 'KE', name: 'Kenya', currency: 'KES' },
  { code: 'GH', name: 'Ghana', currency: 'GHS' },
  { code: 'NG', name: 'Nigeria', currency: 'NGN' },
  { code: 'PH', name: 'Philippines', currency: 'PHP' },
  { code: 'IN', name: 'India', currency: 'INR' },
  { code: 'MX', name: 'Mexico', currency: 'MXN' },
  { code: 'GB', name: 'United Kingdom', currency: 'GBP' },
  { code: 'EU', name: 'European Union', currency: 'EUR' },
  { code: 'CA', name: 'Canada', currency: 'CAD' },
  { code: 'AU', name: 'Australia', currency: 'AUD' },
  { code: 'US', name: 'United States', currency: 'USD' },
];

export const COUNTRY_FLAGS: Record<string, string> = {
  KE: '🇰🇪',
  GH: '🇬🇭',
  NG: '🇳🇬',
  PH: '🇵🇭',
  IN: '🇮🇳',
  MX: '🇲🇽',
  GB: '🇬🇧',
  EU: '🇪🇺',
  CA: '🇨🇦',
  AU: '🇦🇺',
  US: '🇺🇸',
};

export function getCountryFlag(countryCode: string): string {
  return COUNTRY_FLAGS[countryCode] || '🌍';
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}
