declare namespace Api {
  /** 工作流类型 */
  namespace Workflow {
    type WorkflowDefinitionStatus = 'DRAFT' | 'ENABLED' | 'DISABLED' | 'ARCHIVED'
    type WorkflowCategory = string
    type WorkflowFieldType =
      | 'INPUT'
      | 'TEXTAREA'
      | 'DESCRIPTION'
      | 'NUMBER'
      | 'AMOUNT'
      | 'FORMULA'
      | 'DATE'
      | 'DATE_RANGE'
      | 'DATETIME'
      | 'SELECT'
      | 'RADIO'
      | 'CHECKBOX'
      | 'SWITCH'
      | 'ATTACHMENT'
      | 'IMAGE_VIDEO'
      | 'DOCUMENT'
      | 'DETAIL_TABLE'
      | 'LINKED_APPROVAL'
      | 'ADDRESS'
      | 'LOCATION'
      | 'PHONE'
      | 'SERIAL_NUMBER'
      | 'USER'
      | 'DEPARTMENT'
    type WorkflowApproverType = 'USER' | 'ROLE' | 'DEPARTMENT' | 'STARTER_MANAGER'
    type WorkflowStageApproveMode = 'ANY' | 'ALL'
    type WorkflowApprovalType = 'MANUAL' | 'AUTO_PASS' | 'AUTO_REJECT'
    type WorkflowApprovalAssigneeSource =
      | 'USER'
      | 'ROLE'
      | 'DEPARTMENT'
      | 'STARTER_MANAGER'
      | 'STARTER_SELF'
      | 'STARTER_SELECT'
    type WorkflowApprovalMultiApproverMode = WorkflowStageApproveMode | 'SEQUENTIAL'
    type WorkflowEmptyAssigneePolicy = 'AUTO_PASS' | 'AUTO_REJECT'
    type WorkflowSelfApprovalPolicy = 'ALLOW' | 'AUTO_SKIP' | 'TO_MANAGER' | 'TO_DEPARTMENT_MANAGER'
    type WorkflowDuplicateApproverPolicy = 'ONCE' | 'REPEAT'
    type WorkflowApprovalDuplicatePolicy = 'FIRST_ONLY' | 'CONTINUOUS_ONLY' | 'EVERY_TIME'
    type WorkflowTitleMode = 'SYSTEM' | 'CUSTOM'
    type WorkflowNodeType =
      | 'START'
      | 'APPROVAL'
      | 'APPROVAL_USER'
      | 'APPROVAL_MANAGER'
      | 'APPROVAL_ROLE'
      | 'APPROVAL_DEPARTMENT'
      | 'APPROVAL_ALL'
      | 'CONDITION'
      | 'CONDITION_AMOUNT'
      | 'CONDITION_FORM'
      | 'CC'
      | 'CC_USER'
      | 'CC_ROLE'
      | 'END'
    type WorkflowConditionOperator =
      | 'EQ'
      | 'NE'
      | 'GT'
      | 'GTE'
      | 'LT'
      | 'LTE'
      | 'IN'
      | 'NOT_IN'
      | 'EMPTY'
      | 'NOT_EMPTY'
    type WorkflowInstanceStatus =
      | 'IN_PROGRESS'
      | 'APPROVED'
      | 'REJECTED'
      | 'CANCELLED'
      | 'AUTO_SKIPPED'
    type WorkflowPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
    type WorkflowTaskStatus = 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED' | 'SKIPPED'
    type WorkflowRecordAction =
      | 'SUBMIT'
      | 'ASSIGN'
      | 'APPROVE'
      | 'REJECT'
      | 'CANCEL'
      | 'SYSTEM'
      | 'CC'
      | 'SKIP'
      | 'BRANCH'
      | 'FINISH'
    type WorkflowFieldPermissionMode = 'HIDDEN' | 'READONLY' | 'EDITABLE'
    type WorkflowDiagnosticLevel = 'BLOCKER' | 'WARNING' | 'SUGGESTION'
    type WorkflowDiagnosticScope = 'FORM' | 'FLOW' | 'PERMISSION' | 'DATA_SOURCE' | 'PUBLISH'
    type WorkflowValidationRuleType =
      | 'REQUIRED'
      | 'MIN_LENGTH'
      | 'MAX_LENGTH'
      | 'MIN'
      | 'MAX'
      | 'REGEX'
      | 'EMAIL'
      | 'PHONE'
      | 'ID_CARD'
    type WorkflowDynamicRuleEffect = 'VISIBLE' | 'REQUIRED' | 'READONLY'
    type WorkflowDefaultValueType =
      | 'STATIC'
      | 'CURRENT_USER'
      | 'CURRENT_DEPARTMENT'
      | 'CURRENT_TIME'
      | 'EXPRESSION'
      | 'DATA_SOURCE'

