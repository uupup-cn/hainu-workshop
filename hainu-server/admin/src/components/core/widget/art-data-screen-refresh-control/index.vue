<template>
  <div ref="rootRef" class="art-ds-refresh-control" :class="{ 'is-error': Boolean(error) }">
    <button
      class="refresh-status"
      type="button"
      :disabled="loading"
      :title="error || lastUpdatedLabel"
      @click="$emit('refresh')"
    >
      <i :class="{ active: autoRefresh, loading }"></i>
      <span>{{ statusLabel }}</span>
    </button>

    <button
      class="switch-button"
      type="button"
      :class="{ active: autoRefresh }"
      :aria-pressed="autoRefresh"
      @click="$emit('update:autoRefresh', !autoRefresh)"
    >
      <i></i>
      <span>{{ autoRefresh ? '自动' : '手动' }}</span>
    </button>

    <div class="interval-select">
      <button
        class="interval-trigger"
        type="button"
        aria-label="刷新间隔"
        :aria-expanded="intervalOpen"
        title="刷新间隔"
        @click.stop="intervalOpen = !intervalOpen"
      >
        <span>{{ formatInterval(intervalSeconds) }}</span>
        <ArtSvgIcon icon="ri:arrow-down-s-line" />
      </button>

      <div v-if="intervalOpen" class="interval-panel" @click.stop>
        <div class="panel-arrow"></div>
        <button
          v-for="item in intervalOptions"
          :key="item"
          class="interval-option"
          :class="{ active: item === normalizedIntervalSeconds }"
          type="button"
          @click="chooseInterval(item)"
        >
          <span class="option-check">
            <ArtSvgIcon v-if="item === normalizedIntervalSeconds" icon="ri:check-line" />
          </span>
          <span>{{ formatInterval(item) }}</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtDataScreenRefreshControl' })

  const props = withDefaults(
    defineProps<{
      autoRefresh: boolean
      intervalSeconds: number
      loading?: boolean
      error?: string
      lastUpdatedAt?: Date | string | number | null
      nextRefreshIn?: number
      minIntervalSeconds?: number
      intervals?: number[]
    }>(),
    {
      loading: false,
      error: '',
      lastUpdatedAt: null,
      nextRefreshIn: 0,
      minIntervalSeconds: 5,
      intervals: () => [5, 10, 30, 60, 300]
    }
  )

  const emit = defineEmits<{
    (e: 'update:autoRefresh', value: boolean): void
    (e: 'update:intervalSeconds', value: number): void
    (e: 'refresh'): void
  }>()

  const rootRef = ref<HTMLElement | null>(null)
  const intervalOpen = ref(false)
  const pad = (value: number) => String(value).padStart(2, '0')

  const normalizedIntervalSeconds = computed(() =>
    Math.max(Math.round(props.intervalSeconds), props.minIntervalSeconds)
  )

  const intervalOptions = computed(() => {
    const values = [...props.intervals, normalizedIntervalSeconds.value]
      .map((item) => Math.max(Math.round(item), props.minIntervalSeconds))
      .filter((item) => Number.isFinite(item))

    return [...new Set(values)].sort((a, b) => a - b)
  })

  const lastUpdatedLabel = computed(() => {
    if (!props.lastUpdatedAt) return '等待首次刷新'
    const date =
      props.lastUpdatedAt instanceof Date ? props.lastUpdatedAt : new Date(props.lastUpdatedAt)
    if (Number.isNaN(date.getTime())) return '等待首次刷新'
    return `更新于 ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
  })

  const statusLabel = computed(() => {
    if (props.loading) return '刷新中'
    if (props.error) return '刷新失败'
    if (props.autoRefresh && props.nextRefreshIn > 0) return `${props.nextRefreshIn}s`
    return '刷新'
  })

  const formatInterval = (seconds: number) => {
    if (seconds < 60) return `${seconds}秒`
    return `${Math.round(seconds / 60)}分钟`
  }

  const chooseInterval = (value: number) => {
    emit('update:intervalSeconds', value)
    intervalOpen.value = false
  }

  const handleOutside = (event: MouseEvent) => {
    if (!intervalOpen.value) return
    const target = event.target as Node
    if (rootRef.value && !rootRef.value.contains(target)) {
      intervalOpen.value = false
    }
  }

  onMounted(() => {
    window.addEventListener('click', handleOutside)
  })

  onBeforeUnmount(() => {
    window.removeEventListener('click', handleOutside)
  })
</script>

<style scoped lang="scss">
  .art-ds-refresh-control {
    position: relative;
    display: inline-flex;
    align-items: center;
    height: 32px;
    font-size: 12px;
    color: #c8e7ff;
    letter-spacing: 0;
    background: rgb(4 25 58 / 58%);
    border: 1px solid rgb(70 188 255 / 32%);
    box-shadow:
      inset 0 0 14px rgb(55 167 255 / 9%),
      0 0 10px rgb(34 135 255 / 10%);
  }

  button {
    height: 30px;
    color: inherit;
    cursor: pointer;
    background: transparent;
    border: 0;
    outline: none;
    transition:
      color 180ms ease,
      background-color 180ms ease,
      opacity 180ms ease;
  }

  button:disabled {
    cursor: wait;
  }

  .refresh-status {
    display: inline-flex;
    gap: 7px;
    align-items: center;
    justify-content: center;
    min-width: 62px;
    padding: 0 9px;
    white-space: nowrap;
  }

  .refresh-status i {
    width: 7px;
    height: 7px;
    background: #6e8ba8;
    border-radius: 50%;
    box-shadow: 0 0 8px rgb(110 139 168 / 45%);
  }

  .refresh-status i.active {
    background: #29e2aa;
    box-shadow: 0 0 10px rgb(41 226 170 / 72%);
  }

  .refresh-status i.loading {
    background: #4dcfff;
    animation: ds-refresh-pulse 0.9s ease-in-out infinite;
  }

  .is-error .refresh-status i {
    background: #ff6868;
    box-shadow: 0 0 10px rgb(255 104 104 / 70%);
  }

  .switch-button {
    display: inline-flex;
    gap: 6px;
    align-items: center;
    justify-content: center;
    min-width: 44px;
    padding: 0 9px;
    border-right: 1px solid rgb(70 188 255 / 24%);
    border-left: 1px solid rgb(70 188 255 / 24%);
  }

  .switch-button i {
    width: 7px;
    height: 7px;
    background: #6e8ba8;
    border-radius: 50%;
    box-shadow: 0 0 8px rgb(110 139 168 / 36%);
  }

  .switch-button.active {
    color: #d8f7ff;
    background: transparent;
    box-shadow: none;
  }

  .switch-button.active i {
    background: #29e2aa;
    box-shadow: 0 0 10px rgb(41 226 170 / 72%);
  }

  .interval-select {
    position: relative;
    display: inline-flex;
    align-items: center;
  }

  .interval-trigger {
    display: inline-flex;
    gap: 2px;
    align-items: center;
    justify-content: center;
    min-width: 54px;
    padding: 0 7px 0 10px;
    text-align: center;
  }

  .interval-trigger :deep(.art-svg-icon) {
    width: 13px;
    height: 13px;
    color: #8ec9ff;
    opacity: 0.82;
    transition: transform 180ms ease;
  }

  .interval-trigger[aria-expanded='true'] :deep(.art-svg-icon) {
    transform: rotate(180deg);
  }

  button:hover,
  .interval-trigger:hover {
    background: rgb(69 203 255 / 10%);
  }

  button:focus-visible,
  .interval-trigger:focus-visible {
    box-shadow: inset 0 0 0 1px rgb(88 227 255 / 72%);
  }

  .interval-panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 30;
    width: 126px;
    padding: 8px;
    background:
      linear-gradient(180deg, rgb(5 27 55 / 97%), rgb(1 10 25 / 98%)),
      linear-gradient(90deg, rgb(21 139 225 / 14%), transparent);
    border: 1px solid rgb(70 163 255 / 48%);
    box-shadow:
      inset 0 0 22px rgb(0 134 255 / 16%),
      0 14px 34px rgb(0 0 0 / 48%),
      0 0 19px rgb(0 133 255 / 22%);
  }

  .panel-arrow {
    position: absolute;
    top: -5px;
    right: 22px;
    width: 10px;
    height: 10px;
    background: rgb(5 27 55 / 97%);
    border-top: 1px solid rgb(70 163 255 / 48%);
    border-left: 1px solid rgb(70 163 255 / 48%);
    transform: rotate(45deg);
  }

  .interval-option {
    display: grid;
    grid-template-columns: 18px 1fr;
    gap: 6px;
    align-items: center;
    width: 100%;
    height: 34px;
    padding: 0 10px;
    font-size: 13px;
    color: #a9cae8;
    text-align: left;
    background: rgb(2 28 57 / 46%);
    border: 1px solid transparent;
    transition:
      color 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .interval-option + .interval-option {
    margin-top: 5px;
  }

  .option-check {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    color: #d8f7ff;
  }

  .option-check :deep(.art-svg-icon) {
    width: 16px;
    height: 16px;
    filter: drop-shadow(0 0 6px rgb(78 214 255 / 72%));
  }

  .interval-option:hover,
  .interval-option.active {
    color: #efffff;
    background: linear-gradient(180deg, #0a83d2, #054f98);
    border-color: rgb(91 211 255 / 78%);
    box-shadow:
      inset 0 0 12px rgb(90 225 255 / 26%),
      0 0 12px rgb(0 162 255 / 22%);
  }

  @keyframes ds-refresh-pulse {
    0%,
    100% {
      opacity: 0.62;
      transform: scale(0.8);
    }

    50% {
      opacity: 1;
      transform: scale(1.35);
    }
  }
</style>
