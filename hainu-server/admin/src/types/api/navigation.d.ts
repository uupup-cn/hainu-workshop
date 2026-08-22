declare namespace Api {
  /** 导航与菜单类型 */
  namespace Navigation {
    interface MenuPayloadBase {
      /** 父级 ID，传 null 表示设置为顶级菜单 */
      parentId?: number | null
      /** 名称 */
      name: string
      /** 显示名称 */
      label: string
      /** 路径 */
      path: string
      /** 组件路径 */
      component?: string
      /** 图标 */
      icon?: string
      /** 角色列表 */
      roles?: string[]
      /** 排序 */
      sort?: number
      /** 链接 */
      link?: string
      /** 是否在新标签页打开 */
      openInNewTab?: boolean
      /** 文本徽标内容 */
      showTextBadge?: string
      /** 激活路径 */
      activePath?: string
      /** 是否启用 */
      isEnable?: boolean
      /** 是否缓存 */
      keepAlive?: boolean
      /** 是否隐藏 */
      isHide?: boolean
      /** 是否隐藏标签页 */
      isHideTab?: boolean
      /** 是否内嵌页面 */
      isIframe?: boolean
      /** 是否显示徽标 */
      showBadge?: boolean
      /** 是否固定标签页 */
      fixedTab?: boolean
      /** 是否全屏页面 */
      isFullPage?: boolean
    }

    type CreateMenuParams = MenuPayloadBase
    type UpdateMenuParams = Partial<MenuPayloadBase>

    interface UpdateMenuSortParams {
      /** 父级 ID */
      parentId?: number
      /** 排序后的同级菜单 */
      items: Array<{
        /** 菜单 ID */
        id: number
        /** 排序 */
        sort: number
      }>
    }

    interface MenuAuthPayloadBase {
      /** 父级 ID */
      parentId: number
      /** 权限名称 */
      authName: string
      /** 权限标签 */
      authLabel: string
      /** 权限图标 */
      authIcon?: string
      /** 权限排序 */
      authSort?: number
      /** 是否启用 */
      isEnable?: boolean
    }

    type CreateMenuAuthParams = MenuAuthPayloadBase
    type UpdateMenuAuthParams = Partial<Omit<MenuAuthPayloadBase, 'parentId'>>
  }
}
