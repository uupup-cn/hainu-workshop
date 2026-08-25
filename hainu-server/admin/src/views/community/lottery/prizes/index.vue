<template>
  <div>
    <ElCard shadow="never" class="mb-3">
      <div class="flex items-center gap-3">
        <span class="text-gray-500 text-sm">选择活动：</span>
        <ElSelect v-model="activityId" placeholder="请选择活动" filterable style="width: 280px" @change="onActivityChange">
          <ElOption v-for="a in activities" :key="a.id" :label="a.name" :value="a.id" />
        </ElSelect>
        <ElTag v-if="current" :type="statusType(current.status)" size="small">{{ statusLabel(current.status) }}</ElTag>
      </div>
    </ElCard>
    <template v-if="activityId">
      <ElRow :gutter="16" class="mb-3">
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">奖品总数</div><div class="text-2xl font-bold mt-2">{{ stats.total }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">奖品总数量</div><div class="text-2xl font-bold mt-2">{{ stats.quantity }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">剩余总量</div><div class="text-2xl font-bold mt-2">{{ stats.remaining }}</div></ElCard></ElCol>
        <ElCol :span="6"><ElCard shadow="never"><div class="text-gray-500 text-sm">概率合计</div><div class="text-2xl font-bold mt-2">{{ stats.probability }}%</div></ElCard></ElCol>
      </ElRow>
      <ElCard shadow="never" class="mb-3" header="活动说明">
        <ArtWangEditor v-model="description" height="300px" :excludeKeys="['uploadImage', 'insertVideo', 'uploadVideo']" />
        <div class="mt-2"><ElButton type="primary" @click="handleSaveDescription">保存说明</ElButton></div>
      </ElCard>
      <ElCard shadow="never">
        <div class="mb-4"><ElButton type="primary" plain @click="openPrizeDialog()">新增奖品</ElButton></div>
        <ArtTable :loading="prizeLoading" :data="prizeData" :columns="prizeColumns">
          <ElTableColumn prop="name" label="奖品名称" min-width="140" />
          <ElTableColumn label="图片" width="90"><template #default="{ row }"><ElImage v-if="row.image" :src="row.image" :preview-src-list="[row.image]" fit="cover" style="width: 40px; height: 40px" /></template></ElTableColumn>
          <ElTableColumn prop="quantity" label="数量" width="80" />
          <ElTableColumn prop="remaining" label="剩余" width="80" />
          <ElTableColumn label="概率" width="90"><template #default="{ row }">{{ (Number(row.probability) * 100).toFixed(2) }}%</template></ElTableColumn>
          <ElTableColumn prop="sortOrder" label="排序" width="80" />
          <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" link type="primary" @click="openPrizeDialog(row)">编辑</ElButton><ElButton size="small" link type="danger" @click="handlePrizeDelete(row)">删除</ElButton></template></ElTableColumn>
        </ArtTable>
      </ElCard>
    </template>
    <ElCard v-else shadow="never"><ElEmpty description="请先选择一个活动" /></ElCard>
    <ElDialog v-model="prizeDialogVisible" :title="prizeDialogTitle" width="520px">
      <ElForm :model="prizeForm" label-width="90px">
        <ElFormItem label="奖品名称"><ElInput v-model="prizeForm.name" /></ElFormItem>
        <ElFormItem label="图片地址"><ElInput v-model="prizeForm.image" /></ElFormItem>
        <ElFormItem label="数量"><ElInputNumber v-model="prizeForm.quantity" :min="0" /></ElFormItem>
        <ElFormItem label="剩余"><ElInputNumber v-model="prizeForm.remaining" :min="0" /></ElFormItem>
        <ElFormItem label="概率"><ElInputNumber v-model="prizeForm.probability" :precision="4" :step="0.01" :min="0" :max="1" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="prizeForm.sortOrder" :min="0" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="prizeDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handlePrizeSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const ArtWangEditor = defineAsyncComponent(() => import('@/components/core/forms/art-wang-editor/index.vue'))
const activities = ref<any[]>([]); const activityId = ref<number | undefined>(undefined); const current = ref<any>(null)
const description = ref('')
const prizeLoading = ref(false); const prizeData = ref<any[]>([]); const prizeColumns = ref([])
const prizeDialogVisible = ref(false); const prizeDialogTitle = ref(''); const prizeEditId = ref<number|null>(null); const prizeForm = ref<any>({})
const statusMap: Record<string, { label: string; type: 'success' | 'info' | 'warning' }> = { unlisted: { label: '未上架', type: 'info' }, listed: { label: '已上架', type: 'success' }, active: { label: '进行中', type: 'success' }, ended: { label: '已结束', type: 'warning' }, off_shelf: { label: '已下架', type: 'info' } }
function statusLabel(s: string) { return statusMap[s]?.label || s }
function statusType(s: string) { return statusMap[s]?.type || 'info' }
const stats = computed(() => ({
  total: prizeData.value.length,
  quantity: prizeData.value.reduce((s, r) => s + (Number(r.quantity) || 0), 0),
  remaining: prizeData.value.reduce((s, r) => s + (Number(r.remaining) || 0), 0),
  probability: (prizeData.value.reduce((s, r) => s + (Number(r.probability) || 0), 0) * 100).toFixed(2),
}))
async function loadActivities() { try { const res: any = await api.fetchAdminLotteryActivities({ page: 1, size: 100 }); activities.value = res.list } catch {} }
async function onActivityChange() { if (!activityId.value) return; prizeLoading.value = true; try { const res: any = await api.fetchLotteryActivity(activityId.value); current.value = res; description.value = res.description || ''; prizeData.value = res.prizes || [] } finally { prizeLoading.value = false } }
async function handleSaveDescription() { if (!activityId.value) return; try { await api.fetchUpdateLotteryDescription(activityId.value, { description: description.value }); await onActivityChange() } catch {} }
function openPrizeDialog(row?: any) { prizeEditId.value = row?.id || null; prizeDialogTitle.value = row ? '编辑奖品' : '新增奖品'; prizeForm.value = row ? {...row, probability: Number(row.probability)} : { quantity: 0, remaining: 0, probability: 0, sortOrder: 0 }; prizeDialogVisible.value = true }
async function handlePrizeSave() { if (!activityId.value) return; try { if (prizeEditId.value) await api.fetchUpdateLotteryPrize(prizeEditId.value, prizeForm.value); else await api.fetchCreateLotteryPrize(activityId.value, prizeForm.value); prizeDialogVisible.value = false; onActivityChange() } catch {} }
async function handlePrizeDelete(row: any) { await ElMessageBox.confirm('确认删除该奖品？', '提示'); try { await api.fetchDeleteLotteryPrize(row.id); onActivityChange() } catch {} }
onMounted(loadActivities)
</script>
