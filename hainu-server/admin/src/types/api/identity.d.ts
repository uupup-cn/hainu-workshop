declare namespace Api {
  /** 身份与账号类型 */
  namespace Identity {
    /** 用户档案 */
    interface UserProfile {
      /** ID */
      id?: number
      /** 性别 */
      gender: number
      /** 手机号 */
      phone?: string | null
      /** 真实姓名 */
      realName?: string | null
      /** 昵称 */
      nickName?: string | null
      /** 邮箱 */
      email?: string | null
      /** 头像 */
      avatar?: string | null
      /** 地址 */
      address?: string | null
      /** 个人简介 */
      bio?: string | null
    }

    /** 用户角色（列表返回） */
    interface UserRole {
      /** ID */
      id: number
      /** 名称 */
      name: string
    }

    /** 用户角色（提交参数） */
    interface UserRolePayload {
      /** ID */
      id: number
    }

    interface UserDepartmentRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
    }

    interface UserPostRef {
      /** ID */
      id: number
      /** 名称 */
      name: string
    }

    /** 用户列表 */
    type UserList = Api.Common.PaginatedResponse<UserListItem>

    /** 用户列表项 */
    interface UserListItem {
      /** ID */
      id: number
      /** 用户名 */
      username: string
      /** 部门 ID */
      departmentId?: number | null
      /** 岗位 ID */
      postId?: number | null
      /** 用户档案 */
      profile?: UserProfile
      /** 角色列表 */
      roles?: UserRole[]
      /** 部门信息 */
      departmentInfo?: UserDepartmentRef | null
      /** 岗位信息 */
      postInfo?: UserPostRef | null
      /** 创建时间 */
      createdAt?: string
      /** 更新时间 */
      updatedAt?: string
    }

    interface UserPayloadBase {
      /** 用户名 */
      username: string
      /** 用户档案 */
      profile?: UserProfile
      /** 角色列表 */
      roles?: number[]
      /** 部门 ID */
      departmentId?: number | null
      /** 岗位 ID */
      postId?: number | null
    }

    /** 新增用户参数 */
    type AddUserParams = UserPayloadBase & {
      /** 密码 */
      password: string
      /** 角色列表 */
      roles: number[]
    }

    /** 编辑用户参数 */
    type EditUserParams = UserPayloadBase & {
      /** 角色列表 */
      roles: number[]
    }

    interface CurrentUserProfileInfo {
      /** ID */
      id: number
      /** 用户名 */
      username: string
      /** 创建时间 */
      createdAt: string
      /** 更新时间 */
      updatedAt: string
      /** 部门信息 */
      departmentInfo?: UserDepartmentRef | null
      /** 岗位信息 */
      postInfo?: UserPostRef | null
      /** 角色列表 */
      roles: UserRole[]
      /** 用户档案 */
      profile: UserProfile
    }

    interface CurrentUserProfilePayload {
      /** 真实姓名 */
      realName?: string
      /** 昵称 */
      nickName?: string
      /** 邮箱 */
      email?: string
      /** 手机号 */
      phone?: string
      /** 地址 */
      address?: string
      /** 性别 */
      gender?: number
      /** 个人简介 */
      bio?: string
    }

    interface ChangePasswordPayload {
      /** 当前密码 */
      currentPassword: string
      /** 新密码 */
      newPassword: string
      /** 确认密码 */
      confirmPassword: string
    }

    interface UserSessionInfo {
      /** ID */
      id: string
      /** 用户 ID */
      userId: number
      /** IP 地址 */
      ip?: string | null
      /** 用户代理 */
      userAgent?: string | null
      /** 登录时间 */
      loginAt: string
      /** 最后活跃时间 */
      lastActiveAt: string
      /** 最后刷新时间 */
      lastRefreshAt?: string | null
      /** 撤销时间 */
      revokedAt?: string | null
      /** 撤销原因 */
      revokeReason?: string | null
      /** 是否当前会话 */
      current: boolean
      /** 状态 */
      status: 'ACTIVE' | 'REVOKED'
    }

    type UserSessionSearchParams = Partial<Api.Common.CommonSearchParams>

    type UserSessionList = Api.Common.PaginatedResponse<UserSessionInfo>

    interface SessionActionResult {
      /** 提示信息 */
      message: string
      /** 是否需要退出登录 */
      shouldLogout?: boolean
      /** 数量 */
      count?: number
    }

    /** 用户搜索参数 */
    interface UserSearchParams extends Partial<Api.Common.CommonSearchParams> {
      /** ID */
      id?: number
      /** 用户名 */
      username?: string
      /** 真实姓名 */
      realName?: string
      /** 手机号 */
      phone?: string
      /** 性别 */
      gender?: number
      /** 角色 */
      role?: number
      /** 部门 ID */
      departmentId?: number
      /** 岗位 ID */
      postId?: number
      /** 开始时间 */
      startTime?: string
      /** 结束时间 */
      endTime?: string
    }
  }
}
