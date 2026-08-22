<template>
  <div
    class="relative flex min-h-[600px] h-screen w-full flex-col items-center justify-center overflow-hidden"
  >
    <!-- 背景波浪底层 -->
    <div
      class="absolute bottom-0 left-0 right-0 z-0 w-full bg-primary/7 md:h-[65vh] max-md:h-[60vh]"
      :style="bgWaveStyle"
    ></div>

    <div class="relative z-[1] mt-[-5vh] flex w-full flex-col items-center gap-[10px]">
      <!-- 插画部分 -->
      <div class="w-[430px] max-w-full shrink-0 mb-15">
        <ThemeSvg :src="imgUrl" class="w-full!" />
      </div>

      <!-- 文字内容 -->
      <div class="px-5 text-center text-white -translate-y-[80px]">
        <p class="mb-5 text-[24px] font-bold text-[var(--main-color)]">
          {{ t('exceptionPage.headline') || '糟糕！出问题了' }}
        </p>

        <h1
          class="my-[-10px] text-[clamp(100px,15vw,140px)] leading-none font-medium text-[#0b1131] dark:text-[#e8eefc] max-md:text-[80px]"
        >
          {{ data.title }}
        </h1>

        <p
          class="mx-auto mt-[10px] mb-[25px] max-w-[400px] text-[18px] leading-[1.6] font-medium text-[#0b1131] dark:text-[#e8eefc] max-md:text-[15px]"
        >
          {{ data.desc }}
        </p>

        <div class="mt-5">
          <ElButton
            type="primary"
            size="large"
            class="!h-12 !min-w-[160px] !rounded-[24px] !border-none !bg-[#0b1131] dark:!bg-[#e8eefc] !text-[16px] !text-white dark:!text-[#0b1131] transition-all duration-300 hover:!translate-y-[-2px] hover:shadow-[0_8px_15px_rgb(0_0_0_/_20%)] dark:hover:shadow-[0_8px_15px_rgb(255_255_255_/_12%)]"
            @click="backHome"
          >
            {{ data.btnText || '返回首页' }}
          </ElButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { useCommon } from '@/hooks/core/useCommon'
  import { useI18n } from 'vue-i18n'
  import { useUserStore } from '@/store/modules/user'
  import imgUrl from '@imgs/svg/403.svg'

  const router = useRouter()
  const { t } = useI18n()
  const userStore = useUserStore()

  interface ExceptionData {
    title: string
    desc: string
    btnText: string
  }

  withDefaults(
    defineProps<{
      data: ExceptionData
    }>(),
    {
      data: () => ({
        title: '401',
        desc: '页面出现问题。请稍后再试或联系客服。',
        btnText: '返回首页'
      })
    }
  )

  const { homePath } = useCommon()

  const backHome = () => {
    const targetHomePath = homePath.value || '/'

    if (!userStore.isLogin) {
      router.push({
        name: 'Login',
        query: { redirect: targetHomePath }
      })
      return
    }

    router.push(targetHomePath)
  }

  const bgWaveStyle = computed(() => {
    const isMobile = window.innerWidth <= 768

    const maskImage = isMobile
      ? `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 375 500' preserveAspectRatio='none'%3E%3Cpath fill='black' d='M0,200 C100,150 250,80 375,180 V500 H0 Z'/%3E%3C/svg%3E")`
      : `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 600' preserveAspectRatio='none'%3E%3Cpath fill='black' d='M0,250 C300,200 600,80 950,120 C1200,150 1440,250 1440,250 V600 H0 Z'/%3E%3C/svg%3E")`

    return {
      WebkitMaskImage: maskImage,
      maskImage,
      WebkitMaskRepeat: 'no-repeat',
      maskRepeat: 'no-repeat',
      WebkitMaskPosition: 'bottom',
      maskPosition: 'bottom',
      WebkitMaskSize: '100% 100%',
      maskSize: '100% 100%'
    }
  })
</script>
