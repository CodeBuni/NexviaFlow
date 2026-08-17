import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'
import type { Plano } from '@/types'

export function useStripe() {
  const configured = isStripeConfigured()

  const checkout = async (plano: Plano, clinicaId: string, email?: string) => {
    return createCheckoutSession(plano, clinicaId, email)
  }

  return { configured, checkout }
}
