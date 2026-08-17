import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { todayISO } from '@/lib/utils'
import type { Consulta, MetricasDiarias } from '@/types'

const EMPTY_MES = {
  faltas_evitadas: 0,
  valor_estimado_poupado: 0,
  taxa_confirmacao: 0,
  pacientes_fila_espera: 0,
}

const DEMO_TODAY: Omit<MetricasDiarias, 'id' | 'clinica_id' | 'atualizado_em'> = {
  data: todayISO(),
  consultas_agendadas: 8,
  consultas_confirmadas: 6,
  consultas_canceladas: 1,
  consultas_em_risco: 2,
  faltas_evitadas: 3,
  vagas_preenchidas_fila: 1,
  valor_estimado_poupado: 750,
  pacientes_fila_espera: 5,
}

function demoConsultas(clinicaId: string, today: string): Consulta[] {
  return [
    {
      id: 'demo-1',
      clinica_id: clinicaId,
      paciente_nome: 'Ana Silva',
      paciente_telefone: '+351910000001',
      data_hora: `${today}T09:30:00`,
      status: 'confirmado',
      score_risco: 12,
      google_event_id: null,
      criado_em: new Date().toISOString(),
    },
    {
      id: 'demo-2',
      clinica_id: clinicaId,
      paciente_nome: 'João Costa',
      paciente_telefone: '+351910000002',
      data_hora: `${today}T11:00:00`,
      status: 'risco',
      score_risco: 78,
      google_event_id: null,
      criado_em: new Date().toISOString(),
    },
    {
      id: 'demo-3',
      clinica_id: clinicaId,
      paciente_nome: 'Maria Lopes',
      paciente_telefone: '+351910000003',
      data_hora: `${today}T14:15:00`,
      status: 'pendente',
      score_risco: 35,
      google_event_id: null,
      criado_em: new Date().toISOString(),
    },
    {
      id: 'demo-4',
      clinica_id: clinicaId,
      paciente_nome: 'Pedro Nunes',
      paciente_telefone: '+351910000004',
      data_hora: `${today}T16:00:00`,
      status: 'cancelado',
      score_risco: 0,
      google_event_id: null,
      criado_em: new Date().toISOString(),
    },
  ]
}

export function useDashboard(clinicaId?: string, opts?: { allowDemo?: boolean }) {
  const allowDemo = opts?.allowDemo ?? false
  const [hoje, setHoje] = useState<MetricasDiarias | null>(null)
  const [mes, setMes] = useState(EMPTY_MES)
  const [consultas, setConsultas] = useState<Consulta[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isDemo, setIsDemo] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)

  useEffect(() => {
    if (!clinicaId) {
      setLoading(false)
      return
    }

    let mounted = true

    async function load() {
      setLoading(true)
      setError(null)
      const today = todayISO()
      const monthStart = `${today.slice(0, 7)}-01`

      const [metricasRes, mesRes, consultasRes] = await Promise.all([
        supabase
          .from('metricas_diarias')
          .select('*')
          .eq('clinica_id', clinicaId)
          .eq('data', today)
          .maybeSingle(),
        supabase
          .from('metricas_diarias')
          .select('*')
          .eq('clinica_id', clinicaId)
          .gte('data', monthStart),
        supabase
          .from('consultas')
          .select('*')
          .eq('clinica_id', clinicaId)
          .gte('data_hora', `${today}T00:00:00`)
          .lte('data_hora', `${today}T23:59:59`)
          .order('data_hora', { ascending: true }),
      ])

      if (!mounted) return

      const fetchError =
        metricasRes.error?.message ||
        mesRes.error?.message ||
        consultasRes.error?.message ||
        null

      if (fetchError) {
        setError(fetchError)
      }

      const hasRealMetrics = Boolean(metricasRes.data)
      const hasRealConsultas = Boolean(consultasRes.data && consultasRes.data.length > 0)
      const useDemo = allowDemo && !hasRealMetrics && !hasRealConsultas && !fetchError

      if (hasRealMetrics) {
        setHoje(metricasRes.data as MetricasDiarias)
        setIsDemo(false)
      } else if (useDemo) {
        setHoje({
          id: 'demo',
          clinica_id: clinicaId!,
          atualizado_em: new Date().toISOString(),
          ...DEMO_TODAY,
        })
        setIsDemo(true)
      } else {
        setHoje({
          id: 'empty',
          clinica_id: clinicaId!,
          data: today,
          consultas_agendadas: 0,
          consultas_confirmadas: 0,
          consultas_canceladas: 0,
          consultas_em_risco: 0,
          faltas_evitadas: 0,
          vagas_preenchidas_fila: 0,
          valor_estimado_poupado: 0,
          pacientes_fila_espera: 0,
          atualizado_em: new Date().toISOString(),
        })
        setIsDemo(false)
      }

      const rows = (mesRes.data || []) as MetricasDiarias[]
      if (rows.length > 0) {
        const faltas = rows.reduce((acc, r) => acc + r.faltas_evitadas, 0)
        const poupado = rows.reduce((acc, r) => acc + Number(r.valor_estimado_poupado), 0)
        const agendadas = rows.reduce((acc, r) => acc + r.consultas_agendadas, 0)
        const confirmadas = rows.reduce((acc, r) => acc + r.consultas_confirmadas, 0)
        const fila = rows[rows.length - 1]?.pacientes_fila_espera ?? 0
        setMes({
          faltas_evitadas: faltas,
          valor_estimado_poupado: poupado,
          taxa_confirmacao: agendadas ? (confirmadas / agendadas) * 100 : 0,
          pacientes_fila_espera: fila,
        })
      } else if (useDemo) {
        setMes({
          faltas_evitadas: 34,
          valor_estimado_poupado: 8500,
          taxa_confirmacao: 87,
          pacientes_fila_espera: 5,
        })
      } else {
        setMes(EMPTY_MES)
      }

      if (hasRealConsultas) {
        setConsultas(consultasRes.data as Consulta[])
      } else if (useDemo) {
        setConsultas(demoConsultas(clinicaId!, today))
      } else {
        setConsultas([])
      }

      setLoading(false)
    }

    load()
    return () => {
      mounted = false
    }
  }, [clinicaId, allowDemo, refreshKey])

  return {
    hoje,
    mes,
    consultas,
    loading,
    error,
    isDemo,
    refresh: () => setRefreshKey((k) => k + 1),
  }
}
