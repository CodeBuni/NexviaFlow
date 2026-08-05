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

function demoResult(clinicaId: string) {
  return {
    scenarioId: `demo_scenario_${clinicaId.slice(0, 8)}`,
    sheetId: `demo_sheet_${clinicaId.slice(0, 8)}`,
    demo: true as const,
  }
}

export async function createMakeScenario(payload: CreateScenarioPayload) {
  try {
    const response = await fetch('/api/make/create-scenario', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (!response.ok) {
      return demoResult(payload.clinicaId)
    }

    return response.json() as Promise<{
      scenarioId: string
      sheetId: string
      demo?: boolean
    }>
  } catch {
    return demoResult(payload.clinicaId)
  }
}
