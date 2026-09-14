import { useState } from 'react';
import { ComposableMap, Geographies, Geography } from 'react-simple-maps/core';
import usAtlas from 'us-atlas/states-10m.json';
import type { NamedAggregate } from '../../types/sales';
import { formatCompactCurrency, formatCurrency, formatNumber, formatPercent } from '../../utils/formatters';

interface Props { data: NamedAggregate[]; totalRevenue: number; }

export function RevenueByStateMap({ data, totalRevenue }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);
  const byState = new Map(data.map((item) => [item.name, item]));
  const max = Math.max(0, ...data.map((item) => item.revenue));
  const selected = hovered ? byState.get(hovered) : data[0];
  return <section className="card map-card" aria-labelledby="state-map-title">
    <div className="section-head"><div><span className="section-kicker">GEOGRAPHIC PERFORMANCE</span><h2 id="state-map-title">Revenue by State</h2></div><span className="subtle-pill">U.S. coverage</span></div>
    <p className="section-description">Darker states contribute more revenue. Hover or focus a state for details.</p>
    <div className="map-wrap"><ComposableMap projection="geoAlbersUsa" projectionConfig={{ scale: 940 }} width={980} height={600} style={{ width: '100%', height: 'auto' }} role="img" aria-label="Choropleth map of U.S. sales revenue by state">
      {/* v5 accepts bundled TopoJSON at runtime, although its geography type lists GeoJSON only. */}
      <Geographies geography={usAtlas as unknown as React.ComponentProps<typeof Geographies>['geography']}>
        {({ geographies }) => geographies.map((geo) => {
          const name = String(geo.properties?.name ?? 'Unknown state');
          const revenue = byState.get(name)?.revenue ?? 0;
          const intensity = max > 0 ? revenue / max : 0;
          const fill = revenue === 0 ? '#EDF1F6' : `rgba(17, 141, 255, ${0.21 + intensity * 0.74})`;
          return <Geography key={geo.rsmKey} geography={geo} fill={fill} stroke="#FFFFFF" strokeWidth={1.4}
            onMouseEnter={() => setHovered(name)} onMouseLeave={() => setHovered(null)}
            onFocus={() => setHovered(name)} onBlur={() => setHovered(null)}
            tabIndex={0} aria-label={`${name}: ${formatCurrency(revenue)} revenue`}
            style={{ outline: 'none', cursor: 'pointer' }} />;
        })}
      </Geographies>
    </ComposableMap></div>
    <div className="map-footer"><div className="map-key"><span>Lower</span><div className="map-gradient" /><span>Higher revenue</span></div>
      <div className="map-detail" aria-live="polite">{selected ? <><strong>{selected.name}</strong><span>{formatCompactCurrency(selected.revenue)} revenue</span><span>{formatNumber(selected.unitsSold)} units</span><span>{formatPercent(totalRevenue > 0 ? selected.revenue / totalRevenue : 0)} share</span></> : <span>No data available for the selected filters.</span>}</div>
    </div>
  </section>;
}
