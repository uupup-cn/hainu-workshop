<template>
  <section class="art-card-sm overflow-hidden mb-5">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">成交明细</h3>
    </header>
    <div class="overflow-x-auto">
      <ElTable
        :data="dealTable"
        row-key="id"
        :border="false"
        :stripe="false"
        size="large"
        table-layout="fixed"
        class="min-w-[1180px] w-full"
        :header-cell-style="crmTableHeaderCellStyle"
        :cell-style="crmTableCellStyle"
      >
        <ElTableColumn prop="id" label="成交编号" min-width="140">
          <template #default="{ row }">
            <span class="font-medium text-g-900">{{ row.id }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="name" label="成交名称" min-width="160" />
        <ElTableColumn label="客户名称" min-width="220">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <span
                class="flex h-7 w-7 items-center justify-center rounded-full text-[12px] font-semibold text-white"
                :style="{ background: row.clientColor }"
              >
                {{ row.clientShort }}
              </span>
              <span class="text-g-800">{{ row.client }}</span>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn label="成交金额" min-width="130">
          <template #default="{ row }">
            <span class="font-medium text-g-900">{{ row.amount }}</span>
          </template>
        </ElTableColumn>
        <ElTableColumn label="状态" width="120">
          <template #default="{ row }">
            <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
              {{ row.status }}
            </span>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="date" label="成交日期" min-width="140" />
        <ElTableColumn prop="rep" label="销售代表" min-width="120" />
        <ElTableColumn prop="priority" label="优先级" width="100" />
        <ElTableColumn label="操作" width="120" align="center">
          <template #default>
            <div class="flex items-center justify-center gap-2">
              <ArtButtonTable type="edit" />
              <ArtButtonTable type="delete" />
            </div>
          </template>
        </ElTableColumn>
      </ElTable>
    </div>

    <footer class="flex items-center justify-between gap-4 px-5 py-5 text-sm text-g-700">
      <p class="whitespace-nowrap">共 {{ dealPagination.total }} 条数据</p>
      <ElPagination
        v-model:current-page="dealPagination.current"
        v-model:page-size="dealPagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="dealPagination.total"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
  import { reactive } from 'vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { crmTableCellStyle, crmTableHeaderCellStyle, dealTable } from '../shared'

  const dealPagination = reactive({
    current: 4,
    size: 6,
    total: 30
  })
</script>
