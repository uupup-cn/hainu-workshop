import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import cover1 from '@/assets/images/cover/img1.webp'
import cover2 from '@/assets/images/cover/img2.webp'
import cover3 from '@/assets/images/cover/img3.webp'
import cover4 from '@/assets/images/cover/img4.webp'
import cover5 from '@/assets/images/cover/img5.webp'
import type {
  ActivityItem,
  DeviceLegendItem,
  InvoiceFilterOption,
  InvoiceRow,
  OverviewChartData,
  OverviewTab,
  StatCard,
  TopChannel,
  TopCustomer,
  TopProduct,
  TransactionItem
} from './types'
import { themeColors } from './ui'

export const statCards: StatCard[] = [
  {
    title: '总营收',
    value: '¥46,658',
    change: '0.45%',
    changeClass: 'text-success',
    changeIcon: 'ri:arrow-up-line',
    icon: 'ri:briefcase-3-line',
    iconClass: 'bg-primary/12 text-primary',
    accent: themeColors.primary
  },
  {
    title: '退款申请',
    value: '4,654',
    change: '4.43%',
    changeClass: 'text-success',
    changeIcon: 'ri:arrow-up-line',
    icon: 'ri:refund-2-line',
    iconClass: 'bg-secondary/12 text-secondary',
    accent: themeColors.secondary
  },
  {
    title: '订单总数',
    value: '25,853',
    change: '1.25%',
    changeClass: 'text-success',
    changeIcon: 'ri:arrow-up-line',
    icon: 'ri:shopping-cart-2-line',
    iconClass: 'bg-warning/12 text-warning',
    accent: themeColors.warning
  },
  {
    title: '总访客数',
    value: '63,744',
    change: '2.97%',
    changeClass: 'text-danger',
    changeIcon: 'ri:arrow-down-line',
    icon: 'ri:team-line',
    iconClass: 'bg-success/12 text-success',
    accent: themeColors.success
  }
]

export const overviewTabs: OverviewTab[] = [
  { key: 'day', label: '日' },
  { key: 'week', label: '周' },
  { key: 'month', label: '月' },
  { key: 'year', label: '年' }
]

export type OverviewTabKey = (typeof overviewTabs)[number]['key']

export const overviewSummary = [
  { label: '订单总量', value: '15,535' },
  { label: '销售总额', value: '21,754' },
  { label: '累计营收', value: '¥180万' }
]

export const overviewChartMap: Record<OverviewTabKey, OverviewChartData> = {
  day: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    orders: [42, 47, 34, 33, 43, 18, 28, 53, 19, 24, 23, 15],
    sales: [21, 16, 48, 46, 20, 25, 26, 26, 25, 16, 38, 21],
    revenue: [18, 21, 20, 34, 16, 29, 13, 21, 18, 29, 22, 12]
  },
  week: {
    xAxis: ['第1周', '第2周', '第3周', '第4周', '第5周', '第6周', '第7周', '第8周'],
    orders: [35, 42, 38, 40, 44, 46, 48, 43],
    sales: [22, 28, 26, 30, 33, 35, 34, 31],
    revenue: [16, 19, 20, 24, 26, 27, 25, 23]
  },
  month: {
    xAxis: ['1月', '2月', '3月', '4月', '5月', '6月'],
    orders: [168, 182, 195, 224, 206, 238],
    sales: [124, 142, 178, 186, 170, 201],
    revenue: [78, 95, 108, 126, 119, 134]
  },
  year: {
    xAxis: ['2021', '2022', '2023', '2024', '2025', '2026'],
    orders: [1020, 1180, 1360, 1520, 1690, 1810],
    sales: [760, 835, 990, 1120, 1260, 1380],
    revenue: [430, 520, 610, 720, 810, 920]
  }
}

export const deviceIndicators = [
  { name: '周日', max: 100 },
  { name: '周一', max: 100 },
  { name: '周二', max: 100 },
  { name: '周三', max: 100 },
  { name: '周四', max: 100 },
  { name: '周五', max: 100 },
  { name: '周六', max: 100 }
]

export const deviceRadarColors = [themeColors.primary, themeColors.success, themeColors.warning]

export const deviceRadarData = [
  { name: '桌面端', value: [82, 74, 88, 36, 12, 58, 67] },
  { name: '移动端', value: [10, 26, 18, 82, 71, 84, 14] },
  { name: '其他', value: [66, 58, 43, 20, 15, 49, 73] }
]

