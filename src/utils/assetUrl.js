// ============================================================================
// ASSET URL — makes public/ file references base-path aware
// ============================================================================
// The site deploys to GitHub Pages under the repo sub-path
// (vite.config.js → base: '/DivinePublicSchool/'). import.meta.env.BASE_URL
// is '/DivinePublicSchool/' in production and the same in dev, so wrapping
// every /images/… and /documents/… reference through this helper keeps paths
// correct in both environments.
// ============================================================================

// Optional chaining: under plain Node (service tests) import.meta.env is absent.
const BASE = import.meta.env?.BASE_URL || '/'

export function assetUrl(path) {
  return BASE + String(path).replace(/^\/+/, '')
}
