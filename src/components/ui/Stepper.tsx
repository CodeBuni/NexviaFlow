import { cn } from '@/lib/utils'

interface StepperProps {
  steps: string[]
  current: number
}

export function Stepper({ steps, current }: StepperProps) {
  return (
    <ol className="flex flex-wrap gap-2">
      {steps.map((step, index) => {
        const active = index === current
        const done = index < current
        return (
          <li
            key={step}
            className={cn(
              'border-2 px-3 py-2 text-xs font-bold uppercase tracking-wide',
              active && 'border-primary bg-primary/10 text-primary',
              done && 'border-green/40 bg-green/10 text-green',
              !active && !done && 'border-white/10 text-white/40',
            )}
          >
            {index + 1}. {step}
          </li>
        )
      })}
    </ol>
  )
}
