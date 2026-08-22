<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">访客国家分布</h3>
    </header>
    <ElTable
      :data="countryRows"
      row-key="id"
      size="large"
      :border="false"
      table-layout="auto"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn prop="id" label="序号" width="64" />
      <ElTableColumn label="国家" min-width="120">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ row.flag }}</span>
            <span class="font-medium text-g-900">{{ row.country }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="访客数" min-width="135" align="right">
        <template #default="{ row }">
          <div class="whitespace-nowrap text-right">
            <span class="mr-2 text-[12px]" :class="row.changeClass">{{ row.change }}</span>
            <span class="font-medium text-g-900">{{ row.visitors }}</span>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </article>
</template>

<script setup lang="ts">
  import { countryRows, tableCellStyle, tableHeaderCellStyle } from '../shared'
</script>
