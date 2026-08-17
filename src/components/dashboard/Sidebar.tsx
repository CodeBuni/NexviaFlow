import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard,
  CalendarDays,
  FileBarChart2,
  Settings,
  LogOut,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'

const links = [
  { to: '/flow/dashboard', label: 'Hoje', icon: LayoutDashboard, end: true },
  { to: '/flow/dashboard/consultas', label: 'Consultas', icon: CalendarDays },
  { to: '/flow/dashboard/relatorio', label: 'Relatório', icon: FileBarChart2 },
  { to: '/flow/dashboard/configuracoes', label: 'Configurações', icon: Settings },
]

export function Sidebar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = async () => {
    await logout()
    navigate('/flow/login')
  }

  return (
    <aside className="border-b-2 border-white/10 bg-bg-secondary md:min-h-screen md:border-r-2 md:border-b-0">
      <div className="flex items-center justify-between px-4 py-5 md:block">
        <p className="font-display text-xl font-bold">
          Nexvia <span className="text-primary">Flow</span>
        </p>
        <Button
          variant="ghost"
          className="px-2 py-2 md:hidden"
          onClick={handleLogout}
          aria-label="Sair"
        >
          <LogOut size={16} />
        </Button>
      </div>
      <nav className="flex gap-1 overflow-x-auto px-2 pb-3 md:flex-col md:overflow-visible md:px-3 md:pb-0">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-2 border-2 px-3 py-2 text-sm font-bold uppercase tracking-wide whitespace-nowrap',
                isActive
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-transparent text-white/50 hover:border-white/10 hover:text-white',
              )
            }
          >
            <link.icon size={16} />
            {link.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-4 hidden px-3 md:block">
        <Button
          variant="ghost"
          className="w-full justify-start px-3"
          onClick={handleLogout}
        >
          <LogOut size={16} />
          Sair
        </Button>
      </div>
    </aside>
  )
}
