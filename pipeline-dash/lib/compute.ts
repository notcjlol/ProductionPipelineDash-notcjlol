/**
 * Pure computation layer — mirrors the DC renderVals() logic.
 * Takes the raw DashboardPayload and returns display-ready values.
 * No React, no side-effects — easy to unit test.
 */
import type { DashboardPayload } from './types';

// ── Helpers ──────────────────────────────────────────────────────────────────

function pad(n: number) { return n < 10 ? '0' + n : '' + n; }
export function fmtHM(min: number) {
  if (min < 60) return Math.round(min) + 'm';
  const h = Math.floor(min / 60); const m = Math.round(min % 60);
  return h + 'h ' + pad(m) + 'm';
}
export function fmtShort(min: number) {
  if (min < 60) return Math.round(min) + 'm';
  if (min < 2880) return Math.round(min / 60) + 'h';
  return Math.round(min / 1440) + 'd';
}
function fmtDays(min: number) {
  const d = Math.floor(min / 1440); const h = Math.round((min % 1440) / 60);
  return d + 'd ' + h + 'h';
}
function heatColor(avg: number) {
  if (avg < 600) return '#34D399'; if (avg < 1500) return '#F4D03F';
  if (avg < 2800) return '#FB923C'; return '#FB5779';
}
function heatTint(avg: number) {
  if (avg < 300) return 'rgba(52,211,153,.05)'; if (avg < 600) return 'rgba(52,211,153,.10)';
  if (avg < 1500) return 'rgba(244,208,63,.10)'; if (avg < 2800) return 'rgba(251,146,60,.12)';
  return 'rgba(251,87,121,.16)';
}
function heatBorder(avg: number) {
  if (avg < 600) return 'rgba(52,211,153,.25)'; if (avg < 1500) return 'rgba(244,208,63,.28)';
  if (avg < 2800) return 'rgba(251,146,60,.32)'; return 'rgba(251,87,121,.4)';
}
function deltaInfo(delta: number, goodIfUp: boolean, suffix = '') {
  if (delta === 0) return { label: '0' + suffix, color: '#5A6473' };
  const up = delta > 0; const good = goodIfUp ? up : !up;
  const arrow = up ? '↑' : '↓';
  const num = (up ? '+' : '−') + Math.abs(delta) + suffix;
  return { label: arrow + ' ' + num, color: good ? '#34D399' : '#FB5779' };
}
function cellDelta(d: number) {
  if (d === 0) return { label: '', color: '#5A6473' };
  const up = d > 0;
  return { label: (up ? '▲' : '▼') + Math.abs(d), color: up ? '#FB8DA3' : '#7ad9b5' };
}

// ── Main compute ─────────────────────────────────────────────────────────────

