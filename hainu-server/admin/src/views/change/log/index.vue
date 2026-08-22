<template>
  <section class="change-log-page mx-auto w-full max-w-[1360px] pb-6 pt-2 max-md:pt-3">
    <ArtPageHero
      align="center"
      title="更新日志"
      description="持续记录商业版能力演进、体验优化和需要关注的升级事项，帮助团队快速判断版本价值与上线影响。"
      content-class="max-w-[720px]"
      right-class="grid min-w-[360px] grid-cols-3 gap-3 max-md:min-w-0 max-md:w-full"
    >
      <template #right>
        <div
          v-for="stat in summaryStats"
          :key="stat.label"
          class="rounded-custom-xs border border-[var(--default-border)] bg-[var(--default-bg-color)] px-4 py-3"
        >
          <div class="text-xs text-g-500">{{ stat.label }}</div>
          <div class="mt-2 truncate text-lg font-semibold text-g-900">{{ stat.value }}</div>
        </div>
      </template>
    </ArtPageHero>

    <main class="mt-4 grid grid-cols-[260px_minmax(0,1fr)] gap-4 max-lg:grid-cols-1">
      <aside class="change-log-index art-surface-sm h-max px-5 py-5 max-lg:hidden">
        <div class="text-sm font-semibold text-g-900">版本索引</div>
        <div class="mt-4 space-y-2">
          <button
            v-for="item in upgradeLogList"
            :key="getReleaseId(item)"
            type="button"
            class="release-link flex w-full cursor-pointer items-center justify-between gap-3 rounded-custom-xs px-3 py-2 text-left text-sm text-g-700 transition-colors duration-200 hover:bg-hover-color hover:text-g-900"
            @click="scrollToRelease(item)"
          >
            <span class="truncate font-medium">{{ item.version }}</span>
            <span class="shrink-0 text-xs text-g-500">{{ formatReleaseDate(item.date) }}</span>
          </button>
        </div>
      </aside>

      <div class="release-timeline">
        <article
          v-for="(item, itemIndex) in upgradeLogList"
          :id="`release-${getReleaseId(item)}`"
          :key="getReleaseId(item)"
          class="release-card art-surface-sm relative overflow-hidden px-6 py-5 max-md:px-4"
        >
          <div class="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
            <div class="min-w-0">
              <div class="flex flex-wrap items-center gap-2">
                <span
                  class="inline-flex h-7 items-center rounded-full bg-theme/10 px-3 text-xs font-semibold text-theme"
                >
                  {{ item.version }}
                </span>
                <span
                  v-if="itemIndex === 0"
                  class="inline-flex h-7 items-center rounded-full bg-success/10 px-3 text-xs font-semibold text-success"
                >
                  最新版本
                </span>
                <span
                  v-if="item.requireReLogin"
                  class="inline-flex h-7 items-center rounded-full bg-warning/10 px-3 text-xs font-semibold text-warning"
                >
                  需要重新登录
                </span>
              </div>

              <h2 class="mt-4 text-xl font-semibold leading-8 text-g-900 max-md:text-lg">
                {{ item.title }}
              </h2>
            </div>

            <time
              class="shrink-0 rounded-custom-xs bg-g-100 px-3 py-2 text-sm font-medium text-g-600"
            >
              {{ formatReleaseDate(item.date) }}
            </time>
          </div>

          <div v-if="item.detailGroups?.length" class="mt-5">
            <ul class="grid grid-cols-1 gap-3 xl:grid-cols-2">
              <li
                v-for="detail in getSortedDetails(item.detailGroups)"
                :key="`${detail.type}-${detail.content}`"
                class="release-detail rounded-custom-xs border border-[var(--default-border)] bg-[var(--default-bg-color)] px-4 py-3 text-sm leading-6 text-g-700"
              >
                <ElTag class="release-detail-tag" :type="tagTypeMap[detail.type]" effect="light">
                  {{ tagLabelMap[detail.type] }}
                </ElTag>
                <span>{{ detail.content }}</span>
              </li>
            </ul>
          </div>

          <div
            v-if="item.remark"
            class="mt-5 rounded-custom-xs border border-[var(--default-border)] bg-g-100 px-4 py-3 text-sm leading-6 text-g-700"
          >
            {{ item.remark }}
          </div>
        </article>
      </div>
    </main>
  </section>
