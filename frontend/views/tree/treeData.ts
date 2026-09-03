import { incarnationTree } from '@data'
import { TREE_JEWELRY_IDS, TREE_NODE_INFO } from '../../utils/tree/treeStats'
import type { TooltipTone } from '../../components/tooltipTones'
import { translateGameText } from '../../localization/game'
import { translateUi } from '../../localization/i18n'
import type { Locale } from '../../localization/locales'

export interface TreeNode {
  id: number
  x: number
  y: number
  r: number
  tier: 'minor' | 'notable' | 'keystone'
}

export function tierTone(
  nodeType: string | undefined,
  tier: TreeNode['tier'],
): TooltipTone {
  if (nodeType === 'jewelry') return 'rare'
  if (nodeType === 'warp') return 'rare'
  if (nodeType === 'root') return 'angelic'
  if (nodeType === 'big' || tier === 'keystone' || tier === 'notable') return 'rare'
  return 'neutral'
}

export function tierLabel(
  nodeType: string | undefined,
  tier: TreeNode['tier'],
  locale: Locale = 'en',
): string {
  if (nodeType === 'jewelry') return translateUi(locale, 'tree.jewelrySocket')
  if (nodeType === 'warp') return translateUi(locale, 'tree.warpNode')
  if (nodeType === 'root') return translateUi(locale, 'tree.startingNode')
  if (nodeType === 'big') return translateUi(locale, 'tree.notable')
  if (tier === 'keystone') return translateUi(locale, 'tree.keystone')
  return translateUi(locale, 'tree.minor')
}

export function classifyTier(r: number): TreeNode['tier'] {
  if (r >= 12) return 'keystone'
  if (r >= 10) return 'notable'
  return 'minor'
}

export const NODES: TreeNode[] = incarnationTree.nodes.map((n) => ({
  id: n.id,
  x: n.x,
  y: n.y,
  r: n.r,
  tier: classifyTier(n.r),
}))
export const EDGES: [number, number][] = incarnationTree.edges

export const [vbX = 0, vbY = 0, vbW = 1000, vbH = 800] = incarnationTree.viewBox
  .split(' ')
  .map(Number)

export const SEARCH_INDEX: { id: number; haystack: string }[] = Object.entries(
  TREE_NODE_INFO,
).map(([id, info]) => ({
  id: Number(id),
  haystack: [
    info.t,
    ...info.l,
    info.note ?? '',
    translateGameText('zh-TW', 'ether', { fallback: info.t }),
    ...info.l.map((line) => translateGameText('zh-TW', 'ether', { fallback: line })),
    translateGameText('zh-TW', 'ether', { fallback: info.note ?? '' }),
  ].join(' ').toLowerCase(),
}))

const NODE_ICON_FILES = import.meta.glob<string>(
  '../../assets/atlas/nodes/*.png',
  { eager: true, query: '?url', import: 'default' },
)
const NODE_ICON_URL_BY_KEY: Record<string, string> = {}
for (const [p, url] of Object.entries(NODE_ICON_FILES)) {
  const file = p.split('/').pop() ?? ''
  const key = file.replace(/\.png$/i, '')
  NODE_ICON_URL_BY_KEY[key] = url
}

export const NODE_ICONS: {
  id: number
  x: number
  y: number
  r: number
  href: string
}[] = incarnationTree.nodes.flatMap((n) => {
  const href = NODE_ICON_URL_BY_KEY[n.icon]
  return href ? [{ id: n.id, x: n.x, y: n.y, r: n.r, href }] : []
})

export const JEWELRY_NODES = NODES.filter((n) => TREE_JEWELRY_IDS.has(n.id))

export const NODE_BY_ID = new Map<number, TreeNode>(NODES.map((n) => [n.id, n]))
