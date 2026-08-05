import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'
import type { Clinica, OnboardingStep, Plano } from '@/types'
import { ONBOARDING_ROUTES } from '@/types'

interface RegistoInput {
  nomeClinica: string
  nomeResponsavel: string
  email: string
  password: string
  telefone?: string
  especialidade?: string
  plano?: Plano
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  clinica: Clinica | null
  loading: boolean
  registo: (input: RegistoInput) => Promise<Clinica>
  login: (email: string, password: string) => Promise<unknown>
  loginComGoogle: () => Promise<void>
  logout: () => Promise<void>
  updateClinica: (patch: Partial<Clinica>) => Promise<Clinica>
  advanceOnboarding: (step: OnboardingStep) => Promise<Clinica>
  refreshClinica: () => Promise<Clinica | null>
  getPostLoginPath: (c?: Clinica | null) => string
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<User | null>(null)
  const [clinica, setClinica] = useState<Clinica | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchClinica = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('clinicas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      console.error(error)
      return null
    }

    setClinica(data as Clinica | null)
    return data as Clinica | null
  }, [])

  useEffect(() => {
    let mounted = true

    supabase.auth.getSession().then(({ data }) => {
      if (!mounted) return
      setSession(data.session)
      setUser(data.session?.user ?? null)
      if (data.session?.user) {
        fetchClinica(data.session.user.id).finally(() => {
          if (mounted) setLoading(false)
        })
      } else {
        setLoading(false)
      }
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, next) => {
      setSession(next)
      setUser(next?.user ?? null)
      if (next?.user) {
        setLoading(true)
        fetchClinica(next.user.id).finally(() => setLoading(false))
      } else {
        setClinica(null)
        setLoading(false)
      }
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [fetchClinica])

  const registo = useCallback(
    async (input: RegistoInput) => {
      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            nome_clinica: input.nomeClinica,
            nome_responsavel: input.nomeResponsavel,
          },
        },
      })

      if (error) throw error
      if (!data.user) throw new Error('Conta criada, mas sem utilizador.')

      const payload = {
        user_id: data.user.id,
        nome_clinica: input.nomeClinica,
        nome_responsavel: input.nomeResponsavel,
        email: input.email,
        telefone: input.telefone || null,
        especialidade: input.especialidade || null,
        plano: input.plano || 'starter',
        onboarding_step: 'calendario' as const,
      }

      const { data: clinicaData, error: clinicaError } = await supabase
        .from('clinicas')
        .upsert(payload, { onConflict: 'user_id' })
        .select('*')
        .single()

      if (clinicaError) {
        const existing = await fetchClinica(data.user.id)
        if (existing) {
          const { data: updated } = await supabase
            .from('clinicas')
            .update({
              nome_clinica: input.nomeClinica,
              nome_responsavel: input.nomeResponsavel,
              telefone: input.telefone || null,
              especialidade: input.especialidade || null,
              plano: input.plano || 'starter',
            })
            .eq('user_id', data.user.id)
            .select('*')
            .maybeSingle()
          const result = (updated as Clinica) || existing
          setClinica(result)
          return result
        }
        throw clinicaError
      }

      setClinica(clinicaData as Clinica)
      return clinicaData as Clinica
    },
    [fetchClinica],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.user) await fetchClinica(data.user.id)
      return data
    },
    [fetchClinica],
  )

  const loginComGoogle = useCallback(async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/flow/onboarding/calendario`,
      },
    })
    if (error) throw error
  }, [])

  const logout = useCallback(async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setClinica(null)
  }, [])

  const updateClinica = useCallback(
    async (patch: Partial<Clinica>) => {
      if (!clinica) throw new Error('Sem clínica')
      const { data, error } = await supabase
        .from('clinicas')
        .update(patch)
        .eq('id', clinica.id)
        .select('*')
        .single()
      if (error) throw error
      setClinica(data as Clinica)
      return data as Clinica
    },
    [clinica],
  )

  const advanceOnboarding = useCallback(
    async (step: OnboardingStep) => {
      return updateClinica({
        onboarding_step: step,
        onboarding_completo: step === 'completo',
      })
    },
    [updateClinica],
  )

  const getPostLoginPath = useCallback(
    (c: Clinica | null = clinica) => {
      if (!c) return '/flow/registo'
      if (!c.onboarding_completo && c.onboarding_step !== 'completo') {
        return ONBOARDING_ROUTES[
          c.onboarding_step as Exclude<OnboardingStep, 'completo'>
        ]
      }
      return '/flow/dashboard'
    },
    [clinica],
  )

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user,
      clinica,
      loading,
      registo,
      login,
      loginComGoogle,
      logout,
      updateClinica,
      advanceOnboarding,
      refreshClinica: () => (user ? fetchClinica(user.id) : Promise.resolve(null)),
      getPostLoginPath,
    }),
    [
      session,
      user,
      clinica,
      loading,
      registo,
      login,
      loginComGoogle,
      logout,
      updateClinica,
      advanceOnboarding,
      fetchClinica,
      getPostLoginPath,
    ],
  )

  return createElement(AuthContext.Provider, { value }, children)
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
