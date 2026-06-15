'use client';

import { useMemo, useEffect, useRef, useState } from 'react';
import type { DashboardPayload } from '@/lib/types';
import { computeDashboard } from '@/lib/compute';
import KpiStrip from './KpiStrip';
import BoardFlow from './BoardFlow';
import Heatmap from './Heatmap';
import CustomMetrics from './CustomMetrics';

interface Props {
  data: DashboardPayload;
}

export default function Dashboard({ data }: Props) {
  const [now, setNow] = useState(() => Date.now());
  const clockRef = useRef<HTMLDivElement>(null);

  // Tick the clock every second (client-only, like the DC version)
  useEffect(() => {
    const id = setInterval(() => {
      setNow(Date.now());
      if (clockRef.current) {
        const d = new Date();
        const pad = (n: number) => String(n).padStart(2, '0');
        clockRef.current.textContent =
          `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
      }
    }, 1000);
    return () => clearInterval(id);
  }, []);

  const vals = useMemo(() => computeDashboard(data, now), [data, now]);

  const d = new Date(now);
  const dateStr = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
  const clock = d.toLocaleTimeString('en-US', { hour12: false });

  return (
    <div style={{
      minHeight: '100vh',
      background: 'radial-gradient(1200px 600px at 70% -10%, rgba(45,224,192,.05), transparent 60%), #0A0D14',
      color: '#E8EDF4',
      fontFamily: "'Space Grotesk', system-ui, sans-serif",
      padding: '24px 28px 40px',
    }}>
      <div style={{ maxWidth: 1760, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: 16 }}>

        {/* HEADER */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
            <div style={{ width: 44, height: 44, borderRadius: 12, background: '#121722', border: '1px solid #1E2632', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <rect x="2" y="4" width="5.5" height="16" rx="2" fill="#6EA8FF"/>
                <rect x="9.25" y="8" width="5.5" height="12" rx="2" fill="#B79CFF"/>
                <rect x="16.5" y="11" width="5.5" height="9" rx="2" fill="#2DE0C0"/>
              </svg>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              <div style={{ fontSize: 20, fontWeight: 700, letterSpacing: '0.01em', lineHeight: 1 }}>Production Pipeline</div>
              <div style={{ fontSize: 12.5, color: '#8A95A6' }}>
                {data.boards.length} boards · {data.stages.length} stages · {dateStr}
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: '#101b1a', border: '1px solid rgba(45,224,192,.28)', padding: '7px 13px', borderRadius: 999 }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#2DE0C0', animation: 'pulseDot 1.6s ease-in-out infinite', display: 'inline-block' }}/>
              <span style={{ fontSize: 12, fontWeight: 600, letterSpacing: '0.16em', color: '#2DE0C0' }}>LIVE</span>
            </div>
            <div ref={clockRef} style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: 21, fontWeight: 500, letterSpacing: '0.02em' }}>
              {clock}
            </div>
          </div>
        </div>

        <KpiStrip vals={vals} />
        <BoardFlow boards={vals.boardFlow} />
        <Heatmap heatmap={vals.heatmap} stageList={vals.stageList} stageMax={vals.stageMax} />
        <CustomMetrics metrics={vals.customMetrics} />

      </div>
    </div>
  );
}
