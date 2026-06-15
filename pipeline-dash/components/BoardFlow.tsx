import type { DashboardVals } from '@/lib/compute';

const MONO = "'IBM Plex Mono', monospace";

type Board = DashboardVals['boardFlow'][0];

function BoardCard({ board }: { board: Board }) {
  return (
    <div style={{
      flex: 1, minWidth: 0, position: 'relative',
      background: '#0E131C',
      border: `1px solid ${board.nodeBorder}`,
      boxShadow: board.nodeShadow,
      borderRadius: 12, padding: '14px 13px 13px',
      display: 'flex', flexDirection: 'column', gap: 10,
    }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, borderRadius: '12px 12px 0 0', background: board.color, opacity: 0.9 }}/>
      <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
        <span style={{ fontSize: 9.5, fontWeight: 600, letterSpacing: '0.08em', color: '#5A6473', textTransform: 'uppercase' }}>Board {board.idx}</span>
        <span style={{ flex: 1, height: 1, background: '#1E2632' }}/>
        {board.isHotspot && (
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: '#FB5779', background: 'rgba(251,87,121,.12)', padding: '2px 5px', borderRadius: 4 }}>HOTSPOT</span>
        )}
      </div>
      <div style={{ fontSize: 13.5, fontWeight: 600, color: '#E8EDF4', lineHeight: 1.2, minHeight: 32 }}>{board.name}</div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8 }}>
        <span style={{ fontFamily: MONO, fontSize: 30, fontWeight: 600, lineHeight: 1, color: board.color }}>{board.count}</span>
        <span style={{ fontFamily: MONO, fontSize: 12, fontWeight: 600, color: board.delta.color, whiteSpace: 'nowrap' }}>{board.delta.label}</span>
      </div>
      <div style={{ fontSize: 10.5, color: '#7d8799' }}>cards in board</div>
      <div style={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 5, paddingTop: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 9, color: '#5A6473', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Share of pipeline</span>
          <span style={{ fontFamily: MONO, fontSize: 11, fontWeight: 600, color: '#9aa6b6' }}>{board.pct}%</span>
        </div>
        <div style={{ height: 6, background: '#1a2230', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{ width: `${board.pct}%`, height: '100%', background: board.color, borderRadius: 3 }}/>
        </div>
      </div>
      <div style={{ borderTop: '1px solid #1E2632', paddingTop: 10, display: 'flex', flexDirection: 'column', gap: 3 }}>
        <div style={{ fontSize: 9, color: '#5A6473', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Worst stage</div>
        <div style={{ fontSize: 11.5, color: board.worstColor, fontWeight: 600 }}>{board.worstLabel}</div>
        <div style={{ fontSize: 10.5, color: '#8A95A6', lineHeight: 1.3 }}>{board.worstName}</div>
      </div>
    </div>
  );
}

export default function BoardFlow({ boards }: { boards: DashboardVals['boardFlow'] }) {
  return (
    <div style={{ background: '#121722', border: '1px solid #1E2632', borderRadius: 14, padding: '18px 20px 20px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <div style={{ fontSize: 12, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#8A95A6', fontWeight: 600 }}>Board Flow</div>
          <div style={{ fontSize: 11.5, color: '#5A6473' }}>live card volume by board · ordered along the pipeline</div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
          <span style={{ width: 9, height: 9, borderRadius: 2, background: '#FB5779', display: 'inline-block' }}/>
          <span style={{ fontSize: 11, color: '#FB8DA3' }}>Hotspot = board holding the worst bottleneck stage</span>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 10, alignItems: 'stretch' }}>
        {boards.map(b => <BoardCard key={b.idx} board={b} />)}
      </div>
    </div>
  );
}
