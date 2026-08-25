<template>
  <div class="page-content flex !p-0 max-lg:flex-col" :style="{ height: containerMinHeight }">
    <aside
      class="box-border flex w-[360px] shrink-0 flex-col border-r-d max-lg:w-full max-lg:border-r-0 max-lg:border-b-d"
    >
      <div class="border-b-d px-5 pb-4 pt-5">
        <div class="flex-cb gap-3">
          <div>
            <div class="text-lg font-semibold text-g-900">通知收件箱</div>
            <div class="mt-1 text-sm text-g-500">集中查看发给当前账号的系统消息与提醒</div>
          </div>
        </div>

        <div class="mt-4">
          <ElInput
            v-model="searchQuery"
            placeholder="搜索通知标题或摘要"
            clearable
            :prefix-icon="Search"
          />
        </div>

        <div class="mt-4 grid grid-cols-2 gap-3">
          <div class="art-surface-muted p-3">
            <div class="text-xs text-g-500">全部通知</div>
            <div class="mt-2 text-2xl font-semibold text-g-900">{{ totalCount }}</div>
          </div>
          <div class="art-surface-muted p-3">
            <div class="text-xs text-g-500">未读消息</div>
            <div class="mt-2 text-2xl font-semibold text-g-900">{{ unreadCount }}</div>
          </div>
        </div>

        <div class="mt-4 flex flex-wrap items-center gap-3">
          <ElRadioGroup v-model="onlyUnread" @change="handleFilterChange">
            <ElRadioButton :label="false">全部</ElRadioButton>
            <ElRadioButton :label="true">未读</ElRadioButton>
          </ElRadioGroup>
          <ElButton text type="primary" @click="handleReadAll" :disabled="!unreadCount">
            全部已读
          </ElButton>
        </div>

        <div class="mt-3 text-xs text-g-500">
          当前展示 {{ filteredRecords.length }} 条{{ onlyUnread ? '未读' : '' }}通知
        </div>
      </div>

      <ElScrollbar
        v-loading="loading"
        class="min-h-0 flex-1 [&_.el-scrollbar__wrap]:overflow-x-hidden [&_.el-scrollbar__view]:min-h-full"
      >
        <div v-if="filteredRecords.length" class="p-3">
          <button
            v-for="item in filteredRecords"
            :key="item.id"
            type="button"
            class="relative mb-2 w-full appearance-none rounded-custom-sm border border-[var(--default-border)] bg-transparent p-3 text-left tad-200 c-p hover:bg-active-color/20"
            :class="item.id === activeId ? 'art-surface-sm !bg-g-100' : ''"
            @click="openDetail(item)"
          >
            <div class="flex items-start gap-3">
              <div class="min-w-0 flex-1">
                <div class="flex items-start gap-2">
                  <div class="line-clamp-1 flex-1 text-sm font-semibold leading-6 text-g-900">
                    {{ item.title }}
                  </div>
                  <span
                    v-if="!item.isRead"
                    class="mt-2 size-2 shrink-0 rounded-full bg-danger"
                  ></span>
                </div>

                <div class="mt-1 line-clamp-2 text-xs leading-5 text-g-500">
                  {{ item.summary || '点击查看完整通知内容' }}
                </div>

                <div class="mt-3 flex items-center justify-between gap-3">
                  <span
                    class="rounded-full px-2 py-1 text-[11px] font-medium"
                    :class="getTypeSoftClass(item.type)"
                  >
                    {{ getTypeText(item.type) }}
                  </span>
                  <span class="shrink-0 text-xs text-g-500">{{
                    formatDateTime(item.publishedAt)
                  }}</span>
                </div>
              </div>
            </div>
          </button>
        </div>

        <div v-else class="flex min-h-full items-center justify-center p-6">
          <ElEmpty
            :description="searchQuery ? '没有找到匹配的通知' : '暂无通知'"
            :image-size="120"
          />
        </div>
      </ElScrollbar>
    </aside>

    <section class="flex min-h-0 flex-1 flex-col">
      <template v-if="detail">
        <div class="border-b-d px-6 pb-6 pt-6 max-md:px-4">
          <div class="flex items-start justify-between gap-4 max-lg:flex-col">
            <div class="min-w-0 flex-1">
              <div class="flex items-center gap-3">
                <div class="min-w-0">
                  <div
                    class="line-clamp-2 text-xl font-semibold leading-8 text-g-900 max-md:text-lg"
                  >
                    {{ detail.title }}
                  </div>
                  <div class="mt-2 line-clamp-2 text-[13px] leading-[1.75] text-g-500">
                    {{ detail.summary || '这里展示通知的详细内容和处理上下文。' }}
                  </div>
                </div>
              </div>
            </div>

            <ElSpace wrap class="shrink-0">
              <ElButton @click="router.push('/system/notification/manage')">进入通知管理</ElButton>
              <ElButton
                type="primary"
                plain
                @click="router.push(`/system/notification/detail/${detail.id}?scene=inbox`)"
              >
                独立页查看
              </ElButton>
            </ElSpace>
          </div>

          <div class="mt-5 grid grid-cols-2 gap-3 xl:grid-cols-4">
            <div class="art-surface-muted p-3">
              <div class="text-xs text-g-500">通知类型</div>
              <div class="mt-2 flex items-center gap-2 text-sm font-medium text-g-900">
                <span class="size-2 rounded-full" :class="getTypeDotClass(detail.type)"></span>
                {{ getTypeText(detail.type) }}
              </div>
            </div>
            <div class="art-surface-muted p-3">
              <div class="text-xs text-g-500">阅读状态</div>
              <div class="mt-2 text-sm font-medium text-g-900">
                {{ detail.isRead ? '已读' : '未读' }}
              </div>
            </div>
            <div class="art-surface-muted p-3">
              <div class="text-xs text-g-500">发送人</div>
              <div class="mt-2 text-sm font-medium text-g-900">
                {{ detail.createdBy?.username || '系统' }}
              </div>
            </div>
            <div class="art-surface-muted p-3">
              <div class="text-xs text-g-500">发布时间</div>
              <div class="mt-2 text-sm font-medium text-g-900">
                {{ formatDateTime(detail.publishedAt) }}
              </div>
            </div>
          </div>
        </div>

        <ElScrollbar class="min-h-0 flex-1">
          <div class="px-6 py-5 max-md:px-4">
            <div class="mb-4 flex flex-wrap gap-2">
              <ElTag :type="getTypeTagType(detail.type)">{{ getTypeText(detail.type) }}</ElTag>
              <ElTag :type="detail.isRead ? 'info' : 'danger'">
                {{ detail.isRead ? '已读' : '未读' }}
              </ElTag>
              <ElTag type="info">收件箱通知</ElTag>
              <ElTag v-if="detail.readAt" type="info">
                阅读于：{{ formatDateTime(detail.readAt) }}
              </ElTag>
            </div>

            <div
              v-if="detail.summary"
              class="mb-5 art-surface-muted px-4 py-3 text-[13px] leading-[1.75] text-g-600"
            >
              {{ detail.summary }}
            </div>

            <div
              class="detail-content art-surface-sm px-5 py-5 markdown-body [&_img]:h-auto [&_img]:max-w-full [&_img]:rounded-[8px] [&_li]:!text-[15px] [&_p]:!text-[15px] [&_table]:table [&_table]:w-full"
              v-highlight
              v-html="detail.content"
            ></div>
          </div>
        </ElScrollbar>
      </template>

      <div v-else class="flex flex-1 items-center justify-center">
        <ElEmpty description="请选择左侧通知查看详情" :image-size="120" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/core/md.scss'
  import '@/assets/styles/custom/one-dark-pro.scss'
  import { Search } from '@element-plus/icons-vue'
  import { storeToRefs } from 'pinia'
  import { useRoute, useRouter } from 'vue-router'
  import { fetchNotificationInbox, fetchNotificationInboxDetail } from '@/api/notifications'
  import { useAutoLayoutHeight } from '@/hooks/core/useLayoutHeight'
  import { useNotificationStore } from '@/store/modules/notification'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'NotificationInbox' })

  const route = useRoute()
  const router = useRouter()
  const notificationStore = useNotificationStore()
  const { loading } = storeToRefs(notificationStore)
  const { containerMinHeight } = useAutoLayoutHeight()

  const searchQuery = ref('')
  const onlyUnread = ref(false)
  const totalCount = ref(0)
  const unreadCount = ref(0)
  const records = ref<Api.Interaction.NotificationInboxItem[]>([])
  const detail = ref<Api.Interaction.NotificationInboxItem>()
  const activeId = ref<number>()

  /**
   * 根据左侧搜索关键词过滤当前收件箱列表。
   */
  const filteredRecords = computed(() => {
    const keyword = searchQuery.value.trim().toLowerCase()
    if (!keyword) return records.value

    return records.value.filter((item) => {
      return [item.title, item.summary || '', getTypeText(item.type)].some((field) =>
        String(field).toLowerCase().includes(keyword)
      )
    })
  })

  onMounted(() => {
    refreshInbox()
  })

  watch(
    () => route.query.id,
    async (id) => {
      const parsedId = Number(id)
      if (!parsedId || parsedId === activeId.value || !records.value.length) return

      const matched = records.value.find((item) => item.id === parsedId)
      if (matched) {
        await openDetail(matched, false)
      }
    }
  )

  /**
   * 刷新收件箱列表、未读数量和当前详情。
   */
  async function refreshInbox() {
    const data = await fetchNotificationInbox({
      current: 1,
      size: 50,
      onlyUnread: onlyUnread.value
    })

    records.value = data.records
    totalCount.value = data.total
    unreadCount.value = data.unreadCount
    await notificationStore.refreshBellData()

    if (!records.value.length) {
      detail.value = undefined
      activeId.value = undefined
      return
    }

    const routeId = Number(route.query.id)
    const matched =
      records.value.find((item) => item.id === routeId) ||
      records.value.find((item) => item.id === activeId.value) ||
      records.value[0]

    await openDetail(matched, false)
  }

  /**
   * 打开通知详情，必要时同步已读状态和路由参数。
   * @param item 通知列表项。
   * @param syncRoute 是否把当前通知 ID 同步到路由。
   */
  async function openDetail(
    item: Api.Interaction.NotificationInboxItem,
    syncRoute: boolean = true
  ) {
    activeId.value = item.id

    if (!item.isRead) {
      await notificationStore.markAsRead(item.id)
      item.isRead = true
      unreadCount.value = Math.max(0, unreadCount.value - 1)
    }

    detail.value = await fetchNotificationInboxDetail(item.id)

    if (syncRoute) {
      router.replace(`/system/notification/inbox?id=${item.id}`)
    }
  }

  /**
   * 将当前用户的通知全部标记为已读。
   */
  async function handleReadAll() {
    await notificationStore.markAllAsRead()
    await refreshInbox()
  }

  /**
   * 切换未读筛选条件并重新加载收件箱。
   */
  async function handleFilterChange() {
    searchQuery.value = ''
    await refreshInbox()
  }

  /**
   * 获取通知类型文案。
   */
  function getTypeText(type: Api.Interaction.NotificationType) {
    return (
      {
        SYSTEM: '系统通知',
        ANNOUNCEMENT: '公告通知',
        ALERT: '预警通知',
        UPDATE: '更新通知'
      }[type] || type
    )
  }

  /**
   * 获取通知详情区的类型浅色样式。
   */
  function getTypeSoftClass(type: Api.Interaction.NotificationType) {
    return (
      {
        SYSTEM: 'bg-theme/10 text-theme',
        ANNOUNCEMENT: 'bg-success/10 text-success',
        ALERT: 'bg-danger/10 text-danger',
        UPDATE: 'bg-warning/10 text-warning'
      }[type] || 'bg-theme/10 text-theme'
    )
  }

  /**
   * 获取未读圆点的类型颜色样式。
   */
  function getTypeDotClass(type: Api.Interaction.NotificationType) {
    return (
      {
        SYSTEM: 'bg-theme',
        ANNOUNCEMENT: 'bg-success',
        ALERT: 'bg-danger',
        UPDATE: 'bg-warning'
      }[type] || 'bg-theme'
    )
  }

  /**
   * 获取通知类型对应的标签颜色。
   */
  function getTypeTagType(
    type: Api.Interaction.NotificationType
  ): 'primary' | 'success' | 'warning' | 'danger' {
    switch (type) {
      case 'ANNOUNCEMENT':
        return 'success'
      case 'ALERT':
        return 'danger'
      case 'UPDATE':
        return 'warning'
      default:
        return 'primary'
    }
  }
</script>
