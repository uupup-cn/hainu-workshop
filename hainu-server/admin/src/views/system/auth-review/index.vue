<template>
  <div>
    <ElCard shadow="never">
      <ElTabs v-model="activeStatus" @tab-change="handleTabChange">
        <ElTabPane label="待审核" name="pending" />
        <ElTabPane label="已通过" name="approved" />
        <ElTabPane label="已驳回" name="rejected" />
        <ElTabPane label="全部" name="all" />
      </ElTabs>
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="userId" label="申请人ID" width="90" />
        <ElTableColumn prop="realName" label="姓名" width="110" />
        <ElTableColumn prop="studentNo" label="学号" width="130" />
        <ElTableColumn prop="major" label="专业" min-width="150" />
        <ElTableColumn label="证明图片" width="90"><template #default="{ row }"><ElImage v-if="row.proofImage" :src="row.proofImage" :preview-src-list="[row.proofImage]" preview-teleported fit="cover" style="width: 48px; height: 48px; border-radius: 4px" /><span v-else>暂无图片</span></template></ElTableColumn>
        <ElTableColumn label="申请时间" width="160"><template #default="{ row }">{{ formatTime(row.createdAt) }}</template></ElTableColumn>
        <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="statusTag(row.status)" size="small">{{ statusLabel(row.status) }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton v-if="row.status === 'pending'" size="small" type="primary" @click="openReview(row)">审核</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="reviewVisible" title="认证审核" width="480px">
      <ElForm :model="reviewForm" label-width="80px">
        <ElFormItem label="审核结果"><ElRadioGroup v-model="reviewForm.status"><ElRadio value="approved">通过</ElRadio><ElRadio value="rejected">驳回</ElRadio></ElRadioGroup></ElFormItem>
        <ElFormItem label="备注"><ElInput v-model="reviewForm.reviewRemark" type="textarea" :rows="3" maxlength="200" show-word-limit placeholder="选填，驳回时建议填写原因" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="reviewVisible = false">取消</ElButton><ElButton type="primary" @click="handleReview">提交</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import * as api from '@/api/app-user'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const activeStatus = ref('pending'); const reviewVisible = ref(false); const reviewId = ref<number | null>(null); const reviewForm = ref<{ status: string; reviewRemark: string }>({ status: 'approved', reviewRemark: '' })
const statusMap: Record<string, string> = { pending: '待审核', approved: '已通过', rejected: '已驳回' }
const statusTagMap: Record<string, string> = { pending: 'warning', approved: 'success', rejected: 'danger' }
function statusLabel(v: string) { return statusMap[v] || v }
function statusTag(v: string): 'primary' | 'success' | 'warning' | 'info' | 'danger' { return statusTagMap[v] as 'primary' | 'success' | 'warning' | 'info' | 'danger' || 'info' }
function formatTime(v: string) { return (v || '').replace('T', ' ').slice(0, 16) }
async function loadData() { loading.value = true; try { const params: any = { page: page.value, size: size.value }; if (activeStatus.value !== 'all') params.status = activeStatus.value; const res: any = await api.fetchAuthApplications(params); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handleTabChange() { page.value = 1; loadData() }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
function openReview(row: any) { reviewId.value = row.id; reviewForm.value = { status: 'approved', reviewRemark: '' }; reviewVisible.value = true }
async function handleReview() { try { if (reviewId.value != null) await api.fetchReviewAuth(reviewId.value, { status: reviewForm.value.status, reviewRemark: reviewForm.value.reviewRemark }); reviewVisible.value = false; loadData() } catch {} }
onMounted(loadData)
</script>
