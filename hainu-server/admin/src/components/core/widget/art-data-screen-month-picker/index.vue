<template>
  <div ref="rootRef" class="art-ds-month-picker" :class="{ 'is-clearable': clearable }">
    <button class="trigger" type="button" @click.stop="panelOpen = !panelOpen">
      <span class="trigger-icon"></span>
      <span class="trigger-label">{{ label }}</span>
      <i
        v-if="clearable && modelValue"
        class="trigger-clear"
        role="button"
        tabindex="0"
        @click.stop="handleClear"
      >
        <ArtSvgIcon icon="ri:close-circle-line" />
      </i>
    </button>

    <div v-if="panelOpen" class="panel" @click.stop>
      <div class="panel-arrow"></div>
      <div class="panel-header">
        <button type="button" aria-label="上一年" @click="panelYear--">
          <ArtSvgIcon icon="ri:arrow-left-s-line" />
        </button>
        <strong>{{ panelYear }} 年</strong>
        <button type="button" aria-label="下一年" @click="panelYear++">
          <ArtSvgIcon icon="ri:arrow-right-s-line" />
        </button>
      </div>
      <div class="panel-grid">
        <button
          v-for="month in months"
          :key="month.value"
          :class="{ active: modelValue === `${panelYear}-${month.value}` }"
          type="button"
          @click="chooseMonth(month.value)"
        >
          {{ month.label }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtDataScreenMonthPicker' })

  const props = withDefaults(
    defineProps<{
      modelValue?: string
      placeholder?: string
      clearable?: boolean
    }>(),
    {
      modelValue: '',
      placeholder: '选择月份',
      clearable: false
    }
  )

  const emit = defineEmits<{
    (e: 'update:modelValue', value: string): void
  }>()

  const rootRef = ref<HTMLElement | null>(null)
  const panelOpen = ref(false)
  const panelYear = ref(new Date().getFullYear())

  const months = [
    { value: '01', label: '一月' },
    { value: '02', label: '二月' },
    { value: '03', label: '三月' },
    { value: '04', label: '四月' },
    { value: '05', label: '五月' },
    { value: '06', label: '六月' },
    { value: '07', label: '七月' },
    { value: '08', label: '八月' },
    { value: '09', label: '九月' },
    { value: '10', label: '十月' },
    { value: '11', label: '十一月' },
    { value: '12', label: '十二月' }
  ]

  const label = computed(() => {
    if (!props.modelValue) return props.placeholder
    const [year, month] = props.modelValue.split('-')
    return `${year}年${Number(month)}月`
  })

  watch(
    () => props.modelValue,
    (val) => {
      if (val) {
        const [year] = val.split('-')
        panelYear.value = Number(year) || panelYear.value
      }
    },
    { immediate: true }
  )

  const chooseMonth = (month: string) => {
    emit('update:modelValue', `${panelYear.value}-${month}`)
    panelOpen.value = false
  }

  const handleClear = () => {
    emit('update:modelValue', '')
    panelOpen.value = false
  }

  const handleOutside = (event: MouseEvent) => {
    if (!panelOpen.value) return
    const target = event.target as Node
    if (rootRef.value && !rootRef.value.contains(target)) {
      panelOpen.value = false
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
  .art-ds-month-picker {
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: flex-end;
  }

  .trigger {
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;
    height: 32px;
    padding: 0 14px;
    font-size: 13px;
    color: #5593e4;
    cursor: pointer;
    background: rgb(1 13 34 / 72%);
    border: 1px solid rgb(66 131 255 / 76%);
    border-radius: 3px;
    box-shadow:
      inset 0 0 15px rgb(14 97 211 / 18%),
      0 0 18px rgb(0 80 220 / 18%);
    transition:
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      color 0.2s ease;
  }

  .trigger:hover {
    color: #86b7ff;
    border-color: rgb(96 169 255 / 86%);
    box-shadow:
      inset 0 0 15px rgb(48 148 255 / 18%),
      0 0 10px rgb(0 117 255 / 18%);
  }

  .trigger-label {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .trigger-icon {
    width: 12px;
    height: 12px;
    border: 2px solid currentcolor;
    border-radius: 2px;
    box-shadow: inset 0 3px 0 rgb(82 125 202 / 35%);
  }

  .is-clearable .trigger {
    width: 154px;
    height: 37px;
    padding-right: 8px;
    font-size: 16px;
  }

  .is-clearable .trigger-icon {
    width: 14px;
    height: 14px;
  }

  .trigger-clear {
    display: grid;
    place-items: center;
    width: 15px;
    height: 15px;
    margin-left: auto;
    font-size: 15px;
    font-style: normal;
    line-height: 1;
    color: currentcolor;
    cursor: pointer;
    opacity: 0.78;
    transition:
      opacity 0.2s ease,
      color 0.2s ease;
  }

  .trigger-clear:hover {
    color: #9cccff;
    opacity: 1;
  }

  .trigger-clear :deep(.art-svg-icon) {
    display: block;
    width: 15px;
    height: 15px;
  }

  .panel {
    position: absolute;
    top: calc(100% + 10px);
    right: 0;
    z-index: 20;
    width: 270px;
    padding: 14px 15px 15px;
    background:
      linear-gradient(180deg, rgb(5 27 55 / 96%), rgb(1 10 25 / 97%)),
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
    right: 73px;
    width: 10px;
    height: 10px;
    background: rgb(5 27 55 / 96%);
    border-top: 1px solid rgb(70 163 255 / 48%);
    border-left: 1px solid rgb(70 163 255 / 48%);
    transform: rotate(45deg);
  }

  .panel-header {
    display: grid;
    grid-template-columns: 31px 1fr 31px;
    align-items: center;
    height: 29px;
    margin-bottom: 12px;
    color: #d8f7ff;
    text-align: center;
  }

  .panel-header strong {
    font-size: 15px;
    font-weight: 700;
    text-shadow: 0 0 10px rgb(79 202 255 / 64%);
  }

  .panel-header button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 31px;
    height: 26px;
    padding: 0;
    font-size: 18px;
    line-height: 0;
    color: #75caff;
    cursor: pointer;
    background: rgb(6 74 126 / 28%);
    border: 1px solid rgb(48 154 229 / 34%);
    transition:
      color 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease;
  }

  .panel-header button :deep(.art-svg-icon) {
    display: block;
    width: 18px;
    height: 18px;
  }

  .panel-header button:hover {
    color: #e7feff;
    border-color: rgb(88 218 255 / 72%);
    box-shadow: inset 0 0 10px rgb(67 203 255 / 22%);
  }

  .panel-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 8px;
  }

  .panel-grid button {
    height: 31px;
    font-size: 12px;
    color: #a9cae8;
    cursor: pointer;
    background: rgb(2 28 57 / 62%);
    border: 1px solid rgb(43 118 181 / 26%);
    box-shadow: inset 0 0 8px rgb(0 130 255 / 8%);
    transition:
      color 0.2s ease,
      background 0.2s ease,
      border-color 0.2s ease,
      box-shadow 0.2s ease,
      transform 0.2s ease;
  }

  .panel-grid button:hover,
  .panel-grid button.active {
    color: #efffff;
    background: linear-gradient(180deg, #0a83d2, #054f98);
    border-color: rgb(91 211 255 / 78%);
    box-shadow:
      inset 0 0 12px rgb(90 225 255 / 26%),
      0 0 12px rgb(0 162 255 / 26%);
  }

  .panel-grid button:hover {
    transform: translateY(-1px);
  }
</style>
