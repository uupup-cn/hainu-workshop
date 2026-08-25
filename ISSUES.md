# 海大工坊 · 问题记录文档

> 记录开发、测试、部署期间出现的问题与解决方案，供团队复盘参考。
> 更新日期：2026-08-23

---

## 一、后端开发阶段

### 1. authMiddleware 吞掉下游业务错误（严重）

**现象**：`GET /marketplace/items` 等需登录接口返回 `40002 Token 无效或已过期`，但同一 token 访问 `/user/profile` 正常。

**原因**：`authMiddleware` 的 `try` 块把 `await next()` 也包进去了——控制器抛出的任何业务错误（如 Prisma 校验失败）都被 catch 误判为 Token 失效。

**解决方案**：将 `await next()` 移出 try 块，仅捕获 `verifyToken()` 的异常。`adminAuthMiddleware` 同样修复。

**文件**：`server/src/middlewares/auth.middleware.ts`

---

### 2. 集市商品列表查询不存在的 isActive 字段

**现象**：`getItems` 调用 Prisma 报错 `Unknown argument isActive`。

**原因**：`MarketplaceItem` 模型没有 `isActive` 字段，但 `getItems` 的 where 条件里写了 `isActive: true`。此前从未被真实请求触发所以没暴露。

**解决方案**：移除 where 条件中的 `isActive`，仅按 `status: 'active'` 过滤。

**文件**：`server/src/services/marketplace.service.ts`

---

### 3. 路由遮蔽：静态段被参数路由 :id 吞掉（严重）

**现象**：`GET /notifications/unread-count` 和 `GET /roommate/posts/my` 返回 50000（Prisma findUnique 的 id 参数缺失）。

**原因**：`GET /notifications/:id` 注册在 `GET /notifications/unread-count` 之前，koa-router 按注册顺序匹配，`unread-count` 被当作 `:id` 的值传入 `getNotificationDetail(id)`，导致 `prisma.notification.findUnique({ where: { id: NaN } })`。`roommate/posts/my` 同理被 `posts/:id` 吞掉。

**解决方案**：静态段路由（`unread-count`、`posts/my`、`posts/match`）必须注册在参数路由（`:id`）之前。

**文件**：`server/src/routes/notification.routes.ts`、`server/src/routes/roommate.routes.ts`

---

### 4. 课表复刻接口前后端字段名不一致

**现象**：网页端按 api.md 文档传 `{ share_code: "xxx" }` 调用 `POST /courses/replicate`，后端返回 `40001 缺少分享码`。

**原因**：api.md 文档写 `share_code`（snake_case），后端 controller 解构 `{ shareCode }`（camelCase），字段名不匹配。冲突覆盖参数 `force_overwrite` 同理。

**解决方案**：后端同时兼容 `share_code` 和 `shareCode`、`force_overwrite` 和 `forceOverwrite`。以设计文档 snake_case 为准。

**文件**：`server/src/controllers/course.controller.ts`、`server/src/services/course.service.ts`

---

### 5. 密码无盐 SHA-256 哈希（安全隐患）

**现象**：审查发现密码用 `crypto.createHash('sha256').update(password).digest('hex')` 存储，无盐、可彩虹表破解。

**解决方案**：新建 `utils/password.ts`，改用 PBKDF2-SHA256（10 万次迭代 + 16 字节随机盐）。`verifyPassword` 兼容旧 SHA-256 哈希（64 位 hex 格式），首次登录成功后自动升级为新哈希。auth.service / user.service / integration.service / seed.ts 全部替换。

**文件**：`server/src/utils/password.ts`（新建）、`server/src/services/auth.service.ts`、`server/src/services/user.service.ts`、`server/src/services/admin/integration.service.ts`、`server/prisma/seed.ts`

---

### 6. WSL → Windows MySQL 连接被 Hyper-V 防火墙拦截

**现象**：Windows 端 `prisma db push` 连接 WSL 内 MySQL（172.28.x.x:3306）报 `Connection refused`，但 WSL 内部 `127.0.0.1:3306` 可达。

