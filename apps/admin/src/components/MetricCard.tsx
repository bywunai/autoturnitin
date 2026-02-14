interface MetricCardProps {
  label: string;
  value: string;
  trend?: string;
  accent?: string;
}

export function MetricCard({ label, value, trend, accent }: MetricCardProps) {
  return (
    <article className="metric-card" style={{ borderTop: `3px solid ${accent ?? '#38bdf8'}` }}>
      <p style={{ color: '#94a3b8', margin: 0 }}>{label}</p>
      <div className="metric-value">{value}</div>
      {trend && <small style={{ color: accent ?? '#38bdf8' }}>{trend}</small>}
    </article>
  );
}
