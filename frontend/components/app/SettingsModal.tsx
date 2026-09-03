import { useEffect } from 'react'
import { Modal } from '../ui/Modal'
import Logo from '../ui/Logo'
import { useSettings } from '../../store/settings'
import {
  NUMBER_SCALES,
  compact,
  type NumberScale,
} from '../../utils/compactNumber'
import { openExternalLink } from '../../utils/externalUrl'
import { inTauriRuntime } from '../../utils/installUpdate'
import { UI_ZOOM_STEPS } from '../../utils/uiZoom'
import { APP_VERSION, GITHUB_REPO } from '../../utils/version'
import { useI18n, type UiKey } from '../../localization/i18n'

const IS_MAC =
  typeof navigator !== 'undefined' && /Mac/i.test(navigator.platform)
const SAVE_SHORTCUT = IS_MAC ? '⌘S' : 'Ctrl+S'

const SCALE_LABEL: Record<NumberScale, UiKey> = {
  none: 'settings.scale.none',
  thousands: 'settings.scale.thousands',
  millions: 'settings.scale.millions',
  billions: 'settings.scale.billions',
}

const SCALE_SAMPLE: Record<NumberScale, string> = {
  none: '12,345',
  thousands: '12.3k',
  millions: '12.3M',
  billions: '12.3B',
}

const PREVIEW_SAMPLES = [45_678, 12_345_678, 2_500_000_000]

interface SettingsModalProps {
  onClose: () => void
}

