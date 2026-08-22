<template>
  <ElDrawer v-model="visible" title="安全审计详情" :size="drawerSize">
    <div v-loading="detailLoading" class="flex flex-col gap-5">
      <div class="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">事件编号</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.auditNo || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">事件类型</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            getEventTypeLabel(detail?.eventType)
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">风险等级</span>
          <ElTag
            class="mt-1.5"
            :type="getSeverityTagType(detail?.severity)"
            effect="light"
            size="small"
          >
            {{ getSeverityLabel(detail?.severity) }}
          </ElTag>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">处置状态</span>
          <ElTag
            class="mt-1.5"
            :type="getStatusTagType(detail?.status)"
            effect="light"
            size="small"
          >
            {{ getStatusLabel(detail?.status) }}
          </ElTag>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">风险分</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.riskScore ?? '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">累计触发</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900"
            >{{ detail?.occurrenceCount ?? '-' }} 次</strong
          >
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">关联用户</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.username || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">来源 IP</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.ip || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">模块</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.module || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">请求</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900"
            >{{ detail?.method || '-' }} {{ detail?.path || '' }}</strong
          >
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">首次触发</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            formatDateTime(detail?.firstOccurredAt) || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">最近触发</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            formatDateTime(detail?.lastOccurredAt) || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">处置人</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            detail?.handler?.username || '-'
          }}</strong>
        </div>
        <div
          class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px]"
        >
          <span class="block text-xs leading-[1.4] text-g-500">处置时间</span>
          <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
            formatDateTime(detail?.handledAt) || '-'
          }}</strong>
        </div>
      </div>

      <div
        class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px] sm:col-span-2"
      >
        <span class="block text-xs leading-[1.4] text-g-500">处置备注</span>
        <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
          detail?.handledRemark || '-'
        }}</strong>
      </div>

      <div
        class="flex min-w-0 flex-col items-start rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] px-3.5 py-[13px] sm:col-span-2"
      >
        <span class="block text-xs leading-[1.4] text-g-500">事件描述</span>
        <strong class="mt-1.5 block truncate text-sm font-semibold leading-[1.35] text-g-900">{{
          detail?.description || '-'
        }}</strong>
      </div>

      <div class="rounded-[var(--art-radius-surface-xs)]">
        <div class="mb-2 text-[13px] font-medium text-g-700">审计载荷</div>
        <pre
          class="overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4 font-mono text-xs leading-[1.6] text-g-800"
          >{{ formattedPayload }}</pre
        >
      </div>

      <div v-if="detail?.operationLog" class="rounded-[var(--art-radius-surface-xs)]">
        <div class="mb-2 text-[13px] font-medium text-g-700">关联操作日志</div>
        <pre
          class="overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4 font-mono text-xs leading-[1.6] text-g-800"
          >{{ formattedOperationLog }}</pre
        >
      </div>

      <div v-if="detail?.loginLog" class="rounded-[var(--art-radius-surface-xs)]">
        <div class="mb-2 text-[13px] font-medium text-g-700">关联登录日志</div>
        <pre
          class="overflow-x-auto whitespace-pre-wrap break-all rounded-[var(--art-radius-surface-xs)] border border-[var(--art-inner-surface-border)] bg-[var(--art-surface-bg-muted)] p-4 font-mono text-xs leading-[1.6] text-g-800"
          >{{ formattedLoginLog }}</pre
        >
      </div>
    </div>
  </ElDrawer>
</template>

<script setup lang="ts">
  import { ElTag } from 'element-plus'
  import { formatDateTime } from '@/utils'

  type TagType = 'primary' | 'success' | 'warning' | 'info' | 'danger'

  defineProps<{
    detailLoading: boolean
    detail: Api.Audit.SecurityAuditEventDetail | null
    formattedPayload: string
    formattedOperationLog: string
    formattedLoginLog: string
    getSeverityTagType: (severity?: Api.Audit.SecurityAuditSeverity | null) => TagType
    getSeverityLabel: (severity?: Api.Audit.SecurityAuditSeverity | null) => string
    getStatusTagType: (status?: Api.Audit.SecurityAuditStatus | null) => TagType
    getStatusLabel: (status?: Api.Audit.SecurityAuditStatus | null) => string
    getEventTypeLabel: (type?: string | null) => string
  }>()

  const visible = defineModel<boolean>('visible', { required: true })

  const { width } = useWindowSize()
  const drawerSize = computed(() => {
    if (width.value < 768) return '100%'
    if (width.value < 1440) return '88%'
    return '760px'
  })
</script>
