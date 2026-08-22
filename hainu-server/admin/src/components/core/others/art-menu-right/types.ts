export interface MenuItemType {
  /** 菜单项唯一标识 */
  key: string
  /** 菜单项类型 */
  type?: 'item' | 'group'
  /** 菜单项标签 */
  label: string
  /** 菜单项图标 */
  icon?: string
  /** 菜单项图标 class */
  iconClass?: string
  /** 图标展示模式 */
  iconVariant?: 'plain' | 'box'
  /** 图标底色 */
  iconBg?: string
  /** 图标颜色 */
  iconColor?: string
  /** 菜单项是否禁用 */
  disabled?: boolean
  /** 菜单项是否显示分割线 */
  showLine?: boolean
  /** 子菜单 */
  children?: MenuItemType[]
  [key: string]: any
}
