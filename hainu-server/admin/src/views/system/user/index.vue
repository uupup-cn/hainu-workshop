<!-- 用户管理页面 -->
<!-- art-full-height 自动计算出页面剩余高度 -->
<!-- art-table-card 一个符合系统样式的 class，同时自动撑满剩余高度 -->
<!-- 更多 useTable 使用示例请移步至 功能示例 下面的高级表格示例或者查看官方文档 -->
<!-- useTable 文档：https://www.artd.pro/docs/zh/guide/hooks/use-table.html -->
<template>
  <div class="user-page art-full-height">
    <!-- 搜索栏 -->
    <UserSearch
      v-model="searchForm"
      :role-list="roleList"
      :department-list="departmentList"
      :post-list="postList"
      @search="handleSearch"
      @reset="handleReset"
    ></UserSearch>

    <ElCard class="art-table-card">
      <!-- 表格头部 -->
      <ArtTableHeader
        v-model:columns="columnChecks"
        :loading="loading"
        :data="data"
        :selected-data="selectedRows"
        @refresh="refreshData"
      >
        <template #left>
          <ElSpace wrap>
            <ElButton @click="showDialog('add')" type="primary" plain>新增用户</ElButton>
          </ElSpace>
        </template>
      </ArtTableHeader>

      <!-- 表格 -->
      <ArtTable
        :loading="loading"
        :data="data"
        :columns="columns"
        :pagination="pagination"
        @selection-change="handleSelectionChange"
        @pagination:size-change="handleSizeChange"
        @pagination:current-change="handleCurrentChange"
      >
        <template #userInfo-header="{ column }">
          <ArtColumnSearch
            v-model="usernameHeaderSearch"
            :label="column.label || '用户名'"
            placeholder="搜索用户名"
            history-key="system-user-username"
            :loading="loading"
            @search="handleUsernameHeaderSearch"
            @reset="handleUsernameHeaderReset"
          />
        </template>

        <template #phone-header="{ column }">
          <ArtColumnSearch
            v-model="phoneHeaderSearch"
            :label="column.label || '手机号'"
            placeholder="搜索手机号"
            history-key="system-user-phone"
            maxlength="11"
            :loading="loading"
            @search="handlePhoneHeaderSearch"
            @reset="handlePhoneHeaderReset"
          />
        </template>

        <template #roles-header="{ column }">
          <ArtColumnSearch
            v-model="roleHeaderSearch"
            type="select"
            :label="column.label || '关联角色'"
            placeholder="请选择角色"
            :options="roleHeaderOptions"
            :loading="loading"
            @search="handleRoleHeaderSearch"
            @reset="handleRoleHeaderReset"
          />
        </template>
      </ArtTable>

      <!-- 用户弹窗 -->
      <UserDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :user-data="currentUserData"
        :role-list="roleList"
        :department-list="departmentList"
        :post-list="postList"
        @submit="handleDialogSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import ArtColumnSearch from '@/components/core/tables/art-column-search/index.vue'
  import type { ColumnSearchSubmitPayload } from '@/components/core/tables/art-column-search/types'
  import { useTable } from '@/hooks/core/useTable'
  import { fetchDepartments } from '@/api/departments'
  import { fetchPosts } from '@/api/posts'
  import { fetchGetUserList } from '@/api/user'
  import UserSearch from './modules/user-search.vue'
  import UserDialog from './modules/user-dialog.vue'
  import { ElMessageBox, ElMessage } from 'element-plus'
  import { isHttpError } from '@/utils/http/error'
  import { DialogType } from '@/types'
  import { fetchDeleteUser } from '@/api/user'
  import { fetchRolesList } from '@/api/roles'
  import { formatDateTime } from '@/utils'
  import { useQuickActionDialog } from '@/hooks/core/useQuickActionDialog'

  defineOptions({ name: 'User' })

  type UserListItem = Api.Identity.UserListItem
  type UserSearchFormParams = Api.Identity.UserSearchParams & {
    daterange?: string[]
  }
  type RoleListItem = Api.Access.RoleListItem
  type DepartmentItem = Api.Access.DepartmentItem
  type PostItem = Api.Access.PostItem

  // 角色列表数据
  const roleList = ref<RoleListItem[]>([])
  const departmentList = ref<DepartmentItem[]>([])
  const postList = ref<PostItem[]>([])

  // 弹窗相关
  const dialogType = ref<DialogType>('add')
  const dialogVisible = ref(false)
  const currentUserData = ref<Partial<UserListItem>>({})

  // 选中行
  const selectedRows = ref<UserListItem[]>([])

  // 搜索表单
  const searchForm = ref<UserSearchFormParams>({
    username: undefined,
    realName: undefined,
    phone: undefined,
    gender: undefined,
    role: undefined,
    departmentId: undefined,
    postId: undefined,
    daterange: undefined
  })

  const phoneHeaderSearch = computed({
    get: () => searchForm.value.phone || '',
    set: (value: string) => {
      searchForm.value.phone = value || undefined
    }
  })
  const usernameHeaderSearch = computed({
    get: () => searchForm.value.username || '',
    set: (value: string) => {
      searchForm.value.username = value || undefined
    }
  })
  const roleHeaderSearch = computed({
    get: () => searchForm.value.role || '',
    set: (value: string | number) => {
      const roleId = Number(value)
      searchForm.value.role = Number.isFinite(roleId) && roleId > 0 ? roleId : undefined
    }
  })
  const roleHeaderOptions = computed(() =>
    roleList.value.map((item) => ({
      label: item.name,
      value: item.id
    }))
  )

  onMounted(() => {
    void Promise.allSettled([fetchRoles(), fetchDepartmentOptions(), fetchPostOptions()])
  })

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
    refreshData,
    refreshRemove,
    refreshCreate,
    refreshUpdate
  } = useTable({
    // 核心配置
    core: {
      apiFn: fetchGetUserList,
      apiParams: {
        current: 1,
        size: 20,
        ...searchForm.value
      },
      // 自定义分页字段映射，未设置时将使用全局配置 tableConfig.ts 中的 paginationKey
      // paginationKey: {
      //   current: 'pageNum',
      //   size: 'pageSize'
      // },
      columnsFactory: () => [
        { type: 'selection' }, // 勾选列
        { type: 'index', width: 60, label: '序号' }, // 序号
        {
          prop: 'userInfo',
          label: '用户名',
          useHeaderSlot: true,
          formatter: (row) => row.username
        },
        {
          prop: 'realName',
          label: '姓名',
          formatter: (row) => row.profile?.realName || '-'
        },
        {
          prop: 'gender',
          label: '性别',
          sortable: true,
          formatter: (row) => {
            const gender = row?.profile?.gender
            if (gender === null || gender === undefined) return '未知'
            return gender === 1 ? '男' : '女'
          }
        },
        {
          prop: 'phone',
          label: '手机号',
          useHeaderSlot: true,
          formatter: (row) => row.profile?.phone
        },
        {
          prop: 'roles',
          label: '关联角色',
          useHeaderSlot: true,
          formatter: (row) =>
            row.roles?.length ? row.roles.map((item) => item.name).join(' / ') : '-'
        },
        {
          prop: 'departmentInfo',
          label: '所属部门',
          formatter: (row) => row.departmentInfo?.name || '-'
        },
        {
          prop: 'postInfo',
          label: '所属岗位',
          formatter: (row) => row.postInfo?.name || '-'
        },
        {
          prop: 'createdAt',
          label: '创建日期',
          formatter: (row) => formatDateTime(row.createdAt)
        },
        {
          prop: 'updatedAt',
          label: '更新日期',
          formatter: (row) => formatDateTime(row.updatedAt)
        },
        {
          prop: 'operation',
          label: '操作',
          width: 120,
          fixed: 'right', // 固定列
          formatter: (row) =>
            h('div', [
              h(ArtButtonTable, {
                type: 'edit',
                onClick: () => showDialog('edit', row)
              }),
              h(ArtButtonTable, {
                type: 'delete',
                onClick: () => deleteUser(row)
              })
            ])
        }
      ]
    }
  })

  /**
   * 搜索处理
   * @param params 参数
   */
  const handleSearch = async (params: UserSearchFormParams) => {
    const { daterange, ...filtersParams } = params
    const [startTime, endTime] = Array.isArray(daterange) ? daterange : [undefined, undefined]

    await replaceSearchParams({ ...filtersParams, startTime, endTime })
  }

  const handleUsernameHeaderSearch = async (payload: ColumnSearchSubmitPayload) => {
    searchForm.value.username = String(payload.value || '') || undefined
    await handleSearch(searchForm.value)
  }

  const handleUsernameHeaderReset = async () => {
    searchForm.value.username = undefined
    await handleSearch(searchForm.value)
  }

  const handlePhoneHeaderSearch = async (payload: ColumnSearchSubmitPayload) => {
    searchForm.value.phone = String(payload.value || '') || undefined
    await handleSearch(searchForm.value)
  }

  const handlePhoneHeaderReset = async () => {
    searchForm.value.phone = undefined
    await handleSearch(searchForm.value)
  }

  const handleRoleHeaderSearch = async (payload: ColumnSearchSubmitPayload) => {
    const roleId = Number(payload.value)
    searchForm.value.role = Number.isFinite(roleId) && roleId > 0 ? roleId : undefined
    await handleSearch(searchForm.value)
  }

  const handleRoleHeaderReset = async () => {
    searchForm.value.role = undefined
    await handleSearch(searchForm.value)
  }

  /**
   * 重置用户筛选条件并重新查询。
   */
  const handleReset = () => {
    Object.assign(searchForm.value, {
      username: undefined,
      realName: undefined,
      phone: undefined,
      gender: undefined,
      role: undefined,
      departmentId: undefined,
      postId: undefined,
      daterange: undefined
    })
    resetSearchParams()
  }

  /**
   * 显示用户弹窗
   */
  function showDialog(type: DialogType, row?: UserListItem): void {
    dialogType.value = type
    currentUserData.value = row || {}
    nextTick(() => {
      dialogVisible.value = true
    })
  }

  /**
   * 删除用户
   */
  const deleteUser = (row: UserListItem): void => {
    ElMessageBox.confirm('确定要删除该用户吗？', '删除用户', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'error'
    })
      .then(async () => {
        try {
          await fetchDeleteUser(row.id)
          ElMessage.success('删除成功')
          refreshRemove()
        } catch (error) {
          console.error('删除失败:', error)
          if (!isHttpError(error)) {
            ElMessage.error('删除失败')
          }
        }
      })
      .catch(() => {})
  }

  /**
   * 处理弹窗提交事件
   */
  const handleDialogSubmit = async () => {
    try {
      if (dialogType.value === 'add') {
        await refreshCreate()
      } else {
        await refreshUpdate()
      }
      dialogVisible.value = false
      currentUserData.value = {}
    } catch (error) {
      console.error('提交失败:', error)
    }
  }

  /**
   * 处理表格行选择变化
   */
  const handleSelectionChange = (selection: UserListItem[]): void => {
    selectedRows.value = selection
  }

  /**
   * 获取角色列表
   */
  const fetchRoles = async (): Promise<void> => {
    try {
      const res = await fetchRolesList({
        current: 1,
        size: 10000
      })
      roleList.value = res.records
    } catch (error) {
      console.error('获取角色列表失败:', error)
      ElMessage.error('获取角色列表失败')
    }
  }

  // 加载部门列表
  const fetchDepartmentOptions = async (): Promise<void> => {
    try {
      departmentList.value = await fetchDepartments()
    } catch (error) {
      console.error('获取部门列表失败:', error)
      ElMessage.error('获取部门列表失败')
    }
  }

  // 加载岗位列表
  const fetchPostOptions = async (): Promise<void> => {
    try {
      const size = 100
      const firstPage = await fetchPosts({ current: 1, size })
      const totalPages = Math.ceil(firstPage.total / size)
      const records: PostItem[] = [...firstPage.records]

      if (totalPages > 1) {
        const remainingPages = await Promise.all(
          Array.from({ length: totalPages - 1 }, (_, index) =>
            fetchPosts({ current: index + 2, size })
          )
        )
        remainingPages.forEach((page) => {
          records.push(...page.records)
        })
      }

      postList.value = records
    } catch (error) {
      console.error('获取岗位列表失败:', error)
      ElMessage.error('获取岗位列表失败')
    }
  }

  // 关闭页面内弹窗，供快捷操作切换时统一清理
  const closePageDialogs = () => {
    dialogVisible.value = false
    currentUserData.value = {}
  }

  useQuickActionDialog({
    actionKey: 'createUser',
    onTrigger: () => showDialog('add'),
    onCloseDialogs: closePageDialogs
  })
</script>
