import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center gap-4 px-4 text-center">
      <p className="text-xs font-bold uppercase tracking-wide text-primary">404</p>
      <h1 className="font-display text-3xl font-bold">Página não encontrada</h1>
      <p className="text-white/50">
        Esta rota não existe no Nexvia Flow. Volte à landing ou ao painel.
      </p>
      <div className="flex flex-wrap justify-center gap-3">
        <Link to="/flow">
          <Button>Ir para a landing</Button>
        </Link>
        <Link to="/flow/login">
          <Button variant="ghost">Entrar</Button>
        </Link>
      </div>
    </div>
  )
}
