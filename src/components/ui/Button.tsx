import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'green'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  children: ReactNode
  loading?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'border-2 border-primary bg-primary text-white hover:bg-primary-hover',
  secondary:
    'border-2 border-white/20 bg-transparent text-white hover:border-primary hover:text-primary',
  ghost: 'border-2 border-transparent bg-transparent text-white/80 hover:text-white hover:bg-white/5',
  danger: 'border-2 border-red bg-red text-white hover:opacity-90',
  green: 'border-2 border-green bg-green text-bg-primary hover:opacity-90',
}

export function Button({
  variant = 'primary',
  children,
  className,
  loading,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      className={cn(
        'inline-flex items-center justify-center gap-2 px-6 py-3 font-bold uppercase tracking-wide transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        variants[variant],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? 'A processar...' : children}
    </button>
  )
}
