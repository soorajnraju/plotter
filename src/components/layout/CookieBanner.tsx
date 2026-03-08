'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { X } from 'lucide-react'

const STORAGE_KEY = 'plotter_cookie_consent'

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      if (!stored) setVisible(true)
    } catch {
      // localStorage unavailable (SSR or privacy mode) — don't show banner
    }
  }, [])

  function accept() {
    try { localStorage.setItem(STORAGE_KEY, 'accepted') } catch { /* ignore */ }
    setVisible(false)
  }

  function dismiss() {
    try { localStorage.setItem(STORAGE_KEY, 'dismissed') } catch { /* ignore */ }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:max-w-sm z-[9999] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl shadow-lg p-4"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">Cookies &amp; Privacy</p>
        <button
          onClick={dismiss}
          className="shrink-0 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          aria-label="Dismiss"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed mb-4">
        We use cookies to keep you signed in and anonymous analytics to improve the app.
        No advertising or cross-site tracking.{' '}
        <Link href="/privacy" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
          Privacy Policy
        </Link>
        {' '}·{' '}
        <Link href="/terms" className="text-indigo-600 dark:text-indigo-400 underline underline-offset-2">
          Terms
        </Link>
      </p>

      <div className="flex gap-2">
        <button
          onClick={accept}
          className="flex-1 py-2 text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors"
        >
          Accept
        </button>
        <button
          onClick={dismiss}
          className="flex-1 py-2 text-xs font-medium text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
        >
          Decline
        </button>
      </div>
    </div>
  )
}
