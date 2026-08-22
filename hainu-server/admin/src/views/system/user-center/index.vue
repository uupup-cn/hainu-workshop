<template>
  <div class="bg-[var(--default-bg-color)]">
    <section class="art-card mb-5 overflow-hidden">
      <div class="space-y-5 p-5 md:p-6">
        <div
          class="grid items-start gap-5 [grid-template-columns:450px_minmax(0,1fr)] max-[1440px]:[grid-template-columns:400px_minmax(0,1fr)] max-[1200px]:grid-cols-1"
        >
          <aside>
            <ElCard shadow="never" class="art-card-sm art-card-border-only overflow-hidden">
              <div class="-mx-5 -mt-5 h-[196px] overflow-hidden rounded-t-[var(--custom-radius)]">
                <img
                  class="h-full w-full object-cover"
                  src="@imgs/user/bg.webp"
                  alt="profile cover"
                />
              </div>

              <div class="mt-[-42px] px-[22px] pb-6 text-center">
                <ElAvatar
                  :size="84"
                  :src="avatarSrc"
                  class="border-4 border-[var(--default-box-color)] shadow-[0_10px_24px_rgb(15_23_42_/_12%)]"
                >
                  {{ avatarFallback }}
                </ElAvatar>

                <h2 class="mt-3.5 text-xl font-semibold text-g-900">{{ displayName }}</h2>

                <p class="mt-6 text-[15px] leading-[1.85] text-g-800">
                  {{ profileForm.bio }}
                </p>

                <div class="mx-auto mt-7 flex w-[84%] flex-col gap-[14px] text-left">
                  <div class="flex items-center gap-2.5 text-sm text-g-800">
                    <ArtSvgIcon icon="ri:mail-line" />
                    <span>{{ profileForm.email || '未设置邮箱' }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-sm text-g-800">
                    <ArtSvgIcon icon="ri:briefcase-4-line" />
                    <span>{{ profileState.postInfo?.name || '未设置岗位' }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-sm text-g-800">
                    <ArtSvgIcon icon="ri:map-pin-line" />
                    <span>{{ profileForm.address || '未设置联系地址' }}</span>
                  </div>
                  <div class="flex items-center gap-2.5 text-sm text-g-800">
                    <ArtSvgIcon icon="ri:building-line" />
                    <span>{{ profileState.departmentInfo?.name || '未设置部门' }}</span>
                  </div>
                </div>

                <div class="mt-9 border-t border-[var(--default-border)] pt-[26px]">
                  <div class="mb-[14px] text-[15px] font-semibold text-g-900">标签</div>
                  <div class="flex flex-wrap justify-center gap-2.5">
                    <span
                      v-for="item in userLabels"
                      :key="item"
                      class="rounded border border-[var(--default-border)] bg-box px-2.5 py-1.5 text-xs text-g-800"
                    >
                      {{ item }}
                    </span>
                  </div>
                </div>
              </div>
            </ElCard>
          </aside>

          <main class="flex min-w-0 flex-col gap-5">
            <ElCard shadow="never" class="art-card-sm art-card-border-only overflow-hidden">
              <template #header>
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-lg font-semibold text-g-900">基本设置</div>
                    <div class="mt-1.5 text-[13px] text-g-600">
                      维护你的基础资料、联系信息与对外展示内容。
                    </div>
                  </div>
                </div>
              </template>

              <ElForm
                ref="profileFormRef"
                :model="profileForm"
                :rules="profileRules"
                label-position="top"
                class="pt-2"
              >
                <ElRow :gutter="20">
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="昵称" prop="nickName">
                      <ElInput
                        v-model="profileForm.nickName"
                        maxlength="50"
                        placeholder="请输入昵称"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="姓名" prop="realName">
                      <ElInput
                        v-model="profileForm.realName"
                        maxlength="50"
                        placeholder="请输入姓名，可选"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="性别" prop="gender">
                      <ElSelect
                        v-model="profileForm.gender"
                        class="w-full"
                        placeholder="请选择性别"
                      >
                        <ElOption :value="1" label="男" />
                        <ElOption :value="2" label="女" />
                      </ElSelect>
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="邮箱" prop="email">
                      <ElInput
                        v-model="profileForm.email"
                        maxlength="100"
                        placeholder="请输入邮箱，可选"
                      />
                    </ElFormItem>
                  </ElCol>

                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="手机" prop="phone">
                      <ElInput
                        v-model="profileForm.phone"
                        maxlength="11"
                        placeholder="请输入手机号码，可选"
                      />
                    </ElFormItem>
                  </ElCol>
                  <ElCol :xs="24" :md="12">
                    <ElFormItem label="联系地址" prop="address">
                      <ElInput
                        v-model="profileForm.address"
                        maxlength="255"
                        placeholder="请输入联系地址，可选"
                      />
                    </ElFormItem>
                  </ElCol>

                  <ElCol :span="24">
                    <ElFormItem label="个人介绍" prop="bio">
                      <ElInput
                        v-model="profileForm.bio"
                        type="textarea"
                        :rows="4"
                        maxlength="500"
                        show-word-limit
                        placeholder="请输入个人介绍"
                      />
                    </ElFormItem>
                  </ElCol>
                </ElRow>
              </ElForm>

              <div class="mt-5 flex justify-end">
                <ElButton type="primary" :loading="profileSaving" @click="handleProfileSubmit">
                  保存资料
                </ElButton>
              </div>
            </ElCard>

            <ElCard shadow="never" class="art-card-sm art-card-border-only overflow-hidden">
              <template #header>
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-lg font-semibold text-g-900">更改密码</div>
                    <div class="mt-1.5 text-[13px] text-g-600">
                      为了账号安全，建议定期更换密码。修改成功后会自动退出登录。
                    </div>
                  </div>
                </div>
              </template>

              <div
                class="grid items-start gap-5 [grid-template-columns:minmax(0,1fr)_280px] max-[1200px]:grid-cols-1"
              >
                <ElForm
                  ref="passwordFormRef"
                  :model="passwordForm"
                  :rules="passwordRules"
                  label-position="top"
                  class="pt-2"
                >
                  <ElRow :gutter="20">
                    <ElCol :span="24">
                      <ElFormItem label="当前密码" prop="currentPassword">
                        <ElInput
                          v-model="passwordForm.currentPassword"
                          type="password"
                          show-password
                          placeholder="请输入当前密码"
                        />
                      </ElFormItem>
                    </ElCol>

                    <ElCol :xs="24" :md="12">
                      <ElFormItem label="新密码" prop="newPassword">
                        <ElInput
                          v-model="passwordForm.newPassword"
                          type="password"
                          show-password
                          placeholder="请输入新密码"
                        />
                      </ElFormItem>
                    </ElCol>

                    <ElCol :xs="24" :md="12">
                      <ElFormItem label="确认新密码" prop="confirmPassword">
                        <ElInput
                          v-model="passwordForm.confirmPassword"
                          type="password"
                          show-password
                          placeholder="请再次输入新密码"
                        />
                      </ElFormItem>
                    </ElCol>
                  </ElRow>
                </ElForm>

                <div class="art-surface-muted px-5 py-[18px]">
                  <div class="mb-3 text-[15px] font-semibold text-g-900">安全建议</div>
                  <div
                    class="relative pl-3 text-[13px] leading-[1.8] text-g-800 before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-primary before:content-['']"
                    >新密码至少 6 位，规则与用户管理新增用户保持一致。</div
                  >
                  <div
                    class="relative mt-2 pl-3 text-[13px] leading-[1.8] text-g-800 before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-primary before:content-['']"
                    >避免使用生日、手机号、工号等容易被猜测的信息。</div
                  >
                  <div
                    class="relative mt-2 pl-3 text-[13px] leading-[1.8] text-g-800 before:absolute before:left-0 before:top-[9px] before:h-1 before:w-1 before:rounded-full before:bg-primary before:content-['']"
                  >
                    修改成功后请使用新密码重新登录系统。
                  </div>
                </div>
              </div>

              <div class="mt-5 flex justify-end">
                <ElButton type="primary" :loading="passwordSaving" @click="handlePasswordSubmit">
                  更新密码
                </ElButton>
              </div>
            </ElCard>

            <ElCard shadow="never" class="art-card-sm art-card-border-only overflow-hidden">
              <template #header>
                <div class="flex items-center justify-between gap-4">
                  <div>
                    <div class="text-lg font-semibold text-g-900">登录会话</div>
                    <div class="mt-1.5 text-[13px] text-g-600">
                      共
                      {{ sessionPagination.total }}
                      条记录，用于查看当前账号的登录状态与设备信息
                    </div>
                  </div>
                  <ElButton
                    type="danger"
                    plain
                    :loading="sessionOperating"
                    @click="handleRevokeOthers"
                  >
                    退出其他会话
                  </ElButton>
                </div>
              </template>

              <div v-loading="sessionLoading">
                <ElScrollbar v-if="sessionList.length" max-height="420px">
                  <div class="flex flex-col gap-[14px] pr-1">
                    <div
                      v-for="session in sessionList"
                      :key="session.id"
                      v-memo="[session.renderKey, sessionOperating, activeSessionId]"
                      class="grid items-center gap-4 art-surface-muted px-[18px] py-4 [grid-template-columns:44px_minmax(0,1fr)]"
                    >
                      <div
                        class="flex h-11 w-11 items-center justify-center rounded bg-[color-mix(in_srgb,var(--theme-color)_10%,transparent)] text-[18px] text-theme"
                      >
                        <ArtSvgIcon :icon="session.icon" />
                      </div>

                      <div class="min-w-0">
                        <div class="flex items-center justify-between gap-3">
                          <div class="text-[15px] font-semibold text-g-900">{{
                            session.title
                          }}</div>
                          <div class="flex flex-wrap items-center justify-end gap-2">
                            <ElTag
                              v-if="session.current"
                              size="small"
                              type="primary"
                              effect="light"
                            >
                              当前设备
                            </ElTag>
                            <ElTag
                              size="small"
                              :type="session.status === 'ACTIVE' ? 'success' : 'info'"
                              effect="light"
                            >
                              {{ session.status === 'ACTIVE' ? '在线' : '已下线' }}
                            </ElTag>
                            <ElButton
                              v-if="!session.current && session.status === 'ACTIVE'"
                              class="ml-0.5 text-xs"
                              text
                              type="danger"
                              :loading="sessionOperating && activeSessionId === session.id"
                              @click="handleRevokeSession(session)"
                            >
                              下线
                            </ElButton>
                          </div>
                        </div>

                        <div
                          class="mt-2 flex flex-wrap gap-x-4 gap-y-2.5 text-[13px] leading-[1.7] text-g-600"
                        >
                          <span>{{ session.subtitle }}</span>
                          <span>IP：{{ session.ip || '未知' }}</span>
                          <span>登录时间：{{ session.loginAtText }}</span>
                          <span>最近活跃：{{ session.lastActiveAtText }}</span>
                        </div>

                        <div v-if="session.revokedAt" class="mt-2 text-xs text-g-500">
                          已下线于 {{ session.revokedAtText }}
                        </div>
                      </div>
                    </div>
                  </div>
                </ElScrollbar>

                <ElEmpty v-else description="暂无会话记录" :image-size="120" />

                <div
                  v-if="sessionPagination.total > sessionPagination.size"
                  class="session-pagination-wrap mt-4"
                >
                  <ElPagination
                    class="session-pagination"
                    v-model:current-page="sessionPagination.current"
                    v-model:page-size="sessionPagination.size"
                    :total="sessionPagination.total"
                    :page-sizes="sessionPageSizes"
                    :layout="sessionPaginationLayout"
                    :pager-count="sessionPagerCount"
                    :size="sessionPaginationSize"
                    background
                    @current-change="handleSessionCurrentChange"
                    @size-change="handleSessionSizeChange"
                  />
                </div>
              </div>
            </ElCard>
          </main>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import defaultAvatar from '@imgs/user/avatar.webp'
  import { fetchGetUserInfo } from '@/api/auth'
  import {
    fetchChangeCurrentUserPassword,
    fetchCurrentUserProfile,
    fetchCurrentUserSessions,
    fetchRevokeCurrentUserSession,
    fetchRevokeOtherUserSessions,
    fetchUpdateCurrentUserProfile
  } from '@/api/user'
  import { formatDateTime } from '@/utils'
  import { validateUserPasswordByAdminRule } from '@/utils/form/password-rule'
  import { resolveUserDisplayName } from '@/utils/user'
  import { useUserStore } from '@/store/modules/user'
  import type { FormInstance, FormRules } from 'element-plus'
  import { ElMessageBox, ElMessage } from 'element-plus'

  defineOptions({ name: 'UserCenter' })

  const userStore = useUserStore()
  const profileSaving = ref(false)
  const passwordSaving = ref(false)
  const sessionLoading = ref(false)
  const sessionOperating = ref(false)
  const activeSessionId = ref('')
  const profileFormRef = ref<FormInstance>()
  const passwordFormRef = ref<FormInstance>()
  const sessionPageSizes = [20, 50, 100]
  const { width } = useWindowSize()

  type SessionDisplayItem = Api.Identity.UserSessionInfo & {
    icon: string
    title: string
    subtitle: string
    loginAtText: string
    lastActiveAtText: string
    revokedAtText: string
    sortTime: number
    renderKey: string
  }

  const sessionList = ref<SessionDisplayItem[]>([])
  const sessionPagination = reactive<Api.Common.PaginationParams>({
    current: 1,
    size: 20,
    total: 0
  })

  const sessionPaginationLayout = computed(() => {
    if (width.value < 640) return 'prev, pager, next'
    if (width.value < 1480) return 'sizes, prev, pager, next'
    return 'total, sizes, prev, pager, next, jumper'
  })

  const sessionPagerCount = computed(() => {
    if (width.value < 640) return 5
    if (width.value < 1480) return 7
    return 9
  })

  const sessionPaginationSize = computed(() => (width.value < 640 ? 'small' : 'default'))

  const profileState = reactive<Api.Identity.CurrentUserProfileInfo>({
    id: 0,
    username: '',
    createdAt: '',
    updatedAt: '',
    departmentInfo: null,
    postInfo: null,
    roles: [],
    profile: {
      gender: 1,
      phone: '',
      realName: '',
      nickName: '',
      email: '',
      address: '',
      bio: ''
    }
  })

  const profileForm = reactive<Api.Identity.CurrentUserProfilePayload>({
    realName: '',
    nickName: '',
    email: '',
    phone: '',
    address: '',
    gender: 1,
    bio: ''
  })

  const passwordForm = reactive<Api.Identity.ChangePasswordPayload>({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // 生成必填文本校验器
  const validateRequiredText = (label: string) => {
    return (_rule: any, value: string, callback: (error?: Error) => void) => {
      if (!String(value || '').trim()) {
        callback(new Error(`请输入${label}`))
        return
      }
      callback()
    }
  }

  // 校验确认密码与新密码一致
  const validateConfirmPassword = (
    _rule: any,
    value: string,
    callback: (error?: Error) => void
  ) => {
    if (!value) {
      callback(new Error('请再次输入新密码'))
      return
    }
    if (value !== passwordForm.newPassword) {
      callback(new Error('两次输入的新密码不一致'))
      return
    }
    callback()
  }

  // 校验新密码复杂度
  const validateNewPassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!String(value || '').trim()) {
      callback(new Error('请输入新密码'))
      return
    }

    if (!validateUserPasswordByAdminRule(value)) {
      callback(new Error('新密码至少 6 位'))
      return
    }

    callback()
  }

  const profileRules: FormRules = {
    nickName: [
      { validator: validateRequiredText('昵称'), trigger: 'blur' },
      { min: 2, max: 50, message: '长度需在 2 到 50 个字符之间', trigger: 'blur' }
    ],
    realName: [{ max: 50, message: '姓名长度不能超过 50 个字符', trigger: 'blur' }],
    email: [{ type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }],
    phone: [
      {
        validator: (_rule: any, value: string, callback: (error?: Error) => void) => {
          const normalized = String(value || '').trim()
          if (!normalized) {
            callback()
            return
          }

          if (!/^1\d{10}$/.test(normalized)) {
            callback(new Error('请输入正确的手机号'))
            return
          }

          callback()
        },
        trigger: 'blur'
      }
    ],
    address: [{ max: 255, message: '地址长度不能超过 255 个字符', trigger: 'blur' }],
    gender: [{ required: true, message: '请选择性别', trigger: 'change' }],
    bio: [{ max: 500, message: '个人介绍长度不能超过 500 个字符', trigger: 'blur' }]
  }

  const passwordRules: FormRules = {
    currentPassword: [{ validator: validateRequiredText('当前密码'), trigger: 'blur' }],
    newPassword: [{ validator: validateNewPassword, trigger: 'blur' }],
    confirmPassword: [{ validator: validateConfirmPassword, trigger: 'blur' }]
  }

  // 计算头像地址
  const avatarSrc = computed(() => userStore.getUserInfo.avatar || defaultAvatar)

  // 计算展示名称
  const displayName = computed(() =>
    resolveUserDisplayName({
      nickName: profileForm.nickName,
      username: profileState.username
    })
  )

  // 计算头像占位首字母
  const avatarFallback = computed(() => (displayName.value || 'U').slice(0, 1).toUpperCase())

  // 生成用户标签列表
  const userLabels = computed(() => {
    const labels = [
      profileState.departmentInfo?.name,
      profileState.postInfo?.name,
      ...profileState.roles.map((item) => item.name)
    ].filter(Boolean) as string[]

    return labels.length ? labels : ['未设置标签']
  })

  // 将个人资料回填到表单
  const syncProfileForm = (payload: Api.Identity.CurrentUserProfileInfo) => {
    Object.assign(profileState, payload)
    Object.assign(profileForm, {
      realName: payload.profile.realName || '',
      nickName: payload.profile.nickName || '',
      email: payload.profile.email || '',
      phone: payload.profile.phone || '',
      address: payload.profile.address || '',
      gender: payload.profile.gender === 2 ? 2 : 1,
      bio: payload.profile.bio || ''
    })
  }

  // 刷新用户仓库中的资料信息
  const refreshUserStoreInfo = async () => {
    const userInfo = await fetchGetUserInfo()
    userStore.setUserInfo(userInfo)
  }

  // 清洗个人资料提交数据
  const sanitizeProfilePayload = (): Api.Identity.CurrentUserProfilePayload => {
    return {
      realName: (profileForm.realName || '').trim(),
      nickName: (profileForm.nickName || '').trim(),
      email: (profileForm.email || '').trim(),
      phone: (profileForm.phone || '').trim(),
      address: (profileForm.address || '').trim(),
      gender: profileForm.gender,
      bio: (profileForm.bio || '').trim()
    }
  }

  // 加载当前用户资料
  const loadProfile = async () => {
    const profile = await fetchCurrentUserProfile()
    syncProfileForm(profile)
  }

  // 提交个人资料更新
  const handleProfileSubmit = async () => {
    const valid = await profileFormRef.value?.validate().catch(() => false)
    if (!valid) return

    profileSaving.value = true
    try {
      const profile = await fetchUpdateCurrentUserProfile(sanitizeProfilePayload())
      syncProfileForm(profile)
      await refreshUserStoreInfo()
      ElMessage.success('个人资料已更新')
    } catch (error) {
      console.error(error)
    } finally {
      profileSaving.value = false
    }
  }

  // 重置密码表单
  const resetPasswordForm = () => {
    Object.assign(passwordForm, {
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
    passwordFormRef.value?.clearValidate()
  }

  // 提交修改密码请求
  const handlePasswordSubmit = async () => {
    const valid = await passwordFormRef.value?.validate().catch(() => false)
    if (!valid) return

    passwordSaving.value = true
    try {
      const result = await fetchChangeCurrentUserPassword(passwordForm)
      ElMessage.success(result.message || '密码更新成功')
      resetPasswordForm()
      userStore.logOut()
    } catch (error) {
      console.error(error)
    } finally {
      passwordSaving.value = false
    }
  }

  // 根据 UA 解析会话标题
  const resolveSessionTitle = (userAgent?: string | null) => {
    const source = String(userAgent || '').toLowerCase()
    if (source.includes('iphone') || source.includes('ios')) return 'iPhone / iOS'
    if (source.includes('ipad')) return 'iPad / iPadOS'
    if (source.includes('android')) return 'Android 设备'
    if (source.includes('mac os')) return 'Mac 设备'
    if (source.includes('windows')) return 'Windows 设备'
    if (source.includes('linux')) return 'Linux 设备'
    return '未知设备'
  }

  // 根据 UA 解析会话副标题
  const resolveSessionSubtitle = (userAgent?: string | null) => {
    const source = String(userAgent || '').toLowerCase()
    if (source.includes('edg/')) return 'Microsoft Edge'
    if (source.includes('chrome/')) return 'Google Chrome'
    if (source.includes('safari/') && !source.includes('chrome/')) return 'Safari'
    if (source.includes('firefox/')) return 'Firefox'
    return userAgent || '未识别客户端'
  }

  // 根据 UA 解析会话图标
  const resolveSessionIcon = (userAgent?: string | null) => {
    const source = String(userAgent || '').toLowerCase()
    if (source.includes('iphone') || source.includes('android') || source.includes('mobile')) {
      return 'ri:smartphone-line'
    }
    if (source.includes('ipad') || source.includes('tablet')) {
      return 'ri:tablet-line'
    }
    return 'ri:computer-line'
  }

  const buildSessionDisplayList = (
    sessions: Api.Identity.UserSessionInfo[]
  ): SessionDisplayItem[] => {
    return sessions
      .map((session) => {
        const sortTime = new Date(
          session.lastActiveAt || session.loginAt || session.revokedAt || 0
        ).getTime()

        return {
          ...session,
          title: resolveSessionTitle(session.userAgent),
          subtitle: resolveSessionSubtitle(session.userAgent),
          icon: resolveSessionIcon(session.userAgent),
          loginAtText: formatDateTime(session.loginAt),
          lastActiveAtText: formatDateTime(session.lastActiveAt),
          revokedAtText: formatDateTime(session.revokedAt),
          sortTime,
          renderKey: [
            session.id,
            session.current ? '1' : '0',
            session.status,
            session.loginAt,
            session.lastActiveAt,
            session.revokedAt || ''
          ].join(':')
        }
      })
      .sort((left, right) => {
        if (left.current !== right.current) return left.current ? -1 : 1
        if (left.status !== right.status) return left.status === 'ACTIVE' ? -1 : 1
        return right.sortTime - left.sortTime
      })
  }

  // 加载当前用户会话分页列表
  const loadSessions = async (current = sessionPagination.current) => {
    sessionLoading.value = true
    try {
      const response = await fetchCurrentUserSessions({
        current,
        size: sessionPagination.size
      })

      if (response.total > 0 && current > 1 && response.records.length === 0) {
        const fallbackCurrent = Math.max(Math.ceil(response.total / response.size), 1)
        sessionPagination.current = fallbackCurrent
        await loadSessions(fallbackCurrent)
        return
      }

      sessionList.value = buildSessionDisplayList(response.records)
      Object.assign(sessionPagination, {
        current: response.current,
        size: response.size,
        total: response.total
      })
    } finally {
      sessionLoading.value = false
    }
  }

  const handleSessionSizeChange = (size: number) => {
    sessionPagination.size = size
    sessionPagination.current = 1
    loadSessions(1)
  }

  const handleSessionCurrentChange = (current: number) => {
    sessionPagination.current = current
    loadSessions(current)
  }

  // 撤销除当前会话外的其它会话
  const handleRevokeOthers = async () => {
    await ElMessageBox.confirm('确认退出当前账号在其他设备上的登录状态吗？', '退出其他会话', {
      type: 'warning'
    })

    sessionOperating.value = true
    activeSessionId.value = ''
    try {
      const result = await fetchRevokeOtherUserSessions()
      ElMessage.success(result.message || '其他会话已退出')
      await loadSessions()
    } catch (error) {
      console.error(error)
    } finally {
      sessionOperating.value = false
    }
  }

  // 撤销单个会话
  const handleRevokeSession = async (session: Api.Identity.UserSessionInfo) => {
    await ElMessageBox.confirm(
      '确认下线这个会话吗？该设备需要重新登录后才能继续使用。',
      '下线会话',
      {
        type: 'warning'
      }
    )

    sessionOperating.value = true
    activeSessionId.value = session.id
    try {
      const result = await fetchRevokeCurrentUserSession(session.id)
      ElMessage.success(result.message || '会话已下线')
      if (result.shouldLogout) {
        userStore.logOut()
        return
      }
      await loadSessions()
    } catch (error) {
      console.error(error)
    } finally {
      sessionOperating.value = false
      activeSessionId.value = ''
    }
  }

  onMounted(async () => {
    await Promise.all([loadProfile(), loadSessions()])
  })
</script>

<style scoped lang="scss">
  .session-pagination-wrap {
    display: flex;
    justify-content: flex-end;
    width: 100%;
    overflow: hidden;

    :deep(.session-pagination.el-pagination) {
      display: flex;
      flex-wrap: wrap;
      gap: 12px 0;
      justify-content: flex-end;
      max-width: 100%;
    }

    :deep(.session-pagination .el-pagination__sizes) {
      margin-right: 12px;
    }

    :deep(.session-pagination .el-pagination__jump) {
      margin-left: 12px;
    }
  }

  @media (width <= 768px) {
    .session-pagination-wrap {
      justify-content: center;

      :deep(.session-pagination.el-pagination) {
        justify-content: center;
      }
    }
  }
</style>
