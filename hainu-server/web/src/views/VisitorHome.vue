<script setup lang="ts">
/**
 * 访客首页 — 官网级全屏沉浸布局
 * 全屏 Hero（主导首屏）→ 全宽幻灯片 → 全宽功能矩阵 → 双专区大卡 → 全宽 CTA
 * 登录后由路由守卫/登录动作自动进入身份专区，首页随时可回访
 */
import { LucideIcon, type IconName } from '@/components/icons'
import { AppCarousel, AppStaggerReveal, AppSection, AppCTASection } from '@/components/patterns'
import { PetMascot, ModuleShowcase } from '@/components/zone'

const heroSlides: { key: string; gradient: string; icon: IconName; title: string; subtitle: string }[] = [
  {
    key: 'freshman',
    gradient: 'linear-gradient(120deg, var(--ocean-700), var(--fantasy-600))',
    icon: 'module-guide',
    title: '新生指南',
    subtitle: '入学指南 · 生活攻略 · 找室友',
  },
  {
    key: 'life',
    gradient: 'linear-gradient(120deg, var(--teal-600), var(--ocean-600))',
    icon: 'module-marketplace',
    title: '校园生活',
    subtitle: '二手集市 · 校友圈 · 快讯',
  },
  {
    key: 'wise',
    gradient: 'linear-gradient(120deg, var(--amber-600), var(--coral-500))',
    icon: 'module-intro',
    title: '智慧海大',
    subtitle: '海大介绍 · 电话簿 · 校园地图',
  },
]

const modules: { icon: IconName; name: string; desc: string; to: string }[] = [
  { icon: 'module-guide', name: '入学指南', desc: '迎新攻略一站搞定', to: '/guide' },
  { icon: 'module-life', name: '生活攻略', desc: '衣食住行全收录', to: '/life' },
  { icon: 'module-faq', name: 'FAQ', desc: '常见问题答疑', to: '/faq' },
  { icon: 'module-roommate', name: '找室友', desc: '智能匹配同好', to: '/roommate' },
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
]

const stats = [
  { num: '14+', label: '功能模块' },
  { num: '4', label: '校区覆盖' },
  { num: '1', label: '站式入口' },
]

const zones = [
  {
    icon: 'zone-freshman' as IconName,
    name: '新生专区',
    desc: '入学指南、生活攻略、常见问答、找室友——新生需要的一切，一步到位。',
    chips: ['入学指南', '生活攻略', 'FAQ', '找室友'],
    to: '/freshman',
    accent: 'fantasy',
  },
  {
    icon: 'zone-student' as IconName,
    name: '在校生专区',
    desc: '校园服务、二手集市、校友圈、课表、工具箱——日常所需全覆盖。',
    chips: ['校园服务', '二手集市', '校友圈', '课表', '工具箱'],
    to: '/student',
    accent: 'ocean',
  },
]
</script>

