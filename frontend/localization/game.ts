import { useSettings } from '../store/settings'
import { GAME_TRANSLATIONS, type GameTranslationNamespace } from './gameTranslations.generated'
import type { Locale } from './locales'

type RuntimeNamespace = {
  byKey: Record<string, readonly [string, string]>
  byEnglish: Record<string, string>
}

function normalizeEnglish(value: string): string {
  return value.normalize('NFKC').trim().replace(/\s+/g, ' ').toLocaleLowerCase('en-US')
}

export interface GameTextOptions {
  key?: string
  fallback?: string
}

export function translateGameText(locale: Locale, namespace: GameTranslationNamespace, options: GameTextOptions): string {
  const table = GAME_TRANSLATIONS[namespace] as RuntimeNamespace
  const keyed = options.key ? table.byKey[options.key] : undefined
  const english = options.fallback || keyed?.[0] || options.key || ''
  if (locale === 'en') return english
  return keyed?.[1] || table.byEnglish[normalizeEnglish(english)] || keyed?.[0] || english
}

export function gameSearchText(locale: Locale, namespace: GameTranslationNamespace, options: GameTextOptions): string {
  const canonical = options.fallback ?? options.key ?? ''
  const english = translateGameText('en', namespace, options)
  const traditionalChinese = translateGameText('zh-TW', namespace, options)
  return `${canonical} ${english} ${traditionalChinese}`.toLocaleLowerCase(locale)
}

const DISPLAY_NAMESPACES: GameTranslationNamespace[] = [
  'item', 'attribute', 'talent', 'subTalent', 'ether', 'main', 'relic', 'enemy', 'zone',
]

export function translateGameTextAny(locale: Locale, fallback: string): string {
  if (locale === 'en') return fallback
  for (const namespace of DISPLAY_NAMESPACES) {
    const translated = translateGameText(locale, namespace, { fallback })
    if (translated !== fallback) return translated
  }
  return fallback
}

export function gameSearchTextAny(locale: Locale, fallback: string): string {
  const values = [fallback]
  for (const namespace of DISPLAY_NAMESPACES) {
    const translated = translateGameText('zh-TW', namespace, { fallback })
    if (translated !== fallback) values.push(translated)
  }
  return values.join(' ').toLocaleLowerCase(locale)
}

export function useGameTranslations() {
  const locale = useSettings((state) => state.locale)
  return {
    locale,
    game: (namespace: GameTranslationNamespace, options: GameTextOptions) => translateGameText(locale, namespace, options),
    gameAny: (fallback: string) => translateGameTextAny(locale, fallback),
    searchText: (namespace: GameTranslationNamespace, options: GameTextOptions) => gameSearchText(locale, namespace, options),
    searchAny: (fallback: string) => gameSearchTextAny(locale, fallback),
  }
}
