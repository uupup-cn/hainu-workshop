<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">考勤概览</h3>
    </header>
    <div class="px-5 pb-4 pt-4">
      <AttendanceOverviewChart :data="attendanceChartData" :total="4218" height="208px" />

      <div class="mt-5 space-y-3.5">
        <div
          v-for="item in attendanceLegend"
          :key="item.label"
          class="flex items-center justify-between gap-3 text-[15px]"
        >
          <span class="flex items-center gap-3 text-g-800">
            <span class="h-2.5 w-2.5 rounded-full" :style="{ background: item.color }"></span>
            {{ item.label }}
          </span>
          <span class="font-semibold text-g-900">{{ item.value }}</span>
        </div>
      </div>

      <ElButton class="mt-7 !h-11 !w-full" plain>
        查看完整统计
        <i class="ri-arrow-right-line ml-2"></i>
      </ElButton>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import AttendanceOverviewChart from './attendance-overview-chart.vue'
  import { buildAttendanceLegend, useHrmUiConfig } from '../shared'

  const { chartColors } = useHrmUiConfig()

  const attendanceLegend = computed(() => buildAttendanceLegend(chartColors))

  const attendanceChartData = computed(() =>
    attendanceLegend.value.map((item) => ({
      label: item.label,
      value: Number(item.value.replace(/,/g, '')),
      color: item.color
    }))
  )
</script>
