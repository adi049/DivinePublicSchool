# Divine Public School — Website Frontend

Premium, responsive school website for **Divine Public School**, Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana (CBSE curriculum).

Built with **React 18 + Vite**, **React Router**, **Framer Motion** (subtle animations) and **Lucide** icons. Fonts (Inter + Lora) are bundled locally — the site works fully offline.

## Quick start

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # production build → dist/
```

## Pages

| Route | Page |
|---|---|
| `/` | Home (hero, about preview, why-choose, curriculum preview, school life, Director's message, admissions CTA, contact preview) |
| `/about` | School introduction, Director's profile & full official message, vision/mission/values |
| `/gallery` | Filterable photo gallery with lightbox (prev/next, keyboard navigation) |
| `/curriculum` | Interactive class explorer (Nursery → XII), stream selection for XI–XII, subjects & timetables |
| `/contact` | Call / WhatsApp / Directions buttons, enquiry form with validation, map placeholder |
| `/admissions` | Admissions 2026–27 — classes offered, enquiry process, admission enquiry form |
| `/mandatory-disclosure` | Public Mandatory Disclosure — official school data + downloadable statutory PDFs (from `public/documents/`) |
| `/privacy-policy`, `/terms-and-conditions` | Legal pages (review before launch) |
| `/admin` and `/admin/*` | Staff admin: PIN gate + dashboard (local demo auth — see below) |
| `*` | 404 page |

## Admin Dashboard

**Access** — scroll to the footer bottom bar and click the small school logo **three times**. The Admin Access screen asks for a 4-digit PIN.

- **First visit on a device:** you create the PIN (enter twice). It is stored only as a salted SHA-256 hash in that browser (`localStorage`), never in the source code. The sign-in session is per-tab (`sessionStorage`).
- ⚠️ This is a deliberate **temporary, device-local gate** — a screen against casual access, not real security. Supabase Auth (email + role) will replace it. Only `src/services/authService.js` changes when that happens.

**Dashboard sections** (left sidebar):

| Section | What it does |
|---|---|
| Overview | Live counts (classes, timetables, subjects, date sheets) computed from stored records + recent-changes list |
| Manage Timetables | Upload / replace / unpublish / delete a timetable **photograph** per class (Classes 11 & 12 per stream) with title, session, effective date |
| Manage Subjects | Per-class (and per-stream) subject lists: add, edit, delete, reorder (arrows), save |
| Date Sheets | Upload examination date sheets as **image or PDF** with exam name, session, publication date |
| Gallery Management | Add photographs; hide/show any photo. Official school photographs are protected from deletion |
| Website Settings | Top announcement banner (on/off + text), change admin PIN |

**Timetable & date-sheet viewing (public Curriculum page)** — students pick class (and stream for 11/12) → tabs: Overview / Subjects / **Timetable** / **Date Sheet**. Images open in a viewer with zoom in/out, drag-to-pan, mouse-wheel zoom, fullscreen, reset and download; PDFs open embedded with open/download actions. When nothing is published, a clean “…will be available soon” note appears.

### Data layer (temporary — prepared for Supabase)

`src/services/` isolates everything:

| Module | Role | Stores in (until Supabase) |
|---|---|---|
| `authService.js` | PIN setup/verify/change — swap for Supabase Auth | localStorage (hash) + sessionStorage |
| `timetableService.js` | timetable CRUD | localStorage records + IndexedDB photos |
| `subjectService.js` | subject CRUD | localStorage |
| `datesheetService.js` | date-sheet CRUD (image/PDF) | localStorage + IndexedDB files |
| `galleryService.js` | gallery photos | localStorage + IndexedDB files |
| `settingsService.js` | announcement etc. | localStorage |
| `localStore.js` | the only file touching localStorage/IndexedDB | — |
| `catalogue.js` | canonical class/stream ids used everywhere | — |

Record shapes mirror the planned Supabase tables (`timetables`, `subjects`, `date_sheets`). Uploaded files persist across refreshes (IndexedDB). **Nothing syncs between devices yet** — the admin screens say so explicitly.

| What | File |
|---|---|


## Where to edit content (no JSX changes needed)

| What | File |
|---|---|
| Mandatory disclosure data & document links | `src/data/disclosure.js` |
| Gallery photos, captions, categories (real school photos) | `src/data/gallery.js` |

### Photographs
All photographs are the school's real photos, downloaded from the official website (divinepublicschoolgurgaon.com) and stored locally in `public/images/gallery/`. New photographs provided separately can be dropped into that folder and registered in `src/data/gallery.js`.

## Where to edit content (no JSX changes needed)

| What | File |
|---|---|
| School name, address (Nayagaon Rd, Vatika Kunj Extension), phones, email, WhatsApp, map link | `src/data/school.js` (`SCHOOL`) |
| Director's name, photo, message, biography | `src/data/school.js` (`DIRECTOR`) |
| Why-choose points, vision/mission/values, about intro | `src/data/school.js` |
| Subjects per class, Class 11–12 stream subjects | `src/data/curriculum.js` (`CLASSES`, `STREAMS`) |
| Timetables (by group: prePrimary, primary, middle, secondary, per-stream) | `src/data/curriculum.js` (`TIMETABLES`) |
| Gallery photos, captions, categories | `src/data/gallery.js` |

### Adding or replacing photographs
Drop new photographs into `public/images/gallery/` and register each in `src/data/gallery.js` — entries carry `src`, `caption`, `alt` and `category` (`Campus` / `Infrastructure` / `Celebrations`, or add a new category to `GALLERY_CATEGORIES`). The hero (`public/images/hero-campus.jpg`) and about (`public/images/about-building.jpg`) photos are also real campus photographs that can be replaced in place.

## Connecting a backend later

The two enquiry forms (`Contact` and `Admissions`) are frontend-only. In
`src/components/forms/EnquiryForm.jsx`, replace the simulated delay inside
`handleSubmit` (marked with `TODO(backend integration)`) with a `fetch()` POST
to your endpoint — validation and the success UI are already in place.

## Design system

- White base, light-blue primary accent (`--blue: #1e6fc4`), soft-green secondary (`--green: #43a37c`), dark-navy text/footer (`--ink: #0e2c49`)
- Typeface: **Lora** (headings) + **Inter** (body/UI) — self-hosted via `@fontsource`
- All design tokens live at the top of `src/styles/base.css`; page- and component-level styles in `src/styles/components.css` and `src/styles/pages.css`

## Notes

- No invented statistics, testimonials or awards are used anywhere on the site; subjects/timetables are clearly flagged as placeholder data.
- SEO: per-page titles & meta descriptions (`src/hooks/useSEO.js`), semantic HTML, alt text on images, single `h1` per page.
- Accessibility: focus-visible styles, `aria` labels on interactive controls, `prefers-reduced-motion` respected, keyboard-navigable lightbox and tabs.
"# DivinePublic" 
