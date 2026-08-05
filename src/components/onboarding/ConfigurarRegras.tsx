import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingShell } from './OnboardingShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export function ConfigurarRegras() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clinica, advanceOnboarding } = useAuth()
  const [loading, setLoading] = useState(false)
  const [dias, setDias] = useState(2)
  const [tentativas, setTentativas] = useState(3)
  const [fila, setFila] = useState(true)
  const [score, setScore] = useState(false)

  const isPro = clinica?.plano === 'pro'

  useEffect(() => {
    if (!clinica) return
    supabase
      .from('configuracoes')
      .select('*')
      .eq('clinica_id', clinica.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return
        setDias(data.dias_antecedencia_lembrete)
        setTentativas(data.max_tentativas_contacto)
        setFila(data.fila_espera_ativa)
        setScore(data.score_risco_ativo)
      })
  }, [clinica])

  const handleSave = async () => {
    if (!clinica) return
    setLoading(true)
    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({
          dias_antecedencia_lembrete: dias,
          max_tentativas_contacto: tentativas,
          fila_espera_ativa: fila,
          score_risco_ativo: isPro ? score : false,
          atualizado_em: new Date().toISOString(),
        })
        .eq('clinica_id', clinica.id)
      if (error) throw error
      await advanceOnboarding('confirmar')
      navigate('/flow/onboarding/confirmar')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao guardar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingShell
      stepIndex={3}
      title="Configurar regras"
      description="Defina quando e como a sua clínica contacta os pacientes."
    >
      <Card className="space-y-8">
        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold uppercase text-white/50">
              Dias de antecedência
            </span>
            <span className="font-display text-2xl font-bold text-primary">{dias}</span>
          </div>
          <input
            type="range"
            min={1}
            max={7}
            value={dias}
            onChange={(e) => setDias(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>

        <label className="block">
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-bold uppercase text-white/50">
              Máximo de tentativas
            </span>
            <span className="font-display text-2xl font-bold text-primary">
              {tentativas}
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={10}
            value={tentativas}
            onChange={(e) => setTentativas(Number(e.target.value))}
            className="w-full accent-primary"
          />
        </label>

        <label className="flex items-center justify-between border-2 border-white/10 p-4">
          <div>
            <p className="font-bold">Fila de espera</p>
            <p className="text-sm text-white/50">
              Preenche vagas canceladas automaticamente.
            </p>
          </div>
          <input
            type="checkbox"
            checked={fila}
            onChange={(e) => setFila(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>

        <label
          className={`flex items-center justify-between border-2 p-4 ${
            isPro ? 'border-white/10' : 'border-white/5 opacity-60'
          }`}
        >
          <div>
            <p className="font-bold">Score de risco</p>
            <p className="text-sm text-white/50">
              {isPro
                ? 'Prioriza confirmações de pacientes com maior probabilidade de falta.'
                : 'Disponível apenas no plano Pro.'}
            </p>
          </div>
          <input
            type="checkbox"
            checked={score}
            disabled={!isPro}
            onChange={(e) => setScore(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
      </Card>

      <div className="mt-6 flex gap-3">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => navigate('/flow/onboarding/mensagens')}
        >
          Voltar
        </Button>
        <Button className="flex-1" onClick={handleSave} loading={loading}>
          Continuar
        </Button>
      </div>
    </OnboardingShell>
  )
}
