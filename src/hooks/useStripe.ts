import { createCheckoutSession, isStripeConfigured } from '@/lib/stripe'
import type { Plano } from '@/types'

export function useStripe() {
  const configured = isStripeConfigured()

  const checkout = async (plano: Plano, clinicaId: string) => {
    return createCheckoutSession(plano, clinicaId)
  }

  return { configured, checkout }
}
