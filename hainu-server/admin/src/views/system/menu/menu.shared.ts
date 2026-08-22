/**
 * 主题：菜单管理共享规则。
 *
 * 统一收敛菜单页与弹窗共用的类型定义、树处理、筛选规则和提交参数组装逻辑，
 * 避免页面和弹窗各自维护一套菜单判断规则。
 */
import type { AppRouteRecord } from '@/types/router'
import { formatMenuTitle } from '@/utils/router'

export const DIRECTORY_COMPONENT = '/index/index'
export const IFRAME_ROUTE_PREFIX = '/outside/iframe/'
export const IFRAME_ROUTE_REGEXP = /^\/outside\/iframe\/.+$/

/**
 * 菜单节点的业务类型。
 */
export type MenuKind = 'directory' | 'menu' | 'button' | 'iframe' | 'link'

/**
 * 菜单下拉选项。
 */
export type MenuOption = {
  label: string
  value: number
  disabled?: boolean
}

/**
 * 菜单按钮权限描述。
 */
export type MenuAuthDescriptor = {
  title: string
  authMark: string
  icon?: string
  isEnable?: boolean
  sort?: number
  updatedAt?: string
}

/**
 * 菜单元数据的编辑态扩展。
 */
type MenuMeta = Partial<AppRouteRecord['meta']> & {
  sort?: number
  isEnable?: boolean
  parentId?: number
  keepAlive?: boolean
  isHide?: boolean
  isHideTab?: boolean
  showBadge?: boolean
  showTextBadge?: string
  fixedTab?: boolean
  activePath?: string
  isFullPage?: boolean
  openInNewTab?: boolean
  roles?: string[]
}

/**
 * 菜单编辑态数据。
 */
export type MenuEditState = Partial<AppRouteRecord> & {
  title?: string
  authMark?: string
  icon?: string
  isEnable?: boolean
  sort?: number
  parentId?: number
  parentPath?: string
}

/**
 * 菜单弹窗表单结构。
 */
export type MenuFormData = Api.Navigation.CreateMenuParams & {
  menuType: MenuKind
  authName?: string
  authLabel?: string
  authIcon?: string
  authSort?: number
}

/**
 * 菜单筛选条件。
 */
export type MenuFilters = {
  keyword: string
  type: string
  status: string
}

/**
 * 菜单类型展示文案映射。
 */
export const menuTypeLabelMap: Record<MenuKind, string> = {
  directory: '目录',
  menu: '菜单',
  button: '按钮',
  iframe: '内嵌',
  link: '外链'
}

/**
 * 深拷贝菜单树节点。
 * 这里避免使用 `structuredClone`，因为菜单数据常来自 Vue 响应式对象。
 */
function cloneMenuTree<T>(value: T): T {
  if (value === null || typeof value !== 'object') {
    return value
  }

  if (value instanceof Date) {
    return new Date(value) as T
  }

  if (Array.isArray(value)) {
    return value.map((item) => cloneMenuTree(item)) as T
  }

  const cloned = {} as Record<string, unknown>

  Object.keys(value).forEach((key) => {
    cloned[key] = cloneMenuTree((value as Record<string, unknown>)[key])
  })

  return cloned as T
}

/**
 * 将任意值标准化为去首尾空格的文本。
 */
function trimText(value: unknown) {
  return String(value ?? '').trim()
}

/**
 * 读取编辑态节点上的菜单元数据。
 */
function getMenuMeta(row?: AppRouteRecord | MenuEditState | null): MenuMeta {
  return (row?.meta ?? {}) as MenuMeta
}

/**
 * 生成菜单表格的稳定行键。
 */
export function createMenuRowKey(row: Record<string, unknown>): string {
  const menuRow = row as unknown as AppRouteRecord

  if (menuRow.id !== undefined && menuRow.id !== null) {
    return String(menuRow.id)
  }

  if (menuRow.meta?.isAuthButton) {
    return `${String(menuRow.meta.parentId ?? 'root')}_${String(
      menuRow.meta.authMark ?? menuRow.name ?? menuRow.path ?? 'auth'
    )}`
  }

  return `${String(menuRow.name ?? 'menu')}_${String(menuRow.path || menuRow.meta?.link || 'empty')}`
}

/**
 * 判断节点是否存在非按钮类型的子菜单。
 */
export function hasMenuChildren(row?: AppRouteRecord | MenuEditState | null): boolean {
  return !!row?.children?.some((child) => !child.meta?.isAuthButton)
}

