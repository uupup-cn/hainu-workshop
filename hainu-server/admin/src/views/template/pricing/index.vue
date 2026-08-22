<template>
  <div class="page-content mb-5">
    <div class="mx-auto max-w-[1220px] pb-5">
      <section class="mx-auto mt-6 mb-10 max-w-[760px] text-center">
        <span class="inline-flex bg-primary/12 text-primary px-3 py-1 text-xs rounded-full">
          定价方案
        </span>
        <h1 class="mt-3 text-[clamp(24px,3vw,34px)] font-semibold leading-[1.15] text-g-900">
          选择适合您项目的授权方案
        </h1>
        <p
          class="mx-auto mt-4 max-w-[680px] text-base leading-8 text-g-600 max-sm:text-sm max-sm:leading-7"
        >
          {{ siteBrandName }} 给客户更好的体验，给老板更好的结果，给自己更好的作品
        </p>
        <div class="mt-6 flex justify-center">
          <ElButton
            class="!h-10 !rounded-full !px-5 !text-sm"
            plain
            type="primary"
            v-ripple
            @click="openProductIntroDialog"
          >
            <span class="inline-flex items-center gap-2">
              产品介绍
              <ArtSvgIcon icon="ri:arrow-right-line" class="text-base" />
            </span>
          </ElButton>
        </div>
      </section>

      <section class="grid grid-cols-3 gap-6 max-xl:gap-5 max-lg:grid-cols-1">
        <article v-for="plan in pricingPlans" :key="plan.type" class="group relative pt-3">
          <div
            v-if="plan.recommended"
            class="absolute left-1/2 top-0 z-20 inline-flex -translate-x-1/2 rounded-custom-xs bg-black px-5 py-1 text-sm text-white dark:bg-white dark:text-black"
          >
            优先推荐
          </div>

          <div
            class="relative flex h-full flex-col overflow-hidden rounded-custom-sm border border-[var(--default-border)] bg-box px-8 pb-8 pt-8 shadow-[0_18px_50px_rgba(15,23,42,0.04)] transition-shadow duration-300 hover:shadow-[0_26px_64px_rgba(15,23,42,0.07)] max-sm:px-5 max-sm:pb-5 max-sm:pt-6"
            :class="plan.cardClass"
          >
            <div
              class="pointer-events-none absolute inset-x-0 top-0 h-56"
              :class="plan.gradientClass"
            ></div>

            <div class="relative z-1 flex items-start justify-between gap-4">
              <div
                class="flex h-12 w-12 items-center justify-center rounded-full"
                :class="plan.iconWrapClass"
              >
                <ArtSvgIcon :icon="plan.icon" class="text-base" :class="plan.iconClass" />
              </div>
            </div>

            <div class="relative z-1 mt-6 flex flex-1 flex-col">
              <h2 class="text-[22px] font-semibold leading-8 text-g-900">{{ plan.title }}</h2>
              <p class="mt-3 min-h-16 text-sm leading-7 text-g-700 max-lg:min-h-0">
                {{ plan.description }}
              </p>

              <div class="mt-2">
                <div class="text-sm font-semibold text-g-800">{{ plan.priceCaption }}</div>
                <div
                  class="mt-2 grid min-h-[40px] grid-cols-[minmax(0,auto)_1fr] items-end gap-x-3"
                >
                  <span
                    class="break-keep text-[clamp(28px,2.8vw,40px)] font-semibold leading-none tracking-[-0.04em] text-g-900"
                    :class="plan.priceDisplayClass"
                  >
                    {{ plan.priceDisplay }}
                  </span>
                  <span class="pb-1 text-sm font-medium leading-6 text-g-700">
                    {{ plan.priceSuffix }}
                  </span>
                </div>
                <div
                  v-if="plan.priceTags.length"
                  class="mt-2 flex min-h-[18px] flex-wrap gap-x-4 gap-y-2 text-sm leading-6 text-g-600"
                >
                  <span v-for="item in plan.priceTags" :key="`${plan.type}-${item.label}`">
                    {{ item.label }} {{ item.value }}
                  </span>
                </div>
              </div>

              <div class="my-6 h-px bg-gradient-to-r from-g-300/90 to-g-300/20"></div>

              <div class="space-y-2.5">
                <div
                  v-for="(feature, index) in plan.features"
                  :key="index"
                  class="flex items-start gap-3 text-sm leading-7 text-g-900"
                >
                  <span
                    class="mt-1 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-success/12 dark:bg-success/18"
                  >
                    <ArtSvgIcon icon="ri:check-fill" class="text-[14px] text-success" />
                  </span>
                  <span>{{ feature }}</span>
                </div>
              </div>

              <div v-if="plan.restrictions.length" class="mt-2.5 space-y-2.5">
                <div
                  v-for="(restriction, index) in plan.restrictions"
                  :key="index"
                  class="flex items-start gap-3 text-sm leading-7 text-g-900"
                >
                  <span
                    class="mt-1 flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-danger/12 dark:bg-danger/18"
                  >
                    <ArtSvgIcon icon="ri:close-fill" class="text-[14px] text-danger" />
                  </span>
                  <span>{{ restriction }}</span>
                </div>
              </div>

              <div
                v-if="plan.upgradeTip"
                class="mt-5 rounded-custom-xs border border-g-300 bg-g-100 px-4 py-3 text-sm leading-6 text-g-700"
              >
                {{ plan.upgradeTip }}
              </div>

              <div class="mt-auto pt-6">
                <ElButton
                  :type="plan.recommended ? 'primary' : 'default'"
                  class="!h-12 w-full !rounded-custom-xs !text-base"
                  v-ripple
                  @click="openOfficialPricing"
                >
                  {{ plan.buttonText }}
                </ElButton>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section
        class="mt-6 rounded-custom-sm border border-[var(--default-border)] bg-box p-5 shadow-[0_12px_32px_rgba(15,23,42,0.04)] max-sm:p-4"
      >
        <div class="text-base font-semibold text-g-900">授权说明</div>
        <p class="mt-3 text-sm leading-7 text-g-700">
          所有版本均禁止以任何形式出售、转售、转授权或分发本系统源码；禁止将本系统或基于本系统二次开发形成的通用模板、框架或通用解决方案再次销售。
        </p>
      </section>
    </div>

    <ArtProjectIntroDialog
      ref="projectIntroDialogRef"
      :auto-open="false"
      :persist-on-close="false"
    />
  </div>
