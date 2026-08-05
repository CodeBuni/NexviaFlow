import { createMakeScenario, type CreateScenarioPayload } from '@/lib/make'

export function useMakeAPI() {
  const ativar = async (payload: CreateScenarioPayload) => {
    return createMakeScenario(payload)
  }

  return { ativar }
}
