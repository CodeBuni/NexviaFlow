import type { InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export function Input({ label, error, className, id, ...props }: InputProps) {
  const inputId = id || props.name

  return (
    <label className="flex w-full flex-col gap-2">
      {label && (
        <span className="text-sm font-bold uppercase tracking-wide text-white/60">
          {label}
        </span>
      )}
      <input
        id={inputId}
        className={cn(
          'w-full border-2 border-white/10 bg-transparent px-4 py-3 text-white placeholder:text-white/20 focus:border-primary/50 focus:outline-none',
          error && 'border-red',
          className,
        )}
        {...props}
      />
      {error && <span className="text-sm text-red">{error}</span>}
    </label>
  )
}
