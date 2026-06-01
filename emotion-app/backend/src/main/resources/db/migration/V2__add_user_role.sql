do $$
begin
  if to_regclass('public.app_user') is not null then
    alter table app_user add column if not exists role varchar(20);

    update app_user
    set role = 'USER'
    where role is null;

    alter table app_user alter column role set not null;
  end if;
end $$;
