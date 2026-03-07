import { createClient } from '@/lib/supabase/server'
import type { Incident } from '@/types/incident'
import MapView from '@/components/map/MapView'

interface PageProps {
  searchParams: Promise<{ lat?: string; lng?: string }>
}

export default async function MapPage({ searchParams }: PageProps) {
  const supabase = await createClient()
  const params = await searchParams

  const [{ data: incidents }, { data: { user } }] = await Promise.all([
    supabase.from('incidents').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  const focusLocation =
    params.lat && params.lng
      ? { lat: parseFloat(params.lat), lng: parseFloat(params.lng) }
      : null

  return (
    <MapView
      initialIncidents={(incidents as Incident[]) ?? []}
      userId={user?.id ?? null}
      userEmail={user?.email ?? null}
      focusLocation={focusLocation}
    />
  )
}
