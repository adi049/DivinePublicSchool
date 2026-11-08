-- Send new enquiry notifications from the database, never from an untrusted browser.
create extension if not exists pg_net with schema extensions;

create or replace function public.dispatch_school_enquiry_notification()
returns trigger
language plpgsql
security definer
set search_path = public, extensions, vault
as $$
declare
  webhook_secret text;
begin
  select decrypted_secret into webhook_secret
  from vault.decrypted_secrets
  where name = 'ENQUIRY_WEBHOOK_SECRET'
  limit 1;

  if webhook_secret is null or webhook_secret = '' then
    raise warning 'ENQUIRY_WEBHOOK_SECRET is not configured in Supabase Vault; notification dispatch skipped.';
    return new;
  end if;

  perform net.http_post(
    url := 'https://dazrkmpnqrfrofilbeca.supabase.co/functions/v1/notify-enquiry',
    headers := jsonb_build_object('Content-Type', 'application/json', 'x-webhook-secret', webhook_secret),
    body := to_jsonb(new),
    timeout_milliseconds := 10000
  );
  return new;
end;
$$;

drop trigger if exists on_school_enquiry_notify on public.enquiries;
create trigger on_school_enquiry_notify
after insert on public.enquiries
for each row execute function public.dispatch_school_enquiry_notification();