    interface WorkflowMetaOption<T extends string = string> {
      /** 显示名称 */
      label: string
      /** 值 */
      value: T
    }

    interface WorkflowFieldOption {
      /** 显示名称 */
      label: string
      /** 值 */
      value: string
    }

    type WorkflowFieldConfig = Record<string, unknown>

    interface WorkflowValidationRule {
      /** 规则类型 */
      type: WorkflowValidationRuleType
      /** 规则值 */
      value?: unknown
      /** 错误提示 */
      message?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface WorkflowDynamicRule {
      /** 规则效果 */
      effect: WorkflowDynamicRuleEffect
      /** 条件 */
      conditions: WorkflowConditionRule[]
      /** 命中时的布尔值 */
      value: boolean
    }

    interface WorkflowDefaultValueConfig {
      /** 默认值类型 */
      type: WorkflowDefaultValueType
      /** 默认值 */
      value?: unknown
      /** 表达式 */
      expression?: string
      /** 数据源字段 */
      dataSourceField?: string
    }

    interface WorkflowDetailTableColumn {
      /** 列字段 key */
      key: string
      /** 列标题 */
      label: string
      /** 列类型 */
      type: WorkflowFieldType
      /** 占位提示 */
      placeholder?: string
      /** 帮助文本 */
      helpText?: string
      /** 字段类型专属配置 */
      config?: WorkflowFieldV3Config
      /** 列宽 */
      width?: number
      /** 是否必填 */
      required?: boolean
      /** 默认值 */
      defaultValue?: unknown
      /** 校验规则 */
      validationRules?: WorkflowValidationRule[]
      /** 候选项 */
      options?: WorkflowFieldOption[]
    }

    interface WorkflowDetailTableConfig {
      /** 子表列 */
      columns: WorkflowDetailTableColumn[]
      /** 最小行数 */
      minRows?: number
      /** 最大行数 */
      maxRows?: number
      /** 是否允许新增行 */
      allowAdd?: boolean
      /** 是否允许删除行 */
      allowRemove?: boolean
    }

    interface WorkflowReferenceRecord {
      /** 业务主键 */
      value: string | number
      /** 展示标题 */
      label: string
      /** 原始业务数据 */
      raw?: Record<string, unknown>
    }

    interface WorkflowLinkedApprovalRange {
      /** 关联审批定义 ID 或编码 */
      definitionId?: string
      /** 关联审批名称 */
      definitionName?: string
      /** 展示字段 */
      displayFields?: string[]
    }

    interface WorkflowLinkedApprovalConfig {
      /** 是否配置可选范围 */
      configurableRange?: boolean
      /** 仅可关联审批通过的单据 */
      approvedOnly?: boolean
      /** 可选审批范围 */
      ranges?: WorkflowLinkedApprovalRange[]
      /** 展示字段 */
      displayFields?: string[]
      /** 本地模拟数据，接入真实数据源前用于设计和试运行 */
      sampleApprovals?: WorkflowReferenceRecord[]
    }

    interface WorkflowFieldV3Config extends WorkflowFieldConfig {
      /** 结构化校验规则 */
      validationRules?: WorkflowValidationRule[]
      /** 动态规则 */
      dynamicRules?: WorkflowDynamicRule[]
      /** 默认值配置 */
      defaultValue?: WorkflowDefaultValueConfig
      /** 明细表配置 */
      detailTable?: WorkflowDetailTableConfig
      /** 关联审批配置 */
      linkedApproval?: WorkflowLinkedApprovalConfig
      /** 布局配置 */
      layout?: {
        width?: 12 | 24
        sectionKey?: string
      }
    }

    interface WorkflowFormField {
      /** 键名 */
      key: string
      /** 显示名称 */
      label: string
      /** 类型 */
      type: WorkflowFieldType
      /** 占位提示 */
      placeholder?: string
      /** 帮助文本 */
      helpText?: string
      /** 是否必填 */
      required?: boolean
      /** 栅格列数 */
      span?: number
      /** 默认值 */
      defaultValue?: unknown
      /** 是否只读 */
      readonly?: boolean
      /** 显示条件表达式 */
      displayCondition?: string
      /** 是否参与打印 */
      printable?: boolean
      /** 字段类型专属配置 */
      config?: WorkflowFieldV3Config
      /** 可选项 */
      options?: WorkflowFieldOption[]
    }

    interface WorkflowFileValue {
      /** 文件中心资源 ID */
      fileId: number
      /** 文件显示名称 */
      name: string
      /** MIME 类型 */
      mimeType: string
      /** 文件大小，单位字节 */
      size: number
      /** 文件分类 */
      kind: Api.Files.FileKind
    }

