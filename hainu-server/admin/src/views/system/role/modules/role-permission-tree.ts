/**
 * 角色权限弹窗中两棵权限树（菜单与按钮 / 接口权限）所使用的纯函数工具。
 *
 * 之所以把这些工具抽离成独立模块：
 *  1. 角色管理页"勾选某新菜单时，自动级联展示该菜单下所有按钮权限与 API 权限码"
 *     这条契约（Requirements 32.7）需要可单测覆盖；
 *  2. 不依赖 ElTree 实例即可对树结构 / leaf / 默认勾选回填等进行断言。
 *
 * `role-permission-dialog.vue` 中保留的逻辑只是把这些纯函数串到组件状态上。
 */
import type { AppRouteRecord } from '@/types/router'

/** 菜单授权按钮项（路由 meta.authList 单元） */
export interface MenuAuthItem {
  authMark: string
  title: string
}

/** 菜单与按钮树节点 */
export interface MenuNode {
  /** 树节点的唯一 key；菜单节点为 `${name}`，按钮节点为 `${menuName}_${authMark}` */
  key: string
  /** 节点展示文案；按钮节点是 `auth.title`，菜单节点由组件读取 meta.title 转 i18n */
  label: string
  /** 标记是否为按钮叶子，用于组件层切换展示样式 */
  isAuth?: boolean
  children?: MenuNode[]
  meta?: AppRouteRecord['meta'] & {
    authList?: MenuAuthItem[]
  }
}

/** 接口权限目录中的单条权限记录 */
export interface ApiPermissionItemLike {
  code: string
  name: string
  method: string
  path: string
}

/** 接口权限目录中的"分类"分组 */
export interface ApiCatalogCategoryLike {
  category: string
  permissions: ApiPermissionItemLike[]
}

/** 接口权限目录中的"模块"分组 */
export interface ApiCatalogModuleLike {
  module: string
  categories: ApiCatalogCategoryLike[]
}

/** 接口权限树节点 */
export interface ApiNode {
  key: string
  label: string
  type: 'module' | 'category' | 'permission'
  method?: string
  children?: ApiNode[]
}

/**
 * 把后端返回的菜单管理列表（含 children + meta.authList）转换为权限树节点。
 *
 * 关键契约：每个菜单节点的 children = [...真实子菜单, ...authList 按钮节点]，
 * 这样 ElTree 在父节点勾选时能自动级联到所有子菜单和按钮。
 */
export function buildMenuTreeData(menus: AppRouteRecord[]): MenuNode[] {
  return menus.map((menu) => {
    const menuKey = String(menu.name || menu.path || menu.id)
    const childMenus = menu.children ? buildMenuTreeData(menu.children) : []
    const authNodes: MenuNode[] =
      menu.meta?.authList?.map((auth) => ({
        key: `${menuKey}_${auth.authMark}`,
        label: auth.title,
        isAuth: true
      })) ?? []

    return {
      key: menuKey,
      label: '',
      meta: menu.meta,
      children: [...childMenus, ...authNodes]
    }
  })
}

/**
 * 把后端接口权限目录转换为接口权限树节点。
 * 模块 → 分类 → 权限 三层结构由后端目录决定，前端只是把它包装成 ElTree 可识别的形态。
 */
export function buildApiTreeData(catalog: ApiCatalogModuleLike[]): ApiNode[] {
  return catalog.map((moduleItem) => ({
    key: `module:${moduleItem.module}`,
    label: moduleItem.module,
    type: 'module',
    children: moduleItem.categories.map((categoryItem) => ({
      key: `category:${moduleItem.module}:${categoryItem.category}`,
      label: categoryItem.category,
      type: 'category',
      children: categoryItem.permissions.map((permission) => ({
        key: permission.code,
        label: `${permission.name} (${permission.path})`,
        type: 'permission',
        method: permission.method
      }))
    }))
  }))
}

/** 收集树中所有节点 key（含父节点 + 叶子）。 */
export function collectNodeKeys<T extends { key: string; children?: T[] }>(nodes: T[]): string[] {
  return nodes.flatMap((node) => [
    node.key,
    ...(node.children?.length ? collectNodeKeys(node.children) : [])
  ])
}

/** 收集树中所有叶子节点 key（用于"全选"按钮）。 */
export function collectLeafKeys<T extends { key: string; children?: T[] }>(nodes: T[]): string[] {
  return nodes.flatMap((node) =>
    node.children?.length ? collectLeafKeys(node.children) : [node.key]
  )
}

/**
 * 在指定菜单节点 key 之下找所有按钮（叶子）权限 key。
 * 用例：按钮权限码与菜单的 `${name}_${authMark}` 拼接关系，前端勾选父菜单时
 * 由 ElTree 级联到这一组。本函数主要给单测使用，验证级联关系正确。
 */
export function collectMenuAuthKeysUnder(menus: MenuNode[], targetMenuKey: string): string[] {
  for (const menu of menus) {
    if (menu.key === targetMenuKey) {
      return collectLeafKeys([menu]).filter((key) => key !== menu.key)
    }
    if (menu.children?.length) {
      const found = collectMenuAuthKeysUnder(menu.children, targetMenuKey)
      if (found.length > 0) return found
    }
  }
  return []
}

/**
 * 根据 mall:* 模块前缀（如 `mall:brand`）从 API 权限树中筛出该模块下的所有权限码。
 * 用例：单测验证勾选商城新菜单时，对应模块的 API 权限码确实存在于目录里。
 */
export function findApiPermissionCodesByPrefix(apiNodes: ApiNode[], codePrefix: string): string[] {
  const collected: string[] = []
  const visit = (nodes: ApiNode[]) => {
    for (const node of nodes) {
      if (node.type === 'permission' && node.key.startsWith(codePrefix)) {
        collected.push(node.key)
      }
      if (node.children?.length) visit(node.children)
    }
  }
  visit(apiNodes)
  return collected
}

/**
 * 过滤无效 key 并去重，避免提交不存在的权限节点。
 * 接口权限保存阶段还会再次按 `module:` / `category:` 前缀过滤掉展示节点。
 */
export function normalizeKeys(keys: Array<string | number>, validKeySet: Set<string>): string[] {
  return [...new Set(keys.map(String).filter((key) => validKeySet.has(key)))]
}
