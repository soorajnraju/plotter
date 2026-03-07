'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import { MapPin, Clock, Trash2 } from 'lucide-react'
import { Incident } from '@/types/incident'
import { SEVERITY_COLORS, STATUS_COLORS, CATEGORY_ICONS, cn } from '@/lib/utils'

interface IncidentCardProps {
  incident: Incident
  isOwner: boolean
  onDelete: (id: string) => void
  onStatusUpdate: (id: string, status: string) => void
}

export default function IncidentCard({ incident, isOwner, onDelete, onStatusUpdate }: IncidentCardProps) {
  const sev    = SEVERITY_COLORS[incident.severity]
  const stat   = STATUS_COLORS[incident.status]
  const icon   = CATEGORY_ICONS[incident.category] ?? '📍'

  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-4 flex flex-col gap-2">
      {/* Title row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2 min-w-0">
          <span className="text-xl leading-none shrink-0 mt-0.5">{icon}</span>
          <h3 className="font-semibold text-gray-900 text-sm leading-snug line-clamp-2">{incident.title}</h3>
        </div>
        {isOwner && (
          <button
            onClick={() => onDelete(incident.id)}
            className="shrink-0 p-1 text-gray-300 hover:text-red-500 transition-colors rounded"
            title="Delete incident"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Badges */}
      <div className="flex flex-wrap gap-1.5">
        <span className={cn('text-xs font-bold px-2 py-0.5 rounded-full border uppercase tracking-wide', sev.bg, sev.text, sev.border)}>
          {incident.severity}
        </span>
        <span className={cn('text-xs px-2 py-0.5 rounded-full capitalize', stat.bg, stat.text)}>
          {incident.status}
        </span>
        <span className="text-xs px-2 py-0.5 rounded-full bg-gray-100 text-gray-600 capitalize">
          {incident.category}
        </span>
      </div>

      {/* Description */}
      {incident.description && (
        <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed">{incident.description}</p>
      )}

      {/* Meta */}
      <div className="space-y-0.5 text-xs text-gray-400">
        {incident.address && (
          <div className="flex items-center gap-1 truncate">
            <MapPin className="w-3 h-3 shrink-0" />
            <span className="truncate">{incident.address}</span>
          </div>
        )}
        <div className="flex items-center gap-1">
          <Clock className="w-3 h-3 shrink-0" />
          <span>{format(new Date(incident.created_at), 'MMM d, yyyy HH:mm')}</span>
        </div>
      </div>

      {/* Owner controls */}
      {isOwner && (
        <select
          value={incident.status}
          onChange={(e) => onStatusUpdate(incident.id, e.target.value)}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="active">Active</option>
          <option value="investigating">Investigating</option>
          <option value="resolved">Resolved</option>
        </select>
      )}

      {/* View on map */}
      <Link
        href={`/map?lat=${incident.latitude}&lng=${incident.longitude}`}
        className="text-xs text-indigo-600 hover:text-indigo-700 font-medium"
      >
        View on map →
      </Link>
    </div>
  )
}
