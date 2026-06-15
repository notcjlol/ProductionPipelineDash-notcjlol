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

/**
 * Simple internal secret verification middleware.
 * Used for server-to-server communication where a user session isn't available.
 */
export function requireInternalSecret(req: Request, res: Response, next: NextFunction) {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error('[auth] FATAL: INTERNAL_API_SECRET not set in production.');
      return res.status(503).json({ error: 'Internal security service unavailable.' });
    }
    // In dev, skip if not set
    return next();
  }

  const providedSecret = req.headers['x-internal-secret'];
  if (providedSecret !== secret) {
    return res.status(401).json({ error: 'Invalid or missing internal secret.' });
  }

  return next();
}

