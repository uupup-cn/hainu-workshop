/** 全局搜索快捷操作配置。 */
export interface GlobalSearchQuickActionConfig {
  key: string
  title: string
  aliases: string[]
  path: string
  parentTitle: string
  requiredAuthMark: string
  query: Record<string, string>
}

/** 业务常用同义词，用于让“员工”“账号”等词也能命中“用户管理”。 */
export const globalSearchTitleSynonyms: Array<{ keyword: string; aliases: string[] }> = [
  { keyword: '用户', aliases: ['员工', '成员', '账号', '账号管理', '人员'] },
  { keyword: '角色', aliases: ['权限', '角色权限', '授权'] },
  { keyword: '菜单', aliases: ['导航', '菜单配置', '功能菜单'] },
  { keyword: '字典', aliases: ['枚举', '配置字典', '字典项'] },
  { keyword: '通知', aliases: ['消息', '站内信'] },
  { keyword: '文件', aliases: ['附件', '素材', '文档'] },
  { keyword: '日志', aliases: ['记录', '审计', '操作记录'] }
]

/** 快捷操作会被挂到对应菜单下，并通过 query 参数通知目标页面打开弹窗。 */
export const globalSearchQuickActions: GlobalSearchQuickActionConfig[] = [
  {
    key: 'action:user:create',
    title: '新增用户',
    aliases: ['创建用户', '添加用户', '新建用户', '新增账号', '创建账号', '添加员工'],
    path: '/system/user',
    parentTitle: '用户管理',
    requiredAuthMark: 'add',
    query: { quickAction: 'createUser' }
  },
  {
    key: 'action:role:create',
    title: '新增角色',
    aliases: ['创建角色', '添加角色', '新建角色', '新增权限角色'],
    path: '/system/role',
    parentTitle: '角色管理',
    requiredAuthMark: 'add',
    query: { quickAction: 'createRole' }
  }
]
