import { describe, expect, it } from 'vitest'
import {
  actionOpts,
  castSlotAxes,
  characterOpts,
  streamOpts,
  timeOpts,
} from './castLexicon'

describe('castLexicon', () => {
  it('has four options per slot and unique bit codes', () => {
    for (const [name, rows] of Object.entries({
      characterOpts,
      actionOpts,
      streamOpts,
      timeOpts,
    })) {
      expect(rows, name).toHaveLength(4)
      const bits = rows.map((r) => r.bits)
      expect(new Set(bits).size).toBe(4)
      rows.forEach((r) => {
        expect(r.pickWhen && r.pickWhen.length > 12, `${name} ${r.bits}`).toBe(true)
      })
    }
  })

  it('exposes axis captions for the studio', () => {
    expect(castSlotAxes.character.caption).toMatch(/WHO/i)
    expect(castSlotAxes.action.caption).toMatch(/HOW/i)
    expect(castSlotAxes.stream.caption).toMatch(/WHAT/i)
    expect(castSlotAxes.time.caption).toMatch(/WHEN/i)
  })
})
