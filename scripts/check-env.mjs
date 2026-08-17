#!/usr/bin/env node
/**
 * check-env.mjs — mostra o que falta para sair do modo demo.
 * Uso: node scripts/check-env.mjs   (lê .env se existir)
 */
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const ROOT = resolve(import.meta.dirname, '..')
const envPath = resolve(ROOT, '.env')

function loadEnv(path) {
  const out = { ...process.env }
  if (!existsSync(path)) return out
  for (const line of readFileSync(path, 'utf8').split('\n')) {
    const t = line.trim()
    if (!t || t.startsWith('#')) continue
    const i = t.indexOf('=')
    if (i < 0) continue
    const k = t.slice(0, i).trim()
    let v = t.slice(i + 1).trim()
    if (
      (v.startsWith('"') && v.endsWith('"')) ||
      (v.startsWith("'") && v.endsWith("'"))
    ) {
      v = v.slice(1, -1)
    }
    if (!(k in out) || out[k] === '') out[k] = v
  }
  return out
}

const env = loadEnv(envPath)

const GROUPS = [
  {
    name: 'App base (obrigatório)',
    keys: ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY', 'VITE_APP_URL'],
  },
  {
    name: 'Server Supabase (APIs)',
    keys: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY'],
  },
  {
    name: 'Make.com',
    keys: [
      'MAKE_API_TOKEN',
      'MAKE_ORG_ID',
      'MAKE_TEAM_ID',
      'MAKE_FOLDER_ID',
      'METRICS_WEBHOOK_SECRET',
    ],
  },
  {
    name: 'Google Calendar',
    keys: ['VITE_GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET'],
  },
  {
    name: 'Meta WhatsApp',
    keys: ['VITE_META_APP_ID', 'META_APP_SECRET', 'META_CONFIG_ID'],
  },
  {
    name: 'Stripe',
    keys: [
      'VITE_STRIPE_PUBLISHABLE_KEY',
      'STRIPE_SECRET_KEY',
      'STRIPE_STARTER_PRICE_ID',
      'STRIPE_PRO_PRICE_ID',
      'STRIPE_WEBHOOK_SECRET',
    ],
  },
  {
    name: 'Resend',
    keys: ['RESEND_API_KEY'],
  },
]

function present(v) {
  if (!v) return false
  const s = String(v).trim()
  if (!s) return false
  if (/^x+$/i.test(s)) return false
  if (s.includes('xxxxx')) return false
  return true
}

let missingTotal = 0
console.log(`\nNexvia Flow — check env ${existsSync(envPath) ? '(.env)' : '(só process.env)'}\n`)

for (const g of GROUPS) {
  const rows = g.keys.map((k) => {
    const ok = present(env[k])
    if (!ok) missingTotal++
    return `  ${ok ? '✓' : '✗'} ${k}`
  })
  const allOk = g.keys.every((k) => present(env[k]))
  console.log(`${allOk ? '✓' : '○'} ${g.name}`)
  console.log(rows.join('\n'))
  console.log()
}

if (missingTotal === 0) {
  console.log('Tudo preenchido. Pronto para produção (depois de deploy Vercel).\n')
  process.exit(0)
}

console.log(`${missingTotal} variáveis em falta.`)
console.log('Cola o template NEXVIA SECRETS no chat do agent — ele configura o resto.\n')
console.log('Ver: ME_DIZ.md\n')
process.exit(1)
