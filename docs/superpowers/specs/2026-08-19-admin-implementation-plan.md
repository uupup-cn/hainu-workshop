# 管理后台落地方案

> 版本：v1.0
> 日期：2026-08-19
> 基于设计文档 v2.0 + Art Design Pro X 模板

---

## 1. 模板概述

**模板名称**：Art Design Pro X UI

**模板路径**：C:/Users/PC/Downloads/api截图/art-design-pro-x-ui-main

**技术栈**：Vue 3.5 + Vite 8 + TypeScript 5.6 + Element Plus 2.11 + Pinia 3.0 + Vue Router 4.5 + Tailwind CSS v4 + Axios + Vue I18n

**与项目设计文档技术栈匹配度**：100% 匹配

---

## 2. 技术栈对照

| 项 | 项目设计文档 | 模板实际 | 匹配 |
|:--|:------|:------|:----:|
| 框架 | Vue 3 | Vue 3.5 | YES |
| 构建 | Vite | Vite 8 | YES |
| 语言 | TypeScript | TypeScript 5.6 | YES |
| UI 库 | Element Plus | Element Plus 2.11 | YES |
| 状态管理 | Pinia | Pinia 3.0 | YES |
| 路由 | Vue Router | Vue Router 4.5 | YES |
| HTTP | Axios | Axios 1.12 | YES |
| CSS | — | Tailwind CSS v4 + SCSS | YES |
| 测试 | Vitest | Vitest 4.1 + Playwright | YES |
| 富文本 | 需要（内容管理） | wangEditor 5.1 | YES |
| 图表 | 需要（仪表盘） | ECharts 6.0 | YES |
| Excel 导入 | 需要（课表导入） | xlsx 0.18 | YES |
| 二维码 | 需要（网页端扫码登录） | qrcode.vue 3.6 | YES |
| 拖拽 | 需要（排序） | vue-draggable-plus | YES |
| 文件管理 | 需要（文件中心） | 内置 file-center | YES |
---

## 3. 模板模块与项目需求映射

### 3.1 可直接复用的模块（开箱即用）

| 项目一级分类 | 项目二级分类 | 模板对应页面 | 说明 |
|:------------|:------------|:-----------|:-----|
| 仪表盘 | 控制台 | views/dashboard/console | 直接使用 |
| 仪表盘 | 分析仪表 | views/dashboard/analysis | 直接使用 |
| 系统监控 | 在线用户 | views/monitor/online-user | 直接使用 |
| 系统监控 | 缓存管理 | views/monitor/cache | 直接使用 |
| 系统监控 | 服务器信息 | views/monitor/server | 直接使用 |
| 系统监控 | 系统日志 | views/system/operation-log | 直接使用 |
| 系统监控 | 用户反馈 | views/system/feedback | 直接使用 |
| 系统监控 | 登陆日志 | views/system/login-log | 直接使用 |
| 系统监控 | 操作日志 | views/system/operation-log | 直接使用 |
| 系统管理 | 功能管理 | views/system/menu | 直接使用 |
| 系统管理 | 角色管理 | views/system/role | 直接使用 |
| 系统管理 | 用户管理 | views/system/user | 直接使用 |
| 系统管理 | 字典管理 | views/system/dict | 直接使用 |
| 系统管理 | 通知管理 | views/system/notification | 直接使用（含类型+列表+详情） |
| 系统管理 | 站点设置 | views/system/site-setting | 直接使用 |
| 系统管理 | 文件中心 | views/system/file-center | 直接使用 |

### 3.2 需新建的模块（基于模板组件开发）

