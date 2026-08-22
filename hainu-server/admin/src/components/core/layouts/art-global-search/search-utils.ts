import { pinyin } from 'pinyin-pro'
import { AppRouteRecord } from '@/types/router'
import { formatMenuTitle } from '@/utils/router'
import { stringifyQuery } from 'vue-router'
import { globalSearchQuickActions, globalSearchTitleSynonyms } from '@/config/modules/globalSearch'

export interface SearchHighlightRange {
  start: number
  end: number
}

/** 展示层使用的搜索结果项，包含导航信息、匹配信息和高亮范围。 */
export interface SearchMenuItem {
  key: string
  kind: 'menu' | 'action'
  route: AppRouteRecord
  navigatePath: string
  usageKey: string
  title: string
  pathLabel: string
  fullPathTitles: string[]
  aliases: string[]
  pinyin: string
  initials: string
  score: number
  matchLabel?: string
  titleHighlight?: SearchHighlightRange
  pathHighlight?: SearchHighlightRange
}

/** 内部索引结构，预先存储归一化字段，减少每次搜索时的重复计算。 */
interface IndexedMenuItem {
  key: string
  kind: 'menu' | 'action'
  route: AppRouteRecord
  navigatePath: string
  usageKey: string
  title: string
  normalizedTitle: string
  pathLabel: string
  normalizedPathLabel: string
  fullPathTitles: string[]
  aliases: string[]
  normalizedAliases: string[]
  pinyin: string
  initials: string
}

const indexedMenuCache = new WeakMap<AppRouteRecord[], IndexedMenuItem[]>()
const searchMenuIndexCache = new WeakMap<AppRouteRecord[], SearchMenuItem[]>()

/** 路由 path 为空时使用外链地址兜底，保证搜索 key 稳定。 */
export const getRouteSearchKey = (item: AppRouteRecord): string =>
  item.path || String(item.meta.link || '')

/** 构建用于默认展示的菜单索引，不做关键词打分。 */
export const buildSearchMenuIndex = (items: AppRouteRecord[]): SearchMenuItem[] =>
  getSearchMenuIndex(items)

/** 根据关键词搜索菜单和快捷操作，并按匹配度、使用频次排序。 */
export const searchMenuItems = (
  items: AppRouteRecord[],
  keyword: string,
  usageMap: Record<string, number> = {}
): SearchMenuItem[] => {
  const normalizedKeyword = normalizeSearchText(keyword)

  if (!normalizedKeyword) {
    return []
  }

  return getIndexedMenuItems(items)
    .map((item) => scoreMenuItem(item, normalizedKeyword, usageMap[item.key] ?? 0))
    .filter((item): item is SearchMenuItem => item !== null)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-Hans-CN'))
}

/** 根据历史使用次数返回常用菜单，通常用于搜索框空状态推荐。 */
export const getFrequentMenuItems = (
  items: AppRouteRecord[],
  usageMap: Record<string, number> = {},
  limit: number = 6
): SearchMenuItem[] =>
  buildSearchMenuIndex(items)
    .map((item) => ({
      ...item,
      score: usageMap[item.key] ?? 0
    }))
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score || a.title.localeCompare(b.title, 'zh-Hans-CN'))
    .slice(0, limit)