**原因**：WSL 2 NAT 模式下，Windows → WSL 的回环连接被 Hyper-V 防火墙拦截，且当前用户无管理员权限无法放行。

**尝试**：配置 `.wslconfig` 的 `networkingMode=mirrored` 未生效（仍需管理员权限）。

**最终方案**：整个测试栈放进 WSL 内运行（Node 装入 WSL、server 在 WSL 内连本地 MySQL、测试脚本也在 WSL 内执行），完全绕开防火墙问题。

---

### 7. WSL 虚拟机自动关闭导致服务中断

**现象**：WSL 内 nohup 启动的 MySQL / API 服务器在无活动会话时被自动回收，进程消失。

**原因**：WSL 2 在没有活动会话时会自动关闭虚拟机，nohup 进程随之终止。

**解决方案**：使用 ZCode 的 `run_in_background` 后台任务（`exec node ...`）保持 WSL 会话存活，MySQL 用 `exec sleep infinity` 常驻。

---

## 二、管理后台开发阶段

### 8. 路由模块 index.ts 三处失效引用导致构建必失败（严重）

**现象**：`npm run build`（vue-tsc + vite build）在类型检查阶段直接失败。

**原因**：`src/router/modules/index.ts` 引用了三个不存在的模块：`./data-screen`（data-screen.ts 不存在）、`./tools`（tools.ts 不存在）、`...monitorRoutes`（import 被注释但使用处未注释）。

**解决方案**：删除 data-screen 和 tools 的 import 与使用处，恢复 monitorRoutes 的 import 取消注释，同时恢复 notificationRoutes 注册。

**文件**：`admin/src/router/modules/index.ts`

---

### 9. API URL 双斜杠笔误

**现象**：`fetchUpdateAlumniPostPin` 和 `fetchToggleShareCode` 的请求 404。

**原因**：URL 拼接写成了 `posts//' + id` 和 `share-codes//' + id`（双斜杠）。

**解决方案**：修正为 `posts/' + id + '/pin` 和 `share-codes/' + id + '/status`。

**文件**：`admin/src/api/community.ts`、`admin/src/api/schedule.ts`

---

### 10. data-screen 悬空路由指向已删除组件

**现象**：点击仪表盘「运营概览」菜单白屏。

**原因**：`dashboard.ts` 注册了 `operation-overview` → component `/data-screen/operation-overview`，但 `views/data-screen/` 目录已删除。

**解决方案**：从 dashboard.ts 中移除该路由项。

**文件**：`admin/src/router/modules/dashboard.ts`

---

### 11. content 模块死菜单（后端无接口）

**现象**：「内容管理」菜单点击后页面无法加载（所有 API 404）。

**原因**：`contentRoutes` 注册了文章/分类/标签等页面，但后端无 `/api/v1/contents` 等任何接口。项目内容管理由各业务模块（guide/life/faq/intro 等）承担，不需要模板的通用内容管理。

**解决方案**：在 `index.ts` 中注释 `contentRoutes` 的注册与 import。

**文件**：`admin/src/router/modules/index.ts`

---

### 12. 模板遗留死代码引用断裂

**现象**：删除模板 demo 文件后 vue-tsc 报错 `Cannot find module '@/api/scheduler'` 等。

**原因**：模板核心组件 `art-cron-expression` 引用已删除的 `@/api/scheduler`，`art-chat-window` 引用 `@/api/ai-assistant`，spec 文件引用已删除的 `@/router/modules/mall`。

**解决方案**：删除两个死组件目录、删除 mall spec 文件、清理 `types/import/components.d.ts` 中的类型引用、从 `config/modules/component.ts` 移除注册。

---

## 三、部署阶段

### 13. 服务器 GitHub clone 失败（网络问题）

**现象**：服务器 `git clone https://github.com/...` 报 `GnuTLS recv error` 或 `Failed to connect to github.com port 443`。

**原因**：服务器网络到 GitHub 不稳定（国内服务器），SSH 协议也因服务器无 GitHub SSH key 失败。

