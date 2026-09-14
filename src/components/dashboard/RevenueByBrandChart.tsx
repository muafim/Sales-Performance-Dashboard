import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import type { NamedAggregate } from '../../types/sales';
import { formatCompactCurrency, formatCurrency } from '../../utils/formatters';

interface Props { data: NamedAggregate[]; }

export function RevenueByBrandChart({ data }: Props) {
  return <section className="card brand-card" aria-labelledby="brand-chart-title">
    <div className="section-head"><div><span className="section-kicker">PRODUCT MIX</span><h2 id="brand-chart-title">Revenue by Beverage Brand</h2></div></div>
    <p className="section-description">Ranked by revenue for the current selection.</p>
    {data.length > 0 ? <div className="brand-chart-wrap"><ResponsiveContainer width="100%" height="100%"><BarChart data={data} layout="vertical" margin={{ top: 0, right: 16, bottom: 0, left: 8 }} barCategoryGap="32%">
      <CartesianGrid horizontal={false} stroke="#E8EDF4" strokeDasharray="3 5" />
      <XAxis type="number" tickFormatter={formatCompactCurrency} tickLine={false} axisLine={false} tick={{ fill: '#718096', fontSize: 11 }} />
      <YAxis type="category" dataKey="name" width={105} tickLine={false} axisLine={false} tick={{ fill: '#465568', fontSize: 12 }} />
      <Tooltip cursor={{ fill: '#F2F7FF' }} formatter={(value) => [formatCurrency(Number(value ?? 0)), 'Revenue']} />
      <Bar dataKey="revenue" fill="#12239E" radius={[0, 5, 5, 0]} maxBarSize={22} />
    </BarChart></ResponsiveContainer></div> : <div className="empty-chart">No data available for the selected filters.</div>}
  </section>;
}
