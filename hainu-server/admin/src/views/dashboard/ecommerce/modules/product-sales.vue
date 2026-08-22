<template>
  <div class="art-card-sm p-5 pt-3.5 mb-5 h-46 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4 class="flex-c gap-1 text-2xl">
          <span>14.5k</span>
          <ArtSvgIcon icon="ri:arrow-right-up-line" class="text-lg text-success" />
        </h4>
        <p>销售量</p>
      </div>
    </div>

    <ArtBarChart
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 80, 50, 90, 60, 70, 50]"
      barWidth="16px"
      height="5.6rem"
    />
  </div>
</template>
