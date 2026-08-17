import type { ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { ONBOARDING_ROUTES, type OnboardingStep } from '@/types'
import { Skeleton } from '@/components/ui/Skeleton'

interface ProtectedRouteProps {
  children: ReactNode
  requireOnboardingComplete?: boolean
  allowOnboarding?: boolean
}

export function ProtectedRoute({
  children,
  requireOnboardingComplete = false,
  allowOnboarding = false,
}: ProtectedRouteProps) {
  const { user, clinica, loading, getPostLoginPath } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-40 w-full" />
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/flow/login" replace state={{ from: location }} />
  }

  if (!clinica) {
    return <Navigate to="/flow/auth/callback" replace />
  }

  const incomplete =
    !clinica.onboarding_completo && clinica.onboarding_step !== 'completo'

  if (requireOnboardingComplete && incomplete) {
    return <Navigate to={getPostLoginPath(clinica)} replace />
  }

  if (allowOnboarding && incomplete) {
    const expected =
      ONBOARDING_ROUTES[
        clinica.onboarding_step as Exclude<OnboardingStep, 'completo'>
      ]
    if (expected && location.pathname !== expected) {
      // Allow navigating forward only to current/previous steps via buttons;
      // if user bookmarks a later step, send them back to saved step.
      const order = [
        '/flow/onboarding/calendario',
        '/flow/onboarding/whatsapp',
        '/flow/onboarding/mensagens',
        '/flow/onboarding/regras',
        '/flow/onboarding/confirmar',
      ]
      const currentIdx = order.indexOf(expected)
      const locIdx = order.indexOf(location.pathname)
      if (locIdx > currentIdx) {
        return <Navigate to={expected} replace />
      }
    }
  }

  if (allowOnboarding && !incomplete && location.pathname.startsWith('/flow/onboarding')) {
    return <Navigate to="/flow/dashboard" replace />
  }

  return <>{children}</>
}
