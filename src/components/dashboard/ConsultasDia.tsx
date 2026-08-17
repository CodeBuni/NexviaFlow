import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useDashboardContext } from '@/hooks/useDashboardContext'
import { formatTime } from '@/lib/utils'
import type { ConsultaStatus } from '@/types'

const statusTone: Record<ConsultaStatus, 'green' | 'red' | 'primary' | 'muted'> = {
  confirmado: 'green',
  pendente: 'primary',
  risco: 'red',
  cancelado: 'muted',
  faltou: 'red',
}

export function ConsultasDia({ compact = false }: { compact?: boolean }) {
  const { clinica } = useAuth()
  const { consultas, loading, isDemo } = useDashboardContext()

  if (loading) {
    return <Skeleton className="h-64" />
  }

  return (
    <section>
      {!compact && (
        <>
          <h2 className="font-display text-2xl font-bold">Consultas do dia</h2>
          <p className="mt-1 text-white/50">Estado de cada paciente na agenda de hoje.</p>
        </>
      )}
      {compact && (
        <div className="mb-3 flex items-center gap-2">
          <h3 className="font-display text-xl font-bold">Consultas do dia</h3>
          {isDemo && <Badge>Demo</Badge>}
        </div>
      )}
      <Card className={compact ? 'p-0' : 'mt-4 p-0'}>
        <div className="divide-y-2 divide-white/5">
          {consultas.map((consulta) => (
            <div
              key={consulta.id}
              className="flex items-center justify-between gap-3 px-4 py-4"
            >
              <div>
                <p className="font-bold">{consulta.paciente_nome}</p>
                <p className="text-sm text-white/40">
                  {formatTime(consulta.data_hora)}
                  {clinica?.plano === 'pro' && consulta.score_risco != null
                    ? ` · risco ${consulta.score_risco}%`
                    : ''}
                </p>
              </div>
              <Badge tone={statusTone[consulta.status]}>{consulta.status}</Badge>
            </div>
          ))}
          {consultas.length === 0 && (
            <p className="px-4 py-8 text-center text-white/40">
              Sem consultas para hoje. Quando o calendário e as automações estiverem
              ligados, aparecem aqui.
            </p>
          )}
        </div>
      </Card>
    </section>
  )
}
