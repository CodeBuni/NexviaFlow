import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { OnboardingShell } from './OnboardingShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'
import { applyTemplate } from '@/lib/utils'
import { DEFAULT_TEMPLATES } from '@/types'

export function TemplatesMensagem() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clinica, advanceOnboarding } = useAuth()
  const [loading, setLoading] = useState(false)
  const [templates, setTemplates] = useState({ ...DEFAULT_TEMPLATES })
  const [active, setActive] = useState<keyof typeof DEFAULT_TEMPLATES>(
    'template_lembrete_2dias',
  )

  useEffect(() => {
    if (!clinica) return
    supabase
      .from('configuracoes')
      .select('*')
      .eq('clinica_id', clinica.id)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) return
        setTemplates({
          template_lembrete_2dias: data.template_lembrete_2dias,
          template_lembrete_1dia: data.template_lembrete_1dia,
          template_alto_risco: data.template_alto_risco,
          template_fila_espera: data.template_fila_espera,
        })
      })
  }, [clinica])

  const preview = applyTemplate(templates[active], {
    nome: 'Ana',
    clínica: clinica?.nome_clinica || 'Clínica Exemplo',
    data: '12/04',
    hora: '10:30',
    link: 'https://confirmar.nexvia.pt/abc',
  })

  const labels: Record<keyof typeof DEFAULT_TEMPLATES, string> = {
    template_lembrete_2dias: 'Lembrete 2 dias antes',
    template_lembrete_1dia: 'Lembrete 1 dia antes',
    template_alto_risco: 'Confirmação de alto risco',
    template_fila_espera: 'Fila de espera',
  }

  const handleSave = async () => {
    if (!clinica) return
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert(
          {
            clinica_id: clinica.id,
            ...templates,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: 'clinica_id' },
        )
        .select('id')
        .single()
      if (error) throw error
      if (!data) throw new Error('Não foi possível guardar os templates.')
      await advanceOnboarding('regras')
      navigate('/flow/onboarding/regras')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao guardar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingShell
      stepIndex={2}
      title="Templates de mensagem"
      description="Selecione o template padrão ou personalize o texto."
    >
      <div className="grid gap-4 md:grid-cols-2">
        <Card className="space-y-3">
          {(Object.keys(labels) as Array<keyof typeof DEFAULT_TEMPLATES>).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`w-full border-2 px-4 py-3 text-left text-sm font-bold ${
                active === key
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-white/10 text-white/70 hover:border-white/30'
              }`}
            >
              {labels[key]}
            </button>
          ))}
        </Card>

        <Card className="space-y-4">
          <label className="flex flex-col gap-2">
            <span className="text-sm font-bold uppercase text-white/50">Editar</span>
            <textarea
              className="min-h-36 w-full border-2 border-white/10 bg-transparent px-4 py-3 text-white focus:border-primary/50 focus:outline-none"
              value={templates[active]}
              onChange={(e) =>
                setTemplates({ ...templates, [active]: e.target.value })
              }
            />
          </label>
          <div className="border-2 border-white/10 bg-bg-primary p-4">
            <p className="mb-2 text-xs font-bold uppercase text-white/40">
              Pré-visualização
            </p>
            <p className="text-sm text-white/80">{preview}</p>
          </div>
        </Card>
      </div>

      <div className="mt-6 flex gap-3">
        <Button
          variant="ghost"
          className="flex-1"
          onClick={() => navigate('/flow/onboarding/whatsapp')}
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
