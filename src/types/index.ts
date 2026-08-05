export type Plano = 'starter' | 'pro'

export type OnboardingStep =
  | 'calendario'
  | 'whatsapp'
  | 'mensagens'
  | 'regras'
  | 'confirmar'
  | 'completo'

export type ConsultaStatus =
  | 'confirmado'
  | 'pendente'
  | 'risco'
  | 'cancelado'
  | 'faltou'

export interface Clinica {
  id: string
  user_id: string
  nome_clinica: string
  nome_responsavel: string
  email: string
  telefone: string | null
  especialidade: string | null
  plano: Plano
  stripe_customer_id: string | null
  stripe_subscription_id: string | null
  stripe_status: string | null
  grace_period_ends_at: string | null
  google_calendar_token: Record<string, unknown> | null
  google_calendar_email: string | null
  google_calendar_connected: boolean
  whatsapp_token: Record<string, unknown> | null
  whatsapp_phone_id: string | null
  whatsapp_phone_number: string | null
  whatsapp_connected: boolean
  make_scenario_id: string | null
  google_sheet_id: string | null
  onboarding_step: OnboardingStep
  onboarding_completo: boolean
  ativo: boolean
  criado_em: string
}

export interface Configuracoes {
  id: string
  clinica_id: string
  dias_antecedencia_lembrete: number
  max_tentativas_contacto: number
  fila_espera_ativa: boolean
  score_risco_ativo: boolean
  template_lembrete_2dias: string
  template_lembrete_1dia: string
  template_alto_risco: string
  template_fila_espera: string
  criado_em: string
  atualizado_em: string
}

export interface MetricasDiarias {
  id: string
  clinica_id: string
  data: string
  consultas_agendadas: number
  consultas_confirmadas: number
  consultas_canceladas: number
  consultas_em_risco: number
  faltas_evitadas: number
  vagas_preenchidas_fila: number
  valor_estimado_poupado: number
  pacientes_fila_espera: number
  atualizado_em: string
}

export interface Consulta {
  id: string
  clinica_id: string
  paciente_nome: string
  paciente_telefone: string | null
  data_hora: string
  status: ConsultaStatus
  score_risco: number | null
  google_event_id: string | null
  criado_em: string
}

export interface PlanoInfo {
  id: Plano
  nome: string
  preco: number
  descricao: string
  features: string[]
  destaque?: boolean
}

export const PLANOS: PlanoInfo[] = [
  {
    id: 'starter',
    nome: 'Starter',
    preco: 197,
    descricao: 'Lembretes automáticos e painel básico para clínicas a começar.',
    features: [
      'Lembretes automáticos por WhatsApp',
      'Painel básico de confirmações',
      'Até 3 profissionais',
      'Templates de mensagem editáveis',
    ],
  },
  {
    id: 'pro',
    nome: 'Pro',
    preco: 497,
    descricao: 'Fila de espera inteligente, score de risco e relatórios avançados.',
    destaque: true,
    features: [
      'Tudo do Starter',
      'Fila de espera inteligente',
      'Score de risco de falta',
      'Relatórios avançados de receita',
      'Profissionais ilimitados',
    ],
  },
]

export const DEFAULT_TEMPLATES = {
  template_lembrete_2dias:
    'Olá {nome}, lembrete da sua consulta na {clínica} em {data} às {hora}. Pode confirmar respondendo SIM.',
  template_lembrete_1dia:
    'Olá {nome}, a sua consulta é amanhã às {hora}. Confirma?',
  template_alto_risco:
    'Olá {nome}, a sua consulta requer confirmação obrigatória. Clique aqui para confirmar: {link}',
  template_fila_espera:
    'Olá {nome}, surgiu uma vaga hoje às {hora} na {clínica}. Quer agendar? Responda SIM.',
} as const

export const ONBOARDING_ROUTES: Record<Exclude<OnboardingStep, 'completo'>, string> = {
  calendario: '/flow/onboarding/calendario',
  whatsapp: '/flow/onboarding/whatsapp',
  mensagens: '/flow/onboarding/mensagens',
  regras: '/flow/onboarding/regras',
  confirmar: '/flow/onboarding/confirmar',
}
