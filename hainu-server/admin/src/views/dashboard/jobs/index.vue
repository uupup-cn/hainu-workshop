<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content dashboard-content--stack">
        <StatCards />

        <section class="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.7fr)_340px_340px]">
          <RecruitmentPerformance />
          <RecruitmentActivity />
          <CandidateOverview />
        </section>

        <section class="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1.7fr)_340px_340px]">
          <RecentlyAddedJobs />
          <RecruitmentFunnel />
          <RecentJobs />
        </section>

        <LatestJobPostings />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import CandidateOverview from './modules/candidate-overview.vue'
  import LatestJobPostings from './modules/latest-job-postings.vue'
  import RecentJobs from './modules/recent-jobs.vue'
  import RecentlyAddedJobs from './modules/recently-added-jobs.vue'
  import RecruitmentActivity from './modules/recruitment-activity.vue'
  import RecruitmentFunnel from './modules/recruitment-funnel.vue'
  import RecruitmentPerformance from './modules/recruitment-performance.vue'
  import StatCards from './modules/stat-cards.vue'

  defineOptions({ name: 'DashboardJobs' })
</script>
