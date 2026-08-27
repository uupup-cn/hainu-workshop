<template>
  <div class="container">
    <div class="page-header"><h2 class="page-title">二手集市</h2></div>

    <!-- 搜索与分类 -->
    <div class="toolbar">
      <select v-model="categoryId" class="select" @change="load(1)">
        <option :value="undefined">全部分类</option>
        <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.categoryName }}</option>
      </select>
      <input v-model="keyword" class="input search" placeholder="搜索商品关键词" @keyup.enter="load(1)" />
      <button class="btn btn-sm" @click="load(1)">搜索</button>
      <button class="btn btn-sm push" @click="openPublish">发布商品</button>
      <button class="btn btn-sm btn-plain" @click="openMine">我的发布</button>
    </div>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="items.length === 0" class="empty">暂无在售商品</div>
    <div v-else class="goods">
      <div v-for="it in items" :key="it.id" class="card goods-card">
        <div class="goods-imgs">
          <img v-if="cover(it)" :src="cover(it)" alt="" />
          <span v-else class="placeholder"><LucideIcon name="life-express" :size="28" /></span>
        </div>
        <div class="goods-body">
          <div class="goods-title">{{ it.title }}</div>
          <div class="goods-meta">
            <span class="tag">{{ it.category?.categoryName || '未分类' }}</span>
            <span class="goods-views num">{{ it.viewCount || 0 }} 浏览</span>
            <a v-if="userStore.isLoggedIn" class="report-link" @click="openReport(it)">举报</a>
          </div>
          <div class="goods-footer">
            <span class="price num">￥{{ it.price }}</span>
            <span class="contact">{{ it.contact }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="pager" v-if="hasMore">
      <button class="btn btn-sm btn-plain" @click="load(page + 1)">加载更多</button>
    </div>

    <!-- 发布商品弹窗 -->
    <AppDialog :visible="publishVisible" @update:visible="publishVisible = $event" title="发布商品">
      <div class="form-row"><label>标题 *</label><input v-model="form.title" class="input" maxlength="100" placeholder="商品标题" /></div>
      <div class="form-grid">
        <div class="form-row"><label>价格 *</label><input v-model="form.price" class="input" type="number" min="0" step="0.01" placeholder="0.00" /></div>
        <div class="form-row"><label>分类 *</label>
          <select v-model="form.categoryId" class="select">
            <option :value="undefined">请选择分类</option>
            <option v-for="c in categories" :key="c.id" :value="c.id">{{ c.categoryName }}</option>
          </select>
        </div>
      </div>
      <div class="form-row"><label>联系方式 *</label><input v-model="form.contact" class="input" maxlength="100" placeholder="微信 / QQ / 手机号" /></div>
      <div class="form-row"><label>描述</label><textarea v-model="form.description" class="input" rows="3" maxlength="2000" placeholder="商品描述（选填）"></textarea></div>
      <div class="form-row"><label>图片链接（选填）</label>
        <div v-for="(img, i) in form.images" :key="i" class="img-row">
          <input v-model="img.url" class="input" placeholder="https://…（图片 URL）" />
          <button class="btn btn-sm btn-plain" @click="form.images.splice(i, 1)">删除</button>
        </div>
        <button class="btn btn-sm btn-plain" @click="form.images.push({ url: '' })">+ 添加图片</button>
      </div>
      <p v-if="dialogError" class="dialog-error">{{ dialogError }}</p>
      <template #footer>
        <button class="btn btn-sm btn-plain" @click="publishVisible = false">取消</button>
        <button class="btn btn-sm" :disabled="submitting" @click="submitPublish">{{ submitting ? '发布中…' : '发布' }}</button>
      </template>
    </AppDialog>

    <!-- 我的发布弹窗 -->
    <AppDialog :visible="mineVisible" @update:visible="mineVisible = $event" title="我的发布" wide>
      <div v-if="mineLoading" class="loading">加载中…</div>
      <div v-else-if="mineItems.length === 0" class="empty">还没有发布过商品</div>
      <div v-else class="mine-list">
        <div v-for="m in mineItems" :key="m.id" class="mine-item">
          <div class="mine-info">
            <div class="mine-title">{{ m.title }}</div>
            <div class="mine-meta num"><span class="price num">￥{{ m.price }}</span> · {{ formatTime(m.publishedAt) }}</div>
          </div>
          <span class="tag" :class="statusTag(m.status).cls">{{ statusTag(m.status).text }}</span>
          <div class="mine-ops">
            <button v-if="m.status === 'active'" class="btn btn-sm btn-plain" @click="offItem(m)">下架</button>
            <button v-else-if="!expired(m)" class="btn btn-sm btn-plain" @click="relistItem(m)">重新上架</button>
            <button class="btn btn-sm btn-danger" @click="removeItem(m)">删除</button>
          </div>
        </div>
      </div>
    </AppDialog>

    <!-- 举报弹窗 -->
    <AppDialog :visible="reportVisible" @update:visible="reportVisible = $event" title="举报商品">
      <p class="report-target">{{ reportTarget?.title }}</p>
      <label v-for="r in REASONS" :key="r" class="radio"><input type="radio" :value="r" v-model="reportReason" />{{ r }}</label>
      <textarea v-model="reportDetail" class="input report-detail" rows="2" maxlength="200" placeholder="补充说明（选填）"></textarea>
      <p v-if="dialogError" class="dialog-error">{{ dialogError }}</p>
      <template #footer>
        <button class="btn btn-sm btn-plain" @click="reportVisible = false">取消</button>
        <button class="btn btn-sm" @click="submitReport">提交举报</button>
      </template>
    </AppDialog>

  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { marketplaceApi } from '../api'
import { useUserStore } from '../store/user'
import { useToast } from '@/composables/useToast'
import { AppDialog } from '@/components/base'
import { LucideIcon } from '@/components/icons'

const userStore = useUserStore()
const REASONS = ['垃圾广告', '人身攻击', '色情低俗', '虚假信息', '其他']

const loading = ref(true)
const categories = ref<any[]>([])
const items = ref<any[]>([])
const categoryId = ref<number | undefined>(undefined)
const keyword = ref('')
const page = ref(1)
const hasMore = ref(false)

const toast = useToast()
function showToast(msg: string) {
  toast.show(msg)
}
function formatTime(t?: string) { return t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '' }

function cover(it: any): string {
  const imgs = Array.isArray(it.images) ? it.images : []
  return imgs[0] || ''
}

async function load(p = 1) {
  loading.value = true
  try {
    const res = await marketplaceApi.items({ category: categoryId.value, keyword: keyword.value || undefined, page: p, size: 20 })
    const d = res.data || {}
    items.value = p === 1 ? d.list || [] : items.value.concat(d.list || [])
    page.value = p
    hasMore.value = !!d.hasMore
  } finally {
    loading.value = false
  }
}

/* 发布商品 */
const publishVisible = ref(false)
const submitting = ref(false)
const dialogError = ref('')
const form = reactive({ title: '', price: '', categoryId: undefined as number | undefined, contact: '', description: '', images: [] as { url: string }[] })

function openPublish() {
  if (!userStore.isLoggedIn) return userStore.openLoginDialog()
  Object.assign(form, { title: '', price: '', categoryId: undefined, contact: '', description: '', images: [] })
  dialogError.value = ''
  publishVisible.value = true
}

async function submitPublish() {
  const price = Number(form.price)
  if (!form.title.trim()) { dialogError.value = '请填写商品标题'; return }
  if (form.price === '' || isNaN(price) || price < 0) { dialogError.value = '请填写正确的价格'; return }
  if (!form.categoryId) { dialogError.value = '请选择商品分类'; return }
  if (!form.contact.trim()) { dialogError.value = '请填写联系方式'; return }
  submitting.value = true
  dialogError.value = ''
  try {
    await marketplaceApi.create({
      title: form.title.trim(),
      price,
      categoryId: form.categoryId,
      contact: form.contact.trim(),
      description: form.description.trim() || undefined,
      images: form.images.map((img) => img.url.trim()).filter(Boolean),
    })
    publishVisible.value = false
    showToast('已发布，3 天后自动下架')
    load(1)
  } catch (e: any) {
    dialogError.value = e?.message || '发布失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

/* 我的发布 */
const STATUS: Record<string, { text: string; cls: string }> = {
  active: { text: '在售', cls: 'tag-green' },
  off: { text: '已下架', cls: 'tag-gray' },
  auto_off: { text: '自动下架', cls: 'tag-orange' },
}
function statusTag(s: string) { return STATUS[s] || { text: s || '未知', cls: 'tag-gray' } }
function expired(m: any) { return !!m.expireAt && new Date(m.expireAt) < new Date() }

const mineVisible = ref(false)
const mineLoading = ref(false)
const mineItems = ref<any[]>([])

function openMine() {
  if (!userStore.isLoggedIn) return userStore.openLoginDialog()
  mineVisible.value = true
  loadMine()
}
async function loadMine() {
  mineLoading.value = true
  try {
    const res = await marketplaceApi.myItems()
    mineItems.value = res.data?.list || []
  } catch (e: any) {
    showToast(e?.message || '加载失败')
  } finally {
    mineLoading.value = false
  }
}
async function offItem(m: any) {
  try {
    await marketplaceApi.off(m.id)
    showToast('已下架')
    loadMine()
    load(1)
  } catch (e: any) { showToast(e?.message || '操作失败') }
}
async function relistItem(m: any) {
  try {
    await marketplaceApi.relist(m.id)
    showToast('已重新上架')
    loadMine()
    load(1)
  } catch (e: any) {
    showToast(e?.code === 40001 ? '商品已过期，无法重新上架' : e?.message || '操作失败')
  }
}
async function removeItem(m: any) {
  if (!window.confirm('确定删除该商品？删除后不可恢复')) return
  try {
    await marketplaceApi.remove(m.id)
    showToast('已删除')
    loadMine()
    load(1)
  } catch (e: any) { showToast(e?.message || '删除失败') }
}

/* 举报 */
const reportVisible = ref(false)
const reportTarget = ref<any>(null)
const reportReason = ref(REASONS[0])
const reportDetail = ref('')

function openReport(it: any) {
  reportTarget.value = it
  reportReason.value = REASONS[0]
  reportDetail.value = ''
  dialogError.value = ''
  reportVisible.value = true
}
async function submitReport() {
  try {
    await marketplaceApi.report(reportTarget.value.id, reportReason.value, reportDetail.value.trim() || undefined)
    reportVisible.value = false
    showToast('已提交举报')
  } catch (e: any) {
    dialogError.value = e?.message || '提交失败，请稍后重试'
  }
}

onMounted(async () => {
  try { const res = await marketplaceApi.categories(); categories.value = res.data || [] } catch { /* 游客也可浏览分类 */ }
  await load(1)
})
</script>
<style scoped>
.toolbar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
.search { flex: 1; min-width: 120px; }
.push { margin-left: auto; }
.goods { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
.goods-card { display: flex; gap: 12px; padding: 14px; margin-bottom: 0; }
.goods-imgs img, .placeholder { width: 80px; height: 80px; border-radius: var(--radius-md); object-fit: cover; }
.placeholder { display: flex; align-items: center; justify-content: center; background: var(--neutral-50); font-size: 28px; }
.goods-body { flex: 1; display: flex; flex-direction: column; min-width: 0; }
.goods-title { font-size: 15px; font-weight: 600; color: var(--neutral-900); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.goods-meta { display: flex; align-items: center; gap: 8px; margin-top: 4px; }
.goods-views { font-size: 12px; color: var(--neutral-500); }
.report-link { margin-left: auto; font-size: 12px; color: var(--neutral-400); cursor: pointer; }
.report-link:hover { color: var(--danger); }
.goods-footer { display: flex; align-items: center; justify-content: space-between; margin-top: auto; }
.price { font-size: 18px; font-weight: 600; color: var(--danger); }
.contact { font-size: 12px; color: var(--neutral-500); }

/* 弹窗（自写 mask + 卡片，参考 App.vue 登录弹窗写法） */
.dialog-mask { position: fixed; inset: 0; z-index: 50; background: rgba(17, 24, 39, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.dialog { width: 380px; max-width: 100%; max-height: 85vh; overflow-y: auto; background: var(--neutral-0); border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-float); }
.dialog.wide { width: 560px; }
.dialog-title { margin: 0 0 14px; font-size: 17px; font-weight: 600; color: var(--neutral-900); }
.form-row { margin-bottom: 10px; }
.form-row label { display: block; margin-bottom: 4px; font-size: 12px; color: var(--neutral-500); }
.form-row .input, .form-row .select { width: 100%; }
.form-grid { display: flex; gap: 10px; }
.form-grid .form-row { flex: 1; }
textarea.input { resize: vertical; font-family: inherit; }
.img-row { display: flex; gap: 6px; margin-bottom: 6px; }
.img-row .input { flex: 1; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.dialog-error { margin: 4px 0 0; font-size: 12px; color: var(--danger); }
.report-target { margin: 0 0 10px; font-size: 13px; color: var(--neutral-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.radio { display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 14px; color: var(--neutral-700); cursor: pointer; }
.report-detail { display: block; width: 100%; margin-top: 8px; }

/* 我的发布列表 */
.mine-item { display: flex; align-items: center; gap: 10px; padding: 10px 0; border-bottom: 1px solid var(--neutral-100); }
.mine-item:last-child { border-bottom: none; }
.mine-info { flex: 1; min-width: 0; }
.mine-title { font-size: 14px; font-weight: 500; color: var(--neutral-800); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.mine-meta { font-size: 12px; color: var(--neutral-500); }
.mine-meta .price { font-size: 13px; }
.mine-ops { display: flex; gap: 6px; flex-shrink: 0; }

/* 状态标签 */
.tag-green { background: var(--success-bg); color: var(--success); }
.tag-gray { background: var(--neutral-100); color: var(--neutral-500); }
.btn-danger { background: var(--danger); }
.btn-danger:hover { background: #dc2626; }

/* 轻提示 */
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }

@media (max-width: 768px) { .goods { grid-template-columns: 1fr; } .push { margin-left: 0; } }
</style>
