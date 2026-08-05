# Nexvia Flow

Plataforma SaaS self-service de retenção de pacientes e inteligência de receita para clínicas de saúde privada em Portugal.

**App:** [app.nexvia.pt](https://app.nexvia.pt) · **Site:** [nexvia.pt](https://nexvia.pt)

## Stack

- React 19 + TypeScript + Vite
- Tailwind CSS 4 (design system neo-brutalista)
- GSAP + ScrollTrigger
- Supabase Auth + PostgreSQL
- Make.com API (criação automática de cenários)
- Google Calendar OAuth
- Meta WhatsApp Cloud API
- Stripe
- Deploy Vercel

## Arranque local

```bash
npm install
cp .env.example .env
# Preencher VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY
npm run dev
```

Abrir [http://localhost:5173/flow](http://localhost:5173/flow).

## Rotas

| Rota | Descrição |
|------|-----------|
| `/flow` | Landing page |
| `/flow/registo` | Criar conta |
| `/flow/login` | Entrar |
| `/flow/onboarding/*` | Configuração (calendário → WhatsApp → mensagens → regras → ativar) |
| `/flow/dashboard` | Painel da clínica |

## API (Vercel)

- `POST /api/make/create-scenario` — cria/ativa cenário Make
- `POST /api/stripe/create-checkout` — sessão Stripe Checkout
- `POST /api/stripe/webhook` — webhooks Stripe

Sem credenciais Make/Stripe, a app corre em **modo demo** (ativação e planos simulados).

## Supabase

Projeto: `nexvia-flow` (eu-west-1). Migrações em `supabase/migrations/`.

Tabelas: `clinicas`, `configuracoes`, `metricas_diarias`, `consultas` (RLS ativo).

## Planos

- **Starter** — €197/mês
- **Pro** — €497/mês

## Contacto

- gkmarcosbonifacio@gmail.com
- +351 928 116 313
