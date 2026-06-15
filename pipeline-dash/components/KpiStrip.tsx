import type { DashboardVals } from '@/lib/compute';

const MONO = "'IBM Plex Mono', monospace";

function KpiCard({ accentColor, label, value, deltaLabel, deltaColor, subLabel }: {
  accentColor: string; label: string; value: React.ReactNode;
  deltaLabel: string; deltaColor: string; subLabel: string;
}) {
  return (
    <div style={{ flex: 1, minWidth: 170, background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: accentColor, opacity: 0.8 }}/>
      <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600 }}>{label}</div>
      <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 600, marginTop: 8, lineHeight: 1 }}>{value}</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: deltaColor, whiteSpace: 'nowrap' }}>{deltaLabel}</span>
        <span style={{ fontSize: 11.5, color: '#5A6473' }}>{subLabel}</span>
      </div>
    </div>
  );
}

export default function KpiStrip({ vals }: { vals: DashboardVals }) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      <KpiCard
        accentColor="#6EA8FF" label="In Pipeline"
        value={vals.inPipeline}
        deltaLabel={vals.deltaPipeline.label} deltaColor={vals.deltaPipeline.color}
        subLabel="vs yesterday"
      />
      <KpiCard
        accentColor="#B79CFF" label="Cycle Time"
        value={vals.cycleLabel}
        deltaLabel={vals.deltaCycle.label} deltaColor={vals.deltaCycle.color}
        subLabel="vs 7d avg"
      />
      <div style={{ flex: 1, minWidth: 160, background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#34D399', opacity: 0.8 }}/>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600 }}>Posted Today</div>
        <div style={{ fontFamily: MONO, fontSize: 34, fontWeight: 600, marginTop: 8, lineHeight: 1, color: '#34D399' }}>{vals.today.posted}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: '#7d8799' }}>{vals.postedRecent}</span>
          <span style={{ fontSize: 11.5, color: '#5A6473' }}>in last 7d</span>
        </div>
      </div>
      <div style={{ flex: 1, minWidth: 160, background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '16px 18px', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: '#FB5779', opacity: 0.8 }}/>
        <div style={{ fontSize: 11, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600 }}>Bottleneck</div>
        <div style={{ fontFamily: MONO, fontSize: 22, fontWeight: 600, marginTop: 8, lineHeight: 1.2, color: '#FB5779' }}>{vals.bottleneckLabel}</div>
        <div style={{ fontSize: 11.5, color: '#9aa6b6', marginTop: 6, lineHeight: 1.3 }}>{vals.bottleneckName}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
          <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: vals.deltaBottleneck.color, whiteSpace: 'nowrap' }}>{vals.deltaBottleneck.label}</span>
          <span style={{ fontSize: 11.5, color: '#5A6473' }}>vs yesterday</span>
        </div>
      </div>
    </div>
  );
}
