import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SEVERITY_COLORS = {
  low:      { bg: 'bg-green-100',  text: 'text-green-800',  border: 'border-green-200',  map: '#22c55e' },
  medium:   { bg: 'bg-yellow-100', text: 'text-yellow-800', border: 'border-yellow-200', map: '#eab308' },
  high:     { bg: 'bg-orange-100', text: 'text-orange-800', border: 'border-orange-200', map: '#f97316' },
  critical: { bg: 'bg-red-100',    text: 'text-red-800',    border: 'border-red-200',    map: '#ef4444' },
} as const

export const STATUS_COLORS = {
  active:        { bg: 'bg-red-100',  text: 'text-red-700'  },
  investigating: { bg: 'bg-blue-100', text: 'text-blue-700' },
  resolved:      { bg: 'bg-gray-100', text: 'text-gray-600' },
} as const

export const CATEGORY_ICONS: Record<string, string> = {
  accident: '🚗',
  fire:     '🔥',
  medical:  '🚑',
  crime:    '🚨',
  weather:  '⛈️',
  other:    '📍',
}
