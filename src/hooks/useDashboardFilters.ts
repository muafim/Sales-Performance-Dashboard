import { useMemo, useState } from 'react';
import type { SalesRecord } from '../types/sales';
import { filterSalesData } from '../utils/analytics';

export function useDashboardFilters(records: SalesRecord[]) {
  const [brands, setBrands] = useState<Set<string>>(new Set());
  const [months, setMonths] = useState<Set<number>>(new Set());
  const availableBrands = useMemo(() => [...new Set(records.map((record) => record.beverageBrand))].sort(), [records]);
  const filteredRecords = useMemo(() => filterSalesData(records, brands, months), [records, brands, months]);
  const toggleBrand = (brand: string) => setBrands((current) => {
    const next = new Set(current);
    if (next.has(brand)) next.delete(brand); else next.add(brand);
    return next;
  });
  const toggleMonth = (month: number) => setMonths((current) => {
    const next = new Set(current);
    if (next.has(month)) next.delete(month); else next.add(month);
    return next;
  });
  const resetFilters = () => { setBrands(new Set()); setMonths(new Set()); };
  return { brands, months, availableBrands, filteredRecords, toggleBrand, toggleMonth, resetFilters };
}
