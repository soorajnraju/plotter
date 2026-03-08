'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { MapPin, List, LogOut } from 'lucide-react'
import { cn } from '@/lib/utils'
import ThemeSwitcher from '@/components/layout/ThemeSwitcher'

export default function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  const navItems = [
    { href: '/map',       label: 'Map',       Icon: MapPin },
    { href: '/incidents', label: 'Incidents',  Icon: List   },
  ]

  return (
    <nav className="h-13 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 flex items-center px-4 gap-1 shrink-0 z-10">
      {/* Brand */}
      <Link href="/" className="flex items-center gap-2 mr-4 select-none">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center shadow-sm">
          <MapPin className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-gray-900 dark:text-white text-base tracking-tight">Plotter</span>
      </Link>

      {/* Nav links */}
      {navItems.map(({ href, label, Icon }) => (
        <Link
          key={href}
          href={href}
          aria-label={label}
          className={cn(
            'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
            pathname === href
              ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
              : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100',
          )}
        >
          <Icon className="w-4 h-4" />
          <span className="hidden sm:inline">{label}</span>
        </Link>
      ))}

      {/* Theme + Logout */}
      <div className="ml-auto flex items-center gap-0.5">
        <ThemeSwitcher />
        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </nav>
  )
}
