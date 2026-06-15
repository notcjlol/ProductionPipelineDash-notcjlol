import { createClient, SupabaseClient } from '@supabase/supabase-js';

/**
 * Lazily-constructed Supabase admin client backed by the service-role key.
 * Returns null when env vars are missing so the server still boots in dev.
 *
 * Required env (server-only — never expose the service-role key to clients):
 *   SUPABASE_URL                — project URL
 *   SUPABASE_SERVICE_ROLE_KEY   — service-role secret
 */
let cached: SupabaseClient | null | undefined;

export function getSupabaseAdmin(): SupabaseClient | null {
  if (cached !== undefined) return cached;

  const url = process.env.SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceKey) {
    console.warn('[supabase] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set — admin features disabled.');
    cached = null;
    return null;
  }

  cached = createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return cached;
}