export const deviceLegend: DeviceLegendItem[] = [
  { name: '桌面端', color: themeColors.primary },
  { name: '移动端', color: themeColors.success },
  { name: '其他', color: themeColors.warning }
]

export const topProducts: TopProduct[] = [
  {
    name: '北极星挂钟',
    price: '¥699',
    stock: '库存充足',
    stockClass: 'text-success',
    sales: '1,020',
    image: cover1
  },
  {
    name: '俱乐部抓绒卫衣',
    price: '¥55',
    stock: '库存充足',
    stockClass: 'text-success',
    sales: '3100',
    image: cover2
  },
  {
    name: '灵犀 Pro 耳机',
    price: '¥199',
    stock: '库存充足',
    stockClass: 'text-success',
    sales: '1,280',
    image: cover3
  },
  {
    name: '暖心保温壶',
    price: '¥699',
    stock: '暂时缺货',
    stockClass: 'text-danger',
    sales: '980',
    image: cover4
  },
  {
    name: '轻行女士手袋',
    price: '¥89',
    stock: '库存充足',
    stockClass: 'text-success',
    sales: '2,080',
    image: cover5
  }
]

export const activities: ActivityItem[] = [
  {
    id: 1,
    date: '24日',
    time: '08:45',
    color: themeColors.primary,
    content: `周子航下单了 <span style="color: ${themeColors.primary}" class="font-semibold">5 台 iPhone 14</span>`
  },
  {
    id: 2,
    date: '24日',
    time: '09:15',
    color: themeColors.warning,
    content: `收到来自林雨的回款 <span style="color: ${themeColors.warning}" class="font-semibold">¥1,250.00</span>`
  },
  {
    id: 3,
    date: '24日',
    time: '10:00',
    color: themeColors.info,
    content: `陈浩提交了 <span style="color: ${themeColors.info}" class="font-semibold">Galaxy S22</span> 退款申请`
  },
  {
    id: 4,
    date: '24日',
    time: '10:45',
    color: themeColors.success,
    content: `商品 <span style="color: ${themeColors.success}" class="font-semibold">ID:5409</span> 库存已低于阈值`
  },
  {
    id: 5,
    date: '24日',
    time: '11:30',
    color: themeColors.danger,
    content: `王悦提交了商品 <span style="color: ${themeColors.danger}" class="font-semibold">ID:7312</span> 的五星评价`
  }
]

export const topCustomers: TopCustomer[] = [
  {
    initials: 'JS',
    name: '简·书曼',
    email: 'jian.shuman@company.com',
    amount: '¥23,880',
    amountClass: 'text-primary',
    badgeClass: 'bg-primary/12 text-primary'
  },
  {
    initials: 'JD',
    name: '杜文',
    email: 'duwen@company.com',
    amount: '¥14,760',
    amountClass: 'text-secondary',
    badgeClass: 'bg-secondary/12 text-secondary'
  },
  {
    initials: 'AK',
    name: '凯瑟琳',
    email: 'katherine@company.com',
    amount: '¥12,240',
    amountClass: 'text-warning',
    badgeClass: 'bg-warning/12 text-warning'
  },
  {
    initials: 'LP',
    name: '李昂',
    email: 'liang@company.com',
    amount: '¥10,680',
    amountClass: 'text-info',
    badgeClass: 'bg-info/12 text-info'
  },
  {
    initials: 'BS',
    name: '辛悦',
    email: 'xinyue@company.com',
    amount: '¥8,760',
    amountClass: 'text-success',
    badgeClass: 'bg-success/12 text-success'
  }
]

