<template>
  <div class="container narrow">
    <div class="page-header"><h2 class="page-title">校友圈</h2></div>

    <!-- 帖子 / 表白墙切换 -->
    <div class="tabs">
      <button class="tab" :class="{ active: type === 'post' }" @click="switchType('post')">帖子</button>
      <button class="tab" :class="{ active: type === 'confession' }" @click="switchType('confession')">表白墙</button>
      <select v-if="type === 'post'" v-model="sectionId" class="select" @change="load(1)">
        <option :value="undefined">全部版块</option>
        <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.sectionName }}</option>
      </select>
      <button class="btn btn-sm push" @click="openPublish">发帖</button>
    </div>

    <div v-if="loading" class="loading">加载中…</div>
    <div v-else-if="list.length === 0" class="empty">暂无内容</div>
    <template v-else>
      <div v-for="p in list" :key="p.id" class="card post-card">
        <div class="post-head">
          <span class="avatar">{{ p.isAnonymous ? '匿' : '友' }}</span>
          <div>
            <div class="author">{{ p.isAnonymous ? '匿名同学' : 'UID ' + (p.userId || '') }}</div>
            <div class="time num">{{ formatTime(p.createdAt) }}</div>
          </div>
          <span v-if="p.isPinned" class="tag tag-orange">置顶</span>
        </div>
        <div v-if="p.title" class="post-title">{{ p.title }}</div>
        <div class="post-content" :ref="refContent(p.id)" :class="{ clamp: isClamped(p.id) }">{{ p.content }}</div>
        <a v-if="clampable.has(p.id)" class="expand" @click="toggleExpand(p.id)">{{ expanded.has(p.id) ? '收起' : '展开全文' }}</a>
        <div class="post-footer">
          <button class="op" :class="{ liked: likedIds.has(p.id) }" @click="toggleLike(p)"><LucideIcon name="like" :size="16" /> <span class="num">{{ p.likeCount || 0 }}</span></button>
          <button class="op" :class="{ on: openComments.has(p.id) }" @click="toggleComments(p)"><LucideIcon name="comment" :size="16" /> <span class="num">{{ p.commentCount || 0 }}</span></button>
          <a v-if="userStore.isLoggedIn" class="op report" @click="openReport(p)">举报</a>
        </div>

        <!-- 评论区（懒加载，首次点击才拉取） -->
        <div v-if="openComments.has(p.id)" class="comments">
          <div v-if="commentLoading === p.id" class="loading">加载中…</div>
          <template v-else>
            <div v-if="!(commentData[p.id] || []).length" class="c-empty">暂无评论，快来抢沙发</div>
            <div v-for="c in commentData[p.id]" :key="c.id" class="comment" :class="{ reply: !!c.parentId }">
              <div class="c-head">
                <span class="c-author">{{ c.isAnonymous ? '匿名同学' : 'UID ' + c.userId }}</span>
                <span class="time num">{{ formatTime(c.createdAt) }}</span>
              </div>
              <div class="c-content">{{ c.content }}</div>
              <div class="c-ops">
                <a class="c-link" @click="startReply(p.id, c)">回复</a>
                <a v-if="c.userId === userStore.userInfo?.id" class="c-link danger" @click="delComment(p, c)">删除</a>
              </div>
            </div>
            <div class="comment-input">
              <div v-if="replyTo && replyTo.postId === p.id" class="replying">
                回复 @{{ replyTo.name }}<a class="cancel" @click="cancelReply"><LucideIcon name="close" :size="14" /> 取消</a>
              </div>
              <div class="ci-row">
                <input v-model="commentDraft[p.id]" class="input" maxlength="500" placeholder="友善评论，理性发言…" @keyup.enter="submitComment(p)" />
                <button class="btn btn-sm" @click="submitComment(p)">发送</button>
              </div>
            </div>
          </template>
        </div>
      </div>
      <div class="pager" v-if="hasMore">
        <button class="btn btn-sm btn-plain" @click="load(page + 1)">加载更多</button>
      </div>
    </template>

    <!-- 发帖弹窗 -->
    <AppDialog :visible="pubVisible" @update:visible="pubVisible = $event" :title="type === 'confession' ? '发布表白' : '发布帖子'">
      <div class="form-row" v-if="type === 'post'"><label>版块</label>
        <select v-model="form.sectionId" class="select">
          <option :value="undefined">不选择版块</option>
          <option v-for="s in sections" :key="s.id" :value="s.id">{{ s.sectionName }}</option>
        </select>
      </div>
      <div class="form-row"><label>标题</label><input v-model="form.title" class="input" maxlength="200" placeholder="标题（选填）" /></div>
      <div class="form-row"><label>内容 *</label><textarea v-model="form.content" class="input" rows="5" maxlength="5000" placeholder="分享你的想法…"></textarea></div>
      <label class="radio"><input type="checkbox" v-model="form.isAnonymous" />匿名发布</label>
      <p v-if="dialogError" class="dialog-error">{{ dialogError }}</p>
      <template #footer>
        <button class="btn btn-sm btn-plain" @click="pubVisible = false">取消</button>
        <button class="btn btn-sm" :disabled="submitting" @click="submitPublish">{{ submitting ? '发布中…' : '发布' }}</button>
      </template>
    </AppDialog>

    <!-- 举报弹窗 -->
    <AppDialog :visible="reportVisible" @update:visible="reportVisible = $event" title="举报内容">
      <p class="report-target">{{ reportTarget?.title || reportTarget?.content?.slice(0, 40) }}</p>
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
import { ref, reactive, nextTick, onMounted } from 'vue'
import { alumniApi } from '../api'
import { useUserStore } from '../store/user'
import { useToast } from '@/composables/useToast'
import { AppDialog } from '@/components/base'
import { LucideIcon } from '@/components/icons'

