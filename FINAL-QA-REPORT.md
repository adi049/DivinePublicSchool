# Divine Public School — Final Production QA Report

**Date:** 7 November 2026
**Round:** final polish before Supabase integration
**Approach:** inspect → fix genuine defects → verify. No rebuild, no redesign, no new features.

> **Read this first — the honest testing boundary.**
> A real headless browser **could not be used**. Chromium cannot launch in this sandbox (missing
> host libraries) and there is no root access to install them; the Playwright cache was also wiped.
> Every interactive check below was therefore run in **jsdom with the real React app mounted** —
> real components, real event handlers, real state, real routing, real storage. jsdom has **no
> layout engine**, so it proves *behaviour*, not *pixels*.
> **No screenshots were captured and no physical device was tested.** Anything about visual
> appearance at a given viewport is reported as a CSS/static finding, clearly labelled as such.

---

## 1. Pages inspected

Every route was mounted and its rendered text measured. All have exactly one `<h1>`, no skipped
heading levels, and no `undefined` / `[object Object]` / unresolved-entity artifacts.

| Public page | Result | Admin section | Result |
|---|---|---|---|
| Home | pass — 4,427 chars | Admin Access / PIN | pass |
| About Us | pass — 6,071 chars | Dashboard Overview | pass |
| Admissions | pass — 2,740 chars | Manage Timetables | pass |
| Gallery | pass — 1,379 chars | Manage Subjects | pass |
| Curriculum | pass — 2,050 chars | Date Sheets | pass |
| Timetable (tab) | pass | Gallery Management | pass |
| Date Sheets (tab) | pass | Events & Announcements | pass |
| Contact Us | pass — 2,074 chars | Website Settings | pass |
| Mandatory Disclosure | pass — 2,422 chars | | |
| Privacy Policy | pass — 2,012 chars | | |
| Terms and Conditions | pass — 1,952 chars | | |
| 404 page | pass — 923 chars | | |

No blank sections, no broken layouts in markup, **no missing images** — all 24 referenced
image/PDF paths resolve to real files in `public/`.

---

## 2. Buttons and interactions tested

All driven by real dispatched events, not inspection of the source.

**Navigation** — navbar links navigate (verified by clicking "About" and asserting the route
changed); logo returns home; mobile burger opens and closes the drawer with `aria-expanded`
flipping correctly; the drawer lists all 5 nav links plus the admissions CTA.

**Action links** — 7 `tel:` links, all matching the two verified school numbers; 3 WhatsApp links,
all well-formed `https://wa.me/919953275511`; mailto matches the verified address; 2 Get Directions
links point at the school's Google Maps URL. **Every** `target="_blank"` carries `rel` protection.

**Contact form** — empty submit is blocked with a visible message; a 2-digit phone is rejected; a
valid submission gives feedback **without faking a server send** (it states the enquiry is stored on
the device). No invented success.

**Gallery** — 4 category filters toggle `aria-pressed` and change the visible count; "All" restores
the full set; 9 tiles open the lightbox; Next and Previous move the counter; ArrowRight works;
Escape and the X both close it; body scroll locks on open and is released on close.

**Curriculum** — 4 tabs switch views; 15 class tiles update the panel; **Class 11 and Class 12 each
render their own 3-stream selector, switch independently, and Class 12's choice does not leak into
Class 11.** The Date Sheets and Timetable tabs both switch correctly.

**Admin** — unauthenticated `/admin/dashboard` is blocked; the PIN gate renders; the correct PIN
signs in; all 7 sidebar routes are present and load; logout re-locks the dashboard.

**Decorative buttons:** none found — every `<button>` has a handler or a `type="submit"`, and there
are no dead `href="#"` links anywhere in the codebase.

---

## 3. Mobile viewport tests performed

**What was actually verified:** the CSS defines 12 max-width breakpoints — 1080, 1000, 960, 900,
860, 760, 640, 620, 560, 520, 480, 420 px — and every requested viewport is covered:

| Viewport | Breakpoints applying |
|---|---|
| 1920×1080 / 1440×900 / 1280×720 | base desktop styles |
| 768×1024 (tablet) | 1080, 1000, 960, 900, 860 |
| 430×932 | …down to 480 |
| 390×844 and 360×800 | …down to 420 (all 12) |

**Static overflow audit:** no `100vw` usage (the classic scrollbar-overflow bug) — the one
occurrence is the safe `min(360px, calc(100vw - 36px))`. The only fixed `min-width: 860px` is the
admin events table, which sits inside an `overflow-x: auto` wrapper — the correct pattern for a data
table on a phone. The smallest font size (`.brand__tag`, 0.62rem ≈ 10px) **was bumped to 0.68rem**
on screens under 860px for legibility.

**What was NOT verified:** actual pixel rendering at those widths. I cannot claim "no horizontal
scrolling" or "no overlapping buttons" as *tested* — there is no layout engine. Please open the live
preview on a real phone; the breakpoints and overflow guards are in place to make that pass.

---

