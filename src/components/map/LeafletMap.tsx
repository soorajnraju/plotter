'use client'

import { useEffect, useRef, useState } from 'react'
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

// Inline SVG icons used inside the Leaflet locate control
const CROSSHAIR_SVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="22" y1="12" x2="18" y2="12"/><line x1="6" y1="12" x2="2" y2="12"/><line x1="12" y1="6" x2="12" y2="2"/><line x1="12" y1="22" x2="12" y2="18"/></svg>`
const SPINNER_SVG  = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="animation:ulp-spin 0.8s linear infinite;display:block"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`

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
  focusLocation?: { lat: number; lng: number } | null
}

export default function LeafletMap({
  incidents,
  onMapClick,
  onIncidentUpdate,
  onIncidentDelete,
  userId,
  focusLocation,
}: LeafletMapProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  // useState (not useRef) so changing the map instance triggers a re-render,
  // which guarantees the marker effect re-runs after the map is ready.
  const [map, setMap] = useState<L.Map | null>(null)
  const markersRef   = useRef<Map<string, L.Marker>>(new Map())
  const fittedRef    = useRef(false)

  // Stable callback refs — prevent marker effect from re-running on every render
  const onMapClickRef       = useRef(onMapClick)
  const onIncidentUpdateRef = useRef(onIncidentUpdate)
  const onIncidentDeleteRef = useRef(onIncidentDelete)
  useEffect(() => { onMapClickRef.current       = onMapClick       })
  useEffect(() => { onIncidentUpdateRef.current = onIncidentUpdate })
  useEffect(() => { onIncidentDeleteRef.current = onIncidentDelete })

  // ── Initialise map once ───────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return

    // Inject animation CSS once (pulse rings + spinner)
    if (!document.getElementById('ulp-style')) {
      const el = document.createElement('style')
      el.id = 'ulp-style'
      el.textContent = `
        @keyframes ulp-ring {
          0%   { transform: translate(-50%,-50%) scale(0.3); opacity: 0.9; }
          100% { transform: translate(-50%,-50%) scale(2.8); opacity: 0;   }
        }
        @keyframes ulp-spin {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
      `
      document.head.appendChild(el)
    }

    const leafletMap = L.map(containerRef.current, { center: [20, 0], zoom: 2 })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(leafletMap)

    leafletMap.on('click', (e) => onMapClickRef.current(e.latlng.lat, e.latlng.lng))

    // ── "Locate Me" Leaflet control ─────────────────────────────
    // Built as a native Leaflet control so it renders inside the map's own
    // z-index stack and is always visible regardless of the page's CSS context.
    let userMarker: L.Marker | null = null

    function buildPulseIcon(): L.DivIcon {
      return L.divIcon({
        html: `
          <div style="position:relative;width:20px;height:20px">
            <div style="position:absolute;top:50%;left:50%;width:40px;height:40px;border-radius:50%;background:rgba(79,70,229,0.35);animation:ulp-ring 2s ease-out infinite;"></div>
            <div style="position:absolute;top:50%;left:50%;width:40px;height:40px;border-radius:50%;background:rgba(79,70,229,0.2);animation:ulp-ring 2s ease-out 1s infinite;"></div>
            <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:16px;height:16px;border-radius:50%;background:#4f46e5;border:3px solid white;box-shadow:0 0 8px rgba(79,70,229,0.7);z-index:2;"></div>
          </div>`,
        className: '',
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
      })
    }

    // L.Control.extend is inherited from L.Class but TypeScript's static-side
    // inheritance doesn't model it directly, so the any cast is required here.
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const LocateControl = (L.Control as any).extend({
      options: { position: 'topright' },

      onAdd(): HTMLElement {
        // Wrap in a leaflet-bar container so Leaflet's default control styles apply
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control')
        const btn = L.DomUtil.create('a', '', container) as HTMLAnchorElement
        btn.href = '#'
        btn.title = 'Go to my location'
        btn.setAttribute('role', 'button')
        btn.setAttribute('aria-label', 'Go to my location')
        // Match Leaflet's zoom-button dimensions and add indigo icon colour
        btn.style.cssText =
          'display:flex;align-items:center;justify-content:center;color:#4f46e5;'
        btn.innerHTML = CROSSHAIR_SVG

        // Prevent map clicks from firing when the button is clicked
        L.DomEvent.disableClickPropagation(container)

        L.DomEvent.on(btn, 'click', (e) => {
          L.DomEvent.preventDefault(e)

          if (!navigator.geolocation) {
            btn.style.color = '#dc2626'
            setTimeout(() => { btn.style.color = '#4f46e5' }, 2000)
            return
          }

          // Show loading state
          btn.innerHTML = SPINNER_SVG
          btn.style.pointerEvents = 'none'

          navigator.geolocation.getCurrentPosition(
            (pos) => {
              // Restore button
              btn.innerHTML = CROSSHAIR_SVG
              btn.style.pointerEvents = ''

              const lat = pos.coords.latitude
              const lng = pos.coords.longitude

              // Create or move the pulsing "you are here" marker
              if (userMarker) {
                userMarker.setLatLng([lat, lng])
                userMarker.setIcon(buildPulseIcon())
              } else {
                userMarker = L.marker([lat, lng], {
                  icon: buildPulseIcon(),
                  zIndexOffset: 1000,
                }).addTo(leafletMap)
              }

              // Fly to the user's position at max zoom
              leafletMap.flyTo([lat, lng], 17, { animate: true, duration: 1.5 })
            },
            () => {
              // Geolocation denied / timed out — flash button red briefly
              btn.innerHTML = CROSSHAIR_SVG
              btn.style.pointerEvents = ''
              btn.style.color = '#dc2626'
              setTimeout(() => { btn.style.color = '#4f46e5' }, 3000)
            },
            { enableHighAccuracy: true, timeout: 10_000 },
          )
        })

        return container
      },

      onRemove(): void {},
    })

    new LocateControl().addTo(leafletMap)

    // Setting state triggers a React re-render → the marker effect below
    // will fire with a non-null map, guaranteed after this init completes.
    setMap(leafletMap)

    return () => {
      leafletMap.remove()
      setMap(null)
      fittedRef.current = false
      markersRef.current.clear()
    }
  }, [])

  // ── Sync markers + position map ──────────────────────────────────
  // Depends on `map` (state) so it only runs once the map is truly ready.
  useEffect(() => {
    if (!map) return

    // Recalculate container dimensions in case CSS was applied after init
    // (critical for absolute/flex containers with dynamic imports)
    map.invalidateSize()

    const ids = new Set(incidents.map((i) => i.id))

    // Remove stale markers
    markersRef.current.forEach((marker, id) => {
      if (!ids.has(id)) {
        marker.remove()
        markersRef.current.delete(id)
      }
    })

    // Add / refresh markers
    incidents.forEach((incident) => {
      const existing = markersRef.current.get(incident.id)
      if (existing) {
        existing.setIcon(createIcon(incident.severity))
        existing.setPopupContent(buildPopup(incident, userId))
        return
      }

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
              onIncidentUpdateRef.current(updated)
              marker.closePopup()
            }
          }
        }

        if (deleteBtn) {
          deleteBtn.onclick = async () => {
            if (!confirm('Delete this incident?')) return
            const res = await fetch(`/api/incidents/${incident.id}`, { method: 'DELETE' })
            if (res.ok) {
              onIncidentDeleteRef.current(incident.id)
              marker.remove()
              markersRef.current.delete(incident.id)
            }
          }
        }
      })

      marker.addTo(map)
      markersRef.current.set(incident.id, marker)
    })

    // Position the map — deferred one frame so the browser has painted the
    // new markers before we move the viewport.
    const raf = requestAnimationFrame(() => {
      if (focusLocation) {
        map.setView([focusLocation.lat, focusLocation.lng], 15)
        // Open the popup for the matching marker
        markersRef.current.forEach((marker) => {
          const pos = marker.getLatLng()
          if (
            Math.abs(pos.lat - focusLocation.lat) < 0.001 &&
            Math.abs(pos.lng - focusLocation.lng) < 0.001
          ) {
            marker.openPopup()
          }
        })
      } else if (!fittedRef.current && incidents.length > 0) {
        fittedRef.current = true
        map.fitBounds(
          L.latLngBounds(incidents.map((i) => [i.latitude, i.longitude])),
          { padding: [48, 48], maxZoom: 14 },
        )
      }
    })

    return () => cancelAnimationFrame(raf)
  }, [map, incidents, userId, focusLocation])

  // The container uses absolute inset-0 so it fills the relatively-positioned
  // parent regardless of whether the parent's height comes from flex or CSS.
  return <div ref={containerRef} className="absolute inset-0" />
}
