import { MetricCard } from '@/components/ui/MetricCard'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useDashboardContext } from '@/hooks/useDashboardContext'
import { formatCurrency, formatPercent } from '@/lib/utils'
import { useToast } from '@/components/ui/Toast'

export function RelatorioMensal() {
  const { mes, hoje, isDemo } = useDashboardContext()
  const { toast } = useToast()

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-display text-2xl font-bold">Relatório mensal</h2>
            {isDemo && <Badge>Demo</Badge>}
          </div>
          <p className="mt-1 text-white/50">
            Impacto financeiro da retenção na sua clínica.
          </p>
        </div>
        <Button
          variant="secondary"
          onClick={() => toast('Exportação PDF disponível em breve.', 'info')}
        >
          Exportar PDF
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <MetricCard label="Faltas evitadas" value={mes.faltas_evitadas} tone="green" />
        <MetricCard
          label="€ estimado poupado"
          value={formatCurrency(mes.valor_estimado_poupado)}
          tone="primary"
        />
        <MetricCard
          label="Taxa de confirmação"
          value={formatPercent(mes.taxa_confirmacao)}
        />
      </div>

      <Card>
        <h3 className="font-display text-xl font-bold">Resumo operacional</h3>
        <ul className="mt-4 space-y-3 text-sm">
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">Consultas hoje</span>
            <span className="font-bold">{hoje?.consultas_agendadas ?? 0}</span>
          </li>
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">Vagas preenchidas pela fila</span>
            <span className="font-bold">{hoje?.vagas_preenchidas_fila ?? 0}</span>
          </li>
          <li className="flex justify-between py-2">
            <span className="text-white/50">Pacientes em espera</span>
            <span className="font-bold">{mes.pacientes_fila_espera}</span>
          </li>
        </ul>
      </Card>
    </div>
  )
}
