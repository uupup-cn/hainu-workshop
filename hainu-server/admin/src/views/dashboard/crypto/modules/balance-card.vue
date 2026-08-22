<template>
  <article class="art-card-sm overflow-hidden">
    <header class="flex items-center justify-between border-b-d px-5 py-2">
      <h3 class="text-[18px] font-semibold text-g-900">我的余额</h3>
      <ElButton text>查看全部</ElButton>
    </header>
    <div class="space-y-4 px-5 py-3">
      <div>
        <p class="text-[24px] leading-none text-g-900">$24,380.00</p>
        <p class="mt-2 text-sm text-g-600">总估值：13.84234 BTC</p>
      </div>
      <div class="grid grid-cols-2 gap-3">
        <div class="rounded-[14px] py-3">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-primary/12 text-primary"
            >
              <ArtSvgIcon icon="ri:wallet-3-line" class="text-lg" />
            </div>
            <div>
              <p class="text-[14px] font-semibold text-g-900">$23,180.00</p>
              <p class="mt-1 text-sm text-g-600">已投资</p>
            </div>
          </div>
        </div>
        <div class="rounded-[14px] py-3">
          <div class="flex items-center gap-3">
            <div
              class="flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] bg-secondary/12 text-secondary"
            >
              <ArtSvgIcon icon="ri:exchange-funds-line" class="text-lg" />
            </div>
            <div>
              <p class="text-[14px] font-semibold text-g-900">$21,960.00</p>
              <p class="mt-1 text-sm text-g-600">总支出</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </article>
</template>
