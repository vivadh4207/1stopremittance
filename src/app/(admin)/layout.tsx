import { AdminSidebar } from '@/components/admin/admin-sidebar'
import { Bell, Search } from 'lucide-react'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  // In production, gate behind admin role check:
  // const session = await getServerSession()
  // if (!session?.user?.role === 'admin') redirect('/login')

  return (
    <div className="flex min-h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-6 bg-white border-b border-gray-200">
          <div className="flex items-center gap-4">
            <h1 className="text-lg font-semibold text-gray-900">Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search..."
                className="h-9 w-64 rounded-lg border border-gray-300 bg-gray-50 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              />
            </div>
            <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <Bell className="h-5 w-5 text-gray-500" />
              <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
            </button>
            <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
              <div className="flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white text-sm font-medium">
                VA
              </div>
              <div className="text-sm">
                <p className="font-medium text-gray-900">Vivek A.</p>
                <p className="text-xs text-gray-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  )
}
