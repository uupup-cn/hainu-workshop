<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">潜客概览</h3>
    </header>
    <div class="overflow-x-auto">
      <ElTable
        :data="leadsOverview"
        row-key="name"
        :border="false"
        :stripe="false"
        size="large"
        table-layout="fixed"
        class="min-w-full"
        :header-cell-style="crmTableHeaderCellStyle"
        :cell-style="crmTableCellStyle"
      >
        <ElTableColumn label="潜客姓名" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <img :src="row.avatar" :alt="row.name" class="h-9 w-9 rounded-full object-cover" />
              <span class="whitespace-nowrap text-[15px] font-medium text-g-900">
                {{ row.name }}
              </span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="company" label="公司" min-width="180">
          <template #default="{ row }">
            <span class="text-[15px] text-g-800">{{ row.company }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" width="120">
          <template #default="{ row }">
            <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
              {{ row.status }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="source" label="来源" min-width="140">
          <template #default="{ row }">
            <span class="text-[15px] text-g-800">{{ row.source }}</span>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { crmTableCellStyle, crmTableHeaderCellStyle, leadsOverview } from '../shared'
</script>
