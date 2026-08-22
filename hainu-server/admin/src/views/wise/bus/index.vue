<template>
  <div>
    <ElCard shadow="never">
      <ElTabs v-model="activeTab">
        <ElTabPane label="时刻表" name="schedules">
          <div class="mb-4"><ElButton type="primary" plain @click="openScheduleDialog()">新增时刻</ElButton></div>
          <ArtTable :loading="scheduleLoading" :data="scheduleData" :columns="scheduleColumns">
            <ElTableColumn prop="lineName" label="线路名称" width="140" />
            <ElTableColumn prop="departureTime" label="发车时间" width="100" />
            <ElTableColumn prop="departurePlace" label="出发地" width="120" />
            <ElTableColumn prop="destination" label="目的地" width="120" />
            <ElTableColumn prop="notes" label="备注" />
            <ElTableColumn prop="sortOrder" label="排序" width="80" />
            <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openScheduleDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleScheduleDelete(row)">删除</ElButton></template></ElTableColumn>
          </ArtTable>
        </ElTabPane>
        <ElTabPane label="车站" name="stations">
          <div class="mb-4"><ElButton type="primary" plain @click="openStationDialog()">新增车站</ElButton></div>
          <ArtTable :loading="stationLoading" :data="stationData" :columns="stationColumns">
            <ElTableColumn prop="stationName" label="车站名称" width="160" />
            <ElTableColumn prop="locationDesc" label="位置描述" />
            <ElTableColumn prop="lines" label="途经线路" />
            <ElTableColumn prop="sortOrder" label="排序" width="80" />
            <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openStationDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleStationDelete(row)">删除</ElButton></template></ElTableColumn>
          </ArtTable>
        </ElTabPane>
        <ElTabPane label="乘车指南" name="guide">
          <ElForm label-width="80px" style="max-width: 720px">
            <ElFormItem label="内容"><ElInput v-model="guideContent" type="textarea" :rows="12" v-loading="guideLoading" /></ElFormItem>
            <ElFormItem><ElButton type="primary" @click="handleGuideSave">保存</ElButton></ElFormItem>
          </ElForm>
        </ElTabPane>
      </ElTabs>
    </ElCard>
    <ElDialog v-model="scheduleDialogVisible" :title="scheduleDialogTitle" width="520px">
      <ElForm :model="scheduleForm" label-width="80px">
        <ElFormItem label="线路名称"><ElInput v-model="scheduleForm.lineName" /></ElFormItem>
        <ElFormItem label="发车时间"><ElInput v-model="scheduleForm.departureTime" placeholder="如 07:30" /></ElFormItem>
        <ElFormItem label="出发地"><ElInput v-model="scheduleForm.departurePlace" /></ElFormItem>
        <ElFormItem label="目的地"><ElInput v-model="scheduleForm.destination" /></ElFormItem>
        <ElFormItem label="备注"><ElInput v-model="scheduleForm.notes" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="scheduleForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="scheduleForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="scheduleDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleScheduleSave">保存</ElButton></template>
    </ElDialog>
    <ElDialog v-model="stationDialogVisible" :title="stationDialogTitle" width="520px">
      <ElForm :model="stationForm" label-width="80px">
        <ElFormItem label="车站名称"><ElInput v-model="stationForm.stationName" /></ElFormItem>
        <ElFormItem label="位置描述"><ElInput v-model="stationForm.locationDesc" /></ElFormItem>
        <ElFormItem label="途经线路"><ElInput v-model="stationForm.lines" placeholder="多个线路用逗号分隔" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="stationForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="stationForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="stationDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleStationSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/wise'
const activeTab = ref('schedules')
const scheduleLoading = ref(false); const scheduleData = ref<any[]>([]); const scheduleColumns = ref([])
const stationLoading = ref(false); const stationData = ref<any[]>([]); const stationColumns = ref([])
const guideLoading = ref(false); const guideContent = ref('')
const scheduleDialogVisible = ref(false); const scheduleDialogTitle = ref(''); const scheduleEditId = ref<number|null>(null); const scheduleForm = ref<any>({})
const stationDialogVisible = ref(false); const stationDialogTitle = ref(''); const stationEditId = ref<number|null>(null); const stationForm = ref<any>({})
async function loadSchedules() { scheduleLoading.value = true; try { scheduleData.value = (await api.fetchAdminBusSchedules() ) as any[] } finally { scheduleLoading.value = false } }
async function loadStations() { stationLoading.value = true; try { stationData.value = (await api.fetchAdminBusStations() ) as any[] } finally { stationLoading.value = false } }
async function loadGuide() { guideLoading.value = true; try { const res: any = await api.fetchBusGuide(); guideContent.value = res?.content || '' } finally { guideLoading.value = false } }
function openScheduleDialog(row?: any) { scheduleEditId.value = row?.id || null; scheduleDialogTitle.value = row ? '编辑' : '新增'; scheduleForm.value = row ? {...row} : { isActive: true, sortOrder: 0 }; scheduleDialogVisible.value = true }
async function handleScheduleSave() { try { if (scheduleEditId.value) await api.fetchUpdateBusSchedule(scheduleEditId.value, scheduleForm.value); else await api.fetchCreateBusSchedule(scheduleForm.value); scheduleDialogVisible.value = false; loadSchedules() } catch {} }
async function handleScheduleDelete(row: any) { await ElMessageBox.confirm('确认删除该时刻？', '提示'); await api.fetchDeleteBusSchedule(row.id); loadSchedules() }
function openStationDialog(row?: any) { stationEditId.value = row?.id || null; stationDialogTitle.value = row ? '编辑' : '新增'; stationForm.value = row ? {...row} : { isActive: true, sortOrder: 0 }; stationDialogVisible.value = true }
async function handleStationSave() { try { if (stationEditId.value) await api.fetchUpdateBusStation(stationEditId.value, stationForm.value); else await api.fetchCreateBusStation(stationForm.value); stationDialogVisible.value = false; loadStations() } catch {} }
async function handleStationDelete(row: any) { await ElMessageBox.confirm('确认删除该车站？', '提示'); await api.fetchDeleteBusStation(row.id); loadStations() }
async function handleGuideSave() { try { await api.fetchUpdateBusGuide({ content: guideContent.value }) } catch {} }
onMounted(() => { loadSchedules(); loadStations(); loadGuide() })
</script>
