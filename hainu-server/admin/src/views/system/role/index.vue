<!-- 角色管理页面 -->
<template>
  <div class="art-full-height">
    <RoleSearch
      v-show="showSearchBar"
      v-model="searchForm"
      @search="handleSearch"
      @reset="handleReset"
    ></RoleSearch>

    <ElCard class="art-table-card" :style="{ 'margin-top': showSearchBar ? '12px' : '0' }">
      <ArtTableHeader
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        :loading="loading"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" type="primary" plain v-ripple>新增角色</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
      </ArtTable>
    </ElCard>

    <!-- 角色编辑弹窗 -->
    <RoleEditDialog
      v-model="dialogVisible"
      :dialog-type="dialogType"
      :role-data="currentRoleData"
      @success="refreshData"
    />

    <!-- 菜单权限弹窗 -->
    <RolePermissionDialog
      v-model="permissionDialog"
      :role-data="currentRoleData"
      @success="refreshData"
    />

    <RoleDataPermissionDialog
      v-model="dataPermissionDialog"
      :role-data="currentRoleData"
      @success="refreshData"
    />
  </div>
</template>

<script setup lang="ts">
  import { ButtonMoreItem } from '@/components/core/forms/art-button-more/index.vue'
  import { useTable } from '@/hooks/core/useTable'
  import ArtButtonMore from '@/components/core/forms/art-button-more/index.vue'
  import RoleSearch from './modules/role-search.vue'
  import RoleEditDialog from './modules/role-edit-dialog.vue'
  import RolePermissionDialog from './modules/role-permission-dialog.vue'
  import RoleDataPermissionDialog from './modules/role-data-permission-dialog.vue'
  import { ElMessageBox, ElTag, ElMessage } from 'element-plus'
  import { fetchDeleteRole, fetchRolesList } from '@/api/roles'
  import { formatDateTime } from '@/utils'
  import { isHttpError } from '@/utils/http/error'
  import { useQuickActionDialog } from '@/hooks/core/useQuickActionDialog'

  defineOptions({ name: 'Role' })

  type RoleListItem = Api.Access.RoleListItem
  type RoleSearchFormParams = Api.Access.RoleSearchParams & {
    daterange?: string[]
  }

  // 搜索表单
  const searchForm = ref({
    name: undefined,
    code: undefined,
    description: undefined,
    enabled: undefined,
    daterange: undefined
  })

  const showSearchBar = ref(false)

  const dialogVisible = ref(false)
  const permissionDialog = ref(false)
  const dataPermissionDialog = ref(false)
  const currentRoleData = ref<RoleListItem | undefined>(undefined)

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
    // 核心配置
    core: {
      apiFn: fetchRolesList,
      apiParams: {
        current: 1,
        size: 20
      },
      // 排除 apiParams 中的属性
      excludeParams: ['daterange'],
      columnsFactory: () => [
        {
          prop: 'id',
          label: '角色ID',
          width: 100
        },
        {
          prop: 'name',
          label: '角色名称'
        },
        {
          prop: 'code',
          label: '角色编码'
        },
        {
          prop: 'description',
          label: '角色描述',
          showOverflowTooltip: true
        },
        {
          prop: 'enabled',
          label: '角色状态',
          formatter: (row) => {
            const statusConfig = row.enabled
              ? { type: 'success', text: '启用' }
              : { type: 'warning', text: '禁用' }
            return h(
              ElTag,
              { type: statusConfig.type as 'success' | 'warning' },
              () => statusConfig.text
            )
          }
        },
        {
          prop: 'createdAt',
          label: '创建日期',
          sortable: true,
          formatter: (row) => formatDateTime(row.createdAt)
        },
        {
          prop: 'updatedAt',
          label: '编辑日期',
          sortable: true,
          formatter: (row) => formatDateTime(row.updatedAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 96,
          fixed: 'right',
          formatter: (row) =>
            h('div', [
              h(ArtButtonMore, {
                list: [
                  {
                    key: 'dataPermission',
                    label: '数据权限',
                    icon: 'ri:shield-user-line'
                  },
                  {
                    key: 'permission',
                    label: '菜单权限',
                    icon: 'ri:user-3-line'
                  },
                  {
                    key: 'edit',
                    label: '编辑角色',
                    icon: 'ri:edit-2-line'
                  },
                  {
                    key: 'delete',
                    label: '删除角色',
                    icon: 'ri:delete-bin-4-line',
                    color: '#f56c6c'
                  }
                ],
                onClick: (item: ButtonMoreItem) => buttonMoreClick(item, row)
              })
            ])
        }
      ]
    }
  })

  const dialogType = ref<'add' | 'edit'>('add')

  // 打开角色新增或编辑弹窗
  function showDialog(type: 'add' | 'edit', row?: RoleListItem) {
    dialogVisible.value = true
    dialogType.value = type
    currentRoleData.value = row
  }

  /**
   * 搜索处理
   * @param params 搜索参数
   */
  const handleSearch = async (params: RoleSearchFormParams) => {
    // 处理日期区间参数，把 daterange 转换为 startTime 和 endTime
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [null, null]

    await replaceSearchParams({ ...filtersParams, startTime, endTime })
  }

  // 重置筛选条件并重新查询
  const handleReset = () => {
    Object.assign(searchForm.value, {
      name: undefined,
      code: undefined,
      description: undefined,
      enabled: undefined,
      daterange: undefined
    })
    resetSearchParams()
  }

  // 处理更多操作菜单点击
  const buttonMoreClick = (item: ButtonMoreItem, row: RoleListItem) => {
    switch (item.key) {
      case 'dataPermission':
        showDataPermissionDialog(row)
        break
      case 'permission':
        showPermissionDialog(row)
        break
      case 'edit':
        showDialog('edit', row)
        break
      case 'delete':
        deleteRole(row)
        break
    }
  }

  // 打开菜单权限弹窗
  const showPermissionDialog = (row?: RoleListItem) => {
    permissionDialog.value = true
    currentRoleData.value = row
  }

  // 打开数据权限弹窗
  const showDataPermissionDialog = (row?: RoleListItem) => {
    dataPermissionDialog.value = true
    currentRoleData.value = row
  }

  // 删除角色前二次确认
  const deleteRole = (row: RoleListItem) => {
    ElMessageBox.confirm(`确定删除角色"${row.name}"吗？此操作不可恢复！`, '删除确认', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(async () => {
        try {
          await fetchDeleteRole(row.id)
          ElMessage.success('删除成功')
          refreshData()
        } catch (error) {
          console.error('删除角色失败:', error)
          if (!isHttpError(error)) {
            ElMessage.error('删除失败')
          }
        }
      })
      .catch(() => {
        ElMessage.info('已取消删除')
      })
  }

  // 关闭页面内弹窗，供快捷操作切换时统一清理
  const closePageDialogs = () => {
    dialogVisible.value = false
    permissionDialog.value = false
    dataPermissionDialog.value = false
    currentRoleData.value = undefined
  }

  useQuickActionDialog({
    actionKey: 'createRole',
    onTrigger: () => showDialog('add'),
    onCloseDialogs: closePageDialogs
  })
</script>
