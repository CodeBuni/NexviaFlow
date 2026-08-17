# Só me dizes. Eu faço o resto.

Não precisas de mexer no código, no Git, nem no Linear/Notion. Colas no chat e eu trato.

---

## 1) Uma vez (2 cliques)

No **Cursor Desktop → Settings → MCP**:

1. Autentica **Vercel** (para eu deployar e meter env vars)
2. Confirma que **Supabase**, **Linear** e **Notion** estão ligados

Quando estiver feito, escreve: `MCP Vercel ok`

---

## 2) Secrets (cola e envia)

Copia, preenche o que tiveres, e manda **no chat**:

```
NEXVIA SECRETS

SUPABASE_SERVICE_ROLE_KEY=

MAKE_API_TOKEN=
MAKE_ORG_ID=
MAKE_TEAM_ID=
MAKE_FOLDER_ID=
METRICS_WEBHOOK_SECRET=

VITE_GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=

VITE_META_APP_ID=
META_APP_SECRET=
META_CONFIG_ID=

VITE_STRIPE_PUBLISHABLE_KEY=
STRIPE_SECRET_KEY=
STRIPE_STARTER_PRICE_ID=
STRIPE_PRO_PRICE_ID=
STRIPE_WEBHOOK_SECRET=

RESEND_API_KEY=

VITE_APP_URL=https://app.nexvia.pt
```

Podes mandar **só um bloco** (ex.: “aqui Stripe”). Eu guardo, configuro e digo o que falta.

---

## 3) Frases mágicas

| Tu dizes | Eu faço |
|----------|---------|
| `MCP Vercel ok` | Ligo o projeto, env vars, deploy |
| `NEXVIA SECRETS` + keys | Configuro env local + Vercel + desbloqueio issues |
| `deploy produção` | Build + deploy + DNS checklist |
| `smoke produção` | Testo app.nexvia.pt de ponta a ponta |
| `só Stripe` / `só Google` / … | Configuro só esse pacote |

---

## O que **não** precisas de fazer

- Abrir PRs, commits, branches
- Atualizar Linear/Notion
- Correr migrações à mão
- Editar `.env` no editor (podes, mas não é preciso)

---

## Já está feito

- App mergeada em `main`
- Demo local: `demo@nexviaflow.test` / `TestFlow123!`
- Supabase projeto `nexvia-flow` ativo

Ver estado das keys: `npm run check:env`
