<template>
  <div>
    <SectionTitle :title="$t('setting.menuColorMode.title')" class="mt-12.5" />
    <div class="box-border grid grid-cols-2 gap-1 p-[3px] mt-5 rounded-lg bg-g-200">
      <button
        v-for="option in options"
        :key="option.value"
        type="button"
        class="flex-c h-[38px] min-w-0 gap-1.5 rounded-md px-1.5 text-sm transition-all duration-200"
        :class="getOptionClass(option.value)"
        :disabled="isDisabled(option.value)"
        @click="settingStore.setMenuColorMode(option.value)"
      >
        <img
          :src="option.img"
          alt=""
          class="h-7 w-10 flex-shrink-0 rounded-[5px] border border-[var(--default-border)] object-cover"
        />
        <span class="truncate">{{ option.label }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
  import SectionTitle from './SectionTitle.vue'
  import { MenuColorModeEnum, SystemThemeEnum } from '@/enums/appEnum'
  import { useSettingStore } from '@/store/modules/setting'
  import { useI18n } from 'vue-i18n'
  import lightMenuStyle from '@imgs/settings/menu_styles/light.png'
  import darkMenuStyle from '@imgs/settings/menu_styles/dark.png'

  defineOptions({ name: 'MenuColorModeSettings' })

  const { t } = useI18n()
  const settingStore = useSettingStore()
  const { menuColorMode, systemThemeType } = storeToRefs(settingStore)

  const options = computed(() => [
    {
      value: MenuColorModeEnum.LIGHT,
      label: t('setting.menuColorMode.light'),
      img: lightMenuStyle
    },
    {
      value: MenuColorModeEnum.DARK,
      label: t('setting.menuColorMode.dark'),
      img: darkMenuStyle
    }
  ])

  const isDisabled = (value: MenuColorModeEnum) => {
    return systemThemeType.value === SystemThemeEnum.DARK && value === MenuColorModeEnum.LIGHT
  }

  const getOptionClass = (value: MenuColorModeEnum) => {
    if (isDisabled(value)) {
      return 'cursor-not-allowed text-g-500 opacity-45'
    }

    if (menuColorMode.value === value) {
      return 'cursor-pointer bg-[var(--default-box-color)] text-g-900 shadow-sm dark:bg-g-300 dark:!text-white'
    }

    return 'cursor-pointer text-g-700 hover:bg-black/[0.04] hover:text-g-900 dark:hover:bg-black/20'
  }
</script>
