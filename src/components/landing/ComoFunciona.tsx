import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { CalendarCheck, MessageCircle, Zap } from 'lucide-react'

gsap.registerPlugin(ScrollTrigger)

const steps = [
  {
    icon: CalendarCheck,
    title: 'Ligue a agenda',
    text: 'Conecte o Google Calendar da clínica. O Flow lê as consultas automaticamente.',
  },
  {
    icon: MessageCircle,
    title: 'Ative o WhatsApp',
    text: 'Os seus pacientes recebem lembretes e confirmam com uma resposta simples.',
  },
  {
    icon: Zap,
    title: 'Clique em Ativar',
    text: 'As automações ficam prontas sozinhas. A sua clínica deixa de perder cadeiras vazias.',
  },
]

export function ComoFunciona() {
  const ref = useRef<HTMLElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from('[data-step]', {
        scrollTrigger: {
          trigger: ref.current,
          start: 'top 75%',
        },
        y: 36,
        opacity: 0,
        duration: 0.7,
        stagger: 0.15,
        ease: 'power2.out',
      })
    }, ref)
    return () => ctx.revert()
  }, [])

  return (
    <section id="como-funciona" ref={ref} className="border-b-2 border-white/10 py-20">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <h2 className="font-display text-3xl font-bold md:text-4xl">Como funciona</h2>
        <p className="mt-3 max-w-2xl text-white/60">
          Três passos. Sem jargão técnico. A sua clínica configura tudo sozinha.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          {steps.map((step, index) => (
            <article
              key={step.title}
              data-step
              className="border-2 border-white/10 bg-bg-secondary p-6 shadow-brutal"
            >
              <div className="mb-4 flex items-center justify-between">
                <step.icon className="text-primary" size={28} />
                <span className="font-display text-3xl font-bold text-white/10">
                  0{index + 1}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold">{step.title}</h3>
              <p className="mt-2 text-white/60">{step.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
