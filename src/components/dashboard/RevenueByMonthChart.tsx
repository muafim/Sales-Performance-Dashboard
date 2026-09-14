import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NamedAggregate } from '../../types/sales';
import { calculateAveragePrice } from '../../utils/analytics';
import { formatCompactCurrency, formatCurrency, formatNumber, formatPrice } from '../../utils/formatters';

interface Props { data: NamedAggregate[]; hasData: boolean; }

export function RevenueByMonthChart({ data, hasData }: Props) {
  return <section className="card chart-card" aria-labelledby="month-chart-title">
    <div className="section-head"><div><span className="section-kicker">TIME SERIES</span><h2 id="month-chart-title">Revenue by Month</h2></div><span className="chart-legend"><i /> Revenue</span></div>
    <p className="section-description">Monthly sales trend across the selected brands and periods.</p>
    {hasData ? <div className="chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} margin={{ top: 14, right: 8, left: -8, bottom: 0 }} barCategoryGap="30%">
      <CartesianGrid vertical={false} stroke="#E8EDF4" strokeDasharray="3 5" />
      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} dy={10} />
      <YAxis tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 12 }} width={65} />
      <Tooltip cursor={{ fill: '#F2F7FF' }} content={({ active, payload, label }) => {
        if (!active || !payload?.length) return null;
        const item = payload[0].payload as NamedAggregate;
        return <div className="chart-tooltip"><strong>{label}</strong><span>Revenue <b>{formatCurrency(item.revenue)}</b></span><span>Units sold <b>{formatNumber(item.unitsSold)}</b></span><span>Avg. selling price <b>{formatPrice(calculateAveragePrice(item))}</b></span></div>;
      }} />
      <Bar dataKey="revenue" fill="#118DFF" radius={[5, 5, 0, 0]} maxBarSize={46} />
    </BarChart></ResponsiveContainer></div> : <div className="empty-chart">No data available for the selected filters.</div>}
  </section>;
}
