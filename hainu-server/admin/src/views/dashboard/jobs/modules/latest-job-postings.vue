<template>
  <section class="art-card-sm overflow-hidden">
    <header
      class="border-b-d flex flex-col gap-3 px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">最新岗位发布</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索职位 / 公司 / 地点"
          clearable
          class="w-full sm:!w-[240px]"
        />
        <ElDropdown trigger="click" placement="bottom-end" @command="handleSortCommand">
          <ElButton type="primary">
            {{ currentSortLabel }}
            <ElIcon class="el-icon--right">
              <ArrowDown />
            </ElIcon>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem command="latest">按发布日期</ElDropdownItem>
              <ElDropdownItem command="applications">按申请人数</ElDropdownItem>
              <ElDropdownItem command="status">按状态</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </header>

    <ElTable
      class="jobs-posting-table"
      :data="pagedPostingRows"
      row-key="id"
      size="large"
      :border="false"
      table-layout="fixed"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn prop="id" label="序号" width="74" />
      <ElTableColumn prop="jobTitle" label="职位名称" min-width="180" />
      <ElTableColumn prop="department" label="部门" min-width="130" />
      <ElTableColumn prop="company" label="公司名称" min-width="150" />
      <ElTableColumn prop="location" label="地点" min-width="130" />
      <ElTableColumn prop="applications" label="申请人数" min-width="110" />
      <ElTableColumn label="状态" min-width="110" align="center">
        <template #default="{ row }">
          <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
            {{ row.status }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="发布人" min-width="160">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <img :src="row.avatar" :alt="row.publisher" class="h-9 w-9 rounded-full object-cover" />
            <span class="font-medium text-g-900">{{ row.publisher }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="date" label="发布日期" min-width="130" />
      <ElTableColumn label="操作" width="110" align="center" fixed="right">
        <template #default>
          <div class="flex items-center justify-center gap-2">
            <ArtButtonTable type="edit" />
            <ArtButtonTable type="delete" />
          </div>
        </template>
      </ElTableColumn>
    </ElTable>

    <footer
      class="flex flex-col gap-4 px-5 py-5 text-sm text-g-700 md:flex-row md:items-center md:justify-between"
    >
      <p>显示 {{ pagedPostingRows.length }} 条，共 {{ filteredPostingRows.length }} 条记录</p>
      <ElPagination
        v-model:current-page="postingPagination.current"
        v-model:page-size="postingPagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="filteredPostingRows.length"
      />
    </footer>
  </section>
</template>

<script setup lang="ts">
  import { ArrowDown } from '@element-plus/icons-vue'
  import { computed, reactive, ref, watch } from 'vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { allPostingRows, tableCellStyle, tableHeaderCellStyle } from '../shared'

  const searchKeyword = ref('')
  const currentSort = ref<'latest' | 'applications' | 'status'>('latest')

  const postingPagination = reactive({
    current: 1,
    size: 6
  })

  const currentSortLabel = computed(() => {
    const map = {
      latest: '按发布日期',
      applications: '按申请人数',
      status: '按状态'
    }

    return map[currentSort.value]
  })

  const filteredPostingRows = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    const rows = keyword
      ? allPostingRows.filter((item) =>
          [item.jobTitle, item.department, item.company, item.location, item.publisher]
            .join(' ')
            .toLowerCase()
            .includes(keyword)
        )
      : [...allPostingRows]

    return rows.sort((a, b) => {
      if (currentSort.value === 'applications') return b.applications - a.applications
      if (currentSort.value === 'status') return a.status.localeCompare(b.status, 'zh-CN')
      return b.date.localeCompare(a.date)
    })
  })

  const pagedPostingRows = computed(() => {
    const start = (postingPagination.current - 1) * postingPagination.size
    return filteredPostingRows.value.slice(start, start + postingPagination.size)
  })

  watch([searchKeyword, currentSort], () => {
    postingPagination.current = 1
  })

  const handleSortCommand = (command: 'latest' | 'applications' | 'status') => {
    currentSort.value = command
  }
</script>

<style scoped>
  .jobs-posting-table :deep(.el-table__inner-wrapper::before) {
    display: none;
  }
</style>
