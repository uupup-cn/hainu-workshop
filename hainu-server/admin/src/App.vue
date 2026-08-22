<template>
  <ElConfigProvider
    size="default"
    :locale="locales[language]"
    :z-index="3000"
    :dialog="dialogConfig"
    :card="{
      shadow: 'never'
    }"
  >
    <RouterView></RouterView>
  </ElConfigProvider>
</template>

<script setup lang="ts">
  import { useUserStore } from './store/modules/user'
  import { useSiteSettingsStore } from './store/modules/site-settings'
  import { ElConfigProvider } from 'element-plus/es/components/config-provider/index.mjs'
  import zh from 'element-plus/es/locale/lang/zh-cn'
  import en from 'element-plus/es/locale/lang/en'
  import { toggleTransition } from './utils/ui/transition'
  import { checkStorageCompatibility } from './utils/storage'
  import { initializeThemeBootstrap } from './hooks/core/useThemeBootstrap'
  import { useDialogMotion } from './hooks/core/useDialogMotion'
  import { useLayoutDirection } from './hooks/core/useLayoutDirection'
  import { router } from './router'
  import { setPageTitle } from './utils/router'

  const userStore = useUserStore()
  const siteSettingsStore = useSiteSettingsStore()
  const { language } = storeToRefs(userStore)
  const { syncLayoutDirection } = useLayoutDirection()
  const { dialogConfig } = useDialogMotion()

  const locales = {
    zh: zh,
    en: en
  }

  const scheduleNonCriticalTask = (task: () => void) => {
    const idleCallback = (
      window as Window &
        typeof globalThis & {
          requestIdleCallback?: (
            callback: (deadline: any) => void,
            options?: { timeout: number }
          ) => number
        }
    ).requestIdleCallback

    if (typeof idleCallback === 'function') {
      idleCallback(() => task(), { timeout: 1500 })
      return
    }

    globalThis.setTimeout(task, 300)
  }

  onBeforeMount(() => {
    toggleTransition(true)
    initializeThemeBootstrap()
    syncLayoutDirection()
  })

  onMounted(() => {
    checkStorageCompatibility()
    toggleTransition(false)
    scheduleNonCriticalTask(() => {
      void import('./utils/sys/upgrade').then(({ systemUpgrade }) => {
        void systemUpgrade()
      })
      void import('./utils/sys/version-checker').then(({ startVersionUpdateChecker }) => {
        startVersionUpdateChecker()
      })
    })
    if (!siteSettingsStore.loaded) {
      siteSettingsStore.loadPublicSiteSettings().finally(() => {
        setPageTitle(router.currentRoute.value)
      })
      return
    }

    setPageTitle(router.currentRoute.value)
  })
</script>
