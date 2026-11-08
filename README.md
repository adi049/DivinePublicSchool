# Divine Public School — Website & Admin Portal

Production website for **Divine Public School**, Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana. The site follows the CBSE curriculum from Nursery to Class XII.

- **Frontend:** React 18, Vite, React Router (HashRouter for GitHub Pages), Framer Motion, Lucide
- **Backend:** Supabase Database, Auth, Row Level Security, Storage and Realtime
- **Hosting:** GitHub Pages
- **Public URL:** https://adi049.github.io/DivinePublicSchool/
- **Supabase project:** `dazrkmpnqrfrofilbeca`

## Local development

```bash
npm ci
npm run dev
npm run build
``

The production build is generated in `dist/`. GitHub Actions builds and deploys the site on pushes to `main`.

## Public pages

| Route | Purpose |
|---|---|
| `/` | Home |
| `/about` | School introduction and Director's message |
| `/gallery` | School photo gallery |
| `/curriculum` | Class-wise subjects, timetables and date sheets |
| `/contact` | Contact details and enquiry form |
| `/admissions` | Admission information and enquiry form |
| `/mandatory-disclosure` | Mandatory disclosure and statutory documents |
| `/privacy-policy` | Privacy policy |
| `/terms-and-conditions` | Terms and conditions |

## Admin portal

Open the footer's small school logo with the three-click gesture, or navigate directly to `/#/admin`.

Admin sign-in uses **Supabase Auth email/password**. Only the email allow-listed in `public.school_admins` is authorized. Password recovery is available through the Forgot Password link; the reset flow returns to `/#/admin/reset-password`.

Admin dashboard sections:

- Overview
- Timetables
- Subjects
- Date Sheets
- Gallery
- Events
- Enquiries
- Website Settings

Admin uploads are stored in the Supabase `school-media` bucket. Admin content changes are shared through Supabase and Realtime; this is not device-local demo storage.

## Enquiry flow

1. Parent submits the contact or admission enquiry form.
2. The enquiry is saved in the Supabase `enquiries` table and shown in the admin Enquiries section.
3. The site opens the school's WhatsApp chat with the enquiry details pre-filled.
4. The parent reviews the message and manually taps **Send**.

**No WhatsApp Cloud API, Meta access token, WhatsApp template or automated WhatsApp sending is used.** The parent sends the WhatsApp message themselves. Database saving and WhatsApp chat opening are separate steps; a successful database save is shown before continuing.

## Supabase setup and security

Project URL: `https://dazrkmpnqrfrofilbeca.supabase.co`

The browser uses only the Supabase publishable/anon key. Never expose a service-role or secret key in frontend code, GitHub, or chat.

Database access is protected with Row Level Security:
- Public visitors can read published public-facing content.
- Public visitors can insert enquiries, but cannot read enquiry records.
- Authenticated administrators can manage school content only when their user ID is present in `public.school_admins`.
- The admin membership table does not allow users to grant themselves administrator access.
- Storage write policies require an authorized admin.

See:
- `SUPABASE_ADMIN_SETUP.md` for admin identity, permissions and password recovery redirect setup.
- `SUPABASE_NOTIFICATIONS_SETUP.md` for the enquiry notification architecture and the no-WhatsApp-API decision.
- `SUPABASE_BACKUP_SETUP.md` for the optional weekly external backup workflow.

## Backup status — action still required

A weekly backup workflow is committed at `.github/workflows/weekly-supabase-backup.yml`. It exports the application database schema/data/roles and downloads `school-media` objects to a private Google Drive remote, retaining 90 days.

**The backup is not active until all three GitHub Actions repository secrets are configured:**
- `SUPABASE_ACCESS_TOKEN`
- `SUPABASE_DB_URL`
- `RCLONE_CONFIG_B64`

After adding the secrets, run **Actions → Weekly private Supabase backup → Run workflow**, confirm success, and verify the archive in the private Drive. A restore drill into a separate test project is still required. Backups contain parent contact information and must remain private.

## SEO and launch checklist

The repository includes page metadata, structured data, `robots.txt`, `sitemap.xml`, favicons and crawlable static entry pages. Google indexing is not guaranteed and must be completed through the school's Google Search Console account.

See `SEO-CHECKLIST.md` for Search Console ownership verification, sitemap submission, indexing requests and Google Business Profile checks. The checklist's verification and indexing steps require access to the school's Google account.

## Content maintenance

- School contact details and Director profile: `src/data/school.js`
- Curriculum data: `src/data/curriculum.js`
- Gallery captions and categories: `src/data/gallery.js`
- Mandatory disclosure: `src/data/disclosure.js`
- SEO page metadata: `src/data/seo.js`
- School images: `public/images/`
- Statutory PDFs: `public/documents/`

Keep school details, statutory documents, fees, admission dates and academic records verified by the school before publishing changes.

## Important outstanding launch items

1. Configure and test the private weekly backup secrets and complete a restore drill.
2. Complete Google Search Console verification and sitemap submission using the school's Google account.
3. Confirm the intended custom domain and DNS/HTTPS setup before switching canonical URLs or sitemap entries away from the GitHub Pages URL.
4. Enable Supabase leaked-password protection in Authentication security settings.
5. Review the legal pages with the school before treating them as approved legal notices.
