import type { VercelRequest, VercelResponse } from '@vercel/node'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

export const config = {
  api: {
    bodyParser: false,
  },
}

async function buffer(req: VercelRequest) {
  const chunks: Buffer[] = []
  for await (const chunk of req) {
    chunks.push(typeof chunk === 'string' ? Buffer.from(chunk) : chunk)
  }
  return Buffer.concat(chunks)
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const secret = process.env.STRIPE_SECRET_KEY
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
  const supabaseUrl = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!secret || !webhookSecret || !supabaseUrl || !serviceKey) {
    return res.status(200).json({ received: true, demo: true })
  }

  const stripe = new Stripe(secret)
  const buf = await buffer(req)
  const sig = req.headers['stripe-signature']

  if (!sig || Array.isArray(sig)) {
    return res.status(400).json({ message: 'Assinatura em falta' })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(buf, sig, webhookSecret)
  } catch (err) {
    console.error(err)
    return res.status(400).json({ message: 'Webhook inválido' })
  }

  const supabase = createClient(supabaseUrl, serviceKey)

  try {
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session
      const clinicaId = session.metadata?.clinicaId
      const plano = session.metadata?.plano
      if (clinicaId) {
        await supabase
          .from('clinicas')
          .update({
            stripe_customer_id: session.customer as string,
            stripe_subscription_id: session.subscription as string,
            stripe_status: 'active',
            plano: plano || 'starter',
            grace_period_ends_at: null,
          })
          .eq('id', clinicaId)
      }
    }

    if (
      event.type === 'invoice.payment_failed' ||
      event.type === 'customer.subscription.updated'
    ) {
      const obj = event.data.object as Stripe.Subscription | Stripe.Invoice
      const subId =
        'subscription' in obj
          ? (obj.subscription as string)
          : (obj as Stripe.Subscription).id

      if (event.type === 'invoice.payment_failed' && subId) {
        const grace = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
        await supabase
          .from('clinicas')
          .update({
            stripe_status: 'past_due',
            grace_period_ends_at: grace,
          })
          .eq('stripe_subscription_id', subId)
      }
    }
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Erro ao processar webhook' })
  }

  return res.status(200).json({ received: true })
}
