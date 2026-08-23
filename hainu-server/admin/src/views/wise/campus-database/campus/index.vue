<template>
  <div>
    <ElCard shadow="never">
      <div class="mb-4"><ElButton type="primary" plain @click="openDialog()">新增校区</ElButton></div>
      <ArtTable :loading="loading" :data="tableData" :columns="columns">
        <template #operation="{ row }">
          <ElButton size="small" @click="openDialog(row)">编辑</ElButton>
          <ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton>
        </template>
      </ArtTable>
    </ElCard>
    <ElDialog
      v-model="dialogVisible"
      :title="dialogMode === 'add' ? '新增校区' : '编辑校区'"
      width="800px"
      destroy-on-close
    >
      <ElForm ref="formRef" :model="form" :rules="rules" label-width="80px">
        <ElFormItem label="校区名称" prop="campusName">
          <ElInput v-model.trim="form.campusName" maxlength="50" placeholder="请输入校区名称" />
        </ElFormItem>
        <ElFormItem label="地理位置" prop="location">
          <ElInput v-model.trim="form.location" maxlength="100" placeholder="请输入地理位置" />
        </ElFormItem>
        <ElFormItem label="排序" prop="sortOrder">
          <ElInputNumber v-model="form.sortOrder" :min="0" />
        </ElFormItem>
        <ElFormItem label="校区介绍" prop="description">
          <ArtWangEditor
            v-model="form.description"
            height="400px"
            :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="submitting" @click="handleSave">保存</ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import type { ColumnOption } from '@/types/component'
  import * as api from '@/api/campus-data'

  defineOptions({ name: 'CampusDB' })

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  interface Campus {
    id?: number
    campusName: string
    location: string
    description: string
    sortOrder: number
    isActive: boolean
  }

  const loading = ref(false)
  const submitting = ref(false)
  const tableData = ref<Campus[]>([])

  const columns = ref<ColumnOption[]>([
    { prop: 'campusName', label: '校区名称', width: 150 },
    { prop: 'location', label: '地理位置', width: 200 },
    { prop: 'sortOrder', label: '排序', width: 80 },
    {
      prop: 'operation',
      label: '操作',
      width: 150,
      fixed: 'right' as const,
      useSlot: true,
      slotName: 'operation'
    }
  ])

  const dialogVisible = ref(false)
  const dialogMode = ref<'add' | 'edit'>('add')
  const editId = ref<number | null>(null)
  const formRef = ref<FormInstance>()

  const createForm = (): Campus => ({
    campusName: '',
    location: '',
    description: '',
    sortOrder: 0,
    isActive: true
  })
  const form = reactive<Campus>(createForm())

  const rules = reactive<FormRules>({
    campusName: [{ required: true, message: '请输入校区名称', trigger: 'blur' }]
  })

  async function loadData() {
    loading.value = true
    try {
      tableData.value = ((await api.fetchCampuses()) as Campus[]) || []
    } finally {
      loading.value = false
    }
  }

  function openDialog(row?: Campus) {
    dialogMode.value = row ? 'edit' : 'add'
    editId.value = row?.id || null
    Object.assign(form, row ? { ...row } : createForm())
    dialogVisible.value = true
  }

  async function handleSave() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return
    submitting.value = true
    try {
      if (editId.value) {
        await api.fetchUpdateCampus(editId.value, { ...form })
      } else {
        await api.fetchCreateCampus({ ...form })
      }
      dialogVisible.value = false
      loadData()
    } finally {
      submitting.value = false
    }
  }

  async function handleDelete(row: Campus) {
    if (!row.id) return
    await ElMessageBox.confirm(`确认删除校区"${row.campusName}"？`, '提示', { type: 'warning' })
    await api.fetchDeleteCampus(row.id)
    ElMessage.success('删除成功')
    loadData()
  }

  onMounted(loadData)
</script>
