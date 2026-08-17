import type { VercelRequest, VercelResponse } from '@vercel/node'

/**
 * Exchange Google OAuth authorization code for tokens.
 * Stores nothing itself — client persists via Supabase after success.
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { code, redirectUri } = req.body as {
    code?: string
    redirectUri?: string
  }

  if (!code || !redirectUri) {
    return res.status(400).json({ message: 'code e redirectUri são obrigatórios' })
  }

  const clientId = process.env.VITE_GOOGLE_CLIENT_ID || process.env.GOOGLE_CLIENT_ID
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET

  if (!clientId || !clientSecret || clientId.includes('xxxxx')) {
    return res.status(503).json({
      message: 'Google OAuth não configurado no servidor.',
      demo: true,
    })
  }

  try {
    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code',
      }),
    })

    if (!tokenRes.ok) {
      const detail = await tokenRes.text()
      console.error('Google token exchange failed', detail)
      return res.status(502).json({
        message: 'Falha ao trocar o código Google por tokens.',
        detail: detail.slice(0, 400),
      })
    }

    const tokens = (await tokenRes.json()) as {
      access_token: string
      refresh_token?: string
      expires_in: number
      scope: string
      token_type: string
    }

    let email: string | null = null
    try {
      const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: { Authorization: `Bearer ${tokens.access_token}` },
      })
      if (userRes.ok) {
        const profile = (await userRes.json()) as { email?: string }
        email = profile.email || null
      }
    } catch {
      /* optional */
    }

    return res.status(200).json({
      tokens,
      email,
      demo: false,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro Google OAuth',
    })
  }
}
