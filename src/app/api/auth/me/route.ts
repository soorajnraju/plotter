import { createTokenClient } from '@/lib/supabase/token-client'
import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization: Bearer <token> header required' }, { status: 401 })
  }

  const token = auth.slice(7)
  const supabase = createTokenClient(token)
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    created_at: user.created_at,
    updated_at: user.updated_at,
    app_metadata: user.app_metadata,
    user_metadata: user.user_metadata,
  })
}
