import type { ReactNode } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'

/** Redirect authenticated users away from login/registo */
export function GuestRoute({ children }: { children: ReactNode }) {
  const { user, clinica, loading, getPostLoginPath } = useAuth()

  if (loading) {
    return (
      <div className="mx-auto max-w-xl space-y-4 px-4 py-16">
        <Skeleton className="h-10 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    )
  }

  if (user) {
    return <Navigate to={getPostLoginPath(clinica)} replace />
  }

  return <>{children}</>
}
