-- Divine Public School: secure admin membership and least-privilege grants
-- Applied to project dazrkmpnqrfrofilbeca on 2026-11-07.

create schema if not exists private;
revoke all on schema private from public, anon, authenticated;

create or replace function private.sync_divine_school_admin()
returns trigger
language plpgsql
security definer
set search_path = pg_catalog
as $$
begin
  if lower(coalesce(new.email, '')) = 'divinepublicschoolmarutikunj@gmail.com' then
    insert into public.school_admins (user_id, email)
    values (new.id, lower(new.email))
    on conflict (user_id) do update set email = excluded.email;
  else
    delete from public.school_admins where user_id = new.id;
  end if;
  return new;
end;
$$;

revoke all on function private.sync_divine_school_admin() from public, anon, authenticated;

drop trigger if exists divine_school_admin_auth_sync on auth.users;
create trigger divine_school_admin_auth_sync
after insert or update of email on auth.users
for each row execute function private.sync_divine_school_admin();

-- RLS policies determine row access; SQL grants limit which operations each
-- database role can even attempt.
revoke all on table
  public.school_admins,
  public.timetables,
  public.subjects,
  public.date_sheets,
  public.gallery_photos,
  public.gallery_hidden,
  public.events,
  public.site_settings,
  public.enquiries
from anon, authenticated;

grant select on public.school_admins to authenticated;

grant select on public.timetables, public.subjects, public.date_sheets,
  public.gallery_photos, public.events, public.site_settings to anon, authenticated;

grant select, insert, update, delete on public.timetables, public.subjects,
  public.date_sheets, public.gallery_photos, public.gallery_hidden,
  public.events, public.site_settings to authenticated;

grant insert on public.enquiries to anon;
grant select, update, delete on public.enquiries to authenticated;