/**
 * 根据节点结构推导菜单业务类型。
 */
export function resolveMenuKind(
  row?: AppRouteRecord | MenuEditState | null,
  fallback: MenuKind = 'directory'
): MenuKind {
  if (!row) return fallback

  if (
    row.meta?.isAuthButton ||
    ('authMark' in row && 'title' in row && Boolean(row.authMark && row.title))
  ) {
    return 'button'
  }

  if (row.meta?.link && row.meta?.isIframe) return 'iframe'
  if (row.meta?.link) return 'link'

  if (hasMenuChildren(row) || row.component === DIRECTORY_COMPONENT || !row.component) {
    return 'directory'
  }

  return 'menu'
}

/**
 * 收集指定节点下所有后代菜单 ID。
 */
export function collectDescendantIds(items: AppRouteRecord[] | undefined): number[] {
  if (!items?.length) return []

  return items.flatMap((item) => [
    ...(typeof item.id === 'number' ? [item.id] : []),
    ...collectDescendantIds(item.children)
  ])
}

/**
 * 将菜单树转换为弹窗可用的层级下拉选项。
 */
export function buildMenuOptions(
  items: AppRouteRecord[],
  disabledIds = new Set<number>(),
  level = 0
): MenuOption[] {
  return items.flatMap((item) => {
    if (item.meta?.isAuthButton || typeof item.id !== 'number') {
      return []
    }

    const prefix = level === 0 ? '' : `${'　'.repeat(level)}└ `
    const currentOption = {
      label: `${prefix}${formatMenuTitle(String(item.meta?.title || item.name || `菜单 ${item.id}`))}`,
      value: item.id,
      disabled: disabledIds.has(item.id)
    }

    return [currentOption, ...buildMenuOptions(item.children || [], disabledIds, level + 1)]
  })
}

/**
 * 创建菜单弹窗的默认表单数据。
 */
export function createDefaultMenuFormData(): MenuFormData {
  return {
    menuType: 'directory',
    parentId: undefined,
    name: '',
    label: '',
    path: '',
    component: '',
    icon: '',
    roles: [],
    sort: 1,
    link: '',
    showTextBadge: '',
    activePath: '',
    isEnable: true,
    keepAlive: true,
    isHide: false,
    isHideTab: false,
    isIframe: false,
    showBadge: false,
    fixedTab: false,
    isFullPage: false,
    openInNewTab: false,
    authName: '',
    authLabel: '',
    authIcon: '',
    authSort: 1
  }
}

/**
 * 按菜单类型同步不适用的表单字段。
 */
export function syncMenuFormByType(form: MenuFormData) {
  if (form.menuType === 'directory') {
    form.link = ''
    form.component = ''
    form.activePath = ''
    form.keepAlive = false
    form.fixedTab = false
    form.isHideTab = false
    form.isFullPage = false
    form.openInNewTab = false
    form.isIframe = false
    form.showTextBadge = ''
    return
  }

  if (form.menuType === 'menu') {
    form.link = ''
    form.isIframe = false
    return
  }

  if (form.menuType === 'iframe') {
    form.component = ''
    form.activePath = ''
    form.keepAlive = false
    form.fixedTab = false
    form.isFullPage = false
    form.openInNewTab = false
    form.isIframe = true
    return
  }

  if (form.menuType === 'link') {
    form.component = ''
    form.activePath = ''
    form.keepAlive = false
    form.fixedTab = false
    form.isHideTab = false
    form.isFullPage = false
    form.openInNewTab = true
    form.isIframe = false
    return
  }

  form.link = ''
  form.component = ''
  form.activePath = ''
  form.keepAlive = false
  form.fixedTab = false
  form.isHideTab = false
  form.isFullPage = false
  form.openInNewTab = false
  form.isIframe = false
  form.showTextBadge = ''
}

/**
 * 将编辑态数据转换为菜单弹窗表单。
 */
