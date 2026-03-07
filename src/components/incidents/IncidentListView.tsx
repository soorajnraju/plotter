'use client'

import { useState, useCallback } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { Incident, IncidentFilters } from '@/types/incident'
import SearchFilter from './SearchFilter'
import IncidentCard from './IncidentCard'

interface IncidentListViewProps {
  initialIncidents: Incident[]
  totalCount: number
  userId: string | null
  initialFilters: IncidentFilters
}

export default function IncidentListView({
  initialIncidents,
  totalCount,
  userId,
  initialFilters,
}: IncidentListViewProps) {
  const [incidents, setIncidents] = useState(initialIncidents)
  const [filters, setFilters] = useState<IncidentFilters>(initialFilters)

  const filtered = incidents.filter((inc) => {
    if (
      filters.search &&
      !inc.title.toLowerCase().includes(filters.search.toLowerCase()) &&
      !inc.description?.toLowerCase().includes(filters.search.toLowerCase())
    )
      return false
    if (filters.category && inc.category !== filters.category) return false
    if (filters.severity && inc.severity !== filters.severity) return false
    if (filters.status   && inc.status   !== filters.status)   return false
    return true
  })

  const handleDelete = useCallback(async (id: string) => {
    if (!confirm('Delete this incident? This cannot be undone.')) return
    const res = await fetch(`/api/incidents/${id}`, { method: 'DELETE' })
    if (res.ok) setIncidents((prev) => prev.filter((i) => i.id !== id))
  }, [])

  const handleStatusUpdate = useCallback(async (id: string, status: string) => {
    const res = await fetch(`/api/incidents/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (res.ok) {
      const updated: Incident = await res.json()
      setIncidents((prev) => prev.map((i) => (i.id === id ? updated : i)))
    }
  }, [])

  return (
    <div className="h-full flex flex-col overflow-hidden">
      {/* Header + filters */}
      <div className="px-4 py-3 bg-white border-b border-gray-100 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-base font-semibold text-gray-900">Incidents</h1>
          <span className="text-xs text-gray-400">
            {filtered.length} / {totalCount} total
          </span>
        </div>
        <SearchFilter filters={filters} onChange={setFilters} />
      </div>

      {/* Grid */}
      <div className="flex-1 overflow-y-auto p-4">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center gap-3">
            <AlertTriangle className="w-12 h-12 text-gray-200" />
            <p className="text-gray-500 font-medium">No incidents match your filters</p>
            <p className="text-gray-400 text-sm">
              Try clearing the filters or head to the Map to report a new one.
            </p>
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((incident) => (
              <IncidentCard
                key={incident.id}
                incident={incident}
                isOwner={userId === incident.reported_by}
                onDelete={handleDelete}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