**解决方案**：从本地打包源码（排除 node_modules/dist/.git），`scp` 上传到服务器后解压。

---

### 14. 服务器内存不足导致 admin 构建崩溃

**现象**：服务器上 `npm run build`（admin）报 `Aborted (core dumped)`。

**原因**：服务器仅 1.9G 内存，admin 的 vue-tsc + vite build 构建过程内存峰值超限导致 OOM。

**解决方案**：admin 改为本地构建（Windows 端内存充足），`tar` 打包 dist 后 `scp` 上传到服务器部署。web 在服务器上构建正常（内存占用小）。

---

### 15. PM2 ecosystem.config.cjs 路径不匹配

**现象**：`pm2 start ecosystem.config.cjs` 报 `Script not found: /var/www/hainu-workshop/server/dist/app.js`。

**原因**：ecosystem 的 `cwd` 写的是 `/var/www/hainu-workshop/server`，但实际路径是 `/var/www/hainu-workshop/hainu-server/server`（多一层 hainu-server）。

**解决方案**：修正 cwd 为 `/var/www/hainu-workshop/hainu-server/server`。

---

### 16. PM2 日志目录权限不足

**现象**：`pm2 start` 报 `Could not create folder: /var/log/hainu`。

**原因**：ecosystem 配置的日志路径 `/var/log/hainu/` 需 root 权限，当前用户为 ubuntu。

**解决方案**：改为 `/home/ubuntu/.pm2/logs/`（用户目录，无需 sudo）。

---

### 17. 旧端口占用导致 PM2 启动 EADDRINUSE

**现象**：PM2 启动新进程后立即崩溃，日志报 `EADDRINUSE port 3000`。

**原因**：旧版部署的 ts-node 进程仍在 3000 端口运行（PM2 stop 只停了 PM2 管理的进程，但旧的 ts-node 是直接启动的）。

**解决方案**：`pm2 delete all` + `sudo fuser -k 3000/tcp` 强制杀掉占用进程，再用 `dist/app.js`（编译后 JS，非 ts-node）启动。

---

### 18. 旧数据库密码哈希不兼容

**现象**：部署后管理员登录返回 `40001 密码错误`。

**原因**：旧库的 admin 密码哈希是 `240be518...`，与 SHA-256('123456')=`8d969eef...` 不匹配——旧库使用过不同密码或不同哈希方式 seed。

**解决方案**：Drop 整个数据库重建（`DROP DATABASE` + `prisma db push` + `npm run seed`），确保全部用新 seed 的 PBKDF2 哈希。

---

### 19. 管理后台登录 404（严重 · 构建产物 baseURL 空值）

**现象**：浏览器打开 `http://159.75.116.207/admin/` 输入 admin/123456 点击登录，提示 `Request failed with status code 404`。

**排查过程**：
1. 用 curl 直连 API 全部 200（`/api/v1/auth/admin/login`、`/api/v1/user/info`、`/api/v3/system/menus`），排除后端和 Nginx 反代问题
2. 检查 admin 构建产物 JS，发现 `/api/v1` 出现 **0 次**——`VITE_API_URL` 没有被注入
3. 确认 `.env.production` 被 vite `loadEnv` 正确读取（`VITE_API_URL: /api/v1`），vite.config 日志也打印了 `API_URL = /api/v1`
4. 但 `import.meta.env.VITE_API_URL` 在构建产物中被替换成了空字符串，axios `baseURL` 为空
5. 所有 API 请求走相对路径（如 `/auth/admin/login`），Nginx 当静态文件处理返回 404

**根因**：Vite 8 的 `import.meta.env.VITE_*` 自动替换机制在生产构建时未将 `VITE_API_URL` 注入到非入口 chunk 的 HTTP 模块中。另外 Git Bash 的 MSYS 路径转换会把 `/api/v1` 变成 `C:/Program Files/Git/api/v1`，进一步污染构建。

**解决方案**：
1. 在 `vite.config.ts` 的 `define` 块中显式注入：`'import.meta.env.VITE_API_URL': JSON.stringify(VITE_API_URL || '/api/v1')`
2. 构建时设置 `MSYS_NO_PATHCONV=1` 环境变量防止路径转换
3. 修复后构建产物中 `/api/v1` 出现在 20 个 chunk（之前 0 个）

