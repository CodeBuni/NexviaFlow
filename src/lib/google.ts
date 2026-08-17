const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
  'https://www.googleapis.com/auth/userinfo.email',
].join(' ')

export function getGoogleAuthUrl(redirectUri: string, state?: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  if (!clientId || clientId.includes('xxxxx')) return null

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: SCOPES,
    access_type: 'offline',
    prompt: 'consent',
    ...(state ? { state } : {}),
  })

  return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
}

export function isGoogleConfigured() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  return Boolean(clientId && !clientId.includes('xxxxx'))
}

export async function exchangeGoogleCode(code: string, redirectUri: string) {
  const response = await fetch('/api/google/exchange-token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code, redirectUri }),
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw new Error(
      (data as { message?: string }).message || 'Falha no OAuth Google',
    )
  }
  return data as {
    tokens: Record<string, unknown>
    email: string | null
    demo?: boolean
  }
}
