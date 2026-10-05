import { useEffect } from 'react'

/**
 * Sets the document title and meta description for each page.
 * @param {string} title - Page title (shown in the browser tab).
 * @param {string} description - Meta description for the page.
 */
export default function useSEO(title, description) {
  useEffect(() => {
    document.title = title
    const meta = document.querySelector('meta[name="description"]')
    if (meta && description) meta.setAttribute('content', description)
  }, [title, description])
}
