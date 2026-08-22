<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">电话簿</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="categories.length === 0" class="empty">暂无电话数据</div>
    <template v-else>
      <!-- 校区分类切换 -->
      <div class="tabs">
        <button v-for="cat in categories" :key="cat.id" class="tab" :class="{ active: activeCat?.id === cat.id }" @click="switchCat(cat)">{{ cat.categoryName }}</button>
      </div>
      <div class="card">
        <div v-if="entries.length === 0" class="empty">该分类下暂无条目</div>
        <div v-for="e in entries" :key="e.id" class="list-item">
          <div>
            <div class="name">{{ e.departmentName }}</div>
            <div v-if="e.description" class="desc">{{ e.description }}</div>
          </div>
          <a class="btn btn-sm btn-plain num" :href="'tel:' + e.phoneNumber">{{ e.phoneNumber }}</a>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { wiseApi } from '../api'

const loading = ref(true)
const categories = ref<any[]>([])
const activeCat = ref<any>(null)
const entries = ref<any[]>([])

async function switchCat(cat: any) {
  activeCat.value = cat
  try {
    const res = await wiseApi.phonebookEntries(cat.id)
    entries.value = res.data || []
  } catch {
    entries.value = []
  }
}

onMounted(async () => {
  try {
    const res = await wiseApi.phonebookCategories()
    categories.value = res.data || []
    if (categories.value.length) await switchCat(categories.value[0])
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.tabs { display: flex; gap: 8px; flex-wrap: wrap; margin-bottom: 16px; }
.tab { padding: 6px 16px; border: 1px solid var(--neutral-200); background: var(--neutral-0); border-radius: var(--radius-full); color: var(--neutral-600); font-size: 14px; cursor: pointer; }
.tab.active { background: var(--primary-500); border-color: var(--primary-500); color: #fff; }
.name { font-size: 15px; font-weight: 500; color: var(--neutral-900); }
.desc { font-size: 12px; color: var(--neutral-500); }
</style>
