<template>
  <div>
    <ElCard shadow="never" header="校历配置">
      <ElForm :model="form" label-width="100px" style="max-width: 520px" v-loading="loading">
        <ElFormItem label="展示模式"><ElRadioGroup v-model="form.viewMode"><ElRadio value="image">图片模式</ElRadio><ElRadio value="calendar">日历视图</ElRadio></ElRadioGroup></ElFormItem>
        <ElFormItem label="图片地址"><ElInput v-model="form.imageUrl" placeholder="图片模式下的校历图片 URL" /></ElFormItem>
        <ElFormItem>
          <ElButton type="primary" :disabled="!settingId" @click="handleSave">保存</ElButton>
          <span v-if="!settingId" class="ml-2 text-gray-400 text-sm">暂无校历配置</span>
        </ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/wise'
const loading = ref(false); const settingId = ref<number|null>(null); const form = ref<any>({ viewMode: 'image', imageUrl: '' })
async function loadData() { loading.value = true; try { const res: any = await api.fetchCalendar(); if (res) { settingId.value = res.id; form.value = { viewMode: res.viewMode, imageUrl: res.imageUrl || '' } } } finally { loading.value = false } }
async function handleSave() { if (!settingId.value) return; try { await api.fetchUpdateCalendar(settingId.value, { viewMode: form.value.viewMode, imageUrl: form.value.imageUrl }); loadData() } catch {} }
onMounted(loadData)
</script>
