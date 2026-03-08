import type { SupabaseClient, User } from '@supabase/supabase-js'
import { createClient as createCookieClient } from './server'
import { createTokenClient } from './token-client'

/**
 * Resolves a Supabase client + authenticated user from an incoming request.
 * Priority: Authorization: Bearer <token>  →  fallback to session cookie.
 * Returns { supabase, user: null } when unauthenticated.
 */
export async function getSupabaseAndUser(
  request: Request,
): Promise<{ supabase: SupabaseClient; user: User | null }> {
  const auth = request.headers.get('Authorization')

  if (auth?.startsWith('Bearer ')) {
    const token = auth.slice(7)
    const supabase = createTokenClient(token)
    const {
      data: { user },
    } = await supabase.auth.getUser()
    return { supabase, user: user ?? null }
  }

  // Fall back to cookie-based session (web clients)
  const supabase = await createCookieClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()
  return { supabase, user: user ?? null }
}
