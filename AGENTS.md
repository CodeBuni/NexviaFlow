# Nexvia Flow — Agent notes

## Product
SaaS self-service de retenção de pacientes para clínicas privadas (PT).
Repo: https://github.com/CodeBuni/NexviaFlow
Linear: projeto **Nexvia Flow** (issues MAR-17+)
Notion: hub Nexvia Flow

## Stack
React + Vite + Tailwind 4 + Supabase + Vercel API routes (Make / Stripe / Google)

## Local
```bash
npm install
cp .env.example .env   # preencher pelo menos VITE_SUPABASE_*
npm run dev
```

## Demo vs produção
- Sem `MAKE_API_TOKEN` / Stripe secrets → respostas `demo: true` (OK).
- Com secrets mas API falha → **erro 5xx**, não fingir sucesso.
- Dashboard mostra dados demo só se a clínica ainda tiver scenario `demo_*` ou não estiver ativa sem métricas reais.
- Banner "Demo" no painel quando aplicável.

## Onboarding
Não saltar passos. `onboarding_step` na tabela `clinicas` retoma o progresso.
OAuth Google Calendar: callback em `/flow/onboarding/calendario?code=` → `/api/google/exchange-token`.
Auth Google login: `/flow/auth/callback`.

## Don'ts
- Não commitar `.env` / service role keys
- Não inventar cores fora do design system neo-brutalista do produto
- Não expor Make/webhooks na copy para o cliente
