// ============================================================================
// useSEO — per-page document head management
// ============================================================================
// Handles title, meta description, keywords, canonical, robots directives,
// Open Graph, Twitter Cards and JSON-LD structured data.
//
// Backwards compatible: the original `useSEO(title, description)` signature
// still works, so pages can be upgraded one at a time.
//
//   useSEO('Title', 'Description')                 // legacy
//   useSEO({ page: 'about' })                      // from src/data/seo.js
//   useSEO({ title, description, noindex: true })  // ad-hoc (admin screens)
//
// NOTE ON HASH ROUTING: the app uses HashRouter for GitHub Pages, and search
// engines collapse `#/route` fragments into the site root. Canonical URLs
// therefore point at the crawlable static entry pages emitted by
// scripts/generate-seo-assets.mjs (e.g. /DivinePublicSchool/about/).
// ============================================================================

import { useEffect } from 'react'
import {
  SITE_URL,
  ORG,
  getPageSEO,
  canonicalFor,
  absUrl,
  schemaGraphFor,
} from '../data/seo.js'

const JSONLD_ID = 'dps-structured-data'

/** Create-or-update a <meta> tag. */
function setMeta(selectorAttr, key, content) {
  if (typeof document === 'undefined') return
  const selector = `meta[${selectorAttr}="${key}"]`
  let el = document.head.querySelector(selector)
  if (!content) {
    if (el && el.dataset.seoManaged === 'true') el.remove()
    return
  }
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(selectorAttr, key)
    el.dataset.seoManaged = 'true'
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

const setName = (key, content) => setMeta('name', key, content)
const setProp = (key, content) => setMeta('property', key, content)

/** Create-or-update <link rel="canonical">. */
function setCanonical(href) {
  if (typeof document === 'undefined') return
  let el = document.head.querySelector('link[rel="canonical"]')
  if (!href) {
    if (el) el.remove()
    return
  }
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', 'canonical')
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

/** Replace the page's JSON-LD block. */
function setJsonLd(graph) {
  if (typeof document === 'undefined') return
  const existing = document.getElementById(JSONLD_ID)
  if (!graph || graph.length === 0) {
    if (existing) existing.remove()
    return
  }
  const el = existing || document.createElement('script')
  el.type = 'application/ld+json'
  el.id = JSONLD_ID
  el.textContent = JSON.stringify(graph.length === 1 ? graph[0] : graph)
  if (!existing) document.head.appendChild(el)
}

/**
 * @param {string|object} titleOrOptions
 * @param {string} [legacyDescription]
 */
export default function useSEO(titleOrOptions, legacyDescription) {
  const opts =
    typeof titleOrOptions === 'string'
      ? { title: titleOrOptions, description: legacyDescription }
      : titleOrOptions || {}

  // Resolve a catalogue page (src/data/seo.js) when `page` is given.
  const base = opts.page ? getPageSEO(opts.page) : null

  const title = opts.title || base?.title || ORG.name
  const description = opts.description || base?.description || ''
  const keywords = opts.keywords || base?.keywords || null
  const noindex = Boolean(opts.noindex)
  const canonical =
    opts.canonical || (base ? canonicalFor(base) : noindex ? null : SITE_URL)
  const image = absUrl(opts.image || base?.image || ORG.image)
  const imageAlt = opts.imageAlt || `${ORG.name}, ${ORG.locality}`
  const structured = opts.structuredData ?? (base ? schemaGraphFor(base) : null)

  const keywordsStr = Array.isArray(keywords) ? keywords.join(', ') : keywords || ''
  const graphStr = structured ? JSON.stringify(structured) : ''

  useEffect(() => {
    document.title = title

    setName('description', description)
    setName('keywords', keywordsStr || null)
    setName(
      'robots',
      noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1',
    )
    setCanonical(canonical)

    // --- Open Graph ---------------------------------------------------------
    setProp('og:title', title)
    setProp('og:description', description)
    setProp('og:type', 'website')
    setProp('og:url', canonical || SITE_URL)
    setProp('og:site_name', ORG.name)
    setProp('og:locale', 'en_IN')
    setProp('og:image', image)
    setProp('og:image:alt', imageAlt)

    // --- Twitter Card -------------------------------------------------------
    setName('twitter:card', 'summary_large_image')
    setName('twitter:title', title)
    setName('twitter:description', description)
    setName('twitter:image', image)
    setName('twitter:image:alt', imageAlt)

    // --- Structured data ----------------------------------------------------
    setJsonLd(graphStr ? JSON.parse(graphStr) : null)
  }, [title, description, keywordsStr, noindex, canonical, image, imageAlt, graphStr])
}
