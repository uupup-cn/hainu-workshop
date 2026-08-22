# 海大工坊 全项目实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框语法来跟踪进度。

**目标：** 搭建海大工坊微信小程序 + Web 管理后台 + 自适应网页端 + 后端 API 的完整项目，按阶段顺序逐步实现所有功能模块。

**架构：** Uni-app(Vue3) 小程序/H5 + Vue3/Element Plus 管理后台(基于 Art Design Pro X 模板) + Koa.js/TypeScript 后端 + MySQL/Prisma/Redis，四端共用同一套后端 API。

**技术栈：** Koa.js 2 + TypeScript + Prisma + MySQL 8 + Redis + JWT + sharp + winston + Uni-app(Vue3) + uv-ui + Pinia + Vue3 + Element Plus + Vite + Vitest

---

## 文件结构

### 后端（server/）

src/routes/ — 路由定义（按模块分文件）
src/controllers/ — 请求处理
src/services/ — 业务逻辑
src/middlewares/ — auth/error/ratelimit 中间件
src/utils/ — api-error/jwt/wechat/uid/response/pagination
src/config/ — 配置加载
src/types/ — 类型定义
src/app.ts — Koa 应用入口
prisma/schema.prisma — 数据库 Schema
.env.development / .env.test / .env.production

### 小程序端（miniprogram/）

pages/ — 按模块分组（freshman/wise/community/schedule/tools/profile）
components/ — 四层（base/shared/freshman/student）
store/ — Pinia 状态管理
utils/ — request.ts 请求封装 / auth.ts 登录态管理
api/ — 接口封装
config/ — 环境配置

### 管理后台（admin/）

基于 Art Design Pro X 模板，删除 mall/workflow/scheduler/data-screen/dev-tools/toolbox，按设计文档重构路由与 API。

---

## 阶段 0：项目初始化

### 任务 0.1：后端项目初始化

**文件：** 创建 server/package.json、server/tsconfig.json、server/src/app.ts、server/src/config/index.ts、server/src/middlewares/error.middleware.ts、server/src/utils/api-error.ts、server/src/utils/response.ts

- [ ] 步骤 1：初始化项目并安装依赖
- [ ] 步骤 2：创建 .env.development（15 个环境变量）
- [ ] 步骤 3：创建 config/index.ts（环境变量加载）
- [ ] 步骤 4：创建 ApiError 类和统一响应工具
- [ ] 步骤 5：创建错误处理中间件
- [ ] 步骤 6：创建 app.ts 入口（Koa + CORS + bodyParser + errorHandler）
- [ ] 步骤 7：Commit

### 任务 0.2：Prisma Schema 与数据库初始化

**文件：** 创建 server/prisma/schema.prisma

- [ ] 步骤 1：npx prisma init
- [ ] 步骤 2：编写 schema.prisma（全部表结构，含 users/auth_applications/uid_log/points_log/guide_entries/life_topics/faq_categories/faq_questions/intro_entries/phonebook_categories/phonebook_entries/calendar_settings/map_settings/map_markers/bus_schedules/bus_stations/bus_guide/campuses/colleges/departments/majors/buildings/roommate_settings/roommate_posts/marketplace_items/marketplace_categories/community_modules/reports/news/alumni_sections/alumni_posts/alumni_comments/alumni_likes/lottery_activities/lottery_prizes/lottery_records/courses/course_colors/semesters/term_weeks/sections/share_codes/tool_categories/tools/tool_usage_log/tool_unlocks/video_parse_lines/system_settings/admin_users/roles/permissions/role_permissions/role_users/dicts/dict_types/notification_types/notifications/notification_reads/user_feedback/system_logs/login_logs/operation_logs/files/menus）
- [ ] 步骤 3：npx prisma migrate dev --name init_all_tables
- [ ] 步骤 4：Commit

### 任务 0.3：小程序项目初始化

**文件：** 创建 miniprogram/ 全部骨架

- [ ] 步骤 1：npx degit dcloudio/uni-preset-vue#vite-ts miniprogram
- [ ] 步骤 2：npm install pinia uv-ui
- [ ] 步骤 3：配置 pages.json 基础路由
- [ ] 步骤 4：创建 utils/request.ts（请求封装 + Token 自动携带 + 401 刷新）
- [ ] 步骤 5：创建 store/user.ts（token/identity/isFirstVisit 持久化）
- [ ] 步骤 6：Commit

