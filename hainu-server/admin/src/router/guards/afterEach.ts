import { useSettingStore } from '@/store/modules/setting'
import { Router } from 'vue-router'
import NProgress from 'nprogress'
import { useCommon } from '@/hooks/core/useCommon'
import { loadingService } from '@/utils/ui'
import { getPendingLoading, resetPendingLoading, getLoadingStartTime } from './beforeEach'

// 最短 loading 展示时间，单位毫秒
const MIN_LOADING_MS = 260

/** 路由全局后置守卫 */
export function setupAfterEachGuard(router: Router) {
  const { scrollToTop } = useCommon()

  router.afterEach(() => {
    scrollToTop()

    // 关闭进度条
    const settingStore = useSettingStore()
    if (settingStore.showNprogress) {
      NProgress.done()
      requestAnimationFrame(() => {
        NProgress.remove()
      })
    }

    // 关闭 loading 效果，保证最短展示时间后再等两帧确保页面完整渲染
    if (getPendingLoading()) {
      const elapsed = Date.now() - getLoadingStartTime()
      const remaining = Math.max(0, MIN_LOADING_MS - elapsed)
      setTimeout(() => {
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            loadingService.hideLoading()
            resetPendingLoading()
          })
        })
      }, remaining)
    }
  })
}