/** 将路由树拍平为可搜索索引，同时为有权限的目标菜单补充快捷操作项。 */
const indexMenuItems = (items: AppRouteRecord[]): IndexedMenuItem[] => {
  const result: IndexedMenuItem[] = []
  const menuByPath = new Map<string, { route: AppRouteRecord; titles: string[] }>()

  const walk = (item: AppRouteRecord, parents: string[]) => {
    // 隐藏菜单不进入全局搜索，也不会作为快捷操作的挂载目标。
    if (item.meta?.isHide) {
      return
    }

    const title = formatMenuTitle(item.meta?.title || '')
    const currentTitles = title ? [...parents, title] : parents

    if (item.children?.length) {
      item.children.forEach((child) => walk(child, currentTitles))
    }

    if (!isNavigable(item) || !title) {
      return
    }

    // 索引阶段一次性生成标题、路径、拼音、首字母等检索字段。
    const aliases = buildAliases(title)
    const key = getRouteSearchKey(item)
    const fullPinyin = normalizeSearchText(pinyin(title, { toneType: 'none' }))
    const initials = normalizeSearchText(pinyin(title, { toneType: 'none', pattern: 'first' }))
    const pathLabel = currentTitles.join(' / ')
    const cleanedRoute = { ...item, children: undefined }

    menuByPath.set(item.path, {
      route: cleanedRoute,
      titles: currentTitles
    })

    result.push({
      key,
      kind: 'menu',
      route: cleanedRoute,
      navigatePath: item.path,
      usageKey: key,
      title,
      normalizedTitle: normalizeSearchText(title),
      pathLabel,
      normalizedPathLabel: normalizeSearchText(pathLabel),
      fullPathTitles: currentTitles,
      aliases,
      normalizedAliases: aliases.map(normalizeSearchText),
      pinyin: fullPinyin,
      initials
    })
  }

  items.forEach((item) => walk(item, []))
  globalSearchQuickActions.forEach((action) => {
    // 快捷操作必须依附在真实菜单上，否则无法拿到目标路由和权限信息。
    const targetMenu = menuByPath.get(action.path)
    if (!targetMenu) {
      return
    }

    // 只有目标菜单声明了对应权限按钮时，才允许在搜索里暴露该快捷操作。
    const authList = Array.isArray(targetMenu.route.meta?.authList)
      ? targetMenu.route.meta.authList
      : []
    const hasRequiredAuth = authList.some((auth) => auth?.authMark === action.requiredAuthMark)
    if (!hasRequiredAuth) {
      return
    }

    // action 项复用菜单路由，通过 navigatePath 的 query 触发页面内弹窗。
    const aliases = [...action.aliases, `${action.parentTitle}${action.title}`]
    const navigatePath = buildNavigatePath(action.path, action.query)
    const fullPathTitles = [...targetMenu.titles, '快捷操作']

    result.push({
      key: action.key,
      kind: 'action',
      route: targetMenu.route,
      navigatePath,
      usageKey: action.key,
      title: action.title,
      normalizedTitle: normalizeSearchText(action.title),
      pathLabel: fullPathTitles.join(' / '),
      normalizedPathLabel: normalizeSearchText(fullPathTitles.join(' / ')),
      fullPathTitles,
      aliases,
      normalizedAliases: aliases.map(normalizeSearchText),
      pinyin: normalizeSearchText(pinyin(action.title, { toneType: 'none' })),
      initials: normalizeSearchText(pinyin(action.title, { toneType: 'none', pattern: 'first' }))
    })
  })

  return dedupeByKey(result)
}

const getIndexedMenuItems = (items: AppRouteRecord[]) => {
  const cached = indexedMenuCache.get(items)
  if (cached) {
    return cached
  }

  const indexedItems = indexMenuItems(items)
  indexedMenuCache.set(items, indexedItems)
  return indexedItems
}

const getSearchMenuIndex = (items: AppRouteRecord[]) => {
  const cached = searchMenuIndexCache.get(items)
  if (cached) {
    return cached
  }

  const menuIndex = getIndexedMenuItems(items).map((item) => ({
    key: item.key,
    kind: item.kind,
    route: item.route,
    navigatePath: item.navigatePath,
    usageKey: item.usageKey,
    title: item.title,
    pathLabel: item.pathLabel,
    fullPathTitles: item.fullPathTitles,
    aliases: item.aliases,
    pinyin: item.pinyin,
    initials: item.initials,
    score: 0
  }))

  searchMenuIndexCache.set(items, menuIndex)
  return menuIndex
}

/** 路由 key 重复时保留最后一次索引结果，避免列表展示重复项。 */
const dedupeByKey = (items: IndexedMenuItem[]): IndexedMenuItem[] => {
  const map = new Map<string, IndexedMenuItem>()
  items.forEach((item) => {
    if (item.key) {
      map.set(item.key, item)
    }
  })
  return [...map.values()]
}

/** 根据菜单标题补充业务同义词，并把“xx管理”简化成“xx”作为别名。 */
const buildAliases = (title: string): string[] => {
  const aliasSet = new Set<string>()

  globalSearchTitleSynonyms.forEach(({ keyword, aliases }) => {
    if (title.includes(keyword)) {
      aliases.forEach((alias) => aliasSet.add(alias))
    }
  })

  if (title.endsWith('管理')) {
    aliasSet.add(title.replace(/管理$/, ''))
  }

  return [...aliasSet]
}

/**
 * 计算单个索引项的匹配分数。
 *
 * 精确标题 > 路径 > 别名 > 首字母/拼音 > 模糊匹配；快捷操作略降权，使用频次补充加权。
 */
