<template>
  <div class="login-log-page">
    <ElCard shadow="never" class="login-log-page__card">
      <template #header>
        <div class="panel-header">
          <span class="panel-header__title">登录日志</span>
          <ElButton :loading="loading" plain size="small" @click="loadData">刷新</ElButton>
        </div>
      </template>

      <ElTable
        v-loading="loading"
        :data="data"
        stripe
        border
        style="width: 100%"
        empty-text="暂无登录日志"
      >
        <ElTableColumn prop="username" label="用户" min-width="120">
          <template #default="{ row }">{{ row.username || '-' }}</template>
        </ElTableColumn>
        <ElTableColumn prop="ip" label="IP" min-width="140">
          <template #default="{ row }">{{ row.ip || '-' }}</template>
        </ElTableColumn>
        <ElTableColumn prop="status" label="状态" min-width="100" align="center">
          <template #default="{ row }">
            <ElTag :type="row.status === 'SUCCESS' ? 'success' : 'danger'" size="small" effect="light">
              {{ row.status === 'SUCCESS' ? '成功' : '失败' }}
            </ElTag>
          </template>
        </ElTableColumn>
        <ElTableColumn prop="createdAt" label="时间" min-width="170">
          <template #default="{ row }">{{ formatDateTime(row.createdAt) }}</template>
        </ElTableColumn>
      </ElTable>

      <div class="login-log-page__pagination">
        <ElPagination
          v-model:current-page="pagination.current"
          v-model:page-size="pagination.size"
          :total="pagination.total"
          :page-sizes="[10, 20, 50, 100]"
          layout="total, sizes, prev, pager, next, jumper"
          background
          @current-change="handleCurrentChange"
          @size-change="handleSizeChange"
        />
      </div>
    </ElCard>
  </div>
</template>

<script setup lang="ts">
  import { ref, onMounted, reactive } from 'vue'
  import {
    ElCard,
    ElTable,
    ElTableColumn,
    ElButton,
    ElPagination,
    ElTag
  } from 'element-plus'
  import { fetchLoginLogs } from '@/api/logs'
  import { formatDateTime } from '@/utils'

  defineOptions({ name: 'LoginLog' })

  type LoginLogItem = Api.Audit.LoginLogItem

  const loading = ref(false)
  const data = ref<LoginLogItem[]>([])
  const pagination = reactive({
    current: 1,
    size: 20,
    total: 0
  })

  const loadData = async () => {
    loading.value = true
    try {
      const res = await fetchLoginLogs({
        current: pagination.current,
        size: pagination.size
      })
      data.value = res?.records ?? []
      pagination.total = res?.total ?? 0
      if (typeof res?.current === 'number') pagination.current = res.current
      if (typeof res?.size === 'number') pagination.size = res.size
    } catch (e) {
      console.error('[登录日志] 加载失败', e)
      data.value = []
      pagination.total = 0
    } finally {
      loading.value = false
    }
  }

  const handleCurrentChange = (current: number) => {
    pagination.current = current
    loadData()
  }

  const handleSizeChange = (size: number) => {
    pagination.size = size
    pagination.current = 1
    loadData()
  }

  onMounted(loadData)
</script>

<style lang="scss" scoped>
  .login-log-page {
    display: flex;
    flex-direction: column;
    gap: 16px;
    padding-bottom: 20px;
  }

  .login-log-page__card {
    :deep(.el-card__body) {
      padding: 16px 20px 20px;
    }
  }

  .panel-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;

    &__title {
      font-size: 15px;
      font-weight: 600;
      color: var(--art-text-gray-900, #303133);
    }
  }

  .login-log-page__pagination {
    display: flex;
    justify-content: flex-end;
    margin-top: 16px;
  }
</style>
