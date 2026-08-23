<template>
  <div>
    <ElCard shadow="never" header="日历视图">
      <div v-loading="loading">
        <template v-if="setting?.viewMode === 'image' && setting?.imageUrl">
          <img :src="setting.imageUrl" alt="校历图片" style="max-width: 100%; border-radius: 8px" />
        </template>
        <template v-else-if="setting?.viewMode === 'calendar'">
          <ElCalendar v-model="calendarDate">
            <template #date-cell="{ data }">
              <div :class="['calendar-cell', { 'is-today': data.isSelected }]">
                <span>{{ data.day.split('-').pop() }}</span>
              </div>
            </template>
          </ElCalendar>
        </template>
        <ElEmpty v-else description="暂无校历视图数据，请先在校历配置中设置" />
      </div>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/wise'
const loading = ref(false); const setting = ref<any>(null); const calendarDate = ref(new Date())
async function loadData() { loading.value = true; try { const res: any = await api.fetchCalendar(); setting.value = res } finally { loading.value = false } }
onMounted(loadData)
</script>
<style scoped>.calendar-cell { height: 100%; display: flex; align-items: center; justify-content: center; } .is-today { background: var(--el-color-primary-light-9); border-radius: 4px; }</style>