export function computeDashboard(payload: DashboardPayload, _now: number) {
  const { boards, stages, customMetrics, today, baselines } = payload;

  // Bottleneck = stage with highest avg dwell
  let bnIdx = 0;
  stages.forEach((st, i) => { if (st.avg > stages[bnIdx].avg) bnIdx = i; });
  const bn = stages[bnIdx];
  const bnBoard = boards.find(b => b.key === bn.board);

  // Per-board aggregates
  const boardMap: Record<string, { count: number; yCount: number; stages: typeof stages; worst: typeof stages[0] | null }> = {};
  boards.forEach(b => boardMap[b.key] = { count: 0, yCount: 0, stages: [], worst: null });
  stages.forEach((st) => {
    const agg = boardMap[st.board];
    agg.count += st.count;
    agg.yCount += st.y;
    agg.stages.push(st);
    if (!agg.worst || st.avg > agg.worst.avg) agg.worst = st;
  });

  const totalActive = Math.max(1, boards.reduce((a, b) => a + boardMap[b.key].count, 0));
  const totalYesterday = boards.reduce((a, b) => a + boardMap[b.key].yCount, 0);

  // Cycle time = sum of all stage avgs (excluding Uploading board)
  const cycleMin = stages.filter(st => st.board !== 'B6').reduce((a, st) => a + st.avg, 0);

  // KPI deltas
  const deltaPipeline = deltaInfo(totalActive - totalYesterday, false);
  const deltaCycle = deltaInfo(Math.round((cycleMin - baselines.cycleMin) / 60), false, 'h');
  const deltaBottleneck = deltaInfo(bn.count - bn.y, false);

  // Board Flow
  const boardFlow = boards.map((b, i) => {
    const agg = boardMap[b.key];
    const isHotspot = bn.board === b.key;
    const delta = deltaInfo(agg.count - agg.yCount, false);
    return {
      idx: i + 1, name: b.name, color: b.color, count: agg.count,
      pct: Math.round(agg.count / totalActive * 100),
      delta, isHotspot,
      worstName: agg.worst ? agg.worst.name : '—',
      worstLabel: agg.worst ? fmtHM(agg.worst.avg) : '—',
      worstColor: agg.worst ? heatColor(agg.worst.avg) : '#5A6473',
      nodeBorder: isHotspot ? 'rgba(251,87,121,.45)' : '#1E2632',
      nodeShadow: isHotspot ? '0 0 0 1px rgba(251,87,121,.18), 0 10px 32px -14px rgba(251,87,121,.5)' : 'none',
    };
  });

  // Heatmap
  const heatmap = boards.map(b => {
    const agg = boardMap[b.key];
    const cells = agg.stages.map((st, si) => {
      const d = cellDelta(st.count - st.y);
      return {
        name: st.name, count: st.count,
        avgShort: st.avg ? fmtShort(st.avg) : '—',
        color: heatColor(st.avg), bg: heatTint(st.avg), border: heatBorder(st.avg),
        isBottleneck: stages.indexOf(st) === bnIdx,
        deltaLabel: d.label, deltaColor: d.color,
        _key: b.key + si,
      };
    });
    return { name: b.name, color: b.color, count: agg.count, cells };
  });

  // Stage list (per board, sorted by volume)
  const stageMax = Math.max(1, ...stages.map(s => s.count));
  const stageList = boards.map(b => {
    const agg = boardMap[b.key];
    const active = [...agg.stages].filter(st => st.count > 0).sort((a, c) => c.count - a.count);
    return {
      name: b.name, color: b.color,
      rows: active.map(st => {
        const d = cellDelta(st.count - st.y);
        return {
          name: st.name, count: st.count,
          barPct: Math.max(4, Math.round(st.count / stageMax * 100)),
          heat: heatColor(st.avg),
          dwellLabel: st.avg ? fmtShort(st.avg) : '—',
          deltaLabel: d.label, deltaColor: d.color,
          isBottleneck: stages.indexOf(st) === bnIdx,
        };
      }),
    };
  });

  // Custom metrics
  const computedMetrics = customMetrics.map(m => {
    const total = m.boy + m.girl;
    const denom = Math.max(1, total);
    const boyPct = total === 0 ? 50 : Math.round(m.boy / denom * 100);
    const boyVs = deltaInfo(m.boy - m.boyY, true);
    const girlVs = deltaInfo(m.girl - m.girlY, true);
    return {
      title: m.title, subtitle: m.subtitle,
      boy: m.boy, girl: m.girl, total,
      boyPct, girlPct: 100 - boyPct,
      boyVsLabel: boyVs.label, boyVsColor: boyVs.color,
      girlVsLabel: girlVs.label, girlVsColor: girlVs.color,
    };
  });

  return {
    inPipeline: totalActive,
    cycleLabel: fmtDays(cycleMin),
    deltaPipeline, deltaCycle, deltaBottleneck,
    bottleneckName: bn.name,
    bottleneckLabel: fmtHM(bn.avg),
    bottleneckCount: bn.count,
    bottleneckBoard: bnBoard?.name ?? '',
    postedRecent: baselines.postedRecent7d + today.posted,
    today,
    boardFlow, heatmap, stageList, stageMax,
    customMetrics: computedMetrics,
  };
}

export type DashboardVals = ReturnType<typeof computeDashboard>;
