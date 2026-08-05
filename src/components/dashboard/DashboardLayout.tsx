import { Outlet } from 'react-router-dom'
import { Header } from './Header'
import { Sidebar } from './Sidebar'

export function DashboardLayout() {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[240px_1fr]">
      <Sidebar />
      <div className="min-w-0">
        <Header />
        <main className="px-4 py-6 md:px-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
