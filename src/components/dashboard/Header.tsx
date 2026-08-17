import { RefreshCw } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardContext } from '@/hooks/useDashboardContext'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'

export function Header() {
  const { clinica } = useAuth()
  const { refresh, loading } = useDashboardContext()

  return (
    <header className="flex items-center justify-between border-b-2 border-white/10 px-4 py-4 md:px-6">
      <div>
        <p className="text-xs font-bold uppercase tracking-wide text-white/40">
          Painel da clínica
        </p>
        <h1 className="font-display text-xl font-bold md:text-2xl">
          {clinica?.nome_clinica || 'A sua clínica'}
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          className="px-2 py-2"
          onClick={() => refresh()}
          disabled={loading}
          aria-label="Atualizar métricas"
          title="Atualizar"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : undefined} />
        </Button>
        <Badge tone={clinica?.ativo ? 'green' : 'muted'}>
          {clinica?.ativo ? 'Ativo' : 'Inativo'}
        </Badge>
        <Badge>{clinica?.plano || 'starter'}</Badge>
      </div>
    </header>
  )
}
