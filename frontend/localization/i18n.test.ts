import { describe, expect, it } from 'vitest'
import { gameSearchText, translateDisplayText, translateGameText } from './game'
import { isLocale, translateUi } from './i18n'
import { translateUiText } from './uiText'

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

  it('translates dynamically assembled item details', () => {
    expect(translateDisplayText('zh-TW', '+38% Attack Damage')).toBe('+38% 攻擊傷害')
    expect(translateDisplayText('zh-TW', 'Hand Axe ×2')).toBe('手斧 ×2')
    expect(translateDisplayText('zh-TW', 'Hand Axe · From Sockets')).toBe('手斧 · 來自插槽')
    expect(translateDisplayText('en', '+38% Attack Damage')).toBe('+38% Attack Damage')
  })

  it('translates shared planner copy and generated counts', () => {
    expect(translateUiText('zh-TW', 'Affixes')).toBe('詞綴')
    expect(translateUiText('zh-TW', '2/4 pieces')).toBe('2/4 件')
  })
})