    interface WorkflowStage {
      /** 键名 */
      key?: string
      /** 名称 */
      name: string
      /** 审批人类型 */
      approverType: WorkflowApproverType
      /** 审批方式 */
      approveMode: WorkflowStageApproveMode
      /** 审批人 ID 列表 */
      approverIds: number[]
      /** 审批人名称列表 */
      approverNames?: string[]
    }

    interface WorkflowApproverRule {
      /** 审批人规则类型 */
      type: WorkflowApproverType
      /** 审批对象 ID 列表 */
      targetIds: number[]
      /** 审批对象名称快照 */
      targetNames?: string[]
    }

    interface WorkflowConditionRule {
      /** 表单字段 key */
      fieldKey: string
      /** 条件操作符 */
      operator: WorkflowConditionOperator
      /** 条件比较值 */
      value?: unknown
    }

    interface WorkflowFieldPermission {
      /** 表单字段 key */
      fieldKey: string
      /** 当前节点字段权限 */
      mode: WorkflowFieldPermissionMode
    }

    interface WorkflowOperationPermissions {
      approve: boolean
      reject: boolean
      transfer: boolean
      addSign: boolean
      rollback: boolean
      comment: boolean
      urge: boolean
      print: boolean
    }

    interface WorkflowApprovalSettings {
      /** 审批类型 */
      approvalType: WorkflowApprovalType
      /** 审批人来源 */
      assigneeSource: WorkflowApprovalAssigneeSource
      /** 固定对象 ID 列表 */
      sourceIds?: number[]
      /** 表单字段 key */
      formFieldKey?: string
      /** 层级偏移 */
      levelOffset?: number
      /** 多人审批方式 */
      multiApproverMode: WorkflowApprovalMultiApproverMode
      /** 审批人为空策略 */
      emptyAssigneePolicy: WorkflowEmptyAssigneePolicy
      /** 审批人与提交人为同一人时的处理策略 */
      selfApprovalPolicy: WorkflowSelfApprovalPolicy
      /** 重复审批人处理策略 */
      duplicateApproverPolicy: WorkflowDuplicateApproverPolicy
      /** 是否计入审批效率统计 */
      includeEfficiencyStats?: boolean
      /** 节点操作权限 */
      operationPermissions: WorkflowOperationPermissions
    }

    interface WorkflowDefinitionSettings {
      /** 谁可以提交该审批 */
      startPermission: {
        /** 全员、指定范围、均不可提交 */
        type: 'ALL' | 'SPECIFIED' | 'NONE'
        /** 指定成员 */
        userIds: number[]
        /** 指定角色 */
        roleIds: number[]
        /** 指定部门 */
        departmentIds: number[]
      }
      /** 提交人操作权限 */
      submitterPermissions: {
        /** 第一个审批节点通过后，提交人仍可撤销申请 */
        allowCancelAfterFirstApproval: boolean
        /** 已通过审批在有效期内允许撤销 */
        allowCancelApproved: boolean
        /** 已通过审批允许撤销的天数 */
        cancelApprovedWithinDays: number
      }
      /** 审批人去重 */
      duplicateApprovalPolicy: WorkflowApprovalDuplicatePolicy
      /** 标题展示设置 */
      titleSetting: {
        mode: WorkflowTitleMode
        customTemplate?: string
      }
      /** 提交时选择的审批人快照 */
      runtimeApproverSelections?: Record<string, number[]>
    }

    interface WorkflowFlowNode {
      /** 节点 ID */
      id: string
      /** 节点类型 */
      type: WorkflowNodeType
      /** 节点名称 */
      name: string
      /** 审批模式 */
      approveMode?: WorkflowStageApproveMode
      /** 审批人规则 */
      approverRules?: WorkflowApproverRule[]
      /** 节点条件 */
      conditions?: WorkflowConditionRule[]
      /** 审批节点字段权限 */
      fieldPermissions?: WorkflowFieldPermission[]
      /** 企业级审批配置，运行引擎暂按兼容字段执行 */
      approvalSettings?: WorkflowApprovalSettings
    }

    interface WorkflowFlowEdge {
      /** 连线 ID */
      id: string
      /** 起点节点 ID */
      source: string
      /** 终点节点 ID */
      target: string
      /** 连线名称 */
      label?: string
      /** 是否默认分支 */
      isDefault?: boolean
      /** 条件规则 */
      conditions?: WorkflowConditionRule[]
    }

    interface WorkflowFlowSchema {
      /** 协议版本 */
      version: 2
      /** 节点列表 */
      nodes: WorkflowFlowNode[]
      /** 连线列表 */
      edges: WorkflowFlowEdge[]
    }

    interface WorkflowCanvasSchema {
      nodes?: Array<{
        id: string
        position: { x: number; y: number }
      }>
      viewport?: {
        x: number
        y: number
        zoom: number
      }
    }