| 项目模块 | 具体功能 | 开发方式 | 可复用的模板能力 |
|:--------|:--------|:--------|:----------------|
| 新生模块 | 入学指南 | 内容管理列表+详情 | content 模式 + wangEditor |
| 新生模块 | 生活攻略 | 校区>主题两级树管理 | useTable + ArtTable |
| 新生模块 | 新生 FAQ | 分类 CRUD + 问题 CRUD | useTable + ArtSearchBar |
| 新生模块 | 找室友 | 功能配置 + 信息列表管理 | useTable + 表单组件 |
| 智慧海大 | 海大介绍 | 5 条目富文本编辑 | wangEditor + 图片上传 |
| 智慧海大 | 电话簿 | 分类(联动校区) + 条目 CRUD | useTable + ArtSearchBar |
| 智慧海大 | 校历 | 模式切换 + 图片上传/日历编辑 | 表单 + 自定义日历组件 |
| 智慧海大 | 校园地图 | 图片上传 + 标注点管理 | 表单 + 坐标定位 |
| 智慧海大 | 校园出行 | 时刻表/车站/指南 CRUD | useTable + ArtTable |
| 智慧海大 | 校园数据库 | 校区/学院/专业/书院/楼栋 CRUD | useTable + 树形组件 |
| 社区模块 | 二手集市-分类管理 | 分类 CRUD | views/content/category 复用 |
| 社区模块 | 二手集市-商品管理 | 商品列表 + 详情 + 举报管理 | useTable + ArtTable |
| 社区模块 | 快讯管理 | 快讯 CRUD + 置顶 + 发布类型 | wangEditor + useTable |
| 社区模块 | 校友圈-版块管理 | 版块 CRUD | useTable + ArtTable |
| 社区模块 | 校友圈-帖子管理 | 帖子列表 + 置顶 + 删除 + 评论(楼中楼)管理 | useTable + ArtTable |
| 社区模块 | 校友圈-表白墙管理 | 表白墙列表 + 删除 | useTable + ArtTable |
| 社区模块 | 抽奖管理 | 活动 CRUD + 奖品配置 + 中奖数据导出 | useTable + wangEditor + xlsx |
| 工具模块 | 工具管理 | 工具 CRUD + 积分配置 | useTable + ArtTable |
| 工具模块 | 分类管理 | 工具分类 CRUD | useTable + ArtTable |
| 工具模块 | 使用记录 | 使用次数统计 + 分享记录 | useTable + ArtTable |
| 工具模块 | 影视解析配置 | 解析线路 + API 接口 CRUD | useTable + ArtTable |
| 课表模块 | 课程管理 | 课程库 + 课程颜色 CRUD | useTable + ArtTable |
| 课表模块 | 学习周管理 | 学期 + 周制 CRUD | useTable + ArtTable |
| 课表模块 | 节次管理 | 节次 CRUD | useTable + ArtTable |
| 课表模块 | 分享码管理 | 分享码列表 + 启停 | useTable + ArtTable |

### 3.3 需删除的模块

| 模板模块 | 删除原因 |
|:--------|:--------|
| views/mall/ | 完整电商模块，项目不需要 |
| views/data-screen/ | 数据大屏，项目不需要 |
| views/workflow/ | 工作流引擎，项目不需要 |
| views/scheduler/ | 任务调度，项目不需要 |
| views/dev-tools/ | AI 生成器，项目不需要 |
| views/toolbox/ | 工具箱，项目不需要 |
| api/mall/ api/mall.ts | 电商接口 |
| api/workflow.ts api/scheduler.ts | 工作流/调度接口 |
| api/ai-assistant.ts api/ai-generator.ts | AI 接口 |
| router/modules/mall.ts workflow.ts scheduler.ts dev-tools.ts tools.ts data-screen.ts | 对应路由 |
| store/modules/ai-generator.ts data-screen.ts | 对应状态 |
---

## 4. 模板核心架构能力

| 能力 | 说明 | 项目受益点 |
|:----|:-----|:----------|
| 动态菜单 + 动态路由 | 路由配置驱动菜单生成 | 三级分类直接通过路由配置实现 |
| 登录态恢复 + Token 刷新 | Token 长期有效 + 自动刷新 | 小程序/网页端长期登录态 |
| 权限控制 | authList + useAuth 指令 | 按钮级权限开箱即用 |
| 亮色/暗色主题 | 主题切换 + 主题色配置 | 前端配置项-主题色 |
| 通用表格方案 | ArtSearchBar + ArtTable + useTable | 所有 CRUD 页面复用 |
| 富文本编辑器 | wangEditor 集成 | 入学指南/生活攻略/海大介绍等内容管理 |
| 文件中心 | 上传/下载/目录管理 | 图片上传/文件管理 |
| 国际化 | Vue I18n 中英文 | 项目只用中文，保留框架不删 |
| Excel 导入导出 | xlsx | 课表文件导入功能 |
| 二维码 | qrcode.vue | 网页端扫码登录 |
| 拖拽排序 | vue-draggable-plus | 所有列表排序 |
| 图表 | ECharts | 仪表盘统计图表 |

---

## 5. 项目结构

本项目拆分为两个独立应用：

