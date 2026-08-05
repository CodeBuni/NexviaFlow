import type { ReactNode } from 'react'
import { X } from 'lucide-react'
import { Button } from './Button'

interface ModalProps {
  open: boolean
  title: string
  children: ReactNode
  onClose: () => void
}

export function Modal({ open, title, children, onClose }: ModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="w-full max-w-lg border-2 border-white/10 bg-bg-card p-6 shadow-brutal-lg">
        <div className="mb-4 flex items-start justify-between gap-4">
          <h3 className="font-display text-xl font-bold">{title}</h3>
          <Button variant="ghost" className="px-2 py-2" onClick={onClose} aria-label="Fechar">
            <X size={18} />
          </Button>
        </div>
        {children}
      </div>
    </div>
  )
}
