<template>
  <article class="art-card-sm flex h-[622px] flex-col overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">社交媒体表现总览</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElInput v-model="tableKeyword" placeholder="搜索平台" class="w-full sm:!w-[180px]" />
        <ElDropdown trigger="click" placement="bottom-end">
          <ElButton type="primary">
            排序方式
            <ElIcon class="el-icon--right">
              <ArrowDown />
            </ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>按帖文数量排序</ElDropdownItem>
              <ElDropdownItem>按粉丝数排序</ElDropdownItem>
              <ElDropdownItem>按点击率排序</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </header>

    <ElScrollbar class="w-full flex-1">
      <div class="px-5 pb-4">
        <ElTable
          :data="filteredPerformanceRows"
          row-key="id"
          size="large"
          :border="false"
          table-layout="fixed"
          :header-cell-style="tableHeaderCellStyle"
          :cell-style="tableCellStyle"
        >
          <ElTableColumn type="selection" width="52" />
          <ElTableColumn label="平台">
            <template #default="{ row }">
              <div class="flex items-center gap-3">
                <div
                  class="flex h-10 w-10 items-center justify-center rounded-[10px] text-lg"
                  :class="row.iconClass"
                >
                  <ArtSvgIcon :icon="row.icon" class="text-lg" />
                </div>
                <span class="font-medium text-g-900">{{ row.platform }}</span>
              </div>
            </template>
          </ElTableColumn>
          <ElTableColumn prop="posts" label="帖子数" width="90" />
          <ElTableColumn prop="likes" label="点赞" width="100" />
          <ElTableColumn prop="shares" label="分享" width="100" />
          <ElTableColumn prop="comments" label="评论" width="100" />
          <ElTableColumn prop="impressions" label="曝光率" width="110" />
          <ElTableColumn prop="followers" label="粉丝数" width="110" />
          <ElTableColumn label="点击率" width="100">
            <template #default="{ row }">
              <span
                class="rounded-full px-2 py-1 text-[11px] font-semibold"
                :style="{ background: row.ctrBg, color: row.ctrColor }"
              >
                {{ row.ctr }}
              </span>
            </template>
          </ElTableColumn>
          <ElTableColumn label="操作" width="80" align="center">
            <template #default>
              <ArtButtonTable type="more" />
            </template>
          </ElTableColumn>
        </ElTable>
      </div>
    </ElScrollbar>

    <footer
      class="flex flex-col gap-3 px-5 py-5 text-sm text-g-700 sm:flex-row sm:items-center sm:justify-between"
    >
      <p>显示 6 条记录</p>
      <ElPagination
        v-model:current-page="performancePagination.current"
        v-model:page-size="performancePagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="performancePagination.total"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { ArrowDown } from '@element-plus/icons-vue'
  import { computed, reactive, ref } from 'vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { performanceRows, tableCellStyle, tableHeaderCellStyle } from '../shared'

  const tableKeyword = ref('')

  const filteredPerformanceRows = computed(() => {
    const keyword = tableKeyword.value.trim().toLowerCase()
    if (!keyword) return performanceRows
    return performanceRows.filter((item) => item.platform.toLowerCase().includes(keyword))
  })

  const performancePagination = reactive({
    current: 2,
    size: 10,
    total: 17
  })
</script>
