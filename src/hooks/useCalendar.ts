import { isGoogleConfigured, getGoogleAuthUrl } from '@/lib/google'

export function useCalendar() {
  const configured = isGoogleConfigured()

  const connect = (clinicaId: string) => {
    const redirectUri = `${window.location.origin}/flow/onboarding/calendario`
    const url = getGoogleAuthUrl(redirectUri, clinicaId)
    if (url) {
      window.location.href = url
      return { demo: false as const }
    }
    return { demo: true as const }
  }

  return { configured, connect }
}
