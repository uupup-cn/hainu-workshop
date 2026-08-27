# 海大工坊 · 网页端独立设计系统（v2.3）

> 日期：2026-08-27
> 状态：已确认 ✅（已落地，构建通过、线上生效 http://159.75.116.207/）
> 定位：网页端（hainu-server/web）的独立设计语言，与小程序解耦。
>
> 小程序端沿用 `records/00-design-system.md`（校园蓝、跨端共用约束）；**网页端自 v2.3 起采用本记录定义的独立设计语言**，原 00/01 记录中"小程序与 Web 共用组件库/同一套 Tokens"的约束对网页端不再适用。

## 一、美学定位

沉浸式热带校园 × 奇幻冒险：以深海蓝 institutional 锚点保证"海南大学大气"，用阳光金/热带青做活力，幻紫仅作宠物/冒险点缀（≤5%）。访客首页奇幻浓度最高（吉祥物 + 金紫点缀），专区奇幻浓度降低、留白克制，但**全站共用同一 Token 表与组件语言**，风格色调一致。

## 二、配色 Token（web/src/styles/tokens.css）

| 角色 | Token | 色值 | 说明 |
|:--|:--|:--|:--|
| 主色 | --ocean-500 | #0e5ad8 | 深海蓝，主按钮/导航 |
| | --ocean-700 | #08398f | 按下/深色强调 |
| | --ocean-50 | #eaf1fe | 浅底/选中 |
| 辅色 | --amber-500 | #f59e0b | 阳光金，CTA/活力 |
| | --teal-500 | #14b8a6 | 热带青，分类/积极 |
| 奇幻点缀(≤5%) | --fantasy-500 | #7c3aed | 幻紫，宠物/冒险 |
| | --coral-500 | #ff6b6b | 珊瑚，徽章/警示 |
| 语义 | --success/--warning/--danger/--info | 沿用 | 含 -bg 浅底 |
| 背景 | --bg-page | #faf6ef | 暖米底 |
| | --bg-card | #ffffff | 卡片 |
| 文字 | --fg-1/2/3 | #14142b/#475569/#94a3b8 | 三级 |
| 中性 | --neutral-50…900 | 暖灰阶 | 边框/分割 |

约束：主色面积 ≤25%、奇幻紫 ≤5%、暖米底作页面主背景；所有数值只引用 token。
向后兼容：旧 token 名（--primary-500/--mint-500/--orange-500/--radius-*/--shadow-*）作别名指向新值，迁移期保留，已迁移页面直接用新名。

## 三、字体 / 字号

- 展示标题：`Sora` 700/800/900 + CJK 回退 `Noto Sans SC`（Google Fonts `<link>` 引入）。
- 正文：系统栈；数字 `tnum` 等宽。
- 大标题 token：`--fs-display-xl: clamp(48px, 8vw, 96px)`、`--fs-title-section: clamp(28px, 4vw, 40px)`；其余 display/h1-h4/body-lg/body/caption/label/button 档位见 tokens.css。

## 四、图标

全站统一 `lucide-vue-next`，24×24，1.5px 描边，`currentColor`，尺寸档 16/20/24/32。封装 `LucideIcon.vue` + 业务图标注册表 `icon-registry.ts`（70+ 语义名→lucide 组件，命名导入按需 tree-shake）。**界面全程禁止使用 emoji**；数据驱动图标（工具 icon）用 `tool-icons.ts` 的 `toolKey→Lucide` 映射，忽略后端可能下发的 emoji。

## 五、动效（GSAP）

访客首页/专区：`AppStaggerReveal`（`gsap.from` + `stagger grid:'auto'` + `back.out(1.4)`，scrollTrigger once）；Hero 柔光/吉祥物 CSS 浮动。全部遵守 `prefers-reduced-motion`（直接显示终态）。动效 token：`--dur-fast/base/slow/hero`、`--ease-out/ease-back`。

## 六、圆角 / 阴影 / 间距（升级，更大气）

- 圆角：`--r-sm 6 / --r-md 10 / --r-lg 14 / --r-xl 20 / --r-2xl 28 / --r-full 999`。
- 阴影：`--sh-xs/sm/card/md/float/hero`（更强层次）。
- 间距：4 倍数体系 `--space-1…24`；区块节奏 `--section-pad-y: clamp(64px, 9vw, 128px)`。

## 七、信息架构（三专区 + 全屏官网式）

