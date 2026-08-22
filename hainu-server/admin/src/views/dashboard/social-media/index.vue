<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content">
        <section class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div class="space-y-5">
            <StatCards />

            <div
              class="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.7fr)_minmax(320px,0.83fr)]"
            >
              <TrafficTrend />
              <AudienceGender />
            </div>

            <div class="grid grid-cols-1 gap-5 2xl:grid-cols-2">
              <CountryRanking />
              <ContentInsights />
            </div>

            <PerformanceOverview />
          </div>

          <div class="flex h-full flex-col gap-5">
            <RecentUpdates />
            <AudienceAgeMetrics />
            <SuggestedFollows />
            <InteractionHeatmap />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import AudienceAgeMetrics from './modules/audience-age-metrics.vue'
  import AudienceGender from './modules/audience-gender.vue'
  import ContentInsights from './modules/content-insights.vue'
  import CountryRanking from './modules/country-ranking.vue'
  import InteractionHeatmap from './modules/interaction-heatmap.vue'
  import PerformanceOverview from './modules/performance-overview.vue'
  import RecentUpdates from './modules/recent-updates.vue'
  import StatCards from './modules/stat-cards.vue'
  import SuggestedFollows from './modules/suggested-follows.vue'
  import TrafficTrend from './modules/traffic-trend.vue'

  defineOptions({ name: 'SocialMediaDashboard' })
</script>