export const topChannels: TopChannel[] = [
  {
    logoIcon: 'ri:settings-3-line',
    logoClass: 'bg-success/12 text-success',
    name: '云端通联',
    desc: '数字沟通',
    change: '↑ 3.08%',
    changeClass: 'text-success',
    value: '3,860',
    barWidth: '78%',
    barColor: themeColors.success
  },
  {
    logoIcon: 'ri:close-line',
    logoClass: 'bg-secondary/12 text-secondary',
    name: '脉冲传媒',
    desc: '社交媒体',
    change: '↓ 4.92%',
    changeClass: 'text-danger',
    value: '2,940',
    barWidth: '61%',
    barColor: themeColors.secondary
  },
  {
    logoIcon: 'ri:global-line',
    logoClass: 'bg-warning/12 text-warning',
    name: '星云网络',
    desc: '网络合作',
    change: '↑ 2.14%',
    changeClass: 'text-success',
    value: '2,468',
    barWidth: '55%',
    barColor: themeColors.warning
  },
  {
    logoIcon: 'ri:links-line',
    logoClass: 'bg-info/12 text-info',
    name: '闪联触达',
    desc: '直效营销',
    change: '↓ 4.33%',
    changeClass: 'text-danger',
    value: '1,812',
    barWidth: '42%',
    barColor: themeColors.info
  },
  {
    logoIcon: 'ri:fire-line',
    logoClass: 'bg-danger/12 text-danger',
    name: '回声互联',
    desc: '问卷反馈',
    change: '↑ 3.96%',
    changeClass: 'text-success',
    value: '1,588',
    barWidth: '38%',
    barColor: themeColors.success
  },
  {
    logoIcon: 'ri:palette-line',
    logoClass: 'bg-primary/12 text-primary',
    name: '视界分发',
    desc: '内容分发',
    change: '↑ 1.08%',
    changeClass: 'text-success',
    value: '1,402',
    barWidth: '34%',
    barColor: themeColors.primary
  }
]

export const invoiceRows: InvoiceRow[] = [
  {
    id: 1,
    orderNo: '#SPK231',
    customer: '简·书曼',
    email: 'jian.shuman@company.com',
    date: '2024-08-27',
    time: '12:45',
    productImages: [cover1, cover2, cover3],
    price: '¥1,249',
    status: '已支付',
    avatar: avatar1
  },
  {
    id: 2,
    orderNo: '#SPK421',
    customer: '杜文',
    email: 'duwen@company.com',
    date: '2024-09-16',
    time: '11:15',
    productImages: [cover4, cover5],
    price: '¥3,299',
    status: '待处理',
    avatar: avatar2
  },
  {
    id: 3,
    orderNo: '#SPK175',
    customer: '戴安娜',
    email: 'diana@company.com',
    date: '2024-09-15',
    time: '16:45',
    productImages: [cover3, cover2],
    price: '¥4,799',
    status: '已逾期',
    avatar: avatar3
  },
  {
    id: 4,
    orderNo: '#SPK145',
    customer: '李昂',
    email: 'liang@company.com',
    date: '2024-09-21',
    time: '14:18',
    productImages: [cover5],
    price: '¥2,499',
    status: '已支付',
    avatar: avatar4
  },
  {
    id: 5,
    orderNo: '#SPK426',
    customer: '萨拉·李',
    email: 'saralee765@gmail.com',
    date: '2024-10-19',
    time: '15:52',
    productImages: [cover1, cover4],
    price: '¥3,999',
    status: '已支付',
    avatar: avatar5
  }
]

export const invoiceFilterOptions: InvoiceFilterOption[] = [
  { label: '全部状态', value: 'all' },
  { label: '已支付', value: '已支付' },
  { label: '待处理', value: '待处理' },
  { label: '已逾期', value: '已逾期' }
]

export const transactions: TransactionItem[] = [
  {
    orderNo: '#SPK1234',
    items: 4,
    price: '¥150.00',
    date: '2024-08-27',
    status: '已支付',
    avatars: [avatar1, avatar2],
    extra: 2
  },
  {
    orderNo: '#SPK7432',
    items: 3,
    price: '¥75.00',
    date: '2024-08-26',
    status: '待处理',
    avatars: [avatar3, avatar4]
  },
  {
    orderNo: '#SPK3422',
    items: 2,
    price: '¥200.00',
    date: '2024-08-25',
    status: '已支付',
    avatars: [avatar5]
  },
  {
    orderNo: '#SPK1578',
    items: 1,
    price: '¥120.00',
    date: '2024-08-24',
    status: '已支付',
    avatars: [avatar2]
  },
  {
    orderNo: '#SPK2355',
    items: 5,
    price: '¥90.00',
    date: '2024-08-23',
    status: '失败',
    avatars: [avatar1, avatar4],
    extra: 3
  },
  {
    orderNo: '#SPK1643',
    items: 1,
    price: '¥249.00',
    date: '2024-08-16',
    status: '已支付',
    avatars: [avatar3]
  }
]
