<template>
  <div class="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
    <div class="min-w-0" :class="contentClass">
      <component :is="heading" class="font-semibold text-g-900" :class="titleClass">
        {{ title }}
      </component>
      <p v-if="description" class="mt-1 text-sm text-g-600" :class="descriptionClass">
        {{ description }}
      </p>
      <slot />
    </div>

    <div v-if="$slots.right" class="flex flex-wrap gap-2" :class="rightClass">
      <slot name="right" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtSectionTitle' })

  interface Props {
    title: string
    description?: string
    heading?: 'h2' | 'h3' | 'div'
    titleClass?: string
    descriptionClass?: string
    contentClass?: string
    rightClass?: string
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    heading: 'h2',
    titleClass: 'text-lg',
    descriptionClass: '',
    contentClass: '',
    rightClass: ''
  })
</script>
