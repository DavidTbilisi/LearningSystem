import { describe, expect, it } from 'vitest'
import { createDocHeadingIdFactory, docHeadingAnchorId } from './markdownPlain'

describe('createDocHeadingIdFactory', () => {
  it('assigns stable ids and dedupes repeated headings', () => {
    const next = createDocHeadingIdFactory()
    expect(next('Hello World')).toBe('doc-section-hello-world')
    expect(next('Hello World')).toBe('doc-section-hello-world--2')
    expect(next('Other')).toBe('doc-section-other')
  })

  it('matches docHeadingAnchorId for the first occurrence', () => {
    const line = 'CAST overview'
    const next = createDocHeadingIdFactory()
    expect(next(line)).toBe(docHeadingAnchorId(line))
  })
})
