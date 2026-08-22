<template>
  <nav class="art-arrow-steps" aria-label="步骤进度">
    <ol class="art-arrow-steps__list">
      <li
        v-for="(item, index) in items"
        :key="getStepKey(item, index)"
        class="art-arrow-steps__item"
        :class="{
          'is-active': index === currentIndex,
          'is-completed': showCompleted && index < currentIndex,
          'is-disabled': item.disabled
        }"
      >
        <button
          v-if="clickable"
          class="art-arrow-steps__segment"
          type="button"
          :disabled="item.disabled"
          :aria-current="index === currentIndex ? 'step' : undefined"
          @click="handleStepClick(index, item)"
        >
          <span class="art-arrow-steps__text">{{ item.title }}</span>
        </button>
        <span
          v-else
          class="art-arrow-steps__segment"
          :aria-current="index === currentIndex ? 'step' : undefined"
        >
          <span class="art-arrow-steps__text">{{ item.title }}</span>
        </span>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
  interface ArtArrowStepItem {
    title: string
    key?: string | number
    disabled?: boolean
  }

  const props = withDefaults(
    defineProps<{
      items: ArtArrowStepItem[]
      active?: number
      modelValue?: number
      clickable?: boolean
      showCompleted?: boolean
    }>(),
    {
      active: undefined,
      modelValue: undefined,
      clickable: false,
      showCompleted: false
    }
  )

  const showCompleted = computed(() => props.showCompleted)

  const emit = defineEmits<{
    (e: 'update:modelValue', value: number): void
    (e: 'change', value: number, item: ArtArrowStepItem): void
  }>()

  const currentIndex = computed(() => {
    const value = props.modelValue ?? props.active ?? 0
    return Math.min(Math.max(value, 0), Math.max(props.items.length - 1, 0))
  })

  function getStepKey(item: ArtArrowStepItem, index: number) {
    return item.key ?? item.title ?? index
  }

  function handleStepClick(index: number, item: ArtArrowStepItem) {
    if (item.disabled) return
    emit('update:modelValue', index)
    emit('change', index, item)
  }
</script>

<style scoped>
  .art-arrow-steps {
    --art-arrow-step-height: 38px;
    --art-arrow-step-tip: 18px;
    --art-arrow-step-bg: color-mix(in srgb, var(--theme-color) 8%, var(--default-box-color));
    --art-arrow-step-hover-bg: color-mix(in srgb, var(--theme-color) 13%, var(--default-box-color));
    --art-arrow-step-active-bg: var(--theme-color);
    --art-arrow-step-active-hover-bg: color-mix(
      in srgb,
      var(--theme-color) 88%,
      var(--default-box-color)
    );
    --art-arrow-step-text: var(--art-gray-700);
    --art-arrow-step-active-text: var(--el-color-white);

    width: 100%;
    overflow-x: auto;
    scrollbar-width: none;
  }

  .art-arrow-steps::-webkit-scrollbar {
    display: none;
  }

  .art-arrow-steps__list {
    display: flex;
    width: 100%;
    min-width: 100%;
    padding: 1px;
    margin: 0;
    list-style: none;
  }

  .art-arrow-steps__item {
    position: relative;
    flex: 1 1 0;
    min-width: 0;
    margin-left: calc((var(--art-arrow-step-tip) - 4px) * -1);
  }

  .art-arrow-steps__item:first-child {
    margin-left: 0;
  }

  .art-arrow-steps__segment {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: var(--art-arrow-step-height);
    padding: 0 24px 0 34px;
    clip-path: polygon(
      0 0,
      calc(100% - var(--art-arrow-step-tip)) 0,
      100% 50%,
      calc(100% - var(--art-arrow-step-tip)) 100%,
      0 100%,
      var(--art-arrow-step-tip) 50%
    );
    font-size: 14px;
    line-height: 1.2;
    color: var(--art-arrow-step-text);
    appearance: none;
    cursor: default;
    background: var(--art-arrow-step-bg);
    border: 0;
    outline: none;
    transition:
      color 0.18s ease,
      background-color 0.18s ease;
  }

  .art-arrow-steps__item:first-child .art-arrow-steps__segment {
    padding-left: 18px;
    clip-path: polygon(
      0 0,
      calc(100% - var(--art-arrow-step-tip)) 0,
      100% 50%,
      calc(100% - var(--art-arrow-step-tip)) 100%,
      0 100%
    );
  }

  .art-arrow-steps__item:last-child .art-arrow-steps__segment {
    padding-right: 18px;
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%, var(--art-arrow-step-tip) 50%);
  }

  .art-arrow-steps__item:first-child:last-child .art-arrow-steps__segment {
    clip-path: inset(0 round calc(var(--custom-radius) / 3 + 2px));
  }

  .art-arrow-steps__item.is-active .art-arrow-steps__segment,
  .art-arrow-steps__item.is-completed .art-arrow-steps__segment {
    color: var(--art-arrow-step-active-text);
    background: var(--art-arrow-step-active-bg);
  }

  .art-arrow-steps__item.is-disabled .art-arrow-steps__segment {
    color: var(--art-gray-500);
    cursor: not-allowed;
    background: color-mix(in srgb, var(--art-gray-300) 34%, var(--default-box-color));
  }

  .art-arrow-steps__segment:not(:disabled):focus-visible {
    box-shadow: inset 0 0 0 2px color-mix(in srgb, var(--theme-color) 44%, var(--default-box-color));
  }

  button.art-arrow-steps__segment:not(:disabled) {
    cursor: pointer;
  }

  button.art-arrow-steps__segment:not(:disabled):hover {
    background: var(--art-arrow-step-hover-bg);
  }

  .art-arrow-steps__item.is-active button.art-arrow-steps__segment:not(:disabled):hover,
  .art-arrow-steps__item.is-completed button.art-arrow-steps__segment:not(:disabled):hover {
    background: var(--art-arrow-step-active-hover-bg);
  }

  .art-arrow-steps__text {
    display: block;
    min-width: 0;
    overflow: hidden;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
</style>
