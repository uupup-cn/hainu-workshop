<template>
  <ElDialog v-model="visible" title="数据权限" width="960px" align-center @close="handleClose">
    <div
      class="rounded-custom-sm border border-[var(--el-border-color-light)] px-4 py-3 text-sm leading-6 text-[var(--art-gray-700)]"
    >
      数据权限会在后端强制生效。列表、详情、导出、删除等接口会按当前角色配置自动注入范围条件。
    </div>

    <ElScrollbar v-loading="loading" height="65vh" class="mt-4 pr-2">
      <div class="space-y-4">
        <div
          v-for="resource in resources"
          :key="resource.resourceCode"
          class="rounded-custom border border-[var(--el-border-color-light)] p-5"
        >
          <div class="flex flex-wrap items-start justify-between gap-3">
            <div>
              <div class="text-base font-semibold text-[var(--art-gray-900)]">
                {{ resource.resourceName }}
              </div>
              <div class="mt-1 text-xs text-[var(--art-gray-500)]">
                {{ resource.resourceCode }} · {{ resource.entity }}
              </div>
            </div>

            <div class="flex items-center gap-3">
              <ElTag size="small" effect="plain" type="info">
                {{ resource.treeStrategy === 'ANCESTOR_PLUS_SUBTREE' ? '树结构资源' : '标准资源' }}
              </ElTag>
              <ElSwitch
                :model-value="getPolicy(resource.resourceCode).enabled"
                inline-prompt
                active-text="启用"
                inactive-text="停用"
                @update:model-value="(value) => handleEnabledChange(resource.resourceCode, value)"
              />
            </div>
          </div>

          <div class="mt-5 grid gap-4 md:grid-cols-2">
            <div
              v-for="action in resource.supportedActions"
              :key="`${resource.resourceCode}-${action}`"
              class="rounded-custom-sm border border-[var(--el-border-color-lighter)] bg-[var(--el-fill-color-blank)] px-4 py-4"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="text-sm font-medium text-[var(--art-gray-900)]">
                  {{ actionLabelMap[action] }}
                </div>
                <ElTag size="small" effect="plain"> 部门维度 </ElTag>
              </div>

              <ElSelect
                class="mt-3 w-full"
                :model-value="getScopeValue(getPolicy(resource.resourceCode), action)"
                @update:model-value="
                  (value) => handleScopeChange(resource.resourceCode, action, value)
                "
              >
                <ElOption
                  v-for="option in scopeOptions"
                  :key="option.value"
                  :label="option.label"
                  :value="option.value"
                />
              </ElSelect>

              <div
                v-if="getScopeValue(getPolicy(resource.resourceCode), action) === 'CUSTOM'"
                class="mt-3"
              >
                <ElTreeSelect
                  :model-value="getCustomTargets(getPolicy(resource.resourceCode), action)"
                  :data="departmentOptions"
                  multiple
                  check-strictly
                  filterable
                  show-checkbox
                  clearable
                  collapse-tags
                  collapse-tags-tooltip
                  node-key="id"
                  class="w-full"
                  placeholder="选择授权部门"
                  :props="{ label: 'name', children: 'children' }"
                  @update:model-value="
                    (value: unknown) =>
                      handleCustomTargetsChange(resource.resourceCode, action, value)
                  "
                />
                <div class="mt-2 text-xs text-[var(--art-gray-500)]">
                  当前版本会自动放大到所选部门及其子部门范围。
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ElScrollbar>

    <template #footer>
      <ElButton @click="handleClose">取消</ElButton>
      <ElButton type="primary" :loading="saving" @click="handleSubmit">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import {
    fetchRoleDataPermissionMeta,
    fetchRoleDataPermissions,
    fetchUpdateRoleDataPermissions
  } from '@/api/roles'
  import { ElMessage } from 'element-plus'

  type RoleListItem = Api.Access.RoleListItem
  type RoleDataPermissionPolicy = Api.Access.RoleDataPermissionPolicy
  type RoleDataPermissionAction = Api.Access.DataPermissionAction
  type DataScopeType = Api.Access.DataScopeType
  type ResourceMeta = Api.Access.RoleDataPermissionResourceMeta

  interface Props {
    modelValue: boolean
    roleData?: RoleListItem
  }

  interface Emits {
    (e: 'update:modelValue', value: boolean): void
    (e: 'success'): void
  }

  const props = withDefaults(defineProps<Props>(), {
    modelValue: false,
    roleData: undefined
  })

  const emit = defineEmits<Emits>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const loading = ref(false)
  const saving = ref(false)
  const resources = ref<ResourceMeta[]>([])
  const scopeOptions = ref<Api.Access.RoleDataPermissionMetaResponse['scopeOptions']>([])
  const departmentOptions = ref<Api.Access.DepartmentItem[]>([])
  const policies = ref<RoleDataPermissionPolicy[]>([])

  const actionLabelMap: Record<RoleDataPermissionAction, string> = {
    view: '查看范围',
    create: '新增范围',
    update: '编辑范围',
    delete: '删除范围',
    export: '导出范围',
    approve: '审批范围',
    assign: '分配范围'
  }

  const scopeKeyMap = {
    view: 'visibleScopeType',
    create: 'createScopeType',
    update: 'updateScopeType',
    delete: 'deleteScopeType',
    export: 'exportScopeType',
    approve: 'approveScopeType',
    assign: 'assignScopeType'
  } as const

  const dimensionKeyMap = {
    view: 'visibleDimensionType',
    create: 'createDimensionType',
    update: 'updateDimensionType',
    delete: 'deleteDimensionType',
    export: 'exportDimensionType',
    approve: 'approveDimensionType',
    assign: 'assignDimensionType'
  } as const

  watch(
    () => props.modelValue,
    async (opened) => {
      if (!opened || !props.roleData?.id) return
      await loadData(props.roleData.id)
    }
  )

  /**
   * 加载数据权限元数据和当前角色已有策略。
   * @param roleId 角色 ID。
   */
  const loadData = async (roleId: number) => {
    loading.value = true
    try {
      const [meta, permissionData] = await Promise.all([
        fetchRoleDataPermissionMeta(),
        fetchRoleDataPermissions(roleId)
      ])

      resources.value = meta.resources
      scopeOptions.value = meta.scopeOptions
      departmentOptions.value = meta.departments
      policies.value = permissionData.policies.map((policy) => ({
        ...policy,
        customTargets: {
          view: policy.customTargets?.view ?? [],
          create: policy.customTargets?.create ?? [],
          update: policy.customTargets?.update ?? [],
          delete: policy.customTargets?.delete ?? [],
          export: policy.customTargets?.export ?? [],
          approve: policy.customTargets?.approve ?? [],
          assign: policy.customTargets?.assign ?? []
        }
      }))
    } finally {
      loading.value = false
    }
  }

  /**
   * 根据资源编码获取当前编辑中的权限策略。
   */
  const getPolicy = (resourceCode: string) => {
    const policy = policies.value.find((item) => item.resourceCode === resourceCode)
    if (!policy) {
      throw new Error(`missing role data permission policy: ${resourceCode}`)
    }
    return policy
  }

  /**
   * 读取指定操作对应的数据范围值。
   */
  const getScopeValue = (policy: RoleDataPermissionPolicy, action: RoleDataPermissionAction) => {
    return policy[scopeKeyMap[action]]
  }

  /**
   * 设置指定操作的数据范围，并在非自定义范围下清空自定义目标。
   */
  const setScopeValue = (
    policy: RoleDataPermissionPolicy,
    action: RoleDataPermissionAction,
    value: DataScopeType
  ) => {
    policy[scopeKeyMap[action]] = value
    policy[dimensionKeyMap[action]] = 'DEPT'
    if (value !== 'CUSTOM') {
      setCustomTargets(policy, action, [])
    }
  }

  /**
   * 读取指定操作的自定义部门目标。
   */
  const getCustomTargets = (policy: RoleDataPermissionPolicy, action: RoleDataPermissionAction) => {
    return policy.customTargets?.[action] ?? []
  }

  /**
   * 标准化并写入指定操作的自定义部门目标。
   */
  const setCustomTargets = (
    policy: RoleDataPermissionPolicy,
    action: RoleDataPermissionAction,
    value: unknown
  ) => {
    const normalized = Array.isArray(value)
      ? value.map((item) => Number(item)).filter((item) => Number.isInteger(item) && item > 0)
      : []

    policy.customTargets = {
      ...policy.customTargets,
      [action]: [...new Set(normalized)]
    }
  }

  /**
   * 切换资源数据权限启用状态。
   */
  const handleEnabledChange = (resourceCode: string, value: boolean | string | number) => {
    getPolicy(resourceCode).enabled = !!value
  }

  const handleScopeChange = (
    resourceCode: string,
    action: RoleDataPermissionAction,
    value: DataScopeType
  ) => {
    setScopeValue(getPolicy(resourceCode), action, value)
  }

  const handleCustomTargetsChange = (
    resourceCode: string,
    action: RoleDataPermissionAction,
    value: unknown
  ) => {
    setCustomTargets(getPolicy(resourceCode), action, value)
  }

  /**
   * 关闭弹窗并清理本地权限编辑状态。
   */
  const handleClose = () => {
    visible.value = false
    resources.value = []
    policies.value = []
    departmentOptions.value = []
  }

  /**
   * 组装提交给后端的数据权限策略。
   */
  const buildSubmitPolicies = () => {
    return policies.value.map((policy) => {
      const resource = resources.value.find((item) => item.resourceCode === policy.resourceCode)
      const supportedActions = new Set(resource?.supportedActions ?? [])
      const nextCustomTargets: Partial<Record<RoleDataPermissionAction, number[]>> = {}

      ;(Object.keys(actionLabelMap) as RoleDataPermissionAction[]).forEach((action) => {
        if (!supportedActions.has(action)) return

        const scopeValue = getScopeValue(policy, action)
        if (scopeValue !== 'CUSTOM') return

        const targets = getCustomTargets(policy, action)
        nextCustomTargets[action] = [...new Set(targets)]
      })

      return {
        resourceCode: policy.resourceCode,
        enabled: policy.enabled,
        visibleScopeType: policy.visibleScopeType,
        visibleDimensionType: policy.visibleDimensionType,
        createScopeType: policy.createScopeType,
        createDimensionType: policy.createDimensionType,
        updateScopeType: policy.updateScopeType,
        updateDimensionType: policy.updateDimensionType,
        deleteScopeType: policy.deleteScopeType,
        deleteDimensionType: policy.deleteDimensionType,
        exportScopeType: policy.exportScopeType,
        exportDimensionType: policy.exportDimensionType,
        approveScopeType: policy.approveScopeType,
        approveDimensionType: policy.approveDimensionType,
        assignScopeType: policy.assignScopeType,
        assignDimensionType: policy.assignDimensionType,
        customTargets: nextCustomTargets
      }
    })
  }

  /**
   * 保存当前角色的数据权限配置。
   */
  const handleSubmit = async () => {
    if (!props.roleData?.id) return

    saving.value = true
    try {
      await fetchUpdateRoleDataPermissions(props.roleData.id, buildSubmitPolicies())
      ElMessage.success('保存成功')
      emit('success')
      visible.value = false
    } finally {
      saving.value = false
    }
  }
</script>
