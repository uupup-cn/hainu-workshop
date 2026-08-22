import { storeToRefs } from 'pinia'
import { watch } from 'vue'
import { LayoutDirectionEnum } from '@/enums/appEnum'
import { useSettingStore } from '@/store/modules/setting'

/**
 * 应用布局方向到根节点
 * @param direction 布局方向
 */
export const applyLayoutDirection = (direction: LayoutDirectionEnum) => {
  if (typeof document === 'undefined') return

  const html = document.documentElement
  const body = document.body

  html.setAttribute('dir', direction)
  html.setAttribute('data-layout-direction', direction)

  if (body) {
    body.setAttribute('dir', direction)
    body.setAttribute('data-layout-direction', direction)
  }
}

/**
 * 布局方向管理
 */
export function useLayoutDirection() {
  const settingStore = useSettingStore()
  const { layoutDirection } = storeToRefs(settingStore)

  const syncLayoutDirection = () => {
    applyLayoutDirection(layoutDirection.value)
  }

  const setLayoutDirection = (direction: LayoutDirectionEnum) => {
    settingStore.setLayoutDirection(direction)
    applyLayoutDirection(direction)
  }

  watch(layoutDirection, applyLayoutDirection, { immediate: true })

  return {
    layoutDirection,
    syncLayoutDirection,
    setLayoutDirection
  }
}
