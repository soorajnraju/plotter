import { getSupabaseAndUser } from '@/lib/supabase/api-auth'
import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

type Params = Promise<{ id: string }>

export async function GET(_req: Request, { params }: { params: Params }) {
  const { id } = await params
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('incidents')
    .select('*')
    .eq('id', id)
    .single()

  if (error) return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
  return NextResponse.json(data)
}

export async function PATCH(request: Request, { params }: { params: Params }) {
  const { id } = await params
  const { supabase, user } = await getSupabaseAndUser(request)

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: incident } = await supabase
    .from('incidents')
    .select('reported_by')
    .eq('id', id)
    .single()

  if (!incident) return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
  if (incident.reported_by !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const VALID_STATUSES = ['active', 'investigating', 'resolved']
  const updates: Record<string, unknown> = {}

  if (body.status !== undefined) {
    if (!VALID_STATUSES.includes(String(body.status))) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }
    updates.status = body.status
  }
  if (body.title !== undefined) {
    updates.title = String(body.title).trim().slice(0, 200)
  }
  if (body.description !== undefined) {
    updates.description = body.description ? String(body.description).trim().slice(0, 1000) : null
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('incidents')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function DELETE(request: Request, { params }: { params: Params }) {
  const { id } = await params
  const { supabase, user } = await getSupabaseAndUser(request)

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Verify ownership
  const { data: incident } = await supabase
    .from('incidents')
    .select('reported_by')
    .eq('id', id)
    .single()

  if (!incident) return NextResponse.json({ error: 'Incident not found' }, { status: 404 })
  if (incident.reported_by !== user.id) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { error } = await supabase.from('incidents').delete().eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return new NextResponse(null, { status: 204 })
}
