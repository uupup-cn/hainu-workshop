<template>
  <ElDialog
    v-model="dialogVisible"
    :title="dialogType === 'add' ? '添加用户' : '编辑用户'"
    width="min(600px, calc(100vw - 32px))"
    align-center
  >
    <ElForm ref="formRef" :model="formData" :rules="rules" label-width="80px" autocomplete="off">
      <input type="text" name="fake-username" autocomplete="username" class="hidden" />
      <input type="password" name="fake-password" autocomplete="new-password" class="hidden" />
      <ElRow :gutter="16">
        <ElCol :xs="24" :sm="dialogType === 'add' ? 12 : 24">
          <ElFormItem label="用户名" prop="username">
            <ElInput
              v-model="formData.username"
              name="user-dialog-username"
              autocomplete="off"
              placeholder="请输入用户名"
            />
          </ElFormItem>
        </ElCol>
        <ElCol v-if="dialogType === 'add'" :xs="24" :sm="12">
          <ElFormItem label="密码" prop="password">
            <ElInput
              v-model="formData.password"
              name="user-dialog-password"
              autocomplete="new-password"
              placeholder="请输入密码"
              type="password"
              show-password
            />
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="姓名" prop="profile.realName">
            <ElInput v-model="formData.profile.realName" placeholder="请输入姓名，可选" />
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="性别" prop="profile.gender">
            <ElSelect v-model="formData.profile.gender">
              <ElOption label="男" :value="1" />
              <ElOption label="女" :value="2" />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="角色" prop="roles">
            <ElSelect v-model="formData.roles" multiple>
              <ElOption
                v-for="role in roleList"
                :key="role.id"
                :value="role.id"
                :label="role.name"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="部门">
            <ElTreeSelect
              v-model="formData.departmentId"
              :data="departmentList"
              node-key="id"
              check-strictly
              clearable
              filterable
              default-expand-all
              :props="{ label: 'name', children: 'children' }"
              placeholder="请选择部门"
            />
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="岗位">
            <ElSelect v-model="formData.postId" clearable filterable placeholder="请选择岗位">
              <ElOption
                v-for="post in postList"
                :key="post.id"
                :value="post.id"
                :label="post.name"
              />
            </ElSelect>
          </ElFormItem>
        </ElCol>
        <ElCol :xs="24" :sm="12">
          <ElFormItem label="手机号" prop="profile.phone">
            <ElInput
              v-model.trim="formData.profile.phone"
              placeholder="请输入手机号"
              maxlength="11"
              inputmode="numeric"
            />
          </ElFormItem>
        </ElCol>
      </ElRow>
    </ElForm>
    <template #footer>
      <div class="dialog-footer">
        <ElButton @click="dialogVisible = false">取消</ElButton>
        <ElButton type="primary" @click="handleSubmit">提交</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { fetchAddUser, fetchEditUser } from '@/api/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'
  import { isHttpError } from '@/utils/http/error'
  import { validatePhone } from '@/utils/form'
  import { validateUserPasswordByAdminRule } from '@/utils/form/password-rule'

  interface Props {
    visible: boolean
    type: string
    roleList: Api.Access.RoleListItem[]
    departmentList: Api.Access.DepartmentItem[]
    postList: Api.Access.PostItem[]
    userData?: Partial<Api.Identity.UserListItem>
  }

  interface Emits {
    (e: 'update:visible', value: boolean): void
    (e: 'submit'): void
  }

  const props = defineProps<Props>()
  const emit = defineEmits<Emits>()

  // 对话框显示控制
  const dialogVisible = computed({
    get: () => props.visible,
    set: (value) => emit('update:visible', value)
  })

  /**
   * 当前弹窗类型，决定提交时走新增还是编辑接口。
   */
  const dialogType = computed(() => props.type)

  // 表单实例
  const formRef = ref<FormInstance>()

  // 表单数据
  const formData = reactive({
    username: '',
    password: '',
    departmentId: undefined as number | undefined,
    postId: undefined as number | undefined,
    profile: {
      gender: 1,
      realName: '',
      phone: ''
    },
    roles: [] as number[]
  })

  // 表单验证规则
  const rules: FormRules = {
    username: [
      { required: true, message: '请输入用户名', trigger: 'blur' },
      { min: 2, max: 20, message: '长度在 2 到 20 个字符', trigger: 'blur' }
    ],
    password: [
      { required: true, message: '请输入密码', trigger: 'blur' },
      {
        validator: (_rule, value, callback) => {
          if (dialogType.value === 'add' && !validateUserPasswordByAdminRule(value)) {
            callback(new Error('新增用户密码至少 6 位'))
            return
          }
          callback()
        },
        trigger: 'blur'
      }
    ],
    'profile.gender': [{ required: true, message: '请选择性别', trigger: 'change' }],
    'profile.phone': [
      {
        validator: (_rule, value, callback) => {
          if (!value) {
            callback()
            return
          }
          if (!validatePhone(value)) {
            callback(new Error('请输入正确的手机号'))
            return
          }
          callback()
        },
        trigger: ['blur', 'change']
      }
    ],
    roles: [{ required: true, message: '请选择角色', trigger: 'change' }]
  }

  /**
   * 初始化表单数据
   * 根据对话框类型（新增/编辑）填充表单
   */
  const initFormData = () => {
    const isEdit = props.type === 'edit' && props.userData
    const row = props.userData
    const genderValue = row?.profile?.gender

    Object.assign(formData, {
      username: isEdit && row ? row.username || '' : '',
      password: '',
      departmentId: isEdit && row ? (row.departmentId ?? undefined) : undefined,
      postId: isEdit && row ? (row.postId ?? undefined) : undefined,
      profile: {
        gender: isEdit && row ? (genderValue === 1 ? 1 : genderValue === 2 ? 2 : 1) : 1,
        realName: isEdit && row ? row.profile?.realName || '' : '',
        phone: isEdit && row ? row.profile?.phone || '' : ''
      },
      roles:
        isEdit && row
          ? (row.roles || [])
              .map((item) => (typeof item === 'object' && item?.id ? item.id : 0))
              .filter((id): id is number => id > 0)
          : []
    })
  }

  /**
   * 监听对话框状态变化
   * 当对话框打开时初始化表单数据并清除验证状态
   */
  watch(
    () => [props.visible, props.type, props.userData],
    ([visible]) => {
      if (visible) {
        initFormData()
        nextTick(() => {
          formRef.value?.clearValidate()
        })
      }
    },
    { immediate: true }
  )

  /**
   * 提交表单
   * 验证通过后触发提交事件
   */
  const handleSubmit = async () => {
    if (!formRef.value) return

    await formRef.value.validate((valid) => {
      if (valid) {
        if (dialogType.value === 'add') {
          addUser()
        } else {
          editUser()
        }
      }
    })
  }

  /**
   * 提交新增用户请求。
   */
  const addUser = async () => {
    try {
      const payload: Api.Identity.AddUserParams = {
        username: formData.username,
        password: formData.password,
        departmentId: formData.departmentId ?? undefined,
        postId: formData.postId ?? undefined,
        profile: {
          ...formData.profile
        },
        roles: formData.roles
      }

      await fetchAddUser(payload)
      ElMessage.success('新增成功')
      emit('submit')
    } catch (error) {
      console.error('提交失败:', error)
      if (!isHttpError(error)) {
        ElMessage.error('操作失败')
      }
    }
  }

  /**
   * 提交编辑用户请求。
   */
  const editUser = async () => {
    try {
      const payload: Api.Identity.EditUserParams = {
        username: formData.username,
        departmentId: formData.departmentId ?? null,
        postId: formData.postId ?? null,
        profile: {
          ...formData.profile
        },
        roles: formData.roles
      }

      await fetchEditUser(props.userData?.id || 0, payload)
      ElMessage.success('编辑成功')
      emit('submit')
    } catch (error) {
      console.error('提交失败:', error)
      if (!isHttpError(error)) {
        ElMessage.error('操作失败')
      }
    }
  }
</script>
