<!-- 工作台页面 -->
<template>
  <div class="dashboard-page">
    <section class="dashboard-shell">
      <div class="dashboard-content">
        <CardList></CardList>

        <ElRow :gutter="20">
          <ElCol :sm="24" :md="12" :lg="10">
            <ActiveUser />
          </ElCol>
          <ElCol :sm="24" :md="12" :lg="14">
            <SalesOverview />
          </ElCol>
        </ElRow>

        <ElRow :gutter="20">
          <ElCol :sm="24" :md="24" :lg="12">
            <NewUser />
          </ElCol>
          <ElCol :sm="24" :md="12" :lg="6">
            <Dynamic />
          </ElCol>
          <ElCol :sm="24" :md="12" :lg="6">
            <TodoList />
          </ElCol>
        </ElRow>

        <AboutProject v-if="commercialEnabled" />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import CardList from './modules/card-list.vue'
  import ActiveUser from './modules/active-user.vue'
  import SalesOverview from './modules/sales-overview.vue'
  import NewUser from './modules/new-user.vue'
  import Dynamic from './modules/dynamic-stats.vue'
  import TodoList from './modules/todo-list.vue'
  import AboutProject from './modules/about-project.vue'
  import { isCommercialEntryEnabled } from '@/hooks/core/useCommercial'

  defineOptions({ name: 'Console' })

  // 商业化品牌入口开关；关闭后“关于项目”品牌卡片不再展示
  const commercialEnabled = isCommercialEntryEnabled()
</script>