## 4. Admin Dashboard tests performed

Real interactions, with persistence re-checked after unmounting and remounting the whole app
(the equivalent of a browser refresh).

| Feature | Tested |
|---|---|
| **Subjects** | Add (7→8 rows, typed name retained), Edit (field updates), Reorder (order changes; first row's "Move up" correctly disabled), Save (enabled only when dirty, completes cleanly), Delete (8→7) |
| **Timetables** | Upload image, **preview appears before saving**, Save completes |
| **Date Sheets** | Upload field present, PDF accepted |
| **Gallery** | Upload + caption enables the Add button, add completes and lists the photo, **the new photo then appears on the public gallery page**, delete controls present |
| **Events** | Create ×2, both listed in the admin table, publish/unpublish, popup sequencing, persistence after refresh |
| **Auth** | PIN gate blocks unauthenticated access, correct PIN signs in, logout re-locks |

**Device-local limitation preserved and stated in the UI.** Uploads live in this browser's
localStorage + IndexedDB. They are **not** shared with other visitors or devices, and nothing in the
product claims otherwise.

---

## 5. Event popup tests performed

32 dedicated DOM assertions plus 9 in the full-app suite:

- one active event displays correctly; multiple events display **sequentially, never stacked**
- the "1 of 3" indicator is correct and updates
- Previous / Next controls work
- close button, **Escape key** and **backdrop click** all close it and all persist the dismissal
- each dismissal is written to `sessionStorage` **immediately**, so refreshing midway resumes at the
  next undismissed poster rather than restarting
- a newly published event appears in the same session **and** on a fresh load, without resurrecting
  dismissed posters
- expired, draft and inactive events never render and never enter the queue
- no live events → no popup at all
- body scroll is locked while open and **always released** — the visitor is never trapped

---

## 6. SEO checks performed

Verified against the built `dist/`, all 9 crawlable pages:

- unique titles (47–57 chars) and descriptions (140–156 chars)
- canonical on `https://adi049.github.io/DivinePublicSchool/…`, with `og:url` byte-identical
- Open Graph complete; `twitter:card = summary_large_image`; every `og:image` resolves
- JSON-LD parses on all 9 pages: `School` + `WebSite` + `WebPage`/`ContactPage` + `BreadcrumbList`
- sitemap.xml: exactly 9 URLs, canonical host, no duplicates, **no admin or legal pages**
- robots.txt allows the base, disallows `/DivinePublicSchool/admin`, declares the sitemap
- `404.html`, `site.webmanifest`, `favicon.png` all present and serving 200
- **no asset path escapes `/DivinePublicSchool/`** — GitHub Pages safe
- every `<img>` has descriptive alt text

No keyword stuffing, no duplicate copy (pairwise-compared across all 9 pages), **no invented
ratings, awards, rankings, testimonials or "best school" claims** — verified by regex sweep over the
rendered text of every page. **No claim is made that the site is indexed or ranking.**

---

## 7. Accessibility and performance improvements

**Fixed this round:**

1. **Sticky hover on touch devices** — 19 rules applied `transform` on `:hover`, which leaves cards
   and buttons visually "lifted" after a tap on a phone. Added a `@media (hover: none)` block that
   neutralises them, and made gallery captions always visible on touch instead of hover-revealed.
2. **No pressed state for touch** — the stylesheet had 63 `:hover` rules but only one `:active`.
   Added visible press feedback for buttons, filters, class/stream tiles, nav and drawer links,
   lightbox and popup controls, and admin icon buttons.
3. **Touch targets** — added `min-height: 44px` (and `min-width` for icon buttons) under
   `@media (pointer: coarse)`.
4. **Skip link** — keyboard users previously had to tab through the whole nav. Added a
   "Skip to main content" link that is hidden until focused. It calls `preventDefault()` and moves
   focus programmatically, because a bare `href="#main-content"` would have **overwritten the
   HashRouter route and navigated to a 404**.
5. **Image loading** — all 16 `<img>` elements now declare intent explicitly: `loading="eager"` on
   the hero, lightbox and event poster; `loading="lazy"` on admin previews and document viewers;
   `decoding="async"` throughout.
6. **Reduced motion** — the new `:active` transforms are disabled under `prefers-reduced-motion`,
   alongside the existing global rule.
7. **Small-text legibility** — `.brand__tag` raised from 0.62rem to 0.68rem below 860px.

**Verified as already correct (no change needed):**

- Modals: `EventPopup`, `Lightbox` and `ConfirmDialog` all have `role="dialog"` + `aria-modal`;
  the popup also has `aria-labelledby`.
- All icon-only buttons already carry `aria-label`; all inputs are labelled (the PIN fields use
  "Digit 1 of 4", subject rows use "Subject 1").
- Semantic landmarks (`<header>`, `<nav>`, `<main id="main-content">`, `<footer>`) in place.
- Global `:focus-visible` ring defined in base.css.
- **Colour contrast passes.** Body and heading tokens measured against white: `--ink` 14.86:1,
  `--ink-soft` 8.63:1, `--muted` 4.72:1 — all AA or better. The low-contrast accents (cyan, pink,
  amber) are used only as backgrounds/borders, never as text. `--silver` is used as text only on
  dark navy (8.7–10.4:1).
- **Console is clean** — 0 React or runtime errors across the entire interaction run.
- The colourful theme is untouched: no colour token was modified in this round.

---

## 8. Build result

```
npm ci     → 73 packages, exit 0, vite 5.4.21
npm run build → ✓ 2002 modules transformed, built in 13.99s, exit 0, no errors
```

| Artifact | Size | Gzip |
|---|---|---|
| `dist/assets/index-CeA7MUld.js` | 476.52 kB | 141.71 kB |
| `dist/assets/index-D3U9Bl2A.css` | 110.50 kB | 18.46 kB |
| `dist/index.html` | 6.46 kB | 1.72 kB |
| `dist/` total | 12 MB (mostly photographs and PDFs) | |

The SEO generator then emitted robots.txt, sitemap.xml, site.webmanifest, 404.html, synced the home
head, and wrote all 8 crawlable entry pages — "9 URLs in sitemap.xml". The new polish CSS was
confirmed present in the shipped bundle (`hover:none`, `pointer:coarse`, `.skip-link`).

Deployment settings untouched: base `/DivinePublicSchool/`, **HashRouter**, `outDir: dist`,
existing SEO generation script, existing sitemap/404 configuration.

---

## 9. Automated test results

| Suite | File | Assertions |
|---|---|---|
| Full app interaction *(new)* | `tests/app-interaction-test.mjs` | **104 passed, 0 failed** |
| Content & copy audit *(new)* | `tests/content-audit.mjs` | **31 passed, 0 failed** |
| Event popup DOM behaviour | `tests/popup-dom-test.mjs` | **32 passed, 0 failed** |
| SSR render of all pages | `tests/render-test.mjs` | **22 passed, 0 failed** |
| Event service logic | `tests/event-test.mjs` | **58 passed, 0 failed** |
| Service / SEO data | `tests/svc-test.mjs` | **28 passed, 0 failed** |
| IndexedDB storage | `tests/idb-test.mjs` | **5 passed, 0 failed** |
| | **Total** | **280 passed, 0 failed** |

Three failures surfaced during development of the new suite and all three were **my test's
selectors, not app defects** — the drawer link count (NAV_LINKS has exactly 5), the email key name,
and stream buttons that only exist once a Class 11/12 tile is selected. Each was corrected and the
underlying behaviour then verified as correct.

---

## 10. Remaining limitations

1. **No real-browser or physical-device testing.** As stated at the top — no headless Chromium, no
   root to install its dependencies. Responsive behaviour is backed by a breakpoint and overflow
   audit, not by rendering. **Please view the site on a real phone before launch.**
2. **No screenshots** could be captured for the same reason.
3. **Storage is device-local.** Timetables, subjects, date sheets, gallery uploads and events live
   in this browser's localStorage + IndexedDB. They do not sync to other devices or visitors. This
   is disclosed in the admin UI and resolves with Supabase.
4. **Admin PIN is device-local** and not real authentication — Supabase Auth replaces it.
5. **The contact form does not send anything.** It stores the enquiry locally and says so; it needs
   a backend or form service.
6. **robots.txt caveat** (documented in `SEO-CHECKLIST.md`): crawlers only read
   `https://adi049.github.io/robots.txt`, which belongs to the GitHub account, so the sub-path file
   is ignored until a custom domain is used. The sitemap is still submittable in a URL-prefix
   property.
7. **Legal pages are interim summaries.** The wording was polished this round to read
   professionally, but the school must still publish its own approved Privacy Policy and Terms.
   Both pages are `noindex`.
8. **Four school photographs are still missing** — school office, blue signboard front view,
   building with red gate, and a classroom. No stock or AI substitutes were used. The gallery holds
   9 official photographs.
9. **JS bundle is 476 kB (142 kB gzipped)** — acceptable, but if you later want it smaller, the
   realistic win is route-level code splitting of the admin area, which is a structural change and
   out of scope for a polish round.

---

## Files changed in this round

| File | Change |
|---|---|
| `src/styles/components.css` | appended the touch/hover/tap-target polish block |
| `src/styles/base.css` | appended skip-link styles |
| `src/components/layout/PublicLayout.jsx` | added the skip link (HashRouter-safe) |
| `src/pages/Legal.jsx` | reworded two interim-notice paragraphs |
| `src/pages/Home.jsx`, `EventPopup.jsx`, `Lightbox.jsx`, `DocumentViewer.jsx`, `AdminEvents.jsx`, `AdminDateSheets.jsx`, `AdminTimetables.jsx` | explicit `loading` / `decoding` on images |
| `tests/app-interaction-test.mjs`, `tests/content-audit.mjs` | new suites |

No colours, layout, photographs, school information, Director's message, navigation, PIN mechanism,
routing or admin functionality were changed.
