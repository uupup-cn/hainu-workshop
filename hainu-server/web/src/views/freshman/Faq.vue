<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">新生 FAQ</h2></div>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="error" class="empty">{{ error }}</div>
    <div v-else-if="categories.length === 0" class="empty">暂无常见问题</div>
    <template v-else>
      <!-- 搜索框 -->
      <input v-model.trim="keyword" class="input search" placeholder="搜索问题关键词，如：快递 / 军训 / 一卡通" />
      <!-- 分类横向 Tab -->
      <AppPillTabs :items="categories" label-key="categoryName" value-key="id" :model-value="activeId" @update:model-value="activeId = Number($event)" />
      <!-- 问题手风琴 -->
      <div class="card">
        <div v-if="questions.length === 0" class="empty">{{ keyword ? '没有找到相关问题' : '该分类下暂无问题' }}</div>
        <div v-for="q in questions" :key="q.id" class="faq-item">
          <button class="faq-q" @click="toggle(q.id)">
            <span class="q-text">{{ q.question }}</span>
            <LucideIcon name="arrow-down" :size="16" :class="['arrow', { open: expandedId === q.id }]" />
          </button>
          <div v-if="expandedId === q.id" class="faq-a">{{ q.answer }}</div>
        </div>
      </div>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { freshmanApi } from '../../api'
import { LucideIcon } from '@/components/icons'
import { AppPillTabs } from '@/components/base'

const loading = ref(true)
const error = ref('')
const categories = ref<any[]>([])
const activeId = ref(0)
const keyword = ref('')
const expandedId = ref(0)

/** 当前分类下按关键词过滤 question 字段 */
const questions = computed(() => {
  const cat = categories.value.find((c: any) => c.id === activeId.value)
  const list = cat?.questions || []
  if (!keyword.value) return list
  return list.filter((q: any) => (q.question || '').includes(keyword.value))
})

const toggle = (id: number) => { expandedId.value = expandedId.value === id ? 0 : id }

onMounted(async () => {
  try {
    const res = await freshmanApi.faqCategories()
    categories.value = res.data || []
    activeId.value = categories.value[0]?.id || 0
  } catch (e: any) {
    error.value = e.message || '加载失败，请稍后重试'
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.search { width: 100%; margin-bottom: 12px; }
.faq-item { border-bottom: 1px solid var(--neutral-100); }
.faq-item:last-child { border-bottom: none; }
.faq-q { display: flex; width: 100%; align-items: center; justify-content: space-between; gap: 8px; padding: 12px 0; border: none; background: none; cursor: pointer; text-align: left; font-size: 15px; font-weight: 500; color: var(--neutral-900); }
.arrow { color: var(--neutral-400); transition: transform 0.2s; }
.arrow.open { transform: rotate(180deg); }
.faq-a { padding: 0 0 12px; white-space: pre-wrap; color: var(--neutral-600); font-size: 14px; line-height: 22px; }
</style>
