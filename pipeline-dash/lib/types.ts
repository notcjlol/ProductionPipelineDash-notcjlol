/**
 * DashboardPayload — mirror of pipeline-api/src/types.ts.
 * Keep in sync with the API contract.
 */

export interface Board {
  key: string;
  name: string;
  short: string;
  color: string;
}

export interface Stage {
  board: string;
  name: string;
  /** Average dwell time in minutes. */
  avg: number;
  /** Current card count. */
  count: number;
  /** 24h-ago card count (0 until snapshot history exists). */
  y: number;
}

export interface CustomMetric {
  title: string;
  subtitle: string;
  boy: number;
  girl: number;
  boyY: number;
  girlY: number;
}

export interface SchedulePost {
  id: string;
  platform: string;
  platformName: string;
  platformColor: string;
  account: string;
  accountName: string;
  accountShort: string;
  accountColor: string;
  scheduledAt: number;
  title: string;
}

export interface TodayTotals {
  added: number;
  posted: number;
  moves: number;
  newStuck: number;
}

export interface Baselines {
  cycleMin: number;
  postedRecent7d: number;
}

export interface DashboardPayload {
  boards: Board[];
  stages: Stage[];
  customMetrics: CustomMetric[];
  schedulePosts: SchedulePost[];
  today: TodayTotals;
  baselines: Baselines;
  computedAt: string;
}
