<template>
  <div>
    <ElCard shadow="never">
      <div class="cb-toolbar mb-4">
        <ElSelect
          v-model="filterCampusId"
          placeholder="请选择校区"
          style="width: 220px"
          @change="loadTree"
        >
          <ElOption
            v-for="item in campuses"
            :key="item.id"
            :label="item.campusName"
            :value="item.id"
          />
        </ElSelect>
        <ElButton type="primary" plain @click="openCollegeDialog()">新增书院</ElButton>
        <ElButton type="primary" plain @click="openBuildingDialog()">新增楼栋</ElButton>
      </div>

      <ElTree
        v-loading="loading"
        :key="treeVersion"
        :data="treeData"
        node-key="id"
        default-expand-all
        :expand-on-click-node="false"
      >
        <template #default="{ data }">
          <div class="cb-tree-node">
            <span class="cb-tree-label">{{ data.icon }} {{ data.label }}</span>
            <span class="cb-tree-actions">
              <ElButton size="small" @click.stop="openEdit(data)">编辑</ElButton>
              <ElButton size="small" type="danger" @click.stop="handleDeleteNode(data)">
                删除
              </ElButton>
            </span>
          </div>
        </template>
      </ElTree>
    </ElCard>

    <!-- 新增 / 编辑书院 -->
    <ElDialog
      v-model="collegeDialogVisible"
      :title="collegeDialogMode === 'add' ? '新增书院' : '编辑书院'"
      width="800px"
      destroy-on-close
    >
      <ElForm ref="collegeFormRef" :model="collegeForm" :rules="collegeRules" label-width="80px">
        <ElFormItem label="书院名称" prop="collegeName">
          <ElInput v-model.trim="collegeForm.collegeName" maxlength="50" placeholder="请输入书院名称" />
        </ElFormItem>
        <ElFormItem label="所在校区" prop="campusId">
          <ElSelect
            v-model="collegeForm.campusId"
            placeholder="请选择校区"
            style="width: 100%"
          >
            <ElOption
              v-for="item in campuses"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="排序" prop="sortOrder">
          <ElInputNumber v-model="collegeForm.sortOrder" :min="0" />
        </ElFormItem>
        <ElFormItem label="书院介绍" prop="description">
          <ArtWangEditor
            v-model="collegeForm.description"
            height="400px"
            :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="collegeDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="collegeSubmitting" @click="handleCollegeSave">
          保存
        </ElButton>
      </template>
    </ElDialog>

    <!-- 新增 / 编辑楼栋 -->
    <ElDialog
      v-model="buildingDialogVisible"
      :title="buildingDialogMode === 'add' ? '新增楼栋' : '编辑楼栋'"
      width="800px"
      destroy-on-close
    >
      <ElForm ref="buildingFormRef" :model="buildingForm" :rules="buildingRules" label-width="80px">
        <ElFormItem label="楼栋号" prop="buildingName">
          <ElInput v-model.trim="buildingForm.buildingName" maxlength="50" placeholder="请输入楼栋号" />
        </ElFormItem>
        <ElFormItem label="所在校区" prop="campusId">
          <ElSelect
            v-model="buildingFormCampusId"
            placeholder="请选择校区"
            style="width: 100%"
            @change="handleBuildingCampusChange"
          >
            <ElOption
              v-for="item in campuses"
              :key="item.id"
              :label="item.campusName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="所属书院" prop="collegeId">
          <ElSelect
            v-model="buildingForm.collegeId"
            placeholder="请选择书院"
            style="width: 100%"
            filterable
          >
            <ElOption
              v-for="item in collegeOptions"
              :key="item.id"
              :label="item.collegeName"
              :value="item.id"
            />
          </ElSelect>
        </ElFormItem>
        <ElFormItem label="排序" prop="sortOrder">
          <ElInputNumber v-model="buildingForm.sortOrder" :min="0" />
        </ElFormItem>
        <ElFormItem label="楼栋介绍" prop="description">
          <ArtWangEditor
            v-model="buildingForm.description"
            height="400px"
            :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']"
          />
        </ElFormItem>
      </ElForm>
      <template #footer>
        <ElButton @click="buildingDialogVisible = false">取消</ElButton>
        <ElButton type="primary" :loading="buildingSubmitting" @click="handleBuildingSave">
          保存
        </ElButton>
      </template>
    </ElDialog>
  </div>
