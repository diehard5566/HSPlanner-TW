import { describe, expect, it } from 'vitest'
import { gameSearchText, translateGameText } from './game'
import { isLocale, translateUi } from './i18n'

describe('UI localization', () => {
  it('supports English, Traditional Chinese, and interpolation', () => {
    expect(translateUi('en', 'nav.skills')).toBe('Skills')
    expect(translateUi('zh-TW', 'nav.skills')).toBe('技能')
    expect(translateUi('zh-TW', 'skills.available', { count: 3 })).toBe('可用 3 點')
  })

  it('rejects unknown locale IDs', () => {
    expect(isLocale('zh-TW')).toBe(true)
    expect(isLocale('zh-CN')).toBe(false)
  })

  it('falls back to the raw key for an unknown UI key', () => {
    expect(translateUi('en', 'unknown.key' as never)).toBe('unknown.key')
  })
})

describe('game localization fallback', () => {
  it('uses CSV Chinese and retains canonical English', () => {
    expect(translateGameText('zh-TW', 'item', { key: 'normal_melee_hand_axe', fallback: 'Hand Axe' })).toBe('手斧')
    expect(translateGameText('en', 'item', { key: 'normal_melee_hand_axe', fallback: 'Hand Axe' })).toBe('Hand Axe')
  })

  it('falls back from Chinese to English and then raw key', () => {
    expect(translateGameText('zh-TW', 'item', { fallback: 'Planner-only item' })).toBe('Planner-only item')
    expect(translateGameText('zh-TW', 'item', { key: 'unknown_key' })).toBe('unknown_key')
  })

  it('builds a bilingual search index in either display locale', () => {
    const options = { key: 'normal_melee_hand_axe', fallback: 'Hand Axe' }
    expect(gameSearchText('en', 'item', options)).toContain('手斧')
    expect(gameSearchText('zh-TW', 'item', options)).toContain('hand axe')
  })
})
