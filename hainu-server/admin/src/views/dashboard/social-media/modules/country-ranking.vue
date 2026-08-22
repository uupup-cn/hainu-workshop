<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">受众国家排行</h3>
    </header>
    <ElTable
      :data="countryRows"
      row-key="id"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn prop="id" label="序号" width="72" />
      <ElTableColumn label="国家" min-width="160">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-2xl">{{ row.flag }}</span>
            <span class="font-medium text-g-900">{{ row.country }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="互动量" min-width="140">
        <template #default="{ row }">
          <div class="flex items-center gap-2 text-g-800">
            <span>{{ row.engagement }}</span>
            <ArtSvgIcon icon="ri:thumb-up-line" class="text-base text-g-500" />
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn label="粉丝数" min-width="150">
        <template #default="{ row }">
          <div class="flex items-center gap-2">
            <span class="font-medium text-g-900">{{ row.followers }}</span>
            <span class="text-[12px]" :class="row.changeClass">{{ row.change }}</span>
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </article>
</template>

<script setup lang="ts">
  import { countryRows, tableCellStyle, tableHeaderCellStyle } from '../shared'
</script>
