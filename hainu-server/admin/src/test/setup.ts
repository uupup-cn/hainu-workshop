/**
 * Vitest 全局 setup：
 * - 注入 Vue auto-imports（ref / computed / watch / nextTick 等）所必需的全局别名
 *   组件源码依赖 unplugin-auto-import 在生产构建注入这些 API，但 vitest 不走 vite 完整插件链，
 *   因此在测试侧手动把 Vue API 暴露到 globalThis。
 * - 避免在测试代码中重复 import。
 */
import * as Vue from 'vue'

const vueGlobals = {
  ref: Vue.ref,
  reactive: Vue.reactive,
  computed: Vue.computed,
  watch: Vue.watch,
  watchEffect: Vue.watchEffect,
  onMounted: Vue.onMounted,
  onBeforeUnmount: Vue.onBeforeUnmount,
  onUnmounted: Vue.onUnmounted,
  nextTick: Vue.nextTick,
  inject: Vue.inject,
  provide: Vue.provide,
  toRef: Vue.toRef,
  toRefs: Vue.toRefs,
  unref: Vue.unref,
  h: Vue.h,
  defineComponent: Vue.defineComponent,
  useTemplateRef: (Vue as any).useTemplateRef
}

for (const [name, value] of Object.entries(vueGlobals)) {
  if (value === undefined) continue
  if ((globalThis as any)[name] === undefined) {
    ;(globalThis as any)[name] = value
  }
}

// VueUse 的 useVModel 在组件源码中以全局形式被引用（unplugin-auto-import 注入）。
import { useVModel } from '@vueuse/core'
if ((globalThis as any).useVModel === undefined) {
  ;(globalThis as any).useVModel = useVModel
}
