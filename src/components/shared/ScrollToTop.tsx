import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

const TITLES: Record<string, string> = {
  '/flow': 'Nexvia Flow — Retenção de pacientes',
  '/flow/registo': 'Criar conta — Nexvia Flow',
  '/flow/login': 'Entrar — Nexvia Flow',
  '/flow/onboarding/calendario': 'Calendário — Onboarding',
  '/flow/onboarding/whatsapp': 'WhatsApp — Onboarding',
  '/flow/onboarding/mensagens': 'Mensagens — Onboarding',
  '/flow/onboarding/regras': 'Regras — Onboarding',
  '/flow/onboarding/confirmar': 'Ativar — Onboarding',
  '/flow/dashboard': 'Painel — Nexvia Flow',
  '/flow/dashboard/consultas': 'Consultas — Nexvia Flow',
  '/flow/dashboard/relatorio': 'Relatório — Nexvia Flow',
  '/flow/dashboard/configuracoes': 'Configurações — Nexvia Flow',
}

export function ScrollToTop() {
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = TITLES[pathname] || 'Nexvia Flow'
  }, [pathname])

  return null
}
