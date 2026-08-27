<template>
  <div class="container">
    <div class="page-header">
      <div class="title-wrap">
        <button class="back" @click="router.push('/tools')"><LucideIcon name="arrow-left" :size="16" /></button>
        <span v-if="toolIcon" class="tool-icon" :class="{ img: isImg }">
          <img v-if="isImg" :src="toolIcon" alt="" />
          <LucideIcon v-else :name="iconForTool(key)" :size="22" />
        </span>
        <h2 class="page-title">{{ tool?.toolName || key }}</h2>
      </div>
      <span v-if="tool" class="tag tag-mint">免费</span>
    </div>

    <!-- 未登录 -->
    <div v-if="!userStore.isLoggedIn" class="card center">
      <div class="lead-icon"><LucideIcon name="lock" :size="44" /></div>
      <p class="lead-tip">登录后即可使用该工具</p>
      <button class="btn" @click="userStore.openLoginDialog()">登录</button>
    </div>

    <div v-else-if="loading" class="loading">加载中…</div>

    <!-- 未知工具 -->
    <div v-else-if="notFound" class="card">
      <div class="empty">
        工具不存在或已下线
        <div class="back-row"><a @click="router.push('/tools')"><LucideIcon name="arrow-left" :size="14" /> 返回工具箱</a></div>
      </div>
    </div>

    <template v-else>
      <p v-if="tool?.description" class="desc">{{ tool.description }}</p>
      <component :is="comp" :tool="tool" v-bind="extraProps" />
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import type { Component } from 'vue'
import { useUserStore } from '../../store/user'
import { toolsApi } from '../../api'
import { LucideIcon } from '@/components/icons'
import { iconForTool } from './tool-icons'
import { QUIZ_CONFIGS } from './quiz-config'
import DiceTool from './components/DiceTool.vue'
import CalculatorTool from './components/CalculatorTool.vue'
import IdPhotoTool from './components/IdPhotoTool.vue'
import VideoParseTool from './components/VideoParseTool.vue'
import WheelTool from './components/WheelTool.vue'
import SchulteTool from './components/SchulteTool.vue'
import QuizTool from './components/QuizTool.vue'

/** toolKey → 组件注册表（测评类共用 QuizTool，通过 props 区分） */
const registry: Record<string, Component> = {
  dice: DiceTool,
  calculator: CalculatorTool,
  'id-photo': IdPhotoTool,
  'video-parse': VideoParseTool,
  wheel: WheelTool,
  schulte: SchulteTool,
  sbti: QuizTool,
  mbti: QuizTool,
  'dark-triad': QuizTool,
  'seven-sins': QuizTool,
}

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

const key = computed(() => String(route.params.key || ''))
const comp = computed(() => registry[key.value])
/** 测评类工具的题库 / 标题 / 计分配置 */
const extraProps = computed(() => {
  const cfg = QUIZ_CONFIGS[key.value]
  return cfg ? { title: cfg.title, variant: cfg.variant, questions: cfg.questions, mapScores: cfg.mapScores } : {}
})

const loading = ref(false)
const notFound = ref(false)
const tool = ref<any>(null)
const toolIcon = computed(() => tool.value?.icon || '')
const isImg = computed(() => /^(https?:)?\/\//.test(toolIcon.value))

async function load() {
  tool.value = null
  // 未知 key 直接判「工具不存在」
  notFound.value = !comp.value
  if (notFound.value || !userStore.isLoggedIn) return
  loading.value = true
  try {
    const res = await toolsApi.detail(key.value)
    tool.value = res.data
  } catch {
    notFound.value = true
  } finally {
    loading.value = false
  }
}

watch(key, load, { immediate: true })
</script>
<style scoped>
.title-wrap { display: flex; align-items: center; gap: 10px; min-width: 0; }
.back { border: 1px solid var(--neutral-200); background: var(--neutral-0); color: var(--neutral-600); border-radius: var(--radius-md); padding: 4px 10px; font-size: 14px; cursor: pointer; }
.back:hover { border-color: var(--primary-500); color: var(--primary-500); }
.tool-icon { font-size: 22px; line-height: 28px; }
.tool-icon.img img { width: 22px; height: 22px; object-fit: contain; border-radius: var(--radius-sm); }
.center { text-align: center; padding: 40px 20px; }
.lead-icon { font-size: 44px; line-height: 56px; color: var(--amber-500); }
.lead-tip { color: var(--neutral-500); margin: 8px 0 16px; }
.desc { margin: 0 0 12px; font-size: 13px; color: var(--neutral-500); }
.back-row { margin-top: 12px; }
.back-row a { cursor: pointer; }
</style>
