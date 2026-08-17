import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createClient } from '@supabase/supabase-js'

/**
 * Ingest metrics / consultas from Make.com webhooks.
 * Auth: Authorization: Bearer {METRICS_WEBHOOK_SECRET}
 */
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const secret = process.env.METRICS_WEBHOOK_SECRET || process.env.WEBHOOK_SECRET
  const auth = req.headers.authorization
  if (secret && auth !== `Bearer ${secret}`) {
    return res.status(401).json({ message: 'Unauthorized' })
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceKey) {
    return res.status(503).json({
      message: 'SUPABASE_SERVICE_ROLE_KEY em falta no servidor.',
    })
  }

  const body = req.body as {
    clinicaId?: string
    data?: string
    metricas?: Record<string, number>
    consulta?: {
      paciente_nome: string
      paciente_telefone?: string
      data_hora: string
      status?: string
      score_risco?: number
      google_event_id?: string
    }
  }

  if (!body.clinicaId) {
    return res.status(400).json({ message: 'clinicaId obrigatório' })
  }

  const supabase = createClient(supabaseUrl, serviceKey)
  const today = body.data || new Date().toISOString().slice(0, 10)

  try {
    if (body.metricas) {
      const { error } = await supabase.from('metricas_diarias').upsert(
        {
          clinica_id: body.clinicaId,
          data: today,
          ...body.metricas,
          atualizado_em: new Date().toISOString(),
        },
        { onConflict: 'clinica_id,data' },
      )
      if (error) throw error
    }

    if (body.consulta) {
      const { error } = await supabase.from('consultas').insert({
        clinica_id: body.clinicaId,
        paciente_nome: body.consulta.paciente_nome,
        paciente_telefone: body.consulta.paciente_telefone || null,
        data_hora: body.consulta.data_hora,
        status: body.consulta.status || 'pendente',
        score_risco: body.consulta.score_risco ?? 0,
        google_event_id: body.consulta.google_event_id || null,
      })
      if (error) throw error
    }

    return res.status(200).json({ ok: true })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro ao gravar métricas',
    })
  }
}
