import type { DashboardVals } from '@/lib/compute';

const MONO = "'IBM Plex Mono', monospace";
type Metric = DashboardVals['customMetrics'][0];

function MetricCard({ m }: { m: Metric }) {
  return (
    <div style={{ flex: 1, minWidth: 280, background: '#0E131C', border: '1px solid #1E2632', borderRadius: 12, padding: '14px 16px', display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: '#E8EDF4' }}>{m.title}</div>
        <div style={{ fontSize: 11, color: '#5A6473', marginTop: 2 }}>{m.subtitle}</div>
      </div>
      {/* Bar */}
      <div style={{ display: 'flex', height: 8, borderRadius: 4, overflow: 'hidden', gap: 2 }}>
        <div style={{ flex: m.boyPct, background: '#6EA8FF', borderRadius: '4px 0 0 4px', transition: 'flex 0.4s ease' }}/>
        <div style={{ flex: m.girlPct, background: '#FB7185', borderRadius: '0 4px 4px 0', transition: 'flex 0.4s ease' }}/>
      </div>
      {/* Counts */}
      <div style={{ display: 'flex', gap: 16 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#6EA8FF', fontWeight: 600 }}>Boy</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: '#6EA8FF' }}>{m.boy}</span>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: m.boyVsColor }}>{m.boyVsLabel}</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 11, color: '#8A95A6' }}>{m.boyPct}%</span>
        </div>
        <div style={{ width: 1, background: '#1E2632', alignSelf: 'stretch' }}/>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#FB7185', fontWeight: 600 }}>Girl</span>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
            <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: '#FB7185' }}>{m.girl}</span>
            <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: m.girlVsColor }}>{m.girlVsLabel}</span>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 11, color: '#8A95A6' }}>{m.girlPct}%</span>
        </div>
        <div style={{ marginLeft: 'auto', display: 'flex', flexDirection: 'column', gap: 3, alignItems: 'flex-end' }}>
          <span style={{ fontSize: 10, color: '#5A6473' }}>Total</span>
          <span style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, color: '#9aa6b6' }}>{m.total}</span>
        </div>
      </div>
    </div>
  );
}

export default function CustomMetrics({ metrics }: { metrics: DashboardVals['customMetrics'] }) {
  if (!metrics.length) return null;
  return (
    <div style={{ background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '18px 20px' }}>
      <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600, marginBottom: 14 }}>
        Custom Metrics
      </div>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {metrics.map((m, i) => <MetricCard key={i} m={m} />)}
      </div>
    </div>
  );
}
