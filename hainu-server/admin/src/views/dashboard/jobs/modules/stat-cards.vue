<template>
  <section class="grid grid-cols-1 gap-4 xl:grid-cols-5">
    <article
      v-for="card in statCards"
      :key="card.title"
      class="art-card-sm border border-[var(--default-border)] bg-box px-5 py-4"
    >
      <div class="flex items-start justify-between gap-3">
        <div>
          <p class="text-[15px] font-medium text-g-700">{{ card.title }}</p>
          <p class="mt-2 text-[18px] font-semibold leading-none text-g-900">{{ card.value }}</p>
          <p class="mt-3 text-sm">
            <span class="font-semibold" :class="card.changeClass">{{ card.change }}</span>
            <span class="ml-1 text-g-600">{{ card.changeLabel }}</span>
          </p>
        </div>
        <div
          class="flex h-11 w-11 items-center justify-center rounded-[8px] text-lg"
          :style="{ background: card.iconBg, color: card.iconColor }"
        >
          <ArtSvgIcon :icon="card.icon" />
        </div>
      </div>
    </article>
  </section>
</template>

<script setup lang="ts">
  import { statCards } from '../shared'
</script>
