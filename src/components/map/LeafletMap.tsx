'use client'

import { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import type { Incident } from '@/types/incident'
import { SEVERITY_COLORS, CATEGORY_ICONS } from '@/lib/utils'
import { format } from 'date-fns'

// Fix missing marker icons in Webpack / Next.js builds
// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl:       'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl:     'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
})

function createIcon(severity: string): L.DivIcon {
  const color = SEVERITY_COLORS[severity as keyof typeof SEVERITY_COLORS]?.map ?? '#6366f1'
  return L.divIcon({
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${color};border:3px solid white;
      box-shadow:0 2px 6px rgba(0,0,0,0.35)">
    </div>`,
    className: '',
    iconSize:    [18, 18],
    iconAnchor:  [9, 9],
    popupAnchor: [0, -12],
  })
}

function buildPopup(incident: Incident, userId: string | null): string {
  const color  = SEVERITY_COLORS[incident.severity as keyof typeof SEVERITY_COLORS]?.map ?? '#6366f1'
  const icon   = CATEGORY_ICONS[incident.category] ?? '📍'
  const isOwner = !!userId && userId === incident.reported_by
  const date   = format(new Date(incident.created_at), 'MMM d, yyyy HH:mm')

  const opts = (['active', 'investigating', 'resolved'] as const)
    .map((s) => `<option value="${s}"${incident.status === s ? ' selected' : ''}>${s}</option>`)
    .join('')

  return `
    <div style="min-width:200px;max-width:260px;font-family:system-ui,sans-serif;font-size:13px">
      <div style="display:flex;align-items:flex-start;gap:7px;margin-bottom:8px">
        <span style="font-size:20px;line-height:1">${icon}</span>
        <div style="flex:1;min-width:0">
          <div style="font-weight:700;color:#111;line-height:1.3;word-break:break-word">${incident.title}</div>
          <div style="display:flex;flex-wrap:wrap;gap:3px;margin-top:4px">
            <span style="font-size:10px;font-weight:700;text-transform:uppercase;padding:1px 6px;border-radius:9999px;background:${color}22;color:${color};border:1px solid ${color}55">${incident.severity}</span>
            <span style="font-size:10px;padding:1px 6px;border-radius:9999px;background:#f3f4f6;color:#6b7280;text-transform:capitalize">${incident.category}</span>
          </div>
        </div>
      </div>
      ${incident.description ? `<p style="color:#4b5563;margin:0 0 7px;line-height:1.4">${incident.description}</p>` : ''}
      ${incident.address     ? `<p style="color:#9ca3af;margin:0 0 5px">📍 ${incident.address}</p>`                    : ''}
      <p style="color:#9ca3af;margin:0 0 ${isOwner ? '10' : '0'}px">🕐 ${date}</p>
      ${isOwner ? `
        <div style="border-top:1px solid #e5e7eb;padding-top:8px;display:flex;gap:5px;align-items:center">
          <select id="ps-${incident.id}" style="flex:1;font-size:11px;border:1px solid #d1d5db;border-radius:6px;padding:3px 5px;outline:none;cursor:pointer">${opts}</select>
          <button id="pu-${incident.id}" style="font-size:11px;background:#6366f1;color:#fff;border:none;border-radius:6px;padding:4px 8px;cursor:pointer;white-space:nowrap">Update</button>
          <button id="pd-${incident.id}" style="font-size:11px;background:#fee2e2;color:#dc2626;border:none;border-radius:6px;padding:4px 8px;cursor:pointer">Delete</button>
        </div>` : ''}
    </div>`
}

export interface LeafletMapProps {
  incidents: Incident[]
  onMapClick: (lat: number, lng: number) => void
  onIncidentUpdate: (incident: Incident) => void
  onIncidentDelete: (id: string) => void
  userId: string | null
}

export default function LeafletMap({
  incidents,
  onMapClick,
  onIncidentUpdate,
  onIncidentDelete,
  userId,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef       = useRef<L.Map | null>(null)
  const markersRef   = useRef<Map<string, L.Marker>>(new Map())

  // Initialise map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return

    const map = L.map(containerRef.current, { center: [20, 0], zoom: 2 })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map)

    map.on('click', (e) => onMapClick(e.latlng.lat, e.latlng.lng))
    mapRef.current = map

    return () => {
      map.remove()
      mapRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Sync markers whenever incidents or userId changes
  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    const ids = new Set(incidents.map((i) => i.id))

    // Remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!ids.has(id)) { marker.remove(); markersRef.current.delete(id) }
    })

    // Add / refresh markers
    incidents.forEach((incident) => {
      const existing = markersRef.current.get(incident.id)
      if (existing) {
        existing.setIcon(createIcon(incident.severity))
        existing.setPopupContent(buildPopup(incident, userId))
      } else {
        const marker = L.marker([incident.latitude, incident.longitude], {
          icon: createIcon(incident.severity),
        })

        marker.bindPopup(buildPopup(incident, userId), { maxWidth: 280 })

        marker.on('popupopen', () => {
          const updateBtn = document.getElementById(`pu-${incident.id}`)
          const deleteBtn = document.getElementById(`pd-${incident.id}`)
          const select    = document.getElementById(`ps-${incident.id}`) as HTMLSelectElement | null

          if (updateBtn && select) {
            updateBtn.onclick = async () => {
              const res = await fetch(`/api/incidents/${incident.id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: select.value }),
              })
              if (res.ok) {
                const updated: Incident = await res.json()
                onIncidentUpdate(updated)
                marker.closePopup()
              }
            }
          }

          if (deleteBtn) {
            deleteBtn.onclick = async () => {
              if (!confirm('Delete this incident?')) return
              const res = await fetch(`/api/incidents/${incident.id}`, { method: 'DELETE' })
              if (res.ok) {
                onIncidentDelete(incident.id)
                marker.remove()
                markersRef.current.delete(incident.id)
              }
            }
          }
        })

        marker.addTo(map)
        markersRef.current.set(incident.id, marker)
      }
    })
  }, [incidents, onIncidentUpdate, onIncidentDelete, userId])

  return <div ref={containerRef} className="h-full w-full" />
}
