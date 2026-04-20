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

/**
 * Id for a markdown ##+ heading line (without leading hashes), aligned with studio walkthrough steps.
 */
export function docHeadingAnchorId(rawHeadingLine) {
  const plain = cleanStudioText(rawHeadingLine)
  const slug = plain
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return `doc-section-${slug || 'section'}`
}
