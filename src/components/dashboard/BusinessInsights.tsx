import { Award, MapPin, CalendarDays, Tags } from 'lucide-react';
import type { NamedAggregate, SalesAggregate } from '../../types/sales';
import { calculateAveragePrice } from '../../utils/analytics';
import { formatCompactCurrency, formatPrice } from '../../utils/formatters';

interface Props { brands: NamedAggregate[]; states: NamedAggregate[]; months: NamedAggregate[]; summary: SalesAggregate; }

export function BusinessInsights({ brands, states, months, summary }: Props) {
  const bestMonth = [...months].sort((a, b) => b.revenue - a.revenue)[0];
  const insights = [
    { icon: <Award size={18} />, label: 'TOP PERFORMING BRAND', value: brands[0]?.name ?? '—', detail: brands[0] ? `${formatCompactCurrency(brands[0].revenue)} in revenue` : 'No matching sales' },
    { icon: <MapPin size={18} />, label: 'TOP PERFORMING STATE', value: states[0]?.name ?? '—', detail: states[0] ? `${formatCompactCurrency(states[0].revenue)} in revenue` : 'No matching sales' },
    { icon: <CalendarDays size={18} />, label: 'BEST SALES MONTH', value: bestMonth?.name ?? '—', detail: bestMonth ? `${formatCompactCurrency(bestMonth.revenue)} in revenue` : 'No matching sales' },
    { icon: <Tags size={18} />, label: 'AVG. SELLING PRICE', value: summary.count ? formatPrice(calculateAveragePrice(summary)) : '—', detail: 'Revenue ÷ units sold' },
  ];
  return <section className="insights-section" aria-labelledby="insights-title"><div className="insights-heading"><div><span className="section-kicker">DATA-DRIVEN TAKEAWAYS</span><h2 id="insights-title">Business Insights</h2></div><p>Automatically recalculated from your current selection.</p></div>
    <div className="insight-grid">{insights.map((item) => <article className="insight-card" key={item.label}><span className="insight-icon">{item.icon}</span><span className="insight-label">{item.label}</span><strong>{item.value}</strong><small>{item.detail}</small></article>)}</div>
  </section>;
}