const userStore = useUserStore()
const REASONS = ['垃圾广告', '人身攻击', '色情低俗', '虚假信息', '其他']
const LIKED_KEY = 'liked_post_ids'

const loading = ref(true)
const type = ref('post')
const sections = ref<any[]>([])
const sectionId = ref<number | undefined>(undefined)
const list = ref<any[]>([])
const page = ref(1)
const hasMore = ref(false)

const toast = useToast()
function showToast(msg: string) {
  toast.show(msg)
}
function formatTime(t?: string) { return t ? new Date(t).toLocaleString('zh-CN', { hour12: false }) : '' }

function switchType(t: string) { type.value = t; cancelReply(); load(1) }

async function load(p = 1) {
  loading.value = true
  try {
    const res = await alumniApi.posts({ type: type.value, section_id: sectionId.value, page: p, size: 20 })
    const d = res.data || {}
    list.value = p === 1 ? d.list || [] : list.value.concat(d.list || [])
    page.value = p
    hasMore.value = !!d.hasMore
  } finally {
    loading.value = false
  }
  detectClamp()
}

/* 发帖 */
const pubVisible = ref(false)
const submitting = ref(false)
const dialogError = ref('')
const form = reactive({ title: '', content: '', sectionId: undefined as number | undefined, isAnonymous: false })

function openPublish() {
  if (!userStore.isLoggedIn) return userStore.openLoginDialog()
  Object.assign(form, { title: '', content: '', sectionId: undefined, isAnonymous: type.value === 'confession' })
  dialogError.value = ''
  pubVisible.value = true
}

async function submitPublish() {
  if (!form.content.trim()) { dialogError.value = '请填写内容'; return }
  submitting.value = true
  dialogError.value = ''
  try {
    await alumniApi.create({
      type: type.value,
      section_id: type.value === 'post' ? form.sectionId : undefined,
      title: form.title.trim() || undefined,
      content: form.content.trim(),
      is_anonymous: form.isAnonymous,
    })
    pubVisible.value = false
    showToast('发布成功')
    load(1)
  } catch (e: any) {
    dialogError.value = e?.code === 40004 || /认证|权限/.test(e?.message || '')
      ? '发布帖子需要先完成学生认证'
      : e?.message || '发布失败，请稍后重试'
  } finally {
    submitting.value = false
  }
}

/* 点赞（乐观更新 + localStorage 记忆已赞） */
function loadLiked(): number[] { try { return JSON.parse(localStorage.getItem(LIKED_KEY) || '[]') } catch { return [] } }
const likedIds = ref(new Set<number>(loadLiked()))
function saveLiked() { localStorage.setItem(LIKED_KEY, JSON.stringify([...likedIds.value])) }

