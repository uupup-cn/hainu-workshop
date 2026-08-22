<template>
  <ElDialog v-model="visible" width="420px" align-center :title="dialogTitle">
    <ElForm label-position="top">
      <ElFormItem v-if="mode !== 'move'" label="目录名称">
        <ElInput
          v-model.trim="form.name"
          maxlength="120"
          placeholder="例如：品牌主视觉 / 产品截图"
        />
      </ElFormItem>
      <ElFormItem v-if="mode !== 'edit'" label="父级目录">
        <ElSelect v-model="form.parentId" clearable class="w-full" placeholder="根目录">
          <ElOption
            v-for="item in flatFolderOptions"
            :key="item.id"
            :label="item.label"
            :value="item.id"
          />
        </ElSelect>
      </ElFormItem>
      <ElFormItem v-if="mode !== 'move'" label="默认可见性">
        <ElSelect v-model="form.visibility" class="w-full">
          <ElOption label="私有" value="PRIVATE" />
          <ElOption label="公开" value="PUBLIC" />
        </ElSelect>
      </ElFormItem>
    </ElForm>

    <template #footer>
      <ElButton @click="visible = false">取消</ElButton>
      <ElButton type="primary" :loading="submitting" @click="handleConfirm">确认</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { ElMessage } from 'element-plus'

  type FolderDialogMode = 'create' | 'edit' | 'move'

  const props = withDefaults(
    defineProps<{
      modelValue: boolean
      mode?: FolderDialogMode
      folderTree?: Api.Files.FileFolderNode[]
      initialName?: string
      initialParentId?: number
      initialVisibility?: Api.Files.Visibility
      submitting?: boolean
    }>(),
    {
      mode: 'create',
      folderTree: () => [],
      initialName: '',
      initialParentId: undefined,
      initialVisibility: 'PRIVATE',
      submitting: false
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: boolean): void
    (
      e: 'confirm',
      payload: {
        name: string
        parentId?: number
        visibility: Api.Files.Visibility
      }
    ): void
  }>()

  const visible = computed({
    get: () => props.modelValue,
    set: (value) => emit('update:modelValue', value)
  })

  const form = reactive({
    name: '',
    parentId: undefined as number | undefined,
    visibility: 'PRIVATE' as Api.Files.Visibility
  })

  const dialogTitle = computed(() => {
    if (props.mode === 'edit') return '编辑目录'
    if (props.mode === 'move') return '移动文件'
    return '新建目录'
  })

  const flatFolderOptions = computed(() => flattenFolderOptions(props.folderTree))

  watch(
    () => props.modelValue,
    (value) => {
      if (value) {
        form.name = props.initialName || ''
        form.parentId = props.initialParentId
        form.visibility = props.initialVisibility
      }
    }
  )

  function handleConfirm() {
    if (props.mode !== 'move' && !form.name.trim()) {
      ElMessage.warning('请输入目录名称')
      return
    }

    emit('confirm', {
      name: form.name.trim(),
      parentId: form.parentId,
      visibility: form.visibility
    })
  }

  function flattenFolderOptions(nodes: Api.Files.FileFolderNode[], depth = 0) {
    const result: Array<{ id: number; label: string }> = []

    nodes.forEach((item) => {
      result.push({
        id: item.id,
        label: `${'　'.repeat(depth)}${item.name}`
      })
      if (item.children?.length) {
        result.push(...flattenFolderOptions(item.children, depth + 1))
      }
    })

    return result
  }
</script>
