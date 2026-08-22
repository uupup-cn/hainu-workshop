<template>
  <ElDialog
    :model-value="visible"
    :title="mode === 'add' ? '新增参数' : '编辑参数'"
    width="min(900px, calc(100vw - 32px))"
    align-center
    destroy-on-close
    top="6vh"
    @update:model-value="emit('update:visible', $event)"
    @closed="emit('closed')"
  >
    <div
      class="grid h-[min(68vh,720px)] min-h-[480px] grid-cols-1 gap-4 px-1 lg:grid-cols-[minmax(0,1fr)_260px] max-[760px]:h-[70vh] max-[760px]:min-h-0"
    >
      <section class="art-surface-sm flex min-h-0 min-w-0 flex-col overflow-hidden">
        <header
          class="flex items-start justify-between gap-4 border-b border-[var(--art-surface-border-muted)] px-5 py-4"
        >
          <div class="min-w-0">
            <div class="text-sm font-[650] text-g-900">参数信息</div>
            <p class="mt-1 mb-0 text-xs leading-relaxed text-g-500">
              配置键名、分组和值内容，保存后可刷新缓存使新值生效。
            </p>
          </div>
          <ElTag :type="form.builtIn ? 'warning' : 'info'" effect="light" round>
            {{ form.builtIn ? '内置参数' : '自定义参数' }}
          </ElTag>
        </header>

        <ElScrollbar class="min-h-0 flex-1">
          <ElForm
            ref="formRef"
            :model="form"
            :rules="rules"
            label-position="top"
            class="px-5 pt-5 pb-2"
          >
            <div class="grid grid-cols-1 gap-x-4 gap-y-1 md:grid-cols-2">
              <div class="col-span-full mb-1 flex items-center gap-2 text-xs font-[650] text-g-500">
                基础信息
              </div>
              <ElFormItem label="参数名称" prop="name">
                <ElInput v-model="form.name" maxlength="120" placeholder="例如：密码最小长度" />
              </ElFormItem>
              <ElFormItem label="参数键名" prop="key">
                <ElInput
                  v-model="form.key"
                  maxlength="120"
                  :disabled="mode === 'edit' && Boolean(form.builtIn)"
                  placeholder="例如：security.password.min_length"
                />
              </ElFormItem>
              <ElFormItem label="分组编码" prop="groupCode">
                <ElInput
                  v-model="form.groupCode"
                  maxlength="60"
                  :disabled="mode === 'edit' && Boolean(form.builtIn)"
                  placeholder="例如：security"
                />
              </ElFormItem>
              <ElFormItem label="分组名称" prop="groupName">
                <ElInput
                  v-model="form.groupName"
                  maxlength="60"
                  :disabled="mode === 'edit' && Boolean(form.builtIn)"
                  placeholder="例如：安全策略"
                />
              </ElFormItem>
              <ElFormItem label="参数类型" prop="valueType">
                <ElSelect
                  v-model="form.valueType"
                  class="w-full"
                  :disabled="mode === 'edit' && Boolean(form.builtIn)"
                >
                  <ElOption
                    v-for="item in valueTypeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  />
                </ElSelect>
              </ElFormItem>
              <ElFormItem label="排序" prop="sort">
                <ElInputNumber v-model="form.sort" :min="1" :max="9999" class="!w-full" />
              </ElFormItem>

              <div
                class="col-span-full mt-2 mb-1 flex items-center gap-2 border-t border-[var(--art-surface-border-muted)] pt-5 text-xs font-[650] text-g-500"
              >
                状态与内容
              </div>
              <ElFormItem label="状态" prop="enabled">
                <ElSwitch v-model="form.enabled" />
              </ElFormItem>
              <ElFormItem label="内置参数" prop="builtIn">
                <ElSwitch v-model="form.builtIn" :disabled="mode === 'edit' && form.builtIn" />
              </ElFormItem>
              <ElFormItem label="默认值" prop="defaultValue" class="md:col-span-2">
                <ElInput
                  v-model="form.defaultValue"
                  maxlength="2000"
                  placeholder="可选，用于记录兜底值或回滚基线"
                />
              </ElFormItem>
              <ElFormItem label="参数值" prop="value" class="md:col-span-2">
                <ElSelect
                  v-if="form.valueType === 'BOOLEAN'"
                  v-model="form.value"
                  class="w-full"
                  placeholder="请选择布尔值"
                >
                  <ElOption label="true / 开启" value="true" />
                  <ElOption label="false / 关闭" value="false" />
                </ElSelect>
                <ElInput
                  v-else-if="form.valueType === 'TEXT' || form.valueType === 'JSON'"
                  v-model="form.value"
                  type="textarea"
                  :rows="6"
                  maxlength="5000"
                  show-word-limit
                  :placeholder="valueInputPlaceholder"
                />
                <ElInput
                  v-else
                  v-model="form.value"
                  maxlength="2000"
                  :placeholder="valueInputPlaceholder"
                />
              </ElFormItem>
              <ElFormItem label="扩展配置" prop="optionsText" class="md:col-span-2">
                <ElInput
                  v-model="form.optionsText"
                  type="textarea"
                  :rows="5"
                  maxlength="5000"
                  show-word-limit
                  placeholder="可选，支持 JSON 对象，如下拉选项、说明元数据等"
                />
              </ElFormItem>
              <ElFormItem label="备注" prop="remark" class="md:col-span-2">
                <ElInput
                  v-model="form.remark"
                  type="textarea"
                  :rows="3"
                  maxlength="255"
                  show-word-limit
                  placeholder="请输入参数用途、影响范围或维护说明"
                />
              </ElFormItem>
            </div>
          </ElForm>
        </ElScrollbar>
      </section>

      <aside class="min-h-0 min-w-0">
        <ElScrollbar class="h-full">
          <div class="flex flex-col gap-3 pr-2">
            <section class="art-surface-sm overflow-hidden">
              <div
                class="border-b border-[var(--art-surface-border-muted)] bg-[var(--art-surface-bg-muted)] px-4 py-3"
              >
                <div class="text-sm font-[650] text-g-900">配置预览</div>
              </div>
              <dl class="space-y-3 px-4 py-4 text-sm">
                <div>
                  <dt class="text-xs text-g-500">键名</dt>
                  <dd class="mt-1 min-w-0 break-all text-g-800">{{ form.key || '-' }}</dd>
                </div>
                <div>
                  <dt class="text-xs text-g-500">分组</dt>
                  <dd class="mt-1 min-w-0 break-all text-g-800">{{ form.groupName || '-' }}</dd>
                </div>
                <div class="grid grid-cols-2 gap-3">
                  <div>
                    <dt class="text-xs text-g-500">类型</dt>
                    <dd class="mt-1 text-g-800">{{ resolveValueTypeLabel(form.valueType) }}</dd>
                  </div>
                  <div>
                    <dt class="text-xs text-g-500">状态</dt>
                    <dd class="mt-1 text-g-800">{{ form.enabled ? '启用' : '禁用' }}</dd>
                  </div>
                </div>
                <div>
                  <dt class="text-xs text-g-500">值预览</dt>
                  <dd
                    class="mt-2 max-h-28 overflow-auto rounded-[calc(var(--custom-radius)-4px)] border border-[var(--art-surface-border-muted)] bg-[var(--default-bg-color)] px-3 py-2 text-xs leading-5 break-all text-g-700"
                  >
                    {{ previewValue }}
                  </dd>
                </div>
              </dl>
            </section>

            <section class="art-surface-sm p-4">
              <div class="text-sm font-[650] text-g-900">维护建议</div>
              <ul class="mt-3 list-disc space-y-2 pl-4 text-xs leading-6 text-g-600">
                <li>键名建议采用“业务域.模块.字段”的层级命名。</li>
                <li>内置参数用于平台底层策略，建议限制删除和变更范围。</li>
                <li>JSON 类型可承载复杂配置，但需要保持结构稳定。</li>
                <li>修改完成后建议执行一次缓存刷新，确保新值及时生效。</li>
              </ul>
            </section>
          </div>
        </ElScrollbar>
      </aside>
    </div>

    <template #footer>
      <div
        class="flex items-center justify-end gap-3 border-t border-[var(--art-surface-border-muted)] pt-4"
      >
        <ElButton @click="emit('update:visible', false)">取消</ElButton>
        <ElButton type="primary" :loading="submitLoading" @click="emit('submit')">保存</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { createSystemParamForm, resolveValueTypeLabel, valueTypeOptions } from '../shared'

  defineProps<{
    mode: 'add' | 'edit'
    rules: FormRules
    previewValue: string
    valueInputPlaceholder: string
    submitLoading: boolean
  }>()

  const visible = defineModel<boolean>('visible', { required: true })
  const form = defineModel<ReturnType<typeof createSystemParamForm>>('form', { required: true })

  const emit = defineEmits<{
    'update:visible': [value: boolean]
    closed: []
    submit: []
  }>()

  const formRef = ref<FormInstance>()

  defineExpose({
    validate: () => formRef.value?.validate(),
    clearValidate: () => formRef.value?.clearValidate()
  })
</script>