    interface WorkflowMetaResponse {
      /** 分类选项 */
      categories: WorkflowMetaOption<WorkflowCategory>[]
      /** 定义状态选项 */
      definitionStatuses: WorkflowMetaOption<WorkflowDefinitionStatus>[]
      /** 实例状态选项 */
      instanceStatuses: WorkflowMetaOption<WorkflowInstanceStatus>[]
      /** 任务状态选项 */
      taskStatuses: WorkflowMetaOption<WorkflowTaskStatus>[]
      /** 优先级选项 */
      priorities: WorkflowMetaOption<WorkflowPriority>[]
      /** 字段类型选项 */
      fieldTypes: WorkflowMetaOption<WorkflowFieldType>[]
      /** 审批人类型选项 */
      approverTypes: WorkflowMetaOption<WorkflowApproverType>[]
      /** 审批方式选项 */
      approveModes: WorkflowMetaOption<WorkflowStageApproveMode>[]
      /** 节点类型选项 */
      nodeTypes?: WorkflowMetaOption<WorkflowNodeType>[]
      /** 审批场景可选用户，仅包含 ID 和显示名 */
      users: WorkflowMetaOption<number>[]
      /** 审批场景可选部门，仅包含 ID 和显示名 */
      departments: WorkflowMetaOption<number>[]
    }

    interface WorkflowDefinitionPayload {
      /** 名称 */
      name: string
      /** 编码 */
      code?: string
      /** 分类 */
      category?: WorkflowCategory
      /** 状态 */
      status?: WorkflowDefinitionStatus
      /** 汇总信息 */
      summary?: string
      /** 描述 */
      description?: string
      /** 图标 */
      icon?: string
      /** 颜色 */
      color?: string
      /** 是否允许取消 */
      allowCancel?: boolean
      /** 更多设置 */
      settings?: WorkflowDefinitionSettings
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 阶段结构 */
      stageSchema: WorkflowStage[]
      /** v2/v3 流程图 */
      flowSchema?: WorkflowFlowSchema
      /** 设计器画布快照 */
      canvasSchema?: WorkflowCanvasSchema | null
      /** 发布说明 */
      publishSummary?: string
      /** 发布诊断快照 */
      diagnosticsSnapshot?: WorkflowDiagnostic[]
    }

    interface WorkflowDiagnostic {
      /** 诊断级别 */
      level: WorkflowDiagnosticLevel
      /** 诊断范围 */
      scope: WorkflowDiagnosticScope
      /** 字段、节点、连线或版本 ID */
      targetId?: string
      /** 诊断信息 */
      message: string
      /** 修复建议 */
      fixHint?: string
    }

    interface WorkflowValidationResult {
      /** 是否通过阻塞校验 */
      valid: boolean
      /** schema 版本 */
      schemaVersion: number
      /** 节点数量 */
      nodeCount: number
      /** 连线数量 */
      edgeCount: number
      /** 诊断项 */
      diagnostics: WorkflowDiagnostic[]
    }

    interface WorkflowPublishPayload extends WorkflowDefinitionPayload {
      /** 发布说明 */
      publishSummary?: string
    }

    interface WorkflowVersionDiffItem {
      /** 变化范围 */
      scope: 'FORM' | 'FLOW' | 'PERMISSION'
      /** 变化类型 */
      type: 'ADDED' | 'REMOVED' | 'CHANGED'
      /** 目标 ID */
      targetId: string
      /** 标题 */
      title: string
      /** 说明 */
      description?: string
    }

    interface WorkflowVersionDiffResult {
      /** 源版本 */
      fromVersion: number
      /** 目标版本 */
      toVersion: number | 'DRAFT'
      /** 差异项 */
      items: WorkflowVersionDiffItem[]
    }

    interface WorkflowCategoryPayload {
      /** 名称 */
      name: string
      /** 编码 */
      code?: string
      /** 是否启用 */
      enabled?: boolean
      /** 排序 */
      sort?: number
      /** 备注 */
      remark?: string
    }

    interface WorkflowCategorySearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: boolean
    }

    interface WorkflowCategoryItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 是否启用 */
      enabled: boolean
      /** 排序 */
      sort: number
      /** 备注 */
      remark?: string | null
      /** 定义数量 */
      definitionCount: number
      /** 实例数量 */
      instanceCount: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type WorkflowCategoryList = Api.Common.PaginatedResponse<WorkflowCategoryItem>

    interface WorkflowDefinitionSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 状态 */
      status?: WorkflowDefinitionStatus | ''
      /** 分类 */
      category?: WorkflowCategory | ''
    }

    interface WorkflowUserRef {
      /** ID */
      id: number
      /** 用户名 */
      username: string
    }

