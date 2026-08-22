/**
 * 组件类型定义模块
 *
 * 提供项目组件的类型定义
 *
 * ## 主要功能
 *
 * - 搜索组件类型定义
 * - 表格列配置类型
 * - 分页配置类型
 * - 表单规则类型
 * - 对话框配置类型
 *
 * ## 使用场景
 *
 * - 组件 Props 类型约束
 * - 组件配置类型定义
 * - 组件事件参数类型
 *
 * @module types/component/index
 * @author Ci-Yuu-Plus Team
 */

// 搜索组件类型
export type SearchComponentType =
  | 'input'
  | 'select'
  | 'radio'
  | 'checkbox'
  | 'date'
  | 'datetime'
  | 'daterange'
  | 'datetimerange'
  | 'month'
  | 'monthrange'
  | 'year'
  | 'yearrange'
  | 'week'
  | 'time'
  | 'timerange'

// 搜索框值变化参数
export interface SearchChangeParams {
  prop: string
  val: unknown
}

// 表格列配置接口
export interface ColumnOption<T = any> {
  // 列类型
  type?: 'selection' | 'expand' | 'index' | 'globalIndex'
  // 列属性名
  prop?: string
  // 列标题
  label?: string
  // 列宽度
  width?: string | number
  // 最小列宽度
  minWidth?: string | number
  // 自动推导最小列宽，仅在 ArtTable 开启 autoMinWidth 或当前列显式配置时生效
  autoMinWidth?:
    | boolean
    | {
        min?: number
        max?: number
        sampleSize?: number
        padding?: number
      }
  // 固定列
  fixed?: boolean | 'left' | 'right'
  // 是否允许通过表头拖拽调整列顺序
  headerDraggable?: boolean
  // 是否可排序
  sortable?: boolean | 'custom'
  // 过滤器选项
  filters?: any[]
  // 过滤方法
  filterMethod?: (value: any, row: any) => boolean
  // 过滤器位置
  filterPlacement?: string
  // 是否禁用
  disabled?: boolean
  // 是否显示列
  visible?: boolean
  // 是否选中显示
  checked?: boolean
  // 自定义渲染函数
  formatter?: (row: T) => any
  // 插槽相关配置
  // 是否使用插槽渲染内容
  useSlot?: boolean
  // 插槽名称（默认为 prop 值）
  slotName?: string
  // 是否使用表头插槽
  useHeaderSlot?: boolean
  // 表头插槽名称（默认为 `${prop}-header`）
  headerSlotName?: string
  // 移动端卡片展示配置
  mobile?:
    | boolean
    | {
        // 是否在移动端隐藏
        hidden?: boolean
        // 是否作为卡片主标题
        primary?: boolean
        // 是否作为卡片副信息
        secondary?: boolean
        // 是否作为卡片底部操作区
        action?: boolean
        // 移动端排序，数字越小越靠前
        order?: number
        // 移动端单独显示的标签
        label?: string
        // 是否占满一整行
        fullWidth?: boolean
      }
  // 其他属性
  [key: string]: any
}

// 分页配置
export interface PaginationConfig {
  // 当前页
  currentPage: number
  // 每页条数
  pageSize: number
  // 总条数
  total: number
  // 每页显示个数选择器的选项
  pageSizes?: number[]
  // 组件布局
  layout?: string
  // 是否为小型分页
  small?: boolean
}

// 表单规则
export interface FormRule {
  // 是否必填
  required?: boolean
  // 错误提示信息
  message?: string
  // 触发方式
  trigger?: string | string[]
  // 最小长度
  min?: number
  // 最大长度
  max?: number
  // 正则表达式
  pattern?: RegExp
  // 自定义验证函数
  validator?: (rule: any, value: any, callback: any) => void
}

// 对话框配置
export interface DialogConfig {
  // 标题
  title: string
  // 是否显示
  visible: boolean
  // 宽度
  width?: string | number
  // 是否可以通过点击 modal 关闭
  closeOnClickModal?: boolean
  // 是否可以通过按下 ESC 关闭
  closeOnPressEscape?: boolean
  // 是否显示关闭按钮
  showClose?: boolean
  // 是否在 Dialog 出现时将 body 滚动锁定
  lockScroll?: boolean
  // 是否显示遮罩层
  modal?: boolean
  // 自定义类名
  customClass?: string
}
