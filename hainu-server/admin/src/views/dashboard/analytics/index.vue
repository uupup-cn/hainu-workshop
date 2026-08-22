<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content dashboard-content--stack dashboard-content--flush">
        <section class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div class="space-y-5">
            <StatCards />

            <div class="grid grid-cols-1 gap-5 2xl:grid-cols-[380px_minmax(0,1fr)]">
              <DeviceSessionShare />
              <AudienceTrend />
            </div>

            <div class="grid grid-cols-1 gap-5 2xl:grid-cols-[380px_minmax(0,1fr)]">
              <CountryDistribution />
              <CampaignList />
            </div>

            <EngagementMetrics />
          </div>

          <div class="flex h-full flex-col gap-5">
            <BrowserInsights />
            <WeeklyActivityHeatmap />
            <TopReferralPages />
            <AverageSessionDuration />
          </div>
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import StatCards from './modules/stat-cards.vue'
  import DeviceSessionShare from './modules/device-session-share.vue'
  import AudienceTrend from './modules/audience-trend.vue'
  import CountryDistribution from './modules/country-distribution.vue'
  import CampaignList from './modules/campaign-list.vue'
  import EngagementMetrics from './modules/engagement-metrics.vue'
  import BrowserInsights from './modules/browser-insights.vue'
  import WeeklyActivityHeatmap from './modules/weekly-activity-heatmap.vue'
  import TopReferralPages from './modules/top-referral-pages.vue'
  import AverageSessionDuration from './modules/average-session-duration.vue'

  defineOptions({ name: 'AnalyticsDashboard' })
</script>