export default function SettingsModal({ onClose }: SettingsModalProps) {
  const { locale, setLocale, t } = useI18n()
  const autoSave = useSettings((s) => s.autoSave)
  const numberScale = useSettings((s) => s.numberScale)
  const setAutoSave = useSettings((s) => s.setAutoSave)
  const setNumberScale = useSettings((s) => s.setNumberScale)
  const uiZoom = useSettings((s) => s.uiZoom)
  const setUiZoom = useSettings((s) => s.setUiZoom)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <Modal
      onClose={onClose}
      panelClassName="w-[560px] max-w-[92vw] max-h-[86vh]"
      eyebrow={t('settings.eyebrow')}
      title={t('common.settings')}
      titleId="settings-modal-title"
      subtitle={t('settings.subtitle')}
    >
      <div className="flex flex-col gap-6 overflow-y-auto px-6 py-5">
        <Section title={t('settings.saving')}>
          <label className="flex cursor-pointer flex-col gap-1">
            <span className="flex items-center gap-2.5">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="shrink-0"
              />
              <span className="text-[13px] font-semibold text-text">
                {t('settings.autoSave')}
              </span>
            </span>
            <span className="pl-6 text-[12px] leading-snug text-muted">
              {t('settings.autoSaveHelp')}
            </span>
          </label>
          <p
            className={`mt-2 font-mono text-[10px] uppercase tracking-[0.14em] ${
              autoSave ? 'text-faint' : 'text-accent-hot/80'
            }`}
          >
            {autoSave
              ? t('settings.saveInstantly', { shortcut: SAVE_SHORTCUT })
              : t('settings.manualSave', { shortcut: SAVE_SHORTCUT })}
          </p>
        </Section>

        <Section title={t('settings.numbers')}>
          <div className="mb-2 text-[13px] font-semibold text-text">
            {t('settings.largestUnit')}
          </div>
          <div
            role="radiogroup"
            aria-label={t('settings.largestUnitA11y')}
            className="grid grid-cols-4 gap-1.5"
          >
            {NUMBER_SCALES.map((scale) => {
              const active = numberScale === scale
              return (
                <button
                  key={scale}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setNumberScale(scale)}
                  className={`flex flex-col items-center gap-1 rounded-[3px] border px-2 py-2 transition-colors ${
                    active
                      ? 'border-accent-deep text-accent-hot'
                      : 'border-border-2 text-muted hover:border-accent-deep/60 hover:text-text'
                  }`}
                  style={
                    active
                      ? {
                          background:
                            'linear-gradient(180deg, rgba(58,46,24,0.55), rgba(42,36,24,0.35))',
                        }
                      : { background: 'var(--color-panel-2)' }
                  }
                >
                  <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em]">
                    <span
                      aria-hidden
                      className={`inline-block h-1 w-1 rotate-45 ${
                        active ? 'bg-accent-hot' : 'bg-faint'
                      }`}
                      style={
                        active
                          ? { boxShadow: '0 0 6px rgba(224,184,100,0.6)' }
                          : undefined
                      }
                    />
                    {t(SCALE_LABEL[scale])}
                  </span>
                  <span className="font-mono text-[11px] tabular-nums">
                    {SCALE_SAMPLE[scale]}
                  </span>
                </button>
              )
            })}
          </div>
          <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
            {t('settings.preview')} ·{' '}
            <span className="normal-case text-accent-hot/80">
              {PREVIEW_SAMPLES.map((n) => compact(n, numberScale)).join('  ·  ')}
            </span>
          </p>
        </Section>

        {inTauriRuntime() && (
          <Section title={t('settings.display')}>
            <div className="mb-2 text-[13px] font-semibold text-text">
              {t('settings.uiScale')}
            </div>
            <div
              role="radiogroup"
              aria-label={t('settings.uiScale')}
              className="grid grid-cols-6 gap-1.5"
            >
              {UI_ZOOM_STEPS.map((step) => {
                const active = uiZoom === step
                return (
                  <button
                    key={step}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setUiZoom(step)}
                    className={`rounded-[3px] border px-2 py-2 font-mono text-[11px] tabular-nums transition-colors ${
                      active
                        ? 'border-accent-deep text-accent-hot'
                        : 'border-border-2 text-muted hover:border-accent-deep/60 hover:text-text'
                    }`}
                    style={
                      active
                        ? {
                            background:
                              'linear-gradient(180deg, rgba(58,46,24,0.55), rgba(42,36,24,0.35))',
                          }
                        : { background: 'var(--color-panel-2)' }
                    }
                  >
                    {Math.round(step * 100)}%
                  </button>
                )
              })}
            </div>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.14em] text-faint">
              {t('settings.uiScaleHelp')}
            </p>
          </Section>
        )}

        <Section title={t('settings.language')}>
          <div role="radiogroup" aria-label={t('settings.language')} className="grid grid-cols-2 gap-1.5">
            {(['en', 'zh-TW'] as const).map((value) => {
              const active = locale === value
              return (
                <button
                  key={value}
                  type="button"
                  role="radio"
                  aria-checked={active}
                  onClick={() => setLocale(value)}
                  className={`rounded-[3px] border px-3 py-2 text-[12px] transition-colors ${
                    active
                      ? 'border-accent-deep bg-accent-deep/20 text-accent-hot'
                      : 'border-border-2 bg-panel-2 text-muted hover:border-accent-deep/60 hover:text-text'
                  }`}
                >
                  {t(value === 'en' ? 'language.en' : 'language.zhTW')}
                </button>
              )
            })}
          </div>
          <p className="mt-2 text-[12px] leading-snug text-muted">{t('settings.languageHelp')}</p>
        </Section>

        <Section title={t('settings.credits')}>
          <div className="flex items-center gap-2.5">
            <Logo size={20} glow title="HSPlanner" />
            <span
              className="font-mono text-[12px] uppercase tracking-[0.18em] text-accent-hot"
              style={{ textShadow: '0 0 10px rgba(224,184,100,0.25)' }}
            >
              HSPlanner
            </span>
            <span className="rounded-[3px] border border-border-2 px-1.5 py-px font-mono text-[10px] tracking-[0.14em] text-muted">
              v{APP_VERSION}
            </span>
          </div>
          <p className="mt-2 text-[12px] text-muted">
            {t('settings.builtBy', { name: 'zium' })}
          </p>
          <div className="mt-2.5 flex items-center gap-2">
            <ExternalChip
              href="https://ko-fi.com/zium1337"
              label={t('settings.support')}
            />
            <ExternalChip
              href={`https://github.com/${GITHUB_REPO}`}
              label="GitHub"
            />
          </div>
          <p className="mt-3 border-t border-border pt-2.5 font-mono text-[10px] uppercase tracking-[0.14em] leading-relaxed text-faint">
            {t('settings.disclaimer')}
          </p>
        </Section>
      </div>
    </Modal>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section>
      <div className="mb-2.5 flex items-center gap-2 border-b border-accent-deep/20 pb-1.5">
        <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-accent-deep" />
        <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-accent-hot/70">
          {title}
        </span>
      </div>
      {children}
    </section>
  )
}

function ExternalChip({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => openExternalLink(e, href)}
      className="inline-flex items-center gap-1.5 rounded-[3px] border border-accent-deep px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-accent-hot transition-colors hover:border-accent-hot hover:text-[#fff0c4]"
      style={{
        background:
          'linear-gradient(180deg, rgba(58,46,24,0.5), rgba(42,36,24,0.35))',
      }}
    >
      <span aria-hidden className="inline-block h-1 w-1 rotate-45 bg-accent-hot" />
      {label}
    </a>
  )
}