**文件**：`admin/vite.config.ts`

---

### 19b. 管理后台登录弹窗「请求的资源不存在」（crypto/security-config 404）

**现象**：浏览器打开管理后台登录页，页面能显示但弹出错误提示「请求的资源不存在」。

**排查过程**：
1. curl 测试登录链路全部 200（captcha / admin login / user/info / menus）
2. 发现 `GET /api/v1/auth/public-key` 和 `GET /api/v1/security-config` 返回 404
3. 读前端代码发现 `utils/api-security.ts` 的 `getApiSecurityConfig()` 请求 `GET /api/v1/crypto/security-config` 获取 RSA 公钥
4. `utils/crypto.ts` 的 `encryptPasswordFields()` 在登录页加载时被调用，请求失败后未 catch，异常冒泡为弹窗错误

**根因**：模板（Art Design Pro）的登录流程要求先获取 RSA 公钥加密密码（`encryptPasswordFields`），但后端未实现 `/api/v1/crypto/security-config` 端点。前端 `getPublicKey()` 无错误处理，404 直接抛异常。

**解决方案**：`encryptPasswordFields` 改为公钥获取失败时降级返回明文（后端 `adminLogin` 本为明文校验）。`getPublicKey()` 加 try-catch 返回 null，`encryptWithRSA` 收到 null 时直接返回明文。未来后端实现 security-config 端点后自动启用 RSA 加密。

**文件**：`admin/src/utils/crypto.ts`

---

## 四、测试阶段

### 20. 连通性测试脚本 URL 拼接问题

**现象**：测试脚本对 `/api/v3/system/menus` 等绝对路径端点报 `Failed to parse URL`。

**原因**：测试脚本 `BASE = 'http://localhost:3000/api/v1'`，对 `/api/v3/` 开头的绝对路径直接拼接导致 URL 格式错误。

**解决方案**：`call()` 函数判断路径以 `/api/` 开头时，从 BASE 中提取 origin 再拼接：`BASE.replace(/\/api\/v1$/, '') + path`。

**文件**：`server/scripts/connectivity-test.mjs`

---

### 21. CSV 导出端点测试断言失败

**现象**：`GET /logs/login/export` 测试报 `非 JSON 响应`。

**原因**：CSV 导出端点返回 `text/csv` 格式的二进制内容（带 BOM），不是 JSON。测试脚本的 `check()` 函数默认尝试 `res.json()` 解析。

**解决方案**：CSV 导出端点单独验证 HTTP 状态码和 Content-Type，不走通用 `check()` 函数。

**文件**：`server/scripts/connectivity-test.mjs`

---

### 22. seed 脚本菜单植入幂等性问题

**现象**：重复运行 `npm run seed` 报 `Unique constraint failed on guide_entries_entryKey_key`。

**原因**：seed 脚本对菜单用 `count() === 0` 判断是否首次植入，但其他数据（指南条目等）用 `upsert`。测试脚本创建的 `test-entry` 与 seed 的固定 key 冲突。

**解决方案**：
1. 测试脚本改用随机 key（`'test-entry-' + Date.now().toString(36)`）
2. 菜单种子改为按 `menuKey` upsert 增量同步（不再 `count() === 0` 跳过），新增菜单项自动补入

**文件**：`server/prisma/seed.ts`、`server/scripts/connectivity-test.mjs`

---

### 23. 分享功能测试缺少前置使用记录

**现象**：`shareTool` 测试用例 `expect(log!.isShared).toBe(true)` 失败。

**原因**：测试用户从未使用过 schulte 工具，`shareTool` 内的 `updateMany` 没有可标记的 ToolUsageLog 记录，`lastLog()` 取到的是其他工具的记录。

**解决方案**：在分享前先调用 `useTool('schulte', ...)` 产生使用记录。

**文件**：`server/src/__tests__/tool.service.test.ts`

---

## 五、经验总结

