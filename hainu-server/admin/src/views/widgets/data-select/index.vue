<template>
  <div class="space-y-5 pb-5">
    <ArtPageHero
      size="lg"
      align="center"
      title="数据选择器"
      description="面向后台业务里的公司、人员、地区、组织等大体量数据选择场景，保留表单字段的轻量感，同时在弹窗里提供搜索、筛选、分页、树形选择和已选管理。"
      right-class="grid gap-3 sm:grid-cols-3 xl:w-[360px]"
    >
      <template #right>
        <div
          v-for="item in overview"
          :key="item.label"
          class="grid min-h-[74px] gap-1 rounded-[var(--custom-radius)] border border-[var(--default-border)] bg-g-100/80 px-3.5 py-3"
        >
          <div class="text-xl font-semibold leading-none text-g-900">{{ item.value }}</div>
          <div class="text-xs text-g-500">{{ item.label }}</div>
        </div>
      </template>
    </ArtPageHero>

    <section class="grid gap-5 2xl:grid-cols-2">
      <div class="art-surface-sm p-5">
        <div class="mb-4">
          <div>
            <h3 class="text-lg font-semibold text-g-900">表格多选</h3>
            <p class="mt-1 text-sm text-g-600">适合选择客户、供应商、承运商等实体数据。</p>
          </div>
        </div>

        <ArtDataSelect
          v-model="companyIds"
          v-model:selected-items="selectedCompanies"
          title="选择合作企业"
          placeholder="请选择合作企业"
          :data="companyData"
          :columns="companyColumns"
          :filter-options="cityOptions"
          filter-key="city"
          subtitle-key="licenseNo"
          :show-pagination="true"
          :search-keys="['name', 'licenseNo', 'city', 'industry']"
          :selectable="(row) => row.status !== 'paused'"
          dialog-width="1040px"
          helper-text="可按企业名称、城市、行业或统一社会信用代码检索。"
          @confirm="handleConfirm('合作企业')"
        >
          <template #cell-risk="{ row }">
            <div class="flex justify-center">
              <span
                class="inline-flex items-center rounded px-2 py-0.5 text-xs font-medium"
                :class="riskClass[row.risk]"
              >
                {{ row.risk }}
              </span>
            </div>
          </template>
        </ArtDataSelect>

        <div class="mt-4 rounded-custom-xs bg-g-100/80 p-4">
          <div class="mb-2 text-xs font-medium text-g-500">当前选择</div>
          <div class="flex flex-wrap gap-2">
            <ElTag v-for="item in selectedCompanies" :key="item.id" effect="plain">
              {{ item.name }}
            </ElTag>
            <span v-if="!selectedCompanies.length" class="text-sm text-g-500">暂无数据</span>
          </div>
        </div>
      </div>

      <div class="art-surface-sm p-5">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-g-900">表格单选</h3>
          <p class="mt-1 text-sm text-g-600">适合弹窗内精确选择负责人、门店、仓库等单条记录。</p>
        </div>

        <ArtDataSelect
          v-model="warehouseId"
          v-model:selected-items="selectedWarehouse"
          title="选择发货仓"
          placeholder="请选择发货仓"
          :data="warehouseData"
          :columns="warehouseColumns"
          :multiple="false"
          :show-selected-panel="false"
          subtitle-key="address"
          dialog-width="820px"
          max-height="300px"
          helper-text="单选模式确认后返回一条记录，可用于订单、调拨和库存业务。"
          @confirm="handleConfirm('发货仓')"
        />

        <div class="mt-4 space-y-2 rounded-custom-xs bg-g-100/80 p-4">
          <div class="text-xs font-medium text-g-500">当前仓库</div>
          <div v-if="selectedWarehouse.length" class="text-sm text-g-800">
            {{ selectedWarehouse[0].name }} · {{ selectedWarehouse[0].address }}
          </div>
          <div v-else class="text-sm text-g-500">暂无数据</div>
        </div>
      </div>

      <div class="art-surface-sm p-5">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-g-900">树形多选</h3>
          <p class="mt-1 text-sm text-g-600">适合区域、部门、权限目录等层级数据。</p>
        </div>

        <ArtDataSelect
          v-model="regionIds"
          v-model:selected-items="selectedRegions"
          mode="tree"
          title="选择经营区域"
          placeholder="请选择经营区域"
          :data="regionData"
          value-key="code"
          label-key="name"
          subtitle-key="manager"
          :search-keys="['name', 'code', 'manager']"
          helper-text="支持父级和子级独立选择，已选项会在右侧聚合展示。"
          @confirm="handleConfirm('经营区域')"
        />

        <div class="mt-4 flex min-h-8 flex-wrap gap-2">
          <ElTag v-for="item in selectedRegions.slice(0, 8)" :key="item.code" effect="plain">
            {{ item.name }}
          </ElTag>
          <ElTag v-if="selectedRegions.length > 8" effect="plain" type="info">
            +{{ selectedRegions.length - 8 }}
          </ElTag>
          <span v-if="!selectedRegions.length" class="text-sm text-g-500">暂无数据</span>
        </div>
      </div>

      <div class="art-surface-sm p-5">
        <div class="mb-4">
          <h3 class="text-lg font-semibold text-g-900">树形单选</h3>
          <p class="mt-1 text-sm text-g-600"
            >适合选择默认地区、归属部门、主权限目录等单条层级数据。</p
          >
        </div>

        <ArtDataSelect
          v-model="primaryRegionCode"
          v-model:selected-items="selectedPrimaryRegion"
          mode="tree"
          title="选择默认区域"
          placeholder="请选择默认区域"
          :data="regionData"
          value-key="code"
          label-key="name"
          subtitle-key="manager"
          :multiple="false"
          :show-selected-panel="false"
          :search-keys="['name', 'code', 'manager']"
          helper-text="单选模式下使用高亮当前节点，确认后返回一条层级记录。"
          @confirm="handleConfirm('默认区域')"
        />

        <div class="mt-4 space-y-2 rounded-custom-xs bg-g-100/80 p-4">
          <div class="text-xs font-medium text-g-500">当前区域</div>
          <div v-if="selectedPrimaryRegion.length" class="text-sm text-g-800">
            {{ selectedPrimaryRegion[0].name }} · {{ selectedPrimaryRegion[0].manager }}
          </div>
          <div v-else class="text-sm text-g-500">暂无数据</div>
        </div>
      </div>
    </section>

    <section class="art-surface-sm p-5">
      <div class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h3 class="text-lg font-semibold text-g-900">命令式打开</h3>
          <p class="mt-1 text-sm text-g-600">
            可隐藏默认触发器，由业务按钮、表格操作列或详情页动作打开，适合批量关联和详情页操作。
          </p>
        </div>
        <ElButton type="primary" @click="projectSelectRef?.open()">
          <ArtSvgIcon icon="ri:add-line" class="mr-1 text-base" />
          关联项目
        </ElButton>
      </div>

      <ArtDataSelect
        ref="projectSelectRef"
        v-model="projectIds"
        v-model:selected-items="selectedProjects"
        title="关联项目"
        placeholder="请选择项目"
        :show-trigger="false"
        :data="projectData"
        :columns="projectColumns"
        subtitle-key="owner"
        dialog-width="980px"
        helper-text="用于详情页动作或表格批量操作，不占用表单布局空间。"
        @confirm="handleConfirm('项目')"
      />

      <div class="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        <article
          v-for="project in selectedProjects.slice(0, 6)"
          :key="project.id"
          class="rounded-custom-xs border border-[var(--default-border)] bg-g-100/80 p-4"
        >
          <div class="flex items-center justify-between gap-3">
            <div class="truncate text-sm font-medium text-g-900">{{ project.name }}</div>
            <ElTag size="small" effect="plain">{{ project.stage }}</ElTag>
          </div>
          <div class="mt-2 text-xs text-g-500">{{ project.owner }} · {{ project.city }}</div>
        </article>
        <div
          v-if="selectedProjects.length > 6"
          class="flex items-center justify-center rounded-custom-xs border border-dashed border-[var(--default-border)] bg-g-100/80 p-4 text-sm text-g-500"
        >
          另有 {{ selectedProjects.length - 6 }} 个项目
        </div>
        <div
          v-if="!selectedProjects.length"
          class="rounded-custom-xs border border-dashed border-[var(--default-border)] bg-g-100/80 p-4 text-sm text-g-500"
        >
          暂未关联项目
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
  import ArtDataSelect from '@/components/core/forms/art-data-select/index.vue'
  import type {
    DataSelectColumn,
    DataSelectOption
  } from '@/components/core/forms/art-data-select/index.vue'

  defineOptions({ name: 'WidgetsDataSelect' })

  const companyIds = ref<Array<number | string>>([7094, 9828])
  const selectedCompanies = ref<DataSelectOption[]>([])
  const warehouseId = ref<number | null>(2002)
  const selectedWarehouse = ref<DataSelectOption[]>([])
  const regionIds = ref<Array<number | string>>(['EAST-NB', 'CENTRAL-LY'])
  const selectedRegions = ref<DataSelectOption[]>([])
  const primaryRegionCode = ref<string | null>('SOUTH-2')
  const selectedPrimaryRegion = ref<DataSelectOption[]>([])
  const projectIds = ref<Array<number | string>>([])
  const selectedProjects = ref<DataSelectOption[]>([])
  const projectSelectRef = ref<InstanceType<typeof ArtDataSelect>>()

  const riskClass: Record<string, string> = {
    低: 'bg-success/10 text-success',
    中: 'bg-warning/10 text-warning',
    高: 'bg-danger/10 text-danger'
  }

  const cityPool = [
    '宁波市',
    '洛阳市',
    '合肥市',
    '泉州市',
    '无锡市',
    '佛山市',
    '嘉兴市',
    '郑州市',
    '昆明市',
    '贵阳市',
    '温州市',
    '南宁市'
  ]

  const provinceMap: Record<string, string> = {
    宁波市: '浙江省',
    洛阳市: '河南省',
    合肥市: '安徽省',
    泉州市: '福建省',
    无锡市: '江苏省',
    佛山市: '广东省',
    嘉兴市: '浙江省',
    郑州市: '河南省',
    昆明市: '云南省',
    贵阳市: '贵州省',
    温州市: '浙江省',
    南宁市: '广西壮族自治区'
  }

  const industryPool = ['智慧园区', '装备运维', '绿色材料', '即时零售', '医药流通', '跨境服务']
  const riskPool = ['低', '中', '高']
  const statusPool = ['active', 'pending', 'paused']
  const ownerPool = ['顾南星', '谢闻舟', '乔若溪', '秦砚', '程知予', '许清和', '夏云澈', '沈晚宁']
  const stagePool = ['调研中', '试运行', '扩展中', '稳定运营']

  const cityOptions = [
    ...cityPool.slice(0, 8).map((city) => ({
      label: city,
      value: city
    }))
  ]

  const companyColumns: DataSelectColumn[] = [
    { prop: 'id', label: 'ID', width: 84 },
    { prop: 'name', label: '企业名称', minWidth: 220 },
    { prop: 'industry', label: '行业', minWidth: 120 },
    { prop: 'city', label: '城市', width: 110 },
    { prop: 'risk', label: '风险', width: 86, align: 'center' }
  ]

  const companyData: DataSelectOption[] = [
    {
      id: 6910,
      name: '宁波澄澜数智园区服务有限公司',
      industry: '智慧园区',
      province: '浙江省',
      city: '宁波市',
      licenseNo: 'NB-A10278',
      risk: '低',
      status: 'active'
    },
    {
      id: 7094,
      name: '洛阳砚川装备运维股份有限公司',
      industry: '装备运维',
      province: '河南省',
      city: '洛阳市',
      licenseNo: 'LY-M56210',
      risk: '中',
      status: 'active'
    },
    {
      id: 5691,
      name: '合肥青岚绿色材料科技有限公司',
      industry: '绿色材料',
      province: '安徽省',
      city: '合肥市',
      licenseNo: 'HF-G81436',
      risk: '低',
      status: 'pending'
    },
    {
      id: 9828,
      name: '泉州简仓即时零售集团有限公司',
      industry: '即时零售',
      province: '福建省',
      city: '泉州市',
      licenseNo: 'QZ-R39022',
      risk: '高',
      status: 'active'
    },
    {
      id: 4435,
      name: '无锡白屿医药流通有限公司',
      industry: '医药流通',
      province: '江苏省',
      city: '无锡市',
      licenseNo: 'WX-P77291',
      risk: '低',
      status: 'paused'
    },
    {
      id: 8112,
      name: '佛山云阶跨境服务有限公司',
      industry: '跨境服务',
      province: '广东省',
      city: '佛山市',
      licenseNo: 'FS-X11809',
      risk: '中',
      status: 'active'
    },
    {
      id: 7344,
      name: '嘉兴晨泊城市配送科技有限公司',
      industry: '即时零售',
      province: '浙江省',
      city: '嘉兴市',
      licenseNo: 'JX-D55340',
      risk: '低',
      status: 'active'
    },
    {
      id: 9180,
      name: '郑州观澜运营管理有限公司',
      industry: '智慧园区',
      province: '河南省',
      city: '郑州市',
      licenseNo: 'ZZ-O90221',
      risk: '中',
      status: 'pending'
    },
    ...Array.from({ length: 32 }, (_, index) => {
      const city = cityPool[index % cityPool.length]
      const industry = industryPool[index % industryPool.length]
      const risk = riskPool[index % riskPool.length]
      const status = statusPool[index % statusPool.length]

      return {
        id: 10000 + index,
        name: `${city.replace('市', '')}${['澄舟', '棠序', '青禾', '云砚'][index % 4]}${industry}有限公司`,
        industry,
        province: provinceMap[city] || '华中大区',
        city,
        licenseNo: `DS${String(index + 1).padStart(5, '0')}`,
        risk,
        status
      }
    })
  ]

  const warehouseColumns: DataSelectColumn[] = [
    { prop: 'id', label: '编号', width: 90 },
    { prop: 'name', label: '仓库名称', minWidth: 180 },
    { prop: 'city', label: '城市', width: 110 },
    { prop: 'capacity', label: '库容', width: 110, align: 'right' }
  ]

  const warehouseData: DataSelectOption[] = [
    {
      id: 2001,
      name: '海曙云拣中心',
      city: '宁波市',
      address: '海曙区星湾路 39 号',
      capacity: '82%'
    },
    {
      id: 2002,
      name: '洛龙前置调拨仓',
      city: '洛阳市',
      address: '洛龙区开元大道 216 号',
      capacity: '64%'
    },
    {
      id: 2003,
      name: '包河医药恒温仓',
      city: '合肥市',
      address: '包河区临湖路 88 号',
      capacity: '71%'
    },
    {
      id: 2004,
      name: '晋江跨境集拼仓',
      city: '泉州市',
      address: '晋江市双龙路 126 号',
      capacity: '58%'
    },
    ...Array.from({ length: 18 }, (_, index) => {
      const city = cityPool[(index + 4) % cityPool.length]
      return {
        id: 2100 + index,
        name: `${city.replace('市', '')}${['云拣仓', '前置站', '周转舱'][index % 3]}`,
        city,
        address: `${city}协同运营园 ${index + 18} 号楼`,
        capacity: `${52 + ((index * 7) % 43)}%`
      }
    })
  ]

  const regionData: DataSelectOption[] = [
    {
      code: 'EAST',
      name: '东部协同区',
      manager: '区域经理：顾南星',
      children: [
        { code: 'EAST-NB', name: '宁波湾组', manager: '负责人：谢闻舟' },
        { code: 'EAST-JX', name: '嘉禾组', manager: '负责人：乔若溪' },
        { code: 'EAST-WX', name: '太湖组', manager: '负责人：秦砚' }
      ]
    },
    {
      code: 'CENTRAL',
      name: '中原运营区',
      manager: '区域经理：程知予',
      children: [
        { code: 'CENTRAL-LY', name: '洛阳组', manager: '负责人：许清和' },
        { code: 'CENTRAL-ZZ', name: '郑州组', manager: '负责人：夏云澈' },
        { code: 'CENTRAL-HF', name: '合肥组', manager: '负责人：沈晚宁' }
      ]
    },
    {
      code: 'SOUTH',
      name: '南部增长区',
      manager: '区域经理：秦砚',
      children: [
        { code: 'SOUTH-1', name: '佛山组', manager: '负责人：顾南星' },
        { code: 'SOUTH-2', name: '泉州组', manager: '负责人：谢闻舟' }
      ]
    },
    ...[
      ['WEST', '西南服务区', ['昆明组', '贵阳组', '南宁组', '曲靖组']],
      ['NORTH', '北部保障区', ['太原组', '石家庄组', '呼和浩特组', '包头组']],
      ['BAY', '湾区服务区', ['佛山组', '中山组', '珠海组', '东莞组']],
      ['RIVER', '长江走廊区', ['芜湖组', '九江组', '岳阳组', '宜昌组']],
      ['COAST', '海岸协作区', ['温州组', '台州组', '福州组', '莆田组']],
      ['HUB', '枢纽支援区', ['郑州组', '合肥组', '南阳组', '蚌埠组']]
    ].map(([code, name, cities], provinceIndex) => ({
      code,
      name,
      manager: `区域经理：${ownerPool[provinceIndex % ownerPool.length]}`,
      children: (cities as string[]).map((city, cityIndex) => ({
        code: `${code}-${cityIndex + 1}`,
        name: city,
        manager: `负责人：${ownerPool[(provinceIndex + cityIndex + 1) % ownerPool.length]}`
      }))
    }))
  ]

  const projectColumns: DataSelectColumn[] = [
    { prop: 'id', label: '项目号', width: 100 },
    { prop: 'name', label: '项目名称', minWidth: 220 },
    { prop: 'owner', label: '负责人', width: 110 },
    { prop: 'city', label: '城市', width: 100 },
    { prop: 'stage', label: '阶段', width: 110 }
  ]

  const projectData: DataSelectOption[] = [
    { id: 'D-26031', name: '园区能耗协同看板', owner: '顾南星', city: '宁波市', stage: '扩展中' },
    { id: 'D-26042', name: '装备巡检闭环试点', owner: '谢闻舟', city: '洛阳市', stage: '试运行' },
    { id: 'D-26058', name: '医药恒温履约计划', owner: '乔若溪', city: '合肥市', stage: '稳定运营' },
    { id: 'D-26077', name: '跨境集拼效率提升', owner: '秦砚', city: '泉州市', stage: '扩展中' },
    ...Array.from({ length: 28 }, (_, index) => ({
      id: `D-${27000 + index}`,
      name: `${cityPool[index % cityPool.length]}${['履约调度', '库存预警', '巡检协同', '客户留存'][index % 4]}计划`,
      owner: ownerPool[index % ownerPool.length],
      city: cityPool[index % cityPool.length],
      stage: stagePool[index % stagePool.length]
    }))
  ]

  const overview = computed(() => [
    { label: '数据模式', value: '2' },
    { label: '选择策略', value: '4' },
    {
      label: '演示数据',
      value: String(companyData.length + warehouseData.length + projectData.length)
    }
  ])

  const handleConfirm = (label: string) => (_value: unknown, rows: DataSelectOption[]) => {
    ElMessage.success(`${label}已选择 ${rows.length} 项`)
  }
</script>
