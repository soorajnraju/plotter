import { createAnonClient } from '@/lib/supabase/token-client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { refresh_token } = body

  if (!refresh_token || typeof refresh_token !== 'string') {
    return NextResponse.json({ error: 'refresh_token is required' }, { status: 400 })
  }

  const supabase = createAnonClient()
  const { data, error } = await supabase.auth.refreshSession({ refresh_token })

  if (error || !data.session) {
    return NextResponse.json({ error: 'Invalid or expired refresh token' }, { status: 401 })
  }

  return NextResponse.json({
    session: {
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
      expires_at: data.session.expires_at,
    },
  })
}
