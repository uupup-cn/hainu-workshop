<template>
  <div>
    <SectionTitle :title="$t('setting.direction.title')" class="mt-12.5" />
    <div class="box-border flex-cb p-1 mt-5 rounded-lg bg-g-200">
      <div
        v-for="option in layoutDirectionOptions"
        :key="option.value"
        class="w-[calc(50%-3px)] h-8.5 leading-8.5 text-sm text-center c-p select-none rounded-md transition-all duration-200"
        :class="
          isActive(option.value)
            ? 'text-g-800 bg-[var(--default-box-color)] dark:!text-white dark:bg-g-300'
            : 'hover:text-g-800 hover:bg-black/[0.04] dark:hover:bg-black/20'
        "
        @click="basicHandlers.layoutDirection(option.value)"
      >
        {{ option.label }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { storeToRefs } from 'pinia'
  import { useSettingStore } from '@/store/modules/setting'
  import { useSettingsConfig } from '../composables/useSettingsConfig'
  import { useSettingsHandlers } from '../composables/useSettingsHandlers'
  import SectionTitle from './SectionTitle.vue'

  defineOptions({ name: 'DirectionSettings' })

  const settingStore = useSettingStore()
  const { layoutDirection } = storeToRefs(settingStore)
  const { layoutDirectionOptions } = useSettingsConfig()
  const { basicHandlers } = useSettingsHandlers()

  const isActive = (direction: string) => layoutDirection.value === direction
</script>
