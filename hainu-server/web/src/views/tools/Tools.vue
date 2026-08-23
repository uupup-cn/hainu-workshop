<template>
  <div class="container">
    <div class="page-header">
      <h2 class="page-title">工具箱</h2>
      <span class="tag tag-mint">🎉 所有工具当前免费</span>
    </div>

    <!-- 未登录引导 -->
    <div v-if="!userStore.isLoggedIn" class="card center">
      <div class="lead-icon">🧰</div>
      <p class="lead-tip">登录后即可使用骰子、计算器、证件照、人格测试等全部工具</p>
      <button class="btn" @click="userStore.openLoginDialog()">登录使用工具箱</button>
    </div>

    <template v-else>
      <div v-if="loading" class="loading">加载中…</div>
      <div v-else-if="groups.length === 0" class="empty">暂无可用工具</div>
      <section v-for="g in groups" :key="g.id" class="cat">
        <h3 class="cat-title">{{ g.name }}</h3>
        <div class="grid">
          <div v-for="t in g.tools" :key="t.id" class="card cell" @click="router.push('/tools/' + t.toolKey)">
            <span class="cell-icon" :class="{ img: isImg(t.icon) }">
              <img v-if="isImg(t.icon)" :src="t.icon" alt="" />
              <template v-else>{{ t.icon || '🧩' }}</template>
            </span>
            <span class="cell-label">{{ t.toolName }}</span>
            <span class="cell-desc">{{ t.description || '点击使用' }}</span>
          </div>
        </div>
      </section>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../../store/user'
import { toolsApi } from '../../api'

const router = useRouter()
const userStore = useUserStore()
const loading = ref(false)
const groups = ref<Array<{ id: number; name: string; tools: any[] }>>([])

/** icon 为 emoji 或图片 URL：URL 时用 img 渲染 */
function isImg(icon?: string | null) { return !!icon && /^(https?:)?\/\//.test(icon) }

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  loading.value = true
  try {
    const [catRes, toolRes] = await Promise.all([toolsApi.categories(), toolsApi.list()])
    const cats: any[] = catRes.data || []
    const tools: any[] = toolRes.data || []
    groups.value = cats
      .map((c) => ({ id: c.id, name: c.categoryName, tools: tools.filter((t) => t.categoryId === c.id) }))
      .filter((g) => g.tools.length > 0)
  } catch (e: any) {
    groups.value = []
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.center { text-align: center; padding: 40px 20px; }
.lead-icon { font-size: 44px; line-height: 56px; }
.lead-tip { color: var(--neutral-500); margin: 8px 0 16px; }
.cat { margin-bottom: 20px; }
.cat-title { font-size: 16px; font-weight: 600; color: var(--neutral-800); margin: 0 0 10px; }
.grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; }
.cell { display: flex; flex-direction: column; align-items: flex-start; gap: 4px; cursor: pointer; transition: box-shadow 0.2s, transform 0.2s; }
.cell:hover { box-shadow: var(--shadow-float); transform: translateY(-2px); }
.cell-icon { font-size: 28px; line-height: 34px; }
.cell-icon.img img { width: 28px; height: 28px; object-fit: contain; border-radius: var(--radius-sm); }
.cell-label { font-size: 15px; font-weight: 600; color: var(--neutral-900); }
.cell-desc { font-size: 12px; color: var(--neutral-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 100%; }
@media (max-width: 768px) {
  .grid { grid-template-columns: repeat(2, 1fr); gap: 10px; }
}
</style>
