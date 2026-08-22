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
  { keyword: '部门', aliases: ['组织', '组织架构', '架构'] },
  { keyword: '岗位', aliases: ['职位', '职务'] },
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
  },
  {
    key: 'action:department:create',
    title: '新增部门',
    aliases: ['创建部门', '添加部门', '新建部门', '新增组织', '创建组织'],
    path: '/system/department',
    parentTitle: '部门管理',
    requiredAuthMark: 'add',
    query: { quickAction: 'createDepartment' }
  },
  {
    key: 'action:post:create',
    title: '新增岗位',
    aliases: ['创建岗位', '添加岗位', '新建岗位', '新增职位', '创建职位'],
    path: '/system/post',
    parentTitle: '岗位管理',
    requiredAuthMark: 'add',
    query: { quickAction: 'createPost' }
  },
  {
    key: 'action:content-category:create',
    title: '新增分类',
    aliases: ['创建分类', '添加分类', '新建分类', '新增内容分类', '创建内容分类'],
    path: '/content/category',
    parentTitle: '内容分类',
    requiredAuthMark: 'add',
    query: { quickAction: 'createContentCategory' }
  },
  {
    key: 'action:content-tag:create',
    title: '新增标签',
    aliases: ['创建标签', '添加标签', '新建标签', '新增内容标签', '创建内容标签'],
    path: '/content/tag',
    parentTitle: '内容标签',
    requiredAuthMark: 'add',
    query: { quickAction: 'createContentTag' }
  }
]
