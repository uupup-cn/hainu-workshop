<template>
  <div>
    <ElCard shadow="never" class="mb-4" header="地图列表">
      <div class="mb-4 text-sm text-gray-400">选择地图后可管理其标注点</div>
      <ArtTable :loading="mapLoading" :data="mapData" :columns="mapColumns" highlight-current-row @current-change="handleMapSelect">
        <ElTableColumn prop="campus" label="校区" width="140" />
        <ElTableColumn prop="mapImageUrl" label="地图图片" />
        <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openMapDialog(row)">编辑</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElCard shadow="never" header="标注点管理">
      <div class="mb-4"><ElButton type="primary" plain :disabled="!currentMapId" @click="openMarkerDialog()">新增标注点</ElButton><span v-if="!currentMapId" class="ml-2 text-gray-400 text-sm">请先在上方选择地图</span></div>
      <ArtTable :loading="markerLoading" :data="markerData" :columns="markerColumns">
        <ElTableColumn prop="buildingName" label="建筑名称" width="160" />
        <ElTableColumn prop="description" label="描述" />
        <ElTableColumn prop="positionX" label="X 坐标" width="100" />
        <ElTableColumn prop="positionY" label="Y 坐标" width="100" />
        <ElTableColumn prop="sortOrder" label="排序" width="80" />
        <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
        <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openMarkerDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleMarkerDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
    <ElDialog v-model="mapDialogVisible" :title="mapDialogTitle" width="500px">
      <ElForm :model="mapForm" label-width="90px">
        <ElFormItem label="校区"><ElInput v-model="mapForm.campus" /></ElFormItem>
        <ElFormItem label="地图图片"><ElInput v-model="mapForm.mapImageUrl" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="mapDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleMapSave">保存</ElButton></template>
    </ElDialog>
    <ElDialog v-model="markerDialogVisible" :title="markerDialogTitle" width="500px">
      <ElForm :model="markerForm" label-width="90px">
        <ElFormItem label="建筑名称"><ElInput v-model="markerForm.buildingName" /></ElFormItem>
        <ElFormItem label="描述"><ElInput v-model="markerForm.description" /></ElFormItem>
        <ElFormItem label="X 坐标"><ElInputNumber v-model="markerForm.positionX" :precision="3" :step="0.001" :min="0" :max="100" /></ElFormItem>
        <ElFormItem label="Y 坐标"><ElInputNumber v-model="markerForm.positionY" :precision="3" :step="0.001" :min="0" :max="100" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="markerForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="markerForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="markerDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleMarkerSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/wise'
const mapLoading = ref(false); const mapData = ref<any[]>([]); const mapColumns = ref([]); const currentMapId = ref<number|null>(null)
const markerLoading = ref(false); const markerData = ref<any[]>([]); const markerColumns = ref([])
const mapDialogVisible = ref(false); const mapDialogTitle = ref(''); const mapEditId = ref<number|null>(null); const mapForm = ref<any>({})
const markerDialogVisible = ref(false); const markerDialogTitle = ref(''); const markerEditId = ref<number|null>(null); const markerForm = ref<any>({})
async function loadMaps() { mapLoading.value = true; try { mapData.value = (await api.fetchMaps() ) as any[] } finally { mapLoading.value = false } }
function handleMapSelect(row: any) { currentMapId.value = row?.id || null; if (currentMapId.value) loadMarkers(); else markerData.value = [] }
async function loadMarkers() { if (!currentMapId.value) return; markerLoading.value = true; try { markerData.value = (await api.fetchMapMarkers(currentMapId.value) ) as any[] } finally { markerLoading.value = false } }
function openMapDialog(row: any) { mapEditId.value = row?.id || null; mapDialogTitle.value = '编辑地图'; mapForm.value = row ? {...row} : {}; mapDialogVisible.value = true }
async function handleMapSave() { try { if (mapEditId.value) await api.fetchUpdateMap(mapEditId.value, mapForm.value); mapDialogVisible.value = false; loadMaps() } catch {} }
function openMarkerDialog(row?: any) { markerEditId.value = row?.id || null; markerDialogTitle.value = row ? '编辑标注点' : '新增标注点'; markerForm.value = row ? {...row, positionX: Number(row.positionX), positionY: Number(row.positionY)} : { isActive: true, sortOrder: 0, positionX: 0, positionY: 0 }; markerDialogVisible.value = true }
async function handleMarkerSave() { try { if (!currentMapId.value) return; if (markerEditId.value) await api.fetchUpdateMapMarker(currentMapId.value, markerEditId.value, markerForm.value); else await api.fetchCreateMapMarker(currentMapId.value, markerForm.value); markerDialogVisible.value = false; loadMarkers() } catch {} }
async function handleMarkerDelete(row: any) { await ElMessageBox.confirm('确认删除该标注点？', '提示'); await api.fetchDeleteMapMarker(currentMapId.value!, row.id); loadMarkers() }
onMounted(loadMaps)
</script>
