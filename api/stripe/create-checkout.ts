import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const { plano, clinicaId } = req.body as {
    plano?: 'starter' | 'pro'
    clinicaId?: string
  }

  if (!plano || !clinicaId) {
    return res.status(400).json({ message: 'plano e clinicaId são obrigatórios' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const starterPrice = process.env.STRIPE_STARTER_PRICE_ID
  const proPrice = process.env.STRIPE_PRO_PRICE_ID
  const appUrl = process.env.VITE_APP_URL || 'http://localhost:5173'

  if (!secret || !starterPrice || !proPrice) {
    return res.status(200).json({
      url: `${appUrl}/flow/dashboard/configuracoes?plano=${plano}&demo=1`,
      demo: true,
    })
  }

  try {
    const stripe = new Stripe(secret)
    const priceId = plano === 'pro' ? proPrice : starterPrice

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${appUrl}/flow/dashboard/configuracoes?checkout=success`,
      cancel_url: `${appUrl}/flow/dashboard/configuracoes?checkout=cancel`,
      metadata: { clinicaId, plano },
      subscription_data: {
        metadata: { clinicaId, plano },
        trial_period_days: 7,
      },
    })

    return res.status(200).json({ url: session.url, demo: false })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro Stripe',
    })
  }
}
