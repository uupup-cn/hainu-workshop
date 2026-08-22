<template>
  <article class="hrm-applicant-list art-card-sm overflow-hidden">
    <div
      class="flex flex-col gap-3 border-b-d px-5 py-4 lg:flex-row lg:items-center lg:justify-between"
    >
      <h3 class="text-[18px] font-semibold text-g-900">应聘者列表</h3>
      <div class="flex flex-col gap-3 sm:flex-row sm:items-center">
        <ElInput
          v-model="searchKeyword"
          placeholder="搜索编号 / 姓名 / 岗位"
          class="w-full sm:!w-[220px]"
        />
        <ElDropdown trigger="click" placement="bottom-end">
          <ElButton type="primary">
            排序方式
            <i class="ri-arrow-down-s-line ml-1"></i>
          </ElButton>
          <template #dropdown>
            <ElDropdownMenu>
              <ElDropdownItem>按申请日期</ElDropdownItem>
              <ElDropdownItem>按工作经验</ElDropdownItem>
              <ElDropdownItem>按状态</ElDropdownItem>
            </ElDropdownMenu>
          </template>
        </ElDropdown>
      </div>
    </div>

    <ElTable
      :data="filteredApplicants"
      row-key="id"
      size="large"
      :border="false"
      table-layout="auto"
      class="hrm-table"
      :header-cell-style="tableHeaderCellStyle"
      :cell-style="tableCellStyle"
    >
      <ElTableColumn type="selection" width="52" />
      <ElTableColumn prop="id" label="申请编号" min-width="130" />
      <ElTableColumn label="应聘者" min-width="180">
        <template #default="{ row }">
          <div class="flex items-center gap-3">
            <img :src="row.avatar" :alt="row.name" class="h-10 w-10 rounded-full object-cover" />
            <span class="font-medium text-g-900">{{ row.name }}</span>
          </div>
        </template>
      </ElTableColumn>
      <ElTableColumn prop="position" label="应聘岗位" min-width="180" />
      <ElTableColumn prop="date" label="申请日期" min-width="140" />
      <ElTableColumn prop="email" label="邮箱" min-width="240" />
      <ElTableColumn prop="experience" label="工作经验" min-width="120" />
      <ElTableColumn label="状态" min-width="140">
        <template #default="{ row }">
          <span class="rounded-full px-3 py-1 text-[11px] font-semibold" :class="row.statusClass">
            {{ row.status }}
          </span>
        </template>
      </ElTableColumn>
      <ElTableColumn label="操作" width="130" align="center" fixed="right">
        <template #default>
          <div class="flex items-center justify-center gap-2">
            <ArtButtonTable type="view" />
            <ArtButtonTable type="edit" />
            <ArtButtonTable type="delete" />
          </div>
        </template>
      </ElTableColumn>
    </ElTable>

    <footer
      class="flex flex-col gap-4 px-5 py-5 text-sm text-g-700 md:flex-row md:items-center md:justify-between"
    >
      <p>显示 {{ filteredApplicants.length }} 条记录</p>
      <ElPagination
        v-model:current-page="applicantPagination.current"
        v-model:page-size="applicantPagination.size"
        layout="prev, pager, next"
        :pager-count="5"
        :total="applicantPagination.total"
      />
    </footer>
  </article>
</template>

<script setup lang="ts">
  import { computed, reactive, ref } from 'vue'
  import ArtButtonTable from '@/components/core/forms/art-button-table/index.vue'
  import { applicantRows, useHrmUiConfig } from '../shared'

  const searchKeyword = ref('')

  const applicantPagination = reactive({
    current: 2,
    size: 5,
    total: 17
  })

  const filteredApplicants = computed(() => {
    const keyword = searchKeyword.value.trim().toLowerCase()
    if (!keyword) return applicantRows

    return applicantRows.filter((item) =>
      [item.id, item.name, item.position, item.email, item.status].some((field) =>
        field.toLowerCase().includes(keyword)
      )
    )
  })

  const { tableCellStyle, tableHeaderCellStyle } = useHrmUiConfig()
</script>
