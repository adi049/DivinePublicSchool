# Divine Public School — SEO Setup & Google Search Console Checklist

Site: **https://adi049.github.io/DivinePublicSchool/**
Last updated: 7 November 2026

> **Status honesty note.** Everything below is *preparation*. The website is
> **not** yet verified, submitted, indexed or ranking on Google — none of that
> has been confirmed, because it can only happen after a person with access to
> the school's Google account completes the steps in Part B. Indexing typically
> takes a few days to a few weeks after submission, and ranking is never
> guaranteed.

---

## Part A — What is already built into the site

| Item | Where it lives | Status |
|---|---|---|
| Unique title per page (9 pages, all ≤ 62 chars) | `src/data/seo.js` | ✅ done |
| Unique meta description per page (110–160 chars) | `src/data/seo.js` | ✅ done |
| Canonical URL per page (self-referencing, no duplicates) | `src/hooks/useSEO.js` + entry pages | ✅ done |
| Open Graph tags (title, description, image, url, locale, site_name) | `useSEO.js`, `index.html` | ✅ done |
| Twitter Card tags (`summary_large_image`) | `useSEO.js`, `index.html` | ✅ done |
| JSON-LD: `School`, `WebSite`, `WebPage`/`ContactPage`, `BreadcrumbList` | `src/data/seo.js` | ✅ done |
| `PostalAddress`, `telephone` (×2), `email`, `hasMap`, `areaServed` | `schoolSchema()` | ✅ done |
| Heading hierarchy — exactly one H1 per page, no H1→H3 skips | all pages | ✅ verified |
| Descriptive `alt` on every image | all components | ✅ verified |
| `robots.txt` | `public/robots.txt` | ⚠️ see caveat 2 |
| `sitemap.xml` (9 URLs + image entries) | `public/sitemap.xml` | ✅ done |
| Crawlable per-page URLs despite HashRouter | `dist/<slug>/index.html` | ✅ see caveat 1 |
| 404 page with correct `noindex` | `public/404.html` | ✅ done |
| `noindex` on admin, 404 and placeholder legal pages | `useSEO({ noindex: true })` | ✅ done |
| Favicon, apple-touch-icon, web manifest, theme colour | `index.html`, `site.webmanifest` | ✅ done |
| Lazy loading + async decoding on all content images | all pages | ✅ verified |

### Crawlable URLs now in the sitemap

```
https://adi049.github.io/DivinePublicSchool/
https://adi049.github.io/DivinePublicSchool/about/
https://adi049.github.io/DivinePublicSchool/admissions/
https://adi049.github.io/DivinePublicSchool/curriculum/
https://adi049.github.io/DivinePublicSchool/timetable/
https://adi049.github.io/DivinePublicSchool/date-sheets/
https://adi049.github.io/DivinePublicSchool/gallery/
https://adi049.github.io/DivinePublicSchool/contact/
https://adi049.github.io/DivinePublicSchool/mandatory-disclosure/
```

### Target queries each page is written for

| Page | Primary queries |
|---|---|
| Home | Divine Public School · Divine Public School Gurgaon / Gurugram · CBSE school in Gurugram |
| About | about Divine Public School · CBSE school in Gurugram · schools near Vatika Kunj Extension |
| Admissions | admission open in Gurgaon · nursery admission in Gurgaon / Gurugram · CBSE school admission |
| Curriculum | CBSE curriculum Gurugram · primary school in Gurugram · Science/Commerce/Humanities streams |
| Timetable | school timetable Gurugram · class timetable CBSE school |
| Date Sheets | exam date sheet CBSE school Gurugram |
| Gallery | Divine Public School photos · school campus Gurugram |
| Contact | Divine Public School contact number · school near Nayagaon Road Gurgaon · schools near Vatika Kunj |

---

## Part B — Google Search Console: step by step

