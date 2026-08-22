<template>
  <div
    class="art-form-section-title"
    :class="{
      'is-flush-top': flushTop,
      'is-compact': compact
    }"
  >
    <div class="art-form-section-title__main">
      <span class="art-form-section-title__mark" aria-hidden="true"></span>
      <span class="art-form-section-title__text">{{ title }}</span>
      <span v-if="description" class="art-form-section-title__description">
        {{ description }}
      </span>
    </div>

    <div v-if="$slots.extra" class="art-form-section-title__extra">
      <slot name="extra" />
    </div>
  </div>
</template>

<script setup lang="ts">
  defineOptions({ name: 'ArtFormSectionTitle' })

  interface Props {
    title: string
    description?: string
    flushTop?: boolean
    compact?: boolean
  }

  withDefaults(defineProps<Props>(), {
    description: '',
    flushTop: false,
    compact: false
  })
</script>

<style scoped>
  .art-form-section-title {
    display: flex;
    gap: 12px;
    align-items: center;
    justify-content: space-between;
    min-height: 34px;
    padding: 0 12px;
    margin: 24px 0 16px;
    background: var(--art-gray-100);
  }

  .art-form-section-title.is-flush-top {
    margin-top: 0;
  }

  .art-form-section-title.is-compact {
    min-height: 30px;
    padding: 0 10px;
    margin: 20px 0 12px;
  }

  .art-form-section-title.is-compact.is-flush-top {
    margin-top: 0;
  }

  .art-form-section-title__main {
    display: flex;
    flex: 1;
    gap: 8px;
    align-items: center;
    min-width: 0;
  }

  .art-form-section-title__mark {
    flex-shrink: 0;
    width: 3px;
    height: 14px;
    background: var(--theme-color);
    border-radius: calc(var(--custom-radius) / 3);
  }

  .art-form-section-title__text {
    overflow: hidden;
    font-size: 14px;
    font-weight: 600;
    line-height: 1.2;
    color: var(--art-gray-900);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .art-form-section-title__description {
    overflow: hidden;
    font-size: 12px;
    line-height: 1.2;
    color: var(--art-gray-600);
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .art-form-section-title__extra {
    display: flex;
    flex-shrink: 0;
    gap: 8px;
    align-items: center;
  }
</style>
