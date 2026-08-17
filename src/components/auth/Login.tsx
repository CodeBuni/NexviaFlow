import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Navbar } from '@/components/shared/Navbar'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { useAuth } from '@/hooks/useAuth'

export function Login() {
  const navigate = useNavigate()
  const { toast } = useToast()
  const { login, loginComGoogle, getPostLoginPath, refreshClinica } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await login(email, password)
      const clinica = await refreshClinica()
      toast('Bem-vindo de volta.', 'success')
      navigate(getPostLoginPath(clinica), { replace: true })
    } catch (err) {
      toast(err instanceof Error ? err.message : 'Erro ao entrar', 'error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <main className="mx-auto max-w-xl px-4 py-12 md:px-6">
        <Card>
          <h1 className="font-display text-3xl font-bold">Entrar</h1>
          <p className="mt-2 text-white/60">Aceda ao painel da sua clínica.</p>
          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            <Input
              label="Email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Palavra-passe"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button type="submit" className="w-full" loading={loading}>
              Entrar
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
            Ainda não tem conta?{' '}
            <Link to="/flow/registo" className="font-bold text-primary hover:underline">
              Criar conta
            </Link>
          </p>
        </Card>
      </main>
    </div>
  )
}