</template>

<script setup lang="ts">
  import { computed } from 'vue'
  import { UpgradeLogType, upgradeLogList } from '@/mock/upgrade/changeLog'
  import type { UpgradeLogDetailGroup } from '@/mock/upgrade/changeLog'

  defineOptions({ name: 'ChangeLog' })

  const releasedItems = computed(() => upgradeLogList.value.filter((item) => Boolean(item.date)))

  const summaryStats = computed(() => [
    {
      label: '当前版本',
      value: upgradeLogList.value[0]?.version || '-'
    },
    {
      label: '版本记录',
      value: `${upgradeLogList.value.length} 个`
    },
    {
      label: '更新条目',
      value: `${upgradeLogList.value.reduce(
        (total, item) =>
          total +
          (item.detailGroups?.reduce((groupTotal, group) => groupTotal + group.items.length, 0) ||
            0),
        0
      )} 条`
    }
  ])

  const normalizeVersionId = (version: string) => version.replace(/[^a-zA-Z0-9-]/g, '-')

  const detailTypeOrder = [
    UpgradeLogType.Feature,
    UpgradeLogType.Fix,
    UpgradeLogType.Update,
    UpgradeLogType.Optimize
  ]

  const tagTypeMap = {
    [UpgradeLogType.Feature]: 'primary',
    [UpgradeLogType.Fix]: 'warning',
    [UpgradeLogType.Update]: 'info',
    [UpgradeLogType.Optimize]: 'success'
  } as const

  const tagLabelMap = {
    [UpgradeLogType.Feature]: '新增',
    [UpgradeLogType.Fix]: '修复',
    [UpgradeLogType.Update]: '更新',
    [UpgradeLogType.Optimize]: '优化'
  } as const

  const getReleaseId = (item: { version: string; date?: string }) =>
    normalizeVersionId(`${item.version}-${item.date || 'pending'}`)

  const scrollToRelease = (item: { version: string; date?: string }) => {
    const target = document.getElementById(`release-${getReleaseId(item)}`)
    target?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  const formatReleaseDate = (date?: string) => {
    if (date) return date
    if (releasedItems.value.length) return '近期发布'
    return '待发布'
  }

  const getSortedDetailGroups = (groups: UpgradeLogDetailGroup[]) =>
    [...groups].sort(
      (prev, next) => detailTypeOrder.indexOf(prev.type) - detailTypeOrder.indexOf(next.type)
    )

  const getSortedDetails = (groups: UpgradeLogDetailGroup[]) =>
    getSortedDetailGroups(groups).flatMap((group) =>
      group.items.map((content) => ({
        type: group.type,
        content
      }))
    )
</script>

<style scoped lang="scss">
  .change-log-page {
    color: var(--art-gray-900);
  }

  .change-log-index {
    position: sticky;
    top: 106px;
  }

  .release-card {
    scroll-margin-top: 106px;
  }

  .release-timeline {
    display: grid;
    gap: 14px;
  }

  .release-detail {
    display: grid;
    grid-template-columns: auto minmax(0, 1fr);
    gap: 12px;
    align-items: start;
    min-height: 72px;
    transition:
      border-color 0.2s ease,
      background-color 0.2s ease,
      transform 0.2s ease;
  }

  .release-detail:hover {
    background: var(--default-box-color);
    border-color: color-mix(in srgb, var(--color-primary) 28%, var(--default-border));
    transform: translateY(-1px);
  }

  .release-detail-tag {
    justify-content: center;
    min-width: 42px;
    font-weight: 600;
  }

  @media (prefers-reduced-motion: reduce) {
    .release-detail {
      transition: none;
    }

    .release-detail:hover {
      transform: none;
    }
  }
</style>