| # | 经验 |
|:--|:-----|
| 1 | **路由注册顺序**：静态段路径必须先于参数路径（`:id`）注册，否则被吞掉。koa-router 按注册顺序匹配 |
| 2 | **try-catch 边界**：中间件的 try 块只捕获自身逻辑的异常，`await next()` 必须在 try 外面，否则下游错误被误判 |
| 3 | **前后端字段命名**：文档定义 snake_case、代码实现 camelCase 时，后端应双兼容，以文档为准 |
| 4 | **Vite 环境变量**：`import.meta.env.VITE_*` 在 Vite 8 生产构建中可能不被正确注入非入口 chunk，用 `define` 显式注入更可靠 |
| 5 | **Git Bash 路径转换**：以 `/` 开头的值（如 `/api/v1`）会被 MSYS 转换为 Windows 路径，构建时需 `MSYS_NO_PATHCONV=1` |
| 6 | **WSL 网络**：NAT 模式下 Windows→WSL 连接受 Hyper-V 防火墙限制，测试栈全放 WSL 内可绕开 |
| 7 | **服务器内存**：1.9G 内存不足以运行 vue-tsc+vite build，admin 需本地构建上传 |
| 8 | **密码哈希迁移**：新算法的 verify 函数需兼容旧哈希格式，首次登录成功后自动升级 |
| 9 | **seed 幂等**：所有 seed 数据用 upsert 而非 create，菜单等结构化数据按唯一键增量同步 |
| 10 | **测试覆盖**：静态路由审计脚本（check-admin-api.mjs）能发现运行时测试测不到的写接口断链 |

---

## 六、部署后修复阶段

### 24. 管理后台登录「请求的资源不存在」（crypto/security-config 404）

**现象**：浏览器打开管理后台登录页，弹出「请求的资源不存在」。

**原因**：模板登录页加载时调用 `GET /api/v1/crypto/security-config` 获取 RSA 公钥加密密码，后端未实现该端点返回 404，前端 `getPublicKey()` 无错误处理，异常冒泡为弹窗。

**解决方案**：后端新增 `GET /api/v1/crypto/security-config` 返回 `{ enabled: false }`；前端 `encryptPasswordFields` 降级返回明文（后端 adminLogin 本为明文校验）。

**文件**：`server/src/routes/admin/integration.routes.ts`、`admin/src/utils/crypto.ts`

---

### 25. 管理后台登录成功但不跳转（ApiStatus.success=200 vs 后端 code:0）

**现象**：登录请求返回 200，但页面停在登录页不跳转，弹窗「请求失败」。

**原因**：模板的 `ApiStatus.success = 200`，但后端统一响应 `code: 0`。响应拦截器 `if (code === 200)` 不匹配，把成功响应当错误处理。

**解决方案**：`ApiStatus.success` 改为 `0`；响应拦截器兼容 `40010/40002` 为未授权；`BaseResponse` 增加 `message` 字段兼容（后端返回 message 非 msg）。

**文件**：`admin/src/utils/http/status.ts`、`admin/src/utils/http/index.ts`、`admin/src/types/common/response.ts`

---

### 26. API 请求双重前缀 /api/v1/api/v1/（VITE_API_URL 叠加）

**现象**：所有 API 请求返回 404，Nginx 日志显示路径 `/api/v1/api/v1/auth/refresh`。

**原因**：`.env.production` 的 `VITE_API_URL = /api/v1`，但 API 文件中 URL 已含完整 `/api/v1/` 前缀，axios baseURL 叠加后路径重复。

**解决方案**：`VITE_API_URL` 改为空字符串（API 文件 URL 已自带前缀）；vite.config.ts 用 `define` 显式注入 `import.meta.env.VITE_API_URL`。

**文件**：`admin/.env.production`、`admin/vite.config.ts`

---

### 27. 管理后台频繁报「服务器内部错误」（限流 429 + refresh 死循环）

**现象**：登录后页面频繁弹窗「服务器内部错误」。

