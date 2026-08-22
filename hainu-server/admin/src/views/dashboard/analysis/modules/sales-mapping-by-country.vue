<template>
  <div class="art-card-sm h-82 p-5 mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>全国销售分布</h4>
      </div>
    </div>

    <ArtRingChart
      :data="[
        { value: 30, name: '北京' },
        { value: 25, name: '上海' },
        { value: 45, name: '广州' }
      ]"
      :colors="mapChartColors"
      :radius="['46%', '60%']"
    />
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { DEFAULT_CHART_THEME_COLORS } from '@/config/modules/theme-studio/defaults'
  import { useSettingStore } from '@/store/modules/setting'

  const { themeCustomizer } = storeToRefs(useSettingStore())

  const mapChartColors = computed(() => {
    const colors = themeCustomizer.value.chartThemeColors.length
      ? themeCustomizer.value.chartThemeColors
      : DEFAULT_CHART_THEME_COLORS

    return colors.slice(0, 3)
  })
</script>
