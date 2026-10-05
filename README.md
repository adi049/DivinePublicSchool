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
| `/admissions` | Admissions 2026–27 — classes open, 3-step process, admission enquiry form |
| `/privacy-policy`, `/terms-and-conditions` | Legal pages (review before launch) |
| `*` | 404 page |

## Where to edit content (no JSX changes needed)

| What | File |
|---|---|
| School name, address (Nayagaon Rd, Vatika Kunj Extension), phones, email, WhatsApp, map link | `src/data/school.js` (`SCHOOL`) |
| Director's name, photo, message, biography | `src/data/school.js` (`DIRECTOR`) |
| Why-choose points, vision/mission/values, about intro | `src/data/school.js` |
| Subjects per class, Class 11–12 stream subjects | `src/data/curriculum.js` (`CLASSES`, `STREAMS`) |
| Timetables (by group: prePrimary, primary, middle, secondary, per-stream) | `src/data/curriculum.js` (`TIMETABLES`) |
| Gallery photos, captions, categories | `src/data/gallery.js` |

### Replacing placeholder photographs
Drop real photographs into `public/images/` (or `public/images/gallery/`) and update the path of the corresponding entry in `src/data/gallery.js` — each entry carries its own `src`, `caption`, `alt` and `category`. To add a photograph, append a new entry to the same array.

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
