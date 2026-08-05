import type { ReactNode } from 'react'
import { Card } from './Card'

interface MetricCardProps {
  label: string
  value: string | number
  hint?: string
  icon?: ReactNode
  tone?: 'default' | 'green' | 'red' | 'primary'
}

const valueTone = {
  default: 'text-white',
  green: 'text-green',
  red: 'text-red',
  primary: 'text-primary',
}

export function MetricCard({
  label,
  value,
  hint,
  icon,
  tone = 'default',
}: MetricCardProps) {
  return (
    <Card className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-white/50">
          {label}
        </span>
        {icon && <span className="text-white/40">{icon}</span>}
      </div>
      <p className={`font-display text-3xl font-bold ${valueTone[tone]}`}>
        {value}
      </p>
      {hint && <p className="text-sm text-white/40">{hint}</p>}
    </Card>
  )
}