### 任务 0.4：管理后台模板落地

**文件：** 复制 Art Design Pro X 模板到 admin/

- [ ] 步骤 1：复制模板，删除 node_modules 和 .git
- [ ] 步骤 2：删除无关模块（views/mall/ views/data-screen/ views/workflow/ views/scheduler/ views/dev-tools/ views/toolbox/ 及对应 api/router/store）
- [ ] 步骤 3：配置 .env.development 指向后端
- [ ] 步骤 4：pnpm install && pnpm dev 验证启动
- [ ] 步骤 5：Commit

### 任务 0.5：测试服务器环境搭建

- [ ] 步骤 1：安装 Node.js 20+ / MySQL 8 / Redis / Nginx
- [ ] 步骤 2：创建数据库 hainu_workshop
- [ ] 步骤 3：配置 Nginx 反向代理
- [ ] 步骤 4：部署后端并验证
- [ ] 步骤 5：Commit 服务器配置文件

---

## 阶段 1：用户系统 + 管理后台基础

### 任务 1.1：用户注册/登录 API

**文件：** 创建 server/src/routes/auth.routes.ts、controllers/auth.controller.ts、services/auth.service.ts、utils/jwt.ts、utils/wechat.ts、utils/uid.ts、middlewares/auth.middleware.ts

- [ ] 步骤 1：编写 JWT 工具测试
- [ ] 步骤 2：实现 JWT 签发/验证（Access 7d + Refresh 30d）
- [ ] 步骤 3：编写 UID 生成测试（随机6位 + 去重）
- [ ] 步骤 4：实现 UID 生成（查 uid_log 表去重 + 记录日志）
- [ ] 步骤 5：编写微信授权测试
- [ ] 步骤 6：实现微信 code 转 openid
- [ ] 步骤 7：编写注册 service 测试
- [ ] 步骤 8：实现注册 service（openid 查重 → 创建用户 → 生成 UID → 写 uid_log → 返回 Token）
- [ ] 步骤 9：编写登录 service 测试
- [ ] 步骤 10：实现登录 service（UID + 密码验证 → 返回 Token）
- [ ] 步骤 11：编写 auth 中间件测试
- [ ] 步骤 12：实现 auth 中间件（Token 验证 + 用户注入 ctx）
- [ ] 步骤 13：编写路由（POST /auth/register, POST /auth/login, POST /auth/refresh）
- [ ] 步骤 14：挂载路由到 app.ts 并验证
- [ ] 步骤 15：Commit

### 任务 1.2：小程序端登录注册流程

**文件：** 创建 miniprogram/pages/launch/index.vue、pages/identity/select.vue、pages/auth/login.vue、api/auth.ts、store/user.ts

- [ ] 步骤 1：实现 store/user.ts（token/identity/isFirstVisit 持久化）
- [ ] 步骤 2：实现 api/auth.ts（register/login/refresh 封装）
- [ ] 步骤 3：实现身份选择页（选身份 → 记忆 → 跳转授权）
- [ ] 步骤 4：实现微信授权登录（wx.login → code → register API）
- [ ] 步骤 5：实现启动页（假期模式倒计时 + 进入按钮 + 暑假新生入口）
- [ ] 步骤 6：实现登录态自动恢复
- [ ] 步骤 7：Commit

### 任务 1.3：管理后台登录（复用模板）

**文件：** 修改 admin/src/api/auth.ts、admin/.env.development

- [ ] 步骤 1：修改 auth.ts API 地址指向后端 /api/v1/admin/login
- [ ] 步骤 2：验证模板登录流程能跑通
- [ ] 步骤 3：Commit

### 任务 1.4：用户信息/隐私/认证/积分 API + 后台用户管理

**文件：** 创建 server/src/routes/user.routes.ts + controller + service、server/src/routes/admin/user-admin.routes.ts + controller + service

- [ ] 步骤 1：实现 GET/PUT /user/profile
- [ ] 步骤 2：实现 PUT /user/password
- [ ] 步骤 3：实现 GET /user/public/:uid（隐私设置过滤）
- [ ] 步骤 4：实现 GET/PUT /user/privacy
- [ ] 步骤 5：实现 POST /user/auth-apply + GET /user/auth-status
- [ ] 步骤 6：实现 GET /user/points
- [ ] 步骤 7：实现后台 GET/PUT/DELETE /admin/users
- [ ] 步骤 8：实现后台 GET/PUT /admin/auth-applications/:id/review（审核 + 积分开启 + 站内信）
- [ ] 步骤 9：全部测试通过
- [ ] 步骤 10：Commit

