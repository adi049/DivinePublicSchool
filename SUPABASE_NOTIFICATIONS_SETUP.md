# Divine Public School — Supabase and password recovery setup

## Enquiry flow

The public enquiry form saves every valid submission to `public.enquiries` in Supabase. The admin panel reads the same table, so new enquiries appear under Admin → Website Enquiries.

After the database confirms the save, the website opens the school's WhatsApp chat with the enquiry details pre-filled. The parent must tap **Send**. This uses a normal `wa.me` click-to-chat link only.

**No WhatsApp Cloud API, Meta app, access token, phone-number ID, or message template is used.**

## Admin password recovery

The admin sign-in page includes **Forgot password? Send reset link**. It sends a Supabase Auth recovery email and redirects back to the current website origin and path. The reset page accepts the recovery token and lets the administrator set a new password (minimum 8 characters).

In Supabase Dashboard → Authentication → URL Configuration, add the deployed website URL to **Redirect URLs**:

- `https://adi049.github.io/DivinePublicSchool/`

If the school later switches to its custom domain, add that exact HTTPS website URL too. Keep the Supabase Site URL set to the primary deployed website URL.

The Supabase Auth email template for **Reset Password** must contain the Supabase confirmation link, normally `{{ .ConfirmationURL }}`. Do not replace it with a hard-coded URL.

## Optional email notification

The database notification function can send an email through Resend only if the webhook secret and Resend secrets are configured. This is separate from the required enquiry-to-admin-and-WhatsApp flow and is not required for WhatsApp click-to-chat.

Never put provider API keys or service-role keys in browser code, GitHub source files, or public issue comments.
