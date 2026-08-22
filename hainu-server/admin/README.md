# Art Design Pro UI

一个基于 `Vite + Vue 3 + TypeScript + Element Plus + Pinia + Tailwind CSS v4` 的中后台管理系统。

适合用于系统管理、内容管理、商城、工作流、监控等后台场景开发。

## 快速开始

### 环境要求

- Node.js `>= 20.19.0`
- pnpm `>= 8.8.0`

### 安装依赖

```bash
pnpm install
```

### 启动开发环境

```bash
pnpm dev
```

默认会自动打开浏览器。当前仓库默认端口来自 `.env`，通常是：

```bash
http://localhost:3000
```

### 构建生产包

```bash
pnpm build
```

### 本地预览构建结果

```bash
pnpm serve
```

## 常用命令

```bash
pnpm dev
pnpm build
pnpm test
pnpm test:e2e
pnpm lint
pnpm fix
pnpm lint:prettier
pnpm lint:stylelint
pnpm commit
```

## 技术栈

- Vue 3.5
- TypeScript
- Vite 8
- Vue Router 4
- Pinia
- Element Plus
- Tailwind CSS v4
- Axios
- Vue I18n
- Vitest
- Playwright

## 项目结构

```text
src/
├── api/            # 接口请求
├── assets/         # 图片与全局样式
├── components/     # 通用组件与业务组件
├── config/         # 全局配置
├── hooks/          # 组合式 hooks
├── router/         # 路由、守卫、动态路由注册
├── store/          # Pinia 状态管理
├── types/          # 类型定义
├── utils/          # 工具函数
└── views/          # 页面视图
```

## 开发入口

### 页面开发参考

- 普通表格页参考：`src/views/system/user`
- 登录页视觉参考：`src/components/core/views/login/LoginLeftView.vue`
- 设计变量与主题参考：`src/assets/styles/core/tailwind.css`

### 关键能力

- 动态菜单与动态路由注册
- 登录态恢复与 Token 刷新
- 统一 HTTP 请求封装
- 通用搜索/表格页面方案
- 亮色/暗色主题支持

## 推荐开发流程

1. 先阅读对应业务目录下的现有页面实现。
2. 普通列表页优先复用 `ArtSearchBar`、`ArtTableHeader`、`ArtTable`、`useTable`。
3. 新接口放到 `src/api/`，类型放到 `src/types/api/`。
4. 新页面接入对应路由模块与权限配置。
5. 提交前至少执行 `pnpm fix`，重要改动再执行 `pnpm build`。

## 更多说明

### AI 协作入口

- [AGENTS.md](./AGENTS.md)：仓库级事实基线、架构说明和交付约定
- [CLAUDE.md](./CLAUDE.md)：Claude Code 专属快速入口
- `.agents/skills/`：结构化任务模板
- `.claude/commands/`：Claude slash command 入口

推荐从 `/ai-module` 开始，用一句自然语言生成或扩展后台页面、接口和 CRUD 模块。例如：

```text
生成客户管理模块：客户名称、手机号、来源、等级、负责人、状态，支持搜索、分页、新增、编辑、删除和详情抽屉。
```

更完整的协作与架构说明请优先查看 [AGENTS.md](./AGENTS.md)。