const scoreMenuItem = (
  item: IndexedMenuItem,
  keyword: string,
  usageCount: number
): SearchMenuItem | null => {
  const titleMatch = getContainsMatch(item.normalizedTitle, keyword)
  const pathMatch = getContainsMatch(item.normalizedPathLabel, keyword)
  const aliasMatch = item.normalizedAliases.find((alias) => alias.includes(keyword))
  const pinyinMatch = getContainsMatch(item.pinyin, keyword)
  const initialsMatch = getContainsMatch(item.initials, keyword)
  const fuzzyTitleMatch = matchSubsequence(item.normalizedTitle, keyword)
  const fuzzyAliasMatch = item.normalizedAliases.find((alias) => matchSubsequence(alias, keyword))
  const fuzzyPinyinMatch = matchSubsequence(item.pinyin, keyword)

  let score = 0
  let matchLabel = ''

  // 按匹配质量从高到低命中首个分支，避免弱匹配覆盖更准确的结果。
  if (titleMatch !== -1) {
    score += 120
    matchLabel = item.title
  } else if (pathMatch !== -1) {
    score += 90
    matchLabel = item.pathLabel
  } else if (aliasMatch) {
    score += 80
    matchLabel = restoreAliasLabel(item.aliases, item.normalizedAliases, aliasMatch)
  } else if (initialsMatch !== -1) {
    score += 75
    matchLabel = item.initials
  } else if (pinyinMatch !== -1) {
    score += 70
    matchLabel = item.pinyin
  } else if (fuzzyTitleMatch) {
    score += 55
    matchLabel = item.title
  } else if (fuzzyAliasMatch) {
    score += 45
    matchLabel = restoreAliasLabel(item.aliases, item.normalizedAliases, fuzzyAliasMatch)
  } else if (fuzzyPinyinMatch) {
    score += 40
    matchLabel = item.pinyin
  } else {
    return null
  }

  // 快捷操作比菜单更具体，略微降权可以避免它抢占同名菜单的首位。
  if (item.kind === 'action') {
    score -= 15
  }

  // 使用频次只做小幅加权，防止历史记录压过明显更准确的搜索结果。
  score += Math.min(usageCount * 5, 30)

  return {
    key: item.key,
    kind: item.kind,
    route: item.route,
    navigatePath: item.navigatePath,
    usageKey: item.usageKey,
    title: item.title,
    pathLabel: item.pathLabel,
    fullPathTitles: item.fullPathTitles,
    aliases: item.aliases,
    pinyin: item.pinyin,
    initials: item.initials,
    score,
    matchLabel,
    titleHighlight: getHighlightRange(item.title, keyword),
    pathHighlight: getHighlightRange(item.pathLabel, keyword)
  }
}

/** 根据归一化后的别名命中值，还原成原始展示文案。 */
const restoreAliasLabel = (aliases: string[], normalizedAliases: string[], match: string) => {
  const matchedIndex = normalizedAliases.findIndex((alias) => alias.includes(match))
  return matchedIndex >= 0 ? aliases[matchedIndex] : match
}

/** 判断路由是否有可跳转目标。 */
const isNavigable = (item: AppRouteRecord) =>
  Boolean((item.path && item.path.trim()) || item.meta?.link || item.meta?.isIframe)

/** 归一化搜索文本，统一大小写并忽略空格、斜杠、下划线和连字符。 */
const normalizeSearchText = (text: string) => text.toLowerCase().replace(/[\s/_-]+/g, '')

const getContainsMatch = (source: string, keyword: string) => source.indexOf(keyword)

/** 将快捷操作 query 拼到目标路径上，供路由跳转使用。 */
const buildNavigatePath = (path: string, query: Record<string, string>) => {
  const queryString = stringifyQuery(query)
  return queryString ? `${path}?${queryString}` : path
}

/** 子序列模糊匹配：允许关键词字符按顺序分散出现在源字符串中。 */
const matchSubsequence = (source: string, keyword: string) => {
  if (!source || !keyword) {
    return false
  }

  let sourceIndex = 0
  let keywordIndex = 0

  while (sourceIndex < source.length && keywordIndex < keyword.length) {
    if (source[sourceIndex] === keyword[keywordIndex]) {
      keywordIndex += 1
    }
    sourceIndex += 1
  }

  return keywordIndex === keyword.length
}

/** 返回关键词在原始文本中的高亮范围；非直接包含匹配不做高亮。 */
const getHighlightRange = (text: string, keyword: string): SearchHighlightRange | undefined => {
  if (!text || !keyword) {
    return undefined
  }

  const lowerText = text.toLowerCase()
  const lowerKeyword = keyword.toLowerCase()
  const index = lowerText.indexOf(lowerKeyword)

  if (index === -1) {
    return undefined
  }

  return {
    start: index,
    end: index + keyword.length
  }
}
