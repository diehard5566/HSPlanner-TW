import { create } from 'zustand'
import { NUMBER_SCALES, type NumberScale } from '../utils/compactNumber'
import { readStorage, writeStorage } from '../utils/storage'
import { applyUiZoom, detectUiZoom, isUiZoom, type UiZoom } from '../utils/uiZoom'
import { isLocale, type Locale } from '../localization/locales'

const SETTINGS_KEY = 'hsplanner.settings.v1'

interface SettingsValues {
  autoSave: boolean
  numberScale: NumberScale
  extraCharmSlot: boolean
  uiZoom: UiZoom
  locale: Locale
}

interface SettingsState extends SettingsValues {
  setAutoSave: (autoSave: boolean) => void
  setNumberScale: (numberScale: NumberScale) => void
  setExtraCharmSlot: (extraCharmSlot: boolean) => void
  setUiZoom: (uiZoom: UiZoom) => void
  setLocale: (locale: Locale) => void
}

const DEFAULTS: SettingsValues = {
  autoSave: true,
  numberScale: 'billions',
  extraCharmSlot: true,
  uiZoom: 1,
  locale: 'en',
}

function loadSettings(): SettingsValues {
  const raw = readStorage(SETTINGS_KEY)
  // first run picks a zoom from the display instead of leaving a 1440p/2160p
  // screen at the 100% the rest of the UI was drawn for
  if (!raw) return { ...DEFAULTS, uiZoom: detectUiZoom() }
  try {
    const parsed: unknown = JSON.parse(raw)
    if (typeof parsed !== 'object' || parsed === null) return DEFAULTS
    const o = parsed as Record<string, unknown>
    return {
      autoSave:
        typeof o.autoSave === 'boolean' ? o.autoSave : DEFAULTS.autoSave,
      numberScale: NUMBER_SCALES.includes(o.numberScale as NumberScale)
        ? (o.numberScale as NumberScale)
        : DEFAULTS.numberScale,
      extraCharmSlot:
        typeof o.extraCharmSlot === 'boolean'
          ? o.extraCharmSlot
          : DEFAULTS.extraCharmSlot,
      uiZoom: isUiZoom(o.uiZoom) ? o.uiZoom : DEFAULTS.uiZoom,
      locale: isLocale(o.locale) ? o.locale : DEFAULTS.locale,
    }
  } catch {
    return DEFAULTS
  }
}

function persist(values: SettingsValues): void {
  writeStorage(
    SETTINGS_KEY,
    JSON.stringify({
      autoSave: values.autoSave,
      numberScale: values.numberScale,
      extraCharmSlot: values.extraCharmSlot,
      uiZoom: values.uiZoom,
      locale: values.locale,
    }),
  )
}

export const useSettings = create<SettingsState>((set, get) => ({
  ...loadSettings(),
  setAutoSave: (autoSave) => {
    set({ autoSave })
    persist(get())
  },
  setNumberScale: (numberScale) => {
    set({ numberScale })
    persist(get())
  },
  setExtraCharmSlot: (extraCharmSlot) => {
    set({ extraCharmSlot })
    persist(get())
  },
  setUiZoom: (uiZoom) => {
    set({ uiZoom })
    persist(get())
    applyUiZoom(uiZoom)
  },
  setLocale: (locale) => {
    set({ locale })
    persist(get())
  },
}))

export function initUiZoom(): void {
  applyUiZoom(useSettings.getState().uiZoom)
}
