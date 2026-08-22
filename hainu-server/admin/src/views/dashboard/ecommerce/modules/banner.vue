<template>
  <ArtBasicBanner
    class="justify-center !h-53 mb-5 max-sm:!pt-8 max-sm:!h-48 max-sm:mb-4"
    :title="`欢迎回来 ${userInfo.username}`"
    boxStyle="!bg-theme/5"
    titleColor="var(--art-gray-900)"
    :decoration="false"
    :meteorConfig="{
      enabled: true,
      count: 10
    }"
    :buttonConfig="{
      show: false,
      text: ''
    }"
    :imageConfig="{
      src: bannerCover,
      width: '18rem',
      bottom: '-7.5rem'
    }"
    @click="handleBannerClick"
  >
    <div class="mt-6 flex gap-8">
      <div class="ecommerce-banner-metric ecommerce-banner-metric--split">
        <p class="text-3xl">
          <ArtCountTo
            class="number box-title"
            :target="2340"
            :duration="1500"
            prefix="¥"
            separator=","
          />
          <ArtSvgIcon icon="ri:arrow-right-up-line" class="text-xl text-success relative -top-2" />
        </p>
        <p class="mt-1 text-sm text-g-700">今日销售额</p>
      </div>
      <div class="ecommerce-banner-metric">
        <p class="text-3xl">
          <ArtCountTo class="number box-title" :target="35" :duration="1500" suffix="%" />
          <ArtSvgIcon icon="ri:arrow-right-up-line" class="text-xl text-success relative -top-2" />
        </p>
        <p class="mt-1 text-sm text-g-700">较昨日</p>
      </div>
    </div>
  </ArtBasicBanner>
</template>

<script setup lang="ts">
  import bannerCover from '@imgs/login/lf_icon2.webp'
  import { useUserStore } from '@/store/modules/user'

  const userStore = useUserStore()

  /**
   * 获取当前用户信息
   */
  const userInfo = computed(() => userStore.getUserInfo)

  /**
   * 处理横幅点击事件
   */
  const handleBannerClick = (): void => {
    // TODO: 添加横幅点击处理逻辑
  }
</script>

<style scoped lang="scss">
  .ecommerce-banner-metric--split {
    padding-right: 2rem;
    border-right: 1px solid var(--color-g-400);
  }

  :global(.dark) .ecommerce-banner-metric--split {
    border-right-color: rgb(from var(--color-g-300) r g b / 60%);
  }
</style>
