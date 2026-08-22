/**
 * 应用版本更新检测器
 *
 * 功能概述：
 * - 定时轮询远程 version.json，检测是否有新版本发布
 * - 检测到新版本时弹出更新提示弹窗，支持强制更新和稍后提醒
 * - 支持多标签页协同：一个标签页确认更新后，其他标签页自动刷新
 * - 支持"稍后再说"贪睡机制，避免频繁打扰用户
 * - 通过 localStorage 实现跨标签页弹窗互斥锁，防止多个标签页同时弹窗
 *
 * 触发时机：
 * - 定时轮询（默认 5 分钟）
 * - 页面获得焦点（focus）
 * - 网络恢复（online）
 * - 页面显示（pageshow）
 * - 页面可见性变化（visibilitychange）
 */

import { h } from 'vue'
import { ElMessageBox } from 'element-plus'
import type { Action, MessageBoxState } from 'element-plus'

/** 远程版本信息结构 */
interface RemoteVersionInfo {
  /** 语义化版本号，如 "1.2.3" 或 "v1.2.3" */
  version?: string
  /** 构建唯一标识，优先级高于 version 用于判断是否有新构建 */
  buildId?: string
  /** 构建时间（仅展示用） */
  buildTime?: string
  /** 是否启用更新提示弹窗，为 false 时静默跳过 */
  enabled?: boolean
  /** 是否强制更新，为 true 时用户无法跳过 */
  forceUpdate?: boolean
  /** 自定义更新提示文案 */
  message?: string
}

/** version.json 响应类型：可以是完整对象，也可以是纯版本号字符串 */
type VersionResponse = RemoteVersionInfo | string

// ======================== 常量配置 ========================

/** 默认版本检查间隔：5 分钟 */
const DEFAULT_CHECK_INTERVAL = 5 * 60 * 1000
/** 默认贪睡时长：30 分钟（用户点击"稍后再说"后的静默期） */
const DEFAULT_SNOOZE_DURATION = 30 * 60 * 1000
/** localStorage key：贪睡状态 */
const SNOOZE_KEY = 'sys-version-update-snooze'
/** localStorage key：弹窗互斥锁（防止多标签页同时弹窗） */
const DIALOG_LOCK_KEY = 'sys-version-update-dialog-lock'
/** localStorage key：跨标签页事件通信 */
const CROSS_TAB_EVENT_KEY = 'sys-version-update-event'
/** 弹窗锁有效期：2 分钟（超时自动释放，防止死锁） */
const DIALOG_LOCK_DURATION = 2 * 60 * 1000
/** 当前标签页唯一标识，用于区分多标签页 */
const TAB_ID = `${Date.now()}-${Math.random().toString(36).slice(2)}`

// ======================== 模块级状态 ========================

/** 定时器 ID */
let intervalId: number | null = null
/** 弹窗是否正在显示（防止重复弹出） */
let dialogVisible = false
/** 是否正在执行版本检查（防止并发请求） */
let checking = false

// ======================== 工具函数 ========================

/**
 * 解析时长配置值
 * @param value - 环境变量中的字符串值
 * @param fallback - 解析失败时的默认值
 * @returns 有效的毫秒数
 */
