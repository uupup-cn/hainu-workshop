<script setup lang="ts">
/** 新生专区 — 全幅头图 + 全宽模块矩阵 */
import { LucideIcon, type IconName } from '@/components/icons'
import { AppStaggerReveal, AppSection } from '@/components/patterns'
import { ZoneHero, ModuleShowcase } from '@/components/zone'

const modules: { icon: IconName; name: string; desc: string; to: string }[] = [
  { icon: 'module-guide', name: '入学指南', desc: '迎新攻略一站搞定', to: '/guide' },
  { icon: 'module-life', name: '生活攻略', desc: '衣食住行全收录', to: '/life' },
  { icon: 'module-faq', name: 'FAQ', desc: '常见问题答疑', to: '/faq' },
  { icon: 'module-roommate', name: '找室友', desc: '智能匹配同好', to: '/roommate' },
]
</script>

<template>
  <div class="zone">
    <ZoneHero
      icon="zone-freshman"
      accent="fantasy"
      kicker="FRESHMAN"
      title="新生专区"
      subtitle="欢迎来到海南大学。入学指南、生活攻略、常见问答、找室友——新生需要的一切，都在这里。"
    />
    <AppSection bg="white" kicker="新生模块" title="开启你的海大第一步" sub="点击进入对应功能，更多新生功能持续上线">
      <AppStaggerReveal>
        <ModuleShowcase :modules="modules" />
      </AppStaggerReveal>
    </AppSection>
    <div class="zone-foot">
      <LucideIcon name="fantasy-sparkles" :size="16" color="var(--amber-500)" />
      <span>更多新生功能持续上线中，敬请期待</span>
    </div>
  </div>
</template>

<style scoped>
.zone-foot {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: 0 var(--space-6) var(--space-10);
  color: var(--fg-3);
  font-size: var(--fs-caption);
}
</style>
