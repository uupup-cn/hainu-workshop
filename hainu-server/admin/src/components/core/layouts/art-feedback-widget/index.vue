<template>
  <div v-if="visible" class="pointer-events-none fixed inset-0 z-[1200]">
    <Transition
      enter-active-class="transition-opacity duration-220 ease-out [&_.feedback-panel]:transition-all [&_.feedback-panel]:duration-220 [&_.feedback-panel]:ease-out"
      enter-from-class="opacity-0 [&_.feedback-panel]:scale-[0.97] [&_.feedback-panel]:opacity-0"
      enter-to-class="opacity-100 [&_.feedback-panel]:scale-100 [&_.feedback-panel]:opacity-100"
      leave-active-class="transition-opacity duration-160 ease-in [&_.feedback-panel]:transition-all [&_.feedback-panel]:duration-160 [&_.feedback-panel]:ease-in"
      leave-from-class="opacity-100 [&_.feedback-panel]:scale-100 [&_.feedback-panel]:opacity-100"
      leave-to-class="opacity-0 [&_.feedback-panel]:scale-[0.985] [&_.feedback-panel]:opacity-0"
      @after-leave="handleAfterLeave"
    >
      <div
        v-if="expanded"
        class="pointer-events-auto fixed inset-0 flex items-center justify-end p-4 sm:p-6"
      >
        <div class="absolute inset-0" @click="handleCloseClick"></div>

        <div
          class="feedback-panel relative flex h-[min(820px,calc(100vh-64px))] max-h-[calc(100vh-64px)] w-[min(92vw,440px)] flex-col overflow-hidden rounded-[calc(var(--custom-radius))] border border-[var(--default-border)] bg-box shadow-[0_24px_60px_rgba(15,23,42,0.16)]"
          role="dialog"
          aria-modal="true"
          aria-labelledby="art-feedback-widget-title"
        >
          <div
            class="mx-4 mt-4 rounded-[calc(var(--custom-radius))] border border-[var(--default-border)] px-4 py-3"
            :style="{ background: panelBg }"
          >
            <div class="flex items-start justify-between gap-3">
              <div>
                <div id="art-feedback-widget-title" class="mt-2 text-base font-semibold text-g-900">
                  问题反馈
                </div>
                <p class="mt-1 text-sm leading-6 text-g-600">
                  欢迎提交功能建议或 Bug 反馈，帮助我们持续改进产品
                </p>
              </div>
            </div>
          </div>

          <div class="h-0 min-h-0 flex-1 overflow-hidden">
            <ElScrollbar class="h-full" height="100%">
              <div class="px-4 py-4">
                <ElForm ref="formRef" :model="form" :rules="rules" label-position="top">
                  <div class="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ElFormItem label="反馈类型" prop="type" class="mb-0">
                      <ElSelect v-model="form.type" placeholder="请选择类型">
                        <ElOption
                          v-for="item in typeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                    <ElFormItem label="紧急程度" prop="priority" class="mb-0">
                      <ElSelect v-model="form.priority" placeholder="请选择优先级">
                        <ElOption
                          v-for="item in priorityOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </div>

                  <ElFormItem label="问题标题" prop="title" class="mt-4 mb-0">
                    <ElInput
                      v-model.trim="form.title"
                      maxlength="150"
                      placeholder="一句话描述问题或建议"
                    />
                  </ElFormItem>

                  <ElFormItem label="详细描述" prop="content" class="mt-4 mb-0">
                    <ElInput
                      v-model.trim="form.content"
                      type="textarea"
                      :rows="4"
                      maxlength="5000"
                      show-word-limit
                      resize="none"
                      placeholder="请尽量写清楚触发步骤、现象、影响范围，方便我们快速复现和判断优先级"
                    />
                  </ElFormItem>

                  <ElFormItem label="你期望它如何表现" class="mt-4 mb-0">
                    <ElInput
                      v-model.trim="form.expectedBehavior"
                      type="textarea"
                      :rows="3"
                      maxlength="1000"
                      show-word-limit
                      resize="none"
                      placeholder="可选，写下你觉得更合理的结果或希望新增的能力"
                    />
                  </ElFormItem>

                  <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ElFormItem label="联系人" class="mb-0">
                      <ElInput
                        v-model.trim="form.contactName"
                        maxlength="50"
                        placeholder="姓名 / 昵称"
                      />
                    </ElFormItem>
                    <ElFormItem label="联系方式" class="mb-0">
                      <ElInput
                        v-model.trim="form.contact"
                        maxlength="100"
                        placeholder="手机号 / 微信 / 邮箱"
                      />
                    </ElFormItem>
                  </div>

                  <div class="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                    <ElFormItem label="发生频率" class="mb-0">
                      <ElSelect v-model="form.frequency" placeholder="请选择发生频率" clearable>
                        <ElOption
                          v-for="item in frequencyOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                    <ElFormItem label="影响范围" class="mb-0">
                      <ElSelect v-model="form.impactScope" placeholder="请选择影响范围" clearable>
                        <ElOption
                          v-for="item in impactScopeOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value"
                        />
                      </ElSelect>
                    </ElFormItem>
                  </div>

                  <div class="mt-4 rounded-custom-sm bg-[var(--default-bg-color)] px-4 py-3">
                    <div class="text-xs font-medium uppercase tracking-[0.16em] text-g-500">
                      自动附带上下文
                    </div>
                    <div class="mt-2 space-y-1 text-xs leading-6 text-g-600">
                      <div class="truncate">页面：{{ currentPageTitle }}</div>
                      <div class="truncate">路径：{{ route.fullPath }}</div>
                      <div>
                        环境：{{ runtimeContext.browser }} / {{ runtimeContext.os }} /
                        {{ runtimeContext.deviceType }}
                      </div>
                      <div>视口：{{ viewportContext }}</div>
                    </div>
                  </div>
                </ElForm>
              </div>
            </ElScrollbar>
          </div>

          <div
            class="flex items-center justify-end gap-3 border-t border-[var(--default-border)] bg-box px-4 py-4"
          >
            <ElButton v-if="hasDirtyFields || hasDraft" text @click="handleResetDraft">
              清空草稿
            </ElButton>
            <ElButton @click="handleCloseClick">稍后再说</ElButton>
            <ElButton type="primary" :loading="submitting" @click="handleSubmit">提交反馈</ElButton>
          </div>
        </div>
      </div>
    </Transition>

    <button
      v-if="showTrigger && !expanded"
      class="pointer-events-auto fixed flex size-13 cursor-pointer items-center justify-center rounded-full border border-[var(--default-border)] bg-box text-g-800 shadow-[0_16px_32px_rgba(15,23,42,0.14)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.18)]"
      :style="triggerStyle"
      type="button"
      aria-label="打开反馈面板"
      title="问题反馈"
      @click="openPanel"
    >
      <span
        class="flex size-10 items-center justify-center rounded-full text-white"
        :style="{
          background: 'linear-gradient(135deg, var(--color-primary), var(--color-secondary))'
        }"
      >
        <ArtSvgIcon icon="ri:customer-service-2-line" />
      </span>
    </button>
  </div>
