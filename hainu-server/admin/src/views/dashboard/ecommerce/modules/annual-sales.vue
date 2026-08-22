<template>
  <div class="art-card-sm p-5 h-[27rem] mb-5 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4>年度销售额</h4>
        <p>按季度统计</p>
      </div>
    </div>

    <ArtBarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="26px"
      height="calc(100% - 155px)"
    />
    <div class="mt-10 flex justify-around">
      <div class="flex-c gap-2.5">
        <div class="flex-cc size-10.5 rounded-lg bg-theme/10 text-theme">
          <ArtSvgIcon icon="ri:money-cny-circle-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥200,858</p>
          <span class="text-sm">线上销售</span>
        </div>
      </div>
      <div class="flex-c gap-2.5">
        <div class="flex-cc size-10.5 rounded-lg bg-theme/10 text-theme">
          <ArtSvgIcon icon="ri:heart-3-line" class="text-xl" />
        </div>
        <div>
          <p class="text-lg">¥102,927</p>
          <span class="text-sm">线下销售</span>
        </div>
      </div>
    </div>
  </div>
</template>
