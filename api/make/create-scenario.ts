import type { VercelRequest, VercelResponse } from '@vercel/node'

interface Body {
  clinicaId: string
  nomeClinica: string
  templates: {
    lembrete2dias: string
    lembrete1dia: string
    altoRisco: string
    filaEspera: string
  }
  regras: {
    diasAntecedencia: number
    maxTentativas: number
    filaEsperaAtiva: boolean
    scoreRiscoAtivo: boolean
  }
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' })
  }

  const body = req.body as Body
  if (!body?.clinicaId || !body?.nomeClinica) {
    return res.status(400).json({ message: 'Payload inválido' })
  }

  const token = process.env.MAKE_API_TOKEN
  const folderId = process.env.MAKE_FOLDER_ID

  // Demo only when Make credentials are not configured
  if (!token || token.includes('xxxxx')) {
    return res.status(200).json({
      scenarioId: `demo_scenario_${body.clinicaId.slice(0, 8)}`,
      sheetId: `demo_sheet_${body.clinicaId.slice(0, 8)}`,
      demo: true,
    })
  }

  try {
    const createRes = await fetch('https://api.make.com/v2/scenarios', {
      method: 'POST',
      headers: {
        Authorization: `Token ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: `Nexvia Flow - ${body.nomeClinica}`,
        folderId: folderId || undefined,
        scheduling: { type: 'indefinitely' },
        blueprint: {
          name: `Nexvia Flow - ${body.nomeClinica}`,
          flow: [
            { id: 1, module: 'gateway:CustomWebHook', version: 1 },
            {
              id: 2,
              module: 'google-calendar:watchEvents',
              version: 1,
              mapper: {
                clinicaId: body.clinicaId,
                diasAntecedencia: body.regras.diasAntecedencia,
              },
            },
            {
              id: 3,
              module: 'whatsapp:sendMessage',
              version: 1,
              mapper: {
                template: body.templates.lembrete2dias,
              },
            },
          ],
          metadata: {
            nexvia: {
              clinicaId: body.clinicaId,
              regras: body.regras,
              templates: body.templates,
            },
          },
        },
      }),
    })

    if (!createRes.ok) {
      const errText = await createRes.text()
      console.error('Make create scenario failed', errText)
      return res.status(502).json({
        message:
          'A API do Make falhou ao criar o cenário. Verifique o token e o blueprint.',
        detail: errText.slice(0, 500),
      })
    }

    const created = (await createRes.json()) as {
      id?: string | number
      scenario?: { id?: string | number }
    }
    const scenarioId = String(created.id || created.scenario?.id || '')

    if (scenarioId) {
      await fetch(`https://api.make.com/v2/scenarios/${scenarioId}/start`, {
        method: 'POST',
        headers: {
          Authorization: `Token ${token}`,
          'Content-Type': 'application/json',
        },
      }).catch(() => null)
    }

    return res.status(200).json({
      scenarioId: scenarioId || `scenario_${Date.now()}`,
      sheetId: `sheet_${body.clinicaId.slice(0, 8)}`,
      demo: false,
    })
  } catch (error) {
    console.error(error)
    return res.status(500).json({
      message: error instanceof Error ? error.message : 'Erro interno Make',
    })
  }
}
