/**
 * Plain text used in the learning studio and for stable heading anchor ids.
 */
export function cleanStudioText(text) {
  return text
    .replace(/^\s*#{1,6}\s+/gm, '')
    .replace(/^\s*[-*+]\s+/gm, '')
    .replace(/^\s*\d+\.\s+/gm, '')
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/\*([^*]+)\*/g, '$1')
    .replace(/_{1,2}([^_]+)_{1,2}/g, '$1')
    .replace(/\|/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/Â·/g, '·')
    .replace(/â†’/g, '->')
    .replace(/â‰¤/g, '<=')
    .replace(/â‰¥/g, '>=')
    .replace(/â€”|â€“/g, '-')
    .replace(/\s+/g, ' ')
    .trim()
}

function headingSlug(rawHeadingLine) {
  const plain = cleanStudioText(rawHeadingLine)
  const slug = plain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug || 'section'
}

/**
 * Id for a markdown ##+ heading line (first occurrence only — duplicates need {@link createDocHeadingIdFactory}).
 */
export function docHeadingAnchorId(rawHeadingLine) {
  return `doc-section-${headingSlug(rawHeadingLine)}`
}

/**
 * Returns a function that assigns unique `id`s when the same heading text appears more than once in one document.
 */
export function createDocHeadingIdFactory() {
  const counts = new Map()
  return (rawHeadingLine) => {
    const base = headingSlug(rawHeadingLine)
    const n = (counts.get(base) || 0) + 1
    counts.set(base, n)
    if (n === 1) return `doc-section-${base}`
    return `doc-section-${base}--${n}`
  }
}