### 应用一：hainu-server（后端 + 管理后台 + 网页端）

`
hainu-server/
  server/               # Koa.js 后端 API
  admin/                # Vue3 管理后台（Art Design Pro X 模板）
  web/                  # Vue3 网页端（独立项目）
  docs/                 # 设计文档
  package.json          # workspace 根配置
`

### 应用二：hainu-miniprogram（微信小程序，独立仓库）

`
hainu-miniprogram/
  pages/                # 页面
  components/           # 组件
  utils/                # 工具
  app.json              # 小程序配置
`

---

## 6. 落地步骤

### 步骤 1：模板复制与清理

1. 复制模板到项目 admin/ 目录
2. 删除不需要的模块（见 3.3）
3. 清理 locales 仅保留中文
4. 更新 package.json 项目名为 hainu-workshop-admin
5. 配置 .env 开发环境 API 地址指向后端

### 步骤 2：路由与菜单重构

按项目三级分类重构路由模块：

```
src/router/modules/
  dashboard.ts        # 仪表盘（控制台 + 分析仪表 + 二手集市分析）
  freshman.ts         # 新生模块（入学指南/生活攻略/FAQ/找室友）
  wise.ts             # 智慧海大（海大介绍/电话簿/校历/地图/出行/校园数据库）
  community.ts        # 社区模块（二手集市分类管理/商品管理）
  schedule.ts         # 课表模块（课程库/颜色/学期/周制/节次/分享码）
  monitor.ts          # 系统监控（保留模板原有）
  system.ts           # 系统管理（保留模板原有 + 用户管理改造）
  notification.ts     # 通知管理（保留模板原有）
```

### 步骤 3：API 层对接

按 API 文档 v1.10 重写 src/api/ 目录：

```
src/api/
  auth.ts             # 登录/注册（管理员登录）
  user.ts             # 用户管理 + 认证审核
  guide.ts            # 入学指南 CRUD
  life.ts             # 生活攻略 CRUD
  faq.ts              # FAQ 分类+问题 CRUD
  roommate.ts         # 找室友配置+信息管理
  intro.ts            # 海大介绍 CRUD
  phonebook.ts        # 电话簿 CRUD
  calendar.ts         # 校历管理
  map.ts              # 校园地图+标注 CRUD
  bus.ts              # 校园出行 CRUD
  campus-data.ts      # 校园数据库（校区/学院/专业/书院/楼栋）
  marketplace.ts      # 二手集市（分类+商品+举报）
  news.ts             # 快讯 CRUD
  alumni.ts           # 校友圈（版块+帖子+表白墙+评论(楼中楼)+举报）
  lottery.ts           # 抽奖（活动+奖品+中奖记录+导出）
  courses.ts          # 课表（课程/颜色/学期/周制/节次/分享码）
  tools.ts            # 工具箱（分类/工具/使用记录/影视解析线路）
  notifications.ts    # 通知管理（保留模板原有）
  monitor.ts          # 系统监控（保留模板原有）
  system.ts           # 系统管理（保留模板原有）
  site-settings.ts    # 站点设置（保留模板原有）
  files.ts            # 文件中心（保留模板原有）
  feedback.ts         # 用户反馈（保留模板原有）
  logs.ts             # 日志（保留模板原有）
```

### 步骤 4：页面开发

按优先级分批开发：

| 批次 | 模块 | 页面数 | 依赖 |
|:----|:-----|:------:|:-----|
| 第 1 批 | 仪表盘 + 系统管理 + 系统监控 | ~15 | 模板已有，改造对接 API |
| 第 2 批 | 智慧海大-校园数据库 | ~5 | 基础数据先行 |
| 第 3 批 | 新生模块 | ~10 | 依赖校园数据库 |
| 第 4 批 | 智慧海大（介绍/电话簿/校历/地图/出行） | ~15 | 依赖校园数据库 |
| 第 5 批 | 社区模块（二手集市 + 快讯 + 校友圈 + 抽奖） | ~15 | 独立 |
| 第 6 批 | 课表模块 | ~8 | 独立 |
| 第 7 批 | 工具模块 | ~6 | 独立 |
### 步骤 5：用户管理改造

模板的 user 管理是后台管理员，项目需要同时管理前台小程序用户：

