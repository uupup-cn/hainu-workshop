import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'
import { encryptPasswordFields } from '@/utils/crypto'

/**
 * 获取用户列表
 */
export function fetchGetUserList(params: Api.Identity.UserSearchParams) {
  return request.get<Api.Identity.UserList>({
    url: '/api/v1/user',
    params,
    permissionCode: ApiPermissionCode.USER.LIST
  })
}

/**
 * 新增用户
 */
export async function fetchAddUser(params: Api.Identity.AddUserParams) {
  const { payload, keyId } = await encryptPasswordFields(params, ['password'])
  return request.post<Api.Auth.UserInfo>({
    url: '/api/v1/user',
    data: payload,
    headers: keyId ? { 'X-Crypto-Key-Id': keyId } : undefined,
    permissionCode: ApiPermissionCode.USER.CREATE
  })
}

/**
 * 更新用户
 */
export function fetchEditUser(id: number, params: Api.Identity.EditUserParams) {
  return request.patch<Api.Auth.UserInfo>({
    url: `/api/v1/user/${id}`,
    data: params,
    permissionCode: ApiPermissionCode.USER.UPDATE
  })
}

/**
 * 删除用户
 */
export function fetchDeleteUser(id: number) {
  return request.del({
    url: `/api/v1/user/${id}`,
    permissionCode: ApiPermissionCode.USER.DELETE
  })
}

/**
 * 获取当前用户个人资料
 */
export function fetchCurrentUserProfile() {
  return request.get<Api.Identity.CurrentUserProfileInfo>({
    url: '/api/v1/user/profile/me',
    permissionCode: ApiPermissionCode.ACCOUNT.PROFILE_VIEW
  })
}

/**
 * 更新当前用户个人资料
 */
export function fetchUpdateCurrentUserProfile(data: Api.Identity.CurrentUserProfilePayload) {
  return request.patch<Api.Identity.CurrentUserProfileInfo>({
    url: '/api/v1/user/profile/me',
    data,
    permissionCode: ApiPermissionCode.ACCOUNT.PROFILE_UPDATE
  })
}

/**
 * 修改当前用户密码
 */
export async function fetchChangeCurrentUserPassword(data: Api.Identity.ChangePasswordPayload) {
  const { payload, keyId } = await encryptPasswordFields(data, [
    'currentPassword',
    'newPassword',
    'confirmPassword'
  ])
  return request.post<{ message: string }>({
    url: '/api/v1/user/password/change',
    data: payload,
    headers: keyId ? { 'X-Crypto-Key-Id': keyId } : undefined,
    permissionCode: ApiPermissionCode.ACCOUNT.PASSWORD_CHANGE
  })
}

/**
 * 获取当前用户会话列表
 */
export function fetchCurrentUserSessions(params: Api.Identity.UserSessionSearchParams) {
  return request.get<Api.Identity.UserSessionList>({
    url: '/api/v1/auth/sessions',
    params,
    permissionCode: ApiPermissionCode.ACCOUNT.SESSION_LIST
  })
}

/**
 * 撤销指定会话
 */
export function fetchRevokeCurrentUserSession(sessionId: string) {
  return request.del<Api.Identity.SessionActionResult>({
    url: `/api/v1/auth/sessions/${sessionId}`,
    permissionCode: ApiPermissionCode.ACCOUNT.SESSION_REVOKE
  })
}

/**
 * 撤销当前用户的其他会话
 */
export function fetchRevokeOtherUserSessions() {
  return request.post<Api.Identity.SessionActionResult>({
    url: '/api/v1/auth/sessions/revoke-others',
    permissionCode: ApiPermissionCode.ACCOUNT.SESSION_REVOKE_OTHERS
  })
}
