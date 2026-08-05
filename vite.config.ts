import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { fileURLToPath } from 'node:url'

function localApiPlugin(): Plugin {
  return {
    name: 'nexvia-local-api',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (!req.url?.startsWith('/api/')) return next()

        if (req.method === 'POST' && req.url.startsWith('/api/make/create-scenario')) {
          const chunks: Buffer[] = []
          req.on('data', (c) => chunks.push(c))
          req.on('end', () => {
            let clinicaId = 'local'
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              clinicaId = body.clinicaId || 'local'
            } catch {
              /* ignore */
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                scenarioId: `demo_scenario_${String(clinicaId).slice(0, 8)}`,
                sheetId: `demo_sheet_${String(clinicaId).slice(0, 8)}`,
                demo: true,
              }),
            )
          })
          return
        }

        if (req.method === 'POST' && req.url.startsWith('/api/stripe/create-checkout')) {
          const chunks: Buffer[] = []
          req.on('data', (c) => chunks.push(c))
          req.on('end', () => {
            let plano = 'starter'
            try {
              const body = JSON.parse(Buffer.concat(chunks).toString('utf8'))
              plano = body.plano || 'starter'
            } catch {
              /* ignore */
            }
            res.setHeader('Content-Type', 'application/json')
            res.end(
              JSON.stringify({
                url: `/flow/dashboard/configuracoes?plano=${plano}&demo=1`,
                demo: true,
              }),
            )
          })
          return
        }

        next()
      })
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), localApiPlugin()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  server: {
    port: 5173,
  },
})
