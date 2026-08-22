/**
 * useAuth - 权限验证管理
 *
 * 提供统一的权限验证功能。
 * 用于控制页面按钮、操作等功能的显示和访问权限。
 *
 * ## 主要功能
 *
 * 1. 权限检查 - 检查用户是否拥有指定的权限标识
 * 2. 按钮权限 - 从当前路由 meta 配置中获取权限列表（如 [{ authMark: 'add' }]）
 * 3. 接口权限 - 从用户信息中获取接口权限编码（如 ['system:user:list']）
 *
 * ## 使用示例
 *
 * ```typescript
 * const { hasAuth } = useAuth()
 *
 * // 检查是否有新增权限
 * if (hasAuth('add')) {
 *   // 显示新增按钮
 * }
 *
 * // 在模板中使用
 * <el-button v-if="hasAuth('edit')">编辑</el-button>
 * <el-button v-if="hasAuth('delete')">删除</el-button>
 * ```
 *
 * @module useAuth
 * @author Ci-Yuu-Plus Team
 */

import { useRoute } from 'vue-router'
import { storeToRefs } from 'pinia'
import { useUserStore } from '@/store/modules/user'
import type { AppRouteRecord } from '@/types/router'

type AuthItem = NonNullable<AppRouteRecord['meta']['authList']>[number]

const userStore = useUserStore()

export const useAuth = () => {
  const route = useRoute()
  const { info } = storeToRefs(userStore)

  // 当前路由 meta 配置的权限列表（例如：[{ authMark: 'add' }]）
  const authList: AuthItem[] = Array.isArray(route.meta.authList)
    ? (route.meta.authList as AuthItem[])
    : []

  /**
   * 检查是否拥有某权限标识
   * @param auth 权限标识
   * @returns 是否有权限
   */
  const hasAuth = (auth: string): boolean => {
    return authList.some((item) => item?.authMark === auth)
  }

  const hasApiPermission = (permissionCode: string): boolean => {
    const apiPermissionList = info.value?.apiPermissions ?? []
    return apiPermissionList.includes(permissionCode)
  }

  const hasRole = (roleCode: string): boolean => {
    const roles = info.value?.roles ?? []
    return roles.includes(roleCode)
  }

  return {
    hasAuth,
    hasApiPermission,
    hasRole
  }
}
