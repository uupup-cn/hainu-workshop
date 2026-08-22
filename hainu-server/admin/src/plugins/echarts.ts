/**
 * ECharts runtime loader
 *
 * Keep the core runtime in the main bundle, but load chart installers only
 * when an option tree actually needs them. This keeps seldom-used chart types
 * out of the default dashboard path.
 */

import * as echarts from 'echarts/core'
import { DataZoomComponent, LegendComponent } from 'echarts/components'
import { getThemeChartPalette } from '@/utils/ui/theme-studio'
import { readRootCssVar } from '@/utils/ui/root-css-vars'

export { echarts }
export type { EChartsOption, BarSeriesOption } from 'echarts'

export const graphic = echarts.graphic

// ECharts 6 在部分按需/懒加载场景下会先执行 setOption，再触发到组件安装器。
// 先用官方组件入口预注册高频组件，避免运行时出现 “Component ... is used but not imported”。
echarts.use([LegendComponent, DataZoomComponent])

export type EChartsModuleKey =
  | 'canvasRenderer'
  | 'titleComponent'
  | 'tooltipComponent'
  | 'gridComponent'
  | 'legendComponent'
  | 'graphicComponent'
  | 'dataZoomComponent'
  | 'markPointComponent'
  | 'markLineComponent'
  | 'toolboxComponent'
  | 'brushComponent'
  | 'geoComponent'
  | 'visualMapComponent'
  | 'radarComponent'
  | 'barChart'
  | 'lineChart'
  | 'pieChart'
  | 'scatterChart'
  | 'radarChart'
  | 'mapChart'
  | 'candlestickChart'
  | 'funnelChart'
  | 'gaugeChart'
  | 'heatmapChart'
  | 'treemapChart'

type EChartsInstallerModule = {
  install: (registers: unknown) => void
}

type EChartsModuleLoader = () => Promise<EChartsInstallerModule>

const MODULE_LOADERS: Record<EChartsModuleKey, EChartsModuleLoader> = {
  canvasRenderer: () => import('echarts/lib/renderer/installCanvasRenderer.js'),
  titleComponent: () => import('echarts/lib/component/title/install.js'),
  tooltipComponent: () => import('echarts/lib/component/tooltip/install.js'),
  gridComponent: () => import('echarts/lib/component/grid/install.js'),
  legendComponent: () => import('echarts/lib/component/legend/install.js'),
  graphicComponent: () => import('echarts/lib/component/graphic/install.js'),
  dataZoomComponent: () => import('echarts/lib/component/dataZoom/install.js'),
  markPointComponent: () => import('echarts/lib/component/marker/installMarkPoint.js'),
  markLineComponent: () => import('echarts/lib/component/marker/installMarkLine.js'),
  toolboxComponent: () => import('echarts/lib/component/toolbox/install.js'),
  brushComponent: () => import('echarts/lib/component/brush/install.js'),
  geoComponent: () => import('echarts/lib/component/geo/install.js'),
  visualMapComponent: () => import('echarts/lib/component/visualMap/install.js'),
  radarComponent: () => import('echarts/lib/component/radar/install.js'),
  barChart: () => import('echarts/lib/chart/bar/install.js'),
  lineChart: () => import('echarts/lib/chart/line/install.js'),
  pieChart: () => import('echarts/lib/chart/pie/install.js'),
  scatterChart: () => import('echarts/lib/chart/scatter/install.js'),
  radarChart: () => import('echarts/lib/chart/radar/install.js'),
  mapChart: () => import('echarts/lib/chart/map/install.js'),
  candlestickChart: () => import('echarts/lib/chart/candlestick/install.js'),
  funnelChart: () => import('echarts/lib/chart/funnel/install.js'),
  gaugeChart: () => import('echarts/lib/chart/gauge/install.js'),
  heatmapChart: () => import('echarts/lib/chart/heatmap/install.js'),
  treemapChart: () => import('echarts/lib/chart/treemap/install.js')
}

const loadedModules = new Set<EChartsModuleKey>(['legendComponent', 'dataZoomComponent'])
const pendingModuleLoads = new Map<EChartsModuleKey, Promise<void>>()

const SERIES_MODULE_MAP = {
  bar: 'barChart',
  line: 'lineChart',
  pie: 'pieChart',
  scatter: 'scatterChart',
  radar: 'radarChart',
  map: 'mapChart',
  candlestick: 'candlestickChart',
  funnel: 'funnelChart',
  gauge: 'gaugeChart',
  heatmap: 'heatmapChart',
  treemap: 'treemapChart'
} as const satisfies Record<string, EChartsModuleKey>

const SERIES_EXTRA_MODULES: Partial<Record<keyof typeof SERIES_MODULE_MAP, EChartsModuleKey[]>> = {
  map: ['geoComponent'],
  radar: ['radarComponent']
}

const hasValue = (value: unknown) =>
  value !== undefined && value !== null && (!Array.isArray(value) || value.length > 0)

const asArray = <T>(value: T | T[] | undefined): T[] => {
  if (!value) {
    return []
  }

  return Array.isArray(value) ? value : [value]
}

const queueModuleLoad = (key: EChartsModuleKey) => {
  if (loadedModules.has(key)) {
    return Promise.resolve()
  }

  if (!pendingModuleLoads.has(key)) {
    const loader = MODULE_LOADERS[key]

    pendingModuleLoads.set(
      key,
      loader()
        .then((module) => {
          echarts.use([module.install])
          loadedModules.add(key)
        })
        .finally(() => {
          pendingModuleLoads.delete(key)
        })
    )
  }

  return pendingModuleLoads.get(key) as Promise<void>
}

