import request from '@/utils/http'
import { ApiPermissionCode } from '@/constants/api-permissions'

/**
 * 获取公开站点配置
 */
export function fetchPublicSiteSettings() {
  return request.get<Api.Settings.SiteSettingInfo>({
    url: '/api/v1/site-settings/public'
  })
}

/**
 * 获取后台站点配置
 */
export function fetchAdminSiteSettings() {
  return request.get<Api.Settings.SiteSettingInfo>({
    url: '/api/v1/site-settings/admin',
    permissionCode: ApiPermissionCode.SITE_SETTING.ADMIN_VIEW
  })
}

/**
 * 更新后台站点配置
 */
export function fetchUpdateSiteSettings(data: Api.Settings.SiteSettingPayload) {
  return request.patch<Api.Settings.SiteSettingInfo>({
    url: '/api/v1/site-settings/admin',
    data,
    permissionCode: ApiPermissionCode.SITE_SETTING.UPDATE
  })
}