### 任务 1.5：管理后台系统管理 + 系统监控

**文件：** 修改 admin/src/router/modules/system.ts、monitor.ts，创建 admin/src/api/user.ts

- [ ] 步骤 1：重构 system 路由匹配设计文档三级分类
- [ ] 步骤 2：实现小程序用户管理页面（列表 + 详情 + 编辑）
- [ ] 步骤 3：实现认证审核页面（待审核列表 + 通过/驳回）
- [ ] 步骤 4：改造站点设置页面（补充前端配置项）
- [ ] 步骤 5：验证系统监控页面对接后端
- [ ] 步骤 6：Commit

### 任务 1.6：通知中心 + 用户反馈 + 开学/假期管理

**文件：** 创建 server/src/routes/notification.routes.ts、feedback.routes.ts、system.routes.ts；miniprogram/pages/profile/notifications/、feedback/

- [ ] 步骤 1：实现通知中心 API（列表/详情/标记已读/未读数）
- [ ] 步骤 2：实现用户反馈 API（提交/历史）
- [ ] 步骤 3：实现系统设置 API（GET /system/settings）
- [ ] 步骤 4：实现后台通知管理 CRUD + 站点设置 CRUD
- [ ] 步骤 5：实现小程序通知中心页面 + 反馈页面
- [ ] 步骤 6：实现开学/假期模式切换 + 启动页倒计时
- [ ] 步骤 7：Commit

### 任务 1.7：小程序个人设置页面

**文件：** 创建 miniprogram/pages/profile/ 下全部页面

- [ ] 步骤 1：实现个人主页（信息展示）
- [ ] 步骤 2：实现信息编辑页（补全邮箱/QQ/微信/昵称/头像）
- [ ] 步骤 3：实现密码管理页（查看默认密码 + 修改密码）
- [ ] 步骤 4：实现隐私设置页（总开关 + 字段开关 + 预览）
- [ ] 步骤 5：实现认证中心页（申请认证 + 状态展示 + 驳回重试）
- [ ] 步骤 6：实现积分中心页
- [ ] 步骤 7：实现身份修改页（剩余次数 + 24h 冷却期）
- [ ] 步骤 8：Commit

---

## 阶段 2：校园数据库 + 智慧海大

### 任务 2.1：校园数据库 CRUD（API + 后台）
- [ ] 实现校区/学院/专业/书院/楼栋 5 张表 CRUD API
- [ ] 管理后台校园数据库 5 个管理页面
- [ ] 小程序端找室友多级联动数据源接口
- [ ] Commit

### 任务 2.2：海大介绍 + 电话簿
- [ ] 实现海大介绍 5 条目 CRUD API + 小程序页面
- [ ] 实现电话簿（分类联动校区 + 拨号）API + 小程序页面
- [ ] 管理后台海大介绍 + 电话簿管理页面
- [ ] Commit

### 任务 2.3：校历 + 校园地图 + 校园出行
- [ ] 实现校历（图片/日历双模式）API + 小程序页面
- [ ] 实现校园地图（图片 + 标注点）API + 小程序页面
- [ ] 实现校园出行（时刻表/车站/指南）API + 小程序页面
- [ ] 管理后台校历 + 地图 + 出行管理页面
- [ ] Commit

---

## 阶段 3：新生模块

### 任务 3.1：入学指南 + 生活攻略 + 新生FAQ + 新生缴费
- [ ] 实现入学指南 6 条目 CRUD API + 小程序页面
- [ ] 实现生活攻略 4校区x7主题 CRUD API + 小程序页面
- [ ] 实现新生FAQ（分类+搜索+手风琴）API + 小程序页面
- [ ] 实现新生缴费跳转页
- [ ] 管理后台新生模块管理页面
- [ ] Commit

### 任务 3.2：找室友
- [ ] 实现找室友配置 + 发布 + 修改 + 匹配 API
- [ ] 小程序找室友列表 + 发布 + 匹配结果 + 我的信息页
- [ ] 管理后台找室友管理页面
- [ ] Commit

---

## 阶段 4：社区模块

### 任务 4.1：二手集市
- [ ] 实现商品 CRUD + 分类 + 上下架 + 举报 + 智能排序 API
- [ ] 小程序二手集市全部页面
- [ ] 管理后台二手集市分类管理 + 商品管理 + 举报管理
- [ ] Commit

