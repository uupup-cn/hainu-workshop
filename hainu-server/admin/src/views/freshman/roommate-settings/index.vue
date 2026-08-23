<template>
  <div>
    <ElCard shadow="never" header="找室友功能配置">
      <ElForm :model="settings" label-width="100px" style="max-width: 420px">
        <ElFormItem label="功能开关"><ElSwitch v-model="settings.isEnabled" /></ElFormItem>
        <ElFormItem label="最大修改次数"><ElInputNumber v-model="settings.maxModifyCount" :min="0" /></ElFormItem>
        <ElFormItem><ElButton type="primary" @click="handleSaveSettings">保存配置</ElButton></ElFormItem>
      </ElForm>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/freshman'
const settings = ref<any>({ isEnabled: true, maxModifyCount: 3 })
async function loadSettings() { const res: any = await api.fetchRoommateSettings(); if (res) settings.value = { ...res } }
async function handleSaveSettings() { try { await api.fetchUpdateRoommateSettings({ isEnabled: settings.value.isEnabled, maxModifyCount: settings.value.maxModifyCount }) } catch {} }
onMounted(loadSettings)
</script>
