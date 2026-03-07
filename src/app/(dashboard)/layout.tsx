import Navbar from '@/components/layout/Navbar'

// Dashboard pages are always user-specific — skip static prerender
export const dynamic = 'force-dynamic'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Navbar />
      <main className="flex-1 overflow-hidden">{children}</main>
    </div>
  )
}
