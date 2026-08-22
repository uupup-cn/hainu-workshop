<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content dashboard-content--stack">
        <section class="grid grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_340px]">
          <div class="space-y-5">
            <MarketCards />
            <CryptoPerformance />

            <div class="grid grid-cols-1 gap-5 xl:grid-cols-3">
              <TransactionHistory />
              <RecentActivities />
              <CoinStats />
            </div>
          </div>

          <div class="flex h-full flex-col gap-5">
            <BalanceCard />
            <TradePanel />
            <AssetOverview />
          </div>
        </section>

        <PortfolioOverview />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import AssetOverview from './modules/asset-overview.vue'
  import BalanceCard from './modules/balance-card.vue'
  import CoinStats from './modules/coin-stats.vue'
  import CryptoPerformance from './modules/crypto-performance.vue'
  import MarketCards from './modules/market-cards.vue'
  import PortfolioOverview from './modules/portfolio-overview.vue'
  import RecentActivities from './modules/recent-activities.vue'
  import TradePanel from './modules/trade-panel.vue'
  import TransactionHistory from './modules/transaction-history.vue'

  defineOptions({ name: 'CryptoDashboard' })
</script>
