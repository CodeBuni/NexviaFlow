import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Calendar } from 'lucide-react'
import { OnboardingShell } from './OnboardingShell'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'
import { useCalendar } from '@/hooks/useCalendar'

export function ConectarCalendario() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { clinica, updateClinica, advanceOnboarding } = useAuth()
  const { connect, configured } = useCalendar()
  const [loading, setLoading] = useState(false)

  const connected = clinica?.google_calendar_connected

  const handleConnect = async () => {
    if (!clinica) return
    setLoading(true)
    try {
      const result = connect(clinica.id)
      if (result.demo) {
        await updateClinica({
          google_calendar_connected: true,
          google_calendar_email: clinica.email,
          google_calendar_token: { demo: true },
        })
        toast(
          configured
            ? 'Calendário conectado.'
            : 'Modo demo: calendário simulado (configure Google OAuth depois).',
          'success',
        )
      }
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao conectar', 'error')
    } finally {
      setLoading(false)
    }
  }

  const handleNext = async () => {
    if (!connected) {
      toast('Conecte o Google Calendar para continuar.', 'error')
      return
    }
    setLoading(true)
    try {
      await advanceOnboarding('whatsapp')
      navigate('/flow/onboarding/whatsapp')
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <OnboardingShell
      stepIndex={0}
      title="Conectar calendário"
      description="Precisamos de acesso à sua agenda para enviar lembretes."
    >
      <Card className="space-y-6">
        <div className="flex items-start gap-4">
          <div className="border-2 border-primary/30 bg-primary/10 p-3 text-primary">
            <Calendar size={28} />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Google Calendar</h2>
            <p className="mt-1 text-sm text-white/60">
              Só lemos eventos. Não alteramos a sua agenda.
            </p>
          </div>
        </div>

        {connected ? (
          <div className="flex items-center justify-between border-2 border-green/30 bg-green/10 p-4">
            <div>
              <p className="font-bold text-green">Conectado</p>
              <p className="text-sm text-white/70">
                {clinica?.google_calendar_email || clinica?.email}
              </p>
            </div>
            <Badge tone="green">Ativo</Badge>
          </div>
        ) : (
          <Button onClick={handleConnect} loading={loading} className="w-full">
            Conectar Google Calendar
          </Button>
        )}

        <Button
          variant="secondary"
          className="w-full"
          onClick={handleNext}
          loading={loading}
          disabled={!connected}
        >
          Continuar
        </Button>
      </Card>
    </OnboardingShell>
  )
}
