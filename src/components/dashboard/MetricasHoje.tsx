import { Calendar, CheckCircle2, AlertTriangle, XCircle, Users } from 'lucide-react'
import { MetricCard } from '@/components/ui/MetricCard'
import { Skeleton } from '@/components/ui/Skeleton'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { FilaEspera } from './FilaEspera'
import { ConsultasDia } from './ConsultasDia'

export function MetricasHoje() {
  const { clinica } = useAuth()
  const { hoje, mes, loading } = useDashboard(clinica?.id)

  if (loading || !hoje) {
    return (
      <div className="grid gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
    )
  }

  const taxa = hoje.consultas_agendadas
    ? (hoje.consultas_confirmadas / hoje.consultas_agendadas) * 100
    : 0

  return (
    <div className="space-y-8">
      <section>
        <h2 className="font-display text-2xl font-bold">Hoje</h2>
        <p className="mt-1 text-white/50">
          Confirmações e risco em tempo real na sua clínica.
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <MetricCard
            label="Consultas agendadas"
            value={hoje.consultas_agendadas}
            icon={<Calendar size={18} />}
          />
          <MetricCard
            label="Confirmadas"
            value={`${hoje.consultas_confirmadas} (${formatPercent(taxa)})`}
            tone="green"
            icon={<CheckCircle2 size={18} />}
          />
          <MetricCard
            label="Em risco"
            value={hoje.consultas_em_risco}
            tone="red"
            icon={<AlertTriangle size={18} />}
          />
          <MetricCard
            label="Canceladas"
            value={hoje.consultas_canceladas}
            icon={<XCircle size={18} />}
          />
          <MetricCard
            label="Vaga pela fila"
            value={hoje.vagas_preenchidas_fila}
            tone="primary"
            icon={<Users size={18} />}
          />
        </div>
      </section>

      <section>
        <h2 className="font-display text-2xl font-bold">Este mês</h2>
        <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Faltas evitadas" value={mes.faltas_evitadas} tone="green" />
          <MetricCard
            label="Dinheiro estimado poupado"
            value={formatCurrency(mes.valor_estimado_poupado)}
            tone="primary"
          />
          <MetricCard
            label="Taxa de confirmação"
            value={formatPercent(mes.taxa_confirmacao)}
          />
          <MetricCard
            label="Pacientes na fila"
            value={mes.pacientes_fila_espera}
          />
        </div>
      </section>

      <div className="grid gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <ConsultasDia compact />
        </div>
        <FilaEspera count={mes.pacientes_fila_espera} />
      </div>
    </div>
  )
}
