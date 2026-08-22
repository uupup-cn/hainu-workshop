/**
 * 图表组件类型定义模块
 *
 * 提供 ECharts 图表组件的完整类型定义
 *
 * ## 主要功能
 *
 * - 基础图表配置类型
 * - 柱状图类型定义
 * - 折线图类型定义
 * - 饼图/环形图类型定义
 * - 雷达图类型定义
 * - K线图类型定义
 * - 散点图类型定义
 * - 地图图表类型定义
 * - 双向堆叠柱状图类型定义
 * - 图表主题配置类型
 * - 图表事件回调类型
 *
 * ## 使用场景
 *
 * - 图表组件 Props 类型约束
 * - 图表配置类型定义
 * - 图表数据结构定义
 * - 图表事件处理
 *
 * @module types/component/chart
 * @author Ci-Yuu-Plus Team
 */
import type { EChartsModuleKey, EChartsOption } from '@/plugins/echarts'

// 图例位置类型
export type LegendPosition = 'bottom' | 'top' | 'left' | 'right'

export type SymbolType =
  | 'circle'
  | 'rect'
  | 'roundRect'
  | 'triangle'
  | 'diamond'
  | 'pin'
  | 'arrow'
  | 'none'

// 图表主题配置
export interface ChartThemeConfig {
  /** 图表高度 */
  chartHeight: string
  /** 字体大小 */
  fontSize: number
  /** 字体颜色 */
  fontColor: string
  /** 主题颜色 */
  themeColor: string
  /** 颜色组 */
  colors: string[]
}

// 图表初始化选项
export interface UseChartOptions {
  /** 初始化选项 */
  initOptions?: EChartsOption
  /** 延迟初始化时间(ms) */
  initDelay?: number
  /** IntersectionObserver阈值 */
  threshold?: number
  /** 是否自动响应主题变化 */
  autoTheme?: boolean
  /** 额外强制加载的 ECharts 模块 */
  requiredModules?: EChartsModuleKey[]
}

// 基础图表 Props 接口 - 统一所有图表的基础属性
export interface BaseChartProps {
  /** 图表高度 */
  height?: string
  /** 是否加载中 */
  loading?: boolean
  isEmpty?: boolean
  /** 颜色配置 */
  colors?: string[]
}

// 轴线显示控制接口 - 统一轴线相关配置
export interface AxisDisplayProps {
  /** 是否显示坐标轴标签 */
  showAxisLabel?: boolean
  /** 是否显示坐标轴线 */
  showAxisLine?: boolean
  /** 是否显示分割线 */
  showSplitLine?: boolean
}

// 交互显示控制接口 - 统一交互相关配置
export interface InteractionProps {
  /** 是否显示提示框 */
  showTooltip?: boolean
  /** 是否显示图例 */
  showLegend?: boolean
  /** 图例位置 */
  legendPosition?: LegendPosition
}

// 柱状图数据项接口
export interface BarDataItem {
  /** 系列名称 */
  name: string
  /** 数据值 */
  data: number[]
  /** 柱状图宽度 */
  barWidth?: string | number
  /** 堆叠分组名称 */
  stack?: string
}

// 柱状图 Props 接口 - 统一柱状图配置
export interface BarChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** 图表数据 - 支持单组数据或多组数据 */
  data: number[] | BarDataItem[]
  /** X轴标签数据 */
  xAxisData?: string[]
  /** 单系列图例名称 */
  seriesName?: string
  /** 柱状图宽度 */
  barWidth?: string | number
  /** 是否堆叠显示 */
  stack?: boolean
  /** 圆角 */
  borderRadius?: number | number[]
}

// 折线图数据项接口
export interface LineDataItem {
  /** 系列名称 */
  name: string
  /** 数据值 */
  data: number[]
  /** 线条宽度 */
  lineWidth?: number
  /** 是否显示区域填充 */
  showAreaColor?: boolean
  /** 区域样式配置 */
  areaStyle?: {
    /** 渐变开始透明度 */
    startOpacity?: number
    /** 渐变结束透明度 */
    endOpacity?: number
    /** 自定义 ECharts areaStyle 配置 */
    custom?: any
  }
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 数据点符号 */
  symbol?: SymbolType
  /** 数据点大小 */
  symbolSize?: number
}

