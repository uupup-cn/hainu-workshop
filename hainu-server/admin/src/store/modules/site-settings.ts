/**
 * 站点配置状态管理模块
 *
 * 提供站点公共配置的读取、合并和派生展示值
 *
 * @module store/modules/site-settings
 * @author Ci-Yuu-Plus Team
 */
import { defineStore } from 'pinia'
import AppConfig from '@/config'
import { fetchPublicSiteSettings } from '@/api/site-settings'

// 生成站点公共配置的默认值
const createDefaultSiteConfig = (): Api.Settings.SiteSettingInfo => ({
  id: 0,
  key: 'default',
  siteName: AppConfig.systemInfo.name,
  siteDescription: '商业化中后台管理系统',
  loginWelcomeTitle: '欢迎使用海大工坊',
  loginWelcomeDescription: '海南大学校园工具一站式管理后台。',
  seoTitle: AppConfig.systemInfo.name,
  seoDescription: '商业化中后台管理系统',
  seoKeywords: '后台管理系统,企业管理平台,运营后台',
  supportEmail: '',
  supportPhone: '',
  contactAddress: '',
  copyrightText: 'Copyright © 海大工坊',
  icpNo: '',
  publicSecurityNo: '',
  maintenanceMode: false,
  maintenanceMessage: '',
  watermarkEnabled: true,
  watermarkMode: 'USERNAME',
  watermarkText: AppConfig.systemInfo.name,
  allowRegister: false,
  feedbackEnabled: true,
  captchaEnabled: false,
  captchaType: 'IMAGE',
  loginMaxRetryCount: null,
  loginLockMinutes: 10,
  defaultLanguage: 'zh',
  orderPaymentTimeoutMinutes: 30,
  updatedByUser: null,
  updatedAt: ''
})

export const useSiteSettingsStore = defineStore('siteSettingsStore', () => {
  const publicConfig = ref<Api.Settings.SiteSettingInfo>(createDefaultSiteConfig())
  const loaded = ref(false)
  const loading = ref(false)
  let loadingPromise: Promise<Api.Settings.SiteSettingInfo> | null = null

  // 站点品牌名称
  const siteBrandName = computed(() => publicConfig.value.siteName || AppConfig.systemInfo.name)

  // 站点展示名称
  const siteDisplayName = computed(() => publicConfig.value.siteName || AppConfig.systemInfo.name)

  // 水印文本
  const watermarkText = computed(
    () => publicConfig.value.watermarkText || siteBrandName.value || AppConfig.systemInfo.name
  )

  // 水印内容模式
  const watermarkMode = computed(() => publicConfig.value.watermarkMode || 'USERNAME')

  // 是否启用站点水印
  const watermarkEnabled = computed(() => publicConfig.value.watermarkEnabled !== false)

  // 是否允许用户反馈
  const feedbackEnabled = computed(() => publicConfig.value.feedbackEnabled !== false)

  // 合并并应用后端返回的站点配置
  const applyPublicConfig = (config: Api.Settings.SiteSettingInfo) => {
    publicConfig.value = {
      ...createDefaultSiteConfig(),
      ...config
    }
    loaded.value = true
  }

  // 加载站点公共配置
  const loadPublicSiteSettings = async (force = false) => {
    if (loadingPromise && !force) return loadingPromise
    if (loaded.value && !force) return publicConfig.value

    loading.value = true
    loadingPromise = (async () => {
      try {
        const config = await fetchPublicSiteSettings()
        applyPublicConfig(config)
        return publicConfig.value
      } catch (error) {
        console.error('加载网站配置失败:', error)
        return publicConfig.value
      } finally {
        loading.value = false
        loadingPromise = null
      }
    })()

    return loadingPromise
  }

  return {
    publicConfig,
    loaded,
    loading,
    siteBrandName,
    siteDisplayName,
    watermarkText,
    watermarkMode,
    watermarkEnabled,
    feedbackEnabled,
    applyPublicConfig,
    loadPublicSiteSettings
  }
})
