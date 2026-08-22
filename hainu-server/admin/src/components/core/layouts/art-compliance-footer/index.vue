<template>
  <footer
    v-if="visible"
    class="art-compliance-footer"
    :class="isFullHeightPage ? 'is-full-height-page' : 'is-flow-page'"
    aria-label="联系与合规信息"
  >
    <div class="art-compliance-footer__line">
      <template v-for="(item, index) in displayItems" :key="item.key">
        <span v-if="index > 0" class="art-compliance-footer__divider" aria-hidden="true">|</span>
        <a
          v-if="item.href"
          class="art-compliance-footer__item art-compliance-footer__link"
          :href="item.href"
          target="_blank"
          rel="noopener noreferrer"
        >
          {{ item.text }}
        </a>
        <span v-else class="art-compliance-footer__item">{{ item.text }}</span>
      </template>
    </div>
  </footer>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { useSiteSettingsStore } from '@/store/modules/site-settings'

  defineOptions({ name: 'ArtComplianceFooter' })

  withDefaults(
    defineProps<{
      isFullHeightPage?: boolean
    }>(),
    {
      isFullHeightPage: false
    }
  )

  interface ComplianceItem {
    key: string
    text: string
    href?: string
  }

  const siteSettingsStore = useSiteSettingsStore()
  const settingStore = useSettingStore()
  const { publicConfig } = storeToRefs(siteSettingsStore)
  const { showComplianceFooter } = storeToRefs(settingStore)

  const normalizeText = (value?: string | null) => String(value || '').trim()

  const displayItems = computed<ComplianceItem[]>(() => {
    const config = publicConfig.value
    const items: ComplianceItem[] = []
    const copyrightText = normalizeText(config.copyrightText)
    const icpNo = normalizeText(config.icpNo)
    const publicSecurityNo = normalizeText(config.publicSecurityNo)
    const supportEmail = normalizeText(config.supportEmail)
    const supportPhone = normalizeText(config.supportPhone)

    if (copyrightText) {
      items.push({ key: 'copyright', text: copyrightText })
    }

    if (icpNo) {
      items.push({
        key: 'icp',
        text: icpNo,
        href: 'https://beian.miit.gov.cn/'
      })
    }

    if (publicSecurityNo) {
      items.push({
        key: 'public-security',
        text: publicSecurityNo,
        href: 'https://beian.mps.gov.cn/'
      })
    }

    if (supportEmail) {
      items.push({ key: 'support-email', text: `联系邮箱 ${supportEmail}` })
    }

    if (supportPhone) {
      items.push({ key: 'support-phone', text: `联系电话 ${supportPhone}` })
    }

    return items
  })

  const visible = computed(() => showComplianceFooter.value && displayItems.value.length > 0)
</script>

<style scoped lang="scss">
  .art-compliance-footer {
    box-sizing: border-box;
    width: 100%;
    color: var(--art-gray-500);
    text-align: center;

    &.is-full-height-page {
      padding: 16px;
    }

    &.is-flow-page {
      padding: 0 16px 16px;
    }
  }

  .art-compliance-footer__line {
    display: flex;
    align-items: center;
    justify-content: center;
    max-width: 100%;
    min-height: 20px;
    overflow-x: auto;
    font-size: 12px;
    line-height: 20px;
    white-space: nowrap;
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }
  }

  .art-compliance-footer__item {
    flex: 0 0 auto;
  }

  .art-compliance-footer__divider {
    flex: 0 0 auto;
    margin: 0 10px;
    color: color-mix(in srgb, var(--art-gray-500) 42%, transparent);
  }

  .art-compliance-footer__link {
    color: inherit;
    text-decoration: none;
    transition: color 0.2s ease;

    &:hover {
      color: var(--main-color);
    }
  }

  @media only screen and (width <= 640px) {
    .art-compliance-footer {
      &.is-full-height-page,
      &.is-flow-page {
        padding: 10px 0 20px;
      }
    }

    .art-compliance-footer__line {
      justify-content: flex-start;
      padding: 0 15px;
    }
  }

  @media only screen and (width <= 650px) {
    .art-compliance-footer.auth-compliance-footer {
      padding-right: 24px !important;
      padding-left: 24px !important;
    }

    .art-compliance-footer.auth-compliance-footer .art-compliance-footer__line {
      justify-content: center;
      padding-right: 0;
      padding-left: 0;
    }
  }
</style>
