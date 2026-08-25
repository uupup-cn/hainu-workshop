<template>
  <div class="page-content">
    <ElCard
      shadow="never"
      class="art-surface-sm !border-[var(--art-inner-surface-border)] !shadow-none"
    >
      <template #header>
        <div class="flex items-center justify-between gap-4">
          <div>
            <div class="text-lg font-semibold">{{ detail?.title || '通知详情' }}</div>
            <div class="text-xs text-g-500 mt-1">
              {{ detail ? formatDateTime(detail.publishedAt) : '加载中...' }}
            </div>
          </div>
          <ElSpace>
            <ElButton @click="goBack">返回</ElButton>
            <ElButton
              v-if="scene === 'admin'"
              type="primary"
              plain
              @click="router.push('/system/notification/manage')"
            >
              通知管理
            </ElButton>
          </ElSpace>
        </div>
      </template>

      <template v-if="detail">
        <div class="flex flex-wrap gap-2 mb-4">
          <ElTag :type="getTypeTagType(detail.type)">{{ getTypeText(detail.type) }}</ElTag>
          <ElTag v-if="isAdminDetail" :type="getStatusTagType(adminDetail?.status || 'DRAFT')">
            {{ getStatusText(adminDetail?.status || 'DRAFT') }}
          </ElTag>
          <ElTag type="info">
            发布人：{{ detail.createdBy?.username || adminDetail?.createdBy?.username || '系统' }}
          </ElTag>
        </div>
        <div v-if="detail.summary" class="summary-box">{{ detail.summary }}</div>
        <div class="detail-content markdown-body" v-highlight v-html="detail.content"></div>
      </template>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import '@/assets/styles/core/md.scss'
  import '@/assets/styles/custom/one-dark-pro.scss'
  import { useRoute, useRouter } from 'vue-router'
  import { fetchNotificationDetail, fetchNotificationInboxDetail } from '@/api/notifications'
  import { useNotificationStore } from '@/store/modules/notification'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'NotificationDetail' })

  const route = useRoute()
  const router = useRouter()
  const notificationStore = useNotificationStore()

  /**
   * 解析详情来源场景，区分管理端预览和用户收件箱详情。
   */
  const scene = computed(() => String(route.query.scene || 'inbox'))
  const detail = ref<Api.Interaction.NotificationInboxItem>()
  const adminDetail = ref<Api.Interaction.NotificationItem>()
  /**
   * 判断当前详情是否来自通知管理页面。
   */
  const isAdminDetail = computed(() => scene.value === 'admin')

  onMounted(() => {
    loadDetail()
  })

  // 加载通知详情
  async function loadDetail() {
    const id = Number(route.params.id)
    if (!id) return

    if (scene.value === 'admin') {
      adminDetail.value = await fetchNotificationDetail(id)
      detail.value = {
        id: adminDetail.value.id,
        recipientId: 0,
        title: adminDetail.value.title,
        summary: adminDetail.value.summary,
        content: adminDetail.value.content,
        type: adminDetail.value.type,
        isRead: true,
        readAt: adminDetail.value.publishedAt || adminDetail.value.updatedAt,
        publishedAt: adminDetail.value.publishedAt || adminDetail.value.updatedAt,
        createdBy: adminDetail.value.createdBy
      }
      return
    }

    await notificationStore.markAsRead(id).catch(() => undefined)
    detail.value = await fetchNotificationInboxDetail(id)
    await notificationStore.refreshBellData()
  }

  // 返回上一页
  function goBack() {
    if (scene.value === 'admin') {
      router.push('/system/notification/manage')
      return
    }

    router.push('/system/notification/inbox')
  }

  // 获取通知类型文案
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

  // 获取通知状态文案
  function getStatusText(status: Api.Interaction.NotificationStatus) {
    return (
      {
        DRAFT: '草稿',
        PUBLISHED: '已发布',
        REVOKED: '已撤回'
      }[status] || status
    )
  }

  // 获取通知类型标签样式
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

  // 获取通知状态标签样式
  function getStatusTagType(
    status: Api.Interaction.NotificationStatus
  ): 'info' | 'success' | 'warning' {
    switch (status) {
      case 'PUBLISHED':
        return 'success'
      case 'REVOKED':
        return 'warning'
      default:
        return 'info'
    }
  }
</script>

<style scoped>
  .summary-box {
    padding: 14px 16px;
    margin-bottom: 16px;
    color: var(--el-text-color-secondary);
    background: var(--el-fill-color-light);
    border-radius: 12px;
  }

  .detail-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }

  .detail-content:deep(table) {
    display: table;
    width: 100%;
  }
</style>
