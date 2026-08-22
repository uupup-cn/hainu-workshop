declare namespace Api {
  /** 权限与组织类型 */
  namespace Access {
    type RoleList = Api.Common.PaginatedResponse<RoleListItem>

    /** 角色列表项 */
    interface RoleListItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 描述 */
      description: string
      /** 是否启用 */
      enabled: boolean
      /** 创建时间 */
      createdAt?: string
      /** 更新时间 */
      updatedAt?: string
    }

    /** 角色提交参数 */
    interface RolePayload {
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 描述 */
      description: string
      /** 是否启用 */
      enabled: boolean
    }

    /** 新增角色参数 */
    type AddRoleParams = RolePayload

    /** 编辑角色参数 */
    type EditRoleParams = RolePayload

    interface RolePermissionData {
      /** 角色 ID */
      roleId: number
      /** 权限标识列表 */
      permissionKeys: string[]
      /** 接口权限编码列表 */
      apiPermissionCodes: string[]
    }

    interface ApiPermissionItem {
      /** ID */
      id: number
      /** 编码 */
      code: string
      /** 名称 */
      name: string
      /** 模块 */
      module: string
      /** 分类 */
      category?: string | null
      /** 请求方法 */
      method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
      /** 路径 */
      path: string
      /** 描述 */
      description?: string | null
      /** 是否启用 */
      enabled: boolean
      /** 排序 */
      sort: number
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    interface ApiPermissionCatalogCategory {
      /** 分类 */
      category: string
      /** 权限列表 */
      permissions: ApiPermissionItem[]
    }

    interface ApiPermissionCatalogModule {
      /** 模块 */
      module: string
      /** 分类选项 */
      categories: ApiPermissionCatalogCategory[]
    }

    type DataScopeType = 'ALL' | 'ORG_AND_CHILD' | 'ORG' | 'SELF' | 'CUSTOM' | 'NONE'
    type DataScopeDimensionType = 'DEPT' | 'REGION' | 'STORE' | 'PROJECT' | 'LINE' | 'USER'
    type DataPermissionAction =
      | 'view'
      | 'create'
      | 'update'
      | 'delete'
      | 'export'
      | 'approve'
      | 'assign'

    interface RoleDataPermissionPolicy {
      /** 角色 ID */
      roleId?: number
      /** 资源编码 */
      resourceCode: string
      /** 是否启用 */
      enabled: boolean
      /** 可见范围类型 */
      visibleScopeType: DataScopeType
      /** 可见维度类型 */
      visibleDimensionType: DataScopeDimensionType
      /** 创建范围类型 */
      createScopeType: DataScopeType
      /** 创建维度类型 */
      createDimensionType: DataScopeDimensionType
      /** 更新范围类型 */
      updateScopeType: DataScopeType
      /** 更新维度类型 */
      updateDimensionType: DataScopeDimensionType
      /** 删除范围类型 */
      deleteScopeType: DataScopeType
      /** 删除维度类型 */
      deleteDimensionType: DataScopeDimensionType
      /** 导出范围类型 */
      exportScopeType: DataScopeType
      /** 导出维度类型 */
      exportDimensionType: DataScopeDimensionType
      /** 审批范围类型 */
      approveScopeType: DataScopeType
      /** 审批维度类型 */
      approveDimensionType: DataScopeDimensionType
      /** 分配范围类型 */
      assignScopeType: DataScopeType
      /** 分配维度类型 */
      assignDimensionType: DataScopeDimensionType
      /** 自定义目标配置 */
      customTargets?: Partial<Record<DataPermissionAction, number[]>>
    }

    interface RoleDataPermissionResourceMeta {
      /** 资源编码 */
      resourceCode: string
      /** 资源名称 */
      resourceName: string
      /** 实体名称 */
      entity: string
      /** 树形策略 */
      treeStrategy: 'NONE' | 'ANCESTOR_PLUS_SUBTREE'
      /** 支持的操作列表 */
      supportedActions: DataPermissionAction[]
      /** 支持的维度列表 */
      supportedDimensions: DataScopeDimensionType[]
    }

    interface RoleDataPermissionMetaResponse {
      /** 资源列表 */
      resources: RoleDataPermissionResourceMeta[]
      /** 范围选项 */
      scopeOptions: Array<{ value: DataScopeType; label: string }>
      /** 维度选项 */
      dimensionOptions: Array<{ value: DataScopeDimensionType; label: string }>
      /** 操作选项 */
      actionOptions: Array<{ value: DataPermissionAction; label: string }>
      /** 部门列表 */
      departments: DepartmentItem[]
    }

    interface RoleDataPermissionResponse {
      /** 角色 ID */
      roleId: number
      /** 策略列表 */
      policies: RoleDataPermissionPolicy[]
    }

    interface DepartmentItem {
      /** ID */
      id: number
      /** 父级 ID */
      parentId?: number | null
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 负责人 */
      leader?: string | null
      /** 手机号 */
      phone?: string | null
      /** 邮箱 */
      email?: string | null
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 子级列表 */
      children?: DepartmentItem[]
    }

    interface DepartmentSearchParams {
      /** 关键词 */
      keyword?: string
      /** 是否启用 */
      enabled?: string
    }

    interface DepartmentPayload {
      /** 父级 ID */
      parentId?: number | null
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 负责人 */
      leader?: string
      /** 手机号 */
      phone?: string
      /** 邮箱 */
      email?: string
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
      /** 备注 */
      remark?: string
    }

    interface PostItem {
      /** ID */
      id: number
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 排序 */
      sort: number
      /** 是否启用 */
      enabled: boolean
      /** 备注 */
      remark?: string | null
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
    }

    type PostList = Api.Common.PaginatedResponse<PostItem>

    interface PostSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** 当前页码 */
      current?: number
      /** 每页条数 */
      size?: number
      /** 名称 */
      name?: string
      /** 编码 */
      code?: string
      /** 是否启用 */
      enabled?: boolean
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }

    interface PostPayload {
      /** 名称 */
      name: string
      /** 编码 */
      code: string
      /** 排序 */
      sort?: number
      /** 是否启用 */
      enabled?: boolean
      /** 备注 */
      remark?: string
    }

    type RoleSearchParams = Partial<
      Pick<RoleListItem, 'id' | 'name' | 'code' | 'description' | 'enabled'> &
        Api.Common.CommonSearchParams & {
          /** 开始时间 */
          startTime: string | null
          /** 结束时间 */
          endTime: string | null
        }
    >
  }
}
