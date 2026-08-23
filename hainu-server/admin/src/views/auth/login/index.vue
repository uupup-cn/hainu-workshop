<!-- 登录页面 -->
<template>
  <div class="flex w-full h-screen bg-[var(--art-color)]">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">欢迎回来</h3>
          <p class="sub-title">请输入账号和密码登录系统</p>
          <ElAlert
            v-if="publicConfig.maintenanceMode"
            class="mt-5!"
            type="warning"
            :closable="false"
            :title="publicConfig.maintenanceMessage || '系统正在维护中，请关注最新通知。'"
          />
          <ElForm
            class="mt-[25px]"
            ref="formRef"
            :model="formData"
            :rules="rules"
            @keyup.enter="handleSubmit"
          >
            <ElFormItem prop="username">
              <ElInput
                class="custom-height"
                placeholder="请输入用户名"
                v-model.trim="formData.username"
              />
            </ElFormItem>
            <ElFormItem prop="password">
              <ElInput
                class="custom-height"
                placeholder="请输入密码"
                v-model.trim="formData.password"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <ElFormItem v-if="isImageCaptchaEnabled" prop="captchaCode" class="captcha-form-item">
              <div class="captcha-row">
                <ElInput
                  class="custom-height captcha-input"
                  placeholder="请输入验证码"
                  v-model.trim="formData.captchaCode"
                  autocomplete="off"
                  maxlength="10"
                />
                <button
                  class="captcha-image"
                  type="button"
                  :disabled="captchaLoading"
                  title="点击刷新验证码"
                  @click="loadCaptcha"
                >
                  <span v-if="captchaLoading" class="captcha-loading">刷新中</span>
                  <span
                    v-else-if="captchaSvg"
                    class="captcha-svg"
                    v-html="displayCaptchaSvg"
                  ></span>
                  <span v-else class="captcha-loading">点击获取</span>
                </button>
              </div>
            </ElFormItem>

            <!-- 滑块验证 -->
            <div v-if="isSliderCaptchaEnabled" class="relative pb-5 mt-6">
              <div
                class="relative z-[2] overflow-hidden select-none rounded-lg border border-transparent tad-300"
                :class="{ '!border-[#FF4E4F]': !isPassing && isClickPass }"
              >
                <ArtDragVerify
                  ref="dragVerify"
                  v-model:value="isPassing"
                  text="拖动滑块完成验证"
                  textColor="var(--art-gray-700)"
                  successText="验证通过"
                  progressBarBg="var(--main-color)"
                  background="var(--art-gray-100)"
                  handlerBg="var(--default-box-color)"
                />
              </div>
              <p
                class="absolute top-0 z-[1] px-px mt-2 text-xs text-[#f56c6c] tad-300"
                :class="{ 'translate-y-10': !isPassing && isClickPass }"
              >
                请拖动滑块完成验证
              </p>
            </div>

            <div class="flex-cb mt-2 text-sm">
              <ElCheckbox v-model="formData.rememberPassword">记住密码</ElCheckbox>
              <RouterLink class="text-theme" :to="{ name: 'ForgetPassword' }">
                忘记密码
              </RouterLink>
            </div>

            <div class="mt-[30px]">
              <ElButton
                class="w-full custom-height"
                type="primary"
                @click="handleSubmit"
                :loading="loading"
                v-ripple
              >
                登录
              </ElButton>
            </div>

            <div v-if="publicConfig.allowRegister" class="mt-5 text-sm text-gray-600">
              <span>还没有账号？</span>
              <RouterLink class="text-theme" :to="{ name: 'Register' }">立即注册</RouterLink>
            </div>
          </ElForm>
        </div>
      </div>

      <ArtComplianceFooter
        class="auth-compliance-footer !absolute !inset-x-0 !bottom-4 !z-10 !px-6 !py-0 max-sm:!bottom-3"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import { fetchCaptcha, fetchGetUserInfo, fetchLogin } from '@/api/auth'
  import { useUserStore } from '@/store/modules/user'
  import { useSettingStore } from '@/store/modules/setting'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { resolveAuthRedirectTarget, resolveRequestErrorMessage } from '../shared'
  import { ElNotification, type FormInstance, type FormRules } from 'element-plus'
  import { ElMessage } from 'element-plus'

  defineOptions({ name: 'Login' })

  interface LoginForm {
    username: string
    password: string
    captchaId: string
    captchaCode: string
    rememberPassword: boolean
  }

  interface DragVerifyInstance {
    reset: () => void
  }

  const siteSettingsStore = useSiteSettingsStore()
  const { publicConfig } = storeToRefs(siteSettingsStore)
  const siteBrandName = computed(() => publicConfig.value.siteName || 'Ci-Yuu-Plus')
  const isImageCaptchaEnabled = computed(
    () => publicConfig.value.captchaEnabled && publicConfig.value.captchaType === 'IMAGE'
  )
  const isSliderCaptchaEnabled = computed(
    () => publicConfig.value.captchaEnabled && publicConfig.value.captchaType === 'SLIDER'
  )
  const router = useRouter()
  const route = useRoute()
  const userStore = useUserStore()
  const settingStore = useSettingStore()
  const { isDark } = storeToRefs(settingStore)
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const dragVerify = ref<DragVerifyInstance | null>(null)
  const isPassing = ref(false)
  const isClickPass = ref(false)
  const captchaLoading = ref(false)
  const captchaSvg = ref('')
  const displayCaptchaSvg = computed(() => createCaptchaSvg(captchaSvg.value, isDark.value))
  const formData = reactive<LoginForm>({
    username: '',
    password: '',
    captchaId: '',
    captchaCode: '',
    rememberPassword: false
  })

  /**
   * 生成登录表单校验规则。
   */
  const rules = computed<FormRules>(() => ({
    username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
    password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
    captchaCode: isImageCaptchaEnabled.value
      ? [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      : []
  }))

  /**
   * 执行表单校验。
   * 校验失败时直接返回 `false`，避免进入接口异常提示分支。
   */
  const validateLoginForm = async () => {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  /**
   * 标准化后端返回的图形验证码 SVG。
   * 亮色/暗色都移除 SVG 内部描边，避免和外层按钮边框叠成双层边框。
   * 暗黑模式额外调整 SVG 背景色。
   * v-html 注入的节点不稳定继承 scoped 样式，因此在渲染前直接处理 SVG 更可靠。
   */
  const createCaptchaSvg = (svg: string, dark: boolean) => {
    if (!svg || typeof DOMParser === 'undefined') return svg

    try {
      const document = new DOMParser().parseFromString(svg, 'image/svg+xml')
      const parserError = document.querySelector('parsererror')
      if (parserError) return svg

      const svgElement = document.querySelector('svg')
      const rectList = Array.from(document.querySelectorAll('rect'))
      const backgroundRect = rectList[0]

      if (dark) {
        svgElement?.setAttribute(
          'style',
          `${svgElement.getAttribute('style') || ''};background:#151821`
        )
        backgroundRect?.setAttribute('fill', '#151821')
      }

      rectList.forEach((rect) => {
        rect.setAttribute('stroke', 'transparent')
        rect.setAttribute('stroke-width', '0')
      })

      if (dark) {
        document.querySelectorAll('text').forEach((text) => {
          text.setAttribute('stroke', 'rgba(12,14,20,0.7)')
          text.setAttribute('stroke-width', '0.85')
        })
      }

      return new XMLSerializer().serializeToString(document.documentElement)
    } catch {
      return svg
    }
  }

  const loadCaptcha = async () => {
    if (!isImageCaptchaEnabled.value) return

    captchaLoading.value = true
    try {
      const result = await fetchCaptcha()
      formData.captchaId = result.captchaId
      formData.captchaCode = ''
      captchaSvg.value = result.image
    } finally {
      captchaLoading.value = false
    }
  }

  const ensureSliderVerified = () => {
    if (!isSliderCaptchaEnabled.value || isPassing.value) {
      return true
    }

    isClickPass.value = true
    return false
  }

  /**
   * 调用登录接口并返回访问令牌。
   * 该方法只关心请求本身，页面状态处理交由提交流程统一管理。
   */
  const submitLoginRequest = async () => {
    const { username, password, captchaId, captchaCode } = formData
    const { accessToken } = await fetchLogin({
      username,
      password,
      captchaId: isImageCaptchaEnabled.value ? captchaId : undefined,
      captchaCode: isImageCaptchaEnabled.value ? captchaCode : undefined
    })

    if (!accessToken) {
      throw new Error('登录失败，请检查账号或密码')
    }

    return accessToken
  }

  /**
   * 在登录成功后持久化用户状态，并跳转到目标页面。
   */
  const finishLogin = async (accessToken: string) => {
    userStore.prepareForLogin()
    userStore.setTokens(accessToken)
    userStore.setLoginStatus(true)

    let userInfo: Api.Auth.UserInfo
    try {
      userInfo = await fetchGetUserInfo()
    } catch (error) {
      userStore.logOut({ redirect: false })
      throw error
    }

    userStore.setUserInfo(userInfo)
    userStore.checkAndClearWorktabs()
    showLoginSuccessNotice()

    const redirect = resolveAuthRedirectTarget(route.query.redirect)
    await router.replace(redirect)
  }

  /**
   * 提交登录表单。
   * 提交流程包含表单校验、拖拽校验、接口调用与登录完成后的跳转。
   */
  const handleSubmit = async () => {
    const isFormValid = await validateLoginForm()
    if (!isFormValid || !ensureSliderVerified()) return

    try {
      loading.value = true
      const accessToken = await submitLoginRequest()
      await finishLogin(accessToken)
    } catch (error: unknown) {
      console.error('登录失败:', error)
      ElMessage.error(resolveRequestErrorMessage(error, '登录失败，请检查账号或密码'))
      await loadCaptcha()
    } finally {
      loading.value = false
      resetSliderVerify()
    }
  }

  const resetSliderVerify = () => {
    if (!isSliderCaptchaEnabled.value) return

    isPassing.value = false
    isClickPass.value = false
    dragVerify.value?.reset()
  }

  /**
   * 展示登录成功通知。
   * 延迟展示可避免与路由跳转动画和页面加载提示产生视觉冲突。
   */
  const showLoginSuccessNotice = () => {
    setTimeout(() => {
      ElNotification({
        title: '登录成功',
        type: 'success',
        duration: 2500,
        zIndex: 10000,
        message: `欢迎回来，${siteBrandName.value}!`
      })
    }, 1000)
  }

  watch(
    () => [publicConfig.value.captchaEnabled, publicConfig.value.captchaType],
    () => {
      if (isImageCaptchaEnabled.value) {
        loadCaptcha()
      } else {
        captchaSvg.value = ''
        formData.captchaId = ''
        formData.captchaCode = ''
      }

      resetSliderVerify()
    },
    { immediate: true }
  )
</script>

<style scoped>
  @import './style.css';
</style>
