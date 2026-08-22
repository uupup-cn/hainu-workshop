import { describe, expect, it } from 'vitest'
import { buildCanonicalQuery } from './api-security'

describe('api security canonical query', () => {
  it('matches axios query serialization by omitting nullish params', () => {
    expect(
      buildCanonicalQuery({
        current: 1,
        size: 20,
        name: undefined,
        startTime: null,
        endTime: null
      })
    ).toBe('current=1&size=20')
  })

  it('keeps empty string params because they are sent in the URL', () => {
    expect(
      buildCanonicalQuery({
        current: 1,
        keyword: ''
      })
    ).toBe('current=1&keyword=')
  })
})