- views/system/user：保留，改造为后台管理员用户
- 新增 views/system/app-user：小程序用户管理（UID/身份/认证状态/积分）
- 新增 views/system/auth-review：认证审核列表（待审核/已通过/已驳回 + 审核操作）

### 步骤 6：系统管理改造

#### 6.1 功能管理（菜单管理）

- 使用 Element Plus 的 el-tree 组件展示菜单树
- 支持拖拽排序（vuedraggable-plus）
- 新增/编辑使用 el-dialog + el-form，菜单类型选择 el-radio-group（目录/页面）
- 目录类型：只需填写名称和图标
- 页面类型：需填写名称、路径、组件路径、图标
- 是否可见使用 el-switch
- 删除时检查是否有子级，有则提示"请先删除子菜单"

#### 6.2 角色管理

- 角色列表使用 ArtTable + ArtSearchBar
- 权限分配：el-dialog 左侧 el-tree（菜单树，含按钮级权限），右侧展示已选权限
- 支持全选/半选（el-tree 的 indeterminate 状态）
- 保存时调用 PUT /api/v1/admin/roles/:id/permissions 全量覆盖
- 用户关联：el-dialog 展示用户列表，支持添加/移除

#### 6.3 用户管理

- 小程序用户列表：展示 UID、昵称、身份、认证状态、积分、注册时间
- 认证审核：待审核列表，点击审核弹出详情（姓名、学号、专业、证明图片）
- 审核通过/驳回使用 el-popconfirm 确认，驳回需填写原因
- 后台用户管理：标准 CRUD，支持角色分配（el-select multiple）
- 密码重置：生成随机密码并通过邮件/短信发送（可选）

#### 6.4 字典管理

- 左侧 el-tree 展示字典类型，右侧 ArtTable 展示字典数据
- 字典类型 CRUD 使用 el-dialog
- 字典数据 CRUD 使用 el-dialog，字典类型选择 el-select（从左侧树中选取）
- 启停使用 el-switch，切换时调用 PUT /api/v1/admin/dicts/:id
- 缓存刷新：变更时调用 POST /api/v1/admin/cache/refresh-dict

#### 6.5 通知管理

- 通知类型管理：标准 CRUD
- 通知列表：ArtTable，支持按类型、推送对象筛选
- 新增通知：选择类型 → 填写标题/内容（el-input type=textarea）→ 选择推送对象（el-checkbox-group）→ 点击发送
- 发送调用 POST /api/v1/admin/notifications/push
- 撤回使用 el-popconfirm 确认

#### 6.6 站点设置改造

在模板 site-setting 基础上增加项目特有配置项，按分组展示：

**系统配置组（basic）：**
- 站点名称（el-input）
- 登录验证码（el-switch）
- 密码最小长度（el-input-number，min=4，max=20）
- 登录失败锁定次数（el-input-number，min=1，max=10）
- 登录锁定时长（el-input-number，单位：分钟）
- JWT有效期（el-input-number，单位：小时）
- 默认分页大小（el-input-number，min=10，max=100）

