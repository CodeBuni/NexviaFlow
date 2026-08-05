const SCOPES = [
  'https://www.googleapis.com/auth/calendar.readonly',
  'https://www.googleapis.com/auth/calendar.events.readonly',
].join(' ')

export function getGoogleAuthUrl(redirectUri: string, state?: string) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined
  if (!clientId) return null

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
  return Boolean(import.meta.env.VITE_GOOGLE_CLIENT_ID)
}
