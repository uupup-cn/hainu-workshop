<template>
  <ElDialog
    v-model="visible"
    title="权限配置"
    width="760px"
    align-center
    class="el-dialog-border"
    @close="handleClose"
  >
    <ElTabs v-model="activeTab" type="border-card">
      <ElTabPane label="菜单与按钮" name="menu">
        <ElScrollbar v-loading="loading" height="70vh">
          <ElTree
            ref="menuTreeRef"
            :data="menuTreeData"
            show-checkbox
            node-key="key"
            :default-expand-all="menuExpandAll"
            :props="treeProps"
            @check="syncMenuSelectAllState"
          >
            <template #default="{ data }">
              <div class="flex items-center gap-2">
                <span>{{ getMenuNodeLabel(data as MenuNode) }}</span>
              </div>
            </template>
          </ElTree>
        </ElScrollbar>
      </ElTabPane>
      <ElTabPane label="接口权限" name="api">
        <ElScrollbar v-loading="loading" height="70vh">
          <ElTree
            ref="apiTreeRef"
            :data="apiTreeData"
            show-checkbox
            node-key="key"
            :default-expand-all="apiExpandAll"
            :props="treeProps"
            @check="syncApiSelectAllState"
          >
            <template #default="{ data }">
              <div class="flex items-center gap-2">
                <template v-if="(data as ApiNode).type === 'permission'">
                  <ElTag size="small" effect="plain">{{ (data as ApiNode).method }}</ElTag>
                  <span>{{ (data as ApiNode).label }}</span>
                </template>
                <span v-else>{{ (data as ApiNode).label }}</span>
              </div>
            </template>
          </ElTree>
        </ElScrollbar>
      </ElTabPane>
    </ElTabs>

    <template #footer>
      <ElButton @click="toggleExpandAll">
        {{ currentExpandAll ? '全部收起' : '全部展开' }}
      </ElButton>
      <ElButton @click="toggleSelectAll">
        {{ currentSelectAll ? '取消全选' : '全部选择' }}
      </ElButton>
      <ElButton type="primary" @click="savePermission">保存</ElButton>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import type { TreeInstance, TreeOptionProps } from 'element-plus'

  import {
    fetchApiPermissionCatalog,
    fetchRolePermissions,
    fetchUpdateRolePermissions
  } from '@/api/roles'
  import { fetchGetMenuManageList } from '@/api/menu'
  import type { AppRouteRecord } from '@/types/router'
  import { formatMenuTitle } from '@/utils/router'
  import {
    buildApiTreeData,
    buildMenuTreeData,
    collectLeafKeys,
    collectNodeKeys,
    normalizeKeys,
    type ApiNode,
    type MenuNode
  } from './role-permission-tree'

  type RoleListItem = Api.Access.RoleListItem
  type ApiPermissionCatalogModule = Api.Access.ApiPermissionCatalogModule
  type RolePermissionData = Api.Access.RolePermissionData

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

  const activeTab = ref<'menu' | 'api'>('menu')
  const menuTreeRef = ref<TreeInstance>()
  const apiTreeRef = ref<TreeInstance>()
  const menuList = ref<AppRouteRecord[]>([])
  const apiCatalog = ref<ApiPermissionCatalogModule[]>([])
  const loading = ref(false)

  const menuExpandAll = ref(false)
  const menuSelectAll = ref(false)
  const apiExpandAll = ref(false)
  const apiSelectAll = ref(false)

  watch(
    () => props.modelValue,
    async (opened) => {
      if (opened && props.roleData) {
        await loadPermissionTree()
        return
      }

      resetTreeState()
    }
  )

  /**
   * 获取菜单权限节点展示名称。
   */
  const getMenuNodeLabel = (data: MenuNode) => {
    if (data.isAuth) {
      return data.label
    }

    const title = typeof data.meta?.title === 'string' ? formatMenuTitle(data.meta.title) : ''
    return title || data.label || ''
  }

  const treeProps: TreeOptionProps = {
    children: 'children',
    label: 'label'
  }

  /**
   * 菜单权限树展示数据。
   */
  const menuTreeData = computed(() => buildMenuTreeData(menuList.value))

  /**
   * 接口权限树展示数据。
   */
  const apiTreeData = computed(() => buildApiTreeData(apiCatalog.value))

  const menuValidKeySet = computed<Set<string>>(
    () => new Set<string>(collectNodeKeys(menuTreeData.value))
  )
  const apiValidKeySet = computed<Set<string>>(
    () => new Set<string>(collectNodeKeys(apiTreeData.value))
  )
  /**
   * 菜单权限叶子节点 key 集合。
   */
  const menuLeafKeys = computed(() => collectLeafKeys(menuTreeData.value))

  /**
   * 接口权限叶子节点 key 集合。
   */
  const apiLeafKeys = computed(() => collectLeafKeys(apiTreeData.value))

  /**
   * 当前标签页是否处于全部展开状态。
   */
  const currentExpandAll = computed(() =>
    activeTab.value === 'menu' ? menuExpandAll.value : apiExpandAll.value
  )
  /**
   * 当前标签页是否处于全部选中状态。
   */
  const currentSelectAll = computed(() =>
    activeTab.value === 'menu' ? menuSelectAll.value : apiSelectAll.value
  )

  /**
   * 获取树组件当前勾选和半选节点 key。
   */
  const getCheckedKeys = (treeRef: TreeInstance | undefined, validKeySet: Set<string>) => {
    if (!treeRef) return []

    const checkedKeys = treeRef.getCheckedKeys() as Array<string | number>
    const halfCheckedKeys = treeRef.getHalfCheckedKeys() as Array<string | number>
    return normalizeKeys([...checkedKeys, ...halfCheckedKeys], validKeySet)
  }

  const syncSelectAllState = (
    treeRef: TreeInstance | undefined,
    leafKeys: string[],
    validKeySet: Set<string>
  ) => {
    if (!treeRef) return false
    const checkedKeys = normalizeKeys(
      treeRef.getCheckedKeys() as Array<string | number>,
      validKeySet
    )
    return leafKeys.length > 0 && checkedKeys.length === leafKeys.length
  }

  /**
   * 同步菜单权限树的全选状态。
   */
  const syncMenuSelectAllState = () => {
    menuSelectAll.value = syncSelectAllState(
      menuTreeRef.value,
      menuLeafKeys.value,
      menuValidKeySet.value
    )
  }

  /**
   * 同步接口权限树的全选状态。
   */
  const syncApiSelectAllState = () => {
    apiSelectAll.value = syncSelectAllState(
      apiTreeRef.value,
      apiLeafKeys.value,
      apiValidKeySet.value
    )
  }

  const applyInitialCheckedKeys = (
    treeRef: TreeInstance | undefined,
    keys: Array<string | number>,
    validKeySet: Set<string>
  ) => {
    if (!treeRef) return

    // 逐个回填勾选，避免树组件因为父节点选中而自动级联出多余子节点。
    const normalizedKeys = normalizeKeys(keys, validKeySet)
    treeRef.setCheckedKeys([])
    normalizedKeys.forEach((key) => {
      treeRef.setChecked(key, true, false)
    })
  }

  /**
   * 加载角色菜单权限、接口权限目录和已有授权数据。
   */
  const loadPermissionTree = async () => {
    loading.value = true

    try {
      // 菜单树和接口目录并行加载，再按角色已有授权回填两套勾选状态。
      const [menus, rolePermissionData, apiPermissionCatalog]: [
        AppRouteRecord[],
        RolePermissionData,
        ApiPermissionCatalogModule[]
      ] = await Promise.all([
        fetchGetMenuManageList(),
        fetchRolePermissions(props.roleData!.id),
        fetchApiPermissionCatalog()
      ])

      menuList.value = menus
      apiCatalog.value = apiPermissionCatalog

      await nextTick()
      applyInitialCheckedKeys(
        menuTreeRef.value,
        rolePermissionData.permissionKeys,
        menuValidKeySet.value
      )
      applyInitialCheckedKeys(
        apiTreeRef.value,
        rolePermissionData.apiPermissionCodes,
        apiValidKeySet.value
      )
      syncMenuSelectAllState()
      syncApiSelectAllState()
    } finally {
      loading.value = false
    }
  }

  /**
   * 重置弹窗内两棵权限树的本地状态。
   */
  const resetTreeState = () => {
    activeTab.value = 'menu'
    menuList.value = []
    apiCatalog.value = []
    menuExpandAll.value = false
    menuSelectAll.value = false
    apiExpandAll.value = false
    apiSelectAll.value = false
    menuTreeRef.value?.setCheckedKeys([])
    apiTreeRef.value?.setCheckedKeys([])
  }

  /**
   * 弹窗关闭时清空权限树状态。
   */
  const handleClose = () => resetTreeState()

  /**
   * 批量切换树节点展开状态。
   */
  const toggleTreeExpanded = (treeRef: TreeInstance | undefined, expanded: boolean) => {
    const nodes = (treeRef as any)?.store?.nodesMap as
      | Record<string, { expanded: boolean }>
      | undefined
    if (!nodes) return

    Object.values(nodes).forEach((node: any) => {
      node.expanded = expanded
    })
  }

  /**
   * 切换当前标签页的全部展开/收起状态。
   */
  const toggleExpandAll = () => {
    if (activeTab.value === 'menu') {
      const nextExpanded = !menuExpandAll.value
      toggleTreeExpanded(menuTreeRef.value, nextExpanded)
      menuExpandAll.value = nextExpanded
      return
    }

    const nextExpanded = !apiExpandAll.value
    toggleTreeExpanded(apiTreeRef.value, nextExpanded)
    apiExpandAll.value = nextExpanded
  }

  /**
   * 切换当前标签页的全选/取消全选状态。
   */
  const toggleSelectAll = () => {
    if (activeTab.value === 'menu') {
      menuTreeRef.value?.setCheckedKeys(menuSelectAll.value ? [] : menuLeafKeys.value)
      syncMenuSelectAllState()
      return
    }

    apiTreeRef.value?.setCheckedKeys(apiSelectAll.value ? [] : apiLeafKeys.value)
    syncApiSelectAllState()
  }

  /**
   * 保存当前角色的菜单权限和接口权限。
   */
  const savePermission = async () => {
    if (!props.roleData?.id) return

    // 接口权限页只保存叶子权限码，不提交模块和分组这类展示节点。
    const permissionKeys = getCheckedKeys(menuTreeRef.value, menuValidKeySet.value)
    const apiPermissionCodes = getCheckedKeys(apiTreeRef.value, apiValidKeySet.value).filter(
      (key) => !key.startsWith('module:') && !key.startsWith('category:')
    )

    await fetchUpdateRolePermissions(props.roleData.id, permissionKeys, apiPermissionCodes)
    emit('success')
    visible.value = false
  }
</script>
