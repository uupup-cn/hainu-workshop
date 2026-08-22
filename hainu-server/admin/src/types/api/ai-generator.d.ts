/**
 * AI 代码生成器接口类型定义模块
 *
 * 提供开发工具中 AI 代码生成器相关接口的参数、模块结构、生成结果、
 * 写入计划、环境诊断、历史记录和回滚结果类型。
 *
 * ## 主要功能
 *
 * - 描述生成器可识别的字段、功能和 UI 配置
 * - 约束需求解析、质量检查、代码预览和写入流程
 * - 定义开发环境一键生成、菜单同步、冒烟测试和回滚响应
 * - 为页面预览和历史记录操作提供类型安全
 *
 * ## 使用场景
 *
 * - AI 代码生成器页面状态建模
 * - API 请求参数类型约束
 * - API 响应数据类型定义
 * - 生成代码前后的质量检查、冲突处理和回滚展示
 *
 * ## 注意事项
 *
 * - 这些类型只描述前后端约定，不直接代表已写入项目的真实文件状态
 * - 文件路径类字段通常是相对项目根目录的路径
 * - 涉及写入、覆盖和回滚的操作必须以后端执行结果为准
 *
 * @module types/api/ai-generator
 * @author Ci-Yuu-Plus Team
 */

declare namespace Api {
  /** AI 代码生成器类型 */
  namespace AiGenerator {
    /** 生成器支持的字段类型 */
    type FieldType =
      | 'string'
      | 'number'
      | 'boolean'
      | 'enum'
      | 'date'
      | 'datetime'
      | 'textarea'
      | 'richtext'
      | 'image'
      | 'file'
      | 'relation'

    /** 生成器支持的模块功能 */
    type Feature =
      | 'list'
      | 'detail'
      | 'create'
      | 'update'
      | 'delete'
      | 'batchDelete'
      | 'statusToggle'
      | 'softDelete'

    /** 枚举、单选、多选等字段的候选项 */
    interface FieldOption {
      /** 展示文本 */
      label: string
      /** 提交值 */
      value: string | number | boolean
    }

    /** 关联字段配置 */
    interface FieldRelation {
      /** 关联模型标识 */
      model: string
      /** 关联模型的展示字段 */
      displayField: string
      /** 当前模型中保存关联关系的外键字段 */
      foreignKey?: string
    }

    /** 常用校验规则预设 */
    type ValidationPreset =
      | 'mobile'
      | 'email'
      | 'url'
      | 'idCard'
      | 'postalCode'
      | 'code'
      | 'amount'
      | 'percent'
      | 'sort'

    /** 字段校验配置 */
    interface FieldValidation {
      /** 常用校验规则预设 */
      preset?: ValidationPreset
      /** 最小值或最小长度 */
      min?: number
      /** 最大值或最大长度 */
      max?: number
      /** 自定义正则表达式字符串 */
      pattern?: string
      /** 校验失败提示文案 */
      message?: string
    }

    /** 业务字段结构 */
    interface Field {
      /** 字段名，通常使用 lowerCamelCase */
      name: string
      /** 字段中文或业务展示名 */
      label: string
      /** 字段类型 */
      type: FieldType
      /** 是否必填 */
      required?: boolean
      /** 是否出现在搜索表单中 */
      searchable?: boolean
      /** 是否在表格中展示 */
      tableVisible?: boolean
      /** 是否在新增、编辑表单中展示 */
      formVisible?: boolean
      /** 是否支持排序 */
      sortable?: boolean
      /** 字符串最大长度 */
      maxLength?: number
      /** 默认值 */
      defaultValue?: string | number | boolean | null
      /** 字段候选项 */
      options?: FieldOption[]
      /** 关联字段配置 */
      relation?: FieldRelation
      /** 字段校验配置 */
      validation?: FieldValidation
    }

    /** 表单字段分组 */
    interface FieldGroup {
      /** 分组唯一标识 */
      key: string
      /** 分组展示名 */
      label: string
      /** 分组内字段名列表 */
      fields: string[]
    }

    /** 表单承载方式 */
    type FormContainer = 'dialog' | 'drawer'

    /** 页面 UI 配置 */
    interface UiConfig {
      /** 新增、编辑表单承载方式 */
      formContainer?: FormContainer
      /** 是否生成创建人、创建时间、更新人、更新时间等审计字段 */
      auditFields?: boolean
      /** 是否启用软删除 */
      softDelete?: boolean
      /** 状态切换使用的字段名 */
      statusField?: string
      /** 是否生成详情视图 */
      detailView?: boolean
      /** 是否生成批量操作 */
      batchActions?: boolean
    }

