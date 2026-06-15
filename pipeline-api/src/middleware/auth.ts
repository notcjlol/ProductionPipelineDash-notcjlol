import type { Request, Response, NextFunction } from 'express';
import { getSupabaseAdmin } from '../lib/supabaseAdmin';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: { id: string };
    }
  }
}

/**
 * JWT verification middleware — identical pattern to moonset-app/api.
 * Fail-closed in production; skipped in dev/test when Supabase isn't configured.
 */
export async function requireAuth(req: Request, res: Response, next: NextFunction) {
  const admin = getSupabaseAdmin();

  if (!admin) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[auth] FATAL: Supabase admin client unavailable in production.');
      return res.status(503).json({ error: 'Authentication service unavailable.' });
    }
    return next();
  }

  const authHeader = req.headers.authorization ?? '';
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7).trim() : '';
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token.' });
  }

  try {
    const { data, error } = await admin.auth.getUser(token);
    if (error || !data?.user) {
      return res.status(401).json({ error: 'Invalid or expired token.' });
    }
    req.user = { id: data.user.id };
    return next();
  } catch (err) {
    console.error('[auth]', err);
    return res.status(401).json({ error: 'Invalid or expired token.' });
  }
}
