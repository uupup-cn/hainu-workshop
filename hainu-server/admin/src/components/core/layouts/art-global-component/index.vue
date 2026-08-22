<!-- 全局组件 -->
<template>
  <component
    v-for="componentConfig in mountedComponents"
    :key="componentConfig.key"
    :is="componentConfig.component"
  />
</template>

<script setup lang="ts">
  import {
    getEnabledGlobalComponents,
    type GlobalComponentConfig
  } from '@/config/modules/component'
  import { mittBus, queueMittEvent } from '@/utils/sys'
  import { useResponsiveMenuLayout } from '@/hooks/core/useResponsiveMenuLayout'

  defineOptions({ name: 'ArtGlobalComponent' })

  const IMMEDIATE_COMPONENT_KEYS = new Set(['project-intro-dialog', 'feedback-widget', 'watermark'])

  const activatedKeys = ref<string[]>([])
  const activationTasks = new Map<string, Promise<void>>()
  let stopResponsiveMenuLayout: (() => void) | null = null

  const enabledComponents = computed(() => getEnabledGlobalComponents())
  const componentConfigMap = computed(
    () =>
      new Map(
        enabledComponents.value.map((componentConfig) => [componentConfig.key, componentConfig])
      )
  )

  const isComponentActivated = (key: string) => {
    return activatedKeys.value.includes(key)
  }

  const activateComponent = (key: string) => {
    if (!isComponentActivated(key)) {
      activatedKeys.value = [...activatedKeys.value, key]
    }
  }

  const waitForComponentMount = async () => {
    await nextTick()

    await new Promise<void>((resolve) => {
      requestAnimationFrame(() => {
        resolve()
      })
    })

    await nextTick()
  }

  const mountComponent = async (key: string, componentConfig?: GlobalComponentConfig) => {
    if (!componentConfig) {
      return
    }

    if (!isComponentActivated(key)) {
      if (componentConfig.loader) {
        try {
          await componentConfig.loader()
        } catch (e) {
          console.warn(`[ArtGlobalComponent] 动态加载组件 "${key}" 失败，尝试重新加载`, e)
          // 动态 import 失败（常见于 Vite 依赖预构建过期），页面刷新可恢复
          try {
            await componentConfig.loader()
          } catch {
            // 二次失败说明资源确实不可达，放弃挂载
            console.error(`[ArtGlobalComponent] 组件 "${key}" 加载失败，请刷新页面`)
            return
          }
        }
      }

      activateComponent(key)
      await waitForComponentMount()
    }
  }

  const activateOnDemand = (key: string, queuePending?: () => void) => {
    if (isComponentActivated(key)) {
      return
    }

    queuePending?.()

    if (activationTasks.has(key)) {
      return
    }

    const componentConfig = componentConfigMap.value.get(key)
    const task = mountComponent(key, componentConfig).finally(() => {
      activationTasks.delete(key)
    })

    activationTasks.set(key, task)
  }

  const ensureSettingsPanelMounted = () => {
    activateOnDemand('settings-panel', () => {
      queueMittEvent('openSetting', undefined)
    })
  }

  const ensureSearchDialogMounted = () => {
    activateOnDemand('global-search', () => {
      queueMittEvent('openSearchDialog', undefined)
    })
  }

  const ensureChatWindowMounted = () => {
    activateOnDemand('chat-window', () => {
      queueMittEvent('openChat', undefined)
    })
  }

  const ensureThemeCustomizerMounted = () => {
    activateOnDemand('theme-customizer-panel', () => {
      queueMittEvent('openThemeCustomizer', undefined)
    })
  }

  const ensureLockScreenMounted = () => {
    activateOnDemand('screen-lock', () => {
      queueMittEvent('openLockScreen', undefined)
    })
  }

  const ensureFireworksMounted = (imageUrl?: string) => {
    activateOnDemand('fireworks-effect', () => {
      queueMittEvent('triggerFireworks', imageUrl)
    })
  }

  const handleSearchShortcut = (event: KeyboardEvent) => {
    if (isComponentActivated('global-search')) {
      return
    }

    const isMac = navigator.platform.toUpperCase().includes('MAC')
    const isCommandKey = isMac ? event.metaKey : event.ctrlKey

    if (isCommandKey && event.key.toLowerCase() === 'k') {
      event.preventDefault()
      ensureSearchDialogMounted()
    }
  }

  const mountedComponents = computed(() =>
    enabledComponents.value.filter(
      (componentConfig) =>
        IMMEDIATE_COMPONENT_KEYS.has(componentConfig.key) ||
        isComponentActivated(componentConfig.key)
    )
  )

  onMounted(() => {
    stopResponsiveMenuLayout = useResponsiveMenuLayout()
    mittBus.on('openSetting', ensureSettingsPanelMounted)
    mittBus.on('openSearchDialog', ensureSearchDialogMounted)
    mittBus.on('openChat', ensureChatWindowMounted)
    mittBus.on('openThemeCustomizer', ensureThemeCustomizerMounted)
    mittBus.on('openLockScreen', ensureLockScreenMounted)
    mittBus.on('triggerFireworks', ensureFireworksMounted)
    document.addEventListener('keydown', handleSearchShortcut)
  })

  onUnmounted(() => {
    stopResponsiveMenuLayout?.()
    mittBus.off('openSetting', ensureSettingsPanelMounted)
    mittBus.off('openSearchDialog', ensureSearchDialogMounted)
    mittBus.off('openChat', ensureChatWindowMounted)
    mittBus.off('openThemeCustomizer', ensureThemeCustomizerMounted)
    mittBus.off('openLockScreen', ensureLockScreenMounted)
    mittBus.off('triggerFireworks', ensureFireworksMounted)
    document.removeEventListener('keydown', handleSearchShortcut)
  })
</script>
