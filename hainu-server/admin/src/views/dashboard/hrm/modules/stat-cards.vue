<template>
  <div
    class="art-card-sm grid grid-cols-1 overflow-hidden border border-[var(--default-border)] sm:grid-cols-2"
  >
    <article
      v-for="(card, index) in statCards"
      :key="card.title"
      class="px-5 py-5"
      :class="[
        index < 2 ? 'border-b border-[var(--default-border)]' : '',
        index % 2 === 0 ? 'sm:border-r sm:border-[var(--default-border)]' : ''
      ]"
    >
      <div
        class="flex h-11 w-11 items-center justify-center rounded-md text-lg"
        :class="card.iconClass"
      >
        <ArtSvgIcon :icon="card.icon" />
      </div>
      <p class="mt-5 text-[15px] text-g-700">{{ card.title }}</p>
      <div class="mt-2 flex items-end gap-3">
        <span class="text-[18px] font-semibold leading-none text-g-900">{{ card.value }}</span>
        <span
          class="inline-flex items-center rounded-full px-2 py-1 text-[12px] font-semibold"
          :class="card.changeClass"
        >
          <i :class="card.changeIcon" class="mr-1 text-[12px]"></i>
          {{ card.change }}
        </span>
        <span class="pb-0.5 text-[13px] text-g-600">本年</span>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { statCards } from '../shared'
</script>
