import { useState, type FormEvent } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { EmailConfirmationRequiredError, useAuth } from '@/hooks/useAuth'
import type { Plano } from '@/types'

export function Registo() {
  const [params] = useSearchParams()
  const planoParam = (params.get('plano') as Plano | null) || 'starter'
  const navigate = useNavigate()
  const { toast } = useToast()
  const { registo, loginComGoogle } = useAuth()

  const [form, setForm] = useState({
    nomeClinica: '',
    nomeResponsavel: '',
    email: '',
    password: '',
    telefone: '',
    especialidade: '',
    termos: false,
  })
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    if (!form.termos) {
      toast('Aceite os Termos e a Política de Privacidade.', 'error')
      return
    }
    setLoading(true)
    try {
      await registo({
        nomeClinica: form.nomeClinica,
        nomeResponsavel: form.nomeResponsavel,
        email: form.email,
        password: form.password,
        telefone: form.telefone,
        especialidade: form.especialidade,
        plano: planoParam,
      })
      toast('Conta criada. Vamos configurar a sua clínica.', 'success')
      navigate('/flow/onboarding/calendario')
    } catch (err) {
      if (err instanceof EmailConfirmationRequiredError) {
        toast(err.message, 'info')
        navigate('/flow/login')
      } else {
        toast(err instanceof Error ? err.message : 'Erro ao criar conta', 'error')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Card>
          <h1 className="font-display text-3xl font-bold">Criar conta</h1>
          <p className="mt-2 text-white/60">
            Configure o Nexvia Flow para a sua clínica em poucos minutos.
          </p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Nome da clínica"
              required
              value={form.nomeClinica}
              onChange={(e) => setForm({ ...form, nomeClinica: e.target.value })}
            />
            <Input
              label="Nome do responsável"
              required
              value={form.nomeResponsavel}
              onChange={(e) => setForm({ ...form, nomeResponsavel: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              label="Palavra-passe"
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <Input
              label="Telefone"
              value={form.telefone}
              onChange={(e) => setForm({ ...form, telefone: e.target.value })}
            />
            <Input
              label="Especialidade"
              placeholder="Dentária, estética, fisioterapia..."
              value={form.especialidade}
              onChange={(e) => setForm({ ...form, especialidade: e.target.value })}
            />
            <label className="flex items-start gap-3 text-sm text-white/70">
              <input
                type="checkbox"
                className="mt-1 h-4 w-4 accent-primary"
                checked={form.termos}
                onChange={(e) => setForm({ ...form, termos: e.target.checked })}
              />
              Aceito os Termos e a Política de Privacidade
            </label>
            <Button type="submit" className="w-full" loading={loading}>
              Criar conta
            </Button>
          </form>
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-white/10" />
            <span className="text-xs font-bold uppercase text-white/40">ou</span>
            <div className="h-px flex-1 bg-white/10" />
          </div>
          <Button
            variant="secondary"
            className="w-full"
            type="button"
            onClick={() => loginComGoogle().catch((err) => toast(err.message, 'error'))}
          >
            Continuar com Google
          </Button>
          <p className="mt-6 text-center text-sm text-white/50">
            Já tem conta?{' '}
            <Link to="/flow/login" className="font-bold text-primary hover:underline">
              Entrar
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