// 折线图 Props 接口 - 统一折线图配置
export interface LineChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** 图表数据 - 支持单组数据或多组数据 */
  data: number[] | LineDataItem[]
  /** X轴标签数据 */
  xAxisData?: string[]
  /** 线条宽度 */
  lineWidth?: number
  /** 是否显示区域填充 */
  showAreaColor?: boolean
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 数据点符号 */
  symbol?: SymbolType
  /** 数据点大小 */
  symbolSize?: number
  /** 多数据动画延迟间隔（毫秒） */
  animationDelay?: number
}

// 雷达图数据项接口
export interface RadarDataItem {
  /** 系列名称 */
  name: string
  /** 数据值 */
  value: number[]
}

// 雷达图 Props 接口 - 统一雷达图配置
export interface RadarChartProps extends BaseChartProps, InteractionProps {
  /** 雷达图指标配置 */
  indicator?: Array<{ name: string; max: number }>
  /** 图表数据 */
  data?: RadarDataItem[]
  /** 是否禁用 hover 强调态，避免多系列雷达图闪烁 */
  disableEmphasis?: boolean
}

// 饼图/环形图数据项接口
export interface PieDataItem {
  /** 数据值 */
  value: number
  /** 数据名称 */
  name: string
}

// 环形图 Props 接口 - 统一环形图配置
export interface RingChartProps extends BaseChartProps, InteractionProps {
  /** 图表数据 */
  data: PieDataItem[]
  /** 内外半径 */
  radius?: string[]
  /** 玫瑰图类型 */
  roseType?: 'radius' | 'area'
  /** 边框圆角 */
  borderRadius?: number
  /** 中心文本 */
  centerText?: string
  /** 是否显示标签 */
  showLabel?: boolean
}

// 漏斗图数据项接口
export interface FunnelDataItem {
  /** 数据值 */
  value: number
  /** 数据名称 */
  name: string
}

// 漏斗图 Props 接口 - 统一漏斗图配置
export interface FunnelChartProps extends BaseChartProps, InteractionProps {
  /** 图表数据 */
  data: FunnelDataItem[]
  /** 数据排序方式 */
  sort?: 'ascending' | 'descending' | 'none'
  /** 是否显示标签 */
  showLabel?: boolean
}

// 仪表盘 Props 接口 - 统一仪表盘配置
export interface GaugeChartProps extends BaseChartProps {
  /** 当前值 */
  value: number
  /** 指标名称 */
  name?: string
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
  /** 单位 */
  unit?: string
  /** 开始角度 */
  startAngle?: number
  /** 结束角度 */
  endAngle?: number
  /** 刻度分段数 */
  splitNumber?: number
  /** 是否显示进度条 */
  showProgress?: boolean
  /** 轴线宽度 */
  axisLineWidth?: number
}

// 热力图数据项接口
export interface HeatmapDataItem {
  /** 坐标值 [xIndex, yIndex, value] */
  value: [number, number, number]
}

// 热力图 Props 接口 - 统一热力图配置
export interface HeatmapChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** 图表数据 */
  data?: HeatmapDataItem[]
  /** X 轴标签 */
  xAxisData?: string[]
  /** Y 轴标签 */
  yAxisData?: string[]
  /** 最小值 */
  min?: number
  /** 最大值 */
  max?: number
}

// K线图数据项接口
export interface KLineDataItem {
  /** 时间标签 */
  time: string
  /** 开盘价 */
  open: number
  /** 收盘价 */
  close: number
  /** 最高价 */
  high: number
  /** 最低价 */
  low: number
}

// K线图 Props 接口 - 统一K线图配置
export interface KLineChartProps extends BaseChartProps {
  /** 图表数据 */
  data?: KLineDataItem[]
  /** 是否显示数据缩放控件 */
  showDataZoom?: boolean
  /** 数据缩放初始开始位置 */
  dataZoomStart?: number
  /** 数据缩放初始结束位置 */
  dataZoomEnd?: number
}

