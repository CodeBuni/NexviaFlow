import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function Navbar() {
  const location = useLocation()
  const isAuth = location.pathname.includes('/registo') || location.pathname.includes('/login')

  return (
    <header className="sticky top-0 z-40 border-b-2 border-white/10 bg-bg-primary/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 md:px-6">
        <Link to="/flow" className="font-display text-2xl font-bold tracking-tight">
          Nexvia <span className="text-primary">Flow</span>
        </Link>
        {!isAuth && (
          <nav className="flex items-center gap-2 md:gap-3">
            <a href="#como-funciona" className="hidden text-sm font-bold text-white/60 hover:text-white md:inline">
              Como funciona
            </a>
            <a href="#planos" className="hidden text-sm font-bold text-white/60 hover:text-white md:inline">
              Planos
            </a>
            <Link to="/flow/login">
              <Button variant="ghost" className="px-3 py-2 text-xs md:px-4">
                Entrar
              </Button>
            </Link>
            <Link to="/flow/registo">
              <Button className="px-3 py-2 text-xs md:px-4">Começar agora</Button>
            </Link>
          </nav>
        )}
      </div>
    </header>
  )
}
