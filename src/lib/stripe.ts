import type { Plano } from '@/types'

export async function createCheckoutSession(plano: Plano, clinicaId: string) {
  try {
    const response = await fetch('/api/stripe/create-checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ plano, clinicaId }),
    })

    if (!response.ok) {
      return { url: '', demo: true as const }
    }

    return response.json() as Promise<{ url: string; demo?: boolean }>
  } catch {
    return { url: '', demo: true as const }
  }
}

export function isStripeConfigured() {
  return Boolean(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
}