</template>

<script setup lang="ts">
  import type { FormInstance, FormRules } from 'element-plus'
  import { useEventListener } from '@vueuse/core'
  import { storeToRefs } from 'pinia'
  import { useRoute } from 'vue-router'
  import { fetchCreateFeedback } from '@/api/feedback'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'
  import { useSettingStore } from '@/store/modules/setting'
  import { StorageConfig } from '@/utils/storage/storage-config'
  import { useUserStore } from '@/store/modules/user'

  defineOptions({ name: 'ArtFeedbackWidget' })

  interface FeedbackWidgetForm extends Api.Interaction.FeedbackPayload {
    frequency?: string
    impactScope?: string
  }

  const route = useRoute()
  const userStore = useUserStore()
  const siteSettingsStore = useSiteSettingsStore()
  const settingStore = useSettingStore()
  const { isRtl } = storeToRefs(settingStore)

  const FEEDBACK_DRAFT_KEY = StorageConfig.generateStorageKey('feedback-draft')

  const expanded = ref(false)
  const showTrigger = ref(true)
  const submitting = ref(false)
  const hasDraft = ref(false)
  const formRef = ref<FormInstance>()
  const currentPageTitle = computed(() =>
    String(route.meta.title || document.title || '未命名页面')
  )
  const viewportContext = computed(() =>
    typeof window === 'undefined' ? '-' : `${window.innerWidth} x ${window.innerHeight}`
  )

  const visible = computed(
    () =>
      userStore.isLogin &&
      siteSettingsStore.feedbackEnabled &&
      !String(route.path).startsWith('/login')
  )

  const panelBg =
    'linear-gradient(135deg, color-mix(in srgb, var(--color-primary) 7%, transparent), color-mix(in srgb, var(--color-secondary) 9%, transparent))'

  const triggerStyle = computed(() => ({
    bottom: '1.5rem',
    [isRtl.value ? 'left' : 'right']: '1.25rem'
  }))

  const typeOptions = [
    { label: '功能建议', value: 'FEATURE' },
    { label: 'Bug 反馈', value: 'BUG' },
    { label: '体验问题', value: 'UX' },
    { label: '性能问题', value: 'PERFORMANCE' },
    { label: '其他', value: 'OTHER' }
  ]

  const priorityOptions = [
    { label: '低', value: 'LOW' },
    { label: '中', value: 'MEDIUM' },
    { label: '高', value: 'HIGH' },
    { label: '紧急', value: 'URGENT' }
  ]

  const frequencyOptions = [
    { label: '偶发', value: 'OCCASIONAL' },
    { label: '经常出现', value: 'FREQUENT' },
    { label: '稳定复现', value: 'ALWAYS' }
  ]

  const impactScopeOptions = [
    { label: '仅自己', value: 'SELF' },
    { label: '小范围用户', value: 'PARTIAL' },
    { label: '核心流程 / 大范围用户', value: 'GLOBAL' }
  ]

  const form = reactive<FeedbackWidgetForm>(createDefaultForm())

  const hasDirtyFields = computed(() => {
    const defaultForm = createDefaultForm()
    return Object.entries(defaultForm).some(
      ([key, value]) => form[key as keyof FeedbackWidgetForm] !== value
    )
  })

  const rules: FormRules = {
    type: [{ required: true, message: '请选择反馈类型', trigger: 'change' }],
    priority: [{ required: true, message: '请选择紧急程度', trigger: 'change' }],
    title: [
      { required: true, message: '请输入问题标题', trigger: 'blur' },
      { min: 2, max: 150, message: '问题标题长度需为 2-150 个字符', trigger: 'blur' }
    ],
    content: [
      { required: true, message: '请填写详细描述', trigger: 'blur' },
      { min: 5, max: 5000, message: '详细描述长度需为 5-5000 个字符', trigger: 'blur' }
    ],
    contact: [{ validator: validateContact, trigger: 'blur' }]
  }

  const runtimeContext = computed(() => parseRuntimeContext())

  watch(
    () => visible.value,
    (nextVisible) => {
      if (!nextVisible) {
        closePanel(true)
      }
    }
  )

  watch(
    () => route.fullPath,
    () => {
      if (expanded.value) {
        persistDraft()
      }
    }
  )

  watch(
    form,
    () => {
      if (!expanded.value) return
      persistDraft()
    },
    { deep: true }
  )

  useEventListener(window, 'keydown', handleWindowKeydown)

  /**
   * 创建默认表单数据，统一初始化与重置逻辑。
   */
  function createDefaultForm(): FeedbackWidgetForm {
    return {
      type: 'FEATURE',
      priority: 'MEDIUM',
      title: '',
      content: '',
      expectedBehavior: '',
      contactName: String(userStore.info?.realName || userStore.info?.nickName || ''),
      contact: String(userStore.info?.email || ''),
      frequency: '',
      impactScope: ''
    }
  }

  /**
   * 校验联系方式格式，允许手机号、邮箱和常见 IM 标识。
   */
  function validateContact(_: unknown, value: string, callback: (error?: Error) => void) {
    const normalizedValue = String(value || '').trim()
    if (!normalizedValue) {
      callback()
      return
    }

    const isPhone = /^1\d{10}$/.test(normalizedValue)
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedValue)
    const isImId = /^[a-zA-Z0-9_\-@.]{5,100}$/.test(normalizedValue)

    if (isPhone || isEmail || isImId) {
      callback()
      return
    }

    callback(new Error('请输入有效的手机号、邮箱或 IM 联系方式'))
  }

  /**
   * 解析当前终端环境，避免反馈上下文出现错误归类。
   */
  function parseRuntimeContext() {
    const ua = navigator.userAgent.toLowerCase()
    const deviceType = /iphone|ipad|android|mobile/.test(ua) ? 'mobile' : 'pc'

    let browser = 'Unknown'
    if (ua.includes('micromessenger')) browser = 'WeChat'
    else if (ua.includes('edg/')) browser = 'Edge'
    else if (ua.includes('firefox/')) browser = 'Firefox'
    else if (ua.includes('safari/') && !ua.includes('chrome/')) browser = 'Safari'
    else if (ua.includes('chrome/')) browser = 'Chrome'

    let os = 'Unknown'
    if (ua.includes('windows')) os = 'Windows'
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS'
    else if (ua.includes('android')) os = 'Android'
    else if (ua.includes('mac os')) os = 'macOS'
    else if (ua.includes('linux')) os = 'Linux'

    return { browser, os, deviceType }
  }

  /**
   * 生成稳定的草稿存储键，支持多用户隔离。
   */
  function getDraftStorageKey() {
    return `${FEEDBACK_DRAFT_KEY}-${userStore.info?.id || 'guest'}`
  }

  /**
   * 将当前表单收敛为可提交的干净数据，避免提交冗余空字符串。
   */
  function buildNormalizedForm() {
    return {
      ...form,
      title: form.title.trim(),
      content: form.content.trim(),
      expectedBehavior: form.expectedBehavior?.trim() || undefined,
      contactName: form.contactName?.trim() || undefined,
      contact: form.contact?.trim() || undefined,
      frequency: undefined,
      impactScope: undefined
    }
  }

  /**
   * 序列化并持久化草稿，保证用户关闭面板后内容可恢复。
   */
  function persistDraft() {
    const normalizedForm = buildNormalizedForm()

    if (!hasDirtyFields.value) {
      clearDraft()
      return
    }

    localStorage.setItem(
      getDraftStorageKey(),
      JSON.stringify({
        ...normalizedForm,
        frequency: form.frequency || undefined,
        impactScope: form.impactScope || undefined,
        updatedAt: new Date().toISOString(),
        routePath: route.fullPath
      })
    )
    hasDraft.value = true
  }

  /**
   * 从本地恢复草稿，并在必要时给用户可感知的提示。
   */
  function restoreDraft() {
    const rawDraft = localStorage.getItem(getDraftStorageKey())
    if (!rawDraft) {
      hasDraft.value = false
      return
    }

    try {
      const parsedDraft = JSON.parse(rawDraft) as Partial<FeedbackWidgetForm>
      Object.assign(form, createDefaultForm(), parsedDraft)
      hasDraft.value = true
    } catch {
      clearDraft()
    }
  }

  /**
   * 清理本地草稿，避免历史数据影响后续反馈提交。
   */
  function clearDraft() {
    localStorage.removeItem(getDraftStorageKey())
    hasDraft.value = false
  }

  /**
   * 将表单恢复到初始状态，并同步清理校验与草稿。
   */
  function resetFormState() {
    Object.assign(form, createDefaultForm())
    formRef.value?.clearValidate()
    clearDraft()
  }

  /**
   * 打开面板并尝试恢复草稿，保证用户回到填写现场时上下文完整。
   */
  function openPanel() {
    showTrigger.value = false
    restoreDraft()
    expanded.value = true
  }

  /**
   * 关闭面板并保留草稿；在强制关闭场景下跳过额外处理。
   */
  function closePanel(force = false) {
    if (!force && hasDirtyFields.value) {
      persistDraft()
    }
    expanded.value = false
  }

  /**
   * 响应界面上的关闭操作，统一走非强制关闭逻辑。
   */
  function handleCloseClick() {
    closePanel()
  }

  /**
   * 面板关闭动画结束后重新展示悬浮入口，保持触发器状态一致。
   */
  function handleAfterLeave() {
    showTrigger.value = true
  }

  /**
   * 处理全局快捷键，提升高频反馈场景下的录入效率。
   */
  function handleWindowKeydown(event: KeyboardEvent) {
    if (!expanded.value) return

    if (event.key === 'Escape') {
      closePanel()
      return
    }

    if ((event.ctrlKey || event.metaKey) && event.key === 'Enter' && !submitting.value) {
      void handleSubmit()
    }
  }

  /**
   * 主动清空草稿，适用于用户确认放弃当前输入内容的场景。
   */
  function handleResetDraft() {
    resetFormState()
  }

  /**
   * 提交反馈表单，并补充完整上下文元数据供后台分流与排障使用。
   */
  async function handleSubmit() {
    const valid = await formRef.value?.validate().catch(() => false)
    if (!valid) return

    submitting.value = true
    try {
      const normalizedForm = buildNormalizedForm()
      await fetchCreateFeedback({
        ...normalizedForm,
        pageTitle: currentPageTitle.value,
        pagePath: route.fullPath,
        pageUrl: window.location.href,
        browser: runtimeContext.value.browser,
        os: runtimeContext.value.os,
        deviceType: runtimeContext.value.deviceType,
        extra: {
          frequency: form.frequency || undefined,
          impactScope: form.impactScope || undefined,
          routeName: String(route.name || ''),
          routeMetaTitle: String(route.meta.title || ''),
          viewport: viewportContext.value,
          submittedAt: new Date().toISOString(),
          userId: userStore.info?.id,
          username: userStore.info?.username,
          referrer: document.referrer || undefined
        }
      })

      resetFormState()
      closePanel()
    } finally {
      submitting.value = false
    }
  }
</script>
