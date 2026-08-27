import type { IconName } from '@/components/icons'

/** 工具 toolKey → Lucide 图标（替代后端可能下发的 emoji，全站禁用表情符号） */
const TOOL_ICONS: Record<string, IconName> = {
  dice: 'tool-dice',
  calculator: 'tool-calculator',
  'id-photo': 'tool-camera',
  'video-parse': 'tool-play',
  wheel: 'tool-wheel',
  schulte: 'tool-timer',
  sbti: 'module-faq',
  mbti: 'module-faq',
  'dark-triad': 'module-faq',
  'seven-sins': 'module-faq',
}

export function iconForTool(key?: string): IconName {
  return (key && TOOL_ICONS[key]) || 'module-tools'
}
