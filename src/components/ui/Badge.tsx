import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: ReactNode
  tone?: 'primary' | 'green' | 'red' | 'muted'
  className?: string
}

const tones = {
  primary: 'border-primary/30 bg-primary/10 text-primary',
  green: 'border-green/30 bg-green/10 text-green',
  red: 'border-red/30 bg-red/10 text-red',
  muted: 'border-white/20 bg-white/5 text-white/60',
}

export function Badge({ children, tone = 'primary', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex border-2 px-3 py-1 text-xs font-bold uppercase tracking-wide',
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  )
}