async function toggleLike(p: any) {
  if (!userStore.isLoggedIn) return userStore.openLoginDialog()
  const liked = likedIds.value.has(p.id)
  liked ? likedIds.value.delete(p.id) : likedIds.value.add(p.id)
  p.likeCount = (p.likeCount || 0) + (liked ? -1 : 1)
  saveLiked()
  try {
    await (liked ? alumniApi.unlike(p.id) : alumniApi.like(p.id))
  } catch (e: any) {
    liked ? likedIds.value.add(p.id) : likedIds.value.delete(p.id)
    p.likeCount = (p.likeCount || 0) + (liked ? 1 : -1)
    saveLiked()
    showToast(e?.message || '操作失败')
  }
}

/* 评论（懒加载，首次点击才拉取） */
const openComments = ref(new Set<number>())
const commentData = reactive<Record<number, any[]>>({})
const commentLoading = ref(0)
const commentDraft = reactive<Record<number, string>>({})
const replyTo = ref<{ postId: number; parentId: number; name: string } | null>(null)

async function toggleComments(p: any) {
  if (!userStore.isLoggedIn) return userStore.openLoginDialog()
  if (openComments.value.has(p.id)) { openComments.value.delete(p.id); return }
  openComments.value.add(p.id)
  if (!commentData[p.id]) loadComments(p.id)
}
async function loadComments(postId: number) {
  commentLoading.value = postId
  try {
    const res = await alumniApi.comments(postId)
    commentData[postId] = res.data?.list || []
  } catch (e: any) {
    showToast(e?.message || '评论加载失败')
  } finally {
    commentLoading.value = 0
  }
}
function startReply(postId: number, c: any) {
  replyTo.value = { postId, parentId: c.id, name: c.isAnonymous ? '匿名同学' : 'UID ' + c.userId }
}
function cancelReply() { replyTo.value = null }

async function submitComment(p: any) {
  const content = (commentDraft[p.id] || '').trim()
  if (!content) return
  const reply = replyTo.value
  const parentId = reply && reply.postId === p.id ? reply.parentId : undefined
  try {
    await alumniApi.comment(p.id, { content, parent_id: parentId, is_anonymous: false })
    commentDraft[p.id] = ''
    cancelReply()
    p.commentCount = (p.commentCount || 0) + 1
    loadComments(p.id)
  } catch (e: any) {
    showToast(e?.message || '评论失败')
  }
}
async function delComment(p: any, c: any) {
  if (!window.confirm('确定删除该评论？')) return
  try {
    await alumniApi.removeComment(c.id)
    p.commentCount = Math.max(0, (p.commentCount || 0) - 1)
    loadComments(p.id)
  } catch (e: any) {
    showToast(e?.message || '删除失败')
  }
}

/* 举报 */
const reportVisible = ref(false)
const reportTarget = ref<any>(null)
const reportReason = ref(REASONS[0])
const reportDetail = ref('')

function openReport(p: any) {
  reportTarget.value = p
  reportReason.value = REASONS[0]
  reportDetail.value = ''
  dialogError.value = ''
  reportVisible.value = true
}
async function submitReport() {
  try {
    await alumniApi.reportPost(reportTarget.value.id, reportReason.value, reportDetail.value.trim() || undefined)
    reportVisible.value = false
    showToast('已提交举报')
  } catch (e: any) {
    dialogError.value = e?.message || '提交失败，请稍后重试'
  }
}

/* 长内容折叠：超过 6 行显示「展开全文/收起」 */
const clampable = ref(new Set<number>())
const expanded = ref(new Set<number>())
const contentEls = new Map<number, HTMLElement>()
function refContent(id: number) {
  return (el: any) => { el ? contentEls.set(id, el as HTMLElement) : contentEls.delete(id) }
}
function isClamped(id: number) { return clampable.value.has(id) && !expanded.value.has(id) }
function toggleExpand(id: number) { expanded.value.has(id) ? expanded.value.delete(id) : expanded.value.add(id) }
async function detectClamp() {
  await nextTick()
  const s = new Set<number>()
  contentEls.forEach((el, id) => { if (!expanded.value.has(id) && el.scrollHeight - el.clientHeight > 2) s.add(id) })
  clampable.value = s
}

