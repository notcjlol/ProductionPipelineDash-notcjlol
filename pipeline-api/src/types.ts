/**
 * DashboardPayload — the single contract between the Railway API and the
 * React dashboard. Every field here maps directly to a UI section.
 *
 * "y" fields = 24h-ago snapshot (zeroed until snapshot history exists).
 * weekly / monthly deltas are planned but zeroed today.
 */

// ── Raw inputs (from DB / Trello sync) ──────────────────────────────────────

export interface Board {
  key: string;       // e.g. "B2"
  name: string;      // e.g. "Animation Script Team"
  short: string;     // e.g. "Script"
  color: string;     // hex
}

export interface Stage {
  board: string;     // Board.key
  name: string;
  /** Average dwell time in minutes (0 = no data yet). */
  avg: number;
  /** Current card count. */
  count: number;
  /** 24h-ago card count — 0 until snapshot history exists. */
  y: number;
}

export interface CustomMetric {
  title: string;
  subtitle: string;
  boy: number;
  girl: number;
  /** Yesterday's boy count — 0 until history exists. */
  boyY: number;
  /** Yesterday's girl count — 0 until history exists. */
  girlY: number;
}

export interface SchedulePost {
  id: string;
  platform: string;      // "yt" | "tt" | "ig" | "sc"
  platformName: string;
  platformColor: string;
  account: string;       // "his" | "her"
  accountName: string;
  accountShort: string;
  accountColor: string;
  /** Unix ms — when the post is scheduled. */
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
  /** 7-day average cycle time in minutes (0 until history exists). */
  cycleMin: number;
  /** Posts in the last 7 days (0 until history exists). */
  postedRecent7d: number;
}

// ── Top-level payload ────────────────────────────────────────────────────────

export interface DashboardPayload {
  boards: Board[];
  stages: Stage[];
  customMetrics: CustomMetric[];
  /** Scheduled posts for the ±48h window (computed server-side or from DB). */
  schedulePosts: SchedulePost[];
  today: TodayTotals;
  baselines: Baselines;
  /** ISO timestamp of when this payload was computed. */
  computedAt: string;
}
