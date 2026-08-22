<template>
  <article class="art-card-sm overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">互动指标</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElInput placeholder="搜索用户" class="w-full sm:!w-[180px]" />
        <ElDropdown trigger="click" placement="bottom-end">
          <ElButton type="primary">
            排序
            <ElIcon class="el-icon--right">
              <ArrowDown />
            </ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>按会话数排序</ElDropdownItem>
              <ElDropdownItem>按浏览量排序</ElDropdownItem>
              <ElDropdownItem>按转化率排序</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </header>
    <ElTable
      :data="engagementRows"
      row-key="id"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn prop="id" label="序号" width="72" />
      <ElTableColumn label="用户" min-width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <img :src="row.avatar" :alt="row.user" class="h-9 w-9 rounded-full object-cover" />
            <span class="font-medium text-g-900">{{ row.user }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="sessions" label="会话数" min-width="110" />
      <ElTableColumn label="国家" min-width="160">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <span class="text-xl">{{ row.flag }}</span>
            <span>{{ row.country }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="views" label="页面浏览量" min-width="130" />
      <ElTableColumn prop="bounce" label="跳出率" min-width="130" />
      <ElTableColumn prop="conversion" label="转化率" min-width="140" />
    </ElTable>
    <footer class="flex items-center justify-between gap-4 px-5 py-5 text-sm text-g-700">
      <p class="whitespace-nowrap">共 {{ engagementPagination.total }} 条数据</p>
      <ElPagination
        v-model:current-page="engagementPagination.current"
        v-model:page-size="engagementPagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="engagementPagination.total"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { ArrowDown } from '@element-plus/icons-vue'
  import { reactive } from 'vue'
  import { engagementRows, tableCellStyle, tableHeaderCellStyle } from '../shared'

  const engagementPagination = reactive({
    current: 1,
    size: 5,
    total: 5
  })
</script>
