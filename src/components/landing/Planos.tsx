import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { PLANOS } from '@/types'
import { formatCurrency } from '@/lib/utils'

export function Planos() {
  return (
    <section id="planos" className="border-b-2 border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Planos</h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Escolha o plano certo para a dimensão da sua clínica. Pagamento mensal via Stripe.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {PLANOS.map((plano) => (
            <article
              key={plano.id}
              className={`border-2 p-6 shadow-brutal ${
                plano.destaque
                  ? 'border-primary bg-primary/5'
                  : 'border-white/10 bg-bg-secondary'
              }`}
            >
              <div className="flex items-center justify-between gap-3">
                <h3 className="font-display text-2xl font-bold">{plano.nome}</h3>
                {plano.destaque && <Badge>Mais popular</Badge>}
              </div>
              <p className="mt-4 font-display text-4xl font-bold">
                {formatCurrency(plano.preco)}
                <span className="text-base font-medium text-white/40">/mês</span>
              </p>
              <p className="mt-2 text-white/60">{plano.descricao}</p>
              <ul className="mt-6 space-y-3">
                {plano.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm text-white/80">
                    <Check size={18} className="mt-0.5 shrink-0 text-green" />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link to={`/flow/registo?plano=${plano.id}`} className="mt-8 block">
                <Button className="w-full" variant={plano.destaque ? 'primary' : 'secondary'}>
                  Começar com {plano.nome}
                </Button>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
