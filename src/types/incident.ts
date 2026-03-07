export type IncidentCategory = 'accident' | 'fire' | 'medical' | 'crime' | 'weather' | 'other'
export type IncidentSeverity = 'low' | 'medium' | 'high' | 'critical'
export type IncidentStatus = 'active' | 'investigating' | 'resolved'

export interface Incident {
  id: string
  title: string
  description: string | null
  category: IncidentCategory
  severity: IncidentSeverity
  status: IncidentStatus
  latitude: number
  longitude: number
  address: string | null
  reported_by: string | null
  reported_by_email: string | null
  created_at: string
  updated_at: string
}

export interface CreateIncidentInput {
  title: string
  description?: string
  category: IncidentCategory
  severity: IncidentSeverity
  latitude: number
  longitude: number
  address?: string
}

export interface IncidentFilters {
  search?: string
  category?: IncidentCategory | ''
  severity?: IncidentSeverity | ''
  status?: IncidentStatus | ''
}