    /** 生成策略默认配置 */
    interface StrategyConfig {
      /** 默认启用的模块功能 */
      defaultFeatures?: Feature[]
      /** 是否默认补齐审计字段 */
      defaultAuditFields?: boolean
      /** 是否默认启用软删除 */
      defaultSoftDelete?: boolean
      /** 是否默认生成详情视图 */
      defaultDetailView?: boolean
      /** 是否默认生成批量操作 */
      defaultBatchActions?: boolean
      /** 是否默认启用状态切换 */
      defaultStatusToggle?: boolean
    }

    /** 子模块结构，适用于主从表或聚合业务 */
    interface ChildModule {
      /** 子模块标识 */
      moduleName: string
      /** 子模块展示名 */
      moduleTitle: string
      /** 子模块实体名 */
      entityName: string
      /** 子模块字段列表 */
      fields: Field[]
      /** 与主模块建立关系的字段名 */
      relationField?: string
    }

    /** AI 生成器的模块结构描述 */
    interface ModuleSchema {
      /** 模块标识 */
      moduleName: string
      /** 模块展示名 */
      moduleTitle: string
      /** 所属业务域 */
      domain: string
      /** 实体名 */
      entityName: string
      /** 页面路由路径 */
      routePath: string
      /** 后端接口路径前缀 */
      apiPath: string
      /** 启用的模块功能 */
      features: Feature[]
      /** 字段列表 */
      fields: Field[]
      /** 字段分组列表 */
      fieldGroups?: FieldGroup[]
      /** 页面 UI 配置 */
      uiConfig?: UiConfig
      /** 生成策略配置 */
      strategy?: StrategyConfig
      /** 子模块列表 */
      children?: ChildModule[]
      /** 权限码列表 */
      permissions: string[]
    }

    /** 需求解析参数 */
    interface ParseRequirementParams {
      /** 用户输入的自然语言需求 */
      requirement: string
      /** 目标业务域 */
      domain?: string
    }

    /** 模块结构校验结果 */
    interface ValidationResult {
      /** 是否校验通过 */
      valid: boolean
      /** 阻塞性错误列表 */
      errors: string[]
      /** 非阻塞警告列表 */
      warnings: string[]
      /** 被校验的模块结构 */
      schema: ModuleSchema
    }

    /** 预生成文件 */
    interface GeneratedFile {
      /** 文件相对路径 */
      path: string
      /** 文件语言或类型 */
      language: string
      /** 生成动作 */
      action: 'create' | 'overwrite' | 'append-suggestion'
      /** 文件内容 */
      content: string
    }

    /** 代码质量检查项 */
    interface QualityCheck {
      /** 检查项唯一标识 */
      key: string
      /** 检查项标题 */
      title: string
      /** 检查状态 */
      status: 'passed' | 'warning' | 'failed'
      /** 检查说明 */
      description: string
      /** 修复建议 */
      suggestion?: string
    }

    /** 代码预览结果 */
    interface PreviewResult {
      /** 模块结构 */
      schema: ModuleSchema
      /** 模块结构校验结果 */
      validation: ValidationResult
      /** 质量检查结果 */
      qualityChecks: QualityCheck[]
      /** 预生成文件列表 */
      files: GeneratedFile[]
    }

    /** 写入生成结果参数 */
    interface ApplyParams {
      /** 待写入的模块结构 */
      schema: ModuleSchema
      /** 是否允许覆盖已有文件 */
      overwrite?: boolean
      /** 是否包含建议文件 */
      includeSuggestions?: boolean
      /** 冲突处理策略 */
      conflictStrategy?: ConflictStrategy
    }

    /** 已写入文件信息 */
    interface AppliedFile {
      /** 生成文件相对路径 */
      path: string
      /** 实际写入目标路径 */
      targetPath: string
      /** 文件语言或类型 */
      language: string
      /** 写入动作 */
      action: GeneratedFile['action']
      /** 是否已实际写入 */
      applied: boolean
      /** 写入前目标文件是否存在 */
      existedBefore: boolean
      /** 写入前目标文件是否被 Git 跟踪 */
      gitTrackedBefore?: boolean
      /** 写入前是否检测到生成器残留内容 */
      generatedResidueBefore?: boolean
      /** 写入前文件内容 */
      beforeContent?: string
      /** 写入后文件内容 */
      afterContent: string
    }

