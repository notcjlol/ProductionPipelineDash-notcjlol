import type { DashboardPayload } from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3002';

/**
 * Fetch the dashboard payload from the Railway API.
 * Pass a Supabase access token when auth is configured.
 */
export async function getDashboardData(accessToken?: string): Promise<DashboardPayload> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // 1. Always attach internal secret for server-to-server auth
  const internalSecret = process.env.INTERNAL_API_SECRET;
  if (internalSecret) {
    headers['x-internal-secret'] = internalSecret;
  }

  // 2. Attach user token if provided (optional for now)
  if (accessToken) {
    headers['Authorization'] = `Bearer ${accessToken}`;
  }

  const res = await fetch(`${API_BASE}/dashboard`, {
    headers,
    // Re-fetch at most every 60 seconds in production (Next.js data cache).
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    throw new Error(`[pipeline-api] /dashboard returned ${res.status}`);
  }

  return res.json() as Promise<DashboardPayload>;
}
