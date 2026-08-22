<template>
  <Teleport to="body">
    <Transition name="theme-customizer">
      <div v-if="visible" :class="themeLayerClass" :style="themeLayerStyle" @click.self="close">
        <section
          ref="panelRef"
          :class="themePanelClass"
          :style="panelMorphStyle"
          role="dialog"
          aria-modal="true"
          aria-label="主题配置面板"
        >
          <section :class="workbenchClass">
            <aside :class="railClass">
              <div :class="[motionItemClass, 'flex items-center justify-between px-0.5 pt-1.5']">
                <div>
                  <h2 class="m-0 mt-0.5 text-base font-semibold leading-[22px]">主题配置</h2>
                </div>
                <button
                  type="button"
                  :class="iconButtonClass"
                  aria-label="关闭主题配置"
                  @click="close"
                >
                  <ArtSvgIcon icon="ri:close-line" />
                </button>
              </div>

              <div class="theme-scrollbar min-h-0 flex-1 overflow-y-auto overscroll-contain">
                <div class="flex min-h-full flex-col gap-3.5 pb-0.5">
                  <div
                    v-if="isCompactMode"
                    :class="[
                      motionItemClass,
                      'grid grid-cols-3 gap-1.5 rounded-[10px] border border-white/10 bg-white/5 p-1 shadow-inner [transition-delay:70ms]'
                    ]"
                    aria-label="系统主题模式"
                  >
                    <button
                      v-for="option in systemThemeOptions"
                      :key="option.value"
                      type="button"
                      :class="[
                        railModeButtonClass,
                        { 'is-active': systemThemeMode === option.value }
                      ]"
                      @click="switchSystemTheme(option.value)"
                    >
                      {{ option.label }}
                    </button>
                  </div>

                  <div :class="[motionItemClass, 'flex flex-col gap-2 [transition-delay:100ms]']">
                    <ElDropdown
                      trigger="click"
                      :hide-on-click="false"
                      :popper-class="dropdownPopperClass"
                      @visible-change="(isOpen) => syncDropdownWidth(isOpen, styleTriggerRef)"
                      @command="selectStylePreset"
                    >
                      <button ref="styleTriggerRef" type="button" :class="controlRowClass">
                        <span>
                          <small :class="controlMetaClass">风格</small>
                          <strong :class="controlValueClass">
                            {{ activeStylePreset?.name || 'Custom' }}
                          </strong>
                        </span>
                        <ArtSvgIcon icon="ri:arrow-down-s-line" class="text-base text-white/70" />
                      </button>
                      <template #dropdown>
                        <ElDropdownMenu class="!border-0 !bg-transparent !p-0 !shadow-none">
                          <ElDropdownItem
                            v-for="preset in THEME_STYLE_PRESETS"
                            :key="preset.id"
                            :class="dropdownItemClass"
                            :command="preset.id"
                          >
                            <span class="inline-flex items-center">
                              <i
                                v-for="color in getStylePresetSwatches(preset)"
                                :key="`${preset.id}-${color}`"
                                class="-ml-1 h-3 w-3 rounded-full border border-white/30 first:ml-0"
                                :style="{ background: color }"
                              />
                            </span>
                            <span>{{ preset.name }}</span>
                            <ArtSvgIcon
                              v-if="preset.id === themeCustomizer.stylePresetId"
                              icon="ri:check-line"
                              class="justify-self-end text-white/80"
                            />
                          </ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>

                    <ElDropdown
                      trigger="click"
                      :hide-on-click="false"
                      :popper-class="dropdownPopperClass"
                      @visible-change="(isOpen) => syncDropdownWidth(isOpen, basePaletteTriggerRef)"
                      @command="selectBasePalette"
                    >
                      <button ref="basePaletteTriggerRef" type="button" :class="controlRowClass">
                        <span>
                          <small :class="controlMetaClass">底色</small>
                          <strong :class="controlValueClass">
                            {{ activeBasePalette?.name || 'Custom' }}
                          </strong>
                        </span>
                        <i
                          :class="surfaceSwatchClass"
                          :style="
                            activeBasePalette
                              ? getBasePalettePreviewStyle(activeBasePalette)
                              : undefined
                          "
                        />
                      </button>
                      <template #dropdown>
                        <ElDropdownMenu class="!border-0 !bg-transparent !p-0 !shadow-none">
                          <ElDropdownItem
                            v-for="palette in THEME_BASE_PALETTES"
                            :key="palette.id"
                            :class="dropdownItemClass"
                            :command="palette.id"
                          >
                            <i
                              :class="surfaceSwatchClass"
                              :style="getBasePalettePreviewStyle(palette)"
                            />
                            <span>{{ palette.name }}</span>
                            <ArtSvgIcon
                              v-if="palette.id === themeCustomizer.basePaletteId"
                              icon="ri:check-line"
                              class="justify-self-end text-white/80"
                            />
                          </ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>

                    <ElDropdown
                      trigger="click"
                      :hide-on-click="false"
                      :popper-class="dropdownPopperClass"
                      @visible-change="
                        (isOpen) => syncDropdownWidth(isOpen, accentPaletteTriggerRef)
                      "
                      @command="selectAccentPalette"
                    >
                      <button ref="accentPaletteTriggerRef" type="button" :class="controlRowClass">
                        <span>
                          <small :class="controlMetaClass">主题</small>
                          <strong :class="controlValueClass">
                            {{ activeAccentPalette?.name || 'Custom' }}
                          </strong>
                        </span>
                        <i :class="colorSwatchClass" :style="{ background: systemThemeColor }" />
                      </button>
                      <template #dropdown>
                        <ElDropdownMenu class="!border-0 !bg-transparent !p-0 !shadow-none">
                          <ElDropdownItem
                            v-for="palette in THEME_ACCENT_PALETTES"
                            :key="palette.id"
                            :class="dropdownItemClass"
                            :command="palette.color"
                          >
                            <i :class="colorSwatchClass" :style="{ background: palette.color }" />
                            <span>{{ palette.name }}</span>
                            <ArtSvgIcon
                              v-if="palette.id === activeAccentPalette?.id"
                              icon="ri:check-line"
                              class="justify-self-end text-white/80"
                            />
                          </ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>

                    <ElDropdown
                      trigger="click"
                      :hide-on-click="false"
                      :popper-class="dropdownPopperClass"
                      @visible-change="(isOpen) => syncDropdownWidth(isOpen, radiusTriggerRef)"
                      @command="selectRadius"
                    >
                      <button ref="radiusTriggerRef" type="button" :class="controlRowClass">
                        <span>
                          <small :class="controlMetaClass">圆角</small>
                          <strong :class="controlValueClass">
                            {{ activeRadiusOption?.name || 'Custom' }}
                          </strong>
                        </span>
                        <ArtSvgIcon icon="ri:rounded-corner" class="text-base text-white/70" />
                      </button>
                      <template #dropdown>
                        <ElDropdownMenu class="!border-0 !bg-transparent !p-0 !shadow-none">
                          <ElDropdownItem
                            v-for="option in THEME_RADIUS_OPTIONS"
                            :key="option.id"
                            :class="dropdownItemClass"
                            :command="option.value"
                          >
                            <span>{{ option.name }}</span>
                            <span />
                            <ArtSvgIcon
                              v-if="option.value === customRadius"
                              icon="ri:check-line"
                              class="justify-self-end text-white/80"
                            />
                          </ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>

                    <ElDropdown
                      trigger="click"
                      :hide-on-click="false"
                      :popper-class="dropdownPopperClass"
                      @visible-change="
                        (isOpen) => syncDropdownWidth(isOpen, chartPaletteTriggerRef)
                      "
                      @command="selectChartPalette"
                    >
                      <button ref="chartPaletteTriggerRef" type="button" :class="controlRowClass">
                        <span>
                          <small :class="controlMetaClass">图表颜色</small>
                          <strong :class="controlValueClass">
                            {{ activeChartPalette?.name || 'Custom' }}
                          </strong>
                        </span>
                        <span class="inline-flex items-center">
                          <i
                            v-for="color in themeCustomizer.chartThemeColors.slice(0, 3)"
                            :key="color"
                            class="-ml-1 h-3.5 w-3.5 rounded-full border border-white/30 first:ml-0"
                            :style="{ background: color }"
                          />
                        </span>
                      </button>
                      <template #dropdown>
                        <ElDropdownMenu class="!border-0 !bg-transparent !p-0 !shadow-none">
                          <ElDropdownItem
                            v-for="palette in THEME_CHART_PALETTES"
                            :key="palette.id"
                            :class="dropdownItemClass"
                            :command="palette.id"
                          >
                            <span class="inline-flex items-center">
                              <i
                                v-for="color in palette.colors"
                                :key="color"
                                class="-ml-1 h-3 w-3 rounded-full border border-white/30 first:ml-0"
                                :style="{ background: color }"
                              />
                            </span>
                            <span>{{ palette.name }}</span>
                            <ArtSvgIcon
                              v-if="palette.id === themeCustomizer.chartPaletteId"
                              icon="ri:check-line"
                              class="justify-self-end text-white/80"
                            />
                          </ElDropdownItem>
                        </ElDropdownMenu>
                      </template>
                    </ElDropdown>
                  </div>

                  <div
                    :class="[
                      motionItemClass,
                      'mt-0.5 rounded-lg border border-white/10 bg-white/5 p-3 [transition-delay:130ms]'
                    ]"
                    aria-label="高级主题配置"
                  >
                    <div class="mb-3 flex justify-between text-xs font-semibold">
                      <span>高级主题</span>
                      <small class="text-white/45">语义与层次</small>
                    </div>

                    <div>
                      <div class="mb-2.5 flex justify-between gap-2.5">
                        <span :class="advancedLabelClass">盒子质感</span>
                        <small class="text-[11px] text-white/45">模块层次</small>
                      </div>
                      <div class="grid grid-cols-2 gap-2">
                        <button
                          v-for="option in boxStyleOptions"
                          :key="option.label"
                          type="button"
                          :class="[
                            boxStyleButtonClass,
                            option.active
                              ? 'border-white/24 bg-white/[0.12] text-white shadow-[inset_0_1px_0_rgb(255_255_255_/_0.05),0_1px_2px_rgb(0_0_0_/_0.12)]'
                              : 'border-white/10 bg-white/5 text-white/80 hover:-translate-y-px hover:border-white/15 hover:bg-white/10'
                          ]"
                          @click="selectBoxStyle(option.value)"
                        >
                          <strong class="block text-xs font-bold leading-[18px]">
                            {{ option.label }}
                          </strong>
                          <small
                            :class="[
                              'mt-0.5 block text-[11px] leading-[14px]',
                              option.active ? 'text-white/65' : 'text-white/45'
                            ]"
                          >
                            {{ option.description }}
                          </small>
                        </button>
                      </div>
                    </div>

                    <div v-for="group in advancedThemeColorItems" :key="group.title" class="mt-3.5">
                      <div class="mb-2.5 flex justify-between gap-2.5">
                        <span :class="advancedLabelClass">{{ group.title }}</span>
                      </div>
                      <div class="grid grid-cols-2 gap-2.5">
                        <label
                          v-for="item in group.items"
                          :key="item.key"
                          class="flex min-h-[42px] items-center justify-between gap-2.5 rounded-lg border border-white/10 bg-white/5 px-[11px] py-[9px]"
                        >
                          <span class="whitespace-nowrap text-xs font-semibold text-white/85">
                            {{ item.label }}
                          </span>
                          <ElColorPicker
                            class="theme-color-picker"
                            :model-value="themeCustomizer[item.key]"
                            :predefine="themePredefineColors"
                            @active-change="(value) => previewAdvancedThemeColor(item, value)"
                            @change="(value) => commitAdvancedThemeColor(item, value)"
                            @visible-change="
                              (isVisible: boolean) =>
                                handleAdvancedThemeColorVisibleChange(item, isVisible)
                            "
                          />
                        </label>
                      </div>
                    </div>
                  </div>

                  <div
                    :class="[
                      motionItemClass,
                      'rounded-lg border border-white/10 bg-white/5 p-3 [transition-delay:160ms]'
                    ]"
                    aria-label="图表颜色配置"
                  >
                    <div class="mb-3 flex justify-between text-xs font-semibold">
                      <span>图表颜色</span>
                      <small class="text-white/45">6 色调色盘</small>
                    </div>
                    <div class="grid grid-cols-6 gap-1.5">
                      <ElColorPicker
                        v-for="(color, index) in themeCustomizer.chartThemeColors"
                        :key="`chart-color-${index}`"
                        class="theme-color-picker"
                        :model-value="color"
                        :predefine="themePredefineColors"
                        @active-change="(value) => previewChartColor(index, value)"
                        @change="(value) => commitChartColor(index, value)"
                        @visible-change="
                          (isVisible: boolean) => handleChartColorVisibleChange(index, isVisible)
                        "
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="relative shrink-0 border-t border-white/[0.07] pt-2.5">
                <div
                  class="pointer-events-none absolute inset-x-0 bottom-[calc(100%-1px)] h-[18px] bg-[linear-gradient(180deg,rgb(32_33_36_/_0%),rgb(32_33_36_/_86%)_100%)]"
                />
                <div :class="[motionItemClass, 'grid grid-cols-2 gap-2 [transition-delay:190ms]']">
                  <button type="button" :class="actionButtonClass" @click="resetTheme">
                    重置
                  </button>
                  <button type="button" :class="actionButtonClass" @click="copyThemeConfig">
                    复制配置
                  </button>
                  <button type="button" :class="actionButtonClass" @click="toggleCustomizerMode">
                    {{ isCompactMode ? '展开' : '悬浮' }}
                  </button>
                  <button type="button" :class="actionButtonClass" @click="randomizeTheme">
                    随机
                  </button>
                </div>
              </div>
            </aside>

            <main v-if="!isCompactMode" :class="stageClass">
              <header
                :class="[
                  motionItemClass,
                  'mb-2 flex items-center justify-between gap-4 max-sm:flex-col max-sm:items-start [transition-delay:60ms]'
                ]"
              >
                <div>
                  <p class="m-0 mb-1 text-xs font-semibold leading-[18px] text-g-600">
                    配置效果预览
                  </p>
                  <h3 class="m-0 text-xl font-bold leading-7 text-g-900">
                    {{ activeStylePreset?.description || '当前配置效果' }}
                  </h3>
                </div>
                <div
                  class="inline-flex rounded-lg border bg-box p-[3px] [border-color:var(--default-border)] max-sm:w-full"
                  aria-label="系统主题模式"
                >
                  <button
                    v-for="option in systemThemeOptions"
                    :key="option.value"
                    type="button"
                    :class="[
                      'theme-mode-button h-7 cursor-pointer rounded-md border-0 bg-transparent px-[11px] text-xs text-g-600 max-sm:flex-1',
                      { 'is-active': systemThemeMode === option.value }
                    ]"
                    @click="switchSystemTheme(option.value)"
                  >
                    {{ option.label }}
                  </button>
                </div>
              </header>

              <section
                :class="[
                  motionItemClass,
                  'grid grid-cols-[minmax(0,1.25fr)_minmax(260px,0.9fr)] gap-2.5 max-[900px]:grid-cols-1 [transition-delay:100ms]'
                ]"
              >
                <article :class="[previewCardClass, 'min-h-[232px]']">
                  <div class="flex items-start justify-between">
                    <div>
                      <h4 :class="previewTitleClass">Contribution History</h4>
                      <p :class="previewTextClass">Last 6 months of activity</p>
                    </div>
                    <span
                      class="inline-flex h-[22px] items-center rounded-md px-2 text-xs font-semibold text-[var(--theme-primary-content)]"
                      :style="{ background: systemThemeColor }"
                    >
                      Live
                    </span>
                  </div>

                  <div class="mt-2.5 grid h-[62px] grid-cols-6 items-end gap-3" aria-hidden="true">
                    <i
                      v-for="(bar, index) in previewBars"
                      :key="bar.month"
                      class="mx-auto block min-h-6 w-[88%] rounded-t-[7px]"
                      :style="{
                        height: bar.height,
                        background:
                          themeCustomizer.chartThemeColors[
                            index % themeCustomizer.chartThemeColors.length
                          ]
                      }"
                    />
                  </div>
                  <div class="mt-1 grid grid-cols-6 gap-3 text-center text-xs text-g-500">
                    <span v-for="bar in previewBars" :key="bar.month">{{ bar.month }}</span>
                  </div>

                  <div class="my-2 grid grid-cols-2 gap-2 max-sm:grid-cols-1">
                    <div
                      class="rounded-lg bg-[color-mix(in_srgb,var(--default-bg-color)_72%,var(--default-box-color))] px-2.5 py-2"
                    >
                      <span class="mb-1 block text-[11px] font-bold uppercase text-g-500">
                        Upcoming
                      </span>
                      <strong class="block text-sm text-g-900">May 25, 2024</strong>
                      <p :class="previewTextClass"> $1,000 scheduled </p>
                    </div>
                    <div
                      class="rounded-lg bg-[color-mix(in_srgb,var(--default-bg-color)_72%,var(--default-box-color))] px-2.5 py-2"
                    >
                      <span class="mb-1 block text-[11px] font-bold uppercase text-g-500">
                        Auto-save Plan
                      </span>
                      <strong class="block text-sm text-g-900">Accelerated</strong>
                      <p :class="previewTextClass">Recurring weekly</p>
                    </div>
                  </div>

                  <div class="mb-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="tone in tonePreviewItems"
                      :key="tone.label"
                      :class="tonePillClass"
                      :style="{ background: tone.color, color: tone.contentColor }"
                    >
                      {{ tone.label }}
                    </span>
                  </div>

                  <button type="button" :class="primaryButtonClass">View Full Report</button>
                </article>

                <article :class="previewCardClass">
                  <h4 :class="previewTitleClass">Payout Threshold</h4>
                  <p :class="previewTextClass">
                    Set the minimum balance required before payout is triggered.
                  </p>
                  <label :class="previewFieldClass">
                    <span class="mb-1.5 block text-xs text-g-600">Preferred Currency</span>
                    <strong class="text-[13px] text-g-900">USD — United States Dollar</strong>
                  </label>
                  <label :class="previewFieldClass">
                    <span class="mb-1.5 block text-xs text-g-600">Minimum Payout Amount</span>
                    <i
                      class="mt-2 block h-1 rounded-full"
                      :style="{
                        background: `linear-gradient(90deg, ${themeCustomizer.themeSecondary} 0 62%, var(--art-gray-300) 62% 100%)`
                      }"
                    />
                  </label>
                  <button type="button" :class="[primaryButtonClass, 'mt-3']">
                    Save Threshold
                  </button>
                </article>

                <article
                  :class="[
                    previewCardClass,
                    'flex flex-col items-center justify-center text-center'
                  ]"
                >
                  <div
                    class="mb-3 flex h-[34px] w-[34px] items-center justify-center rounded-lg text-[22px] leading-none"
                    :style="{
                      background: themeCustomizer.themeAccent,
                      color: themeCustomizer.themeAccentContent
                    }"
                    aria-hidden="true"
                  >
                    <ArtSvgIcon icon="ri:add-line" class="h-[22px] w-[22px]" />
                  </div>
                  <h4 :class="previewTitleClass">Distribute Track</h4>
                  <p :class="previewTextClass">
                    Upload your first master to start reaching listeners on Spotify, Apple Music,
                    and more.
                  </p>
                  <button
                    type="button"
                    :class="[primaryButtonClass, 'mt-2.5 w-auto min-w-[124px] px-3.5']"
                  >
                    Create Release
                  </button>
                </article>

                <article :class="previewCardClass">
                  <p class="m-0 text-xs leading-[19px] text-g-600">Claimable Balance</p>
                  <div class="mt-1 text-[28px] font-bold leading-8 text-g-900">$0.00</div>
                  <div
                    class="mt-1.5 inline-flex h-[22px] items-center gap-[7px] rounded-md border px-2 text-xs font-semibold"
                    :style="{
                      background: themeCustomizer.themeWarning,
                      color: themeCustomizer.themeWarningContent,
                      borderColor: themeCustomizer.themeWarning
                    }"
                  >
                    <i
                      class="h-[7px] w-[7px] rounded-full"
                      :style="{ background: themeCustomizer.themeWarningContent }"
                    />
                    Pending Setup
                  </div>
                  <div class="mt-2 flex flex-wrap gap-1.5">
                    <span
                      v-for="tone in statusPreviewItems"
                      :key="tone.label"
                      :class="tonePillClass"
                      :style="{ background: tone.color, color: tone.contentColor }"
                    >
                      {{ tone.label }}
                    </span>
                  </div>
                  <ul class="m-0 mt-1.5 list-none p-0">
                    <li :class="ledgerRowClass">
                      <span>Net Royalties</span><strong class="text-g-900">$0.00</strong>
                    </li>
                    <li :class="ledgerRowClass">
                      <span>Processing Fee</span><strong class="text-g-900">$0.00</strong>
                    </li>
                    <li :class="ledgerRowClass">
                      <span>Total Ready to Claim</span><strong class="text-g-900">$0.00</strong>
                    </li>
                  </ul>
                </article>
              </section>
            </main>
          </section>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
  import { computed, nextTick, ref } from 'vue'
  import {
    THEME_ACCENT_PALETTES,
    THEME_BASE_PALETTES,
    THEME_CHART_PALETTES,
    THEME_RADIUS_OPTIONS,
    THEME_STYLE_PRESETS
  } from '@/config/modules/theme-studio'
  import { useThemeCustomizerPanel } from './composables/useThemeCustomizerPanel'

  defineOptions({ name: 'ArtThemeCustomizerPanel' })

  const {
    visible,
    isCompactMode,
    styleTriggerRef,
    basePaletteTriggerRef,
    accentPaletteTriggerRef,
    radiusTriggerRef,
    chartPaletteTriggerRef,
    themePredefineColors,
    advancedThemeColorItems,
    boxStyleOptions,
    tonePreviewItems,
    statusPreviewItems,
    themeCustomizer,
    systemThemeColor,
    customRadius,
    systemThemeMode,
    activeStylePreset,
    activeBasePalette,
    activeChartPalette,
    activeAccentPalette,
    activeRadiusOption,
    boxBorderMode,
    isDarkTheme,
    systemThemeOptions,
    previewBars,
    getBasePalettePreviewStyle,
    getStylePresetSwatches,
    toggleCompactMode,
    switchSystemTheme,
    selectStylePreset,
    selectBasePalette,
    selectAccentPalette,
    selectRadius,
    selectChartPalette,
    selectBoxStyle,
    previewAdvancedThemeColor,
    commitAdvancedThemeColor,
    handleAdvancedThemeColorVisibleChange,
    previewChartColor,
    commitChartColor,
    handleChartColorVisibleChange,
    resetTheme,
    randomizeTheme,
    copyThemeConfig,
    close,
    syncDropdownWidth
  } = useThemeCustomizerPanel()

  const motionItemClass = 'theme-motion-item'
  const iconButtonClass =
    'inline-flex h-8 w-8 cursor-pointer items-center justify-center rounded-[7px] border border-white/10 bg-transparent text-white/75 transition hover:bg-white/10 hover:text-white'
  const controlRowClass =
    'flex min-h-11 w-full cursor-pointer items-center justify-between rounded-lg border border-white/10 bg-white/5 px-[9px] py-[7px] text-left text-white/90 transition hover:-translate-y-px hover:border-white/15 hover:bg-white/10'
  const controlMetaClass = 'mb-0.5 block text-[11px] font-medium leading-[14px] text-white/45'
  const controlValueClass = 'block text-[13px] font-semibold leading-[18px]'
  const colorSwatchClass = 'inline-flex h-4 w-4 shrink-0 rounded-full border border-white/20'
  const surfaceSwatchClass =
    'inline-flex h-4 w-4 shrink-0 overflow-hidden rounded-full border border-white/20 shadow-inner'
  const railModeButtonClass =
    'theme-rail-mode-button h-8 min-w-0 cursor-pointer rounded-lg border-0 bg-transparent px-2 text-xs font-semibold leading-8 text-white/60 transition hover:bg-white/10 hover:text-white/90'
  const dropdownPopperClass =
    'theme-customizer-dropdown !z-[2100] !box-border !w-[var(--theme-customizer-dropdown-width,220px)] !min-w-0 max-w-[calc(100vw-32px)] !overflow-hidden !rounded-lg !border !border-white/10 !bg-[#27272a] !p-1.5 !shadow-[0_18px_48px_rgb(0_0_0_/_28%)]'
  const dropdownItemClass =
    '!grid !min-h-[34px] !grid-cols-[auto_minmax(0,1fr)_auto] !items-center !gap-2.5 !rounded-md !bg-transparent !px-2.5 !py-[7px] !text-white/85 transition hover:!bg-white/10 hover:!text-white focus:!bg-white/10 focus:!text-white'
  const advancedLabelClass = 'text-[11px] font-bold leading-4 text-white/65 uppercase'
  const boxStyleButtonClass =
    'min-h-[50px] cursor-pointer rounded-lg border px-3 py-2.5 text-left transition'
  const actionButtonClass =
    'h-8 cursor-pointer rounded-[7px] border border-white/10 bg-white/5 text-[13px] font-semibold text-white/90 transition hover:bg-white/10 hover:text-white'
  const previewTitleClass = 'm-0 text-[15px] font-bold leading-6 text-g-900'
  const previewTextClass = 'm-0 mt-1 text-xs leading-[19px] text-g-600'
  const previewFieldClass =
    'mt-2.5 block rounded-lg border p-2 px-2.5 [border-color:var(--default-border)]'
  const primaryButtonClass =
    'h-[34px] w-full cursor-pointer rounded-[7px] border-0 bg-theme text-[13px] font-bold text-[var(--theme-primary-content)]'
  const tonePillClass = 'inline-flex h-6 items-center rounded-full px-2 text-xs font-bold'
  const ledgerRowClass =
    'flex justify-between border-t py-1.5 text-xs leading-4 text-g-600 [border-color:var(--default-border)]'

  const themeLayerClass = computed(() => [
    'theme-customizer-layer fixed inset-0 z-[2000] transition-[background-color,backdrop-filter] duration-300 ease-out',
    isCompactMode.value
      ? 'flex items-center justify-end overflow-hidden p-6 max-[900px]:p-4 max-sm:items-start max-sm:justify-center max-sm:p-3'
      : 'grid place-items-center p-4'
  ])

  const themeLayerStyle = computed(() => ({
    backgroundColor:
      !isCompactMode.value && !isDarkTheme.value ? 'rgb(15 16 20 / 44%)' : 'rgb(15 16 20 / 0%)',
    backdropFilter: !isCompactMode.value && !isDarkTheme.value ? 'blur(2px)' : 'blur(0px)'
  }))

  const themePanelClass = computed(() => [
    'theme-customizer-panel pointer-events-auto overflow-hidden bg-transparent',
    { 'is-mode-morphing': isModeMorphing.value },
    isCompactMode.value
      ? 'theme-customizer-panel--compact w-[244px] rounded-xl max-sm:w-[calc(100vw-24px)]'
      : 'theme-customizer-panel--wide w-[min(1040px,calc(100vw-48px))] max-w-[calc(100vw-32px)] rounded-xl'
  ])

  const workbenchClass = computed(() => [
    'theme-customizer-workbench grid h-[min(684px,calc(100dvh-32px))] min-h-0 overflow-hidden rounded-xl text-g-900',
    isCompactMode.value
      ? 'w-[244px] grid-cols-1 bg-transparent max-sm:w-full'
      : 'grid-cols-[256px_minmax(0,1fr)] bg-[var(--default-bg-color)] max-[900px]:grid-cols-1',
    isDarkTheme.value && !isCompactMode.value
      ? 'border border-white/10 bg-[linear-gradient(180deg,rgb(24_24_28_/_98%),rgb(16_16_19_/_98%))] shadow-[0_28px_72px_rgb(0_0_0_/_38%)]'
      : ''
  ])

  const railClass = computed(() => [
    'theme-customizer-rail flex min-h-0 flex-col gap-3.5 overflow-hidden bg-[#202124] p-3 text-white/90',
    isCompactMode.value
      ? 'rounded-xl border-r-0 shadow-[0_16px_40px_rgb(0_0_0_/_20%)]'
      : 'border-r border-white/10 max-[900px]:border-r-0 max-[900px]:border-b'
  ])

  const stageClass = computed(() => [
    'min-w-0 overflow-hidden px-5 py-4 max-sm:px-4 max-sm:py-5',
    isDarkTheme.value ? 'bg-white/[0.02]' : ''
  ])

  const previewCardClass = computed(() => [
    'min-h-[164px] overflow-hidden rounded-[var(--art-radius-surface)] border bg-box p-[13px] [border-color:var(--default-border)]',
    boxBorderMode.value ? '' : '[border-color:var(--art-surface-border)] '
  ])

  interface ThemeCustomizerViewTransition {
    finished: Promise<void>
  }

  type ThemeCustomizerTransitionDocument = Document & {
    startViewTransition?: (callback: () => Promise<void> | void) => ThemeCustomizerViewTransition
  }

  const panelRef = ref<HTMLElement | null>(null)
  const isModeMorphing = ref(false)
  const panelMorphStyle = ref<Record<string, string>>({})
  let morphCleanupTimer: number | undefined

  const shouldReduceMotion = () =>
    typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

  const clearMorphCleanupTimer = () => {
    if (morphCleanupTimer === undefined) return

    window.clearTimeout(morphCleanupTimer)
    morphCleanupTimer = undefined
  }

  const finishModeMorph = () => {
    clearMorphCleanupTimer()
    isModeMorphing.value = false
    panelMorphStyle.value = {}
  }

  const toggleWithViewTransition = async () => {
    if (typeof document === 'undefined' || shouldReduceMotion()) return false

    const transitionDocument = document as ThemeCustomizerTransitionDocument
    if (!transitionDocument.startViewTransition) return false

    isModeMorphing.value = true

    try {
      const transition = transitionDocument.startViewTransition(async () => {
        toggleCompactMode()
        await nextTick()
      })

      await transition.finished
    } finally {
      finishModeMorph()
    }

    return true
  }

  const toggleWithFlipTransition = async () => {
    const panel = panelRef.value

    if (!panel || shouldReduceMotion()) {
      toggleCompactMode()
      return
    }

    const firstRect = panel.getBoundingClientRect()
    isModeMorphing.value = true
    toggleCompactMode()
    await nextTick()

    const lastRect = panel.getBoundingClientRect()
    const deltaX = firstRect.left - lastRect.left
    const deltaY = firstRect.top - lastRect.top
    const scaleX = firstRect.width / Math.max(lastRect.width, 1)
    const scaleY = firstRect.height / Math.max(lastRect.height, 1)

    panelMorphStyle.value = {
      transformOrigin: 'top left',
      transform: `translate3d(${deltaX}px, ${deltaY}px, 0) scale(${scaleX}, ${scaleY})`,
      transition: 'none'
    }

    await new Promise((resolve) => requestAnimationFrame(resolve))

    panelMorphStyle.value = {
      transformOrigin: 'top left',
      transform: 'translate3d(0, 0, 0) scale(1)',
      transition: 'transform 520ms cubic-bezier(0.16, 1, 0.3, 1)'
    }

    clearMorphCleanupTimer()
    morphCleanupTimer = window.setTimeout(finishModeMorph, 540)
  }

  const toggleCustomizerMode = async () => {
    if (isModeMorphing.value) return

    const hasViewTransition = await toggleWithViewTransition()
    if (!hasViewTransition) {
      await toggleWithFlipTransition()
    }
  }
