/**
 * Hash-router friendly section links: use `?section=doc-section-...` (not a second URL `#`).
 */

export function pickQueryString(val) {
  if (val == null || val === '') return ''
  return Array.isArray(val) ? String(val[0] ?? '') : String(val)
}

/** Allowed generated heading ids: doc-section-{slug} or doc-section-{slug}--{n} for duplicates. */
const DOC_SECTION_ID_RE = /^doc-section-[a-z0-9]+(?:-[a-z0-9]+)*(?:--\d+)?$/

export function parseDocSectionId(queryVal) {
  const raw = pickQueryString(queryVal).trim()
  if (!raw || !DOC_SECTION_ID_RE.test(raw)) return ''
  return raw
}

/**
 * @param {{ behavior?: ScrollBehavior }} [opts] — default `smooth`; use `instant` for deterministic deep links.
 */
export function scrollToDocSectionById(id, opts = {}) {
  if (!id) return false
  const el = document.getElementById(id)
  if (!(el instanceof HTMLElement)) return false
  const behavior = opts.behavior ?? 'smooth'
  el.scrollIntoView({ behavior, block: 'start' })
  return true
}
