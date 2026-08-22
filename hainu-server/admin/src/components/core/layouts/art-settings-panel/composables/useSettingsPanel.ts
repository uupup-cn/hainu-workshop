import { ref, watch } from 'vue'
import { useSettingStore } from '@/store/modules/setting'
import { storeToRefs } from 'pinia'
import { SystemThemeEnum } from '@/enums/appEnum'
import { consumeMittEvent, mittBus } from '@/utils/sys'
import { useTheme } from '@/hooks/core/useTheme'
import { useSettingsState } from './useSettingsState'
import { useSettingsHandlers } from './useSettingsHandlers'

/**
 * 设置面板核心逻辑管理
 */
export function useSettingsPanel() {
  const settingStore = useSettingStore()
  const { systemThemeType, systemThemeMode } = storeToRefs(settingStore)

  // Composables
  const { setSystemTheme, setSystemAutoTheme } = useTheme()
  const { initColorWeak } = useSettingsState()
  const { domOperations } = useSettingsHandlers()

  // 响应式状态
  const showDrawer = ref(false)

  // 主题相关处理
  const useThemeHandlers = () => {
    // 初始化系统主题
    const initSystemTheme = () => {
      if (systemThemeMode.value === SystemThemeEnum.AUTO) {
        setSystemAutoTheme()
      } else {
        setSystemTheme(systemThemeType.value)
      }
    }

    // 监听系统主题变化
    const listenerSystemTheme = () => {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      mediaQuery.addEventListener('change', initSystemTheme)
      return () => {
        mediaQuery.removeEventListener('change', initSystemTheme)
      }
    }

    return {
      initSystemTheme,
      listenerSystemTheme
    }
  }

  // 抽屉控制
  const useDrawerControl = () => {
    // 用于存储 setTimeout 的 ID，以便在需要时清除
    let themeChangeTimer: ReturnType<typeof setTimeout> | null = null

    // 打开抽屉
    const handleOpen = () => {
      // 清除可能存在的旧定时器
      if (themeChangeTimer) {
        clearTimeout(themeChangeTimer)
      }
      // 延迟添加 theme-change class，避免抽屉打开动画受影响
      themeChangeTimer = setTimeout(() => {
        domOperations.setBodyClass('theme-change', true)
        themeChangeTimer = null
      }, 500)
    }

    // 关闭抽屉
    const handleClose = () => {
      // 清除未执行的定时器，防止关闭后才添加 class
      if (themeChangeTimer) {
        clearTimeout(themeChangeTimer)
        themeChangeTimer = null
      }
      // 立即移除 theme-change class
      domOperations.setBodyClass('theme-change', false)
    }

    // 打开设置
    const openSetting = () => {
      showDrawer.value = true
    }

    // 关闭设置
    const closeDrawer = () => {
      showDrawer.value = false
    }

    return {
      handleOpen,
      handleClose,
      openSetting,
      closeDrawer
    }
  }

  // Props 变化监听
  const usePropsWatcher = (props: { open?: boolean }) => {
    watch(
      () => props.open,
      (val: boolean | undefined) => {
        if (val !== undefined) {
          showDrawer.value = val
        }
      }
    )
  }

  // 初始化设置
  const useSettingsInitializer = () => {
    const themeHandlers = useThemeHandlers()
    const { openSetting } = useDrawerControl()
    let themeCleanup: (() => void) | null = null

    const initializeSettings = () => {
      mittBus.on('openSetting', openSetting)

      const pendingOpen = consumeMittEvent('openSetting')
      if (pendingOpen.found) {
        nextTick(() => {
          openSetting()
        })
      }

      themeCleanup = themeHandlers.listenerSystemTheme()
      initColorWeak()

      // 设置盒子模式
      const boxMode = settingStore.boxBorderMode ? 'border-mode' : 'shadow-mode'
      domOperations.setRootAttribute('data-box-mode', boxMode)

      themeHandlers.initSystemTheme()
    }

    const cleanupSettings = () => {
      mittBus.off('openSetting', openSetting)
      themeCleanup?.()
    }

    return {
      initializeSettings,
      cleanupSettings
    }
  }

  return {
    // 状态
    showDrawer,

    // 方法组合
    useThemeHandlers,
    useDrawerControl,
    usePropsWatcher,
    useSettingsInitializer
  }
}