export function buildMenuEditFormData(
  editData?: MenuEditState | null,
  initialType: MenuKind = 'directory'
): MenuFormData {
  const form = createDefaultMenuFormData()
  form.menuType = initialType

  if (!editData) {
    syncMenuFormByType(form)
    return form
  }

  const resolvedType = resolveMenuKind(editData, initialType)
  const meta = getMenuMeta(editData)
  form.menuType = resolvedType

  if (resolvedType === 'button') {
    form.authName = trimText(editData.title)
    form.authLabel = trimText(editData.authMark)
    form.authIcon = trimText(editData.icon)
    form.isEnable = editData.isEnable ?? meta.isEnable ?? true
    form.authSort = editData.sort || 1
    form.parentId = editData.parentId
    syncMenuFormByType(form)
    return form
  }

  form.parentId = editData.parentId ?? meta.parentId ?? undefined
  form.name = trimText(meta.title)
  form.label = trimText(editData.name)
  form.path = trimText(editData.path)
  form.component = typeof editData.component === 'string' ? editData.component : ''
  form.icon = trimText(meta.icon)
  form.sort = meta.sort || 1
  form.keepAlive = meta.keepAlive ?? false
  form.isHide = meta.isHide ?? false
  form.isHideTab = meta.isHideTab ?? false
  form.isEnable = meta.isEnable ?? true
  form.link = trimText(meta.link)
  form.isIframe = meta.isIframe ?? false
  form.showBadge = meta.showBadge ?? false
  form.showTextBadge = trimText(meta.showTextBadge)
  form.fixedTab = meta.fixedTab ?? false
  form.activePath = trimText(meta.activePath)
  form.isFullPage = meta.isFullPage ?? false
  form.openInNewTab = meta.openInNewTab ?? false
  form.roles = meta.roles || []
  syncMenuFormByType(form)
  return form
}

/**
 * 将按钮权限映射为前端表格子节点。
 */
function mapAuthToChild(item: AppRouteRecord, auth: MenuAuthDescriptor): AppRouteRecord {
  return {
    path: `${item.path}_auth_${auth.authMark}`,
    name: `${String(item.name)}_auth_${auth.authMark}`,
    updatedAt: auth.updatedAt,
    meta: {
      title: auth.title,
      authMark: auth.authMark,
      isAuthButton: true,
      parentPath: item.path,
      parentId: item.id,
      icon: auth.icon,
      isEnable: auth.isEnable,
      sort: auth.sort
    }
  }
}

/**
 * 将菜单上的 `authList` 展开成表格树结构里的子节点。
 */
export function convertAuthListToChildren(items: AppRouteRecord[]): AppRouteRecord[] {
  return items.map((item) => {
    const clonedItem = cloneMenuTree(item)

    if (clonedItem.children?.length) {
      clonedItem.children = convertAuthListToChildren(clonedItem.children)
    }

    if (item.meta?.authList?.length) {
      const authChildren = item.meta.authList.map((auth) => mapAuthToChild(item, auth))
      clonedItem.children = clonedItem.children?.length
        ? [...clonedItem.children, ...authChildren]
        : authChildren
    }

    return clonedItem
  })
}

/**
 * 判断状态筛选是否命中。
 */
function isEnabledMatched(enabled: boolean | undefined, status: string) {
  if (!status) return true
  return status === 'enabled' ? enabled !== false : enabled === false
}

/**
 * 判断菜单节点是否命中当前筛选条件。
 */
function isMenuMatched(item: AppRouteRecord, filters: MenuFilters): boolean {
  const keyword = filters.keyword.toLowerCase().trim()
  const keywordMatched =
    !keyword ||
    [
      formatMenuTitle(item.meta?.title || ''),
      String(item.name ?? ''),
      item.path || '',
      item.meta?.link || ''
    ]
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(keyword))

  const typeMatched = !filters.type || resolveMenuKind(item) === filters.type
  const enabled = typeof item.meta?.isEnable === 'boolean' ? item.meta.isEnable : undefined
  const statusMatched = isEnabledMatched(enabled, filters.status)

  return keywordMatched && typeMatched && statusMatched
}

/**
 * 判断按钮权限是否命中当前筛选条件。
 */
function isAuthMatched(
  auth: { title: string; authMark: string; isEnable?: boolean },
  filters: MenuFilters
): boolean {
  const keyword = filters.keyword.toLowerCase().trim()
  const keywordMatched =
    !keyword ||
    [auth.title || '', auth.authMark || '']
      .map((field) => field.toLowerCase())
      .some((field) => field.includes(keyword))

  const typeMatched = !filters.type || filters.type === 'button'
  const statusMatched = isEnabledMatched(auth.isEnable, filters.status)

  return keywordMatched && typeMatched && statusMatched
}

/**
 * 判断是否存在任一有效筛选条件。
 */
export function hasActiveMenuFilters(filters: MenuFilters) {
  return Object.values(filters).some((value) => trimText(value) !== '')
}

