<!-- 登录、注册、忘记密码左侧背景 -->
<template>
  <div class="login-left-view">
    <div class="architectural-grid" aria-hidden="true"></div>

    <div class="logo">
      <div class="logo-mark">
        <ArtLogo class="icon" size="44" />
      </div>
      <h1 class="title">{{ siteBrandName }}</h1>
    </div>

    <div class="brand-panel">
      <span class="brand-kicker">Designed by the Art Design Team</span>

      <div v-if="!hideContent" class="text-wrap">
        <h1>{{ welcomeTitle }}</h1>
        <p>{{ welcomeDescription }}</p>

        <div class="progress-mark" aria-hidden="true">
          <i></i>
          <i></i>
          <i></i>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import AppConfig from '@/config'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'

  defineProps<{
    hideContent?: boolean // 是否隐藏内容，只显示 logo
  }>()

  const siteSettingsStore = useSiteSettingsStore()
  const siteBrandName = computed(() => siteSettingsStore.siteBrandName || AppConfig.systemInfo.name)
  const welcomeTitle = computed(() => siteSettingsStore.publicConfig.loginWelcomeTitle)
  const welcomeDescription = computed(() => siteSettingsStore.publicConfig.loginWelcomeDescription)
</script>

<style lang="scss" scoped>
  .login-left-view {
    --login-title-color: #252b32;
    --login-body-color: #505a68;
    --login-logo-color: #292f36;
    --login-dot-size: 0.75px;
    --login-dot-gap: 24px;
    --login-grid-line-size: 0.75px;
    --login-grid-gap: 90px;
    --login-dot-color: rgb(192 199 214 / 25%);
    --login-grid-color: rgb(0 93 170 / 14%);
    --login-grid-opacity: 0.23;

    position: relative;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 65vw;
    min-width: 0;
    height: 100%;
    padding: clamp(64px, 7vw, 120px);
    overflow: hidden;
    color: #191c1e;
    background-color: #f7f9fc;
    border-inline-end: 1px solid var(--art-gray-200);

    &::before {
      position: absolute;
      inset: 0;
      content: '';
      background-image: url('@imgs/lock/bg_light.webp');
      background-size: 125% 130%;
    }

    &::after {
      position: absolute;
      inset: 0;
      pointer-events: none;
      content: '';
      background-image: radial-gradient(
        var(--login-dot-color) var(--login-dot-size),
        transparent var(--login-dot-size)
      );
      background-size: var(--login-dot-gap) var(--login-dot-gap);
    }

    .architectural-grid {
      position: absolute;
      inset: 0;
      pointer-events: none;
      background-image:
        linear-gradient(
          to right,
          var(--login-grid-color) var(--login-grid-line-size),
          transparent var(--login-grid-line-size)
        ),
        linear-gradient(
          to bottom,
          var(--login-grid-color) var(--login-grid-line-size),
          transparent var(--login-grid-line-size)
        );
      background-size: var(--login-grid-gap) var(--login-grid-gap);
      opacity: var(--login-grid-opacity);
    }

    .logo {
      position: absolute;
      inset-inline-start: 24px;
      top: 18px;
      z-index: 2;
      display: flex;
      gap: 10px;
      align-items: center;

      .logo-mark {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 46px;
        height: 46px;
      }

      .title {
        font-size: 20px;
        font-weight: 400;
        color: var(--login-logo-color);
      }
    }

    .brand-panel {
      position: relative;
      z-index: 1;
      width: min(100%, 672px);
      animation: loginBrandIn 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }

    .brand-kicker {
      display: block;
      margin-bottom: 26px;
      font-size: 12px;
      font-weight: 700;
      line-height: 1.4;
      color: var(--el-color-primary, #005daa);
      text-transform: uppercase;
      letter-spacing: 0.18em;
      overflow-wrap: anywhere;
    }

    .text-wrap {
      h1 {
        max-width: 640px;
        font-size: clamp(40px, 3vw, 44px);
        font-weight: 800;
        line-height: 1.1;
        color: var(--login-title-color);
        text-wrap: balance;
        overflow-wrap: anywhere;
      }

      p {
        max-width: 540px;
        margin-top: 24px;
        font-size: 18px;
        font-weight: 300;
        line-height: 1.8;
        color: var(--login-body-color);
      }
    }

    .progress-mark {
      display: flex;
      gap: 16px;
      padding-top: 32px;

      i {
        display: block;
        width: 16px;
        height: 4px;
        background: #c0c7d6;
        border-radius: 8px;

        &:first-child {
          width: 48px;
          background: var(--el-color-primary, #005daa);
        }
      }
    }
  }

  .dark .login-left-view {
    --login-dot-color: rgb(165 200 255 / 8%);
    --login-grid-color: rgb(165 200 255 / 16%);
    --login-grid-opacity: 0.3;

    color: var(--art-gray-900);
    border-inline-end: 1px solid rgb(0 0 0 / 95%);

    &::before {
      background-image: url('@imgs/lock/bg_dark.webp');
    }

    &::after {
      background-image: radial-gradient(
        var(--login-dot-color) var(--login-dot-size),
        transparent var(--login-dot-size)
      );
    }

    .architectural-grid {
      background-image:
        linear-gradient(
          to right,
          var(--login-grid-color) var(--login-grid-line-size),
          transparent var(--login-grid-line-size)
        ),
        linear-gradient(
          to bottom,
          var(--login-grid-color) var(--login-grid-line-size),
          transparent var(--login-grid-line-size)
        );
      opacity: var(--login-grid-opacity);
    }

    .text-wrap {
      h1 {
        color: var(--art-gray-900);
      }

      p {
        color: var(--art-gray-700);
      }
    }

    .progress-mark i:not(:first-child) {
      background: var(--art-gray-400);
    }

    .logo .title {
      color: var(--art-gray-900);
    }
  }

  @media only screen and (width <= 1600px) {
    .login-left-view {
      width: 60vw;
      padding: clamp(56px, 6vw, 96px);
    }
  }

  @media only screen and (width <= 1180px) {
    .login-left-view {
      display: none;
    }
  }

  @media (resolution >= 2dppx) {
    .login-left-view {
      --login-title-color: #191c1e;
      --login-body-color: #404753;
      --login-logo-color: #191c1e;
      --login-dot-size: 0.5px;
      --login-grid-line-size: 0.5px;
      --login-dot-color: rgb(192 199 214 / 30%);
      --login-grid-color: rgb(0 93 170 / 18%);
      --login-grid-opacity: 0.28;
    }
  }

  @keyframes loginBrandIn {
    from {
      opacity: 0;
      transform: translateX(-30px);
    }

    to {
      opacity: 1;
      transform: translateX(0);
    }
  }
</style>
