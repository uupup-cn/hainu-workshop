<template>
  <div>
    <ElCard shadow="never" header="找室友信息列表">
      <ArtTable :loading="loading" :data="tableData" :columns="columns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
        <ElTableColumn prop="name" label="姓名" width="100" />
        <ElTableColumn prop="contact" label="联系方式" width="140" />
        <ElTableColumn prop="campusName" label="校区" width="100" />
        <ElTableColumn prop="collegeName" label="书院" width="120" />
        <ElTableColumn prop="departmentName" label="学院" width="140" />
        <ElTableColumn prop="majorName" label="专业" width="140" />
        <ElTableColumn prop="buildingName" label="楼栋" width="110" />
        <ElTableColumn prop="roomNumber" label="房间号" width="90" />
        <ElTableColumn label="用户" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
        <ElTableColumn prop="modifyCount" label="修改次数" width="90" />
        <ElTableColumn label="发布时间" width="110"><template #default="{ row }">{{ (row.createdAt || '').slice(0, 10) }}</template></ElTableColumn>
        <ElTableColumn label="操作" width="100" fixed="right" as="right"><template #default="{ row }"><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
      </ArtTable>
    </ElCard>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/freshman'
const loading = ref(false); const tableData = ref<any[]>([]); const columns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
async function loadData() { loading.value = true; try { const res: any = await api.fetchRoommatePosts({ page: page.value, size: size.value }); tableData.value = res.list; total.value = res.total } finally { loading.value = false } }
function handlePage(val: number) { page.value = val; loadData() }
function handleSize(val: number) { size.value = val; page.value = 1; loadData() }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该信息？', '提示'); await api.fetchDeleteRoommatePost(row.id); loadData() }
onMounted(loadData)
</script>
