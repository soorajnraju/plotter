'use client'

import { useState, useCallback } from 'react'
import dynamic from 'next/dynamic'
import type { Incident, IncidentFilters } from '@/types/incident'
import type { LeafletMapProps } from './LeafletMap'
import SearchFilter from '@/components/incidents/SearchFilter'
import AddIncidentModal from '@/components/map/AddIncidentModal'

// Leaflet must only render on the client
const LeafletMap = dynamic<LeafletMapProps>(() => import('./LeafletMap'), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3 text-gray-400">
        <div className="w-8 h-8 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
        <span className="text-sm">Loading map…</span>
      </div>
    </div>
  ),
})

interface MapViewProps {
  initialIncidents: Incident[]
  userId: string | null
  userEmail: string | null
  focusLocation?: { lat: number; lng: number } | null
}

export default function MapView({ initialIncidents, userId, userEmail, focusLocation }: MapViewProps) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [filters, setFilters] = useState<IncidentFilters>({})
  const [clickedLocation, setClickedLocation] = useState<{ lat: number; lng: number } | null>(null)

  const filteredIncidents = incidents.filter((inc) => {
    if (
      filters.search &&
      !inc.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !inc.description?.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    if (filters.category && inc.category !== filters.category) return false
    if (filters.severity && inc.severity !== filters.severity) return false
    if (filters.status && inc.status !== filters.status) return false
    return true
  })

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      if (!userId) return // guest — ignore clicks
      setClickedLocation({ lat, lng })
    },
    [userId],
  )

  const handleIncidentCreated = useCallback((incident: Incident) => {
    setIncidents((prev) => [incident, ...prev])
  }, [])

  const handleIncidentUpdated = useCallback((updated: Incident) => {
    setIncidents((prev) => prev.map((i) => (i.id === updated.id ? updated : i)))
  }, [])

  const handleIncidentDeleted = useCallback((id: string) => {
    setIncidents((prev) => prev.filter((i) => i.id !== id))
  }, [])

  return (
    <div className="h-full flex flex-col">
      {/* Filter bar */}
      <div className="px-4 py-2 bg-white border-b border-gray-100 shrink-0">
        <SearchFilter filters={filters} onChange={setFilters} compact />
      </div>

      {/* Map — min-h-0 prevents the flex item from overflowing */}
      <div className="relative flex-1 min-h-0">
        {!userId && (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-[1000] bg-amber-50 border border-amber-200 rounded-lg px-4 py-2 text-sm text-amber-800 shadow-sm pointer-events-none whitespace-nowrap">
            Viewing as guest — sign in to report incidents
          </div>
        )}

        {userId && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[1000] bg-white/90 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500 shadow-sm pointer-events-none whitespace-nowrap">
            Click anywhere on the map to report an incident
          </div>
        )}

        <LeafletMap
          incidents={filteredIncidents}
          onMapClick={handleMapClick}
          onIncidentUpdate={handleIncidentUpdated}
          onIncidentDelete={handleIncidentDeleted}
          userId={userId}
          focusLocation={focusLocation}
        />
      </div>

      {/* Add incident modal */}
      {clickedLocation && userId && userEmail && (
        <AddIncidentModal
          location={clickedLocation}
          userId={userId}
          userEmail={userEmail}
          onClose={() => setClickedLocation(null)}
          onCreated={handleIncidentCreated}
        />
      )}
    </div>
  )
}
