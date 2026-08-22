<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">内容洞察</h3>
    </header>
    <ElTable
      :data="postRows"
      row-key="name"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn label="帖子名称">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <span
              class="flex h-10 w-10 items-center justify-center rounded-[10px]"
              :class="row.iconClass"
            >
              <ArtSvgIcon :icon="row.icon" class="text-lg" />
            </span>
            <span class="truncate font-medium text-g-900">{{ row.name }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="date" label="发布时间" width="100" />
      <ElTableColumn label="平台" width="120">
        <template #default="{ row }">
          <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.platformClass">
            {{ row.platform }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="views" label="浏览量" width="100" />
    </ElTable>
  </article>
</template>

<script setup lang="ts">
  import { postRows, tableCellStyle, tableHeaderCellStyle } from '../shared'
</script>
