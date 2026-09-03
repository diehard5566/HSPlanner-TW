import { describe, expect, it } from 'vitest'
import { parseTranslations } from './parse-translations.mjs'

describe('parseTranslations', () => {
  it('parses pipe data, bracket headers, UTF-8, whitespace, and missing cells', () => {
    const source = [
      '[Items]|[en]|fi|zh',
      ' sword | Sword | | 劍 ',
      'apostrophe|Hero\'s Blade||英雄之刃',
      'missing_zh|English only||',
      'missing_en|||只有中文',
      '||||',
      '[Next Section]|||',
    ].join('\n')
    expect(parseTranslations(source).entries).toEqual([
      { key: 'sword', en: 'Sword', zhTW: '劍' },
      { key: 'apostrophe', en: "Hero's Blade", zhTW: '英雄之刃' },
      { key: 'missing_zh', en: 'English only' },
      { key: 'missing_en', zhTW: '只有中文' },
    ])
  })

  it('keeps the first duplicate and reports malformed rows', () => {
    const result = parseTranslations('|en|zh\na|A|甲\na|B|乙\nb|too short')
    expect(result.entries).toEqual([{ key: 'a', en: 'A', zhTW: '甲' }])
    expect(result.warnings).toHaveLength(2)
  })

  it('fails only when the file has no usable header', () => {
    expect(() => parseTranslations('[Section]\na|A|甲')).toThrow(/header/)
  })
})
