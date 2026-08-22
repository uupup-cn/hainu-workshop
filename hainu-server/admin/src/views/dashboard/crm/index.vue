<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content dashboard-content--stack dashboard-content--flush">
        <section
          class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-[minmax(0,1fr)_340px] 2xl:grid-cols-[minmax(420px,1.45fr)_minmax(340px,1.15fr)_340px]"
        >
          <div class="flex h-full flex-col gap-5 xl:order-1">
            <StatCards />
            <RevenueAnalysis />
          </div>

          <div
            class="flex h-full flex-col gap-5 xl:order-3 xl:col-span-2 2xl:order-2 2xl:col-span-1"
          >
            <TaskList />
            <LeadProgress />
          </div>

          <LeadSources class="xl:order-2 2xl:order-3" />
        </section>

        <section
          class="grid grid-cols-1 gap-5 xl:grid-cols-2 2xl:grid-cols-[340px_340px_minmax(0,1fr)]"
        >
          <TopDeals />
          <DealStats />
          <LeadsOverview class="xl:col-span-2 2xl:col-span-1" />
        </section>

        <DealDetails />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import StatCards from './modules/stat-cards.vue'
  import RevenueAnalysis from './modules/revenue-analysis.vue'
  import TaskList from './modules/task-list.vue'
  import LeadProgress from './modules/lead-progress.vue'
  import LeadSources from './modules/lead-sources.vue'
  import TopDeals from './modules/top-deals.vue'
  import DealStats from './modules/deal-stats.vue'
  import LeadsOverview from './modules/leads-overview.vue'
  import DealDetails from './modules/deal-details.vue'

  defineOptions({ name: 'CRM' })
</script>
