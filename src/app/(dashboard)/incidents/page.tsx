import { createClient } from '@/lib/supabase/server'
import type { Incident, IncidentFilters } from '@/types/incident'
import IncidentListView from '@/components/incidents/IncidentListView'

interface PageProps {
  searchParams: Promise<{ [key: string]: string | undefined }>
}

export default async function IncidentsPage({ searchParams }: PageProps) {
  const params = await searchParams
  const supabase = await createClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let query: any = supabase
    .from('incidents')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })

  if (params.category) query = query.eq('category', params.category)
  if (params.severity) query = query.eq('severity', params.severity)
  if (params.status)   query = query.eq('status',   params.status)
  if (params.search)   query = query.ilike('title', `%${params.search}%`)

  const [{ data: incidents, count }, { data: { user } }] = await Promise.all([
    query,
    supabase.auth.getUser(),
  ])

  const initialFilters: IncidentFilters = {
    search:   params.search   ?? '',
    category: (params.category as IncidentFilters['category']) ?? '',
    severity: (params.severity as IncidentFilters['severity']) ?? '',
    status:   (params.status   as IncidentFilters['status'])   ?? '',
  }

  return (
    <IncidentListView
      initialIncidents={(incidents as Incident[]) ?? []}
      totalCount={count ?? 0}
      userId={user?.id ?? null}
      initialFilters={initialFilters}
    />
  )
}
