import type { DashboardVals } from '@/lib/compute';

const MONO = "'IBM Plex Mono', monospace";

type HRow = DashboardVals['heatmap'][0];
type SRow = DashboardVals['stageList'][0];

function HeatRow({ row }: { row: HRow }) {
  return (
    <div style={{ display: 'flex', gap: 4, alignItems: 'stretch', minWidth: 0 }}>
      <div style={{ width: 90, flexShrink: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 2, paddingRight: 8 }}>
        <div style={{ fontSize: 9.5, fontWeight: 600, color: row.color, letterSpacing: '0.06em', textTransform: 'uppercase' }}>{row.name.split(' ')[0]}</div>
        <div style={{ fontFamily: MONO, fontSize: 11, color: '#8A95A6' }}>{row.count} cards</div>
      </div>
      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', flex: 1 }}>
        {row.cells.map(cell => (
          <div key={cell._key} style={{
            minWidth: 52, flex: '1 0 52px',
            background: cell.bg,
            border: `1px solid ${cell.isBottleneck ? 'rgba(251,87,121,.6)' : cell.border}`,
            borderRadius: 6, padding: '5px 6px',
            display: 'flex', flexDirection: 'column', gap: 2,
            boxShadow: cell.isBottleneck ? '0 0 0 1px rgba(251,87,121,.25)' : 'none',
          }}>
            <div style={{ fontSize: 9, color: '#7d8799', lineHeight: 1.2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={cell.name}>
              {cell.name}
            </div>
            <div style={{ fontFamily: MONO, fontSize: 13, fontWeight: 600, color: cell.count > 0 ? '#E8EDF4' : '#46505f' }}>{cell.count}</div>
            <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
              <span style={{ fontFamily: MONO, fontSize: 9, color: cell.color }}>{cell.avgShort}</span>
              {cell.deltaLabel && <span style={{ fontFamily: MONO, fontSize: 9, color: cell.deltaColor }}>{cell.deltaLabel}</span>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function StageRow({ row, stageMax }: { row: SRow; stageMax: number }) {
  if (!row.rows.length) return null;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ fontSize: 10, fontWeight: 600, color: row.color, letterSpacing: '0.1em', textTransform: 'uppercase' }}>{row.name}</div>
      {row.rows.map((r, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ flex: 1, height: 18, background: '#1a2230', borderRadius: 3, overflow: 'hidden', position: 'relative' }}>
            <div style={{ position: 'absolute', inset: 0, width: `${r.barPct}%`, background: r.heat, opacity: 0.7, borderRadius: 3 }}/>
            <div style={{ position: 'relative', padding: '1px 6px', fontSize: 10, color: '#E8EDF4', lineHeight: '16px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {r.name}
            </div>
          </div>
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#E8EDF4', width: 28, textAlign: 'right' }}>{r.count}</span>
          <span style={{ fontFamily: MONO, fontSize: 10, color: '#8A95A6', width: 32, textAlign: 'right' }}>{r.dwellLabel}</span>
          {r.deltaLabel && <span style={{ fontFamily: MONO, fontSize: 10, color: r.deltaColor, width: 28, textAlign: 'right' }}>{r.deltaLabel}</span>}
        </div>
      ))}
    </div>
  );
}

export default function Heatmap({ heatmap, stageList, stageMax }: {
  heatmap: DashboardVals['heatmap'];
  stageList: DashboardVals['stageList'];
  stageMax: number;
}) {
  return (
    <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap' }}>
      {/* Heatmap */}
      <div style={{ flex: 2, minWidth: 320, background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600, marginBottom: 14 }}>Stage Heatmap</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {heatmap.map((row, i) => <HeatRow key={i} row={row} />)}
        </div>
      </div>
      {/* Stage list */}
      <div style={{ flex: 1, minWidth: 240, background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '18px 20px' }}>
        <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600, marginBottom: 14 }}>Active Stages</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {stageList.map((row, i) => <StageRow key={i} row={row} stageMax={stageMax} />)}
        </div>
      </div>
    </div>
  );
}