    /** 文件冲突信息 */
    interface FileConflict {
      /** 生成文件相对路径 */
      path: string
      /** 冲突目标路径 */
      targetPath: string
      /** 冲突原因 */
      reason: string
    }

    /** 文件冲突处理策略 */
    type ConflictStrategy = 'abort' | 'overwrite' | 'skip' | 'manual' | 'smart-merge'

    /** Diff 行信息 */
    interface DiffLine {
      /** 行类型 */
      type: 'context' | 'add' | 'remove'
      /** 旧文件行号 */
      oldLineNumber?: number
      /** 新文件行号 */
      newLineNumber?: number
      /** 行内容 */
      content: string
    }

    /** Diff 片段 */
    interface DiffHunk {
      /** 旧文件起始行 */
      oldStart: number
      /** 旧文件行数 */
      oldLines: number
      /** 新文件起始行 */
      newStart: number
      /** 新文件行数 */
      newLines: number
      /** Diff 行列表 */
      lines: DiffLine[]
    }

    /** Diff 统计信息 */
    interface DiffStats {
      /** 新增行数 */
      additions: number
      /** 删除行数 */
      deletions: number
      /** 是否存在变更 */
      changed: boolean
    }

    /** 后续操作建议 */
    interface NextStep {
      /** 建议标题 */
      title: string
      /** 建议说明 */
      description: string
      /** 建议执行命令 */
      commands: string[]
      /** 提示等级 */
      level: 'info' | 'warning'
    }

    /** 生产就绪检查项 */
    interface ReadinessItem {
      /** 检查项唯一标识 */
      key: string
      /** 检查项标题 */
      title: string
      /** 检查状态 */
      status: 'ready' | 'warning' | 'error'
      /** 检查说明 */
      description: string
      /** 建议执行命令 */
      commands?: string[]
    }

    /** 生产就绪检查结果 */
    interface ReadinessResult {
      /** 是否全部就绪 */
      ready: boolean
      /** 检查项列表 */
      items: ReadinessItem[]
    }

    /** 本地环境诊断检查项 */
    interface EnvironmentDiagnosticItem {
      /** 检查项唯一标识 */
      key: string
      /** 检查项标题 */
      title: string
      /** 检查状态 */
      status: 'ready' | 'warning' | 'error'
      /** 检查说明 */
      description: string
      /** 建议执行命令 */
      commands?: string[]
    }

    /** 本地环境诊断结果 */
    interface EnvironmentDiagnosticResult {
      /** 是否满足生成器运行条件 */
      ready: boolean
      /** 检查时间 */
      checkedAt: string
      /** 检查结果统计 */
      summary: {
        /** 就绪项数量 */
        ready: number
        /** 警告项数量 */
        warning: number
        /** 错误项数量 */
        error: number
      }
      /** AI 运行时配置 */
      aiRuntime: {
        /** AI 提供方 */
        provider: string
        /** AI 提供方展示名 */
        label: string
        /** 使用的模型标识 */
        model: string
        /** 是否已完成配置 */
        configured: boolean
      }
      /** 检查项列表 */
      items: EnvironmentDiagnosticItem[]
    }

    /** 冒烟测试检查项 */
    interface SmokeTestItem {
      /** 检查项唯一标识 */
      key: string
      /** 检查项标题 */
      title: string
      /** 检查状态 */
      status: 'passed' | 'failed' | 'skipped'
      /** 检查说明 */
      description: string
      /** 检查耗时，单位毫秒 */
      durationMs?: number
    }

    /** 冒烟测试结果 */
    interface SmokeTestResult {
      /** 是否全部通过 */
      passed: boolean
      /** 测试创建或读取的记录 ID */
      recordId?: number
      /** 检查项列表 */
      items: SmokeTestItem[]
    }

    /** 一次生成记录摘要 */
    interface RunSummary {
      /** 生成记录 ID */
      id: string
      /** 模块标识 */
      moduleName: string
      /** 模块展示名 */
      moduleTitle: string
      /** 创建时间 */
      createdAt: string
      /** 创建人信息 */
      createdBy: {
        /** 用户 ID */
        userId: number
        /** 用户名 */
        username: string
      }
      /** 当前状态 */
      status: 'applied' | 'rolled-back'
      /** 关联文件数量 */
      fileCount: number
      /** 生成版本号 */
      version: number
      /** 是否还有可补充清理的残留内容 */
      cleanupAvailable?: boolean
    }

