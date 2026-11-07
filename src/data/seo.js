// ============================================================================
// SEO CONFIGURATION — single source of truth for all page metadata
// ============================================================================
// Pure data + pure functions ONLY (no React, no import.meta) so that:
//   • the React app can import it (src/hooks/useSEO.js)
//   • plain Node can import it (scripts/generate-seo-assets.mjs) to emit
//     sitemap.xml, robots.txt and the static crawlable entry pages.
//
// All factual details below are the school's verified information taken from
// src/data/school.js. Nothing here invents ratings, reviews, awards,
// affiliations, student numbers or facilities.
// ============================================================================

/** Deployed site root — MUST end with a trailing slash. */
export const SITE_URL = 'https://adi049.github.io/DivinePublicSchool/'

/** Verified school details (kept in sync with src/data/school.js). */
export const ORG = {
  name: 'Divine Public School',
  legalName: 'Divine Public School',
  board: 'CBSE',
  street: 'Nayagaon Rd, Vatika Kunj Extension',
  locality: 'Gurugram',
  region: 'Haryana',
  postalCode: '122102',
  country: 'IN',
  addressFull: 'Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102',
  phones: ['+91-9953275511', '+91-9999789418'],
  email: 'divinepublicschool2003@gmail.com',
  mapsUrl:
    'https://www.google.com/maps/search/?api=1&query=Divine%20public%20school%20937Q%2BWF9%2C%20Nayagaon%20Rd%2C%20Vatika%20Kunj%20Extension%2C%20Gurugram%2C%20Haryana%20122102%2C%20India',
  plusCode: '937Q+WF9',
  logo: 'images/school-logo.png',
  image: 'images/hero-campus.jpg',
  // Areas the school realistically serves — used for areaServed + local SEO copy.
  areaServed: [
    'Vatika Kunj Extension',
    'Nayagaon Road',
    'Nayagaon',
    'Gurugram',
    'Gurgaon',
    'Haryana',
  ],
  // Social profiles are deliberately empty: only add VERIFIED official links.
  sameAs: [],
}

const BRAND = 'Divine Public School'

/**
 * Per-page SEO records.
 *   key        – internal id
 *   route      – HashRouter path inside the SPA (what React Router sees)
 *   slug       – crawlable static entry-page folder ('' = site root)
 *   title      – unique <title>
 *   description– unique meta description (~150–160 chars)
 *   keywords   – target queries for this page (informational, used in
 *                `keywords` meta + the static page copy — never stuffed)
 *   heading    – the page's real H1 (mirrors what the SPA renders)
 *   image      – OG/Twitter image (path relative to site root)
 *   intro      – short, factual copy for the static entry page
 *   crumb      – breadcrumb label (omit for Home)
 *   schema     – extra JSON-LD type for the page ('ContactPage' etc.)
 */
