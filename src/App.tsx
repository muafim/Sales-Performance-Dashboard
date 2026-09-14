import { lazy, Suspense, useEffect, useMemo, useState } from 'react';
import { DollarSign, Package, ReceiptText } from 'lucide-react';
import demoData from './data/demoSalesData.json';
import { DashboardHeader } from './components/dashboard/DashboardHeader';
import { FilterBar } from './components/dashboard/FilterBar';
import { KpiCard } from './components/dashboard/KpiCard';
import { TargetComparison } from './components/dashboard/TargetComparison';
import { BusinessInsights } from './components/dashboard/BusinessInsights';
import { CaseStudy } from './components/dashboard/CaseStudy';
import { useDashboardFilters } from './hooks/useDashboardFilters';
import type { SalesRecord } from './types/sales';
import { aggregateByBrand, aggregateByMonth, aggregateByState, calculateAveragePrice, summarize } from './utils/analytics';
import { formatCompactCurrency, formatCompactNumber, formatPrice } from './utils/formatters';

const RevenueByMonthChart = lazy(() => import('./components/dashboard/RevenueByMonthChart').then((module) => ({ default: module.RevenueByMonthChart })));
const RevenueByBrandChart = lazy(() => import('./components/dashboard/RevenueByBrandChart').then((module) => ({ default: module.RevenueByBrandChart })));
const RevenueByStateMap = lazy(() => import('./components/dashboard/RevenueByStateMap').then((module) => ({ default: module.RevenueByStateMap })));

function Dashboard({ records, source }: { records: SalesRecord[]; source: 'demo' | 'local' }) {
  const filters = useDashboardFilters(records);
  const analysis = useMemo(() => {
    const rows = filters.filteredRecords;
    return { summary: summarize(rows), months: aggregateByMonth(rows), brands: aggregateByBrand(rows), states: aggregateByState(rows) };
  }, [filters.filteredRecords]);
  const visibleMonths = filters.months.size ? analysis.months.filter((_, index) => filters.months.has(index + 1)) : analysis.months;
  const hasData = analysis.summary.count > 0;
  return <div className="site-shell">
    <DashboardHeader onReset={filters.resetFilters} activeCount={filters.brands.size + filters.months.size} source={source} />
    <main>
      <FilterBar {...filters} />
      <section className="kpi-grid" aria-label="Key performance indicators">
        <KpiCard label="Total Revenue" value={hasData ? formatCompactCurrency(analysis.summary.revenue) : '—'} icon={<DollarSign size={20} />} note="Sum of price × units sold" accent />
        <KpiCard label="Units Sold" value={hasData ? formatCompactNumber(analysis.summary.unitsSold) : '—'} icon={<Package size={20} />} note="Total quantity across selected sales" />
        <KpiCard label="Price (Power BI)" value={hasData ? formatCompactCurrency(analysis.summary.sumPricePerUnit) : '—'} icon={<ReceiptText size={20} />} note={`Sum of unit prices · Avg. selling price ${hasData ? formatPrice(calculateAveragePrice(analysis.summary)) : '—'}`} />
      </section>
      <TargetComparison summary={analysis.summary} selectedMonthCount={filters.months.size} hasData={hasData} />
      <Suspense fallback={<div className="card empty-chart" role="status">Loading visualizations…</div>}>
        <div className="analysis-grid"><RevenueByMonthChart data={visibleMonths} hasData={hasData} /><RevenueByBrandChart data={analysis.brands} /></div>
        <RevenueByStateMap data={analysis.states} totalRevenue={analysis.summary.revenue} />
      </Suspense>
      <BusinessInsights brands={analysis.brands} states={analysis.states} months={visibleMonths.filter((item) => item.count > 0)} summary={analysis.summary} />
      <CaseStudy />
    </main>
    <footer className="footer"><span>Sales Performance Dashboard</span><span>{source === 'demo' ? 'Synthetic data · Portfolio demonstration' : 'Local licensed data · Keep private'}</span></footer>
  </div>;
}

export default function App() {
  const wantsLocal = new URLSearchParams(window.location.search).get('data') === 'local';
  const [records, setRecords] = useState<SalesRecord[]>(demoData as SalesRecord[]);
  const [source, setSource] = useState<'demo' | 'local'>('demo');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    if (!wantsLocal) return;
    fetch(`${import.meta.env.BASE_URL}local-sales-data.json`)
      .then((response) => { if (!response.ok) throw new Error('Local dataset unavailable'); return response.json() as Promise<SalesRecord[]>; })
      .then((data) => { setRecords(data); setSource('local'); })
      .catch(() => setNotice('Local data was not found. Showing the synthetic demonstration dataset.'));
  }, [wantsLocal]);
  return <>{notice && <div className="notice" role="status">{notice}</div>}<Dashboard records={records} source={source} /></>;
}
