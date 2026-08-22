<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">热门活动列表</h3>
      <button class="text-sm text-g-600">
        查看全部 <i class="ri-arrow-down-s-line ml-1"></i>
      </button>
    </header>
    <ElTable
      :data="campaignRows"
      row-key="name"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn label="负责人" min-width="210">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <img :src="row.avatar" :alt="row.name" class="h-9 w-9 rounded-full object-cover" />
            <div class="min-w-0">
              <p class="truncate font-medium text-g-900">{{ row.name }}</p>
              <p class="truncate text-[13px] text-g-600">{{ row.role }}</p>
            </div>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="sales" label="销售额" min-width="120" />
      <ElTableColumn label="目标" min-width="110">
        <template #default="{ row }">
          <span :class="row.goalClass">{{ row.goal }}</span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="状态" min-width="120">
        <template #default="{ row }">
          <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
            {{ row.status }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="110" align="center">
        <template #default>
          <div class="flex items-center justify-center gap-2">
            <ArtButtonTable type="edit" />
            <ArtButtonTable type="delete" />
          </div>
        </template>
      </ElTableColumn>
    </ElTable>
  </article>
</template>

<script setup lang="ts">
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { campaignRows, tableCellStyle, tableHeaderCellStyle } from '../shared'
</script>
