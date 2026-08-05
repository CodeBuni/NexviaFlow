import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { Button } from '@/components/ui/Button'

export function Hero() {
  const rootRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-hero]', {
        y: 28,
        opacity: 0,
        duration: 0.8,
        stagger: 0.12,
        ease: 'power3.out',
      })
      gsap.from('[data-hero-panel]', {
        x: 40,
        opacity: 0,
        duration: 1,
        delay: 0.25,
        ease: 'power3.out',
      })
    }, rootRef)
    return () => ctx.revert()
  }, [])

  return (
    <section
      ref={rootRef}
      className="relative overflow-hidden border-b-2 border-white/10 grid-bg"
    >
      <div className="mx-auto grid min-h-[calc(100vh-73px)] max-w-6xl items-center gap-10 px-4 py-16 md:grid-cols-2 md:px-6 md:py-20">
        <div>
          <p data-hero className="font-display text-4xl font-bold tracking-tight text-white md:text-6xl">
            Nexvia <span className="text-primary">Flow</span>
          </p>
          <h1
            data-hero
            className="mt-6 max-w-xl font-display text-3xl font-bold leading-tight md:text-4xl"
          >
            Pare de perder dinheiro com faltas. O Nexvia Flow resolve.
          </h1>
          <p data-hero className="mt-4 max-w-lg text-lg text-white/60">
            Confirma os seus pacientes por WhatsApp, preenche vagas e mostra o
            dinheiro que a sua clínica deixa de perder — sem configurar
            automações à mão.
          </p>
          <div data-hero className="mt-8 flex flex-wrap gap-3">
            <Link to="/flow/registo">
              <Button>Começar agora</Button>
            </Link>
            <a href="#como-funciona">
              <Button variant="secondary">Ver como funciona</Button>
            </a>
          </div>
        </div>

        <div
          data-hero-panel
          className="relative border-2 border-white/10 bg-bg-card p-6 shadow-brutal-lg"
        >
          <div className="absolute -top-3 -left-3 border-2 border-primary bg-primary px-3 py-1 text-xs font-bold uppercase">
            Hoje na clínica
          </div>
          <div className="space-y-4">
            <div className="flex items-end justify-between border-b-2 border-white/10 pb-4">
              <div>
                <p className="text-xs font-bold uppercase text-white/40">Confirmadas</p>
                <p className="font-display text-4xl font-bold text-green">6/8</p>
              </div>
              <p className="text-sm text-white/50">75% taxa</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="border-2 border-white/10 bg-bg-secondary p-4">
                <p className="text-xs font-bold uppercase text-white/40">Em risco</p>
                <p className="font-display text-2xl font-bold text-red">2</p>
              </div>
              <div className="border-2 border-white/10 bg-bg-secondary p-4">
                <p className="text-xs font-bold uppercase text-white/40">€ poupado</p>
                <p className="font-display text-2xl font-bold text-primary">€750</p>
              </div>
            </div>
            <div className="border-2 border-green/30 bg-green/10 p-4">
              <p className="text-sm font-bold text-green">
                Vaga das 16h preenchida pela fila de espera.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