<template>
  <div class="visitor">
    <!-- 全屏沉浸 Hero -->
    <section class="hero">
      <div class="hero-glow glow-amber" aria-hidden="true"></div>
      <div class="hero-glow glow-teal" aria-hidden="true"></div>
      <div class="hero-inner">
        <PetMascot :size="150" class="hero-mascot" />
        <p class="hero-kicker">
          <LucideIcon name="fantasy-sparkles" :size="15" />
          海南大学 · 校园工具一站式入口
        </p>
        <h1 class="hero-title">海大工坊</h1>
        <p class="hero-sub">
          新生指南 · 校园生活 · 二手集市 · 课程表<br />
          你的海大生活，从这里启程
        </p>
        <div class="hero-actions">
          <router-link to="/freshman" class="btn hero-btn-primary">
            <LucideIcon name="zone-freshman" :size="20" />
            进入新生专区
          </router-link>
          <router-link to="/student" class="btn hero-btn-ghost">
            <LucideIcon name="zone-student" :size="20" />
            在校生专区
          </router-link>
        </div>
      </div>
      <div class="hero-stats">
        <div v-for="s in stats" :key="s.label" class="hero-stat">
          <span class="hero-stat-num num">{{ s.num }}</span>
          <span class="hero-stat-label">{{ s.label }}</span>
        </div>
      </div>
    </section>

    <!-- 全宽幻灯片 -->
    <AppCarousel :slides="heroSlides" flush />

    <!-- 全宽功能矩阵 -->
    <AppSection bg="page" kicker="全部功能" title="一站式校园工具" sub="访客可浏览所有模块入口，部分功能登录后可用">
      <AppStaggerReveal>
        <ModuleShowcase :modules="modules" />
      </AppStaggerReveal>
    </AppSection>

    <!-- 双专区大卡 -->
    <AppSection bg="white" kicker="身份专区" title="找到属于你的入口" sub="登录后自动进入你的身份专区">
      <div class="zone-cards">
        <router-link v-for="z in zones" :key="z.to" :to="z.to" class="zone-card" :class="`accent-${z.accent}`">
          <span class="zone-card-ico">
            <LucideIcon :name="z.icon" :size="30" color="#fff" />
          </span>
          <h3 class="zone-card-name">{{ z.name }}</h3>
          <p class="zone-card-desc">{{ z.desc }}</p>
          <div class="zone-card-chips">
            <span v-for="c in z.chips" :key="c" class="zone-chip">{{ c }}</span>
          </div>
          <span class="zone-card-link">
            进入专区
            <LucideIcon name="arrow-right" :size="18" />
          </span>
        </router-link>
      </div>
    </AppSection>

    <!-- 全宽 CTA -->
    <AppCTASection title="加入海大工坊" desc="登录后自动进入你的身份专区，解锁课表、集市、校友圈等全部功能。">
      <router-link to="/freshman" class="btn cta-btn-primary">
        <LucideIcon name="zone-freshman" :size="20" />
        我是新生
      </router-link>
      <router-link to="/student" class="btn cta-btn-ghost">
        <LucideIcon name="zone-student" :size="20" />
        我是在校生
      </router-link>
    </AppCTASection>
  </div>
</template>

<style scoped>
/* ===== 全屏 Hero ===== */
.hero {
  position: relative;
  width: 100%;
  min-height: calc(100svh - var(--header-h));
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background: linear-gradient(160deg, var(--ocean-900) 0%, var(--ocean-700) 48%, var(--fantasy-700) 100%);
  color: #fff;
  text-align: center;
}
.hero-glow {
  position: absolute;
  border-radius: var(--r-full);
  filter: blur(90px);
  pointer-events: none;
}
.glow-amber {
  width: 480px;
  height: 480px;
  right: -120px;
  top: -140px;
  background: rgba(245, 158, 11, 0.22);
}
.glow-teal {
  width: 420px;
  height: 420px;
  left: -140px;
  bottom: -120px;
  background: rgba(20, 184, 166, 0.2);
}
.hero-inner {
  position: relative;
  margin: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-16) var(--space-6) var(--space-12);
}
.hero-mascot {
  margin-bottom: var(--space-2);
}
.hero-kicker {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-4);
  border: 1px solid rgba(255, 255, 255, 0.28);
  border-radius: var(--r-full);
  background: rgba(255, 255, 255, 0.08);
  font-size: var(--fs-caption);
  letter-spacing: 0.08em;
  margin: 0;
}
.hero-title {
  font-family: var(--font-display);
  font-size: var(--fs-display-xl);
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: 0.04em;
  margin: 0;
}
.hero-sub {
  font-size: var(--fs-body-lg);
  line-height: var(--lh-body-lg);
  color: rgba(255, 255, 255, 0.82);
  margin: 0 0 var(--space-4);
}
.hero-actions {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: var(--space-3);
}
.hero-btn-primary {
  background: var(--amber-500);
  color: var(--ocean-900);
  padding: var(--space-3) var(--space-8);
  font-size: var(--fs-button);
}
.hero-btn-primary:hover {
  background: var(--amber-300);
}
.hero-btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: var(--space-3) var(--space-8);
  font-size: var(--fs-button);
}
.hero-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}
.hero-stats {
  position: relative;
  display: flex;
  justify-content: center;
  gap: clamp(32px, 8vw, 96px);
  padding: var(--space-5) var(--space-6);
  border-top: 1px solid rgba(255, 255, 255, 0.14);
  background: rgba(5, 31, 77, 0.25);
}
.hero-stat {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}
.hero-stat-num {
  font-family: var(--font-display);
  font-size: var(--fs-h1);
  font-weight: 700;
  line-height: 1.1;
}
.hero-stat-label {
  font-size: var(--fs-caption);
  color: rgba(255, 255, 255, 0.62);
  letter-spacing: 0.12em;
}

