/**
 * ADATRACK Formatter Utilities
 * 
 * Provides centralized formatting logic for dates, numbers, and currencies
 * to ensure consistency and support internationalization (i18n).
 */

/**
 * Format a number as IDR currency.
 * e.g., 1500000 -> Rp 1.500.000
 */
export function formatCurrency(amount: number | null | undefined, locale = 'id-ID'): string {
  if (amount === null || amount === undefined || isNaN(amount)) return 'Rp 0';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format a number with thousand separators.
 * e.g., 1500000 -> 1.500.000
 */
export function formatNumber(value: number | null | undefined, locale = 'id-ID'): string {
  if (value === null || value === undefined || isNaN(value)) return '0';
  return new Intl.NumberFormat(locale).format(value);
}

/**
 * Format an ISO string to a local date string (without time).
 * e.g., 2024-09-15T10:00:00Z -> 15 Sep 2024
 */
export function formatDate(isoString: string | null | undefined, locale = 'id-ID'): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';
    
    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).format(date);
  } catch (e) {
    return '-';
  }
}

/**
 * Format an ISO string to a local time string (without date).
 * e.g., 2024-09-15T10:30:00Z -> 10:30
 */
export function formatTime(isoString: string | null | undefined, locale = 'id-ID'): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return '-';
  }
}

/**
 * Format an ISO string to a full datetime string.
 * e.g., 2024-09-15T10:30:00Z -> 15 Sep 2024, 10:30
 */
export function formatDateTime(isoString: string | null | undefined, locale = 'id-ID'): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return '-';

    return new Intl.DateTimeFormat(locale, {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).format(date);
  } catch (e) {
    return '-';
  }
}
