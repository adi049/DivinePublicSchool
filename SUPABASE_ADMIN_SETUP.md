# Divine Public School — Supabase admin setup

Project: `dazrkmpnqrfrofilbeca`

## Admin identity

Only this mailbox is automatically allow-listed:

`divinepublicschoolmarutikunj@gmail.com`

The database trigger `divine_school_admin_auth_sync` watches Supabase Auth users. When a user with this exact email is created (or their email is changed to this exact address), it inserts/updates the matching `auth.users.id` in `public.school_admins`. If that account's email is changed away from the authorized address, its admin membership is removed.

## Create the Auth user

1. Open Supabase Dashboard → Authentication → Users.
2. Choose **Add user**.
3. Enter the exact mailbox above and set a strong password (do not put it in GitHub or share it in chat).
4. Confirm the user if the dashboard offers that option.
5. Verify that `public.school_admins` now contains exactly one row for this user.

The trigger only maps the email to the admin allow-list. It does not create or send a password.

## Database access model

- Public/anonymous: SELECT only on published timetable, published date sheet, visible gallery, live events, subjects and announcement settings; INSERT only on enquiries.
- Authenticated school admin: content CRUD is allowed only when the authenticated UID exists in `public.school_admins` (RLS policies).
- Admin membership table: authenticated SELECT of own row only; no client-side INSERT/UPDATE/DELETE.
- Storage bucket: `school-media`, public reads; upload/update/delete policies require a matching admin row.
- No sample records are seeded. The content tables remain empty until school staff add content.

Never put a Supabase service-role/secret key in the browser or repository. The browser must use only the publishable key.


## Password recovery redirect

The admin sign-in page includes a Forgot password flow. In Supabase Dashboard → Authentication → URL Configuration, set the Site URL and add this exact Redirect URL to the allow list:

`https://adi049.github.io/DivinePublicSchool/`

The reset email returns to the GitHub Pages site, where the app captures the short-lived recovery token and opens `#/admin/reset-password`. Test by requesting a reset for the school admin email and completing the password change from the email link.
