<template>
  <ElDialog
    :model-value="visible"
    :title="mode === 'add' ? '新增通知' : '编辑通知'"
    width="min(980px, calc(100vw - 32px))"
    :top="isMobileLayout ? '2vh' : '4vh'"
    class="notification-dialog"
    destroy-on-close
    @update:model-value="emit('update:visible', $event)"
    @close="emit('close')"
  >
    <ElForm
      ref="formRef"
      :model="form"
      :rules="rules"
      :label-width="isMobileLayout ? 'auto' : '96px'"
      :label-position="isMobileLayout ? 'top' : 'right'"
    >
      <ElRow :gutter="16">
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="通知标题" prop="title">
            <ElInput v-model.trim="form.title" maxlength="150" placeholder="请输入通知标题" />
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="通知类型" prop="type">
            <ElSelect v-model="form.type" class="w-full" placeholder="请选择通知类型">
              <ElOption
                v-for="item in notificationTypeOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem label="通知摘要">
        <ElInput
          v-model.trim="form.summary"
          type="textarea"
          :rows="3"
          maxlength="255"
          show-word-limit
          placeholder="可选，用于通知弹窗的简短描述"
        />
      </ElFormItem>

      <ElRow :gutter="16">
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="推送范围" prop="targetType">
            <ElRadioGroup
              v-model="form.targetType"
              class="notification-radio-group"
              :disabled="scopeLocked"
              @change="emit('target-type-change')"
            >
              <ElRadioButton
                v-for="item in notificationTargetTypeOptions"
                :key="item.value"
                :label="item.value"
              >
                {{ item.label }}
              </ElRadioButton>
            </ElRadioGroup>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="过期时间">
            <ElDatePicker
              v-model="form.expiresAt"
              class="w-full"
              type="datetime"
              value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]"
              placeholder="为空表示永不过期"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>

      <ElFormItem
        v-if="form.targetType === 'DEPARTMENT'"
        label="目标部门"
        prop="targetDepartmentIds"
      >
        <ElTreeSelect
          v-model="form.targetDepartmentIds"
          class="w-full"
          :data="departmentOptions"
          node-key="id"
          multiple
          collapse-tags
          filterable
          check-strictly
          default-expand-all
          :disabled="scopeLocked"
          :props="{ label: 'name', children: 'children' }"
          placeholder="请选择推送部门"
        />
      </ElFormItem>

      <ElFormItem v-if="form.targetType === 'ROLE'" label="目标角色" prop="targetRoleIds">
        <ElSelect
          v-model="form.targetRoleIds"
          class="w-full"
          multiple
          collapse-tags
          filterable
          :disabled="scopeLocked"
          placeholder="请选择推送角色"
        >
          <ElOption
            v-for="item in roleOptions"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem v-if="form.targetType === 'USER'" label="目标用户" prop="targetUserIds">
        <ElSelect
          v-model="form.targetUserIds"
          class="w-full"
          multiple
          collapse-tags
          filterable
          remote
          reserve-keyword
          :remote-method="emitLoadUsers"
          :loading="userLoading"
          :disabled="scopeLocked"
          placeholder="请输入用户名搜索并选择"
        >
          <ElOption
            v-for="item in userOptions"
            :key="item.id"
            :label="`${item.username} (#${item.id})`"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>

      <ElFormItem label="内容" prop="content">
        <ArtWangEditor v-model="form.content" height="300px" />
      </ElFormItem>

      <ElFormItem v-if="!scopeLocked" label="发布状态" prop="status">
        <ElRadioGroup v-model="form.status" class="notification-radio-group">
          <ElRadioButton label="PUBLISHED">立即发布</ElRadioButton>
          <ElRadioButton label="DRAFT">保存草稿</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>

      <ElAlert
        v-else
        type="info"
        show-icon
        :closable="false"
        title="已发布通知仅允许调整标题、摘要、类型、正文与过期时间，发送范围请通过撤回后重建处理。"
      />
    </ElForm>

    <template #footer>
      <div class="notification-dialog__footer">
        <ElButton @click="emit('update:visible', false)">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="emit('submit')">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { useWindowSize } from '@vueuse/core'
  import type { FormInstance, FormRules } from 'element-plus'
  import { notificationTargetTypeOptions, notificationTypeOptions } from '../shared'

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  defineProps<{
    mode: 'add' | 'edit'
    rules: FormRules
    roleOptions: Api.Access.RoleListItem[]
    departmentOptions: Api.Access.DepartmentItem[]
    userOptions: Api.Identity.UserListItem[]
    userLoading: boolean
    scopeLocked: boolean
    submitting: boolean
  }>()

  const visible = defineModel<boolean>('visible', { required: true })
  const form = defineModel<Api.Interaction.NotificationPayload>('form', { required: true })

  const emit = defineEmits<{
    'update:visible': [value: boolean]
    close: []
    submit: []
    'target-type-change': []
    'load-users': [keyword: string]
  }>()

  const formRef = ref<FormInstance>()
  const { width } = useWindowSize()
  /**
   * 判断当前是否为移动端布局，用于切换表单标签位置。
   */
  const isMobileLayout = computed(() => width.value < 768)

  /**
   * 向父组件请求按关键字加载用户选项。
   */
  const emitLoadUsers = (keyword: string) => emit('load-users', keyword)

  defineExpose({
    validate: () => formRef.value?.validate(),
    clearValidate: () => formRef.value?.clearValidate()
  })
</script>

<style scoped>
  .notification-radio-group {
    flex-wrap: wrap;
    row-gap: 8px;
  }
</style>
