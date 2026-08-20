# 海大工坊 · 设计系统（Design Tokens）

> 来源：Ardot 设计系统输出
> 状态：已确认 ✅

## 设计关键词

青春、专业、清爽、轻量、可信赖、现代校园

## 色彩令牌

### 主色 · Primary（校园蓝）

| Token | 色值 | 用途 |
|:--|:--|:--|
| primary-50 | #EAF2FE | 主色浅背景、Tag 底色、选中态底 |
| primary-100 | #D1E3FC | Hover 浅态、分隔装饰 |
| primary-200 | #A3C7F8 | 弱按钮填充、图表辅助 |
| primary-300 | #75AAF4 | 禁用态主色、链接按下 |
| primary-500 | #1D6FEB | 主按钮、顶部导航、重要链接 |
| primary-700 | #11448F | 按下态、深色强调 |
| primary-900 | #08214D | 深色顶栏、深色模式主色 |

### 辅助色 · Secondary

- mint-500 #16B3A3（智慧海大模块、积极操作）
- orange-500 #F59E0B（工具箱 / 积分 / 徽章）

### 功能色 · Functional

- success #10B981 / success-bg #D1FAE5
- warning #F59E0B / warning-bg #FEF3C7
- danger #EF4444 / danger-bg #FEE2E2
- info #3B82F6

### 中性色 · Neutral

| Token | 色值 | 用途 |
|:--|:--|:--|
| neutral-0 | #FFFFFF | 卡片底 |
| neutral-50 | #FAFAFA | 二级底色 |
| neutral-100 | #F4F5F7 | 页面底色 bg-page |
| neutral-200 | #E5E7EB | 边框、分割线 |
| neutral-300 | #D1D5DB | 强边框、禁用控件 |
| neutral-400 | #9CA3AF | 占位文字 |
| neutral-500 | #6B7280 | 次要文字 text-tertiary |
| neutral-600 | #4B5563 | 正文文字 text-secondary |
| neutral-700 | #374151 | 标题 |
| neutral-800 | #1F2937 | 一级文字 |
| neutral-900 | #111827 | 主文字 text-primary |

## 字体令牌

主字体栈：`-apple-system, BlinkMacSystemFont, "PingFang SC", "Microsoft YaHei", "Helvetica Neue", sans-serif`
数字：`tnum` 等宽。

| Token | 字号/行高/字重 | 用途 |
|:--|:--|:--|
| display | 36/44/600 | 启动页、空状态主标题 |
| h1 | 28/36/600 | 详情主标题、弹窗标题 |
| h2 | 22/30/600 | 区块标题 |
| h3 | 18/26/600 | 卡片标题、列表大项 |
| h4 | 16/24/600 | 小标题、按钮文字 |
| body-lg | 16/24/400 | 大正文 |
| body | 14/22/400 | 默认正文 |
| caption | 12/18/400 | 辅助说明、时间戳 |
| label | 11/16/500 | 标签、Tag、徽章 |
| button | 16/24/500 | 全局按钮文字 |

## 间距令牌（4 倍数）

space-1 4 / space-2 8 / space-3 12 / space-4 16（page-padding）/ space-5 20 / space-6 24 / space-8 32 / space-10 40 / space-12 48

## 圆角令牌

- radius-none 0 / radius-sm 4 / radius-md 8 / radius-lg 12 / radius-xl 16 / radius-2xl 20 / radius-full 999

## 阴影令牌

- shadow-none / shadow-xs / shadow-sm / shadow-card / shadow-md / shadow-float / shadow-tab

## 图标规范

- 主风格：线描 Linear
- 网格：24×24，1px 安全区
- 描边：1.5px
- 端点/拐角：round/round
- 尺寸档位：16 / 20 / 24 / 32
- 默认色：currentColor（text-secondary）
- 主色场景：选中态 primary-500；危险：danger；禁用：neutral-300 0.6

## 全局硬性约束

- 颜色/字号/圆角/间距/阴影只引用 Design Tokens，禁止新增
- 主色面积 ≤25%，薄荷绿 ≤10%，橙色 ≤5%
- 所有时间/价格/节次/UID 等数字使用 `tnum`
- 跨端一致：小程序 + Web 共用组件库