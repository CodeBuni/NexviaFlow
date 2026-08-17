import { isGoogleConfigured, getGoogleAuthUrl, exchangeGoogleCode } from '@/lib/google'

export function useCalendar() {
  const configured = isGoogleConfigured()

  const connect = (clinicaId: string) => {
    const redirectUri = `${window.location.origin}/flow/onboarding/calendario`
    const url = getGoogleAuthUrl(redirectUri, clinicaId)
    if (url) {
      window.location.href = url
      return { demo: false as const, redirected: true as const }
    }
    return { demo: true as const, redirected: false as const }
  }

  const completeOAuth = async (code: string) => {
    const redirectUri = `${window.location.origin}/flow/onboarding/calendario`
    return exchangeGoogleCode(code, redirectUri)
  }

  return { configured, connect, completeOAuth }
}
