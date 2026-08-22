<template>
  <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
    <article
      v-for="card in statCards"
      :key="card.title"
      class="art-card-sm relative flex min-h-[104px] items-center px-5 py-4 pr-12"
    >
      <div class="flex flex-1 items-center gap-4">
        <div
          class="flex h-11 w-11 items-center justify-center rounded-[12px]"
          :class="card.iconClass"
        >
          <ArtSvgIcon :icon="card.icon" class="text-lg" />
        </div>
        <div class="min-w-0 flex-1 pr-7">
          <p class="text-[13px] font-medium text-g-700">{{ card.title }}</p>
          <div class="mt-1 flex w-full items-center gap-3">
            <p class="text-[18px] font-semibold leading-none text-g-900">{{ card.value }}</p>
            <p
              class="ml-auto flex shrink-0 items-center justify-end text-right text-[13px] font-semibold leading-none"
              :class="card.changeClass"
            >
              <ArtSvgIcon :icon="card.changeIcon" class="mr-1 text-base" />
              {{ card.change }}
            </p>
          </div>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup lang="ts">
  import { statCards } from '../shared'
</script>
