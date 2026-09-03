import CharacterBasics from './config/CharacterBasics'
import CharmSlotPanel from './config/CharmSlotPanel'
import { GroupHeading } from './config/configPrimitives'
import ActiveBuffsPanel from './config/ActiveBuffsPanel'
import ActiveAuraPanel from './config/ActiveAuraPanel'
import ProcsPanel from './config/ProcsPanel'
import EnemyConditionsPanel from './config/EnemyConditionsPanel'
import PlayerConditionsPanel from './config/PlayerConditionsPanel'
import ItemBlessingsPanel from './config/ItemBlessingsPanel'
import ResistancesPanel from './config/ResistancesPanel'
import SkillProjectilesPanel from './config/SkillProjectilesPanel'
import EntityRatePanel from './config/EntityRatePanel'
import CustomStatsPanel from './config/CustomStatsPanel'
import { useI18n } from '../localization/i18n'

export default function ConfigView() {
  const { t } = useI18n()
  return (
    <div className="space-y-8">
      <header>
        <div className="mb-1 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
          <span
            aria-hidden
            className="inline-block h-1.5 w-1.5 rotate-45 bg-accent-hot"
            style={{ boxShadow: '0 0 8px rgba(224,184,100,0.6)' }}
          />
          Setup · character & encounter
        </div>
        <h2
          className="m-0 text-[22px] font-semibold tracking-[0.02em] text-accent-hot"
          style={{ textShadow: '0 0 16px rgba(224,184,100,0.18)' }}
        >
          {t('nav.config')}
        </h2>
      </header>

      <section className="space-y-4">
        <GroupHeading
          title={t('config.character')}
          subtitle={t('config.characterHelp')}
        />
        <CharacterBasics />
        <CharmSlotPanel />
      </section>

      <section className="space-y-4">
        <GroupHeading
          title={t('config.combat')}
          subtitle={t('config.combatHelp')}
        />

        <div className="grid items-start gap-4 xl:grid-cols-2">
          <div className="space-y-4">
            <ActiveBuffsPanel />
            <ActiveAuraPanel />
            <ProcsPanel />
            <ItemBlessingsPanel />
            <EntityRatePanel />
          </div>
          <div className="space-y-4">
            <EnemyConditionsPanel />
            <PlayerConditionsPanel />
            <ResistancesPanel />
            <SkillProjectilesPanel />
            <CustomStatsPanel />
          </div>
        </div>
      </section>
    </div>
  )
}
