<!-- 水印组件 -->
<template>
  <div
    v-if="shouldShowWatermark"
    class="fixed left-0 top-0 h-screen w-screen pointer-events-none"
    :style="{ zIndex: props.zIndex }"
  >
    <ElWatermark
      :content="props.content || siteWatermarkText"
      :font="{ fontSize: props.fontSize, color: props.fontColor }"
      :rotate="props.rotate"
      :gap="[props.gapX, props.gapY]"
      :offset="[props.offsetX, props.offsetY]"
    >
      <div style="height: 100vh"></div>
    </ElWatermark>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'

  defineOptions({ name: 'ArtWatermark' })

  const settingStore = useSettingStore()
  const siteSettingsStore = useSiteSettingsStore()
  const userStore = useUserStore()
  const { watermarkVisible } = storeToRefs(settingStore)
  const now = ref(new Date())
  let timer: ReturnType<typeof setInterval> | undefined

  const shouldShowWatermark = computed(
    () => siteSettingsStore.watermarkEnabled && watermarkVisible.value
  )

  const formatWatermarkTime = (date: Date) => {
    const pad = (value: number) => String(value).padStart(2, '0')

    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(
      date.getHours()
    )}:${pad(date.getMinutes())}`
  }

  const username = computed(() => {
    const userInfo = userStore.getUserInfo
    return userInfo.username || userInfo.nickName || userInfo.realName || '用户名'
  })

  const siteWatermarkText = computed(() => {
    const mode = siteSettingsStore.watermarkMode
    const siteName = siteSettingsStore.siteBrandName || AppConfig.systemInfo.name
    const customText = siteSettingsStore.watermarkText || siteName

    if (mode === 'USERNAME_TIME') {
      return `${username.value} ${formatWatermarkTime(now.value)}`
    }

    if (mode === 'SITE_NAME') {
      return siteName
    }

    if (mode === 'CUSTOM_TEXT') {
      return customText
    }

    return username.value
  })

  onMounted(() => {
    timer = setInterval(() => {
      now.value = new Date()
    }, 60 * 1000)
  })

  onUnmounted(() => {
    if (timer) clearInterval(timer)
  })

  interface WatermarkProps {
    /** 水印内容 */
    content?: string
    /** 水印是否可见 */
    visible?: boolean
    /** 水印字体大小 */
    fontSize?: number
    /** 水印字体颜色 */
    fontColor?: string
    /** 水印旋转角度 */
    rotate?: number
    /** 水印间距X */
    gapX?: number
    /** 水印间距Y */
    gapY?: number
    /** 水印偏移X */
    offsetX?: number
    /** 水印偏移Y */
    offsetY?: number
    /** 水印层级 */
    zIndex?: number
  }

  const props = withDefaults(defineProps<WatermarkProps>(), {
    content: undefined,
    visible: false,
    fontSize: 16,
    fontColor: 'rgba(128, 128, 128, 0.2)',
    rotate: -22,
    gapX: 100,
    gapY: 100,
    offsetX: 50,
    offsetY: 50,
    zIndex: 3100
  })
</script>
