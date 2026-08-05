revoke execute on function public.handle_new_clinica_config() from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;
grant execute on function public.handle_new_clinica_config() to postgres, service_role;
grant execute on function public.handle_new_user() to postgres, service_role;