**前端配置组（frontend / 小程序配置）：**
- 小程序名称（el-input）
- 小程序版本号（el-input）
- 主题色（el-color-picker）
- 启动页背景图（el-upload，accept=image/*）
- 导航页背景图（el-upload，accept=image/*）
- 关于我们（wangEditor 富文本）
- 客服微信（el-input）
- 客服QQ（el-input）
- 客服电话（el-input）
- 缴费小程序路径（el-input）
- 缴费说明文案（wangEditor 富文本）

**文件中心配置组（file）：**
- 允许上传类型（el-input，placeholder="如 jpg,png,pdf"）
- 单文件最大尺寸（el-input-number，单位：MB，min=1，max=50）
- 同时上传数量（el-input-number，min=1，max=20）
- 文件保留天数（el-input-number，0=永久）

**假期/开学配置组（holiday）：**
- 开学/假期模式（el-radio-group：school / holiday）
- 假期类型（el-radio-group：winter / summer，仅假期模式可用）
- 开学日期（el-date-picker，type=date）
- 找室友修改次数（el-input-number，min=1，max=10）
- 找室友开放时间（el-date-picker，type=datetimerange）
- 海报分享模板（el-select，选项从 poster_templates 表获取）

#### 6.7 文件中心

- 文件列表：ArtTable，展示文件名、大小（格式化）、类型、上传者、上传时间
- 上传：el-upload，支持拖拽，multiple，accept 根据配置动态设置
- 下载：window.open 打开 /api/v1/admin/files/:id/download
- 删除：el-popconfirm 确认后调用 DELETE
- 预览：图片类型直接预览，其他类型提示下载
- 统计：顶部展示文件总数和总存储空间


## 7. 模板组件复用清单

| 组件 | 用途 | 项目使用场景 |
|:----|:-----|:-----------|
| ArtSearchBar | 搜索栏 | 所有列表页搜索 |
| ArtTable | 表格 | 所有 CRUD 列表 |
| ArtTableHeader | 表格头部 | 列表操作按钮 |
| useTable | 表格 Hook | 分页/排序/数据加载 |
| wangEditor | 富文本编辑器 | 入学指南/生活攻略/海大介绍/乘车指南 |
| ImageCrop | 图片裁剪 | 头像/图片上传 |
| QRCode | 二维码 | 网页端扫码登录 |
| ECharts | 图表 | 仪表盘统计 |
| vue-draggable-plus | 拖拽排序 | 所有列表排序 |
| xlsx | Excel | 课表导入 |

---

## 8. 注意事项

1. **模板版本较新**（Vite 8 / Vue 3.5），开发环境 Node.js 需 >= 20.19.0，pnpm >= 8.8.0
2. **国际化**：模板默认中英文双语，项目仅需中文，保留框架但删除 en.json 内容或留空
3. **mock-server**：模板自带 mock 服务（mock-server.mjs），开发初期可对接 mock 数据，后续切换真实 API
4. **权限体系**：模板 authList 是按钮级权限，需与后端 permissions 表对接
5. **动态路由**：模板支持后端下发菜单 + 前端静态路由两种模式，建议初期用前端静态路由，后续对接后端动态菜单
6. **Tailwind CSS v4**：模板使用 Tailwind v4（非传统 config 方式），样式定制方式与 v3 不同
7. **AGENTS.md/CLAUDE.md**：模板自带 AI 协作文件，需替换为项目自己的 AGENTS.md

---

## 附录：实施状态（2026-08-23）

### 已完成

| 范围 | 状态 |
|:--|:--|
| 7 个开发批次全部页面 | ✅ 已建成并注册（含第 5 步新增的 app-user 小程序用户、auth-review 认证审核页；补齐学期周制页面） |
| 动态路由 | ✅ 采用**后端动态菜单**模式（偏离计划注 5 的"初期前端静态"建议）：GET /api/v3/system/menus 驱动，菜单数据由 seed 按 menuKey upsert 增量同步（prisma/menu-data.ts，169 项含按钮权限） |
| 模板集成接口 | ✅ 计划未预见的必要补充：登录引导/后台用户/角色/字典/站点设置/文件中心/监控/日志/反馈/通知的模板路径端点（详见 api.md §10.17，共 74 个） |
| API 层结构 | ⚠️ 与计划步骤 3 的 25 文件清单不同：实际合并为 7 个业务文件（freshman/wise/community/schedule/tool-module/app-user/campus-data）+ 模板原有文件 |
| 二手集市分析仪表 | ✅ 已建（views/dashboard/marketplace-analytics）；「分析仪表」模板演示页未注册（数据为假数据，待定义真实指标后启用） |

### 已知遗留（待项目负责人决策）

1. **模板遗留 demo 文件约 152 个仍在磁盘并已入库**：views/dashboard/{analytics,crm,crypto,ecommerce,hrm,jobs,sales,social-media}（114）、views/template、views/widgets、views/{result,outside,change}、views/system/{department,post,system-param,visitor-analytics}、views/content（7 个，路由已停用）。计划 §3.3 建议删除，当前仅停用未删。
2. **mock-server.mjs（2959 行）与 .auto-import.json 已入库**：后端接口已全部真实可用，mock 服务无使用场景。
3. **admin 双锁文件并存**：package-lock.json 与 pnpm-lock.yaml/pnpm-workspace.yaml 同时入库，存在包管理器混用风险，建议保留一套。
4. **模板 api 死代码**：api/{tools,posts,departments,security-audit,system-params,content*,content-category,content-tag}.ts 调用的后端接口不存在（对应页面未注册或部分功能不可用）；部分模板页面调用的次级接口（files 批量操作、notifications inbox、monitor cache 清理等）后端未实现。
5. **monitor/security-audit 页面**已注册但后端无 /security-audit 接口（页面可用性受限）。