export const PAGES = [
  {
    key: 'home',
    route: '/',
    slug: '',
    title: 'Divine Public School | CBSE School, Vatika Kunj, Gurugram',
    description:
      'CBSE school on Nayagaon Rd, Vatika Kunj Extension, Gurugram. Divine Public School teaches Nursery to Class XII. Admission enquiries open for 2026–27.',
    keywords: [
      'Divine Public School',
      'Divine Public School Gurgaon',
      'Divine Public School Gurugram',
      'CBSE school in Gurugram',
      'CBSE school in Gurgaon',
      'schools near Vatika Kunj',
      'schools near Nayagaon Gurgaon',
      'school in Gurugram Haryana',
    ],
    heading: 'Divine Public School',
    image: 'images/hero-campus.jpg',
    intro:
      'Divine Public School is a CBSE-curriculum school on Nayagaon Road, Vatika Kunj Extension, Gurugram, Haryana 122102. The school runs classes from Nursery to Class XII, with Science, Commerce and Humanities streams at the senior secondary level.',
  },
  {
    key: 'about',
    route: '/about',
    slug: 'about',
    crumb: 'About Us',
    title: 'About Our School | Divine Public School, Gurugram',
    description:
      'About Divine Public School, Gurugram — vision, mission, facilities and the Director’s message from our CBSE school on Nayagaon Road, Vatika Kunj Extension.',
    keywords: [
      'about Divine Public School',
      'Divine Public School Gurugram',
      'CBSE school in Gurugram',
      'school facilities Gurugram',
      'schools near Vatika Kunj Extension',
    ],
    heading: 'About Our School',
    image: 'images/about-building.jpg',
    intro:
      'Learn about Divine Public School, Gurugram — our vision and mission, educational philosophy, campus facilities, and the Director’s message. The school follows the CBSE curriculum pattern from Nursery to Class XII.',
  },
  {
    key: 'admissions',
    route: '/admissions',
    slug: 'admissions',
    crumb: 'Admissions',
    title: 'Admissions 2026–27 | Divine Public School, Gurugram',
    description:
      'Admission enquiries open for 2026–27 at Divine Public School, Gurugram. Nursery admission to Class XII, CBSE pattern. Call, WhatsApp or enquire online.',
    keywords: [
      'admission open in Gurgaon',
      'nursery admission in Gurgaon',
      'nursery admission in Gurugram',
      'CBSE school admission Gurugram',
      'school admission Vatika Kunj Extension',
      'Divine Public School admission',
    ],
    heading: 'Admissions 2026–27',
    image: 'images/gallery/building-main.jpg',
    intro:
      'Admission enquiries for the 2026–27 session are welcome at Divine Public School, Nayagaon Road, Vatika Kunj Extension, Gurugram. The school admits students from Nursery through to Class XII under the CBSE pattern. Parents may enquire by phone, WhatsApp or the enquiry form on the website.',
  },
  {
    key: 'curriculum',
    route: '/curriculum',
    slug: 'curriculum',
    crumb: 'Curriculum',
    title: 'CBSE Curriculum, Nursery to XII | Divine Public School',
    description:
      'Class-wise CBSE curriculum at Divine Public School, Gurugram — subjects, timetables and date sheets for Nursery to Class XII, plus senior secondary streams.',
    keywords: [
      'CBSE curriculum Gurugram',
      'primary school in Gurugram',
      'CBSE school in Gurgaon',
      'class wise subjects CBSE',
      'Science Commerce Humanities streams Gurugram',
    ],
    heading: 'Academic Curriculum',
    image: 'images/gallery/building-front.jpg',
    intro:
      'The class-wise academic curriculum at Divine Public School, Gurugram, follows the CBSE pattern from Nursery to Class XII. Each class page lists its subjects, timetable and examination date sheet, with Science, Commerce and Humanities streams available at the senior secondary level.',
  },
  {
    key: 'timetable',
    route: '/curriculum?tab=timetable',
    slug: 'timetable',
    crumb: 'Timetable',
    title: 'Class Timetables | Divine Public School, Gurugram',
    description:
      'Class timetables published by the school office of Divine Public School, Gurugram — Nursery to Class XII, with stream-wise timetables for Classes 11 and 12.',
    keywords: [
      'school timetable Gurugram',
      'class timetable CBSE school',
      'Divine Public School timetable',
      'CBSE school in Gurugram',
    ],
    heading: 'Class Timetables',
    image: 'images/gallery/building-front.jpg',
    intro:
      'Class timetables for Divine Public School, Gurugram, are published by the school office. Choose a class from Nursery to Class XII to view its current timetable; Classes 11 and 12 are available stream-wise for Science, Commerce and Humanities.',
  },
  {
    key: 'date-sheets',
    route: '/curriculum?tab=datesheet',
    slug: 'date-sheets',
    crumb: 'Date Sheets',
    title: 'Examination Date Sheets | Divine Public School, Gurugram',
    description:
      'Examination date sheets from the school office of Divine Public School, Gurugram. View or download the current date sheet for each class, Nursery to XII.',
    keywords: [
      'exam date sheet CBSE school Gurugram',
      'Divine Public School date sheet',
      'examination schedule Gurugram school',
    ],
    heading: 'Examination Date Sheets',
    image: 'images/gallery/building-front.jpg',
    intro:
      'Examination date sheets for Divine Public School, Gurugram, are published by the school office. Each class from Nursery to Class XII has its own date sheet, which parents and students can view or download from the curriculum page.',
  },
  {
    key: 'gallery',
    route: '/gallery',
    slug: 'gallery',
    crumb: 'Gallery',
    title: 'School Gallery | Divine Public School, Gurugram',
    description:
      'Photographs of Divine Public School, Gurugram — the Nayagaon Road campus, classrooms, playground, school transport and festival celebrations.',
    keywords: [
      'Divine Public School photos',
      'school campus Gurugram',
      'CBSE school gallery Gurugram',
      'school celebrations Gurugram',
    ],
    heading: 'School Gallery',
    image: 'images/gallery/campus-lawn.jpg',
    intro:
      'A photo gallery of Divine Public School, Nayagaon Road, Vatika Kunj Extension, Gurugram — the campus, classrooms, playground, school transport and festival celebrations held through the school year.',
  },
  {
    key: 'contact',
    route: '/contact',
    slug: 'contact',
    crumb: 'Contact Us',
    schema: 'ContactPage',
    title: 'Contact Us | Divine Public School, Vatika Kunj, Gurugram',
    description:
      'Contact Divine Public School, Nayagaon Rd, Vatika Kunj Extension, Gurugram 122102. Call 9953275511 or 9999789418, or send an enquiry online.',
    keywords: [
      'Divine Public School contact number',
      'school near Nayagaon Road Gurgaon',
      'schools near Vatika Kunj',
      'CBSE school address Gurugram',
    ],
    heading: 'Contact Us',
    image: 'images/gallery/building-main.jpg',
    intro:
      'Divine Public School is located at Nayagaon Rd, Vatika Kunj Extension, Gurugram, Haryana 122102. The school office can be reached on 9953275511 or 9999789418, or by email at divinepublicschool2003@gmail.com. Please call before planning a visit.',
  },
  {
    key: 'mandatory-disclosure',
    route: '/mandatory-disclosure',
    slug: 'mandatory-disclosure',
    crumb: 'Mandatory Disclosure',
    title: 'Mandatory Public Disclosure | Divine Public School',
    description:
      'Mandatory public disclosure of Divine Public School, Gurugram — general information, documents and certificates, and the academic calendar, per CBSE norms.',
    keywords: [
      'mandatory public disclosure CBSE',
      'Divine Public School disclosure',
      'school documents Gurugram',
    ],
    heading: 'Mandatory Public Disclosure',
    image: 'images/about-building.jpg',
    intro:
      'Mandatory public disclosure information for Divine Public School, Gurugram, including general school information, documents and certificates, and the academic calendar, published in line with CBSE norms.',
  },
]

