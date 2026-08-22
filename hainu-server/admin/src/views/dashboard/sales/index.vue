<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content dashboard-content--stack">
        <section
          class="grid grid-cols-1 gap-5 2xl:grid-cols-[252px_minmax(0,1fr)_340px] 2xl:items-stretch"
        >
          <StatCards />
          <SalesOverview />
          <SalesSidebar />
        </section>

        <section class="grid grid-cols-1 items-stretch gap-5 xl:grid-cols-2 2xl:grid-cols-4">
          <TopProducts />
          <RecentActivities />
          <TopCustomers />
          <TopChannels />
        </section>

        <section class="grid grid-cols-1 gap-5 2xl:grid-cols-[minmax(0,1fr)_360px]">
          <RecentInvoices />
          <RecentTransactions />
        </section>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import RecentActivities from './modules/recent-activities.vue'
  import RecentInvoices from './modules/recent-invoices.vue'
  import RecentTransactions from './modules/recent-transactions.vue'
  import SalesOverview from './modules/sales-overview.vue'
  import SalesSidebar from './modules/sales-sidebar.vue'
  import StatCards from './modules/stat-cards.vue'
  import TopChannels from './modules/top-channels.vue'
  import TopCustomers from './modules/top-customers.vue'
  import TopProducts from './modules/top-products.vue'

  defineOptions({ name: 'SalesDashboard' })
</script>
