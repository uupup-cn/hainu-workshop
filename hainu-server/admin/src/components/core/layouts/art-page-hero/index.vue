<template>
  <section class="art-page-hero" :class="sectionClasses" :style="sectionStyle">
    <div
      class="relative z-10 flex flex-col gap-6 xl:flex-row xl:justify-between"
      :class="innerClasses"
    >
      <div class="min-w-0" :class="contentClass">
        <slot name="eyebrow">
          <div v-if="eyebrow" class="text-xs font-semibold uppercase tracking-[0.18em] text-g-500">
            {{ eyebrow }}
          </div>
        </slot>

        <slot name="title">
          <h1 v-if="title" class="font-semibold tracking-tight text-g-900" :class="titleClasses">
            {{ title }}
          </h1>
        </slot>

        <slot name="description">
          <p v-if="description" class="mt-2 text-sm leading-7 text-g-600" :class="descriptionClass">
            {{ description }}
          </p>
        </slot>

        <slot />
      </div>

      <div v-if="$slots.right" class="min-w-0" :class="rightClass">
        <slot name="right" />
      </div>
    </div>

    <div v-if="$slots.footer" class="relative z-10 mt-4">
      <slot name="footer" />
    </div>
  </section>
</template>

<script setup lang="ts">
  import type { StyleValue } from 'vue'

  defineOptions({ name: 'ArtPageHero' })

  type HeroTone = 'primary' | 'success' | 'warning' | 'neutral' | 'secondary' | 'box'
  type HeroSize = 'sm' | 'md' | 'lg'
  type HeroAlign = 'start' | 'center' | 'end'

  interface Props {
    title?: string
    description?: string
    eyebrow?: string
    tone?: HeroTone
    background?: string
    size?: HeroSize
    align?: HeroAlign
    contentClass?: string
    descriptionClass?: string
    rightClass?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    title: '',
    description: '',
    eyebrow: '',
    tone: 'box',
    background: '',
    size: 'md',
    align: 'end',
    contentClass: 'max-w-3xl',
    descriptionClass: 'max-w-2xl',
    rightClass: 'flex flex-wrap items-center gap-3'
  })

  const createToneBackground = (color: string, start = 6, end = 2) =>
    `linear-gradient(135deg, color-mix(in srgb, var(--default-box-color) ${100 - start}%, ${color} ${start}%), color-mix(in srgb, var(--default-box-color) ${100 - end}%, ${color} ${end}%))`

  const toneBackgroundMap: Record<HeroTone, string> = {
    primary: createToneBackground('var(--art-primary)'),
    success: createToneBackground('var(--art-success)'),
    warning: createToneBackground('var(--art-warning)'),
    neutral: createToneBackground('var(--art-gray-500)', 4, 2),
    secondary: createToneBackground('var(--art-secondary)', 5, 2),
    box: 'var(--default-box-color)'
  }

  const alignClassMap: Record<HeroAlign, string> = {
    start: 'xl:items-start',
    center: 'xl:items-center',
    end: 'xl:items-end'
  }

  const titleSizeClassMap: Record<HeroSize, string> = {
    sm: 'text-xl',
    md: 'text-[22px]',
    lg: 'mt-0 text-2xl'
  }

  const sectionClasses =
    'art-surface-sm relative min-h-[130px] overflow-hidden px-5 py-4 md:px-6 md:py-5'

  const innerClasses = computed(() => alignClassMap[props.align])
  const titleClasses = computed(() => [
    titleSizeClassMap[props.size],
    props.eyebrow && props.size !== 'lg' ? (props.size === 'sm' ? 'mt-1' : 'mt-3') : ''
  ])
  const sectionStyle = computed<StyleValue>(() => {
    const background = props.background || toneBackgroundMap[props.tone]

    return background === toneBackgroundMap.box ? undefined : { background }
  })
</script>