/* ===== 双专区大卡 ===== */
.zone-cards {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-6);
}
.zone-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding: clamp(28px, 4vw, 44px);
  border: 1px solid var(--neutral-200);
  border-radius: var(--r-2xl);
  background: var(--bg-card);
  box-shadow: var(--sh-card);
  transition:
    transform var(--dur-base) var(--ease-back),
    box-shadow var(--dur-base) var(--ease-out),
    border-color var(--dur-base) var(--ease-out);
}
.zone-card:hover {
  transform: translateY(-6px);
  box-shadow: var(--sh-float);
}
.zone-card.accent-fantasy:hover {
  border-color: var(--fantasy-300);
}
.zone-card.accent-ocean:hover {
  border-color: var(--ocean-300);
}
.zone-card-ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 60px;
  height: 60px;
  border-radius: var(--r-lg);
  margin-bottom: var(--space-2);
}
.accent-fantasy .zone-card-ico {
  background: linear-gradient(135deg, var(--fantasy-500), var(--ocean-500));
}
.accent-ocean .zone-card-ico {
  background: linear-gradient(135deg, var(--ocean-500), var(--teal-500));
}
.zone-card-name {
  font-family: var(--font-display);
  font-size: var(--fs-h2);
  font-weight: var(--fw-h2);
  color: var(--fg-1);
  margin: 0;
}
.zone-card-desc {
  color: var(--fg-2);
  font-size: var(--fs-body);
  line-height: var(--lh-body);
  margin: 0;
}
.zone-card-chips {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: var(--space-2) 0 var(--space-4);
}
.zone-chip {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--r-full);
  background: var(--neutral-100);
  color: var(--fg-2);
  font-size: var(--fs-caption);
}
.zone-card-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--ocean-500);
  font-size: var(--fs-h4);
  font-weight: var(--fw-h4);
  margin-top: auto;
}
.accent-fantasy .zone-card-link {
  color: var(--fantasy-500);
}

/* ===== CTA 按钮 ===== */
.cta-btn-primary {
  background: var(--amber-500);
  color: var(--ocean-900);
  padding: var(--space-3) var(--space-8);
}
.cta-btn-primary:hover {
  background: var(--amber-300);
}
.cta-btn-ghost {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.4);
  color: #fff;
  padding: var(--space-3) var(--space-8);
}
.cta-btn-ghost:hover {
  background: rgba(255, 255, 255, 0.14);
  color: #fff;
}

@media (max-width: 768px) {
  .hero {
    min-height: auto;
  }
  .hero-inner {
    padding: var(--space-16) var(--space-4) var(--space-10);
  }
  .hero-actions {
    flex-direction: column;
    width: 100%;
    max-width: 320px;
  }
  .hero-btn-primary,
  .hero-btn-ghost {
    width: 100%;
  }
  .hero-stats {
    gap: var(--space-8);
    flex-wrap: wrap;
  }
  .hero-stat-num {
    font-size: var(--fs-h2);
  }
  .zone-cards {
    grid-template-columns: 1fr;
  }
}
</style>