function parseDuration(value: string | undefined, fallback: number): number {
  const parsed = Number(value)

  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/** 实际使用的检查间隔（支持通过环境变量 VITE_VERSION_CHECK_INTERVAL 覆盖） */
const CHECK_INTERVAL = parseDuration(
  import.meta.env.VITE_VERSION_CHECK_INTERVAL,
  DEFAULT_CHECK_INTERVAL
)
/** 实际使用的贪睡时长（支持通过环境变量 VITE_VERSION_SNOOZE_DURATION 覆盖） */
const SNOOZE_DURATION = parseDuration(
  import.meta.env.VITE_VERSION_SNOOZE_DURATION,
  DEFAULT_SNOOZE_DURATION
)

// ======================== 事件处理 ========================

/** 页面可见性变化时触发检查（从隐藏变为可见时） */
function handleVisibilityChange(): void {
  if (!document.hidden) {
    void checkAppVersion({ force: true })
  }
}

/** 页面获得焦点 / 网络恢复 / pageshow 时触发检查 */
function handleActiveCheck(): void {
  void checkAppVersion({ force: true })
}

// ======================== 版本号处理 ========================

/**
 * 标准化版本号：去除前后空格和开头的 "v" 前缀
 * @example normalizeVersion("v1.2.3") => "1.2.3"
 */
function normalizeVersion(version: string | undefined): string {
  return (version || '').trim().replace(/^v/i, '')
}

/**
 * 构造 version.json 的请求 URL
 * 基于 BASE_URL 拼接，并附加时间戳参数防止缓存
 */
function getVersionUrl(): string {
  const base = import.meta.env.BASE_URL || '/'
  const normalizedBase = base.endsWith('/') ? base : `${base}/`
  const separator = normalizedBase.includes('?') ? '&' : '?'

  return `${normalizedBase}version.json${separator}t=${Date.now()}`
}

// ======================== 贪睡机制 ========================

/**
 * 判断指定版本是否处于贪睡状态
 * 用户点击"稍后再说"后，在贪睡时长内不再弹窗提醒
 */
function isSnoozed(version: string): boolean {
  try {
    const raw = localStorage.getItem(SNOOZE_KEY)
    if (!raw) return false

    const snooze = JSON.parse(raw) as { version?: string; expiresAt?: number }
    return snooze.version === version && Number(snooze.expiresAt) > Date.now()
  } catch {
    localStorage.removeItem(SNOOZE_KEY)
    return false
  }
}

/**
 * 设置贪睡状态
 * 将版本号和过期时间写入 localStorage
 */
function snooze(version: string): void {
  localStorage.setItem(
    SNOOZE_KEY,
    JSON.stringify({
      version,
      expiresAt: Date.now() + SNOOZE_DURATION
    })
  )
}

// ======================== 版本比对 ========================

/**
 * 获取更新标识 key
 * 优先使用 buildId，其次使用标准化后的 version
 */
function getUpdateKey(versionInfo: RemoteVersionInfo): string {
  return versionInfo.buildId || normalizeVersion(versionInfo.version)
}

/** 获取当前应用的构建 ID（由构建工具注入的全局变量） */
function getCurrentBuildId(): string {
  return typeof __APP_BUILD_ID__ === 'string' ? __APP_BUILD_ID__ : ''
}

/**
 * 判断远程版本是否为新构建
 * 优先比对 buildId，若不可用则回退到 version 比对
 */
function hasNewBuild(versionInfo: RemoteVersionInfo): boolean {
  const latestVersion = normalizeVersion(versionInfo.version)
  const currentVersion = normalizeVersion(__APP_VERSION__)
  const currentBuildId = getCurrentBuildId()

  // 优先使用 buildId 精确比对
  if (versionInfo.buildId && currentBuildId) {
    return versionInfo.buildId !== currentBuildId
  }

  // 回退到版本号字符串比对
  return Boolean(latestVersion && latestVersion !== currentVersion)
}

// ======================== 跨标签页弹窗互斥锁 ========================

/**
 * 尝试获取弹窗锁
 * 确保同一时刻只有一个标签页弹出更新提示
 *
 * 实现原理：
 * 1. 检查是否已有未过期的锁
 * 2. 如果有且属于当前标签页，返回 true
 * 3. 如果没有或已过期，写入新锁并二次读取验证（简易竞争处理）
 */
function acquireDialogLock(updateKey: string): boolean {
  try {
    const raw = localStorage.getItem(DIALOG_LOCK_KEY)
    const lock = raw
      ? (JSON.parse(raw) as { updateKey?: string; owner?: string; expiresAt?: number })
      : null

    // 锁未过期且属于同一更新版本，仅锁持有者可通过
    if (lock?.updateKey === updateKey && Number(lock.expiresAt) > Date.now()) {
      return lock.owner === TAB_ID
    }

    // 写入新锁
    localStorage.setItem(
      DIALOG_LOCK_KEY,
      JSON.stringify({
        updateKey,
        owner: TAB_ID,
        expiresAt: Date.now() + DIALOG_LOCK_DURATION
      })
    )

    // 二次读取验证，简易处理多标签页竞争写入的情况
    const currentLock = JSON.parse(localStorage.getItem(DIALOG_LOCK_KEY) || '{}') as {
      owner?: string
    }

    return currentLock.owner === TAB_ID
  } catch {
    // 异常时放行，保证功能可用
    return true
  }
}

/**
 * 释放弹窗锁
 * 仅锁的持有者（当前标签页）可以释放
 */
function releaseDialogLock(updateKey: string): void {
  try {
    const raw = localStorage.getItem(DIALOG_LOCK_KEY)
    const lock = raw ? (JSON.parse(raw) as { updateKey?: string; owner?: string }) : null

    if (lock?.updateKey === updateKey && lock.owner === TAB_ID) {
      localStorage.removeItem(DIALOG_LOCK_KEY)
    }
  } catch {
    localStorage.removeItem(DIALOG_LOCK_KEY)
  }
}

// ======================== 跨标签页通信 ========================

/**
 * 通过 localStorage 的 storage 事件通知其他标签页
 * @param type - 事件类型：reload（刷新）或 snooze（贪睡）
 * @param updateKey - 对应的更新标识
 */
function notifyOtherTabs(type: 'reload' | 'snooze', updateKey: string): void {
  localStorage.setItem(
    CROSS_TAB_EVENT_KEY,
    JSON.stringify({
      type,
      updateKey,
      sender: TAB_ID,
      timestamp: Date.now()
    })
  )
}

/**
 * 执行更新刷新
 * 先通知其他标签页一起刷新，再刷新当前页面
 */
function reloadForUpdate(updateKey: string): void {
  notifyOtherTabs('reload', updateKey)
  window.location.reload()
}

/**
 * 监听 localStorage 的 storage 事件
 * 当其他标签页写入跨标签页事件时，当前标签页响应执行
 */
function handleStorageEvent(event: StorageEvent): void {
  if (event.key !== CROSS_TAB_EVENT_KEY || !event.newValue) return

  try {
    const payload = JSON.parse(event.newValue) as {
      type?: string
      sender?: string
    }

    // 忽略自己发出的事件
    if (payload.sender === TAB_ID) return

    // 收到 reload 指令时刷新页面
    if (payload.type === 'reload') {
      window.location.reload()
    }
  } catch {
    // 忽略其他标签页写入的异常内容
  }
}

// ======================== 远程版本获取 ========================

/**
 * 从远程获取版本信息
 * 请求 version.json 文件，禁用缓存以确保获取最新数据
 * @returns 版本信息对象，失败时返回 null
 */
async function fetchRemoteVersion(): Promise<RemoteVersionInfo | null> {
  try {
    const response = await fetch(getVersionUrl(), {
      cache: 'no-store',
      headers: {
        Accept: 'application/json'
      }
    })

    if (!response.ok) return null

    const data = (await response.json()) as VersionResponse

    // 兼容纯字符串格式的响应
    if (typeof data === 'string') {
      return { version: data }
    }

    return data
  } catch (error) {
    console.warn('[VersionChecker] 获取版本信息失败:', error)
    return null
  }
}

// ======================== 更新弹窗 ========================

/**
 * 显示版本更新提示弹窗
 *
 * 弹窗逻辑：
 * 1. 检查前置条件（是否已弹窗、是否贪睡中、是否获取到锁）
 * 2. 使用 ElMessageBox 展示更新信息
 * 3. 用户确认 → 刷新页面并通知其他标签页
 * 4. 用户取消 → 进入贪睡状态
 * 5. 强制更新模式下隐藏取消按钮和关闭按钮
 */
async function showUpdateDialog(versionInfo: RemoteVersionInfo): Promise<void> {
  const updateKey = getUpdateKey(versionInfo)
  const forceUpdate = versionInfo.forceUpdate === true

  // 前置条件校验：无更新标识 / 弹窗已显示 / 贪睡中 / 未获取到锁 → 跳过
  if (!updateKey || dialogVisible || isSnoozed(updateKey) || !acquireDialogLock(updateKey)) return

  dialogVisible = true

  const message = h('div', [h('p', '发现新版本，更新完成后即可体验最新功能与优化。')])

  try {
    await ElMessageBox.confirm(message, '系统更新通知', {
      confirmButtonText: '立即更新',
      cancelButtonText: forceUpdate ? undefined : '稍后再说',
      showCancelButton: !forceUpdate,
      showClose: !forceUpdate,
      closeOnClickModal: false,
      closeOnPressEscape: false,
      distinguishCancelAndClose: true,
      beforeClose: (action: Action, _instance: MessageBoxState, done: () => void) => {
        if (action === 'confirm') {
          // 确认更新：通知其他标签页并刷新
          reloadForUpdate(updateKey)
          return
        }

        done()
      }
    })
  } catch {
    // 用户点击取消或关闭弹窗（非强制更新时）
    if (!forceUpdate) {
      snooze(updateKey)
      notifyOtherTabs('snooze', updateKey)
    }
  } finally {
    dialogVisible = false
    releaseDialogLock(updateKey)
  }
}

// ======================== 对外暴露 API ========================

/**
 * 执行一次版本检查
 *
 * @param options.force - 是否强制检查（忽略页面隐藏状态）
 *
 * 流程：
 * 1. 防重入检查
 * 2. 获取远程版本信息
 * 3. 比对是否有新构建
 * 4. 有新版本则弹出更新提示
 */
export async function checkAppVersion(options: { force?: boolean } = {}): Promise<void> {
  if (checking || (!options.force && document.hidden)) return

  checking = true

  try {
    const remoteVersion = await fetchRemoteVersion()

    if (!remoteVersion || remoteVersion.enabled === false || !hasNewBuild(remoteVersion)) return

    await showUpdateDialog(remoteVersion)
  } finally {
    checking = false
  }
}

/**
 * 启动版本更新检测器
 *
 * 初始化行为：
 * 1. 立即执行一次版本检查
 * 2. 启动定时轮询
 * 3. 注册页面焦点、网络恢复、页面显示、跨标签页通信、可见性变化等事件监听
 *
 * 幂等设计：重复调用不会创建多个定时器
 */
export function startVersionUpdateChecker(): void {
  if (intervalId !== null) return

  // 启动时立即检查一次
  void checkAppVersion({ force: true })

  // 定时轮询
  intervalId = window.setInterval(() => {
    void checkAppVersion()
  }, CHECK_INTERVAL)

  // 注册各类触发事件
  window.addEventListener('focus', handleActiveCheck)
  window.addEventListener('online', handleActiveCheck)
  window.addEventListener('pageshow', handleActiveCheck)
  window.addEventListener('storage', handleStorageEvent)
  document.addEventListener('visibilitychange', handleVisibilityChange)
}

/**
 * 停止版本更新检测器
 *
 * 清理行为：
 * 1. 清除定时器
 * 2. 移除所有事件监听
 *
 * 幂等设计：未启动时调用无副作用
 */
export function stopVersionUpdateChecker(): void {
  if (intervalId === null) return

  window.clearInterval(intervalId)
  intervalId = null
  window.removeEventListener('focus', handleActiveCheck)
  window.removeEventListener('online', handleActiveCheck)
  window.removeEventListener('pageshow', handleActiveCheck)
  window.removeEventListener('storage', handleStorageEvent)
  document.removeEventListener('visibilitychange', handleVisibilityChange)
}
