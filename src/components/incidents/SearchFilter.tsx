'use client'

import { IncidentFilters, IncidentCategory, IncidentSeverity, IncidentStatus } from '@/types/incident'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

interface SearchFilterProps {
  filters: IncidentFilters
  onChange: (filters: IncidentFilters) => void
  compact?: boolean
}

export default function SearchFilter({ filters, onChange, compact = false }: SearchFilterProps) {
  const hasFilters = filters.search || filters.category || filters.severity || filters.status

  return (
    <div className={cn('flex flex-wrap gap-2 items-center', compact && 'text-sm')}>
      {/* Search */}
      <div className="relative flex-1 min-w-44">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
        <input
          type="text"
          value={filters.search ?? ''}
          onChange={(e) => onChange({ ...filters, search: e.target.value })}
          placeholder="Search incidents…"
          className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </div>

      {/* Category */}
      <select
        value={filters.category ?? ''}
        onChange={(e) => onChange({ ...filters, category: e.target.value as IncidentCategory | '' })}
        className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
      >
        <option value="">All Categories</option>
        <option value="accident">🚗 Accident</option>
        <option value="fire">🔥 Fire</option>
        <option value="medical">🚑 Medical</option>
        <option value="crime">🚨 Crime</option>
        <option value="weather">⛈️ Weather</option>
        <option value="other">📍 Other</option>
      </select>

      {/* Severity */}
      <select
        value={filters.severity ?? ''}
        onChange={(e) => onChange({ ...filters, severity: e.target.value as IncidentSeverity | '' })}
        className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
      >
        <option value="">All Severities</option>
        <option value="low">🟢 Low</option>
        <option value="medium">🟡 Medium</option>
        <option value="high">🟠 High</option>
        <option value="critical">🔴 Critical</option>
      </select>

      {/* Status */}
      <select
        value={filters.status ?? ''}
        onChange={(e) => onChange({ ...filters, status: e.target.value as IncidentStatus | '' })}
        className="text-sm border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white text-gray-700"
      >
        <option value="">All Statuses</option>
        <option value="active">Active</option>
        <option value="investigating">Investigating</option>
        <option value="resolved">Resolved</option>
      </select>

      {/* Clear */}
      {hasFilters && (
        <button
          onClick={() => onChange({ search: '', category: '', severity: '', status: '' })}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700 px-2.5 py-1.5 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X className="w-3.5 h-3.5" />
          Clear
        </button>
      )}
    </div>
  )
}
