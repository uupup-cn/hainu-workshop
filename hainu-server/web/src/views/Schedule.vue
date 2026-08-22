<template>
  <div class="container">
    <div class="page-header">
      <h2 class="page-title">我的课表</h2>
      <button v-if="!userStore.isLoggedIn" class="btn btn-sm" @click="goLogin">登录后查看完整课表</button>
    </div>

    <div v-if="!userStore.isLoggedIn" class="empty">登录后可查看并管理你的课程表</div>
    <div v-else-if="loading" class="loading">加载中…</div>
    <div v-else class="card table-wrap">
      <div v-if="courses.length === 0" class="empty">课表还是空的，去小程序添加课程吧</div>
      <table v-else class="course-table">
        <thead>
          <tr><th class="num">节次</th><th v-for="d in 7" :key="d">{{ weekName(d) }}</th></tr>
        </thead>
        <tbody>
          <tr v-for="s in 5" :key="s">
            <td class="sec num">{{ s }}</td>
            <td v-for="d in 7" :key="d" class="cell">
              <div v-for="c in coursesAt(d, s)" :key="c.id" class="course" :style="courseStyle(c)">{{ c.courseName }}<span v-if="c.location" class="loc">{{ c.location }}</span></div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useUserStore } from '../store/user'
import { courseApi } from '../api'

const userStore = useUserStore()
const loading = ref(false)
const courses = ref<any[]>([])
const colors = ['#4A90D9', '#52C41A', '#FA8C16', '#722ED1', '#F5222D', '#13C2C2', '#EB2F96', '#8C8C8C']

function weekName(d: number) { return ['周一', '周二', '周三', '周四', '周五', '周六', '周日'][d - 1] }
function coursesAt(day: number, sec: number) {
  return courses.value.filter((c) => c.dayOfWeek === day && c.startSection !== null && c.startSection! <= sec && c.endSection !== null && c.endSection! >= sec && c.startSection === sec)
}
function courseStyle(c: any) { return { background: colors[(c.colorId || c.id) % colors.length] + '22', borderColor: colors[(c.colorId || c.id) % colors.length] } }
function goLogin() { location.href = '/login' }

onMounted(async () => {
  if (!userStore.isLoggedIn) return
  loading.value = true
  try {
    const res = await courseApi.list()
    courses.value = Array.isArray(res.data) ? res.data : res.data?.list || []
  } finally {
    loading.value = false
  }
})
</script>
<style scoped>
.table-wrap { overflow-x: auto; padding: 12px; }
.course-table { width: 100%; border-collapse: collapse; table-layout: fixed; min-width: 700px; }
.course-table th, .course-table td { border: 1px solid var(--neutral-100); padding: 6px; font-size: 13px; text-align: center; vertical-align: top; }
.course-table th { background: var(--neutral-50); color: var(--neutral-600); font-weight: 500; padding: 8px 6px; }
.sec { color: var(--neutral-500); background: var(--neutral-50); }
.course { border-radius: var(--radius-sm); border-left: 3px solid; padding: 4px 6px; font-size: 12px; color: var(--neutral-800); text-align: left; }
.loc { display: block; color: var(--neutral-500); font-size: 11px; }
</style>
