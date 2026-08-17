import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Skeleton } from '@/components/ui/Skeleton'
import { NotFound } from '@/components/shared/NotFound'
import { ProtectedRoute } from './ProtectedRoute'
import { GuestRoute } from './GuestRoute'

const LandingPage = lazy(() =>
  import('@/components/landing/LandingPage').then((m) => ({ default: m.LandingPage })),
)
const Registo = lazy(() =>
  import('@/components/auth/Registo').then((m) => ({ default: m.Registo })),
)
const Login = lazy(() =>
  import('@/components/auth/Login').then((m) => ({ default: m.Login })),
)
const AuthCallback = lazy(() =>
  import('@/components/auth/AuthCallback').then((m) => ({ default: m.AuthCallback })),
)
const ConectarCalendario = lazy(() =>
  import('@/components/onboarding/ConectarCalendario').then((m) => ({
    default: m.ConectarCalendario,
  })),
)
const ConectarWhatsApp = lazy(() =>
  import('@/components/onboarding/ConectarWhatsApp').then((m) => ({
    default: m.ConectarWhatsApp,
  })),
)
const TemplatesMensagem = lazy(() =>
  import('@/components/onboarding/TemplatesMensagem').then((m) => ({
    default: m.TemplatesMensagem,
  })),
)
const ConfigurarRegras = lazy(() =>
  import('@/components/onboarding/ConfigurarRegras').then((m) => ({
    default: m.ConfigurarRegras,
  })),
)
const ConfirmacaoAtivacao = lazy(() =>
  import('@/components/onboarding/ConfirmacaoAtivacao').then((m) => ({
    default: m.ConfirmacaoAtivacao,
  })),
)
const DashboardLayout = lazy(() =>
  import('@/components/dashboard/DashboardLayout').then((m) => ({
    default: m.DashboardLayout,
  })),
)
const MetricasHoje = lazy(() =>
  import('@/components/dashboard/MetricasHoje').then((m) => ({ default: m.MetricasHoje })),
)
const ConsultasDia = lazy(() =>
  import('@/components/dashboard/ConsultasDia').then((m) => ({ default: m.ConsultasDia })),
)
const RelatorioMensal = lazy(() =>
  import('@/components/dashboard/RelatorioMensal').then((m) => ({
    default: m.RelatorioMensal,
  })),
)
const Configuracoes = lazy(() =>
  import('@/components/dashboard/Configuracoes').then((m) => ({
    default: m.Configuracoes,
  })),
)

function PageFallback() {
  return (
    <div className="mx-auto max-w-3xl space-y-4 px-4 py-16">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-40 w-full" />
    </div>
  )
}

export function AppRouter() {
  return (
    <Suspense fallback={<PageFallback />}>
      <Routes>
        <Route path="/" element={<Navigate to="/flow" replace />} />
        <Route path="/flow" element={<LandingPage />} />
        <Route
          path="/flow/registo"
          element={
            <GuestRoute>
              <Registo />
            </GuestRoute>
          }
        />
        <Route
          path="/flow/login"
          element={
            <GuestRoute>
              <Login />
            </GuestRoute>
          }
        />
        <Route path="/flow/auth/callback" element={<AuthCallback />} />

        <Route
          path="/flow/onboarding/calendario"
          element={
            <ProtectedRoute allowOnboarding>
              <ConectarCalendario />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flow/onboarding/whatsapp"
          element={
            <ProtectedRoute allowOnboarding>
              <ConectarWhatsApp />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flow/onboarding/mensagens"
          element={
            <ProtectedRoute allowOnboarding>
              <TemplatesMensagem />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flow/onboarding/regras"
          element={
            <ProtectedRoute allowOnboarding>
              <ConfigurarRegras />
            </ProtectedRoute>
          }
        />
        <Route
          path="/flow/onboarding/confirmar"
          element={
            <ProtectedRoute allowOnboarding>
              <ConfirmacaoAtivacao />
            </ProtectedRoute>
          }
        />

        <Route
          path="/flow/dashboard"
          element={
            <ProtectedRoute requireOnboardingComplete>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<MetricasHoje />} />
          <Route path="consultas" element={<ConsultasDia />} />
          <Route path="relatorio" element={<RelatorioMensal />} />
          <Route path="configuracoes" element={<Configuracoes />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  )
}