### 任务 4.2：快讯
- [ ] 实现快讯 CRUD + 定向推送 API + 小程序页面
- [ ] 管理后台快讯管理页面
- [ ] Commit

### 任务 4.3：校友圈
- [ ] 实现版块/帖子/表白墙/评论楼中楼/点赞/举报 API
- [ ] 小程序校友圈全部页面
- [ ] 管理后台校友圈管理页面
- [ ] Commit

### 任务 4.4：抽奖
- [ ] 实现活动/奖品/记录 API + 概率计算 + 状态机 + 中奖通知
- [ ] 小程序抽奖页面
- [ ] 管理后台抽奖管理页面 + 中奖数据导出
- [ ] Commit

---

## 阶段 5：课表模块

### 任务 5.1：课程管理 + 课表展示
- [ ] 实现课程 CRUD + 冲突覆盖 + Excel导入 API
- [ ] 小程序课表周视图 + 今日视图 + 视图记忆
- [ ] Commit

### 任务 5.2：课表分享 + 后台课表管理
- [ ] 实现分享码（快照 + 15天 + 3个 + 身份校验）API
- [ ] 管理后台课程库/颜色/学期/周制/节次/分享码管理
- [ ] Commit

---

## 阶段 6：工具箱

### 任务 6.1：工具框架 + 积分机制
- [ ] 实现工具分类/列表/使用/解锁/积分扣除 API
- [ ] 小程序工具箱主页 + 积分扣除交互
- [ ] 管理后台工具管理 + 分类管理 + 使用记录
- [ ] Commit

### 任务 6.2：10 个工具实现
- [ ] 证件照生成 / 影视解析 / 摇骰子
- [ ] 科学计算器
- [ ] SBTI/转盘/舒尔特/MBTI/黑暗三角/七宗罪 + 分享海报
- [ ] 管理后台影视解析线路配置
- [ ] Commit

---

## 阶段 7：网页端适配

### 任务 7.1：网页端编译 + 自适应 + 登录
- [ ] Uni-app 编译 H5 + 响应式布局适配
- [ ] 网页端登录（UID+密码 + 电脑端扫码入口）
- [ ] 全部模块网页端验证
- [ ] Commit

---

## 依赖关系

阶段 0（初始化）
  -> 阶段 1（用户系统 + 管理后台基础）
       -> 阶段 2（校园数据库 + 智慧海大）
            -> 阶段 3（新生模块，找室友依赖校园数据库）
       -> 阶段 4（社区模块，认证依赖用户系统）
       -> 阶段 5（课表，独立）
       -> 阶段 6（工具箱，积分依赖用户系统）
            -> 阶段 7（网页端，依赖全部模块）

阶段 4/5/6 可并行开发（都只依赖阶段 1）。

---

## 自检

### 1. 规格覆盖度

| 设计文档模块 | 对应任务 | 覆盖 |
|:------------|:---------|:----:|
| 用户注册/登录/身份/UID/JWT | 0.2 + 1.1 + 1.2 | YES |
| 个人信息/隐私/认证/积分 | 1.4 + 1.7 | YES |
| 通知中心/用户反馈 | 1.6 | YES |
| 开学/假期管理 | 1.6 | YES |
| 管理后台系统管理/监控 | 1.5 | YES |
| 校园数据库 | 2.1 | YES |
| 海大介绍/电话簿 | 2.2 | YES |
| 校历/地图/出行 | 2.3 | YES |
| 入学指南/生活攻略/FAQ/缴费 | 3.1 | YES |
| 找室友 | 3.2 | YES |
| 二手集市 | 4.1 | YES |
| 快讯 | 4.2 | YES |
| 校友圈 | 4.3 | YES |
| 抽奖 | 4.4 | YES |
| 课表 + 分享 | 5.1 + 5.2 | YES |
| 工具箱 | 6.1 + 6.2 | YES |
| 网页端 | 7.1 | YES |

### 2. 占位符扫描

阶段 0-1 的任务包含完整的步骤描述。阶段 2-7 为概要任务，将在执行时按设计文档展开细化。无待定占位符。

### 3. 类型一致性

- API 路径与 API 文档 v1.16 一致
- 数据表名与后端设计文档 v1.16 一致
- 错误码与 API 文档 1.4 一致
- 技术栈与 AGENTS.md v1.16 一致