    interface WorkflowDefinitionItem {
      /** ID */
      id: number
      /** 工作流编号 */
      workflowNo: string
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 分类 */
      category: WorkflowCategory
      /** 状态 */
      status: WorkflowDefinitionStatus
      /** 版本号 */
      version: number
      /** 汇总信息 */
      summary?: string | null
      /** 描述 */
      description?: string | null
      /** 图标 */
      icon?: string | null
      /** 颜色 */
      color?: string | null
      /** 是否允许取消 */
      allowCancel: boolean
      /** 更多设置 */
      settings?: WorkflowDefinitionSettings
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 阶段结构 */
      stageSchema: WorkflowStage[]
      /** v2 流程图 */
      flowSchema: WorkflowFlowSchema
      /** 设计器画布快照 */
      canvasSchema?: WorkflowCanvasSchema | null
      /** schema 版本 */
      schemaVersion: number
      /** 实例数量 */
      instanceCount: number
      /** 任务数量 */
      taskCount: number
      /** 创建人信息 */
      creator?: WorkflowUserRef | null
      /** 更新人信息 */
      updater?: WorkflowUserRef | null
      /** 发布时间 */
      publishedAt?: string | null
      /** 归档时间 */
      archivedAt?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type WorkflowDefinitionList = Api.Common.PaginatedResponse<WorkflowDefinitionItem>

    interface WorkflowDefinitionOverviewResponse {
      /** 总条数 */
      total: number
      /** 是否启用 */
      enabled: number
      /** 草稿数量 */
      draft: number
      /** 已禁用数量 */
      disabled: number
      /** 已归档数量 */
      archived: number
      /** 实例总数 */
      totalInstances: number
    }

    interface WorkflowDefinitionOptionItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 分类 */
      category: WorkflowCategory
      /** 汇总信息 */
      summary?: string | null
      /** 颜色 */
      color?: string | null
      /** 图标 */
      icon?: string | null
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 阶段结构 */
      stageSchema: WorkflowStage[]
      /** v2 流程图 */
      flowSchema: WorkflowFlowSchema
    }

    interface WorkflowDefinitionVersionItem {
      /** 快照 ID */
      id: number
      /** 定义 ID */
      definitionId: number
      /** 快照版本 */
      version: number
      /** 快照状态 */
      status: WorkflowDefinitionStatus
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 分类 */
      category: WorkflowCategory
      /** schema 版本 */
      schemaVersion: number
      /** 变更说明 */
      changeSummary?: string | null
      /** 发布说明 */
      publishSummary?: string | null
      /** 发布诊断快照 */
      diagnosticsSnapshot?: WorkflowDiagnostic[] | null
      /** 发布人 ID */
      publishedBy?: number | null
      /** 发布人名称 */
      publishedByName?: string | null
      /** 发布时间 */
      publishedAt: string
      /** 来源版本快照 ID */
      restoredFromId?: number | null
    }

    interface WorkflowDefinitionVersionDetail extends WorkflowDefinitionVersionItem {
      /** 汇总信息 */
      summary?: string | null
      /** 描述 */
      description?: string | null
      /** 图标 */
      icon?: string | null
      /** 颜色 */
      color?: string | null
      /** 是否允许取消 */
      allowCancel: boolean
      /** 更多设置 */
      settings?: WorkflowDefinitionSettings
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 阶段结构 */
      stageSchema: WorkflowStage[]
      /** v2 流程图 */
      flowSchema: WorkflowFlowSchema
      /** 设计器画布快照 */
      canvasSchema?: WorkflowCanvasSchema | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    interface WorkflowDefinitionPreviewPayload {
      /** 申请表单模拟数据 */
      formData: Record<string, unknown>
    }

    interface WorkflowPreviewStep {
      /** 节点 ID */
      nodeId: string
      /** 节点名称 */
      nodeName: string
      /** 节点类型 */
      nodeType: WorkflowNodeType
      /** 试运行状态 */
      status: string
      /** 提示信息 */
      message?: string
      /** 审批人数 */
      approverCount?: number
      /** 审批人名称 */
      approverNames?: string[]
      /** 是否需要发起时选择审批人 */
      requiresRuntimeApproverSelection?: boolean
      /** 命中连线 */
      matchedEdgeId?: string
      /** 命中分支名称 */
      matchedEdgeLabel?: string
      /** 命中目标节点 */
      matchedTargetId?: string
      /** 命中条件 */
      matchedConditions?: WorkflowConditionRule[]
      /** 抄送人名称 */
      recipientNames?: string[]
    }

