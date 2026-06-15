import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import dashboardRouter from './routes/dashboard';
import { requireAuth, requireInternalSecret } from './middleware/auth';

export const app = express();
const PORT = process.env.PORT ?? 3002;

app.set('trust proxy', 1);
app.use(helmet());

// CORS — restrict origins in production via ALLOWED_ORIGINS env var
const rawOrigins = process.env.ALLOWED_ORIGINS;
if (!rawOrigins && process.env.NODE_ENV === 'production') {
  console.error('[cors] FATAL: ALLOWED_ORIGINS is not set in production.');
}
const corsOptions: cors.CorsOptions = rawOrigins
  ? { origin: rawOrigins.split(',').map((o) => o.trim()) }
  : process.env.NODE_ENV === 'production'
    ? { origin: false }
    : { origin: '*' };
app.use(cors(corsOptions));
app.use(express.json({ limit: '32kb' }));

// Health check — before rate limiter
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Rate limiter
const skipInTest = () => process.env.NODE_ENV === 'test';
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 100,
  standardHeaders: 'draft-8',
  legacyHeaders: false,
  skip: skipInTest,
  message: { error: 'Too many requests — please slow down.' },
});
app.use(globalLimiter);

// Routes
app.use('/dashboard', requireInternalSecret, dashboardRouter);

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`[pipeline-api] running on http://localhost:${PORT}`);
  });
}