    /** 清空历史结果 */
    interface ClearHistoryResult {
      /** 删除记录数量 */
      deletedCount: number
      /** 操作结果提示 */
      message: string
    }

    /** 写入生成结果 */
    interface ApplyResult {
      /** 是否成功写入 */
      applied: boolean
      /** 生成记录摘要 */
      run?: RunSummary
      /** 写入文件列表 */
      files: AppliedFile[]
      /** 写入冲突列表 */
      conflicts: FileConflict[]
      /** 操作结果提示 */
      message: string
      /** 后续操作建议 */
      nextSteps?: NextStep[]
    }

    /** 开发环境一键生成步骤 */
    interface DevApplyStep {
      /** 步骤唯一标识 */
      key: string
      /** 步骤标题 */
      title: string
      /** 步骤状态 */
      status: 'passed' | 'failed' | 'skipped' | 'warning'
      /** 步骤说明 */
      description: string
      /** 关联命令 */
      command?: string
      /** 命令输出 */
      output?: string
    }

    /** 开发环境一键生成结果 */
    interface DevApplyResult {
      /** 是否完成写入 */
      applied: boolean
      /** 操作结果提示 */
      message: string
      /** 文件写入结果 */
      applyResult?: ApplyResult
      /** 本次生成使用的模块结构 */
      schema?: ModuleSchema
      /** 执行步骤列表 */
      steps: DevApplyStep[]
      /** 数据库迁移文件路径 */
      migrationPath?: string
      /** 是否需要重启服务 */
      needsRestart: boolean
    }

    /** 菜单与权限同步结果 */
    interface MenuSyncResult {
      /** 是否同步成功 */
      synced: boolean
      /** 父级菜单 ID */
      parentMenuId: number
      /** 模块菜单 ID */
      menuId: number
      /** 按钮权限数量 */
      authCount: number
      /** 接口权限数量 */
      apiPermissionCount: number
      /** 操作结果提示 */
      message: string
    }

    /** 写入计划文件项 */
    interface ApplyPlanFile {
      /** 生成文件相对路径 */
      path: string
      /** 实际写入目标路径 */
      targetPath: string
      /** 文件语言或类型 */
      language: string
      /** 计划动作 */
      action: GeneratedFile['action']
      /** 计划状态 */
      status: 'create' | 'overwrite' | 'merge' | 'skip' | 'unchanged' | 'conflict'
      /** 目标文件是否已存在 */
      existedBefore: boolean
      /** 计划说明 */
      description: string
      /** 预览内容 */
      previewContent: string
      /** Diff 统计信息 */
      diffStats: DiffStats
      /** Diff 片段列表 */
      diffHunks: DiffHunk[]
    }

    /** 写入计划统计 */
    interface ApplyPlanSummary {
      /** 文件总数 */
      total: number
      /** 新建文件数 */
      create: number
      /** 覆盖文件数 */
      overwrite: number
      /** 合并文件数 */
      merge: number
      /** 跳过文件数 */
      skip: number
      /** 未变更文件数 */
      unchanged: number
      /** 冲突文件数 */
      conflict: number
    }

    /** 写入计划结果 */
    interface ApplyPlanResult {
      /** 当前计划是否可直接执行 */
      ready: boolean
      /** 当前冲突处理策略 */
      conflictStrategy: ConflictStrategy
      /** 计划文件列表 */
      files: ApplyPlanFile[]
      /** 冲突列表 */
      conflicts: FileConflict[]
      /** 计划统计 */
      summary: ApplyPlanSummary
      /** 后续操作建议 */
      nextSteps: NextStep[]
    }

    /** 回滚选项 */
    interface RollbackOptions {
      /** 是否强制回滚 */
      force?: boolean
      /** 是否删除数据库表 */
      dropDatabase?: boolean
    }

    /** 回滚结果 */
    interface RollbackResult {
      /** 是否完成回滚 */
      rolledBack: boolean
      /** 回滚的生成记录摘要 */
      run?: RunSummary
      /** 回滚冲突列表 */
      conflicts: FileConflict[]
      /** 操作结果提示 */
      message: string
      /** 数据库清理结果 */
      database?: {
        /** 已删除的数据表 */
        droppedTable: string
        /** 已移除的迁移文件路径列表 */
        removedMigrations: string[]
      }
    }
  }
}
