# New enquiry notifications

The Edge Function `notify-enquiry` is deployed. It accepts database-triggered requests only when the `x-webhook-secret` matches `ENQUIRY_WEBHOOK_SECRET`.

Configure these secrets in Supabase Dashboard → Edge Functions → Secrets:

- `ENQUIRY_WEBHOOK_SECRET` — long random secret; must exactly match the Vault secret of the same name.
- `RESEND_API_KEY` — API key from Resend.
- `RESEND_FROM_EMAIL` — sender address on a domain verified in Resend, e.g. `Divine Public School <notifications@your-verified-domain>`.
- `NOTIFY_EMAIL_TO` — defaults to `divinepublicschoolmarutikunj@gmail.com`.
- `WHATSAPP_ACCESS_TOKEN` — Meta WhatsApp Cloud API permanent/system-user token.
- `WHATSAPP_PHONE_NUMBER_ID` — Meta WhatsApp Cloud API phone-number ID.
- `WHATSAPP_TO_NUMBER` — destination phone in international digits-only format, e.g. `919953275511`.
- `WHATSAPP_TEMPLATE_NAME` — approved WhatsApp template name. It must have four body variables in this order: parent name, phone, class, enquiry type.
- `WHATSAPP_TEMPLATE_LANGUAGE` — approved template language code, e.g. `en`.
- `META_GRAPH_API_VERSION` — optional Graph API version supported by your Meta app; default is `v22.0`.

Create the matching Vault secret in Supabase SQL Editor:

```sql
select vault.create_secret(
  'PASTE_THE_SAME_RANDOM_SECRET_HERE',
  'ENQUIRY_WEBHOOK_SECRET',
  'Protects the database-to-Edge-Function enquiry notification hook'
);
```

Do not commit secrets or send them in chat. The function is deployed but email/WhatsApp delivery remains inactive until provider secrets, verified sender identity, and the approved WhatsApp template are configured.