**原因**：①限流中间件（60次/分钟）把管理后台并发请求限流返回 429；②前端 `auth/refresh` 自动重试机制因未存储 refreshToken 而死循环，每秒发十几个请求进一步触发限流。

**解决方案**：限流中间件排除管理后台所有路径；前端禁用自动 refresh（token 7 天有效，过期直接登出重新登录）。

**文件**：`server/src/middlewares/rate-limit.middleware.ts`、`admin/src/utils/http/index.ts`

---

### 28. 菜单 seed 不更新已存在菜单的 parentId（三级折叠分组不显示）

**现象**：课表模块改为三级分组后，左侧导航不显示折叠子项。

**原因**：seed 脚本的 upsert 对已存在菜单只更新名称/路径等字段，不更新 parentId——菜单结构变更后旧菜单的 parentId 仍指向旧父级。条件 `!idByKey.has(i.menuKey)` 跳过了已存在菜单。

**解决方案**：去掉该条件，让已存在菜单也更新 parentId；遍历深度从 3 增至 4 层。

**文件**：`server/prisma/seed.ts`

---

### 29. 课表三级路由嵌套导致页面内重复管理后台布局

**现象**：点击课表折叠分组下的「课程库」，页面内嵌套了一层完整的管理后台（侧边栏+菜单+内容区）。

**原因**：分组节点 `course-mgmt` 的 `component: '/index/index'` 被模板当成页面组件渲染——而 `/index/index` 本身是布局组件。

**解决方案**：①分组节点 `component` 设为空字符串（模板对空 component 的有 children 节点只作折叠标题）；②路由从嵌套 children 改为扁平结构（path 含分组前缀）；③菜单三级项 path 改为叶子段（模板自动拼接）。

**文件**：`server/prisma/menu-data.ts`、`admin/src/router/modules/schedule.ts`

---

### 30. Git Bash MSYS 路径转换污染构建参数

**现象**：`VITE_API_URL = /api/v1` 被构建日志显示为 `C:/Program Files/Git/api/v1`。

**原因**：Git Bash 的 MSYS 自动将以 `/` 开头的值转换为 Windows 路径。

**解决方案**：构建时设置 `MSYS_NO_PATHCONV=1` 环境变量。

---

## 七、经验总结补充

| # | 经验 |
|:--|:-----|
| 11 | **前后端协议对齐**：响应码（200 vs 0）、字段名（msg vs message）、路径前缀（baseURL 叠加）必须在开发前统一，否则部署后逐一排查耗时巨大 |
| 12 | **浏览器端到端测试**：curl 只能测 API 连通性，前端的 baseURL 拼接、拦截器逻辑、路由跳转只有真实浏览器才能暴露 |
| 13 | **模板集成策略**：对 Art Design Pro 等模板，以 mock-server 为响应形状规格抄 data 结构，后端实现模板路径端点，比改造模板 8000 行页面风险低 |
| 14 | **菜单分组节点**：component 为空的有 children 节点只作折叠标题不渲染页面；非空的 `/index/index` 会被当布局组件渲染导致嵌套 |
| 15 | **seed 增量同步**：upsert 的 update 必须包含所有可能变更的字段（含 parentId），不能只 update 部分字段 |

---

### 31. 找室友联动参数名不匹配 + 学院不应按校区过滤

**现象**：找室友的多级联动选择器中，书院和学院都不按校区过滤，返回全部数据。

**原因**：①前端传 `campus_id`（snake_case），后端读 `campusId`（camelCase），参数名不匹配导致过滤失效；②Department 的 campusId 改为可选后，按校区筛选学院会漏掉未绑校区的学院。

**解决方案**：
- 后端控制器新增 `numParam()` 兼容 snake_case 和 camelCase 参数名
- `getDepartments` 不再按 campusId 过滤（学院全量返回，可跨校区）
- 网页端联动逻辑调整：住宿线（校区→书院→楼栋）按校区联动；学术线（学院→专业）学院全量加载、选学院后联动专业

**文件**：`server/src/controllers/campus-data.controller.ts`、`web/src/views/freshman/Roommate.vue`、`web/src/api/roommate.ts`
