<!-- 注册页面 -->
<template>
  <div class="flex w-full h-screen bg-[var(--art-color)]">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('register.title') }}</h3>
          <p class="sub-title">{{ $t('register.subTitle') }}</p>
          <ElAlert
            v-if="!publicConfig.allowRegister"
            class="mt-5!"
            type="warning"
            :closable="false"
            title="当前站点暂未开放注册，请联系管理员开通账号。"
          />
          <ElForm
            class="mt-7.5"
            ref="formRef"
            :model="formData"
            :rules="rules"
            label-position="top"
            :key="formKey"
          >
            <ElFormItem prop="username">
              <ElInput
                class="custom-height"
                v-model.trim="formData.username"
                :placeholder="$t('register.placeholder.username')"
              />
            </ElFormItem>

            <ElFormItem prop="password">
              <ElInput
                class="custom-height"
                v-model.trim="formData.password"
                :placeholder="$t('register.placeholder.password')"
                type="password"
                autocomplete="off"
                show-password
              />
            </ElFormItem>

            <ElFormItem prop="confirmPassword">
              <ElInput
                class="custom-height"
                v-model.trim="formData.confirmPassword"
                :placeholder="$t('register.placeholder.confirmPassword')"
                type="password"
                autocomplete="off"
                @keyup.enter="register"
                show-password
              />
            </ElFormItem>

            <div class="mt-4">
              <ElButton
                class="w-full custom-height"
                type="primary"
                @click="register"
                :disabled="!publicConfig.allowRegister"
                :loading="loading"
                v-ripple
              >
                {{ $t('register.submitBtnText') }}
              </ElButton>
            </div>

            <div class="mt-5 text-sm text-g-600">
              <span>{{ $t('register.hasAccount') }}</span>
              <RouterLink class="text-theme" :to="{ name: 'Login' }">{{
                $t('register.toLogin')
              }}</RouterLink>
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
  import { fetchSignup } from '@/api/auth'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { resolveRequestErrorMessage, useLocaleFormKey } from '../shared'

  defineOptions({ name: 'Register' })

  interface RegisterForm {
    username: string
    password: string
    confirmPassword: string
  }

  const USERNAME_MIN_LENGTH = 3
  const USERNAME_MAX_LENGTH = 20
  const PASSWORD_MIN_LENGTH = 6
  const siteSettingsStore = useSiteSettingsStore()
  const { publicConfig } = storeToRefs(siteSettingsStore)
  const { t, locale } = useI18n()
  const router = useRouter()
  const formRef = ref<FormInstance>()
  const loading = ref(false)
  const { formKey } = useLocaleFormKey(locale)

  const formData = reactive<RegisterForm>({
    username: '',
    password: '',
    confirmPassword: ''
  })

  /**
   * 校验密码字段。
   * 当密码被更新且确认密码已有内容时，同步触发确认密码重新校验。
   */
  const validatePassword = (_rule: any, value: string, callback: (error?: Error) => void) => {
    if (!value) {
      callback(new Error(t('register.placeholder.password')))
      return
    }

    if (formData.confirmPassword) {
      formRef.value?.validateField('confirmPassword')
    }

    callback()
  }

  /**
   * 校验确认密码字段，确保两次输入一致。
   */
  const validateConfirmPassword = (
    _rule: any,
    value: string,
    callback: (error?: Error) => void
  ) => {
    if (!value) {
      callback(new Error(t('register.rule.confirmPasswordRequired')))
      return
    }

    if (value !== formData.password) {
      callback(new Error(t('register.rule.passwordMismatch')))
      return
    }

    callback()
  }

  /**
   * 生成注册表单校验规则。
   * 规则依赖国际化文案，因此通过计算属性在语言切换时自动刷新。
   */
  const rules = computed<FormRules<RegisterForm>>(() => ({
    username: [
      { required: true, message: t('register.placeholder.username'), trigger: 'blur' },
      {
        min: USERNAME_MIN_LENGTH,
        max: USERNAME_MAX_LENGTH,
        message: t('register.rule.usernameLength'),
        trigger: 'blur'
      }
    ],
    password: [
      { required: true, validator: validatePassword, trigger: 'blur' },
      { min: PASSWORD_MIN_LENGTH, message: t('register.rule.passwordLength'), trigger: 'blur' }
    ],
    confirmPassword: [{ required: true, validator: validateConfirmPassword, trigger: 'blur' }]
  }))

  /**
   * 执行注册表单校验。
   * 校验失败时返回 `false`，避免继续执行接口请求逻辑。
   */
  const validateRegisterForm = async () => {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  /**
   * 判断当前站点是否允许用户自行注册。
   * 未开放注册时直接终止提交流程，页面上的固定提示会承担引导职责。
   */
  const ensureRegisterAvailable = () => {
    if (publicConfig.value.allowRegister) {
      return true
    }

    return false
  }

  /**
   * 调用注册接口创建账号。
   */
  const submitRegisterRequest = async () => {
    await fetchSignup({
      username: formData.username,
      password: formData.password
    })
  }

  /**
   * 处理注册成功后的反馈与跳转。
   */
  const handleRegisterSuccess = () => {
    ElMessage.success(t('register.successMessage'))
    toLogin()
  }

  /**
   * 提交注册表单。
   * 仅在站点允许开放注册且表单通过校验时才会触发接口请求。
   */
  const register = async () => {
    if (!ensureRegisterAvailable()) return

    const isFormValid = await validateRegisterForm()
    if (!isFormValid) return

    try {
      loading.value = true
      await submitRegisterRequest()
      handleRegisterSuccess()
    } catch (error: unknown) {
      console.error('注册失败:', error)
      ElMessage.error(resolveRequestErrorMessage(error, t('register.failedMessage')))
    } finally {
      loading.value = false
    }
  }

  /**
   * 跳转到登录页面。
   */
  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style scoped>
  @import '../login/style.css';
</style>
