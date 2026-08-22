/**
 * 通知状态管理模块
 *
 * 提供通知收件箱、未读数、实时连接和已读状态管理
 *
 * @module store/modules/notification
 * @author Ci-Yuu-Plus Team
 */
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { ElNotification } from 'element-plus'
import {
  fetchMarkAllNotificationsRead,
  fetchMarkNotificationRead,
  fetchNotificationInbox,
  fetchNotificationStats,
  fetchNotificationStreamToken
} from '@/api/notifications'
import { refreshAccessToken } from '@/utils/http'
import { StorageConfig } from '@/utils/storage/storage-config'
import { useUserStore } from './user'

// 构建通知流地址
function buildStreamUrl(streamToken: string) {
  const baseUrl = import.meta.env.VITE_API_URL
  const path = `/api/v1/notifications/stream?streamToken=${encodeURIComponent(streamToken)}`

  if (!baseUrl || baseUrl === '/') {
    return path
  }

  return `${String(baseUrl).replace(/\/$/, '')}${path}`
}

// 解析 JWT 载荷
function parseJwtPayload(token: string) {
  const segments = token.split('.')
  if (segments.length < 2) {
    return null
  }

  try {
    const normalized = segments[1].replace(/-/g, '+').replace(/_/g, '/')
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, '=')
    return JSON.parse(atob(padded)) as { exp?: number }
  } catch {
    return null
  }
}

// 判断 token 是否即将过期
function isTokenExpiringSoon(token: string, thresholdSeconds = 30) {
  const payload = parseJwtPayload(token)
  if (typeof payload?.exp !== 'number') {
    return false
  }

  return payload.exp * 1000 <= Date.now() + thresholdSeconds * 1000
}

const STREAM_OWNER_KEY = StorageConfig.generateStorageKey('notification-stream-owner')
const STREAM_OWNER_TTL_MS = 12000
const STREAM_OWNER_HEARTBEAT_MS = 4000

interface StreamOwnerRecord {
  id: string
  updatedAt: number
}

function createTabId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }

  return `${Date.now()}-${Math.random().toString(36).slice(2)}`
}

function readStreamOwner(): StreamOwnerRecord | null {
  try {
    const raw = localStorage.getItem(STREAM_OWNER_KEY)
    return raw ? (JSON.parse(raw) as StreamOwnerRecord) : null
  } catch {
    localStorage.removeItem(STREAM_OWNER_KEY)
    return null
  }
}

function isStreamOwnerFresh(owner: StreamOwnerRecord | null) {
  return !!owner && Date.now() - owner.updatedAt < STREAM_OWNER_TTL_MS
}

