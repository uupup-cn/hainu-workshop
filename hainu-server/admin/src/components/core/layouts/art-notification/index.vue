<template>
  <div
    class="art-notification-panel art-card-xs flex flex-col"
    :style="{
      transform: show ? 'scaleY(1)' : 'scaleY(0.9)',
      opacity: show ? 1 : 0
    }"
    v-show="visible"
    @click.stop
  >
    <div class="flex-cb px-3.5 mt-3.5 pb-3 border-b border-[var(--default-border)]">
      <span class="text-base font-medium text-g-800">{{ $t('notice.title') }}</span>
      <span
        class="text-xs text-g-800 px-1.5 py-1 c-p select-none rounded hover:bg-g-200"
        @click="handleReadAll"
      >
        {{ $t('notice.btnRead') }}
      </span>
    </div>

    <div class="flex-1 min-h-0 flex flex-col w-full">
      <ElScrollbar class="flex-1 min-h-0">
        <ul v-if="inbox.length">
          <li
            v-for="item in inbox"
            :key="item.id"
            class="box-border flex gap-3.5 px-3.5 py-3.5 c-p border-b border-dashed border-[var(--default-border)] hover:bg-g-200/60"
            @click="handleItemClick(item)"
          >
            <div
              class="size-9 leading-9 text-center rounded-lg flex-cc shrink-0"
              :class="[getNoticeStyle(item.type).iconClass]"
            >
              <ArtSvgIcon class="text-lg !bg-transparent" :icon="getNoticeStyle(item.type).icon" />
            </div>
            <div class="min-w-0 flex-1 text-start">
              <div class="flex items-start gap-2">
                <h4 class="text-sm leading-5.5 line-clamp-2 flex-1">
                  {{ item.title }}
                </h4>
                <span
                  v-if="!item.isRead"
                  class="mt-1 size-[6px] rounded-full bg-danger shrink-0"
                ></span>
              </div>
              <p v-if="item.summary" class="mt-1 text-xs text-g-500 line-clamp-2">{{
                item.summary
              }}</p>
              <p class="mt-1.5 text-xs text-g-500">{{ formatDateTime(item.publishedAt) }}</p>
            </div>
          </li>
        </ul>

        <div v-else class="relative top-25 h-full text-g-500 text-center !bg-transparent">
          <ArtSvgIcon icon="system-uicons:inbox" class="text-5xl" />
          <p class="mt-3.5 text-xs !bg-transparent">{{ $t('notice.empty') }}</p>
        </div>
      </ElScrollbar>

      <div class="relative box-border w-full px-3.5 py-3 shrink-0">
        <ElButton plain class="w-full" @click="handleViewAll" v-ripple>
          {{ $t('notice.viewAll') }}
        </ElButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { watch } from 'vue'
  import { useRouter } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import { useNotificationStore } from '@/store/modules/notification'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'ArtNotification' })

  type NoticeType = Api.Interaction.NotificationType

  interface NoticeStyle {
    icon: string
    iconClass: string
  }

  const props = defineProps<{
    value: boolean
  }>()

  const emit = defineEmits<{
    'update:value': [value: boolean]
  }>()

  const router = useRouter()
  const notificationStore = useNotificationStore()
  const { inbox } = storeToRefs(notificationStore)

  const show = ref(false)
  const visible = ref(false)

  const noticeStyleMap: Record<NoticeType, NoticeStyle> = {
    SYSTEM: {
      icon: 'ri:notification-3-line',
      iconClass: 'bg-theme/14 text-theme'
    },
    ANNOUNCEMENT: {
      icon: 'ri:megaphone-line',
      iconClass: 'bg-success/14 text-success'
    },
    ALERT: {
      icon: 'ri:alarm-warning-line',
      iconClass: 'bg-danger/14 text-danger'
    },
    UPDATE: {
      icon: 'ri:rocket-line',
      iconClass: 'bg-warning/14 text-warning'
    }
  }

  const getNoticeStyle = (type: NoticeType): NoticeStyle => {
    return (
      noticeStyleMap[type] || {
        icon: 'ri:notification-3-line',
        iconClass: 'bg-theme/14 text-theme'
      }
    )
  }

  const showNotice = (open: boolean) => {
    if (open) {
      visible.value = true
      notificationStore.refreshBellData()
      setTimeout(() => {
        show.value = true
      }, 5)
    } else {
      show.value = false
      setTimeout(() => {
        visible.value = false
      }, 350)
    }
  }

  const handleReadAll = async () => {
    if (!inbox.value.length) return
    await notificationStore.markAllAsRead()
  }

  const handleItemClick = async (item: Api.Interaction.NotificationInboxItem) => {
    if (!item.isRead) {
      await notificationStore.markAsRead(item.id)
    }

    emit('update:value', false)
    router.push(`/system/notification/detail/${item.id}?scene=inbox`)
  }

  const handleViewAll = () => {
    emit('update:value', false)
    router.push('/system/notification/inbox')
  }

  watch(
    () => props.value,
    (newValue) => {
      showNotice(newValue)
    }
  )
</script>

<style>
  @reference '@styles/core/tailwind.css';

  .art-notification-panel {
    @apply absolute 
    top-14.5 
    right-5 
    w-85 
    h-120 
    overflow-hidden 
    transition-all 
    duration-300
    origin-top 
    will-change-[top,left,right] 
    max-[640px]:top-[65px]
    max-[640px]:left-3
    max-[640px]:right-3
    max-[640px]:w-auto 
    max-[640px]:h-[80vh];

    z-index: 80;
    background: var(--default-box-color);
    isolation: isolate;
    box-shadow:
      0 18px 36px -12px rgb(15 23 42 / 28%),
      0 8px 18px -14px rgb(15 23 42 / 24%) !important;
    backface-visibility: hidden;
  }

  .dark .art-notification-panel {
    box-shadow:
      0 22px 48px -14px rgb(0 0 0 / 62%),
      0 10px 22px -16px rgb(0 0 0 / 52%) !important;
  }

  .art-notification-panel .el-scrollbar__wrap,
  .art-notification-panel .el-scrollbar__view {
    background: var(--default-box-color);
  }
</style>
