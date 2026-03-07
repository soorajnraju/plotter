import Link from 'next/link'
import { MapPin } from 'lucide-react'

export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 select-none">
            <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Plotter</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-12">
        {children}
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 py-6 text-center text-xs text-gray-400 dark:text-gray-500 space-x-4">
        <Link href="/privacy" className="hover:text-gray-600 dark:hover:text-gray-300">Privacy Policy</Link>
        <Link href="/terms" className="hover:text-gray-600 dark:hover:text-gray-300">Terms of Service</Link>
        <Link href="/" className="hover:text-gray-600 dark:hover:text-gray-300">Back to App</Link>
      </footer>
    </div>
  )
}
