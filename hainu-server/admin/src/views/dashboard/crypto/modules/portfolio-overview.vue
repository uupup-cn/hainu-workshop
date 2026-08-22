<template>
  <article class="art-card-sm overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">投资组合总览</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElDropdown trigger="click" placement="bottom-end">
          <ElButton>
            筛选
            <ElIcon class="el-icon--right">
              <ArrowDown />
            </ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>按持仓金额</ElDropdownItem>
              <ElDropdownItem>按 24 小时涨跌</ElDropdownItem>
              <ElDropdownItem>按市值排名</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
        <ElInput v-model="portfolioKeyword" placeholder="搜索资产" class="w-full sm:!w-[180px]" />
      </div>
    </header>

    <ElTable
      :data="filteredPortfolioRows"
      row-key="name"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn label="资产类型" min-width="190">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 items-center justify-center rounded-full text-base font-semibold"
              :class="row.iconClass"
            >
              <span v-if="row.iconText">{{ row.iconText }}</span>
              <ArtSvgIcon v-else :icon="row.icon!" class="text-lg" />
            </div>
            <span class="font-medium text-g-900">{{ row.name }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="balance" label="当前余额（币）" min-width="160" />
      <ElTableColumn prop="price" label="当前价格（美元）" min-width="160" />
      <ElTableColumn prop="total" label="总价值（美元）" min-width="160" />
      <ElTableColumn label="24小时涨跌" min-width="130">
        <template #default="{ row }">
          <span
            class="rounded-full px-2 py-1 text-[11px] font-semibold"
            :style="{ background: row.changeBg, color: row.changeColor }"
          >
            {{ row.change }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="profit" label="总盈亏（美元）" min-width="160" />
      <ElTableColumn prop="volume" label="24小时成交额（美元）" min-width="170" />
      <ElTableColumn prop="rank" label="市场排名" width="100" />
    </ElTable>

    <footer class="flex items-center justify-between gap-4 px-5 py-5 text-sm text-g-700">
      <p class="whitespace-nowrap">显示 6 条记录</p>
      <ElPagination
        v-model:current-page="portfolioPagination.current"
        v-model:page-size="portfolioPagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="portfolioPagination.total"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { ArrowDown } from '@element-plus/icons-vue'
  import { computed, reactive, ref } from 'vue'
  import { portfolioRows, tableCellStyle, tableHeaderCellStyle } from '../shared'

  const portfolioKeyword = ref('')

  const filteredPortfolioRows = computed(() => {
    const keyword = portfolioKeyword.value.trim().toLowerCase()
    if (!keyword) return portfolioRows
    return portfolioRows.filter((item) => item.name.toLowerCase().includes(keyword))
  })

  const portfolioPagination = reactive({
    current: 2,
    size: 10,
    total: 17
  })
</script>
