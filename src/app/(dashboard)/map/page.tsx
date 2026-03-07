import { createClient } from '@/lib/supabase/server'
import type { Incident } from '@/types/incident'
import MapView from '@/components/map/MapView'

export default async function MapPage() {
  const supabase = await createClient()

  const [{ data: incidents }, { data: { user } }] = await Promise.all([
    supabase.from('incidents').select('*').order('created_at', { ascending: false }),
    supabase.auth.getUser(),
  ])

  return (
    <MapView
      initialIncidents={(incidents as Incident[]) ?? []}
      userId={user?.id ?? null}
      userEmail={user?.email ?? null}
    />
  )
}