    interface WorkflowPreviewTask {
      /** 节点 ID */
      nodeId: string
      /** 节点名称 */
      nodeName: string
      /** 审批方式 */
      approveMode: WorkflowStageApproveMode
      /** 执行方式 */
      executionMode?: WorkflowApprovalMultiApproverMode
      /** 审批人来源 */
      assigneeSource?: WorkflowApprovalAssigneeSource
      /** 是否需要发起时选择审批人 */
      requiresRuntimeApproverSelection?: boolean
      /** 审批人 ID */
      approverIds: number[]
      /** 审批人名称 */
      approverNames: string[]
      /** 审批人规则 */
      approverRules: WorkflowApproverRule[]
    }

    interface WorkflowPreviewRecord {
      /** 动作 */
      action: WorkflowRecordAction
      /** 节点 ID */
      nodeId: string
      /** 节点名称 */
      nodeName: string
      /** 接收人 ID */
      recipientIds?: number[]
      /** 接收人名称 */
      recipientNames?: string[]
    }

    interface WorkflowDefinitionPreviewResult {
      /** 定义 ID */
      definitionId: number
      /** 定义版本 */
      definitionVersion: number
      /** schema 版本 */
      schemaVersion: number
      /** 上下文变量 */
      variables: {
        starter: {
          userId: number
          username: string
          departmentId?: number | null
        }
        formData: Record<string, unknown>
      }
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 试运行步骤 */
      steps: WorkflowPreviewStep[]
      /** 预计生成任务 */
      tasks: WorkflowPreviewTask[]
      /** 预计生成记录 */
      records: WorkflowPreviewRecord[]
      /** 风险提示 */
      warnings: string[]
    }

    interface WorkflowDefinitionRollbackPayload {
      /** 目标版本快照 ID */
      versionId: number
      /** 回滚说明 */
      changeSummary?: string
    }

    interface WorkflowStarterRef extends WorkflowUserRef {
      /** 部门信息 */
      department?: Api.Identity.UserDepartmentRef | null
    }

    interface WorkflowTaskSummary {
      /** ID */
      id: number
      /** 任务编号 */
      taskNo: string
      /** 阶段下标 */
      stageIndex: number
      /** 阶段键 */
      stageKey: string
      /** 阶段名称 */
      stageName: string
      /** 节点 ID */
      nodeId?: string | null
      /** 节点类型 */
      nodeType?: WorkflowNodeType | null
      /** 节点名称 */
      nodeName?: string | null
      /** 审批人类型 */
      approverType: WorkflowApproverType
      /** 审批方式 */
      approveMode: WorkflowStageApproveMode
      /** 状态 */
      status: WorkflowTaskStatus
      /** 分配时间 */
      assignedAt: string
      /** 处理时间 */
      actedAt?: string | null
      /** 备注说明 */
      comment?: string | null
      /** 取消原因 */
      cancelReason?: string | null
      /** 审批人信息 */
      approver: WorkflowUserRef
      /** 实际处理人信息 */
      actor?: WorkflowUserRef | null
    }

    interface WorkflowRecordItem {
      /** ID */
      id: number
      /** 操作 */
      action: WorkflowRecordAction
      /** 阶段下标 */
      stageIndex?: number | null
      /** 阶段键 */
      stageKey?: string | null
      /** 阶段名称 */
      stageName?: string | null
      /** 操作人 ID */
      operatorId?: number | null
      /** 操作人名称 */
      operatorName?: string | null
      /** 备注说明 */
      comment?: string | null
      /** 载荷数据 */
      payload?: Record<string, unknown> | null
      /** 创建时间 */
      createdAt: string
    }

    interface WorkflowInstanceItem {
      /** ID */
      id: number
      /** 实例编号 */
      instanceNo: string
      /** 定义 ID */
      definitionId: number
      /** 定义编码 */
      definitionCode: string
      /** 定义名称 */
      definitionName: string
      /** 定义版本号 */
      definitionVersion: number
      /** 标题 */
      title: string
      /** 业务键 */
      businessKey?: string | null
      /** 分类 */
      category: WorkflowCategory
      /** 状态 */
      status: WorkflowInstanceStatus
      /** 优先级 */
      priority: WorkflowPriority
      /** 是否允许取消 */
      allowCancel: boolean
      /** 更多设置快照 */
      settings?: WorkflowDefinitionSettings
      /** 表单数据 */
      formData: Record<string, unknown>
      /** 表单结构 */
      formSchema: WorkflowFormField[]
      /** 阶段结构 */
      stageSchema: WorkflowStage[]
      /** v2 流程图 */
      flowSchema: WorkflowFlowSchema
      /** 设计器画布快照 */
      canvasSchema?: WorkflowCanvasSchema | null
      /** schema 版本 */
      schemaVersion: number
      /** 当前阶段下标 */
      currentStageIndex?: number | null
      /** 当前阶段键 */
      currentStageKey?: string | null
      /** 当前阶段名称 */
      currentStageName?: string | null
      /** 当前节点 ID */
      currentNodeId?: string | null
      /** 当前节点类型 */
      currentNodeType?: WorkflowNodeType | null
      /** 当前任务数 */
      currentTaskCount: number
      /** 重新提交来源实例 ID */
      resubmittedFromId?: number | null
      /** 已重新提交生成的新实例 ID */
      resubmittedToId?: number | null
      /** 发起人 ID */
      startedBy: number
      /** 发起部门 ID */
      startedDeptId?: number | null
      /** 开始时间 */
      startedAt: string
      /** 最后操作时间 */
      lastActionAt?: string | null
      /** 结束时间 */
      finishedAt?: string | null
      /** 取消原因 */
      cancelReason?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 发起人信息 */
      starter: WorkflowStarterRef
      /** 待审批人列表 */
      pendingApprovers: WorkflowUserRef[]
      /** 任务数量 */
      taskCount?: number
      /** 记录数量 */
      recordCount?: number
      /** 是否已经发生过审批通过或驳回动作 */
      hasApprovalAction?: boolean
      /** 任务列表 */
      tasks?: WorkflowTaskSummary[]
      /** 记录列表 */
      records?: WorkflowRecordItem[]
    }

