import { ArrowUpRight, RotateCcw } from 'lucide-react';

interface Props {
  onReset: () => void;
  activeCount: number;
  source: 'demo' | 'local';
}

export function DashboardHeader({ onReset, activeCount, source }: Props) {
  return <header className="dashboard-header">
    <div>
      <div className="eyebrow-row"><span className="eyebrow">PORTFOLIO PROJECT</span><span className="badge">Power BI → React</span></div>
      <h1>Sales Performance Dashboard</h1>
      <p className="subtitle">Interactive Sales Analytics Dashboard</p>
      <p className="intro">Explore beverage sales performance across brands, months, retailers, and U.S. states.</p>
      <span className="source-label">{source === 'demo' ? 'Synthetic demonstration data' : 'Local workbook data'}</span>
    </div>
    <div className="header-actions">
      <button className="button button-secondary" onClick={onReset} disabled={activeCount === 0} type="button"><RotateCcw size={16} /> Reset filters</button>
      <a className="button button-primary" href="#case-study">About project <ArrowUpRight size={16} /></a>
    </div>
  </header>;
}
