import Link from 'next/link'
import Navbar from '@/components/layout/Navbar'

// Dashboard pages are always user-specific — skip static prerender
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden bg-white dark:bg-gray-950">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
      <footer className="shrink-0 border-t border-gray-100 dark:border-gray-800 px-4 py-1.5 flex items-center justify-end gap-4">
        <Link href="/privacy" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Privacy</Link>
        <Link href="/terms" className="text-xs text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">Terms</Link>
      </footer>
    </div>
  )
}
