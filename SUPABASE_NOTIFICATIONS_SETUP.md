# Divine Public School — Notification setup

The database trigger and the `notify-enquiry` Supabase Edge Function are deployed. The public enquiry form now saves the enquiry to Supabase first, then opens the school's WhatsApp chat with the submitted details pre-filled. The visitor must tap Send in WhatsApp. The separate email and automatic school-side WhatsApp alerts are handled by the database trigger and remain inactive until the private webhook secret and provider credentials are configured.

## 1. Configure the webhook secret

1. Generate a long random secret (at least 32 random bytes) locally. Do not send it in chat or commit it.
2. In Supabase Dashboard → Edge Functions → Secrets, add:
   - `ENQUIRY_WEBHOOK_SECRET` = the random secret.
3. In Supabase Dashboard → SQL Editor, run the following, replacing the placeholder with exactly the same secret:

```sql
select vault.create_secret(
  'PASTE_THE_SAME_RANDOM_SECRET_HERE',
  'ENQUIRY_WEBHOOK_SECRET',
  'Authenticates database-to-Edge-Function enquiry notifications'
);
```

If the Vault secret already exists, update that secret in Vault rather than creating duplicate names.

## 2. Email notification (Resend)

1. Create a Resend account and verify a domain you control.
2. Create an API key.
3. Add these Supabase Edge Function secrets:
   - `RESEND_API_KEY`
   - `RESEND_FROM_EMAIL` — e.g. `Divine Public School <notifications@divinepublicschoolgurgoan.com>` (only after domain verification)
   - `NOTIFY_EMAIL_TO` — defaults to `divinepublicschoolfirst@gmail.com`

Email delivery cannot work from an unverified sender domain.

## 3. WhatsApp contact flow versus automatic school alerts

There are two different WhatsApp actions:

- **Parent-to-school WhatsApp message:** implemented in the public enquiry form. The form saves the record first, then opens `https://wa.me/919953275511` with the same details pre-filled. The parent must tap Send. The enquiry remains in the admin panel even if the parent closes WhatsApp without sending.
- **Automatic school-side WhatsApp alert:** optional server-to-WhatsApp notification sent to the school's configured number through Meta WhatsApp Cloud API. This requires the approved template and secrets below. A click-to-chat link does not itself send an alert to the school.

## 4. WhatsApp notification (Meta WhatsApp Cloud API)

1. Set up a Meta app with WhatsApp Cloud API and connect the school's WhatsApp Business phone number.
2. Create and get approval for a message template named (or configure the actual name in the secret) `school_new_enquiry`.
3. The template must contain four body variables in this exact order:
   - Parent / guardian name
   - Phone number
   - Class interested in
   - Enquiry type

Suggested template body:

```text
New enquiry received for Divine Public School.
Parent: {{1}}
Phone: {{2}}
Class: {{3}}
Type: {{4}}
Please follow up with the parent.
```

4. Add these Supabase Edge Function secrets:
   - `WHATSAPP_ACCESS_TOKEN`
   - `WHATSAPP_PHONE_NUMBER_ID`
   - `WHATSAPP_TO_NUMBER` — destination in international digits-only format, e.g. `919953275511`
   - `WHATSAPP_TEMPLATE_NAME` — approved template name
   - `WHATSAPP_TEMPLATE_LANGUAGE` — approved language code, e.g. `en`
   - `META_GRAPH_API_VERSION` — Graph API version supported by the Meta app; default is `v22.0`

WhatsApp business-initiated notifications require an approved template. A phone number by itself is not enough.

## 5. Test

After all secrets are set, submit one test enquiry through the public website. Confirm:
- The row appears in Admin → Website Enquiries.
- The configured school inbox receives an email.
- The configured WhatsApp number receives the approved template message.

Never put Resend or Meta tokens in browser code, GitHub source files, or public issue comments.
