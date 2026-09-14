import type { SalesAggregate } from '../../types/sales';
import { calculateAveragePrice, MONTHLY_TARGETS } from '../../utils/analytics';
import { formatCompactCurrency, formatCompactNumber, formatPercent, formatPrice } from '../../utils/formatters';

interface Props { summary: SalesAggregate; selectedMonthCount: number; hasData: boolean; }

export function TargetComparison({ summary, selectedMonthCount, hasData }: Props) {
  const monthCount = selectedMonthCount || 12;
  const rows = [
    { label: 'Revenue', value: summary.revenue, target: MONTHLY_TARGETS.revenue * monthCount, display: formatCompactCurrency(summary.revenue) },
    { label: 'Units sold', value: summary.unitsSold, target: MONTHLY_TARGETS.unitsSold * monthCount, display: formatCompactNumber(summary.unitsSold) },
    { label: 'Avg. price', value: calculateAveragePrice(summary), target: MONTHLY_TARGETS.averagePrice, display: formatPrice(calculateAveragePrice(summary)) },
  ];
  return <section className="card targets-card" aria-labelledby="targets-title">
    <div className="section-head"><div><span className="section-kicker">PERFORMANCE BENCHMARKS</span><h2 id="targets-title">Target comparison</h2></div><span className="subtle-pill">{monthCount} {monthCount === 1 ? 'month' : 'months'}</span></div>
    <p className="section-description">Monthly revenue and quantity targets scale with the selected period. Average price stays at its monthly benchmark.</p>
    <div className="target-grid">{rows.map((row) => {
      const ratio = hasData && row.target ? row.value / row.target : 0;
      return <div className="target-item" key={row.label}>
        <div className="target-row"><span>{row.label}</span><strong>{hasData ? row.display : '—'}</strong></div>
        <div className="progress-track" role="progressbar" aria-label={`${row.label} target attainment`} aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.min(100, Math.round(ratio * 100))}><span style={{ width: `${Math.min(100, ratio * 100)}%` }} /></div>
        <div className="target-detail"><span>{hasData ? `${formatPercent(ratio)} of target` : 'No data'}</span><span>Target {row.label === 'Avg. price' ? formatPrice(row.target) : row.label === 'Revenue' ? formatCompactCurrency(row.target) : formatCompactNumber(row.target)}</span></div>
      </div>;
    })}</div>
  </section>;
}
