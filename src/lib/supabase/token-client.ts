import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with a Bearer JWT.
 * Used by API routes to support mobile clients.
 */
export function createTokenClient(token: string) {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      global: { headers: { Authorization: `Bearer ${token}` } },
      auth: { persistSession: false },
    },
  )
}

/**
 * Creates an anonymous Supabase client (no session).
 * Used for auth operations like signup / login / token refresh.
 */
export function createAnonClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } },
  )
}