// Pages that exist in the SPA but should NOT be advertised to search engines.
export const NOINDEX_ROUTES = ['/admin', '/privacy-policy', '/terms-and-conditions']

/** Look up a page record by its key. */
export function getPageSEO(key) {
  return PAGES.find((p) => p.key === key) || PAGES[0]
}

/** Absolute URL for a site-relative path ('' → site root). */
export function absUrl(path = '') {
  const clean = String(path).replace(/^\/+/, '')
  if (!clean) return SITE_URL
  return SITE_URL + clean
}

/** Canonical URL for a page record (the crawlable static entry URL). */
export function canonicalFor(page) {
  return page.slug ? `${SITE_URL}${page.slug}/` : SITE_URL
}

/** In-app hash URL that actually renders the page in the SPA. */
export function hashUrlFor(page) {
  return `${SITE_URL}#${page.route}`
}

// ---------------------------------------------------------------------------
// JSON-LD builders
// ---------------------------------------------------------------------------

/** The school itself — School is a subtype of EducationalOrganization. */
export function schoolSchema() {
  const node = {
    '@context': 'https://schema.org',
    '@type': 'School',
    '@id': `${SITE_URL}#school`,
    name: ORG.name,
    alternateName: `${ORG.name}, Gurugram`,
    description: `${ORG.name} is a ${ORG.board}-curriculum school on ${ORG.street}, ${ORG.locality}, ${ORG.region}, offering classes from Nursery to Class XII.`,
    url: SITE_URL,
    logo: absUrl(ORG.logo),
    image: absUrl(ORG.image),
    telephone: ORG.phones[0],
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      streetAddress: ORG.street,
      addressLocality: ORG.locality,
      addressRegion: ORG.region,
      postalCode: ORG.postalCode,
      addressCountry: ORG.country,
    },
    contactPoint: ORG.phones.map((tel) => ({
      '@type': 'ContactPoint',
      telephone: tel,
      contactType: 'admissions',
      email: ORG.email,
      areaServed: 'IN',
      availableLanguage: ['en', 'hi'],
    })),
    areaServed: ORG.areaServed.map((name) => ({ '@type': 'Place', name })),
    hasMap: ORG.mapsUrl,
    // Curriculum/board stated as a plain, verifiable property — no claims of
    // affiliation numbers, ratings, awards or achievements.
    knowsAbout: `${ORG.board} curriculum, Nursery to Class XII`,
  }
  if (ORG.sameAs.length) node.sameAs = ORG.sameAs
  return node
}

/** Site-level WebSite node. */
export function websiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${SITE_URL}#website`,
    url: SITE_URL,
    name: ORG.name,
    inLanguage: 'en-IN',
    publisher: { '@id': `${SITE_URL}#school` },
  }
}

/** Breadcrumb trail for an inner page. */
export function breadcrumbSchema(page) {
  if (!page.slug) return null
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      { '@type': 'ListItem', position: 1, name: 'Home', item: SITE_URL },
      { '@type': 'ListItem', position: 2, name: page.crumb || page.heading, item: canonicalFor(page) },
    ],
  }
}

/** Per-page WebPage/ContactPage node. */
export function webPageSchema(page) {
  return {
    '@context': 'https://schema.org',
    '@type': page.schema || 'WebPage',
    '@id': `${canonicalFor(page)}#webpage`,
    url: canonicalFor(page),
    name: page.title,
    description: page.description,
    inLanguage: 'en-IN',
    isPartOf: { '@id': `${SITE_URL}#website` },
    about: { '@id': `${SITE_URL}#school` },
    primaryImageOfPage: absUrl(page.image),
  }
}

/** Everything a given page should emit, in order. */
export function schemaGraphFor(page) {
  const graph = [schoolSchema(), websiteSchema(), webPageSchema(page)]
  const crumbs = breadcrumbSchema(page)
  if (crumbs) graph.push(crumbs)
  return graph
}
