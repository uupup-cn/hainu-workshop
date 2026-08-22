<!-- 菜单管理页面 -->
<template>
  <div class="menu-page art-full-height">
    <!-- 搜索栏 -->
    <ArtSearchBar
      v-show="showSearchBar"
      v-model="formFilters"
      :items="formItems"
      :showExpand="false"
      @reset="handleReset"
      @search="handleSearch"
    />

    <ElCard
      class="art-table-card"
      shadow="never"
      :style="{ 'margin-top': showSearchBar ? '12px' : '0' }"
    >
      <!-- 表格头部 -->
      <ArtTableHeader
        :showZebra="false"
        :loading="loading"
        v-model:columns="columnChecks"
        v-model:showSearchBar="showSearchBar"
        @refresh="handleRefresh"
      >
        <template #left>
          <ElButton v-auth="'add'" @click="handleAddMenu" type="primary" plain v-ripple>
            新增菜单
          </ElButton>
          <ElButton @click="toggleExpand" v-ripple>
            {{ isExpanded ? '收起' : '展开' }}
          </ElButton>
        </template>
      </ArtTableHeader>

      <ArtTable
        ref="menuTableRef"
        :row-key="getRowKey"
        :loading="loading || sortSubmitting"
        :columns="columns"
        :data="filteredTableData"
        :stripe="false"
        :row-class-name="getMenuRowClassName"
        :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        :expand-row-keys="expandedRowKeys"
        :default-expand-all="false"
        mobile-mode="table"
      >
        <template #menuTitle="{ row }">
          <span class="menu-title-cell">
            <button
              v-if="canShowSortHandle && !row.meta?.isAuthButton"
              class="menu-drag-handle"
              :class="{ 'can-drag': canSortRow(row), 'is-locked': !canSortRow(row) }"
              :aria-disabled="!canSortRow(row)"
              type="button"
              aria-label="拖拽排序"
              title="拖拽排序"
              @click="handleSortHandleClick"
            >
              <ArtSvgIcon icon="ri:draggable" />
            </button>
            <span>{{ formatMenuTitle(row.meta?.title) }}</span>
          </span>
        </template>

        <template #menuType="{ row }">
          <ElTag :type="getMenuTypeTag(row)">{{ getMenuTypeText(row) }}</ElTag>
        </template>

        <template #route="{ row }">
          <span>{{ getRouteText(row) }}</span>
        </template>

        <template #auth="{ row }">
          <span>{{ getAuthText(row) }}</span>
        </template>

        <template #sort="{ row }">
          <span>{{ getSortText(row) }}</span>
        </template>

        <template #updatedAt="{ row }">
          <span>{{ formatDateTime(row.updatedAt) }}</span>
        </template>

        <template #status="{ row }">
          <ElTag :type="isMenuEnabled(row) ? 'success' : 'info'">
            {{ isMenuEnabled(row) ? '启用' : '禁用' }}
          </ElTag>
        </template>

        <template #operation="{ row }">
          <div class="text-right">
            <template v-if="row.meta?.isAuthButton">
              <ArtButtonTable v-if="canEdit" type="edit" @click="handleEditAuth(row)" />
              <ArtButtonTable v-if="canDelete" type="delete" @click="handleDeleteAuth(row)" />
            </template>

            <template v-else>
              <ArtButtonTable v-if="canAdd" type="add" @click="handleAddChildMenu(row)" />
              <ArtButtonTable v-if="canEdit" type="edit" @click="handleEditMenu(row)" />
              <ArtButtonTable v-if="canDelete" type="delete" @click="handleDeleteMenu(row)" />
            </template>
          </div>
        </template>
      </ArtTable>

      <!-- 菜单弹窗 -->
      <MenuDialog
        v-model:visible="dialogVisible"
        :type="dialogType"
        :editData="editData"
        :menu-options="menuOptions"
        :lockType="lockMenuType"
        @submit="handleSubmit"
      />
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { formatDateTime } from '@/utils'
  import { formatMenuTitle } from '@/utils/router'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { useTableColumns } from '@/hooks/core/useTableColumns'
  import type { AppRouteRecord } from '@/types/router'
  import {
    buildMenuOptions,
    buildMenuSubmitAction,
    collectDescendantIds,
    convertAuthListToChildren,
    createMenuRowKey,
    filterMenuTree,
    hasActiveMenuFilters,
    menuTypeLabelMap,
    resolveMenuKind,
    type MenuEditState,
    type MenuFormData,
    type MenuKind
  } from './menu.shared'
  import MenuDialog from './modules/menu-dialog.vue'
  import {
    fetchCreateMenu,
    fetchCreateMenuAuth,
    fetchDeleteMenu,
    fetchDeleteMenuAuth,
    fetchGetMenuManageList,
    fetchUpdateMenu,
    fetchUpdateMenuAuth,
    fetchUpdateMenuSort
  } from '@/api/menu'
  import { isHttpError } from '@/utils/http/error'
  import { ElMessage, ElMessageBox } from 'element-plus'
  import { useAuth } from '@/hooks/core/useAuth'
  import { useDraggable, type SortableEvent } from 'vue-draggable-plus'
  import { ApiPermissionCode } from '@/constants/api-permissions'

  defineOptions({ name: 'Menus' })

  const { hasAuth, hasApiPermission, hasRole } = useAuth()

  // 状态管理
  const loading = ref(false)
  const isExpanded = ref(false)
  const expandedRowKeys = shallowRef<string[]>([])
  const showSearchBar = ref(false)
  const sortSubmitting = ref(false)
  const menuTableRef = ref()
  const menuTableBodyRef = ref<HTMLElement>()
  const dragSnapshot = ref<{ parentKey: string; orderedIds: number[] } | null>(null)

  // 生成菜单表格的唯一行键
  const getRowKey = (row: unknown): string => createMenuRowKey(row as Record<string, unknown>)

  // 弹窗相关
  const dialogVisible = ref(false)
  const dialogType = ref<MenuKind>('directory')
  const editData = ref<MenuEditState | null>(null)
  const lockMenuType = ref(false)
  const canAdd = computed(() => hasAuth('add'))
  const canEdit = computed(() => hasAuth('edit'))
  const canDelete = computed(() => hasAuth('delete'))
  const canSubmitSort = computed(() => hasApiPermission(ApiPermissionCode.MENU.SORT))
  const canShowSortHandle = computed(() => canSubmitSort.value || hasRole('R_DEMO_ADMIN'))
  const isSortLocked = computed(
    () => loading.value || sortSubmitting.value || hasActiveMenuFilters(appliedFilters)
  )

  const MENU_ROW_ID_CLASS_PREFIX = 'menu-row-id-'
  const MENU_PARENT_CLASS_PREFIX = 'menu-parent-'

  const getParentId = (row: AppRouteRecord): number | undefined => {
    return typeof row.parentId === 'number'
      ? row.parentId
      : typeof row.meta?.parentId === 'number'
        ? row.meta.parentId
        : undefined
  }

  const getParentKeyById = (parentId?: number): string =>
    typeof parentId === 'number' ? String(parentId) : 'root'

  const getParentKey = (row: AppRouteRecord): string => getParentKeyById(getParentId(row))

  const canSortRow = (row: AppRouteRecord): boolean =>
    canSubmitSort.value && !row.meta?.isAuthButton && !isSortLocked.value

  const withParentIds = (rows: AppRouteRecord[], parentId?: number): AppRouteRecord[] => {
    return rows.map((row) => ({
      ...row,
      parentId,
      meta: {
        ...row.meta,
        parentId
      },
      children: row.children?.length ? withParentIds(row.children, row.id) : row.children
    }))
  }

  // 搜索相关
  const initialSearchState = {
    keyword: '',
    type: '',
    status: ''
  }

  const formFilters = reactive({ ...initialSearchState })
  const appliedFilters = reactive({ ...initialSearchState })

  /**
   * 构建菜单筛选栏配置。
   */
  const formItems = computed(() => [
    {
      label: '关键词',
      key: 'keyword',
      type: 'input',
      props: {
        clearable: true,
        placeholder: '请输入菜单名称、路由、外链或权限标识'
      }
    },
    {
      label: '菜单类型',
      key: 'type',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择菜单类型',
        options: [
          { label: '目录', value: 'directory' },
          { label: '菜单', value: 'menu' },
          { label: '按钮', value: 'button' },
          { label: '内嵌', value: 'iframe' },
          { label: '外链', value: 'link' }
        ]
      }
    },
    {
      label: '状态',
      key: 'status',
      type: 'select',
      props: {
        clearable: true,
        placeholder: '请选择状态',
        options: [
          { label: '启用', value: 'enabled' },
          { label: '禁用', value: 'disabled' }
        ]
      }
    }
  ])

  onMounted(() => {
    getMenuList()
    void setupMenuDragging()
  })

  onUnmounted(() => {
    menuDraggable.destroy()
  })

  /**
   * 获取菜单列表数据
   */
  const getMenuList = async (): Promise<void> => {
    loading.value = true

    try {
      const list = await fetchGetMenuManageList()
      tableData.value = withParentIds(list)
    } catch (error) {
      console.error(error)
      ElMessage.error('获取菜单失败')
    } finally {
      loading.value = false
    }
  }

  /**
   * 获取菜单类型标签颜色
   * @param row 菜单行数据
   * @returns 标签颜色类型
   */
  const getMenuTypeTag = (
    row: AppRouteRecord
  ): 'primary' | 'success' | 'warning' | 'info' | 'danger' => {
    switch (resolveMenuKind(row)) {
      case 'button':
        return 'danger'
      case 'iframe':
        return 'success'
      case 'directory':
        return 'info'
      case 'menu':
        return 'primary'
      case 'link':
        return 'warning'
      default:
        return 'info'
    }
  }

  /**
   * 获取菜单类型文本
   * @param row 菜单行数据
   * @returns 菜单类型文本
   */
  const getMenuTypeText = (row: AppRouteRecord): string => menuTypeLabelMap[resolveMenuKind(row)]

  // 表格列配置
  const { columnChecks, columns } = useTableColumns<AppRouteRecord>(() => [
    {
      prop: 'meta.title',
      label: '菜单名称',
      minWidth: 120,
      useSlot: true,
      slotName: 'menuTitle'
    },
    {
      prop: 'type',
      label: '菜单类型',
      useSlot: true,
      slotName: 'menuType'
    },
    {
      prop: 'path',
      label: '路由',
      useSlot: true,
      slotName: 'route'
    },
    {
      prop: 'meta.authList',
      label: '权限标识',
      useSlot: true,
      slotName: 'auth'
    },
    {
      prop: 'meta.sort',
      label: '排序',
      align: 'center',
      useSlot: true,
      slotName: 'sort'
    },
    {
      prop: 'updatedAt',
      label: '编辑时间',
      useSlot: true,
      slotName: 'updatedAt'
    },
    {
      prop: 'status',
      label: '状态',
      useSlot: true,
      slotName: 'status'
    },
    {
      prop: 'operation',
      label: '操作',
      width: 180,
      align: 'right',
      useSlot: true,
      fixed: 'right',
      slotName: 'operation'
    }
  ])

  // 数据相关
  const tableData = ref<AppRouteRecord[]>([])

  /**
   * 生成父级菜单下拉选项，编辑时禁用当前节点及其后代。
   */
  const menuOptions = computed(() => {
    const disabledIds = new Set<number>()

    if (editData.value?.id && !editData.value?.meta?.isAuthButton) {
      disabledIds.add(editData.value.id)
      collectDescendantIds(editData.value.children).forEach((id) => disabledIds.add(id))
    }

    return buildMenuOptions(tableData.value, disabledIds)
  })

  /**
   * 重置搜索条件
   */
  const handleReset = (): void => {
    Object.assign(formFilters, { ...initialSearchState })
    Object.assign(appliedFilters, { ...initialSearchState })
  }

  /**
   * 执行搜索
   */
  const handleSearch = (): void => {
    Object.assign(appliedFilters, { ...formFilters })
  }

  /**
   * 刷新菜单列表
   */
  const handleRefresh = (): void => {
    getMenuList()
  }

  // 过滤后的表格数据
  const filteredTableData = computed(() => {
    if (!hasActiveMenuFilters(appliedFilters)) {
      return convertAuthListToChildren(tableData.value)
    }

    return convertAuthListToChildren(filterMenuTree(tableData.value, appliedFilters))
  })

  /**
   * 收集所有可展开节点的 key。
   * 通过受控 expand-row-keys 一次性同步给 ElTable，避免逐个节点触发布局计算。
   */
  const collectExpandableRowKeys = (rows: AppRouteRecord[]): string[] => {
    const keys: string[] = []
    const stack = [...rows]

    while (stack.length) {
      const row = stack.pop()

      if (!row?.children?.length) {
        continue
      }

      keys.push(getRowKey(row))
      stack.push(...row.children)
    }

    return keys
  }

  const syncExpandedRowKeys = (): void => {
    expandedRowKeys.value = isExpanded.value
      ? collectExpandableRowKeys(filteredTableData.value)
      : []
  }

  const getRouteText = (row: AppRouteRecord): string => {
    if (row.meta?.isAuthButton) return ''
    return row.meta?.link || row.path || ''
  }

  const getAuthText = (row: AppRouteRecord): string => {
    if (row.meta?.isAuthButton) {
      return row.meta?.authMark || ''
    }

    if (!row.meta?.authList?.length) return ''
    return `${row.meta.authList.length} 个权限标识`
  }

  const getSortText = (row: AppRouteRecord): string => {
    if (row.meta?.sort === undefined || row.meta.sort === null) return '-'
    return String(row.meta.sort)
  }

  const isMenuEnabled = (row: AppRouteRecord): boolean => row.meta?.isEnable !== false

  const readClassValue = (element: HTMLElement | undefined, prefix: string): string => {
    return (
      Array.from(element?.classList || [])
        .find((className) => className.startsWith(prefix))
        ?.slice(prefix.length) || ''
    )
  }

  const readRowIdFromElement = (element: Element): number | null => {
    const rawId = readClassValue(element as HTMLElement, MENU_ROW_ID_CLASS_PREFIX)
    if (!rawId) return null

    const id = Number(rawId)
    return Number.isFinite(id) ? id : null
  }

  const getOrderedMenuIdsFromDom = (parentKey: string): number[] => {
    if (!menuTableBodyRef.value) return []

    return Array.from(
      menuTableBodyRef.value.querySelectorAll(
        `tr.menu-sort-row.${MENU_PARENT_CLASS_PREFIX}${parentKey}`
      )
    )
      .map(readRowIdFromElement)
      .filter((id): id is number => typeof id === 'number')
  }

  const collectMenuRows = (rows: AppRouteRecord[]): AppRouteRecord[] => {
    return rows.reduce<AppRouteRecord[]>((acc, row) => {
      acc.push(row)
      if (row.children?.length) {
        acc.push(...collectMenuRows(row.children))
      }
      return acc
    }, [])
  }

  const getSiblingMenusByParentKey = (parentKey: string): AppRouteRecord[] => {
    return collectMenuRows(tableData.value).filter((row) => getParentKey(row) === parentKey)
  }

  const hasSameIdSet = (left: number[], right: number[]): boolean => {
    if (left.length !== right.length) return false
    if (new Set(left).size !== left.length || new Set(right).size !== right.length) return false

    const rightSet = new Set(right)
    return left.every((id) => rightSet.has(id))
  }

  const isSameOrder = (previous: number[], current: number[]): boolean => {
    return (
      previous.length === current.length && previous.every((id, index) => id === current[index])
    )
  }

  const getMenuRowClassName = ({ row }: { row: unknown }): string => {
    const menuRow = row as unknown as AppRouteRecord

    if (menuRow.meta?.isAuthButton) return 'menu-auth-row'
    if (typeof menuRow.id !== 'number') return 'menu-unsortable-row'

    return [
      'menu-sort-row',
      `${MENU_ROW_ID_CLASS_PREFIX}${menuRow.id}`,
      `${MENU_PARENT_CLASS_PREFIX}${getParentKey(menuRow)}`
    ].join(' ')
  }

  const handleMenuDragStart = (event: SortableEvent): void => {
    if (!canSubmitSort.value) {
      dragSnapshot.value = null
      return
    }

    const parentKey = readClassValue(event.item as HTMLElement, MENU_PARENT_CLASS_PREFIX)
    dragSnapshot.value = parentKey
      ? {
          parentKey,
          orderedIds: getOrderedMenuIdsFromDom(parentKey)
        }
      : null
  }

  const handleMenuDragMove = (event: { dragged?: HTMLElement; related?: HTMLElement }): boolean => {
    if (!canSubmitSort.value || isSortLocked.value) return false

    const draggedParentKey = readClassValue(event.dragged, MENU_PARENT_CLASS_PREFIX)
    const relatedParentKey = readClassValue(event.related, MENU_PARENT_CLASS_PREFIX)
    return !!draggedParentKey && draggedParentKey === relatedParentKey
  }

  const handleMenuDragEnd = async (event: SortableEvent): Promise<void> => {
    const parentKey = readClassValue(event.item as HTMLElement, MENU_PARENT_CLASS_PREFIX)
    const previousOrder = dragSnapshot.value
    dragSnapshot.value = null

    if (!canSubmitSort.value) {
      await getMenuList()
      return
    }

    if (!parentKey || previousOrder?.parentKey !== parentKey) {
      await getMenuList()
      return
    }

    const orderedIds = getOrderedMenuIdsFromDom(parentKey)
    if (isSameOrder(previousOrder.orderedIds, orderedIds)) return

    const siblingIds = getSiblingMenusByParentKey(parentKey)
      .map((row) => row.id)
      .filter((id): id is number => typeof id === 'number')
    if (!hasSameIdSet(orderedIds, siblingIds)) {
      ElMessage.warning('请在完整菜单列表中对同级菜单排序')
      await getMenuList()
      return
    }

    sortSubmitting.value = true
    try {
      const parentId = parentKey === 'root' ? undefined : Number(parentKey)
      await fetchUpdateMenuSort({
        parentId: Number.isFinite(parentId) ? parentId : undefined,
        items: orderedIds.map((id, index) => ({
          id,
          sort: index + 1
        }))
      })
      await getMenuList()
    } catch (error) {
      console.error(error)
      if (!isHttpError(error)) {
        ElMessage.error('菜单排序失败，请稍后重试')
      }
      await getMenuList()
    } finally {
      sortSubmitting.value = false
    }
  }

  const handleSortHandleClick = (): void => {
    if (canSubmitSort.value) return
    ElMessage.warning('当前账号无权保存菜单排序，请联系管理员授权')
  }

  const menuDraggable = useDraggable<AppRouteRecord>(menuTableBodyRef, {
    immediate: false,
    animation: 150,
    draggable: '.menu-sort-row',
    handle: '.menu-drag-handle.can-drag',
    ghostClass: 'menu-row-ghost',
    chosenClass: 'menu-row-chosen',
    dragClass: 'menu-row-drag',
    fallbackTolerance: 4,
    filter: 'input, textarea, button:not(.menu-drag-handle), .el-select, .el-switch, .el-button',
    preventOnFilter: false,
    onStart: handleMenuDragStart,
    onMove: handleMenuDragMove,
    onEnd: (event) => void handleMenuDragEnd(event)
  })

  const setupMenuDragging = async (): Promise<void> => {
    await nextTick()
    const tableElement = menuTableRef.value?.$el as HTMLElement | undefined
    const bodyElement = tableElement?.querySelector(
      '.el-table__body-wrapper tbody'
    ) as HTMLElement | null

    if (!bodyElement || bodyElement === menuTableBodyRef.value) return
    menuTableBodyRef.value = bodyElement
    menuDraggable.start(bodyElement)
  }

  watch(filteredTableData, () => {
    if (isExpanded.value) {
      syncExpandedRowKeys()
    } else if (expandedRowKeys.value.length) {
      expandedRowKeys.value = []
    }

    void setupMenuDragging()
  })

  /**
   * 添加菜单
   */
  const handleAddMenu = (): void => {
    dialogType.value = 'directory'
    editData.value = null
    lockMenuType.value = false
    dialogVisible.value = true
  }

  /**
   * 添加子菜单/按钮
   */
  const handleAddChildMenu = (row: AppRouteRecord): void => {
    dialogType.value = 'directory'
    editData.value = {
      parentId: row.id,
      parentPath: row.path
    }
    lockMenuType.value = false
    dialogVisible.value = true
  }

  /**
   * 编辑菜单
   * @param row 菜单行数据
   */
  const handleEditMenu = (row: AppRouteRecord): void => {
    dialogType.value = resolveMenuKind(row, 'menu')
    editData.value = row
    lockMenuType.value = false
    dialogVisible.value = true
  }

  /**
   * 编辑权限按钮
   * @param row 权限行数据
   */
  const handleEditAuth = (row: AppRouteRecord): void => {
    dialogType.value = 'button'
    editData.value = {
      title: row.meta?.title,
      authMark: row.meta?.authMark,
      icon: row.meta?.icon,
      isEnable: typeof row.meta?.isEnable === 'boolean' ? row.meta.isEnable : undefined,
      sort: typeof row.meta?.sort === 'number' ? row.meta.sort : undefined,
      parentId: typeof row.meta?.parentId === 'number' ? row.meta.parentId : undefined,
      parentPath: row.meta?.parentPath
    }
    lockMenuType.value = true
    dialogVisible.value = true
  }

  /**
   * 提交表单数据
   * @param formData 表单数据
   * @param done 弹窗提交完成回调，用于控制弹窗内 loading 状态。
   */
  const handleSubmit = async (
    formData: MenuFormData,
    done?: (success: boolean) => void
  ): Promise<void> => {
    try {
      const action = buildMenuSubmitAction(formData, editData.value)

      if (action.type === 'button-update') {
        await fetchUpdateMenuAuth(action.parentId, action.authMark, action.payload)
      } else if (action.type === 'button-create') {
        await fetchCreateMenuAuth(action.payload)
      } else if (action.id) {
        await fetchUpdateMenu(action.id, action.payload)
      } else {
        await fetchCreateMenu(action.payload)
      }

      await getMenuList()
      done?.(true)
    } catch (error) {
      console.error(error)
      if (isHttpError(error)) {
        done?.(false)
        return
      }

      const errorMessage =
        typeof error === 'object' && error !== null && 'msg' in error
          ? String(error.msg)
          : typeof error === 'object' &&
              error !== null &&
              'message' in error &&
              typeof error.message === 'string'
            ? error.message
            : '提交失败，请稍后重试'
      ElMessage.error(errorMessage)
      done?.(false)
    }
  }

  /**
   * 删除菜单
   */
  const handleDeleteMenu = async (row: AppRouteRecord): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该菜单吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      if (!row.id) {
        ElMessage.error('缺少菜单 ID')
        return
      }

      await fetchDeleteMenu(row.id)
      await getMenuList()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  /**
   * 删除权限按钮
   */
  const handleDeleteAuth = async (row: AppRouteRecord): Promise<void> => {
    try {
      await ElMessageBox.confirm('确定要删除该权限吗？删除后无法恢复', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })

      const parentId = typeof row.meta?.parentId === 'number' ? row.meta.parentId : undefined
      const authMark = row.meta?.authMark
      if (!parentId || !authMark) {
        ElMessage.error('缺少权限标识信息')
        return
      }

      await fetchDeleteMenuAuth(parentId, authMark)
      await getMenuList()
    } catch (error) {
      if (error !== 'cancel') console.error(error)
    }
  }

  /**
   * 切换展开/收起所有菜单
   */
  const toggleExpand = (): void => {
    isExpanded.value = !isExpanded.value
    syncExpandedRowKeys()
  }
</script>

<style scoped>
  .menu-title-cell {
    display: inline-flex;
    gap: 10px;
    align-items: center;
    min-width: 0;
    vertical-align: middle;
  }

  .menu-drag-handle {
    display: inline-flex;
    flex: 0 0 auto;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    padding: 0;
    color: var(--el-text-color-regular);
    cursor: grab;
    background: var(--el-fill-color-blank);
    border: 1px solid var(--el-border-color-lighter);
    border-radius: 6px;
    transition:
      color 0.2s,
      background 0.2s,
      border-color 0.2s,
      box-shadow 0.2s;
  }

  .menu-drag-handle:hover {
    color: var(--el-text-color-primary);
    background: var(--el-fill-color-light);
    border-color: var(--el-border-color);
    box-shadow: 0 1px 2px rgb(0 0 0 / 6%);
  }

  .menu-drag-handle.can-drag:active {
    cursor: grabbing;
    background: var(--el-fill-color);
  }

  .menu-drag-handle.is-locked {
    cursor: not-allowed;
  }

  .menu-page :deep(.menu-row-ghost) {
    opacity: 0.54;
  }

  .menu-page :deep(.menu-row-chosen) {
    background: var(--el-fill-color-lighter);
  }
</style>