// 散点图数据项接口
export interface ScatterDataItem {
  /** 坐标值 [x, y] */
  value: number[]
}

// 散点图 Props 接口 - 统一散点图配置
export interface ScatterChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** 图表数据 */
  data?: ScatterDataItem[]
  /** 散点大小 */
  symbolSize?: number
}

export type MixedChartSeriesType = 'bar' | 'line'

// 混合图数据项接口
export interface MixedChartDataItem {
  /** 系列名称 */
  name: string
  /** 系列类型 */
  type: MixedChartSeriesType
  /** 数据值 */
  data: number[]
  /** 柱状图宽度 */
  barWidth?: string | number
  /** 堆叠分组名称 */
  stack?: string
  /** Y轴索引 */
  yAxisIndex?: number
  /** 是否平滑曲线 */
  smooth?: boolean
  /** 线条宽度 */
  lineWidth?: number
  /** 数据点类型 */
  symbol?: SymbolType
  /** 数据点大小 */
  symbolSize?: number
}

// 混合图 Props 接口 - 统一柱线混合图配置
export interface MixedChartProps extends BaseChartProps, AxisDisplayProps, InteractionProps {
  /** 图表数据 */
  data: MixedChartDataItem[]
  /** X轴标签数据 */
  xAxisData?: string[]
  /** 柱状图圆角 */
  borderRadius?: number | number[]
}

// 矩形树图数据项接口
export interface TreemapDataItem {
  /** 节点名称 */
  name: string
  /** 节点值 */
  value: number
  /** 子节点 */
  children?: TreemapDataItem[]
}

// 矩形树图 Props 接口 - 统一矩形树图配置
export interface TreemapChartProps extends BaseChartProps, InteractionProps {
  /** 图表数据 */
  data: TreemapDataItem[]
  /** 是否显示标签 */
  showLabel?: boolean
  /** 面包屑高度 */
  breadcrumbHeight?: number
}

// 双柱对比图 Props 接口 - 统一双柱对比图配置
export interface DualBarCompareChartProps extends BaseChartProps {
  /** 上方数据 */
  topData: number[]
  /** 下方数据 */
  bottomData: number[]
  /** X轴标签数据 */
  xAxisData: string[]
  /** 上方柱子颜色 */
  topColor?: string
  /** 下方柱子颜色 */
  bottomColor?: string
  /** 柱状图宽度 */
  barWidth?: number
}

// 地图图表 Props 接口 - 统一地图图表配置
export interface MapChartProps extends BaseChartProps {
  /** 地图数据 */
  mapData?: any[]
  /** 选中区域 */
  selectedRegion?: string
  /** 是否显示标签 */
  showLabels?: boolean
  /** 是否显示散点 */
  showScatter?: boolean
}

// 双向堆叠柱状图 Props 接口（人口金字塔样式）
export interface BidirectionalBarChartProps
  extends BaseChartProps,
    AxisDisplayProps,
    InteractionProps {
  /** 正向数据（向上显示） */
  positiveData: number[]
  /** 负向数据（向下显示） */
  negativeData: number[]
  /** X轴标签数据 */
  xAxisData?: string[]
  /** 正向数据名称 */
  positiveName?: string
  /** 负向数据名称 */
  negativeName?: string
  /** 柱状图宽度 */
  barWidth?: string | number
  /** Y轴最小值 */
  yAxisMin?: number
  /** Y轴最大值 */
  yAxisMax?: number
  /** 是否显示数据标签 */
  showDataLabel?: boolean
  /** 正向数据圆角配置 */
  positiveBorderRadius?: number | number[]
  /** 负向数据圆角配置 */
  negativeBorderRadius?: number | number[]
}

// 图表配置生成器函数类型
export type ChartOptionGenerator = () => EChartsOption

// 图表事件回调类型
export type ChartEventCallback = (params: any) => void

// 图表错误信息接口
export interface ChartError {
  /** 错误码 */
  code: string
  /** 错误信息 */
  message: string
  /** 错误详情 */
  details?: any
}