</template>

<script setup lang="ts">
  import { ElMessage, ElMessageBox, type FormInstance, type FormRules } from 'element-plus'
  import * as api from '@/api/campus-data'

  defineOptions({ name: 'CampusCollegeBuilding' })

  const ArtWangEditor = defineAsyncComponent(
    () => import('@/components/core/forms/art-wang-editor/index.vue')
  )

  interface CampusItem {
    id: number
    campusName: string
  }
  interface CollegeItem {
    id: number
    collegeName: string
  }
  interface TreeNode {
    id: string
    label: string
    type: 'college' | 'building'
    icon: string
    campusId?: number
    collegeId?: number
    raw: any
    children?: TreeNode[]
  }

  const loading = ref(false)
  const campuses = ref<CampusItem[]>([])
  const filterCampusId = ref<number | undefined>(undefined)
  const treeData = ref<TreeNode[]>([])
  const treeVersion = ref(0)
  const collegeOptions = ref<CollegeItem[]>([])

  // 书院弹窗
  const collegeDialogVisible = ref(false)
  const collegeDialogMode = ref<'add' | 'edit'>('add')
  const collegeEditId = ref<number | null>(null)
  const collegeFormRef = ref<FormInstance>()
  const collegeSubmitting = ref(false)

  const createCollegeForm = () => ({
    collegeName: '',
    campusId: undefined as number | undefined,
    sortOrder: 0,
    description: ''
  })
  const collegeForm = reactive(createCollegeForm())
  const collegeRules = reactive<FormRules>({
    collegeName: [{ required: true, message: '请输入书院名称', trigger: 'blur' }],
    campusId: [{ required: true, message: '请选择所在校区', trigger: 'change' }]
  })

  // 楼栋弹窗
  const buildingDialogVisible = ref(false)
  const buildingDialogMode = ref<'add' | 'edit'>('add')
  const buildingEditId = ref<number | null>(null)
  const buildingFormRef = ref<FormInstance>()
  const buildingSubmitting = ref(false)
  const buildingFormCampusId = ref<number | undefined>(undefined)

  const createBuildingForm = () => ({
    buildingName: '',
    collegeId: undefined as number | undefined,
    sortOrder: 0,
    description: ''
  })
  const buildingForm = reactive(createBuildingForm())
  const buildingRules = reactive<FormRules>({
    buildingName: [{ required: true, message: '请输入楼栋号', trigger: 'blur' }],
    collegeId: [{ required: true, message: '请选择所属书院', trigger: 'change' }]
  })

  function buildTree(colleges: any[]): TreeNode[] {
    return (colleges || []).map((c: any) => ({
      id: `c-${c.id}`,
      label: c.collegeName,
      type: 'college',
      icon: '🏠',
      campusId: c.campusId,
      raw: c,
      children: (c.buildings || []).map((b: any) => ({
        id: `b-${b.id}`,
        label: b.buildingName,
        type: 'building',
        icon: '🏢',
        campusId: c.campusId,
        collegeId: b.collegeId,
        raw: b
      }))
    }))
  }

  async function loadCampuses() {
    campuses.value = ((await api.fetchCampuses()) as CampusItem[]) || []
    if (campuses.value.length && !filterCampusId.value) {
      filterCampusId.value = campuses.value[0].id
    }
  }

  async function loadTree() {
    if (!filterCampusId.value) {
      treeData.value = []
      return
    }
    loading.value = true
    try {
      const colleges = (await api.fetchCollegeTree(filterCampusId.value)) as any[]
      treeData.value = buildTree(colleges || [])
      treeVersion.value++
    } finally {
      loading.value = false
    }
  }

  async function loadCollegeOptions(campusId?: number) {
    if (!campusId) {
      collegeOptions.value = []
      return
    }
    collegeOptions.value = ((await api.fetchColleges(campusId)) as CollegeItem[]) || []
  }

  function openCollegeDialog(node?: TreeNode) {
    collegeDialogMode.value = node ? 'edit' : 'add'
    collegeEditId.value = node ? node.raw.id : null
    Object.assign(collegeForm, createCollegeForm())
    if (node) {
      collegeForm.collegeName = node.raw.collegeName
      collegeForm.campusId = node.raw.campusId
      collegeForm.sortOrder = node.raw.sortOrder
      collegeForm.description = node.raw.description || ''
    } else {
      collegeForm.campusId = filterCampusId.value
    }
    collegeDialogVisible.value = true
  }

  async function openBuildingDialog(node?: TreeNode) {
    buildingDialogMode.value = node ? 'edit' : 'add'
    buildingEditId.value = node ? node.raw.id : null
    buildingFormCampusId.value = node ? node.campusId : filterCampusId.value
    Object.assign(buildingForm, createBuildingForm())
    await loadCollegeOptions(buildingFormCampusId.value)
    if (node) {
      buildingForm.buildingName = node.raw.buildingName
      buildingForm.collegeId = node.raw.collegeId
      buildingForm.sortOrder = node.raw.sortOrder
      buildingForm.description = node.raw.description || ''
    }
    buildingDialogVisible.value = true
  }

  function openEdit(data: TreeNode) {
    if (data.type === 'college') {
      openCollegeDialog(data)
    } else {
      openBuildingDialog(data)
    }
  }

  async function handleBuildingCampusChange() {
    buildingForm.collegeId = undefined
    await loadCollegeOptions(buildingFormCampusId.value)
  }

  async function handleCollegeSave() {
    const valid = await collegeFormRef.value?.validate().catch(() => false)
    if (!valid) return
    collegeSubmitting.value = true
    try {
      if (collegeEditId.value) {
        await api.fetchUpdateCollege(collegeEditId.value, { ...collegeForm })
      } else {
        await api.fetchCreateCollege({ ...collegeForm })
      }
      collegeDialogVisible.value = false
      loadTree()
    } finally {
      collegeSubmitting.value = false
    }
  }

  async function handleBuildingSave() {
    const valid = await buildingFormRef.value?.validate().catch(() => false)
    if (!valid) return
    buildingSubmitting.value = true
    try {
      if (buildingEditId.value) {
        await api.fetchUpdateBuilding(buildingEditId.value, { ...buildingForm })
      } else {
        await api.fetchCreateBuilding({ ...buildingForm })
      }
      buildingDialogVisible.value = false
      loadTree()
    } finally {
      buildingSubmitting.value = false
    }
  }

  async function handleDeleteNode(data: TreeNode) {
    if (data.type === 'college') {
      await ElMessageBox.confirm(`确认删除书院"${data.label}"？`, '提示', { type: 'warning' })
      await api.fetchDeleteCollege(data.raw.id)
    } else {
      await ElMessageBox.confirm(`确认删除楼栋"${data.label}"？`, '提示', { type: 'warning' })
      await api.fetchDeleteBuilding(data.raw.id)
    }
    ElMessage.success('删除成功')
    loadTree()
  }

  onMounted(async () => {
    await loadCampuses()
    await loadTree()
  })
</script>

<style scoped>
  .cb-toolbar {
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cb-tree-node {
    display: flex;
    align-items: center;
    width: 100%;
    padding-right: 8px;
  }
  .cb-tree-label {
    flex: 1;
    font-size: 14px;
  }
  .cb-tree-actions {
    flex-shrink: 0;
    display: flex;
    gap: 8px;
  }
  :deep(.el-tree-node__label) {
    flex: 1;
    display: flex;
  }
</style>