/**
 * 根据筛选条件过滤菜单树，同时尽量保留必要的层级上下文。
 */
export function filterMenuTree(items: AppRouteRecord[], filters: MenuFilters): AppRouteRecord[] {
  const results: AppRouteRecord[] = []
  const keywordOnlySearch = !!filters.keyword.trim() && !filters.type && !filters.status

  for (const item of items) {
    const matchedChildren = item.children?.length ? filterMenuTree(item.children, filters) : []
    const matchedAuthList =
      item.meta?.authList?.filter((auth) => isAuthMatched(auth, filters)) || []
    const selfMatched = isMenuMatched(item, filters)

    if (!selfMatched && matchedChildren.length === 0 && matchedAuthList.length === 0) {
      continue
    }

    if (selfMatched && keywordOnlySearch) {
      results.push(cloneMenuTree(item))
      continue
    }

    const clonedItem = cloneMenuTree(item)
    clonedItem.children = matchedChildren.length ? matchedChildren : undefined
    clonedItem.meta = {
      ...clonedItem.meta,
      authList:
        selfMatched && !filters.type && !filters.status
          ? clonedItem.meta?.authList
          : matchedAuthList
    }
    results.push(clonedItem)
  }

  return results
}

type MenuSubmitAction =
  | {
      type: 'button-create'
      parentId: number
      payload: Api.Navigation.CreateMenuAuthParams
    }
  | {
      type: 'button-update'
      parentId: number
      authMark: string
      payload: Api.Navigation.UpdateMenuAuthParams
    }
  | {
      type: 'menu'
      id?: number
      payload: Api.Navigation.CreateMenuParams
    }

/**
 * 将菜单弹窗表单转换为接口提交动作。
 */
export function buildMenuSubmitAction(
  formData: MenuFormData,
  editData?: MenuEditState | null
): MenuSubmitAction {
  if (formData.menuType === 'button') {
    const parentId = editData?.parentId
    const authName = trimText(formData.authName)
    const authLabel = trimText(formData.authLabel)

    if (!parentId) {
      throw new Error('缺少父级菜单信息')
    }

    if (!authName || !authLabel) {
      throw new Error('缺少权限名称或权限标签')
    }

    return editData?.authMark
      ? {
          type: 'button-update',
          parentId,
          authMark: editData.authMark,
          payload: {
            authName,
            authLabel,
            authIcon: trimText(formData.authIcon),
            authSort: formData.authSort,
            isEnable: formData.isEnable
          }
        }
      : {
          type: 'button-create',
          parentId,
          payload: {
            parentId,
            authName,
            authLabel,
            authIcon: trimText(formData.authIcon),
            authSort: formData.authSort,
            isEnable: formData.isEnable
          }
        }
  }

  const isDirectory = formData.menuType === 'directory'
  const isIframe = formData.menuType === 'iframe'
  const isLink = formData.menuType === 'link'
  const isMenu = formData.menuType === 'menu'
  // 编辑场景下显式传 null，确保上级被清空时能保存为顶级菜单
  const parentId =
    typeof formData.parentId === 'number' && formData.parentId > 0 ? formData.parentId : null
  const isTopLevel = !parentId
  const normalizedLabel =
    trimText(formData.label) || trimText(editData?.name ?? formData.name) || trimText(formData.name)

  return {
    type: 'menu',
    id: editData?.id,
    payload: {
      parentId,
      name: trimText(formData.name),
      label: normalizedLabel,
      path: trimText(formData.path),
      component: isDirectory
        ? isTopLevel
          ? DIRECTORY_COMPONENT
          : ''
        : isMenu
          ? trimText(formData.component)
          : '',
      icon: trimText(formData.icon),
      roles: formData.roles,
      sort: formData.sort,
      link: isIframe || isLink ? trimText(formData.link) : '',
      showTextBadge: trimText(formData.showTextBadge) || '',
      activePath: isMenu ? trimText(formData.activePath) : '',
      isEnable: formData.isEnable,
      keepAlive: isMenu ? formData.keepAlive : false,
      isHide: formData.isHide,
      isHideTab: isMenu || isIframe ? formData.isHideTab : false,
      isIframe,
      showBadge: formData.showBadge,
      fixedTab: isMenu ? formData.fixedTab : false,
      isFullPage: isMenu ? formData.isFullPage : false,
      openInNewTab: isMenu || isLink ? formData.openInNewTab : false
    }
  }
}
