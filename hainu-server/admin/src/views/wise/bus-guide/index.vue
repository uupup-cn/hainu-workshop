<template>
  <div>
    <ElCard shadow="never" v-loading="loading">
      <div class="mb-4"><ElButton type="primary" @click="handleSave">保存</ElButton></div>
      <ArtWangEditor v-model="guideContent" height="500px" :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']" />
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/wise'
const ArtWangEditor = defineAsyncComponent(() => import('@/components/core/forms/art-wang-editor/index.vue'))
const loading = ref(false); const guideContent = ref('')
async function loadData() { loading.value = true; try { const res: any = await api.fetchAdminBusGuide(); guideContent.value = res?.content || '' } finally { loading.value = false } }
async function handleSave() { try { await api.fetchUpdateBusGuide({ content: guideContent.value }) } catch {} }
onMounted(loadData)
</script>
