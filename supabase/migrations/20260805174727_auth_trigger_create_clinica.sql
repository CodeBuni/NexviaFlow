create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.clinicas (
    user_id,
    nome_clinica,
    nome_responsavel,
    email,
    onboarding_step
  )
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'nome_clinica', 'A minha clínica'),
    coalesce(new.raw_user_meta_data->>'nome_responsavel', coalesce(new.raw_user_meta_data->>'full_name', 'Responsável')),
    new.email,
    'calendario'
  )
  on conflict (user_id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
