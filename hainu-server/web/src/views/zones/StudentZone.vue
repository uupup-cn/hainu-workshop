<script setup lang="ts">
/** 在校生专区 — 全幅头图 + 全宽模块矩阵 */
import { LucideIcon, type IconName } from '@/components/icons'
import { AppStaggerReveal, AppSection } from '@/components/patterns'
import { ZoneHero, ModuleShowcase } from '@/components/zone'

const modules: { icon: IconName; name: string; desc: string; to: string }[] = [
  { icon: 'module-intro', name: '海大介绍', desc: '认识海南大学', to: '/intro' },
  { icon: 'module-phonebook', name: '电话簿', desc: '校园常用电话', to: '/phonebook' },
  { icon: 'module-calendar', name: '校历', desc: '学期校历视图', to: '/calendar' },
  { icon: 'module-map', name: '校园地图', desc: '校区导航地图', to: '/map' },
  { icon: 'module-bus', name: '校园出行', desc: '班车时刻表', to: '/bus' },
  { icon: 'module-marketplace', name: '二手集市', desc: '校内二手交易', to: '/marketplace' },
  { icon: 'module-news', name: '快讯', desc: '校园即时快讯', to: '/news' },
  { icon: 'module-alumni', name: '校友圈', desc: '校友交流社区', to: '/alumni' },
  { icon: 'module-schedule', name: '课程表', desc: '我的课表管理', to: '/schedule' },
  { icon: 'module-tools', name: '工具箱', desc: '实用小工具集', to: '/tools' },
  { icon: 'action-profile', name: '个人中心', desc: '资料与设置', to: '/profile' },
]
</script>

<template>
  <div class="zone">
    <ZoneHero
      icon="zone-student"
      accent="ocean"
      kicker="CAMPUS"
      title="在校生专区"
      subtitle="欢迎回来。校园服务、二手集市、校友圈、课表、工具箱——你的校园生活，一站式触达。"
    />
    <AppSection bg="white" kicker="校园模块" title="日常所需，一站直达" sub="点击进入对应功能，更多校园功能持续上线">
      <AppStaggerReveal>
        <ModuleShowcase :modules="modules" />
      </AppStaggerReveal>
    </AppSection>
    <div class="zone-foot">
      <LucideIcon name="fantasy-sparkles" :size="16" color="var(--amber-500)" />
      <span>更多校园功能持续上线中，敬请期待</span>
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
