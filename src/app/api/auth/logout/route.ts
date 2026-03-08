import { createTokenClient } from '@/lib/supabase/token-client'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  const auth = request.headers.get('Authorization')
  if (!auth?.startsWith('Bearer ')) {
    return NextResponse.json({ error: 'Authorization: Bearer <token> header required' }, { status: 401 })
  }

  const token = auth.slice(7)
  const supabase = createTokenClient(token)
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return new NextResponse(null, { status: 204 })
}
