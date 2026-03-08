import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const SEVERITY_COLORS = {
  low:      { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-800 dark:text-green-400',  border: 'border-green-200 dark:border-green-800',  map: '#22c55e' },
  medium:   { bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-800 dark:text-yellow-400', border: 'border-yellow-200 dark:border-yellow-800', map: '#eab308' },
  high:     { bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-800 dark:text-orange-400', border: 'border-orange-200 dark:border-orange-800', map: '#f97316' },
  critical: { bg: 'bg-red-100 dark:bg-red-900/30',    text: 'text-red-800 dark:text-red-400',    border: 'border-red-200 dark:border-red-800',    map: '#ef4444' },
} as const

export const STATUS_COLORS = {
  active:        { bg: 'bg-red-100 dark:bg-red-900/30',   text: 'text-red-700 dark:text-red-400'   },
  investigating: { bg: 'bg-blue-100 dark:bg-blue-900/30', text: 'text-blue-700 dark:text-blue-400' },
  resolved:      { bg: 'bg-gray-100 dark:bg-gray-700',    text: 'text-gray-600 dark:text-gray-400' },
} as const

export const CATEGORY_ICONS: Record<string, string> = {
  accident: '🚗',
  fire:     '🔥',
  medical:  '🚑',
  crime:    '🚨',
  weather:  '⛈️',
  other:    '📍',
}
