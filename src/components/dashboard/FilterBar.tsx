import { Filter, X } from 'lucide-react';
import { MONTHS } from '../../utils/analytics';

interface Props {
  brands: Set<string>;
  months: Set<number>;
  availableBrands: string[];
  toggleBrand: (brand: string) => void;
  toggleMonth: (month: number) => void;
  resetFilters: () => void;
}

export function FilterBar({ brands, months, availableBrands, toggleBrand, toggleMonth, resetFilters }: Props) {
  const activeCount = brands.size + months.size;
  return <section className="filter-panel" aria-label="Dashboard filters">
    <div className="filter-heading"><div><Filter size={17} /><h2>Explore the data</h2><span className="filter-count">{activeCount ? `${activeCount} selected` : 'All sales'}</span></div>
      {activeCount > 0 && <button className="text-button" onClick={resetFilters} type="button"><X size={14} /> Clear all</button>}
    </div>
    <div className="filter-groups">
      <div className="filter-group"><span className="filter-label">BEVERAGE BRAND</span><div className="chips" role="group" aria-label="Filter by beverage brand">
        {availableBrands.map((brand) => <button key={brand} type="button" className={`chip ${brands.has(brand) ? 'selected' : ''}`} aria-pressed={brands.has(brand)} onClick={() => toggleBrand(brand)}>{brand}</button>)}
      </div></div>
      <div className="filter-group month-filter"><span className="filter-label">MONTH</span><div className="chips" role="group" aria-label="Filter by month">
        {MONTHS.map((name, index) => <button key={name} type="button" className={`chip month-chip ${months.has(index + 1) ? 'selected' : ''}`} aria-pressed={months.has(index + 1)} onClick={() => toggleMonth(index + 1)}>{name}</button>)}
      </div></div>
    </div>
  </section>;
}