onMounted(async () => {
  await load(1)
  try { const res = await alumniApi.sections(); sections.value = res.data || [] } catch { /* 需登录 */ }
})
</script>
<style scoped>
.narrow { max-width: 720px; }
.tabs { display: flex; align-items: center; gap: 8px; margin-bottom: 16px; }
.tab { padding: 6px 16px; border: 1px solid var(--neutral-200); background: var(--neutral-0); border-radius: var(--radius-full); color: var(--neutral-600); font-size: 14px; cursor: pointer; }
.tab.active { background: var(--primary-500); border-color: var(--primary-500); color: #fff; }
.push { margin-left: auto; }
.post-head { display: flex; align-items: center; gap: 10px; margin-bottom: 8px; }
.avatar { width: 36px; height: 36px; border-radius: 50%; background: var(--primary-50); color: var(--primary-500); display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 600; }
.author { font-size: 14px; font-weight: 500; color: var(--neutral-800); }
.time { font-size: 12px; color: var(--neutral-500); }
.post-title { font-size: 16px; font-weight: 600; color: var(--neutral-900); margin-bottom: 4px; }
.post-content { color: var(--neutral-700); white-space: pre-wrap; }
.post-content.clamp { display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 6; overflow: hidden; }
.expand { display: inline-block; margin-top: 4px; font-size: 13px; color: var(--primary-500); cursor: pointer; }

/* 操作区 */
.post-footer { display: flex; align-items: center; gap: 6px; margin-top: 10px; font-size: 12px; }
.op { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border: none; background: var(--neutral-50); border-radius: var(--radius-full); color: var(--neutral-600); font-size: 12px; cursor: pointer; }
.op:hover { background: var(--neutral-100); }
.op.liked { background: var(--danger-bg); color: var(--danger); }
.op.on { background: var(--primary-50); color: var(--primary-500); }
.op.report { background: none; color: var(--neutral-400); padding: 4px 6px; }
.op.report:hover { color: var(--danger); background: none; }

/* 评论区 */
.comments { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--neutral-100); }
.c-empty { padding: 12px 0; text-align: center; color: var(--neutral-400); font-size: 13px; }
.comment { padding: 8px 0; }
.comment.reply { margin-left: 28px; padding-left: 10px; border-left: 2px solid var(--neutral-100); }
.c-head { display: flex; align-items: center; gap: 8px; }
.c-author { font-size: 13px; font-weight: 500; color: var(--neutral-800); }
.c-content { margin: 2px 0; font-size: 13px; color: var(--neutral-700); white-space: pre-wrap; }
.c-ops { display: flex; gap: 10px; }
.c-link { font-size: 12px; color: var(--neutral-400); cursor: pointer; }
.c-link:hover { color: var(--primary-500); }
.c-link.danger:hover { color: var(--danger); }
.comment-input { margin-top: 8px; }
.replying { margin-bottom: 6px; font-size: 12px; color: var(--primary-500); }
.replying .cancel { margin-left: 6px; color: var(--neutral-400); cursor: pointer; }
.replying .cancel:hover { color: var(--danger); }
.ci-row { display: flex; gap: 8px; }
.ci-row .input { flex: 1; }

/* 弹窗（自写 mask + 卡片，参考 App.vue 登录弹窗写法） */
.dialog-mask { position: fixed; inset: 0; z-index: 50; background: rgba(17, 24, 39, 0.45); display: flex; align-items: center; justify-content: center; padding: 16px; }
.dialog { width: 380px; max-width: 100%; max-height: 85vh; overflow-y: auto; background: var(--neutral-0); border-radius: var(--radius-xl); padding: 20px; box-shadow: var(--shadow-float); }
.dialog-title { margin: 0 0 14px; font-size: 17px; font-weight: 600; color: var(--neutral-900); }
.form-row { margin-bottom: 10px; }
.form-row label { display: block; margin-bottom: 4px; font-size: 12px; color: var(--neutral-500); }
.form-row .input, .form-row .select { width: 100%; }
textarea.input { resize: vertical; font-family: inherit; }
.radio { display: flex; align-items: center; gap: 6px; padding: 4px 0; font-size: 14px; color: var(--neutral-700); cursor: pointer; }
.report-target { margin: 0 0 10px; font-size: 13px; color: var(--neutral-500); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.report-detail { display: block; width: 100%; margin-top: 8px; }
.dialog-actions { display: flex; justify-content: flex-end; gap: 8px; margin-top: 14px; }
.dialog-error { margin: 4px 0 0; font-size: 12px; color: var(--danger); }

/* 轻提示 */
.toast { position: fixed; top: 72px; left: 50%; transform: translateX(-50%); z-index: 60; padding: 8px 16px; background: var(--neutral-900); color: #fff; font-size: 13px; border-radius: var(--radius-full); box-shadow: var(--shadow-float); }

@media (max-width: 768px) { .comment.reply { margin-left: 16px; } }
</style>
