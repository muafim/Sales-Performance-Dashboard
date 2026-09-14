import type { NamedAggregate, SalesAggregate, SalesRecord } from '../types/sales';

export const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const;
export const MONTHLY_TARGETS = { revenue: 1_000_000, unitsSold: 1_500_000, averagePrice: 0.65 } as const;

export const calculateRevenue = (record: Pick<SalesRecord, 'pricePerUnit' | 'unitsSold'>): number =>
  record.pricePerUnit * record.unitsSold;

export const calculateAveragePrice = (aggregate: Pick<SalesAggregate, 'revenue' | 'unitsSold'>): number =>
  aggregate.unitsSold > 0 ? aggregate.revenue / aggregate.unitsSold : 0;

export function filterSalesData(records: SalesRecord[], brands: Set<string>, months: Set<number>): SalesRecord[] {
  return records.filter((record) =>
    (brands.size === 0 || brands.has(record.beverageBrand)) &&
    (months.size === 0 || months.has(record.month)));
}

export function summarize(records: SalesRecord[]): SalesAggregate {
  return records.reduce<SalesAggregate>((total, record) => {
    total.revenue += record.revenue;
    total.unitsSold += record.unitsSold;
    total.sumPricePerUnit += record.pricePerUnit;
    total.count++;
    return total;
  }, { revenue: 0, unitsSold: 0, sumPricePerUnit: 0, count: 0 });
}

function aggregateBy(records: SalesRecord[], key: (record: SalesRecord) => string): NamedAggregate[] {
  const groups = new Map<string, SalesRecord[]>();
  for (const record of records) {
    const name = key(record);
    const group = groups.get(name) ?? [];
    group.push(record);
    groups.set(name, group);
  }
  return [...groups].map(([name, rows]) => ({ name, ...summarize(rows) }));
}

export function aggregateByMonth(records: SalesRecord[]): NamedAggregate[] {
  const byMonth = new Map(aggregateBy(records, (record) => record.monthName).map((item) => [item.name, item]));
  return MONTHS.map((name) => byMonth.get(name) ?? { name, revenue: 0, unitsSold: 0, sumPricePerUnit: 0, count: 0 });
}

export const aggregateByBrand = (records: SalesRecord[]): NamedAggregate[] =>
  aggregateBy(records, (record) => record.beverageBrand).sort((a, b) => b.revenue - a.revenue);

export const aggregateByState = (records: SalesRecord[]): NamedAggregate[] =>
  aggregateBy(records, (record) => record.state).sort((a, b) => b.revenue - a.revenue);