</script>

<style scoped>
  .theme-customizer-enter-active,
  .theme-customizer-leave-active {
    transition:
      opacity 0.24s ease,
      backdrop-filter 0.36s cubic-bezier(0.22, 1, 0.36, 1);
  }

  .theme-customizer-enter-active .theme-customizer-panel,
  .theme-customizer-leave-active .theme-customizer-panel {
    transition:
      transform 0.38s cubic-bezier(0.16, 1, 0.3, 1),
      opacity 0.24s ease,
      box-shadow 0.38s cubic-bezier(0.22, 1, 0.36, 1);
    will-change: transform, opacity;
  }

  .theme-customizer-enter-active .theme-motion-item,
  .theme-customizer-leave-active .theme-motion-item {
    transition:
      transform 0.42s cubic-bezier(0.22, 1, 0.36, 1),
      opacity 0.28s ease;
    will-change: transform, opacity;
  }

  .theme-customizer-leave-active .theme-motion-item {
    transition-delay: 0s !important;
    transition-duration: 0.18s;
  }

  .theme-customizer-enter-from,
  .theme-customizer-leave-to {
    opacity: 0;
  }

  .theme-customizer-enter-from .theme-customizer-panel--wide,
  .theme-customizer-leave-to .theme-customizer-panel--wide {
    opacity: 0;
    transform: translate3d(0, 18px, 0);
  }

  .theme-customizer-enter-from .theme-customizer-panel--compact,
  .theme-customizer-leave-to .theme-customizer-panel--compact {
    opacity: 0;
    transform: translate3d(24px, 0, 0);
  }

  .theme-customizer-enter-from .theme-motion-item,
  .theme-customizer-leave-to .theme-motion-item {
    opacity: 0;
    transform: translate3d(0, 10px, 0);
  }

  .theme-customizer-panel {
    view-transition-name: theme-customizer-panel;
    contain: layout paint;
    transform-origin: top left;
  }

  .theme-customizer-workbench {
    height: min(684px, calc(100vh - 32px));
    height: min(684px, calc(100dvh - 32px));
  }

  .theme-customizer-panel.is-mode-morphing {
    pointer-events: none;
  }

  :global(::view-transition-old(theme-customizer-panel)) {
    height: 100%;
    overflow: clip;
    border-radius: 12px;
    animation-name: theme-panel-old;
    animation-duration: 520ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  :global(::view-transition-new(theme-customizer-panel)) {
    height: 100%;
    overflow: clip;
    border-radius: 12px;
    animation-name: theme-panel-new;
    animation-duration: 520ms;
    animation-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
  }

  @keyframes theme-panel-old {
    0% {
      filter: none;
      opacity: 1;
    }

    100% {
      filter: blur(6px);
      opacity: 0;
    }
  }

  @keyframes theme-panel-new {
    0% {
      filter: blur(8px);
      opacity: 0.68;
    }

    100% {
      filter: none;
      opacity: 1;
    }
  }

  .theme-scrollbar {
    scrollbar-width: none;
  }

  .theme-scrollbar::-webkit-scrollbar {
    width: 0 !important;
    height: 0 !important;
  }

  .theme-scrollbar::-webkit-scrollbar-track,
  .theme-scrollbar::-webkit-scrollbar-thumb {
    background: transparent !important;
  }

  .theme-rail-mode-button.is-active {
    color: rgb(255 255 255 / 96%) !important;
    background: linear-gradient(180deg, rgb(72 75 84 / 96%) 0%, rgb(43 45 51 / 98%) 100%);
    box-shadow:
      inset 0 1px 0 rgb(255 255 255 / 10%),
      inset 0 -1px 0 rgb(0 0 0 / 24%),
      0 8px 18px rgb(0 0 0 / 24%);
  }

  .theme-mode-button.is-active {
    color: var(--theme-primary-content) !important;
    background: var(--theme-color) !important;
  }

  :deep(.theme-color-picker.el-color-picker) {
    width: 22px;
    height: 22px;
  }

  :deep(.theme-color-picker .el-color-picker__trigger) {
    width: 22px;
    height: 22px;
    padding: 1px;
    background: rgb(255 255 255 / 2%);
    border: 1px solid rgb(255 255 255 / 14%);
    border-radius: 5px;
    box-shadow: inset 0 1px 0 rgb(255 255 255 / 4%);
  }

  :deep(.theme-color-picker .el-color-picker__color) {
    overflow: hidden;
    border: 1px solid rgb(255 255 255 / 16%);
    border-radius: 3px;
  }

  :global(.theme-customizer-dropdown .el-scrollbar),
  :global(.theme-customizer-dropdown .el-scrollbar__wrap),
  :global(.theme-customizer-dropdown .el-scrollbar__view),
  :global(.theme-customizer-dropdown .el-dropdown-menu) {
    background: transparent !important;
  }

  :global(.theme-customizer-dropdown .el-scrollbar__wrap) {
    max-height: min(360px, calc(100vh - 96px));
    overflow: auto !important;
  }

  :global(.theme-customizer-dropdown .el-popper__arrow::before) {
    background: #27272a !important;
    border-color: rgb(255 255 255 / 8%) !important;
  }

  @media (width <= 640px) {
    .theme-customizer-layer {
      min-height: 100dvh;
      padding-top: max(12px, env(safe-area-inset-top));
      padding-bottom: max(12px, env(safe-area-inset-bottom));
      overflow: hidden;
    }

    .theme-customizer-panel {
      max-height: calc(
        100dvh - max(12px, env(safe-area-inset-top)) - max(12px, env(safe-area-inset-bottom))
      );
    }

    .theme-customizer-workbench {
      height: min(
        684px,
        calc(100dvh - max(12px, env(safe-area-inset-top)) - max(12px, env(safe-area-inset-bottom)))
      );
    }

    .theme-customizer-rail {
      gap: 12px;
    }
  }
</style>