</template>

<script setup lang="ts">
  import { computed, ref } from 'vue'
  import ArtProjectIntroDialog from '@/components/core/layouts/art-project-intro-dialog/index.vue'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'

  defineOptions({ name: 'Pricing' })

  interface PriceTag {
    label: string
    value: string
  }

  interface PricingPlan {
    type: string
    title: string
    badge: string
    description: string
    priceCaption: string
    priceDisplay: string
    priceSuffix: string
    priceTags: PriceTag[]
    features: string[]
    restrictions: string[]
    upgradeTip?: string
    buttonText: string
    recommended?: boolean
    icon: string
    cardClass: string
    gradientClass: string
    iconWrapClass: string
    iconClass: string
    priceDisplayClass?: string
  }

  const siteSettingsStore = useSiteSettingsStore()
  const siteBrandName = computed(() => siteSettingsStore.siteBrandName)

  const projectIntroDialogRef = ref<{
    open: (options?: { persistOnClose?: boolean }) => void
  }>()

  /**
   * 跳转到官网定价页完成购买与咨询
   */
  const openOfficialPricing = () => {}

  const openProductIntroDialog = () => {
    projectIntroDialogRef.value?.open({ persistOnClose: false })
  }

  const pricingPlans = ref<PricingPlan[]>([
    {
      type: 'personal',
      title: '自用授权版',
      badge: '个人 / 内部自用',
      description: '适用于个人开发者、自研团队或企业内部系统使用，不包含对外项目交付权限。',
      priceCaption: '当前售价',
      priceDisplay: '¥ 1299',
      priceSuffix: '一次性授权',
      priceTags: [],
      features: [
        '支持二次开发及自身业务系统内部使用',
        '交付前后端全部源代码',
        '提供社群答疑支持',
        '提供基础部署与使用文档',
        '自主开发权限',
        '持续更新服务'
      ],
      restrictions: ['不支持对外项目交付', '不可转售源码'],
      buttonText: '购买自用授权',
      icon: 'ri:user-3-line',
      cardClass: 'bg-box',
      gradientClass:
        'bg-[linear-gradient(to_right_top,transparent,transparent,color-mix(in_oklab,var(--art-primary)_12%,transparent),color-mix(in_oklab,var(--art-primary)_12%,transparent))]',
      iconWrapClass: 'bg-primary/12 dark:bg-primary/18',
      iconClass: 'text-primary',
      priceDisplayClass: ''
    },
    {
      type: 'business',
      title: '商业授权版',
      badge: '商业交付',
      description: '适用于商业项目开发、交付与客户项目落地，覆盖常见接单与实施场景。',
      priceCaption: '当前售价',
      priceDisplay: '¥ 2299',
      priceSuffix: '一次性授权',
      priceTags: [],
      features: [
        '支持商业项目开发与交付',
        '交付前后端全部源代码',
        '允许基于本系统进行二次开发后用于客户项目',
        '提供专属答疑支持，可邀请 2 人加入',
        '提供商业项目部署与交付指导文档',
        '自主开发权限',
        '持续更新服务'
      ],
      restrictions: [],
      buttonText: '购买商业授权',
      recommended: true,
      icon: 'ri:briefcase-3-line',
      cardClass: 'bg-box',
      gradientClass:
        'bg-[linear-gradient(to_right_top,transparent,transparent,color-mix(in_oklab,var(--art-success)_12%,transparent),color-mix(in_oklab,var(--art-success)_12%,transparent))]',
      iconWrapClass: 'bg-success/12 dark:bg-success/18',
      iconClass: 'text-success',
      priceDisplayClass: ''
    },
    {
      type: 'custom',
      title: '定制版',
      badge: '企业采购',
      description: '面向中大型企业、集团客户及个性化需求场景，按需求范围与交付目标单独评估。',
      priceCaption: '按需评估',
      priceDisplay: '定制报价',
      priceSuffix: '根据范围评估',
      priceTags: [],
      features: [
        '支持授权协议定制',
        '交付前后端全部源代码',
        '支持商务采购流程配合',
        '支持定制开发服务',
        '自主开发权限',
        '持续更新服务'
      ],
      restrictions: [],
      buttonText: '联系定制方案',
      icon: 'ri:building-4-line',
      cardClass: 'bg-box',
      gradientClass:
        'bg-[linear-gradient(to_right_top,transparent,transparent,color-mix(in_oklab,var(--art-warning)_12%,transparent),color-mix(in_oklab,var(--art-warning)_12%,transparent))]',
      iconWrapClass: 'bg-warning/12 dark:bg-warning/18',
      iconClass: 'text-warning',
      priceDisplayClass: 'text-[clamp(22px,2vw,28px)]!'
    }
  ])
</script>
