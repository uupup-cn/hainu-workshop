<template>
  <ElDialog
    v-model="visible"
    class="project-intro-dialog"
    modal-class="project-intro-dialog__overlay"
    width="920px"
    header-class="h-10"
    body-class="relative z-0 !p-0"
    footer-class="border-t border-[color-mix(in_srgb,var(--art-gray-900)_6%,var(--default-border))] px-6 py-4 max-[640px]:px-[18px] max-[640px]:py-3.5"
    :append-to-body="true"
    :show-close="true"
    :close-on-click-modal="false"
    :align-center="true"
    @close="persistDismissed"
  >
    <section
      class="flex h-[min(644px,calc(100vh-144px))] flex-col text-g-900"
      aria-label="项目介绍弹窗"
    >
      <ElScrollbar class="min-h-0 flex-1" wrap-class="!overflow-x-hidden" :native="false">
        <div class="pb-4 px-3">
          <header
            :class="[
              panelClass,
              'mb-4 px-[18px] pt-[18px] pb-4 max-[640px]:mb-3.5 max-[640px]:px-4 max-[640px]:pt-4 max-[640px]:pb-3.5'
            ]"
          >
            <div class="mb-4 flex items-center justify-between gap-4 max-[860px]:block">
              <p class="m-0 text-xs font-bold tracking-[0.08em] text-g-500 uppercase">项目介绍</p>
              <div
                class="ml-auto flex shrink-0 flex-wrap justify-end gap-2 max-[860px]:mt-3 max-[860px]:justify-start"
              >
                <span
                  v-for="(pillar, index) in pillars"
                  :key="`${pillar.label}-${visible ? 'open' : 'closed'}`"
                  :style="`--pillar-index: ${index}`"
                  :class="[
                    'project-intro-pill rounded-full border px-2.5 py-[5px] text-xs font-semibold',
                    pillar.className
                  ]"
                >
                  {{ pillar.label }}
                </span>
              </div>
            </div>

            <h2
              class="m-0 max-w-[760px] text-[clamp(20px,2.4vw,28px)] leading-[1.22] font-semibold tracking-[-0.02em] text-g-900"
            >
              你见过的后台，大多数差不多 —— 但这个不一样
            </h2>
            <p class="mt-2.5 mb-0 text-sm leading-[1.8] text-g-700 max-[640px]:text-[13px]">
              我们对比了市面上大量主流后台系统后发现：功能也许越来越接近，但真正能让人一眼感受到专业度与品质感的产品并不多。Art
              Design Pro X
              从第一个组件开始，就按照产品级视觉标准持续打磨，在统一性、精致度与整体体验上，明显区别于常见后台方案。
            </p>

            <div
              class="mt-3.5 flex flex-wrap gap-x-4 gap-y-2 border-t border-[color-mix(in_srgb,var(--art-gray-900)_6%,var(--default-border))] pt-3 max-[640px]:gap-x-3.5 max-[640px]:gap-y-2.5"
            >
              <span
                v-for="fact in headerFacts"
                :key="fact.label"
                class="flex items-center gap-2 text-[13px] text-g-600"
              >
                <i :class="['size-1 rounded-full', fact.dotClass]" aria-hidden="true"></i>
                {{ fact.label }}
              </span>
            </div>
          </header>

          <section class="mb-3.5 grid grid-cols-2 gap-3.5 max-[860px]:grid-cols-1">
            <article :class="panelClass">
              <div class="flex items-start gap-3">
                <span :class="[iconWrapClass, 'bg-[#5b8def]/10 text-[#4d79d8]']">
                  <ArtSvgIcon icon="ri:book-open-line" />
                </span>
                <div>
                  <p :class="capabilityTitleClass">为什么选择 Ci-Yuu-Plus</p>
                  <p :class="capabilitySummaryClass">不止功能完整，更在设计与体验上真正拉开差距</p>
                </div>
              </div>
              <p :class="[paragraphClass, 'mt-3.5']">
                市面上不缺后台系统，缺的是一套真正兼顾设计、体验与交付效率的产品。很多系统功能不少，但界面普通、风格不统一，客户第一眼很难感受到专业度与价值感。
              </p>
              <p :class="[paragraphClass, 'mt-2.5']">
                Ci-Yuu-Plus
                想解决的，不只是后台搭建问题，更是项目呈现、品牌表达与长期使用体验的问题。它让你的系统从“只是能用”，走向“更高级、更完整、更容易被认可”。
              </p>
            </article>

            <article :class="panelClass">
              <div class="flex items-start gap-3">
                <span :class="[iconWrapClass, 'bg-[#ff6f91]/10 text-[#d9577a]']">
                  <ArtSvgIcon icon="ri:sparkling-line" />
                </span>
                <div>
                  <p :class="capabilityTitleClass">你真正得到什么</p>
                  <p :class="capabilitySummaryClass">不是多几个功能，而是整体价值感的提升</p>
                </div>
              </div>
              <ul class="mt-3.5 grid gap-2.5">
                <li
                  v-for="line in manifestoLines"
                  :key="line"
                  class="flex gap-2.5 text-sm leading-[1.75] text-g-700 max-[640px]:text-[13px]"
                >
                  <span class="mt-[9px] size-[5px] shrink-0 rounded-full bg-[#ff6f91]"></span>
                  <span>{{ line }}</span>
                </li>
              </ul>
            </article>
          </section>

          <section class="grid grid-cols-2 gap-3.5 max-[860px]:grid-cols-1">
            <article v-for="capability in capabilities" :key="capability.title" :class="panelClass">
              <div class="flex items-start gap-3">
                <span :class="[iconWrapClass, capability.iconClass]">
                  <ArtSvgIcon :icon="capability.icon" />
                </span>
                <div>
                  <p :class="capabilityTitleClass">{{ capability.title }}</p>
                  <p :class="capabilitySummaryClass">{{ capability.summary }}</p>
                </div>
              </div>

              <ul class="mt-3.5">
                <li
                  v-for="point in capability.points"
                  :key="point"
                  class="mt-[7px] flex gap-2.5 text-[13px] leading-[1.7] text-g-700 first:mt-0 max-[640px]:text-[13px]"
                >
                  <span
                    :class="['mt-2 size-1 shrink-0 rounded-full', capability.dotClass]"
                    aria-hidden="true"
                  ></span>
                  <span>{{ point }}</span>
                </li>
              </ul>
            </article>
          </section>
        </div>
      </ElScrollbar>
    </section>

    <template #footer>
      <div class="flex items-center justify-end gap-3 max-[640px]:[&_.el-button]:w-full">
        <ElButton @click="openBilibili">
          <ArtSvgIcon icon="ri:bilibili-line" class="size-4 mr-1.5" />
          视频介绍
        </ElButton>
        <ElButton type="primary" @click="visible = false">开始体验</ElButton>
      </div>
    </template>
  </ElDialog>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { useUserStore } from '@/store/modules/user'
  import { isCommercialEntryEnabled } from '@/hooks/core/useCommercial'

  defineOptions({ name: 'ArtProjectIntroDialog' })

  interface ProjectIntroDialogProps {
    autoOpen?: boolean
    persistOnClose?: boolean
  }

  interface ProjectIntroOpenOptions {
    persistOnClose?: boolean
  }

  interface CapabilityItem {
    icon: string
    iconClass: string
    dotClass: string
    title: string
    summary: string
    points: string[]
  }

  interface ColorLabel {
    label: string
    className?: string
    dotClass?: string
  }

  const props = withDefaults(defineProps<ProjectIntroDialogProps>(), {
    autoOpen: true,
    persistOnClose: true
  })

  const userStore = useUserStore()
  const settingStore = useSettingStore()
  const visible = ref(false)
  const dismissed = ref(false)
  const shouldPersistOnClose = ref(props.persistOnClose)
  const AUTO_OPEN_DELAY = 1500
  let autoOpenTimer: number | undefined

  const panelClass =
    'rounded-[calc(var(--custom-radius)+6px)] border border-[var(--default-border)] bg-box px-[18px] py-4'
  const iconWrapClass = 'flex size-12 shrink-0 items-center justify-center rounded-2xl text-[22px]'
  const capabilityTitleClass = 'm-0 text-base font-bold text-g-900'
  const capabilitySummaryClass =
    'mt-0.5 mb-0 text-[13px] leading-[1.4] text-g-600 max-[640px]:text-[13px]'
  const paragraphClass = 'mb-0 text-sm leading-[1.8] text-g-700 max-[640px]:text-[13px]'

  const pillars: ColorLabel[] = [
    {
      label: '产品级设计美学',
      className: 'border-[#5b8def]/[0.16] bg-[#5b8def]/[0.08] text-[#4d79d8]'
    },
    {
      label: '高级主题设计器',
      className: 'border-[#20b8a5]/[0.16] bg-[#20b8a5]/[0.08] text-[#168c80]'
    },
    {
      label: '前后端分离',
      className: 'border-[#f4a261]/[0.18] bg-[#f4a261]/[0.09] text-[#ca7443]'
    },
    {
      label: 'AI 代码生成器',
      className: 'border-[#7c6df0]/[0.18] bg-[#7c6df0]/[0.09] text-[#6754d8]'
    },
    {
      label: '移动端卡片表格',
      className: 'border-[#2fb7e8]/[0.18] bg-[#2fb7e8]/[0.09] text-[#2094c5]'
    },
    {
      label: '开箱即用',
      className: 'border-[#6bbf59]/[0.18] bg-[#6bbf59]/[0.09] text-[#4c9541]'
    }
  ]

  const headerFacts: ColorLabel[] = [
    { label: '演示更有质感', dotClass: 'bg-[#5b8def]' },
    { label: '定制更省时间', dotClass: 'bg-[#20b8a5]' },
    { label: '页面复用更快', dotClass: 'bg-[#f4a261]' },
    { label: '交付链路更完整', dotClass: 'bg-[#6bbf59]' }
  ]

  const manifestoLines = [
    '让客户更快感受到系统的专业度与品质感',
    '主题能力完善，定制更轻松，适配不同项目场景',
    '仪表盘、组件与页面能力丰富，减少重复开发',
    '前后端集成更顺畅，帮助团队更快落地项目',
    '不只是把系统做出来，更让交付结果看起来更专业'
  ]

  const capabilities: CapabilityItem[] = [
    {
      icon: 'ri:palette-line',
      iconClass: 'bg-[#8f6be8]/10 text-[#7a55ce]',
      dotClass: 'bg-[#8f6be8]',
      title: '设计层级：从底层建立更高完成度',
      summary: '不是简单换肤，而是从视觉语言到细节体验的整体提升。',
      points: [
        '对色彩体系、间距节奏、组件形态与页面层级进行系统化设计，整体观感更统一、更耐看。',
        '组件细节持续打磨，阴影、圆角、状态反馈与过渡表现更自然，减少常见后台的粗糙感。',
        '统一的视觉语言贯穿全局，让系统在演示、交付与长期使用中都更显专业与稳定。'
      ]
    },
    {
      icon: 'ri:magic-line',
      iconClass: 'bg-[#2fb7e8]/10 text-[#2094c5]',
      dotClass: 'bg-[#2fb7e8]',
      title: '高级主题设计器：让品牌表达更完整',
      summary: '不只是调整颜色，而是让整套系统风格保持一致。',
      points: [
        '内置完整主题能力，覆盖色彩、圆角、菜单风格、图表配色与界面层次等关键部分。',
        '无需频繁修改样式代码，也能快速生成更贴合品牌调性的系统界面。',
        '页面与组件可自然继承主题设定，减少重复调整成本，让定制与扩展更高效。'
      ]
    },
    {
      icon: 'ri:dashboard-line',
      iconClass: 'bg-[#7c6df0]/10 text-[#6754d8]',
      dotClass: 'bg-[#7c6df0]',
      title: '丰富仪表盘：覆盖更多业务展示场景',
      summary: '从数据概览到业务监控，常见场景开箱即用。',
      points: [
        '内置多套仪表盘方案，覆盖数据概览、运营分析、业务监控等高频展示场景。',
        '图表、指标、趋势、列表与快捷入口组合完整，兼顾演示效果与真实业务使用。',
        '页面结构与视觉层级已预先打磨，减少从零搭建 dashboard 的时间成本。'
      ]
    },
    {
      icon: 'ri:layout-grid-line',
      iconClass: 'bg-[#f2a23a]/12 text-[#c87927]',
      dotClass: 'bg-[#f2a23a]',
      title: '高效页面工具：让常规业务页开发更快',
      summary: '常用能力封装更完整，减少重复开发与状态处理成本。',
      points: [
        '表格、表单、搜索等核心能力组合完善，常见业务页面可快速搭建。',
        '搜索、分页、列配置、刷新与弹窗表单等交互模式具备成熟方案，开发流程更顺畅。',
        '在现有组件能力之上完成系统化视觉整合，让页面开发表现更统一、更省心。'
      ]
    },
    {
      icon: 'ri:code-box-line',
      iconClass: 'bg-[#4f9cf5]/10 text-[#337fd3]',
      dotClass: 'bg-[#4f9cf5]',
      title: '完整前端工程体系：从体验到扩展都更成熟',
      summary: '不只是页面表现出色，前端基础能力也为真实项目交付做好了准备。',
      points: [
        '基于 Vue 3、TypeScript、Element Plus、Pinia、Vue Router 与 Vite 构建，整体开发体验稳定高效。',
        '动态路由、动态菜单、权限校验、Token 刷新与状态持久化等核心能力已完整集成。',
        '主题、国际化、异常处理、表格体系与业务模块协同设计，让项目扩展与二次开发更顺畅。'
      ]
    },
    {
      icon: 'ri:shield-keyhole-line',
      iconClass: 'bg-[#45c18f]/12 text-[#2f9a70]',
      dotClass: 'bg-[#45c18f]',
      title: '前后端一体化，权限与模块全覆盖',
      summary: '不只是前端好看，后端基础设施也一起备齐。',
      points: [
        'RBAC 权限体系覆盖菜单、按钮、数据与接口等关键层级，满足常见企业场景使用需求。',
        '后端基于 NestJS + Prisma 构建，内置用户、角色、日志、通知、工作流、商城等核心模块。',
        '前后端协同设计，减少重复搭建基础设施的成本，让项目可以更快进入真实业务开发。'
      ]
    }
  ]

  function hasDismissed() {
    return settingStore.projectIntroDismissed
  }

  function persistDismissed() {
    if (!shouldPersistOnClose.value) {
      shouldPersistOnClose.value = props.persistOnClose
      return
    }

    if (dismissed.value) {
      return
    }

    settingStore.setProjectIntroDismissed(true)
    dismissed.value = true
    shouldPersistOnClose.value = props.persistOnClose
  }

  function openBilibili() {}

  function open(options?: ProjectIntroOpenOptions) {
    shouldPersistOnClose.value = options?.persistOnClose ?? props.persistOnClose
    visible.value = true
  }

  function close() {
    visible.value = false
  }

  function openIfNeeded() {
    if (!isCommercialEntryEnabled()) {
      return
    }
    if (!userStore.isLogin || visible.value) {
      return
    }

    dismissed.value = hasDismissed()
    if (dismissed.value) {
      return
    }

    visible.value = true
  }

  function clearAutoOpenTimer() {
    if (!autoOpenTimer) {
      return
    }

    window.clearTimeout(autoOpenTimer)
    autoOpenTimer = undefined
  }

  function scheduleOpenIfNeeded() {
    clearAutoOpenTimer()
    autoOpenTimer = window.setTimeout(() => {
      autoOpenTimer = undefined
      openIfNeeded()
    }, AUTO_OPEN_DELAY)
  }

  onMounted(() => {
    if (props.autoOpen) {
      scheduleOpenIfNeeded()
    }
  })

  watch(
    () => userStore.isLogin,
    (loggedIn) => {
      if (props.autoOpen && loggedIn) {
        scheduleOpenIfNeeded()
        return
      }

      clearAutoOpenTimer()
    }
  )

  onUnmounted(() => {
    clearAutoOpenTimer()
  })

  defineExpose({
    open,
    close
  })
</script>

<style lang="scss" scoped>
  .project-intro-pill {
    opacity: 0;
    transform: translateY(-8px) scale(0.96);
    animation: project-intro-pill-enter 420ms cubic-bezier(0.22, 1, 0.36, 1) forwards;
    animation-delay: calc(var(--pillar-index) * 72ms + 120ms);
    will-change: transform, opacity;
  }

  @keyframes project-intro-pill-enter {
    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .project-intro-pill {
      opacity: 1;
      transform: none;
      animation: none;
    }
  }
</style>