export const useNotificationStore = defineStore('notificationStore', () => {
  const inbox = ref<Api.Interaction.NotificationInboxItem[]>([])
  const unreadCount = ref(0)
  const loading = ref(false)
  const connected = ref(false)
  const streamFailureCount = ref(0)

  const tabId = createTabId()

  let eventSource: EventSource | null = null
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let ownerHeartbeatTimer: ReturnType<typeof setInterval> | null = null
  let streamCoordinatorInitialized = false
  let connectPromise: Promise<void> | null = null
  let lastPopupNotificationId: number | null = null

  const STREAM_RECONNECT_DELAY_MS = 5000
  const STREAM_MAX_FAILURES = 3

  const hasUnread = computed(() => unreadCount.value > 0)

  // 清除重连定时器
  const clearReconnectTimer = () => {
    if (!reconnectTimer) return
    clearTimeout(reconnectTimer)
    reconnectTimer = null
  }

  const clearOwnerHeartbeat = () => {
    if (!ownerHeartbeatTimer) return
    clearInterval(ownerHeartbeatTimer)
    ownerHeartbeatTimer = null
  }

  const isCurrentTabVisible = () =>
    typeof document === 'undefined' || document.visibilityState === 'visible'

  const isCurrentStreamOwner = () => readStreamOwner()?.id === tabId

  const writeStreamOwner = () => {
    localStorage.setItem(
      STREAM_OWNER_KEY,
      JSON.stringify({
        id: tabId,
        updatedAt: Date.now()
      } satisfies StreamOwnerRecord)
    )
  }

  const acquireStreamOwnership = () => {
    if (!isCurrentTabVisible()) return false

    const owner = readStreamOwner()
    if (isStreamOwnerFresh(owner) && owner?.id !== tabId) {
      return false
    }

    writeStreamOwner()

    return isCurrentStreamOwner()
  }

  const releaseStreamOwnership = () => {
    clearOwnerHeartbeat()

    if (isCurrentStreamOwner()) {
      localStorage.removeItem(STREAM_OWNER_KEY)
    }
  }

  const startOwnerHeartbeat = () => {
    clearOwnerHeartbeat()
    writeStreamOwner()

    ownerHeartbeatTimer = setInterval(() => {
      if (!isCurrentTabVisible()) {
        disconnectStream()
        return
      }

      if (!isCurrentStreamOwner()) {
        disconnectStream()
        return
      }

      writeStreamOwner()
    }, STREAM_OWNER_HEARTBEAT_MS)
  }

  // 断开通知流连接
  const disconnectStream = (options: { releaseOwner?: boolean } = {}) => {
    clearReconnectTimer()
    clearOwnerHeartbeat()
    connected.value = false
    eventSource?.close()
    eventSource = null

    if (options.releaseOwner !== false) {
      releaseStreamOwnership()
    }
  }

  // 拉取通知收件箱数据
  const fetchInbox = async (params: Partial<Api.Interaction.NotificationInboxQuery> = {}) => {
    loading.value = true

    try {
      const data = await fetchNotificationInbox({
        current: 1,
        size: 6,
        ...params
      })

      inbox.value = data.records
      unreadCount.value = data.unreadCount
      return data
    } finally {
      loading.value = false
    }
  }

  // 刷新未读数量
  const refreshUnreadCount = async () => {
    const stats = await fetchNotificationStats()
    unreadCount.value = stats.unreadCount
  }

  // 标记单条通知已读
  const markAsRead = async (id: number) => {
    await fetchMarkNotificationRead(id)
    inbox.value = inbox.value.map((item) =>
      item.id === id ? { ...item, isRead: true, readAt: new Date().toISOString() } : item
    )
    unreadCount.value = Math.max(0, unreadCount.value - 1)
  }

  // 标记全部通知已读
  const markAllAsRead = async () => {
    await fetchMarkAllNotificationsRead()
    inbox.value = inbox.value.map((item) => ({
      ...item,
      isRead: true,
      readAt: item.readAt || new Date().toISOString()
    }))
    unreadCount.value = 0
  }

  // 安排通知流重连
  const scheduleReconnect = () => {
    if (reconnectTimer) return
    if (streamFailureCount.value >= STREAM_MAX_FAILURES) return
    if (!isCurrentTabVisible()) return

    const owner = readStreamOwner()
    if (isStreamOwnerFresh(owner) && owner?.id !== tabId) return

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null
      void connectStream()
    }, STREAM_RECONNECT_DELAY_MS)
  }

  // 确保通知流使用的访问令牌有效
  const ensureStreamAccessToken = async (forceRefresh = false) => {
    const userStore = useUserStore()
    if (!userStore.accessToken) {
      return ''
    }

    if (!forceRefresh && !isTokenExpiringSoon(userStore.accessToken)) {
      return userStore.accessToken
    }

    try {
      return await refreshAccessToken()
    } catch {
      return forceRefresh ? userStore.accessToken : ''
    }
  }

  // 建立通知实时连接
  const connectStream = async () => {
    if (connectPromise) {
      return connectPromise
    }

    connectPromise = doConnectStream()
      .catch((error) => {
        console.error('[Notification] 通知流连接失败:', error)
        connected.value = false
        streamFailureCount.value += 1
        disconnectStream({ releaseOwner: true })
        scheduleReconnect()
      })
      .finally(() => {
        connectPromise = null
      })

    return connectPromise
  }

  const doConnectStream = async () => {
    if (eventSource) return
    if (!acquireStreamOwnership()) return

    const accessToken = await ensureStreamAccessToken(streamFailureCount.value > 0)
    if (!accessToken) {
      disconnectStream({ releaseOwner: true })
      return
    }

    const { token: streamToken } = await fetchNotificationStreamToken()
    if (!streamToken) {
      disconnectStream({ releaseOwner: true })
      return
    }

    if (!isCurrentTabVisible() || !isCurrentStreamOwner()) {
      disconnectStream({ releaseOwner: false })
      return
    }

    const source = new EventSource(buildStreamUrl(streamToken))
    eventSource = source

    source.addEventListener('connected', () => {
      connected.value = true
      streamFailureCount.value = 0
      startOwnerHeartbeat()
    })

    source.addEventListener('notification', () => {
      void refreshBellData({ popupLatest: true })
    })

    source.onerror = () => {
      connected.value = false
      source.close()
      if (eventSource === source) {
        eventSource = null
      }
      streamFailureCount.value += 1

      if (streamFailureCount.value >= STREAM_MAX_FAILURES) {
        disconnectStream()
        return
      }

      scheduleReconnect()
    }
  }

  const handleVisibilityChange = () => {
    if (isCurrentTabVisible()) {
      streamFailureCount.value = 0
      void refreshBellData()
      void connectStream()
      return
    }

    disconnectStream({ releaseOwner: true })
  }

  const handleStorageChange = (event: StorageEvent) => {
    if (event.key !== STREAM_OWNER_KEY) return
    if (!isCurrentTabVisible()) return
    if (event.newValue) return

    void connectStream()
  }

  const setupStreamCoordinator = () => {
    if (streamCoordinatorInitialized || typeof window === 'undefined') return

    streamCoordinatorInitialized = true
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('storage', handleStorageChange)
    window.addEventListener('pagehide', () => disconnectStream({ releaseOwner: true }))
    window.addEventListener('beforeunload', () => disconnectStream({ releaseOwner: true }))
  }

  // 刷新通知角标和收件箱数据
  const refreshBellData = async (options?: { popupLatest?: boolean }) => {
    const previousTopId = inbox.value[0]?.id
    const data = await fetchInbox({ current: 1, size: 6 })

    if (options?.popupLatest) {
      const latest = data.records[0]
      if (latest && latest.id !== previousTopId && latest.id !== lastPopupNotificationId) {
        lastPopupNotificationId = latest.id
        ElNotification({
          title: '新通知',
          message: latest.title,
          type: mapNotificationTypeToPopupType(latest.type),
          duration: 5000
        })
      }
    }
  }

  // 初始化通知 store
  const init = async () => {
    const userStore = useUserStore()
    if (!userStore.accessToken) return

    setupStreamCoordinator()
    await Promise.allSettled([refreshBellData(), refreshUnreadCount()])
    void connectStream()
  }

  return {
    inbox,
    unreadCount,
    loading,
    connected,
    hasUnread,
    init,
    fetchInbox,
    refreshBellData,
    refreshUnreadCount,
    markAsRead,
    markAllAsRead,
    connectStream,
    disconnectStream
  }
})

// 将通知类型映射为弹窗提示类型
function mapNotificationTypeToPopupType(
  type: Api.Interaction.NotificationType
): 'success' | 'warning' | 'info' | 'error' {
  switch (type) {
    case 'ANNOUNCEMENT':
      return 'success'
    case 'ALERT':
      return 'error'
    case 'UPDATE':
      return 'warning'
    default:
      return 'info'
  }
}
