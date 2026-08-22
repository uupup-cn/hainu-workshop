<template>
  <article class="art-card-sm flex h-[520px] flex-col overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">最近发票</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElSelect v-model="invoiceFilter" class="w-full sm:!w-[130px]">
          <ElOption
            v-for="option in invoiceFilterOptions"
            :key="option.value"
            :label="option.label"
            :value="option.value"
          />
        </ElSelect>
        <ElInput v-model="invoiceKeyword" placeholder="搜索客户或订单" class="w-full sm:!w-[200px]">
          <template #prefix>
            <i class="ri-search-line text-g-500"></i>
          </template>
        </ElInput>
      </div>
    </header>

    <ElScrollbar class="w-full flex-1">
      <div class="px-5 pb-4">
        <ElTable
          :data="pagedInvoices"
          row-key="id"
          size="large"
          :border="false"
          table-layout="auto"
          :header-cell-style="tableHeaderCellStyle"
          :cell-style="tableCellStyle"
        >
          <ElTableColumn type="selection" width="52" />
          <ElTableColumn prop="orderNo" label="编号" min-width="110" />
          <ElTableColumn label="客户" min-width="240">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <img
                  :src="row.avatar"
                  :alt="row.customer"
                  class="h-10 w-10 rounded-full object-cover"
                />
                <div class="min-w-0">
                  <p class="truncate text-[15px] font-semibold text-g-900">{{ row.customer }}</p>
                  <p class="truncate text-[13px] text-g-600">{{ row.email }}</p>
                </div>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="下单日期" min-width="150">
            <template #default="{ row }">
              <div>
                <p class="text-[15px] font-medium text-g-900">{{ row.date }}</p>
                <p class="mt-1 text-[12px] text-g-600">{{ row.time }}</p>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn label="商品" min-width="120">
            <template #default="{ row }">
              <div class="flex items-center">
                <img
                  v-for="(item, index) in row.productImages"
                  :key="`${row.id}-${index}`"
                  :src="item"
                  alt="商品"
                  class="-ml-2 h-8 w-8 rounded-full border-2 border-white object-cover first:ml-0 dark:border-[var(--default-box-color)]"
                />
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="price" label="金额" min-width="100" />
          <ElTableColumn label="状态" min-width="110">
            <template #default="{ row }">
              <span
                class="rounded-full px-3 py-1 text-[11px] font-semibold"
                :class="getInvoiceStatusClass(row.status)"
              >
                {{ row.status }}
              </span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="96" align="center">
            <template #default>
              <ArtButtonTable type="view" />
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElScrollbar>

    <footer
      class="flex flex-col gap-3 border-t border-[var(--default-border)] px-5 py-5 text-sm text-g-700 md:flex-row md:items-center md:justify-between"
    >
      <p>当前显示 {{ pagedInvoices.length }} 条，共 {{ filteredInvoices.length }} 条</p>
      <ElPagination
        v-model:current-page="invoicePagination.current"
        v-model:page-size="invoicePagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="filteredInvoices.length"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { computed, reactive, ref, watch } from 'vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import {
    getInvoiceStatusClass,
    invoiceFilterOptions,
    invoiceRows,
    useSalesUiConfig
  } from '../shared'

  const invoicePagination = reactive({
    current: 1,
    size: 5
  })

  const invoiceFilter = ref('all')
  const invoiceKeyword = ref('')

  const filteredInvoices = computed(() => {
    const keyword = invoiceKeyword.value.trim().toLowerCase()

    return invoiceRows.filter((item) => {
      const matchStatus = invoiceFilter.value === 'all' || item.status === invoiceFilter.value
      const matchKeyword =
        !keyword ||
        item.customer.toLowerCase().includes(keyword) ||
        item.orderNo.toLowerCase().includes(keyword)

      return matchStatus && matchKeyword
    })
  })

  watch(filteredInvoices, (rows) => {
    const maxPage = Math.max(1, Math.ceil(rows.length / invoicePagination.size))
    if (invoicePagination.current > maxPage) {
      invoicePagination.current = maxPage
    }
  })

  const pagedInvoices = computed(() => {
    const start = (invoicePagination.current - 1) * invoicePagination.size
    return filteredInvoices.value.slice(start, start + invoicePagination.size)
  })

  const { tableCellStyle, tableHeaderCellStyle } = useSalesUiConfig()
</script>
