<template>
  <ElDialog v-model="visible" title="处置审计事件" width="560px">
    <ElForm label-position="top">
      <ElFormItem label="处置状态">
        <ElRadioGroup v-model="statusForm.status">
          <ElRadioButton value="ACKNOWLEDGED">已确认</ElRadioButton>
          <ElRadioButton value="RESOLVED">已处理</ElRadioButton>
          <ElRadioButton value="IGNORED">忽略</ElRadioButton>
          <ElRadioButton value="OPEN">重新打开</ElRadioButton>
        </ElRadioGroup>
      </ElFormItem>
      <ElFormItem label="处置备注">
        <ElInput
          v-model="statusForm.remark"
          type="textarea"
          :rows="4"
          maxlength="500"
          show-word-limit
          placeholder="请输入处置说明，便于后续审计追踪"
        />
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="emit('submit')">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  const statusForm = defineModel<Api.Audit.UpdateSecurityAuditStatusPayload>('statusForm', {
    required: true
  })
  const visible = defineModel<boolean>('visible', { required: true })

  defineProps<{
    submitting: boolean
  }>()

  const emit = defineEmits<{
    (e: 'submit'): void
  }>()
</script>
