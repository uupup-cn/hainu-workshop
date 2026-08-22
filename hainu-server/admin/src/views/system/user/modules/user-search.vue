<template>
  <ArtSearchBar
    ref="searchBarRef"
    v-model="formData"
    :items="formItems"
    :rules="rules"
    @reset="handleReset"
    @search="handleSearch"
  >
  </ArtSearchBar>
</template>

<script setup lang="ts">
  type UserSearchFormParams = Api.Identity.UserSearchParams & {
    daterange?: string[]
  }

  interface Props {
    modelValue: UserSearchFormParams
    roleList: Api.Access.RoleListItem[]
    departmentList: Api.Access.DepartmentItem[]
    postList: Api.Access.PostItem[]
  }
  interface Emits {
    (e: 'update:modelValue', value: UserSearchFormParams): void
    (e: 'search', params: UserSearchFormParams): void
    (e: 'reset'): void
  }
  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 表单数据双向绑定
  const searchBarRef = ref()
  const formData = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
  })

  // 校验规则
  const rules = {}

  const genderOptions = [
    { label: '男', value: 1 },
    { label: '女', value: 2 }
  ]

  // 表单配置
  const formItems = computed(() => [
    {
      label: '用户名',
      key: 'username',
      type: 'input',
      props: {
        placeholder: '请输入用户名',
        clearable: true,
        onKeyup: (e: KeyboardEvent) => {
          if (e.key === 'Enter') {
            handleSearch(formData.value)
          }
        }
      }
    },
    {
      label: '姓名',
      key: 'realName',
      type: 'input',
      props: {
        placeholder: '请输入姓名',
        clearable: true
      }
    },
    {
      label: '手机号',
      key: 'phone',
      type: 'input',
      props: {
        placeholder: '请输入手机号',
        maxlength: 11,
        clearable: true
      }
    },
    {
      label: '性别',
      key: 'gender',
      type: 'select',
      props: {
        placeholder: '请选择性别',
        options: genderOptions,
        clearable: true
      }
    },
    {
      label: '角色',
      key: 'role',
      type: 'select',
      props: {
        placeholder: '请选择角色',
        options: props.roleList.map((item) => ({
          label: item.name,
          value: item.id
        })),
        clearable: true,
        filterable: true
      }
    },
    {
      label: '所属部门',
      key: 'departmentId',
      type: 'treeselect',
      props: {
        data: props.departmentList,
        nodeKey: 'id',
        clearable: true,
        filterable: true,
        checkStrictly: true,
        defaultExpandAll: false,
        renderAfterExpand: true,
        props: {
          label: 'name',
          children: 'children'
        },
        placeholder: '请选择部门'
      }
    },
    {
      label: '所属岗位',
      key: 'postId',
      type: 'select',
      props: {
        placeholder: '请选择岗位',
        options: props.postList.map((item) => ({
          label: item.name,
          value: item.id
        })),
        clearable: true,
        filterable: true
      }
    },
    {
      label: '创建日期',
      key: 'daterange',
      type: 'datetime',
      props: {
        style: { width: '100%' },
        placeholder: '请选择日期范围',
        type: 'daterange',
        rangeSeparator: '至',
        startPlaceholder: '开始日期',
        endPlaceholder: '结束日期',
        valueFormat: 'YYYY-MM-DD',
        shortcuts: [
          { text: '今日', value: [new Date(), new Date()] },
          { text: '最近一周', value: [new Date(Date.now() - 604800000), new Date()] },
          { text: '最近一个月', value: [new Date(Date.now() - 2592000000), new Date()] }
        ]
      }
    }
  ])

  // 事件
  function handleReset() {
    emit('reset')
  }

  /**
   * 校验搜索表单并向父组件提交查询条件。
   * @param params 用户查询参数。
   */
  async function handleSearch(params: UserSearchFormParams) {
    await searchBarRef.value.validate()
    emit('search', params)
  }
</script>