export async function ensureEChartsModules(keys: EChartsModuleKey[] = []) {
  const uniqueKeys = Array.from(new Set(keys))
  await Promise.all(uniqueKeys.map((key) => queueModuleLoad(key)))
}

export function resolveEChartsModules(
  option: import('echarts').EChartsOption = {},
  extraModules: EChartsModuleKey[] = []
) {
  const modules = new Set<EChartsModuleKey>(['canvasRenderer', ...extraModules])

  if (hasValue(option.title)) {
    modules.add('titleComponent')
  }

  if (hasValue(option.tooltip)) {
    modules.add('tooltipComponent')
  }

  if (hasValue(option.legend)) {
    modules.add('legendComponent')
  }

  if (hasValue(option.graphic)) {
    modules.add('graphicComponent')
  }

  if (hasValue(option.dataZoom)) {
    modules.add('dataZoomComponent')
  }

  if (hasValue(option.toolbox)) {
    modules.add('toolboxComponent')
  }

  if (hasValue(option.brush)) {
    modules.add('brushComponent')
  }

  if (hasValue(option.geo)) {
    modules.add('geoComponent')
  }

  if (hasValue(option.visualMap)) {
    modules.add('visualMapComponent')
  }

  if (hasValue(option.radar)) {
    modules.add('radarComponent')
  }

  if (hasValue(option.xAxis) || hasValue(option.yAxis)) {
    modules.add('gridComponent')
  }

  asArray<Record<string, unknown>>(
    option.series as Record<string, unknown> | Record<string, unknown>[]
  ).forEach((seriesItem) => {
    const type = seriesItem?.type

    if (typeof type === 'string' && type in SERIES_MODULE_MAP) {
      const moduleKey = SERIES_MODULE_MAP[type as keyof typeof SERIES_MODULE_MAP]
      modules.add(moduleKey)
      SERIES_EXTRA_MODULES[type as keyof typeof SERIES_MODULE_MAP]?.forEach((key) => {
        modules.add(key)
      })
    }

    if (hasValue(seriesItem?.markPoint)) {
      modules.add('markPointComponent')
    }

    if (hasValue(seriesItem?.markLine)) {
      modules.add('markLineComponent')
    }
  })

  return Array.from(modules)
}

const getPrimaryThemeTokens = () => {
  const tokens: Record<string, string> = {
    '--theme-color': readRootCssVar('--theme-color', '#409eff'),
    '--el-color-primary': readRootCssVar('--el-color-primary', '#409eff')
  }

  for (let i = 1; i <= 9; i++) {
    tokens[`--el-color-primary-light-${i}`] = readRootCssVar(
      `--el-color-primary-light-${i}`,
      tokens['--el-color-primary']
    )
    tokens[`--el-color-primary-dark-${i}`] = readRootCssVar(
      `--el-color-primary-dark-${i}`,
      tokens['--el-color-primary']
    )
  }

  for (let i = 1; i <= 15; i++) {
    tokens[`--el-color-primary-custom-${i}`] = readRootCssVar(
      `--el-color-primary-custom-${i}`,
      tokens['--el-color-primary']
    )
  }

  return tokens
}

const getThemePalette = () => getThemeChartPalette()

const knownPrimaryThemeTokens = new Map<string, Set<string>>()

const rememberPrimaryThemeTokens = (tokens = getPrimaryThemeTokens()) => {
  Object.entries(tokens).forEach(([name, value]) => {
    if (!knownPrimaryThemeTokens.has(name)) {
      knownPrimaryThemeTokens.set(name, new Set())
    }

    knownPrimaryThemeTokens.get(name)?.add(value.toLowerCase())
  })
}

const buildPrimaryThemeColorMap = (currentTokens: Record<string, string>) => {
  const colorMap = new Map<string, string>()

  Object.entries(currentTokens).forEach(([name, currentValue]) => {
    knownPrimaryThemeTokens.get(name)?.forEach((knownValue) => {
      if (knownValue !== currentValue.toLowerCase()) {
        colorMap.set(knownValue, currentValue)
      }
    })
  })

  return colorMap
}

const replaceKnownPrimaryThemeColors = (value: unknown, colorMap: Map<string, string>): unknown => {
  if (typeof value === 'string') {
    return colorMap.get(value.toLowerCase()) ?? value
  }

  if (Array.isArray(value)) {
    return value.map((item) => replaceKnownPrimaryThemeColors(item, colorMap))
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, item]) => [
        key,
        replaceKnownPrimaryThemeColors(item, colorMap)
      ])
    )
  }

  return value
}

if (typeof document !== 'undefined') {
  rememberPrimaryThemeTokens()
}

export const refreshEChartsTheme = () => {
  const currentTokens = getPrimaryThemeTokens()
  const colorMap = buildPrimaryThemeColorMap(currentTokens)
  rememberPrimaryThemeTokens(currentTokens)

  document.querySelectorAll<HTMLElement>('[_echarts_instance_]').forEach((element) => {
    const chart = echarts.getInstanceByDom(element)

    if (!chart || chart.isDisposed()) {
      return
    }

    const currentOptions = chart.getOption()
    const nextOptions = replaceKnownPrimaryThemeColors(currentOptions, colorMap)

    chart.setOption({
      ...(nextOptions as object),
      color: getThemePalette()
    })
    chart.resize()
  })
}
