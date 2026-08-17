import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { OnboardingShell } from './OnboardingShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { useWhatsApp } from '@/hooks/useWhatsApp'

export function ConectarWhatsApp() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clinica, updateClinica, advanceOnboarding } = useAuth()
  const { connect, configured } = useWhatsApp()
  const [loading, setLoading] = useState(false)

  const connected = clinica?.whatsapp_connected

  const handleConnect = async () => {
    setLoading(true)
    try {
      const result = await connect()
      if (!result.ok) {
        toast(result.reason, 'error')
        return
      }
      await updateClinica({
        whatsapp_connected: true,
        whatsapp_phone_id: result.phoneId,
        whatsapp_phone_number: result.phoneNumber,
        whatsapp_token: { demo: result.demo },
      })
      toast(
        result.demo
          ? 'Modo demo: WhatsApp simulado. Configure Meta Embedded Signup depois.'
          : 'WhatsApp conectado.',
        'success',
      )
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao conectar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!connected) {
      toast('Conecte o WhatsApp para continuar.', 'error')
      return
    }
    setLoading(true)
    try {
      await advanceOnboarding('mensagens')
      navigate('/flow/onboarding/mensagens')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingShell
      stepIndex={1}
      title="Conectar WhatsApp"
      description="Os seus pacientes receberão lembretes por WhatsApp."
    >
      <Card className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="border-2 border-primary/30 bg-primary/10 p-3 text-primary">
            <MessageCircle size={28} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">WhatsApp Business</h2>
            <p className="mt-1 text-sm text-white/60">
              {configured
                ? 'Embedded Signup ainda não está ativo — use demo ou aguarde MAR-23.'
                : 'Sem Meta App configurada: pode avançar em modo demo.'}
            </p>
          </div>
        </div>

        {!connected && !configured && (
          <div className="mx-auto flex h-48 w-48 items-center justify-center border-2 border-dashed border-white/20 bg-bg-primary">
            <div className="text-center">
              <div className="mx-auto mb-2 grid h-24 w-24 grid-cols-5 gap-1">
                {Array.from({ length: 25 }).map((_, i) => (
                  <div
                    key={i}
                    className={`h-full w-full ${i % 3 === 0 ? 'bg-white' : 'border border-white/20 bg-transparent'}`}
                  />
                ))}
              </div>
              <p className="text-xs text-white/40">QR demo</p>
            </div>
          </div>
        )}

        {connected ? (
          <div className="flex items-center justify-between border-2 border-green/30 bg-green/10 p-4">
            <div>
              <p className="font-bold text-green">Conectado</p>
              <p className="text-sm text-white/70">
                {clinica?.whatsapp_phone_number}
              </p>
            </div>
            <Badge tone="green">Ativo</Badge>
          </div>
        ) : (
          <Button
            onClick={handleConnect}
            loading={loading}
            className="w-full"
            disabled={configured}
          >
            {configured ? 'Embedded Signup em falta' : 'Conectar WhatsApp (demo)'}
          </Button>
        )}

        {configured && !connected && (
          <Button
            variant="secondary"
            className="w-full"
            loading={loading}
            onClick={async () => {
              setLoading(true)
              try {
                await updateClinica({
                  whatsapp_connected: true,
                  whatsapp_phone_id: 'demo_phone_id',
                  whatsapp_phone_number: '+351 900 000 000',
                  whatsapp_token: { demo: true },
                })
                toast('Avançou com WhatsApp demo temporário.', 'info')
              } finally {
                setLoading(false)
              }
            }}
          >
            Continuar em modo demo
          </Button>
        )}

        <div className="flex gap-3">
          <Button
            variant="ghost"
            className="flex-1"
            onClick={() => navigate('/flow/onboarding/calendario')}
          >
            Voltar
          </Button>
          <Button
            className="flex-1"
            onClick={handleNext}
            loading={loading}
            disabled={!connected}
          >
            Continuar
          </Button>
        </div>
      </Card>
    </OnboardingShell>
  )
}
