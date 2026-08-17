import { BrowserRouter } from 'react-router-dom'
import { ErrorBoundary } from '@/components/shared/ErrorBoundary'
import { ScrollToTop } from '@/components/shared/ScrollToTop'
import { Providers } from './providers'
import { AppRouter } from './router'

export default function App() {
  return (
    <ErrorBoundary>
      <Providers>
        <BrowserRouter>
          <ScrollToTop />
          <AppRouter />
        </BrowserRouter>
      </Providers>
    </ErrorBoundary>
  )
}
