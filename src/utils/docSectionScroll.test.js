import { describe, expect, it } from 'vitest'
import { parseDocSectionId, pickQueryString } from './docSectionScroll'

describe('parseDocSectionId', () => {
  it('accepts generated markdown heading ids', () => {
    expect(parseDocSectionId('doc-section-representation-atlas-every-surface-in-this-app')).toBe(
      'doc-section-representation-atlas-every-surface-in-this-app',
    )
    expect(parseDocSectionId('doc-section-hello-world--2')).toBe('doc-section-hello-world--2')
  })

  it('rejects empty or unsafe values', () => {
    expect(parseDocSectionId('')).toBe('')
    expect(parseDocSectionId('doc-section-')).toBe('')
    expect(parseDocSectionId('javascript:alert(1)')).toBe('')
    expect(parseDocSectionId('doc-section-<script>')).toBe('')
  })

  it('normalizes array query values', () => {
    expect(parseDocSectionId(['doc-section-foo', 'ignored'])).toBe('doc-section-foo')
  })
})

describe('pickQueryString', () => {
  it('handles scalar and array', () => {
    expect(pickQueryString(undefined)).toBe('')
    expect(pickQueryString('x')).toBe('x')
    expect(pickQueryString(['a', 'b'])).toBe('a')
  })
})
