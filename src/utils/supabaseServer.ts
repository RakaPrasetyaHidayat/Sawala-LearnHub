import { createClient, SupabaseClient } from "@supabase/supabase-js";

/**
 * Server-only Supabase client using the Service Role key.
 * Do NOT expose the service key to the browser. Use only in server routes.
 */
export function getServerSupabase(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE;

  if (!url || !serviceKey) {
    console.warn(
      "Supabase server credentials missing. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in env."
    );
    return null;
  }

  return createClient(url, serviceKey, {
    auth: { persistSession: false },
    global: { headers: { "X-Client-Info": "learnhub-server" } },
  });
}