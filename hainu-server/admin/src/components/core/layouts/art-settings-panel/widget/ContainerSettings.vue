<template>
  <div class="mt-7 mb-3 flex-cb">
    <span class="text-sm text-g-700">{{ $t('setting.container.title') }}</span>
    <ElSelect :model-value="containerWidth" class="!w-[132px]" @change="containerHandlers.setWidth">
      <ElOption
        v-for="option in containerWidthOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value"
      />
    </ElSelect>
  </div>
</template>

<script setup lang="ts">
  import { useSettingStore } from '@/store/modules/setting'
  import { useSettingsConfig } from '../composables/useSettingsConfig'
  import { useSettingsHandlers } from '../composables/useSettingsHandlers'
  import { storeToRefs } from 'pinia'

  const settingStore = useSettingStore()
  const { containerWidth } = storeToRefs(settingStore)
  const { containerWidthOptions } = useSettingsConfig()
  const { containerHandlers } = useSettingsHandlers()
</script>
