import {
  createContext,
  createElement,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase, isSupabaseConfigured } from '@/lib/supabase'
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

export class EmailConfirmationRequiredError extends Error {
  constructor() {
    super(
      'Conta criada. Confirme o email que enviámos antes de continuar o onboarding.',
    )
    this.name = 'EmailConfirmationRequiredError'
  }
}

interface AuthContextValue {
  session: Session | null
  user: User | null
  clinica: Clinica | null
  loading: boolean
  configured: boolean
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
  const configured = isSupabaseConfigured()
  const bootstrapped = useRef(false)

  const fetchClinica = useCallback(async (userId: string) => {
    const {
      data: { session: current },
    } = await supabase.auth.getSession()
    if (!current?.user || current.user.id !== userId) {
      setClinica(null)
      return null
    }

    const { data, error } = await supabase
      .from('clinicas')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      // Auth race during bootstrap — avoid noisy console when session not ready
      if (error.message?.includes('Auth session missing') || error.code === 'PGRST301') {
        return null
      }
      console.error(error)
      return null
    }

    setClinica(data as Clinica | null)
    return data as Clinica | null
  }, [])

  useEffect(() => {
    if (!configured) {
      setLoading(false)
      return
    }

    let mounted = true

    const { data: sub } = supabase.auth.onAuthStateChange(async (event, next) => {
      if (!mounted) return

      // Skip duplicate INITIAL_SESSION after getSession already ran
      if (event === 'INITIAL_SESSION' && bootstrapped.current) return

      setSession(next)
      setUser(next?.user ?? null)

      if (next?.user) {
        if (event !== 'TOKEN_REFRESHED') setLoading(true)
        await fetchClinica(next.user.id)
        if (mounted) setLoading(false)
      } else {
        setClinica(null)
        if (mounted) setLoading(false)
      }
      bootstrapped.current = true
    })

    return () => {
      mounted = false
      sub.subscription.unsubscribe()
    }
  }, [configured, fetchClinica])

  const registo = useCallback(
    async (input: RegistoInput) => {
      if (!configured) throw new Error('Supabase não configurado. Defina VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.')

      const { data, error } = await supabase.auth.signUp({
        email: input.email,
        password: input.password,
        options: {
          data: {
            nome_clinica: input.nomeClinica,
            nome_responsavel: input.nomeResponsavel,
            telefone: input.telefone || '',
            especialidade: input.especialidade || '',
            plano: input.plano || 'starter',
          },
        },
      })

      if (error) throw error
      if (!data.user) throw new Error('Conta criada, mas sem utilizador.')

      // Email confirmation required — trigger creates clinica; user must confirm first
      if (!data.session) {
        throw new EmailConfirmationRequiredError()
      }

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
    [configured, fetchClinica],
  )

  const login = useCallback(
    async (email: string, password: string) => {
      if (!configured) throw new Error('Supabase não configurado.')
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.user) await fetchClinica(data.user.id)
      return data
    },
    [configured, fetchClinica],
  )

  const loginComGoogle = useCallback(async () => {
    if (!configured) throw new Error('Supabase não configurado.')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/flow/auth/callback`,
      },
    })
    if (error) throw error
  }, [configured])

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
      if (!c) return '/flow/auth/callback'
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
      configured,
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
      configured,
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
