import { Router } from 'express';
import type { DashboardPayload, Board, Stage, CustomMetric } from '../types';

const router = Router();

// ── Mock data (mirrors DC constants exactly — replace with DB queries later) ─

const BOARDS: Board[] = [
  { key: 'B2', name: 'Animation Script Team',        short: 'Script',       color: '#6EA8FF' },
  { key: 'B3', name: 'The Future Animations',        short: 'Future Anim',  color: '#B79CFF' },
  { key: 'B8', name: 'VeeFriends Animation',         short: 'VeeFriends',   color: '#F4D03F' },
  { key: 'B7', name: 'Life Creator Animations',      short: 'Life Creator', color: '#5EEAD4' },
  { key: 'B4', name: 'Animation SFX - Editing Team', short: 'SFX/Edit',     color: '#2DE0C0' },
  { key: 'B6', name: 'Uploading',                    short: 'Upload',       color: '#34D399' },
];

const STAGES: Stage[] = [
  { board: 'B2', name: 'Script Submissions',    avg: 4320, count: 165, y: 160 },
  { board: 'B2', name: 'Script Editing',        avg: 1440, count: 10,  y: 12  },
  { board: 'B2', name: 'Script QA',             avg: 2160, count: 23,  y: 18  },
  { board: 'B2', name: 'Visual QA',             avg: 600,  count: 0,   y: 1   },
  { board: 'B2', name: 'Pictures',              avg: 720,  count: 0,   y: 0   },
  { board: 'B2', name: 'Ready For Voice Over',  avg: 960,  count: 0,   y: 0   },
  { board: 'B2', name: 'VO Done',               avg: 480,  count: 0,   y: 0   },

  { board: 'B3', name: 'VO Done',                  avg: 240,  count: 1,   y: 2   },
  { board: 'B3', name: 'Animation in Progress',    avg: 8640, count: 189, y: 184 },
  { board: 'B3', name: 'Viewport - Internal QA',   avg: 720,  count: 0,   y: 1   },
  { board: 'B3', name: 'Animation – Revisions',    avg: 2880, count: 11,  y: 10  },
  { board: 'B3', name: 'Revision Fixes',           avg: 1440, count: 0,   y: 0   },
  { board: 'B3', name: 'Placeholder',              avg: 2160, count: 11,  y: 12  },
  { board: 'B3', name: 'Ready to Render',          avg: 4320, count: 57,  y: 54  },
  { board: 'B3', name: 'Render QA',                avg: 360,  count: 0,   y: 0   },
  { board: 'B3', name: 'Rendered Version',         avg: 480,  count: 0,   y: 0   },

  { board: 'B8', name: 'VO Done',                  avg: 240,  count: 2,   y: 3   },
  { board: 'B8', name: 'Animation in Progress',    avg: 6480, count: 124, y: 118 },
  { board: 'B8', name: 'Viewport - Internal QA',   avg: 720,  count: 3,   y: 2   },
  { board: 'B8', name: 'Animation – Revisions',    avg: 2880, count: 9,   y: 11  },
  { board: 'B8', name: 'Revision Fixes',           avg: 1440, count: 1,   y: 0   },
  { board: 'B8', name: 'Placeholder',              avg: 2160, count: 7,   y: 8   },
  { board: 'B8', name: 'Ready to Render',          avg: 4320, count: 38,  y: 35  },
  { board: 'B8', name: 'Render QA',                avg: 360,  count: 1,   y: 0   },
  { board: 'B8', name: 'Rendered Version',         avg: 480,  count: 0,   y: 1   },

  { board: 'B4', name: 'Viewport Submission',    avg: 1440, count: 13, y: 12 },
  { board: 'B4', name: 'SFX R1 In Progress',     avg: 720,  count: 1,  y: 2  },
  { board: 'B4', name: 'SFX R1 Done',            avg: 2880, count: 32, y: 30 },
  { board: 'B4', name: 'Final Render Submission',avg: 480,  count: 0,  y: 1  },
  { board: 'B4', name: 'SFX R2 In Progress',     avg: 720,  count: 0,  y: 0  },
  { board: 'B4', name: 'Final QA',               avg: 540,  count: 0,  y: 0  },
  { board: 'B4', name: 'Music',                  avg: 600,  count: 0,  y: 0  },
  { board: 'B4', name: 'Editing Revisions',      avg: 1080, count: 0,  y: 0  },
  { board: 'B4', name: 'Final, Final QA',        avg: 2160, count: 18, y: 17 },
  { board: 'B4', name: 'Ready for Posting',      avg: 240,  count: 0,  y: 0  },

  { board: 'B6', name: 'Ready For Upload',       avg: 480, count: 2,  y: 3  },
  { board: 'B6', name: 'TikTok',                 avg: 240, count: 0,  y: 0  },
  { board: 'B6', name: 'Instagram & Facebook',   avg: 240, count: 0,  y: 0  },
  { board: 'B6', name: 'YouTube',                avg: 240, count: 0,  y: 0  },
  { board: 'B6', name: 'Snapchat',               avg: 240, count: 0,  y: 0  },
  { board: 'B6', name: 'Uploaded & Scheduled',   avg: 0,   count: 36, y: 34 },

  { board: 'B7', name: 'VO Done',                        avg: 240,  count: 9,  y: 8  },
  { board: 'B7', name: 'Animation in Progress',          avg: 5760, count: 70, y: 68 },
  { board: 'B7', name: 'Viewport - Internal QA',         avg: 480,  count: 0,  y: 1  },
  { board: 'B7', name: 'Animation – Revisions',          avg: 3240, count: 30, y: 28 },
  { board: 'B7', name: 'Revision Fixes',                 avg: 1440, count: 0,  y: 0  },
  { board: 'B7', name: 'Placeholder',                    avg: 2160, count: 13, y: 14 },
  { board: 'B7', name: 'Ready to Render',                avg: 4320, count: 97, y: 92 },
  { board: 'B7', name: 'Ready To Render (V2)',           avg: 2880, count: 27, y: 24 },
  { board: 'B7', name: 'Revisions On Full Render QA',    avg: 1440, count: 0,  y: 0  },
  { board: 'B7', name: 'Full Render QA',                 avg: 360,  count: 0,  y: 0  },
  { board: 'B7', name: 'Rendered Version',               avg: 480,  count: 0,  y: 0  },
];

const CUSTOM_METRICS: CustomMetric[] = [
  {
    title: 'Boy vs Girl scripts → Visual QA',
    subtitle: 'Script Team · moved into Visual QA today',
    boy: 3, girl: 2, boyY: 4, girlY: 1,
  },
  {
    title: 'Boy vs Girl scripts → Final Render Submission',
    subtitle: 'SFX/Edit · moved into Final Render Submission today',
    boy: 2, girl: 4, boyY: 1, girlY: 2,
  },
];

// ── Route ────────────────────────────────────────────────────────────────────

router.get('/', (_req, res) => {
  const payload: DashboardPayload = {
    boards: BOARDS,
    stages: STAGES,
    customMetrics: CUSTOM_METRICS,
    schedulePosts: [],   // TODO: populate from DB API
    today: { added: 18, posted: 8, moves: 64, newStuck: 3 },
    baselines: { cycleMin: 38172, postedRecent7d: 134 },
    computedAt: new Date().toISOString(),
  };
  res.json(payload);
});

export default router;
