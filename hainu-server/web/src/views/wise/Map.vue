<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">校园地图</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="campuses.length === 0" class="empty">暂无地图数据</div>
    <template v-else>
      <!-- 校区 Tab -->
      <AppPillTabs :items="campuses" label-key="campus" value-key="campus" :model-value="activeCampus" wrap @update:model-value="(v) => switchCampus(String(v))" />

      <!-- 海甸校区：720 全景 -->
      <div v-if="isHaidian" class="pano-wrap">
        <iframe :src="panoramaUrl" allowfullscreen class="pano" title="海甸校区全景地图"></iframe>
        <a class="open-link" :href="panoramaUrl" target="_blank" rel="noopener">新窗口打开全景 <LucideIcon name="arrow-right" :size="14" /></a>
      </div>
      <!-- 其他校区：静态地图图片 -->
      <template v-else>
        <div v-if="detailLoading" class="loading">加载中…</div>
        <div v-else-if="detail?.mapImageUrl" class="map-img-wrap">
          <img :src="detail.mapImageUrl" :alt="activeCampus + ' 地图'" class="map-img" />
        </div>
        <div v-else class="empty">该校区暂无地图图片</div>
      </template>

      <!-- 地点标注 -->
      <div class="card">
        <h3 class="card-title"><LucideIcon name="module-map" :size="20" /> 地点标注</h3>
        <div v-if="detailLoading" class="loading">加载中…</div>
        <div v-else-if="markers.length === 0" class="empty">暂无标注点</div>
        <div v-for="m in markers" :key="m.id" class="marker-item">
          <div class="marker-head">
            <b>{{ m.buildingName }}</b>
            <span class="tag num">({{ m.positionX }}, {{ m.positionY }})</span>
          </div>
          <p v-if="m.description" class="marker-desc">{{ m.description }}</p>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { wiseApi } from '../../api'
import { LucideIcon } from '@/components/icons'
import { AppPillTabs } from '@/components/base'

/** 海甸校区 720 全景地址 */
const PANORAMA_URL = 'https://www.720yun.com/t/9cvkbhfegpl?scene_id=130130450'

const loading = ref(true)
const campuses = ref<any[]>([])
const activeCampus = ref('')
const detail = ref<any>(null)
const detailLoading = ref(false)

const panoramaUrl = PANORAMA_URL
const isHaidian = computed(() => activeCampus.value.includes('海甸'))
const markers = computed(() => detail.value?.markers || [])

async function switchCampus(campus: string) {
  if (activeCampus.value === campus) return
  activeCampus.value = campus
  detail.value = null
  detailLoading.value = true
  try {
    const res = await wiseApi.mapDetail(campus)
    detail.value = res.data
  } catch {
    detail.value = null
  } finally {
    detailLoading.value = false
  }
}

onMounted(async () => {
  try {
    const res = await wiseApi.maps()
    campuses.value = res.data || []
    if (campuses.value.length) await switchCampus(campuses.value[0].campus)
  } catch (e: any) {
    alert(e.message || '加载失败，请稍后重试')
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.pano-wrap { margin-bottom: 16px; }
.pano { width: 100%; height: 60vh; border: none; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.open-link { display: inline-block; margin-top: 8px; font-size: 13px; }
.map-img-wrap { margin-bottom: 16px; }
.map-img { display: block; width: 100%; border-radius: var(--radius-lg); box-shadow: var(--shadow-card); }
.marker-item { padding: 10px 0; border-bottom: 1px solid var(--neutral-100); }
.marker-item:last-child { border-bottom: none; }
.marker-head { display: flex; align-items: center; justify-content: space-between; gap: 8px; font-size: 15px; color: var(--neutral-900); }
.marker-desc { margin: 4px 0 0; font-size: 13px; color: var(--neutral-500); }
@media (max-width: 768px) { .pano { height: 60vh; } }
</style>
