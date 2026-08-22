<template>
  <article class="art-card-sm flex h-[560px] max-h-[560px] flex-col overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">今日出勤</h3>
      <ElDropdown trigger="click" placement="bottom-end">
        <span class="cursor-pointer text-sm text-g-600">
          排序方式
          <i class="ri-arrow-down-s-line ml-1"></i>
        </span>
        <template #dropdown>
          <ElDropdownMenu>
            <ElDropdownItem>按时间排序</ElDropdownItem>
            <ElDropdownItem>按状态排序</ElDropdownItem>
          </ElDropdownMenu>
        </template>
      </ElDropdown>
    </header>
    <ElScrollbar class="min-h-0 flex-1" height="100%">
      <ElTable
        :data="todayAttendanceRows"
        row-key="name"
        size="large"
        :border="false"
        table-layout="fixed"
        :header-cell-style="tableHeaderCellStyle"
        :cell-style="tableCellStyle"
      >
        <ElTableColumn label="姓名" min-width="180">
          <template #default="{ row }">
            <div class="flex items-center gap-3">
              <img :src="row.avatar" :alt="row.name" class="h-10 w-10 rounded-full object-cover" />
              <div>
                <p class="font-medium text-g-900">{{ row.name }}</p>
                <p class="text-[13px] text-g-600">{{ row.role }}</p>
              </div>
            </div>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="time" label="签到时间" width="120" />
        <ElTableColumn label="状态" width="130" align="center">
          <template #default="{ row }">
            <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
              {{ row.status }}
            </span>
          </template>
        </ElTableColumn>
      </ElTable>
    </ElScrollbar>
  </article>
</template>

<script setup lang="ts">
  import { todayAttendanceRows, useHrmUiConfig } from '../shared'

  const { tableCellStyle, tableHeaderCellStyle } = useHrmUiConfig()
</script>

<style scoped>
  :deep(.el-table),
  :deep(.el-table__inner-wrapper),
  :deep(.el-table__body-wrapper),
  :deep(.el-table__header-wrapper) {
    background: transparent;
  }

  :deep(.el-table__inner-wrapper::before) {
    display: none;
  }
</style>
