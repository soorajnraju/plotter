import { createClient } from '@/lib/supabase/server'
import { getSupabaseAndUser } from '@/lib/supabase/api-auth'
import { NextResponse } from 'next/server'

const VALID_CATEGORIES = ['accident', 'fire', 'medical', 'crime', 'weather', 'other'] as const
const VALID_SEVERITIES = ['low', 'medium', 'high', 'critical'] as const

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase.from('incidents').select('*').order('created_at', { ascending: false })

  const category = searchParams.get('category')
  const severity = searchParams.get('severity')
  const status   = searchParams.get('status')
  const search   = searchParams.get('search')

  if (category) query = query.eq('category', category)
  if (severity) query = query.eq('severity', severity)
  if (status)   query = query.eq('status', status)
  if (search)   query = query.ilike('title', `%${search}%`)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const { supabase, user } = await getSupabaseAndUser(request)

  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const { title, description, category, severity, latitude, longitude, address } = body

  if (!title || !category || !severity || latitude === undefined || longitude === undefined) {
    return NextResponse.json({ error: 'Missing required fields: title, category, severity, latitude, longitude' }, { status: 400 })
  }

  if (!VALID_CATEGORIES.includes(category as typeof VALID_CATEGORIES[number])) {
    return NextResponse.json({ error: 'Invalid category' }, { status: 400 })
  }
  if (!VALID_SEVERITIES.includes(severity as typeof VALID_SEVERITIES[number])) {
    return NextResponse.json({ error: 'Invalid severity' }, { status: 400 })
  }

  const lat = Number(latitude)
  const lng = Number(longitude)
  if (isNaN(lat) || isNaN(lng) || lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('incidents')
    .insert({
      title:             String(title).trim().slice(0, 200),
      description:       description ? String(description).trim().slice(0, 1000) : null,
      category,
      severity,
      latitude:          lat,
      longitude:         lng,
      address:           address ? String(address).trim().slice(0, 500) : null,
      reported_by:       user.id,
      reported_by_email: user.email,
    })
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data, { status: 201 })
}
