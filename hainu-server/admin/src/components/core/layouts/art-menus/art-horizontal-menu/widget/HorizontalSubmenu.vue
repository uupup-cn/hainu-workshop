<template>
  <ElSubMenu
    v-if="hasChildren"
    :index="item.path || item.meta.title"
    popper-class="horizontal-menu-popper"
    class="!p-0"
  >
    <template #title>
      <span class="inline-flex items-center gap-1">
        <ArtSvgIcon :icon="item.meta.icon" :color="theme?.iconColor" class="text-lg shrink-0" />
        <span class="text-md">{{ formatMenuTitle(item.meta.title) }}</span>
      </span>
      <div v-if="item.meta.showBadge" class="art-badge art-badge-horizontal" />
      <div v-if="item.meta.showTextBadge" class="art-text-badge">
        {{ item.meta.showTextBadge }}
      </div>
    </template>

    <!-- 递归调用自身处理子菜单 -->
    <HorizontalSubmenu
      v-for="child in filteredChildren"
      :key="child.path"
      :item="child"
      :theme="theme"
      :is-mobile="isMobile"
      :level="level + 1"
      @close="closeMenu"
    />
  </ElSubMenu>

  <ElMenuItem
    v-else-if="isNavigableRoute"
    :index="item.path || item.meta.title"
    @click="goPage(item)"
  >
    <span class="inline-flex items-center gap-1">
      <ArtSvgIcon
        :icon="item.meta.icon"
        :color="theme?.iconColor"
        class="text-lg shrink-0"
        :style="{ color: theme.iconColor }"
      />
      <span class="text-md">{{ formatMenuTitle(item.meta.title) }}</span>
    </span>
    <div v-if="item.meta.showBadge" class="art-badge" :style="getBadgeOffsetStyle(level)" />
    <div v-if="item.meta.showTextBadge && level !== 0" class="art-text-badge">
      {{ item.meta.showTextBadge }}
    </div>
  </ElMenuItem>
</template>

<script lang="ts" setup>
  import { computed, type PropType } from 'vue'
  import { AppRouteRecord } from '@/types/router'
  import { handleMenuJump } from '@/utils/navigation'
  import { formatMenuTitle } from '@/utils/router'
  import { useSettingStore } from '@/store/modules/setting'

  const props = defineProps({
    item: {
      type: Object as PropType<AppRouteRecord>,
      required: true
    },
    theme: {
      type: Object,
      default: () => ({})
    },
    isMobile: Boolean,
    level: {
      type: Number,
      default: 0
    }
  })

  const emit = defineEmits(['close'])
  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)
  const getBadgeOffsetStyle = (level: number) =>
    isRtl.value
      ? { left: level === 0 ? '10px' : '20px', right: 'auto' }
      : { right: level === 0 ? '10px' : '20px', left: 'auto' }

  // 过滤后的子菜单项（不包含隐藏的）
  const filteredChildren = computed(() => {
    return props.item.children?.filter((child) => !child.meta.isHide) || []
  })

  // 父菜单如果本身就是页面，则即使没有可见子菜单也应该保留为菜单项。
  const isNavigableRoute = computed(() => {
    return !!(
      !props.item.meta.isHide &&
      ((props.item.path && props.item.path.trim()) ||
        props.item.meta.link ||
        props.item.meta.isIframe === true) &&
      (props.item.component || props.item.meta.link || props.item.meta.isIframe === true)
    )
  })

  // 计算当前项是否有可见的子菜单
  const hasChildren = computed(() => {
    return filteredChildren.value.length > 0
  })

  const goPage = (item: AppRouteRecord) => {
    closeMenu()
    handleMenuJump(item)
  }

  const closeMenu = () => {
    emit('close')
  }
</script>
