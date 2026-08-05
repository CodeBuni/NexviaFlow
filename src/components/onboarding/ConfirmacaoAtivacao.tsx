import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { OnboardingShell } from './OnboardingShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { useMakeAPI } from '@/hooks/useMakeAPI'
import { supabase } from '@/lib/supabase'
import type { Configuracoes } from '@/types'

export function ConfirmacaoAtivacao() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clinica, updateClinica, advanceOnboarding } = useAuth()
  const { ativar } = useMakeAPI()
  const [config, setConfig] = useState<Configuracoes | null>(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!clinica) return
    supabase
      .from('configuracoes')
      .select('*')
      .eq('clinica_id', clinica.id)
      .maybeSingle()
      .then(({ data }) => setConfig(data as Configuracoes | null))
  }, [clinica])

  const handleAtivar = async () => {
    if (!clinica || !config) return
    if (clinica.make_scenario_id) {
      toast('O Nexvia Flow já está ativo nesta clínica.', 'info')
      navigate('/flow/dashboard')
      return
    }

    setLoading(true)
    try {
      const result = await ativar({
        clinicaId: clinica.id,
        nomeClinica: clinica.nome_clinica,
        templates: {
          lembrete2dias: config.template_lembrete_2dias,
          lembrete1dia: config.template_lembrete_1dia,
          altoRisco: config.template_alto_risco,
          filaEspera: config.template_fila_espera,
        },
        regras: {
          diasAntecedencia: config.dias_antecedencia_lembrete,
          maxTentativas: config.max_tentativas_contacto,
          filaEsperaAtiva: config.fila_espera_ativa,
          scoreRiscoAtivo: config.score_risco_ativo,
        },
      })

      await updateClinica({
        make_scenario_id: result.scenarioId,
        google_sheet_id: result.sheetId,
        ativo: true,
        onboarding_completo: true,
        onboarding_step: 'completo',
        grace_period_ends_at: new Date(
          Date.now() + 7 * 24 * 60 * 60 * 1000,
        ).toISOString(),
      })
      await advanceOnboarding('completo')

      toast(
        result.demo
          ? 'Ativado em modo demo. Configure a API do Make para produção.'
          : 'Nexvia Flow ativado com sucesso.',
        'success',
      )
      navigate('/flow/dashboard')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro na ativação', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingShell
      stepIndex={4}
      title="Confirmar e ativar"
      description="Revise a configuração e ative o Nexvia Flow na sua clínica."
    >
      <Card className="space-y-4">
        <div className="flex items-center gap-3">
          <CheckCircle2 className="text-green" />
          <h2 className="font-display text-xl font-bold">
            Resumo — {clinica?.nome_clinica}
          </h2>
        </div>

        <ul className="space-y-3 text-sm">
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">Calendário</span>
            <Badge tone={clinica?.google_calendar_connected ? 'green' : 'red'}>
              {clinica?.google_calendar_connected ? 'Conectado' : 'Pendente'}
            </Badge>
          </li>
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">WhatsApp</span>
            <span className="font-bold">
              {clinica?.whatsapp_phone_number || '—'}
            </span>
          </li>
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">Antecedência</span>
            <span className="font-bold">
              {config?.dias_antecedencia_lembrete ?? '—'} dias
            </span>
          </li>
          <li className="flex justify-between border-b-2 border-white/5 py-2">
            <span className="text-white/50">Fila de espera</span>
            <span className="font-bold">
              {config?.fila_espera_ativa ? 'Ativa' : 'Desligada'}
            </span>
          </li>
          <li className="flex justify-between py-2">
            <span className="text-white/50">Plano</span>
            <Badge>{clinica?.plano || 'starter'}</Badge>
          </li>
        </ul>

        <Button className="w-full" onClick={handleAtivar} loading={loading}>
          Ativar Nexvia Flow
        </Button>
        <Button
          variant="ghost"
          className="w-full"
          onClick={() => navigate('/flow/onboarding/regras')}
        >
          Voltar
        </Button>
      </Card>
    </OnboardingShell>
  )
}