### B1. Create the property
1. Sign in at **https://search.google.com/search-console** with the school's Google account (ideally the same one used for Google Maps / Business Profile).
2. Click **Add property → URL prefix** (not "Domain" — that needs DNS, which GitHub Pages sub-paths don't give you).
3. Enter exactly:
   ```
   https://adi049.github.io/DivinePublicSchool/
   ```

### B2. Verify ownership — use the HTML file method
GitHub Pages can't set custom HTTP headers, so **HTML file upload** is the reliable method.

1. Search Console gives you a file named like `google1a2b3c4d5e6f7g8h.html`.
2. Put that file in the project's **`public/`** folder:
   `divine-public-school/public/google1a2b3c4d5e6f7g8h.html`
3. Run `npm run build` and deploy `dist/` as usual.
4. Confirm it loads at
   `https://adi049.github.io/DivinePublicSchool/google1a2b3c4d5e6f7g8h.html`
5. Click **Verify** in Search Console.

**Alternative — meta tag method.** If you prefer the meta tag, paste the line Google gives you into `index.html`, just below the `<meta name="robots" …>` line:
```html
<meta name="google-site-verification" content="PASTE_TOKEN_HERE" />
```
Then rebuild and deploy, and click Verify.

### B3. Submit the sitemap
1. In Search Console: **Indexing → Sitemaps**.
2. In the "Add a new sitemap" box enter just:
   ```
   sitemap.xml
   ```
   (Search Console prefixes your property URL, giving
   `https://adi049.github.io/DivinePublicSchool/sitemap.xml`.)
3. Submit. Status should move to **Success** with **9 discovered URLs**.
   If it says "Couldn't fetch", open the URL in a browser first — a fresh deploy can take a minute or two to go live.

### B4. Request indexing for the key pages
Use **URL Inspection** (top search bar) for each of these, then **Request Indexing**:
- `https://adi049.github.io/DivinePublicSchool/`
- `https://adi049.github.io/DivinePublicSchool/admissions/`
- `https://adi049.github.io/DivinePublicSchool/contact/`
- `https://adi049.github.io/DivinePublicSchool/about/`

Do a few per day; Google rate-limits manual requests.

### B5. Validate the structured data
1. **Rich Results Test** — https://search.google.com/test/rich-results
2. **Schema Markup Validator** — https://validator.schema.org/
3. Test at least the homepage and `/contact/`. Expect `School`, `WebSite`, `WebPage`/`ContactPage` and `BreadcrumbList` with no errors.

### B6. Link the Google Business Profile (biggest local-SEO win)
A Business Profile matters more than the website for "schools near me" searches.
1. Go to **https://business.google.com** and claim/verify **Divine Public School** at
   *Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102*.
2. Make sure the details match the website **character for character**:
   - Name: `Divine Public School`
   - Phone: `9953275511` (primary), `9999789418` (secondary)
   - Website: `https://adi049.github.io/DivinePublicSchool/`
3. Add real campus photos, school hours and the category **School / CBSE School**.
4. Verification is usually by postcard, phone or video — this step needs the school's physical address.

### B7. Check progress after 1–3 weeks
- **Indexing → Pages**: how many of the 9 URLs are indexed.
- **Performance**: which queries are showing the site.
- **Experience → Core Web Vitals** and **Mobile Usability**.
- Also run **https://pagespeed.web.dev/** on the homepage.

---

## Part C — Known limitations (please read before judging results)

1. **HashRouter and indexable URLs.**
   Search engines discard everything after `#`, so `…/#/about` can never be a
   separately indexed page. Because the router had to stay as HashRouter, the
   build now also emits a *real* page at `…/about/` (and one per route) with its
   own title, description, canonical, Open Graph and JSON-LD. Opening it boots
   the normal app and jumps straight to that screen — no redirect, no
   duplicate content. These generated pages are what the sitemap lists.
   They are created by `scripts/generate-seo-assets.mjs`, which now runs
   automatically as part of `npm run build`.

2. **`robots.txt` is not actually read at this URL.**
   Crawlers only read `robots.txt` from a domain root — i.e.
   `https://adi049.github.io/robots.txt`, which belongs to the
   `adi049.github.io` user repository, not this project. The file is included
   and correct, and becomes authoritative the moment the site moves to a custom
   domain (e.g. `divinepublicschool.in`). **This does not block indexing** —
   absence of robots.txt means "crawl everything", and the sitemap can still be
   submitted directly in Search Console.

3. **A custom domain is the single biggest upgrade available.**
   A `github.io` sub-path is at a real disadvantage for competitive local
   queries. Buying `divinepublicschool.edu.in` (or similar) and pointing it at
   GitHub Pages would fix caveat 2, allow a Domain property in Search Console,
   and improve trust signals. Only the base URL in `src/data/seo.js` would need
   changing.

4. **`geo` coordinates are deliberately omitted.**
   The school's Plus Code (`937Q+WF9`) is recorded, but exact latitude/longitude
   were not verified, so no `GeoCoordinates` block was invented. To add it:
   open the school on Google Maps, right-click the exact spot, copy the
   coordinates, and add them to `ORG` in `src/data/seo.js`.

5. **No social profiles are declared.**
   `sameAs` is intentionally empty — add official Facebook/Instagram/YouTube
   URLs to `ORG.sameAs` in `src/data/seo.js` when they exist. Unverified links
   would be worse than none.

6. **Nothing was invented.**
   No ratings, reviews, awards, achievements, student counts, affiliation
   numbers or facilities beyond the school's own published list appear in any
   metadata or schema. This is checked by an automated test.

7. **Privacy Policy and Terms pages are `noindex`.**
   They still contain placeholder text. Remove `noindex: true` in
   `src/pages/Legal.jsx` once the school approves real policies.

---

## Part D — Keeping SEO correct when content changes

- All page metadata lives in **one file**: `src/data/seo.js`. Edit titles,
  descriptions and keywords there — the app, the entry pages and the sitemap
  all read from it.
- Run `npm run build` after any change. It regenerates `sitemap.xml`,
  `robots.txt`, `404.html`, the entry pages, and re-syncs the homepage `<head>`.
- To regenerate the SEO files without a full build: `npm run seo`.
- If the deployed URL ever changes, update **`SITE_URL`** in `src/data/seo.js`
  — that one constant drives every canonical, Open Graph URL and sitemap entry.
