import type { ReactNode } from 'react';

interface Props {
  label: string;
  value: string;
  icon: ReactNode;
  note: string;
  accent?: boolean;
}

export function KpiCard({ label, value, icon, note, accent = false }: Props) {
  return <article className={`kpi-card ${accent ? 'kpi-accent' : ''}`}>
    <div className="kpi-top"><span className="kpi-label">{label}</span><span className="kpi-icon">{icon}</span></div>
    <div className="kpi-value">{value}</div>
    <p className="kpi-note">{note}</p>
  </article>;
}
