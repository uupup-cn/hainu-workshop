<template>
  <div>
    <ElCard shadow="never">
      <ElTabs v-model="activeTab">
        <ElTabPane label="分类管理" name="categories">
          <div class="mb-4"><ElButton type="primary" plain @click="openCatDialog()">新增分类</ElButton></div>
          <ArtTable :loading="catLoading" :data="catData" :columns="catColumns">
            <ElTableColumn prop="categoryName" label="分类名称" width="200" />
            <ElTableColumn prop="sortOrder" label="排序" width="80" />
            <ElTableColumn label="启用" width="80"><template #default="{ row }"><ElTag :type="row.isActive ? 'success' : 'info'">{{ row.isActive ? '启用' : '停用' }}</ElTag></template></ElTableColumn>
            <ElTableColumn label="操作" width="150" fixed="right"><template #default="{ row }"><ElButton size="small" @click="openCatDialog(row)">编辑</ElButton><ElButton size="small" type="danger" @click="handleCatDelete(row)">删除</ElButton></template></ElTableColumn>
          </ArtTable>
        </ElTabPane>
        <ElTabPane label="商品列表" name="items">
          <div class="mb-4 flex gap-2">
            <ElSelect v-model="status" placeholder="全部状态" clearable style="width: 160px" @change="handleFilter"><ElOption label="在售" value="active" /><ElOption label="已下架" value="auto_off" /></ElSelect>
            <ElSelect v-model="categoryId" placeholder="全部分类" clearable style="width: 180px" @change="handleFilter"><ElOption v-for="c in catData" :key="c.id" :label="c.categoryName" :value="c.id" /></ElSelect>
          </div>
          <ArtTable :loading="itemLoading" :data="itemData" :columns="itemColumns" :pagination="{ current: page, size, total }" @pagination:current-change="handlePage" @pagination:size-change="handleSize">
            <ElTableColumn prop="title" label="标题" min-width="160" />
            <ElTableColumn prop="price" label="价格" width="100" />
            <ElTableColumn label="分类" width="110"><template #default="{ row }">{{ row.category?.categoryName || '-' }}</template></ElTableColumn>
            <ElTableColumn label="发布人" width="110"><template #default="{ row }">{{ row.user?.nickname || row.user?.uid }}</template></ElTableColumn>
            <ElTableColumn label="状态" width="90"><template #default="{ row }"><ElTag :type="row.status === 'active' ? 'success' : 'info'">{{ row.status === 'active' ? '在售' : '已下架' }}</ElTag></template></ElTableColumn>
            <ElTableColumn prop="viewCount" label="浏览量" width="90" />
            <ElTableColumn label="发布时间" width="110"><template #default="{ row }">{{ (row.publishedAt || '').slice(0, 10) }}</template></ElTableColumn>
            <ElTableColumn label="操作" width="100" fixed="right"><template #default="{ row }"><ElButton size="small" type="danger" @click="handleDelete(row)">删除</ElButton></template></ElTableColumn>
          </ArtTable>
        </ElTabPane>
      </ElTabs>
    </ElCard>
    <ElDialog v-model="catDialogVisible" :title="catDialogTitle" width="500px">
      <ElForm :model="catForm" label-width="80px">
        <ElFormItem label="分类名称"><ElInput v-model="catForm.categoryName" /></ElFormItem>
        <ElFormItem label="排序"><ElInputNumber v-model="catForm.sortOrder" :min="0" /></ElFormItem>
        <ElFormItem label="启用"><ElSwitch v-model="catForm.isActive" /></ElFormItem>
      </ElForm>
      <template #footer><ElButton @click="catDialogVisible = false">取消</ElButton><ElButton type="primary" @click="handleCatSave">保存</ElButton></template>
    </ElDialog>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { ElMessageBox } from 'element-plus'
import * as api from '@/api/community'
const activeTab = ref('categories')
const catLoading = ref(false); const catData = ref<any[]>([]); const catColumns = ref([])
const itemLoading = ref(false); const itemData = ref<any[]>([]); const itemColumns = ref([]); const page = ref(1); const size = ref(20); const total = ref(0)
const status = ref(''); const categoryId = ref<number | ''>('')
const catDialogVisible = ref(false); const catDialogTitle = ref(''); const catEditId = ref<number|null>(null); const catForm = ref<any>({})
async function loadCategories() { catLoading.value = true; try { catData.value = (await api.fetchAdminMarketCategories() ) as any[] } finally { catLoading.value = false } }
async function loadItems() { itemLoading.value = true; try { const params: any = { page: page.value, size: size.value }; if (status.value) params.status = status.value; if (categoryId.value) params.categoryId = categoryId.value; const res: any = await api.fetchMarketItems(params); itemData.value = res.list; total.value = res.total } finally { itemLoading.value = false } }
function handleFilter() { page.value = 1; loadItems() }
function handlePage(val: number) { page.value = val; loadItems() }
function handleSize(val: number) { size.value = val; page.value = 1; loadItems() }
function openCatDialog(row?: any) { catEditId.value = row?.id || null; catDialogTitle.value = row ? '编辑分类' : '新增分类'; catForm.value = row ? {...row} : { isActive: true, sortOrder: 0 }; catDialogVisible.value = true }
async function handleCatSave() { try { if (catEditId.value) await api.fetchUpdateMarketCategory(catEditId.value, catForm.value); else await api.fetchCreateMarketCategory(catForm.value); catDialogVisible.value = false; loadCategories() } catch {} }
async function handleCatDelete(row: any) { await ElMessageBox.confirm('确认删除该分类？', '提示'); await api.fetchDeleteMarketCategory(row.id); loadCategories() }
async function handleDelete(row: any) { await ElMessageBox.confirm('确认删除该商品？', '提示'); await api.fetchDeleteMarketItem(row.id); loadItems() }
onMounted(() => { loadCategories(); loadItems() })
</script>
