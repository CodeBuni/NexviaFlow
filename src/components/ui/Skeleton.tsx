import { cn } from '@/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'animate-pulse border-2 border-white/5 bg-white/5',
        className,
      )}
    />
  )
}
