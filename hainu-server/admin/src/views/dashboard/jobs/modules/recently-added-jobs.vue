<template>
  <article class="art-card-sm flex h-[460px] flex-col overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">最近新增岗位</h3>
    </header>
    <ElScrollbar class="min-h-0 flex-1">
      <ElTable
        :data="recentlyAddedJobs"
        row-key="company"
        size="large"
        :border="false"
        table-layout="auto"
        :header-cell-style="tableHeaderCellStyle"
        :cell-style="tableCellStyle"
      >
        <ElTableColumn label="公司" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <span
                class="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-semibold"
                :style="{ background: row.logoBg, color: row.logoColor }"
              >
                {{ row.logo }}
              </span>
              <span class="font-medium text-g-900">{{ row.company }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="role" label="职位" min-width="170" />
        <ElTableColumn prop="location" label="地点" min-width="140" />
        <ElTableColumn label="类型" min-width="120" align="center">
          <template #default="{ row }">
            <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.typeClass">
              {{ row.type }}
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { recentlyAddedJobs, tableCellStyle, tableHeaderCellStyle } from '../shared'
</script>
