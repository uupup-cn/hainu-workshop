<template>
  <div class="art-card-sm p-5 pt-3.5 mb-5 h-46 max-sm:mb-4">
    <div class="art-card-header">
      <div class="title">
        <h4 class="flex-c gap-1 text-2xl">
          <span>12%</span>
          <ArtSvgIcon icon="ri:arrow-right-up-line" class="text-lg text-success" />
        </h4>
        <p>增长</p>
      </div>
    </div>

    <ArtLineChart
      :showAreaColor="true"
      :showAxisLabel="false"
      :showAxisLine="false"
      :showSplitLine="false"
      :data="[50, 85, 65, 95, 75, 130, 180]"
      barWidth="16px"
      height="5rem"
    />
  </div>
</template>
