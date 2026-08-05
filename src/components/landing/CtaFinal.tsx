import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/Button'

export function CtaFinal() {
  return (
    <section className="py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <div className="border-2 border-primary bg-primary/10 p-8 shadow-brutal-lg md:p-12">
          <h2 className="max-w-2xl font-display text-3xl font-bold md:text-4xl">
            O Nexvia Flow confirma os seus pacientes enquanto você dorme.
          </h2>
          <p className="mt-4 max-w-xl text-white/70">
            Pare de perder dinheiro com cadeiras vazias. Configure a sua clínica
            em minutos e ative a retenção automática.
          </p>
          <Link to="/flow/registo" className="mt-8 inline-block">
            <Button>Começar agora</Button>
          </Link>
        </div>
      </div>
    </section>
  )
}
