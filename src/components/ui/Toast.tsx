import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { cn } from '@/lib/utils'

type ToastTone = 'success' | 'error' | 'info'

interface ToastItem {
  id: number
  message: string
  tone: ToastTone
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void
}

const ToastContext = createContext<ToastContextValue | null>(null)

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([])

  const toast = useCallback((message: string, tone: ToastTone = 'info') => {
    const id = Date.now()
    setItems((prev) => [...prev, { id, message, tone }])
    window.setTimeout(() => {
      setItems((prev) => prev.filter((item) => item.id !== id))
    }, 3500)
  }, [])

  const value = useMemo(() => ({ toast }), [toast])

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="fixed right-4 bottom-4 z-[100] flex w-[min(90vw,360px)] flex-col gap-2">
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              'border-2 px-4 py-3 text-sm font-bold shadow-brutal',
              item.tone === 'success' && 'border-green/40 bg-bg-card text-green',
              item.tone === 'error' && 'border-red/40 bg-bg-card text-red',
              item.tone === 'info' && 'border-primary/40 bg-bg-card text-primary',
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
