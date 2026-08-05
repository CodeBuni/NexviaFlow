import type { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import { Stepper } from '@/components/ui/Stepper'

const STEPS = ['Calendário', 'WhatsApp', 'Mensagens', 'Regras', 'Ativar']

interface OnboardingShellProps {
  stepIndex: number
  title: string
  description: string
  children: ReactNode
}

export function OnboardingShell({
  stepIndex,
  title,
  description,
  children,
}: OnboardingShellProps) {
  return (
    <div className="min-h-screen">
      <header className="border-b-2 border-white/10">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-4 py-4 md:px-6">
          <Link to="/flow" className="font-display text-xl font-bold">
            Nexvia <span className="text-primary">Flow</span>
          </Link>
          <span className="text-xs font-bold uppercase text-white/40">
            Configuração
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-4 py-10 md:px-6">
        <Stepper steps={STEPS} current={stepIndex} />
        <div className="mt-8">
          <h1 className="font-display text-3xl font-bold">{title}</h1>
          <p className="mt-2 text-white/60">{description}</p>
        </div>
        <div className="mt-8">{children}</div>
      </main>
    </div>
  )
}
