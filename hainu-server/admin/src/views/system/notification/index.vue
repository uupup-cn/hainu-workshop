<template>
  <div class="art-full-height">
    <ArtSearchBar
      v-show="showSearchBar"
      v-model="searchForm"
      :items="searchItems"
      :showExpand="false"
      @search="handleSearch"
      @reset="handleReset"
    />

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton v-if="hasAuth('add')" @click="openAddDialog" type="primary" plain v-ripple
              >新增通知</ElButton
            >
            <ElButton @click="router.push('/notification/inbox')" type="primary" plain v-ripple>
              我的收件箱
            </ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      />
    </ElCard>

    <NotificationDialog
      ref="dialogRef"
      v-model:visible="dialogVisible"
      v-model:form="form"
      :mode="dialogMode"
      :rules="rules"
      :role-options="roleOptions"
      :department-options="departmentOptions"
      :user-options="userOptions"
      :user-loading="userLoading"
      :scope-locked="scopeLocked"
      :submitting="submitting"
      @close="resetDialog"
      @submit="handleSubmit"
      @target-type-change="handleTargetTypeChange"
      @load-users="loadUserOptions"
    />
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useRouter } from 'vue-router'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useTable } from '@/hooks/core/useTable'
  import {
    fetchCreateNotification,
    fetchDeleteNotification,
    fetchNotificationAdminList,
    fetchNotificationDetail,
    fetchPublishNotification,
    fetchRevokeNotification,
    fetchUpdateNotification
  } from '@/api/notifications'
  import { fetchDepartments } from '@/api/departments'
  import { fetchRolesList } from '@/api/roles'
  import { fetchGetUserList } from '@/api/user'
  import { useNotificationStore } from '@/store/modules/notification'
  import NotificationDialog from './modules/notification-dialog.vue'
  import { createNotificationColumns } from './modules/useNotificationColumns'
  import {
    createNotificationForm,
    createNotificationRules,
    createNotificationSearchForm,
    notificationStatusOptions,
    notificationTargetTypeOptions,
    notificationTypeOptions
  } from './shared'

  defineOptions({ name: 'Notification' })

  type NotificationItem = Api.Interaction.NotificationItem
  type NotificationPayload = Api.Interaction.NotificationPayload
  type NotificationStatus = Api.Interaction.NotificationStatus

  const router = useRouter()
  const { hasAuth } = useAuth()
  const notificationStore = useNotificationStore()

  const showSearchBar = ref(false)
  const dialogVisible = ref(false)
  const submitting = ref(false)
  const userLoading = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editingId = ref<number>()
  const dialogRef = ref<InstanceType<typeof NotificationDialog> | null>(null)
  const currentStatus = ref<NotificationStatus>('PUBLISHED')

  const searchForm = ref(createNotificationSearchForm())

  /**
   * 构建通知管理搜索栏配置。
   */
  const searchItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: { clearable: true, placeholder: '请输入通知标题或摘要' }
    },
    {
      label: '通知类型',
      key: 'type',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择通知类型',
        options: notificationTypeOptions
      }
    },
    {
      label: '通知状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择通知状态',
        options: notificationStatusOptions
      }
    },
    {
      label: '发送范围',
      key: 'targetType',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择发送范围',
        options: notificationTargetTypeOptions
      }
    },
    {
      label: '创建时间',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        type: 'datetimerange',
        rangeSeparator: '至',
        startPlaceholder: '开始时间',
        endPlaceholder: '结束时间',
        valueFormat: 'YYYY-MM-DD HH:mm:ss'
      }
    }
  ])

  const roleOptions = ref<Api.Access.RoleListItem[]>([])
  const departmentOptions = ref<Api.Access.DepartmentItem[]>([])
  const userOptions = ref<Api.Identity.UserListItem[]>([])

  const form = reactive<NotificationPayload>(createNotificationForm())

  const scopeLocked = computed(
    () => dialogMode.value === 'edit' && currentStatus.value === 'PUBLISHED'
  )

  const rules = reactive(
    createNotificationRules(
      () => form.targetType,
      () => form
    )
  )

  /**
   * 跳转到管理端通知详情预览页。
   */
  const goDetail = (id: number) => router.push(`/notification/detail/${id}?scene=admin`)

  const {
    columns,
    columnChecks,
    data,
    loading,
    pagination,
    replaceSearchParams,
    resetSearchParams,
    handleSizeChange,
    handleCurrentChange,
    refreshData
  } = useTable({
    core: {
      apiFn: fetchNotificationAdminList,
      apiParams: {
        current: 1,
        size: 20
      },
      excludeParams: ['daterange'],
      columnsFactory: () =>
        createNotificationColumns({
          hasAuth,
          openEditDialog,
          openCopyDialog,
          handlePublish,
          handleRevoke,
          handleDelete,
          goDetail
        })
    }
  })

  onMounted(async () => {
    await Promise.all([loadRoleOptions(), loadDepartmentOptions(), loadUserOptions('')])
  })

  // 加载角色选项
  async function loadRoleOptions() {
    const res = await fetchRolesList({ current: 1, size: 200 })
    roleOptions.value = res.records
  }

  // 加载部门选项
  async function loadDepartmentOptions() {
    departmentOptions.value = await fetchDepartments()
  }

  // 按关键字加载用户选项
  async function loadUserOptions(keyword: string) {
    userLoading.value = true
    try {
      const res = await fetchGetUserList({
        current: 1,
        size: 200,
        username: keyword || undefined
      })
      userOptions.value = res.records
    } finally {
      userLoading.value = false
    }
  }

  // 提交筛选条件并刷新列表
  async function handleSearch() {
    const [startTime, endTime] = Array.isArray(searchForm.value.daterange)
      ? searchForm.value.daterange
      : [undefined, undefined]

    await replaceSearchParams({
      keyword: searchForm.value.keyword || undefined,
      type: searchForm.value.type,
      status: searchForm.value.status,
      targetType: searchForm.value.targetType,
      startTime,
      endTime
    })
  }

  // 重置筛选条件并重新查询
  function handleReset() {
    Object.assign(searchForm.value, createNotificationSearchForm())

    resetSearchParams()
  }

  // 切换发送范围时清空目标对象
  function handleTargetTypeChange() {
    form.targetRoleIds = []
    form.targetDepartmentIds = []
    form.targetUserIds = []
  }

  // 重置通知弹窗
  function resetDialog() {
    dialogRef.value?.clearValidate()
    dialogMode.value = 'add'
    editingId.value = undefined
    currentStatus.value = 'PUBLISHED'
    Object.assign(form, createNotificationForm())
  }

  // 打开新增通知弹窗
  function openAddDialog() {
    resetDialog()
    dialogMode.value = 'add'
    dialogVisible.value = true
  }

  // 将通知详情回填到表单
  function applyDetailToForm(
    detail: NotificationItem,
    options?: {
      mode?: 'add' | 'edit'
      status?: NotificationStatus
    }
  ) {
    dialogMode.value = options?.mode ?? 'edit'

    Object.assign(form, {
      title: detail.title,
      summary: detail.summary || '',
      content: detail.content,
      type: detail.type,
      targetType: detail.targetType,
      status: options?.status ?? detail.status,
      expiresAt: detail.expiresAt || '',
      targetRoleIds: detail.targetRoleIds || [],
      targetDepartmentIds: detail.targetDepartmentIds || [],
      targetUserIds: detail.targetUserIds || []
    })

    if (detail.targetUsers?.length) {
      const merged = [...userOptions.value]
      detail.targetUsers.forEach((item) => {
        if (!merged.some((user) => user.id === item.id)) {
          merged.push({
            id: item.id,
            username: item.username
          } as Api.Identity.UserListItem)
        }
      })
      userOptions.value = merged
    }
  }

  // 打开编辑通知弹窗并加载详情
  async function openEditDialog(id: number, status: NotificationStatus) {
    resetDialog()
    currentStatus.value = status
    editingId.value = id
    const detail = await fetchNotificationDetail(id)

    applyDetailToForm(detail, {
      mode: 'edit'
    })

    dialogVisible.value = true
  }

  // 打开复制通知弹窗
  async function openCopyDialog(id: number) {
    resetDialog()
    const detail = await fetchNotificationDetail(id)

    applyDetailToForm(detail, {
      mode: 'add',
      status: 'PUBLISHED'
    })

    dialogVisible.value = true
  }

  // 清洗并组装提交载荷
  function normalizePayload() {
    const payload: NotificationPayload = {
      title: form.title.trim(),
      summary: form.summary?.trim() || '',
      content: form.content,
      type: form.type,
      targetType: form.targetType,
      status: scopeLocked.value ? undefined : form.status,
      expiresAt: form.expiresAt || '',
      targetRoleIds: form.targetType === 'ROLE' ? form.targetRoleIds : [],
      targetDepartmentIds: form.targetType === 'DEPARTMENT' ? form.targetDepartmentIds : [],
      targetUserIds: form.targetType === 'USER' ? form.targetUserIds : []
    }

    if (!payload.summary) delete payload.summary
    if (!payload.expiresAt) delete payload.expiresAt
    if (!payload.targetRoleIds?.length) delete payload.targetRoleIds
    if (!payload.targetDepartmentIds?.length) delete payload.targetDepartmentIds
    if (!payload.targetUserIds?.length) delete payload.targetUserIds
    if (!payload.status) delete payload.status

    return payload
  }

  // 校验并提交通知表单
  async function handleSubmit() {
    const validateResult = dialogRef.value?.validate()
    if (!validateResult) return

    const valid = await validateResult.catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
      const payload = normalizePayload()
      if (dialogMode.value === 'add') {
        await fetchCreateNotification(payload)
      } else if (editingId.value) {
        await fetchUpdateNotification(editingId.value, payload)
      }

      dialogVisible.value = false
      refreshData()
      notificationStore.refreshBellData()
    } finally {
      submitting.value = false
    }
  }

  // 发布通知前二次确认
  async function handlePublish(row: NotificationItem) {
    await ElMessageBox.confirm(
      `确定发布通知“${row.title}”吗？发布后会立即推送给目标用户。`,
      '发布确认',
      {
        type: 'warning'
      }
    )
    await fetchPublishNotification(row.id)
    refreshData()
    notificationStore.refreshBellData()
  }

  // 撤回通知前二次确认
  async function handleRevoke(row: NotificationItem) {
    await ElMessageBox.confirm(
      `确定撤回通知“${row.title}”吗？撤回后用户将不再收到该通知。`,
      '撤回确认',
      {
        type: 'warning'
      }
    )
    await fetchRevokeNotification(row.id)
    refreshData()
    notificationStore.refreshBellData()

    ElMessage.success('通知已撤回')
  }

  // 删除通知前二次确认
  async function handleDelete(row: NotificationItem) {
    await ElMessageBox.confirm(`确定删除通知“${row.title}”吗？删除后将无法恢复。`, '删除确认', {
      type: 'warning'
    })
    await fetchDeleteNotification(row.id)
    refreshData()
    notificationStore.refreshBellData()
  }
</script>

<style scoped>
  .preview-content :deep(img) {
    max-width: 100%;
    height: auto;
    border-radius: 8px;
  }
</style>
