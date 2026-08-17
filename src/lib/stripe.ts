import type { Plano } from '@/types'

export async function createCheckoutSession(plano: Plano, clinicaId: string, email?: string) {
  const response = await fetch('/api/stripe/create-checkout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ plano, clinicaId, email }),
  })

  const data = (await response.json().catch(() => ({}))) as {
    url?: string
    demo?: boolean
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao iniciar pagamento')
  }

  return data as { url: string; demo?: boolean }
}

export function isStripeConfigured() {
  return Boolean(
    import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY &&
      !String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY).includes('xxxxx'),
  )
}
