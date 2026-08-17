export interface CreateScenarioPayload {
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

export interface CreateScenarioResult {
  scenarioId: string
  sheetId: string
  demo?: boolean
}

export async function createMakeScenario(
  payload: CreateScenarioPayload,
): Promise<CreateScenarioResult> {
  const response = await fetch('/api/make/create-scenario', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = (await response.json().catch(() => ({}))) as CreateScenarioResult & {
    message?: string
  }

  if (!response.ok) {
    throw new Error(data.message || 'Falha ao ativar automações. Tente novamente.')
  }

  return data
}
