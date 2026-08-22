import { ref, watch } from 'vue'
import { storeToRefs } from 'pinia'
import { useBreakpoints } from '@vueuse/core'
import { MenuTypeEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'
import { StorageConfig } from '@/utils'

/**
 * 移动端菜单布局守护。
 * 在小屏下统一切换为左侧抽屉菜单，避免设置面板按需挂载前菜单按钮缺失。
 */
export function useResponsiveMenuLayout() {
  const settingStore = useSettingStore()
  const { menuType } = storeToRefs(settingStore)
  const breakpoints = useBreakpoints({ tablet: 1000 })
  const isMobile = breakpoints.smaller('tablet')

  const getStoredDesktopMenuType = (): MenuTypeEnum | undefined => {
    const storedMenuType = localStorage.getItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY)
    return Object.values(MenuTypeEnum).includes(storedMenuType as MenuTypeEnum)
      ? (storedMenuType as MenuTypeEnum)
      : undefined
  }

  const setStoredDesktopMenuType = (type: MenuTypeEnum) => {
    localStorage.setItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY, type)
  }

  const clearStoredDesktopMenuType = () => {
    localStorage.removeItem(StorageConfig.RESPONSIVE_MENU_TYPE_KEY)
  }

  const switchMenuLayouts = (type: MenuTypeEnum) => {
    if (
      type === MenuTypeEnum.LEFT ||
      type === MenuTypeEnum.HOVER_MENU ||
      type === MenuTypeEnum.TOP_LEFT ||
      type === MenuTypeEnum.SIDEBAR
    ) {
      settingStore.setMenuOpen(true)
    }

    settingStore.switchMenuLayouts(type)

    if (type === MenuTypeEnum.DUAL_MENU) {
      settingStore.setMenuOpen(true)
    }
  }

  const storedDesktopMenuType = getStoredDesktopMenuType()
  const beforeMenuType = ref<MenuTypeEnum | undefined>(storedDesktopMenuType)
  const hasChangedMenu = ref(Boolean(storedDesktopMenuType))

  return watch(
    isMobile,
    (mobile: boolean) => {
      if (mobile) {
        if (!hasChangedMenu.value) {
          beforeMenuType.value = menuType.value

          if (menuType.value !== MenuTypeEnum.LEFT) {
            setStoredDesktopMenuType(menuType.value)
            switchMenuLayouts(MenuTypeEnum.LEFT)
            hasChangedMenu.value = true
          }
        }

        settingStore.setMenuOpen(false)
        return
      }

      if (hasChangedMenu.value && beforeMenuType.value) {
        if (menuType.value === MenuTypeEnum.LEFT) {
          switchMenuLayouts(beforeMenuType.value)
        }

        clearStoredDesktopMenuType()
        hasChangedMenu.value = false
      }

      settingStore.setMenuOpen(true)
    },
    { immediate: true }
  )
}