    type WorkflowInstanceList = Api.Common.PaginatedResponse<WorkflowInstanceItem>

    interface WorkflowInstanceSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 状态 */
      status?: WorkflowInstanceStatus | ''
      /** 定义 ID */
      definitionId?: number
      /** 分类 */
      category?: WorkflowCategory | ''
      /** 查询范围 */
      scope?: 'mine' | 'all'
    }

    interface StartWorkflowInstancePayload {
      /** 定义 ID */
      definitionId: number
      /** 标题 */
      title?: string
      /** 业务键 */
      businessKey?: string
      /** 优先级 */
      priority?: WorkflowPriority
      /** 表单数据 */
      formData: Record<string, unknown>
      /** 提交人自选审批人，key 为审批节点 ID */
      approvalAssigneeSelections?: Record<string, number[]>
      /** 重新提交来源实例 ID */
      resubmitFromId?: number
    }

    interface CancelWorkflowInstancePayload {
      /** 原因 */
      reason?: string
    }

    interface WorkflowInstanceOverviewResponse {
      /** 总条数 */
      total: number
      /** 进行中数量 */
      inProgress: number
      /** 已通过数量 */
      approved: number
      /** 已驳回数量 */
      rejected: number
      /** 已取消数量 */
      cancelled: number
      /** 待我处理数量 */
      pendingMine: number
    }

    interface WorkflowTaskItem {
      /** ID */
      id: number
      /** 任务编号 */
      taskNo: string
      /** 所属实例 ID */
      instanceId: number
      /** 定义 ID */
      definitionId: number
      /** 阶段下标 */
      stageIndex: number
      /** 阶段键 */
      stageKey: string
      /** 阶段名称 */
      stageName: string
      /** 节点 ID */
      nodeId?: string | null
      /** 节点类型 */
      nodeType?: WorkflowNodeType | null
      /** 节点名称 */
      nodeName?: string | null
      /** 审批人类型 */
      approverType: WorkflowApproverType
      /** 审批方式 */
      approveMode: WorkflowStageApproveMode
      /** 审批人 ID */
      approverId: number
      /** 状态 */
      status: WorkflowTaskStatus
      /** 分配时间 */
      assignedAt: string
      /** 处理时间 */
      actedAt?: string | null
      /** 处理人 ID */
      actedBy?: number | null
      /** 备注说明 */
      comment?: string | null
      /** 取消原因 */
      cancelReason?: string | null
      /** 审批人信息 */
      approver: WorkflowUserRef
      /** 实际处理人信息 */
      actor?: WorkflowUserRef | null
      /** 所属实例 */
      instance: WorkflowInstanceItem
      /** 记录列表 */
      records?: WorkflowRecordItem[]
      /** 当前任务所在节点开放的操作权限 */
      operationPermissions?: WorkflowOperationPermissions
      /** 当前查看人在该任务上的历史动作 */
      viewerAction?: 'TRANSFERRED'
      /** 当前查看人执行该动作的时间 */
      viewerActedAt?: string
      /** 当前查看人执行该动作时的说明 */
      viewerComment?: string | null
    }

    type WorkflowTaskList = Api.Common.PaginatedResponse<WorkflowTaskItem>

