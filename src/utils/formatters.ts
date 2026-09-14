export const formatCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);

export const formatNumber = (value: number): string => new Intl.NumberFormat('en-US').format(value);

export const formatCompactCurrency = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', notation: 'compact', maximumFractionDigits: 2 }).format(value);

export const formatCompactNumber = (value: number): string =>
  new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 2 }).format(value);

export const formatPrice = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(value);

export const formatPercent = (value: number): string =>
  new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 0 }).format(value);