| 路由 | 页面 | meta.zone | requiresAuth |
|:--|:--|:--|:--|
| `/` | 访客首页 VisitorHome | visitor | 否 |
| `/freshman` | 新生专区 FreshmanZone | freshman | 是 |
| `/student` | 在校生专区 StudentZone | student | 是 |
| 各模块叶子页（/guide /intro /marketplace …） | 保持平级 path（保深链），meta 标归属专区 | freshman/student | 按页 |

- 顶部导航：左 logo / 中仅 首页·新生专区·在校生专区 三入口 / 右登录或用户 chip。毛玻璃（半透明白 + backdrop-blur）sticky。
- 登录后：登录动作自动按 `userInfo.identity` 跳对应专区（`useAuth.identityZone`）；首页不限制，登录态仍可回访客首页。
- 未登录访问专区 → 弹登录弹窗并回首页。
- 移动端：底部 TabBar（Lucide 图标，第 2 格按身份分流）。

## 八、全屏官网式布局（VisitorHome）

Hero-Centric 模式：全幅 Hero（`100svh`，深海蓝→幻紫渐变 + 柔光晕 + 吉祥物 + 巨型标题 + 单主 CTA + 数据栏）→ 全宽幻灯片（`AppCarousel flush`，edge-to-edge 62vh）→ 全宽功能矩阵（`AppSection bg=page` + `ModuleShowcase`）→ 双专区大卡（白底）→ 全宽 CTA（深渐变）→ 全站深色页脚。区块 100% 视口宽度铺满，内容居中限宽 `--container-max: 1200px`。

## 九、四大组件库（web/src/components/）

- **base/**：AppButton(5变体×3尺寸+loading)、AppCard、AppTag、AppSegment、AppEmpty、AppAvatar、AppDialog(Teleport+过渡+ESC+锁滚动+wide)、AppInput、AppToast、AppPillTabs（胶囊 Tab）。
- **icons/**：LucideIcon + icon-registry（70+ 语义图标）。
- **patterns/**：AppSection（全宽区块+眉题/大标题/副题）、AppCarousel（flush 全幅）、AppStaggerReveal（GSAP）、AppCTASection（全宽 CTA）。
- **zone/**：PetMascot（原创奇幻精灵 SVG，roco 风格占位）、ModuleShowcase（模块网格）、ZoneHero（专区全幅头图）。
- 组合式：`useToast`（单例轻提示）、`useAuth`（登录/身份跳转，不修改 store）。

## 十、去重记录

- toast：原 10 处内联复制 → 统一 `useToast` 单例（工具批 `use-tool.ts` + 7 工具组件、社区批 Schedule/Alumni/Marketplace）。
- 弹窗：原 4 处内联 dialog-mask → `AppDialog`（社区批 8 弹窗）。
- pill-tab：原 8 处 `.tab` 复制 → `AppPillTabs`（迁移 7 页；Alumni 工具栏因含下拉/按钮复合结构保留内联）。

## 十一、文件结构

```
web/src/
  styles/        tokens.css / base.css / utilities.css
  components/{base,icons,patterns,zone}/   # 四大库 + index.ts barrel
  composables/   useAuth.ts / useToast.ts
  layouts/       DefaultLayout.vue（三导航+Lucide TabBar+反馈FAB+登录弹窗+页脚+AppToast）
  router/        index.ts（meta.zone/requiresAuth + beforeEach 守卫 + 身份跳转）
  views/         VisitorHome.vue / zones/{FreshmanZone,StudentZone}.vue + 各模块页
  store/ user.ts（未改）  api/（未改）
```

## 十二、依赖与工程

- 新增：`lucide-vue-next`、`@vueuse/core`、`dayjs`、`gsap`（均经负责人确认）。
- 不引 UI 组件库（自建）/ CSS 框架（保持 plain CSS token）/ @vueuse/motion（GSAP 覆盖）。
- `@` 别名（vite + tsconfig paths）；`vue-tsc` 严格模式 0 错误，`vite build` 通过。

## 十三、a11y / 响应式

- `:focus-visible` 全局焦点环；`prefers-reduced-motion` 动效归零；LucideIcon `aria-hidden`；AppDialog `role=dialog aria-modal`；轮播箭头 `aria-label`。
- 断点 `@media (max-width:768px)`：19 页页级 + 全局 `.container` 移动 padding + 响应式组件兜底。

## 十四、部署

nginx（deploy/nginx.conf）服务 `/var/www/hainu-workshop/web-dist/`（构建产物，gitignored）。源码在 `hainu-server/web/`（与 GitHub 一致）。同步流程：本地构建通过 → GitHub → 服务器解包源码 + `npm install` + `npm run build` + 同步 `dist/* → web-dist/`。
