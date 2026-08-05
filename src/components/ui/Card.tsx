import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

export function Card({ children, className, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'border-2 border-white/10 bg-bg-secondary p-6 shadow-brutal',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  )
}
