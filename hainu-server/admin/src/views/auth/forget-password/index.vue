<template>
  <div class="flex w-full h-screen bg-[var(--art-color)]">
    <LoginLeftView />

    <div class="relative flex-1">
      <AuthTopBar />

      <div class="auth-right-wrap">
        <div class="form">
          <h3 class="title">{{ $t('forgetPassword.title') }}</h3>
          <p class="sub-title">{{ $t('forgetPassword.subTitle') }}</p>
          <ElForm ref="formRef" class="mt-6" :model="formData" :rules="rules" :key="formKey">
            <ElFormItem prop="email">
              <ElInput
                v-model.trim="formData.email"
                class="custom-height"
                :placeholder="$t('forgetPassword.placeholder')"
                @keyup.enter="handleSubmit"
              />
            </ElFormItem>

            <div class="mt-4">
              <ElButton class="w-full custom-height" type="primary" @click="handleSubmit" v-ripple>
                {{ $t('forgetPassword.submitBtnText') }}
              </ElButton>
            </div>

            <div class="mt-4">
              <ElButton class="w-full custom-height" plain @click="toLogin">
                {{ $t('forgetPassword.backBtnText') }}
              </ElButton>
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
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { ElMessage } from 'element-plus'
  import type { FormInstance, FormRules } from 'element-plus'
  import { useI18n } from 'vue-i18n'
  import { useLocaleFormKey } from '../shared'

  defineOptions({ name: 'ForgetPassword' })

  interface ForgetPasswordForm {
    email: string
  }

  const router = useRouter()
  const siteSettingsStore = useSiteSettingsStore()
  const { publicConfig } = storeToRefs(siteSettingsStore)
  const { t, locale } = useI18n()
  const { formKey } = useLocaleFormKey(locale)
  const formRef = ref<FormInstance>()
  const formData = reactive<ForgetPasswordForm>({
    email: ''
  })

  /**
   * 生成找回密码表单校验规则。
   * 当前页尚未接入真实接口，因此先保证输入项与提示文案规范完整。
   */
  const rules = computed<FormRules<ForgetPasswordForm>>(() => ({
    email: [{ required: true, message: t('forgetPassword.rule.required'), trigger: 'blur' }]
  }))

  /**
   * 执行找回密码表单校验。
   * 校验失败时直接返回 `false`，避免继续执行提示逻辑。
   */
  const validateForgetPasswordForm = async () => {
    if (!formRef.value) return false

    try {
      await formRef.value.validate()
      return true
    } catch {
      return false
    }
  }

  /**
   * 根据站点配置生成支持联系方式文案。
   * 当前项目未提供在线找回密码接口，因此统一给出可执行的人工处理指引。
   */
  const getSupportMessage = () => {
    if (publicConfig.value.supportEmail) {
      return t('forgetPassword.contactByEmail', { contact: publicConfig.value.supportEmail })
    }

    if (publicConfig.value.supportPhone) {
      return t('forgetPassword.contactByPhone', { contact: publicConfig.value.supportPhone })
    }

    return t('forgetPassword.contactSupport')
  }

  /**
   * 提交找回密码表单。
   * 在未接入后端接口前，页面将提供明确的人工支持引导，方便后续平滑接入真实流程。
   */
  const handleSubmit = async () => {
    const isFormValid = await validateForgetPasswordForm()
    if (!isFormValid) return

    ElMessage.info(getSupportMessage())
  }

  /**
   * 返回登录页面。
   */
  const toLogin = () => {
    router.push({ name: 'Login' })
  }
</script>

<style scoped>
  @import '../login/style.css';
</style>
