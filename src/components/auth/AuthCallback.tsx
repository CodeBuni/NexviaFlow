import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '@/hooks/useAuth'
import { Skeleton } from '@/components/ui/Skeleton'
import { supabase } from '@/lib/supabase'

/**
 * Post-OAuth / post-login router: waits for auth+clinica then sends user
 * to the correct onboarding step or dashboard.
 */
export function AuthCallback() {
  const { user, clinica, loading, getPostLoginPath, refreshClinica } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    if (loading || !user) return

    let cancelled = false

    ;(async () => {
      let c = clinica
      if (!c) {
        // Trigger may still be writing; retry briefly
        for (let i = 0; i < 5 && !c; i++) {
          await new Promise((r) => setTimeout(r, 400))
          c = await refreshClinica()
        }
      }

      // OAuth user without clinica — create from metadata
      if (!c && user) {
        const meta = user.user_metadata || {}
        const { data } = await supabase
          .from('clinicas')
          .upsert(
            {
              user_id: user.id,
              nome_clinica: meta.nome_clinica || meta.full_name || 'A minha clínica',
              nome_responsavel:
                meta.nome_responsavel || meta.full_name || 'Responsável',
              email: user.email || '',
              plano: meta.plano || 'starter',
              onboarding_step: 'calendario',
            },
            { onConflict: 'user_id' },
          )
          .select('*')
          .single()
        c = (data as typeof clinica) || (await refreshClinica())
      }

      if (cancelled) return
      navigate(getPostLoginPath(c), { replace: true })
    })()

    return () => {
      cancelled = true
    }
  }, [loading, user, clinica, getPostLoginPath, navigate, refreshClinica])

  if (!loading && !user) {
    return <Navigate to="/flow/login" replace />
  }

  return (
    <div className="mx-auto max-w-md space-y-4 px-4 py-24 text-center">
      <Skeleton className="mx-auto h-10 w-48" />
      <p className="text-sm text-white/50">A preparar a sua clínica…</p>
    </div>
  )
}
