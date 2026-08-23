<template>
  <div class="container">
    <button class="btn btn-plain btn-sm back" @click="goBack">← 返回</button>
    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="error" class="empty">{{ error }}</div>
    <div v-else-if="detail" class="card">
      <h3 class="card-title">{{ detail.topicTitle }}</h3>
      <div class="meta">{{ detail.campus }}</div>
      <div class="content">{{ detail.content }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { freshmanApi } from '../../api'

const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref('')
const detail = ref<any>(null)

const goBack = () => router.back()

onMounted(async () => {
  try {
    const res = await freshmanApi.lifeTopic(String(route.params.key))
    detail.value = res.data
  } catch (e: any) {
    error.value = e.message || '攻略不存在或已下线'
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.back { margin-bottom: 12px; }
.meta { margin: -4px 0 12px; font-size: 12px; color: var(--neutral-500); }
.content { white-space: pre-wrap; color: var(--neutral-700); }
</style>
