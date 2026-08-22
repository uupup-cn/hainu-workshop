<template>
  <article class="art-card-sm shrink-0 overflow-hidden px-5 py-4">
    <div class="flex items-center justify-between text-[15px] font-medium text-g-800">
      <span class="flex items-center gap-2">
        <span class="h-2.5 w-4 rounded-full bg-[var(--art-primary)]"></span>
        潜在客户总数
      </span>
      <span class="flex items-center gap-2">
        <span class="h-2.5 w-4 rounded-full bg-[var(--art-success)]"></span>
        潜客目标
      </span>
    </div>

    <div class="mt-5 h-2.5 overflow-hidden rounded-full bg-g-200">
      <div class="flex h-full">
        <span class="h-full rounded-full bg-[var(--art-primary)]" style="width: 68%"></span>
        <span class="h-full rounded-full bg-[var(--art-success)]" style="width: 32%"></span>
      </div>
    </div>

    <div class="mt-4 flex items-center justify-between gap-4 text-sm">
      <p class="text-g-700">
        <span class="font-semibold text-[var(--art-success)]">
          <i class="ri-arrow-up-line mr-1"></i>3.25%
        </span>
        较上周对比
      </p>
      <a class="text-[var(--art-primary)]" href="javascript:void(0)">潜客报告 →</a>
    </div>
  </article>
</template>
