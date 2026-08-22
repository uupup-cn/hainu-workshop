import { useSettingStore } from '@/store/modules/setting'
import { MenuTypeEnum } from '@/enums/appEnum'

/**
 * 设置状态管理
 */
export function useSettingsState() {
  const settingStore = useSettingStore()

  // 色弱模式初始化
  const initColorWeak = () => {
    if (settingStore.colorWeak) {
      const el = document.getElementsByTagName('html')[0]
      setTimeout(() => {
        el.classList.add('color-weak')
      }, 100)
    }
  }

  // 菜单布局切换
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

  return {
    // 方法
    initColorWeak,
    switchMenuLayouts
  }
}
