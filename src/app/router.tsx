import { Navigate, Route, Routes } from 'react-router-dom'
import { LandingPage } from '@/components/landing/LandingPage'
import { Registo } from '@/components/auth/Registo'
import { Login } from '@/components/auth/Login'
import { ConectarCalendario } from '@/components/onboarding/ConectarCalendario'
import { ConectarWhatsApp } from '@/components/onboarding/ConectarWhatsApp'
import { TemplatesMensagem } from '@/components/onboarding/TemplatesMensagem'
import { ConfigurarRegras } from '@/components/onboarding/ConfigurarRegras'
import { ConfirmacaoAtivacao } from '@/components/onboarding/ConfirmacaoAtivacao'
import { DashboardLayout } from '@/components/dashboard/DashboardLayout'
import { MetricasHoje } from '@/components/dashboard/MetricasHoje'
import { ConsultasDia } from '@/components/dashboard/ConsultasDia'
import { RelatorioMensal } from '@/components/dashboard/RelatorioMensal'
import { Configuracoes } from '@/components/dashboard/Configuracoes'
import { ProtectedRoute } from './ProtectedRoute'

export function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/flow" replace />} />
      <Route path="/flow" element={<LandingPage />} />
      <Route path="/flow/registo" element={<Registo />} />
      <Route path="/flow/login" element={<Login />} />

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

      <Route path="*" element={<Navigate to="/flow" replace />} />
    </Routes>
  )
}
