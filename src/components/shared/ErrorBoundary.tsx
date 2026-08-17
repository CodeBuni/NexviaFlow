import { Component, type ErrorInfo, type ReactNode } from 'react'
import { Button } from '@/components/ui/Button'

interface Props {
  children: ReactNode
}

interface State {
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('ErrorBoundary', error, info.componentStack)
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[50vh] max-w-lg flex-col items-center justify-center gap-4 px-4 py-16 text-center">
          <p className="font-display text-2xl font-bold">Algo correu mal</p>
          <p className="text-sm text-white/50">
            Recarregue a página. Se o problema continuar, contacte o suporte Nexvia.
          </p>
          <Button onClick={() => window.location.assign('/flow')}>
            Voltar ao início
          </Button>
        </div>
      )
    }
    return this.props.children
  }
}
