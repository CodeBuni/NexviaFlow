import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { useStripe } from '@/hooks/useStripe'
import { supabase } from '@/lib/supabase'
import { PLANOS, type Plano } from '@/types'

export function Configuracoes() {
  const { clinica, updateClinica } = useAuth()
  const { checkout } = useStripe()
  const { toast } = useToast()
  const [loading, setLoading] = useState(false)
  const [dias, setDias] = useState(2)
  const [tentativas, setTentativas] = useState(3)
  const [fila, setFila] = useState(true)
  const [score, setScore] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')

  useEffect(() => {
    if (!clinica) return
    setNome(clinica.nome_clinica)
    setTelefone(clinica.telefone || '')
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

  const save = async () => {
    if (!clinica) return
    setLoading(true)
    try {
      await updateClinica({
        nome_clinica: nome,
        telefone: telefone || null,
      })
      const { data, error } = await supabase
        .from('configuracoes')
        .upsert(
          {
            clinica_id: clinica.id,
            dias_antecedencia_lembrete: dias,
            max_tentativas_contacto: tentativas,
            fila_espera_ativa: fila,
            score_risco_ativo: clinica.plano === 'pro' ? score : false,
            atualizado_em: new Date().toISOString(),
          },
          { onConflict: 'clinica_id' },
        )
        .select('id')
        .single()
      if (error) throw error
      if (!data) throw new Error('Não foi possível guardar.')
      toast('Configurações guardadas.', 'success')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao guardar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const changePlan = async (plano: Plano) => {
    if (!clinica) return
    setLoading(true)
    try {
      const result = await checkout(plano, clinica.id, clinica.email)
      if (result.demo) {
        await updateClinica({ plano })
        toast(`Plano ${plano} atualizado (modo demo).`, 'success')
      } else if (result.url) {
        window.location.href = result.url
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro no Stripe', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Configurações</h2>
        <p className="mt-1 text-white/50">Edite a clínica, regras e plano.</p>
      </div>

      <Card className="space-y-4">
        <h3 className="font-display text-xl font-bold">Clínica</h3>
        <Input label="Nome da clínica" value={nome} onChange={(e) => setNome(e.target.value)} />
        <Input label="Telefone" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
        <div className="flex flex-wrap gap-2">
          <Badge tone={clinica?.google_calendar_connected ? 'green' : 'muted'}>
            Calendar {clinica?.google_calendar_connected ? 'OK' : 'off'}
          </Badge>
          <Badge tone={clinica?.whatsapp_connected ? 'green' : 'muted'}>
            WhatsApp {clinica?.whatsapp_connected ? 'OK' : 'off'}
          </Badge>
          <Badge tone={clinica?.ativo ? 'green' : 'muted'}>
            Flow {clinica?.ativo ? 'ativo' : 'inativo'}
          </Badge>
        </div>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-display text-xl font-bold">Regras</h3>
        <label className="block">
          <div className="mb-2 flex justify-between text-sm font-bold uppercase text-white/50">
            <span>Dias de antecedência</span>
            <span className="text-primary">{dias}</span>
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
          <div className="mb-2 flex justify-between text-sm font-bold uppercase text-white/50">
            <span>Máx. tentativas</span>
            <span className="text-primary">{tentativas}</span>
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
        <label className="flex items-center justify-between border-2 border-white/10 p-3">
          <span className="font-bold">Fila de espera</span>
          <input
            type="checkbox"
            checked={fila}
            onChange={(e) => setFila(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
        <label className="flex items-center justify-between border-2 border-white/10 p-3">
          <span className="font-bold">Score de risco (Pro)</span>
          <input
            type="checkbox"
            checked={score}
            disabled={clinica?.plano !== 'pro'}
            onChange={(e) => setScore(e.target.checked)}
            className="h-5 w-5 accent-primary"
          />
        </label>
        <Button onClick={save} loading={loading}>
          Guardar alterações
        </Button>
      </Card>

      <Card className="space-y-4">
        <h3 className="font-display text-xl font-bold">Plano</h3>
        <div className="grid gap-3 md:grid-cols-2">
          {PLANOS.map((plano) => (
            <div
              key={plano.id}
              className={`border-2 p-4 ${
                clinica?.plano === plano.id
                  ? 'border-primary bg-primary/5'
                  : 'border-white/10'
              }`}
            >
              <div className="flex items-center justify-between">
                <p className="font-display text-lg font-bold">{plano.nome}</p>
                {clinica?.plano === plano.id && <Badge tone="green">Atual</Badge>}
              </div>
              <p className="mt-1 text-sm text-white/50">€{plano.preco}/mês</p>
              {clinica?.plano !== plano.id && (
                <Button
                  className="mt-4 w-full"
                  variant="secondary"
                  loading={loading}
                  onClick={() => changePlan(plano.id)}
                >
                  Mudar para {plano.nome}
                </Button>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
