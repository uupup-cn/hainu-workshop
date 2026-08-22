<template>
  <article class="art-card-sm overflow-hidden">
    <header class="border-b-d flex items-center justify-between px-5 py-4">
      <h3 class="text-[18px] font-semibold text-g-900">推荐关注</h3>
      <a href="javascript:void(0)" class="flex items-center gap-1 text-sm text-g-600">
        <span>查看全部</span>
        <ArtSvgIcon icon="ri:arrow-right-line" class="text-base" />
      </a>
    </header>
    <div class="space-y-1 px-5 py-3">
      <div
        v-for="user in suggestionRows"
        :key="user.name"
        class="flex items-center justify-between gap-3 py-3"
      >
        <div class="flex items-center gap-3">
          <img :src="user.avatar" :alt="user.name" class="h-11 w-11 rounded-full" />
          <div>
            <p class="font-semibold text-g-900">{{ user.name }}</p>
            <p class="mt-1 text-[13px] text-g-600">{{ user.mutual }}</p>
          </div>
        </div>
        <button
          class="flex h-9 w-9 items-center justify-center rounded-[10px] border border-[var(--default-border)] text-g-600 tad-200 hover:bg-g-100"
        >
          <ArtSvgIcon icon="ri:user-add-line" class="text-base" />
        </button>
      </div>
    </div>
  </article>
</template>

<script setup lang="ts">
  import { suggestionRows } from '../shared'
</script>
