import {
  createContext,
  useContext,
  type ReactNode,
} from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useDashboard } from '@/hooks/useDashboard'

type DashboardValue = ReturnType<typeof useDashboard>

const DashboardContext = createContext<DashboardValue | null>(null)

export function DashboardProvider({ children }: { children: ReactNode }) {
  const { clinica } = useAuth()
  // Show sample data only before first real activation metrics exist AND clinic is not "production-looking"
  // After activation, prefer empty states until Make fills metricas_diarias.
  const value = useDashboard(clinica?.id, {
    allowDemo: !clinica?.ativo || Boolean(clinica?.make_scenario_id?.startsWith('demo_')),
  })

  return (
    <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>
  )
}

export function useDashboardContext() {
  const ctx = useContext(DashboardContext)
  if (!ctx) {
    throw new Error('useDashboardContext must be used within DashboardProvider')
  }
  return ctx
}
