-- Nexvia Flow core schema
create extension if not exists "pgcrypto";

create table public.clinicas (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references auth.users(id) on delete cascade,
  nome_clinica text not null,
  nome_responsavel text not null,
  email text not null unique,
  telefone text,
  especialidade text,
  plano text not null default 'starter' check (plano in ('starter', 'pro')),
  stripe_customer_id text,
  stripe_subscription_id text,
  stripe_status text default 'trialing',
  grace_period_ends_at timestamptz,
  google_calendar_token jsonb,
  google_calendar_email text,
  google_calendar_connected boolean not null default false,
  whatsapp_token jsonb,
  whatsapp_phone_id text,
  whatsapp_phone_number text,
  whatsapp_connected boolean not null default false,
  make_scenario_id text,
  google_sheet_id text,
  onboarding_step text not null default 'calendario'
    check (onboarding_step in ('calendario', 'whatsapp', 'mensagens', 'regras', 'confirmar', 'completo')),
  onboarding_completo boolean not null default false,
  ativo boolean not null default false,
  criado_em timestamptz not null default now()
);

create table public.configuracoes (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null unique references public.clinicas(id) on delete cascade,
  dias_antecedencia_lembrete int not null default 2 check (dias_antecedencia_lembrete between 1 and 7),
  max_tentativas_contacto int not null default 3 check (max_tentativas_contacto between 1 and 10),
  fila_espera_ativa boolean not null default true,
  score_risco_ativo boolean not null default false,
  template_lembrete_2dias text not null default 'Olá {nome}, lembrete da sua consulta na {clínica} em {data} às {hora}. Pode confirmar respondendo SIM.',
  template_lembrete_1dia text not null default 'Olá {nome}, a sua consulta é amanhã às {hora}. Confirma?',
  template_alto_risco text not null default 'Olá {nome}, a sua consulta requer confirmação obrigatória. Clique aqui para confirmar: {link}',
  template_fila_espera text not null default 'Olá {nome}, surgiu uma vaga hoje às {hora} na {clínica}. Quer agendar? Responda SIM.',
  criado_em timestamptz not null default now(),
  atualizado_em timestamptz not null default now()
);

create table public.metricas_diarias (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  data date not null,
  consultas_agendadas int not null default 0,
  consultas_confirmadas int not null default 0,
  consultas_canceladas int not null default 0,
  consultas_em_risco int not null default 0,
  faltas_evitadas int not null default 0,
  vagas_preenchidas_fila int not null default 0,
  valor_estimado_poupado numeric(12,2) not null default 0,
  pacientes_fila_espera int not null default 0,
  atualizado_em timestamptz not null default now(),
  unique (clinica_id, data)
);

create table public.consultas (
  id uuid primary key default gen_random_uuid(),
  clinica_id uuid not null references public.clinicas(id) on delete cascade,
  paciente_nome text not null,
  paciente_telefone text,
  data_hora timestamptz not null,
  status text not null default 'pendente'
    check (status in ('confirmado', 'pendente', 'risco', 'cancelado', 'faltou')),
  score_risco int default 0,
  google_event_id text,
  criado_em timestamptz not null default now()
);

create index clinicas_user_id_idx on public.clinicas(user_id);
create index metricas_diarias_clinica_data_idx on public.metricas_diarias(clinica_id, data desc);
create index consultas_clinica_data_idx on public.consultas(clinica_id, data_hora);

alter table public.clinicas enable row level security;
alter table public.configuracoes enable row level security;
alter table public.metricas_diarias enable row level security;
alter table public.consultas enable row level security;

create policy "Users manage own clinica"
  on public.clinicas for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Users manage own configuracoes"
  on public.configuracoes for all
  using (exists (
    select 1 from public.clinicas c
    where c.id = configuracoes.clinica_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.clinicas c
    where c.id = configuracoes.clinica_id and c.user_id = auth.uid()
  ));

create policy "Users read own metricas"
  on public.metricas_diarias for select
  using (exists (
    select 1 from public.clinicas c
    where c.id = metricas_diarias.clinica_id and c.user_id = auth.uid()
  ));

create policy "Users manage own consultas"
  on public.consultas for all
  using (exists (
    select 1 from public.clinicas c
    where c.id = consultas.clinica_id and c.user_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.clinicas c
    where c.id = consultas.clinica_id and c.user_id = auth.uid()
  ));

create or replace function public.handle_new_clinica_config()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.configuracoes (clinica_id)
  values (new.id);
  return new;
end;
$$;

create trigger on_clinica_created
  after insert on public.clinicas
  for each row execute function public.handle_new_clinica_config();
