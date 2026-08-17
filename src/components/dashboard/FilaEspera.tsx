import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

const DEMO_FILA = [
  { nome: 'Rita Mendes', preferencia: 'Manhã' },
  { nome: 'Carlos Vieira', preferencia: 'Tarde' },
  { nome: 'Sofia Martins', preferencia: 'Qualquer hora' },
]

export function FilaEspera({
  count,
  isDemo = false,
}: {
  count: number
  isDemo?: boolean
}) {
  const items = isDemo ? DEMO_FILA : []

  return (
    <section>
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-display text-xl font-bold">Fila de espera</h3>
        <Badge>{count} pacientes</Badge>
      </div>
      <Card className="space-y-3">
        {items.length > 0 ? (
          items.map((p) => (
            <div
              key={p.nome}
              className="flex items-center justify-between border-2 border-white/5 bg-bg-primary px-3 py-3"
            >
              <span className="font-bold">{p.nome}</span>
              <span className="text-xs font-bold uppercase text-white/40">
                {p.preferencia}
              </span>
            </div>
          ))
        ) : (
          <p className="py-4 text-center text-sm text-white/40">
            {count > 0
              ? `${count} pacientes na fila (detalhe gerido pelas automações).`
              : 'Ainda não há pacientes na fila de espera.'}
          </p>
        )}
        <p className="text-xs text-white/40">
          A fila é gerida automaticamente quando surge uma vaga.
        </p>
      </Card>
    </section>
  )
}