    interface WorkflowTaskSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 关键词 */
      keyword?: string
      /** 定义 ID */
      definitionId?: number
    }

    interface WorkflowTaskOverviewResponse {
      /** 待处理数量 */
      pending: number
      /** 已处理数量 */
      processed: number
      /** 今日通过数量 */
      approvedToday: number
      /** 今日驳回数量 */
      rejectedToday: number
      /** 紧急待处理数量 */
      urgentPending: number
    }

    interface HandleWorkflowTaskPayload {
      /** 备注说明 */
      comment?: string
      /** 审批节点允许编辑的表单字段变更 */
      formDataPatch?: Record<string, unknown>
    }

    interface WorkflowTaskOperationPayload {
      /** 目标用户 ID */
      targetUserId: number
      /** 操作说明 */
      comment?: string
    }

    type DefinitionStatus = WorkflowDefinitionStatus
    type Category = WorkflowCategory
    type FieldType = WorkflowFieldType
    type ApproverType = WorkflowApproverType
    type StageApproveMode = WorkflowStageApproveMode
    type ApprovalType = WorkflowApprovalType
    type ApprovalAssigneeSource = WorkflowApprovalAssigneeSource
    type ApprovalMultiApproverMode = WorkflowApprovalMultiApproverMode
    type EmptyAssigneePolicy = WorkflowEmptyAssigneePolicy
    type SelfApprovalPolicy = WorkflowSelfApprovalPolicy
    type DuplicateApproverPolicy = WorkflowDuplicateApproverPolicy
    type NodeType = WorkflowNodeType
    type ConditionOperator = WorkflowConditionOperator
    type InstanceStatus = WorkflowInstanceStatus
    type Priority = WorkflowPriority
    type TaskStatus = WorkflowTaskStatus
    type RecordAction = WorkflowRecordAction
    type MetaOption<T extends string = string> = WorkflowMetaOption<T>
    type FieldOption = WorkflowFieldOption
    type FieldConfig = WorkflowFieldConfig
    type FormField = WorkflowFormField
    type Stage = WorkflowStage
    type ApproverRule = WorkflowApproverRule
    type ConditionRule = WorkflowConditionRule
    type FieldPermissionMode = WorkflowFieldPermissionMode
    type FieldPermission = WorkflowFieldPermission
    type OperationPermissions = WorkflowOperationPermissions
    type ApprovalSettings = WorkflowApprovalSettings
    type DefinitionSettings = WorkflowDefinitionSettings
    type FlowNode = WorkflowFlowNode
    type FlowEdge = WorkflowFlowEdge
    type FlowSchema = WorkflowFlowSchema
    type CanvasSchema = WorkflowCanvasSchema
    type MetaResponse = WorkflowMetaResponse
    type DefinitionPayload = WorkflowDefinitionPayload
    type CategoryPayload = WorkflowCategoryPayload
    type CategorySearchParams = WorkflowCategorySearchParams
    type CategoryItem = WorkflowCategoryItem
    type CategoryList = WorkflowCategoryList
    type DefinitionSearchParams = WorkflowDefinitionSearchParams
    type UserRef = WorkflowUserRef
    type DefinitionItem = WorkflowDefinitionItem
    type DefinitionList = WorkflowDefinitionList
    type DefinitionOverviewResponse = WorkflowDefinitionOverviewResponse
    type DefinitionOptionItem = WorkflowDefinitionOptionItem
    type DefinitionVersionItem = WorkflowDefinitionVersionItem
    type DefinitionVersionDetail = WorkflowDefinitionVersionDetail
    type DefinitionPreviewPayload = WorkflowDefinitionPreviewPayload
    type DefinitionPreviewResult = WorkflowDefinitionPreviewResult
    type DiagnosticLevel = WorkflowDiagnosticLevel
    type DiagnosticScope = WorkflowDiagnosticScope
    type Diagnostic = WorkflowDiagnostic
    type ValidationResult = WorkflowValidationResult
    type PublishPayload = WorkflowPublishPayload
    type VersionDiffResult = WorkflowVersionDiffResult
    type VersionDiffItem = WorkflowVersionDiffItem
    type PreviewStep = WorkflowPreviewStep
    type PreviewTask = WorkflowPreviewTask
    type PreviewRecord = WorkflowPreviewRecord
    type DefinitionRollbackPayload = WorkflowDefinitionRollbackPayload
    type StarterRef = WorkflowStarterRef
    type TaskSummary = WorkflowTaskSummary
    type RecordItem = WorkflowRecordItem
    type InstanceItem = WorkflowInstanceItem
    type InstanceList = WorkflowInstanceList
    type InstanceSearchParams = WorkflowInstanceSearchParams
    type StartInstancePayload = StartWorkflowInstancePayload
    type CancelInstancePayload = CancelWorkflowInstancePayload
    type InstanceOverviewResponse = WorkflowInstanceOverviewResponse
    type TaskItem = WorkflowTaskItem
    type TaskList = WorkflowTaskList
    type TaskSearchParams = WorkflowTaskSearchParams
    type TaskOverviewResponse = WorkflowTaskOverviewResponse
    type HandleTaskPayload = HandleWorkflowTaskPayload
    type TaskOperationPayload = WorkflowTaskOperationPayload
  }
}
