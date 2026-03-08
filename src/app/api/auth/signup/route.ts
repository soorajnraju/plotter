import { createAnonClient } from '@/lib/supabase/token-client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { email, password } = body

  if (!email || !password) {
    return NextResponse.json({ error: 'email and password are required' }, { status: 400 })
  }
  if (typeof email !== 'string' || typeof password !== 'string') {
    return NextResponse.json({ error: 'email and password must be strings' }, { status: 400 })
  }
  if (password.length < 6) {
    return NextResponse.json({ error: 'password must be at least 6 characters' }, { status: 400 })
  }

  const supabase = createAnonClient()
  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  // email confirmation may be required; session will be null until confirmed
  return NextResponse.json(
    {
      user: data.user
        ? { id: data.user.id, email: data.user.email, created_at: data.user.created_at }
        : null,
      session: data.session
        ? {
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_at: data.session.expires_at,
          }
        : null,
      message: data.session
        ? 'Account created and signed in.'
        : 'Account created. Please check your email to confirm your address.',
    },
    { status: 201 },
  )
}
