import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import type {
  BrowserRow,
  CampaignRow,
  CountryRow,
  DeviceStat,
  EngagementRow,
  ReferralRow,
  ReferralSegment,
  StatCard
} from './types'

export const statCards: StatCard[] = [
  {
    title: '总访客数',
    value: '48,260',
    change: '1.18%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:user-line',
    iconBg: 'var(--art-primary)'
  },
  {
    title: '总会话数',
    value: '156K',
    change: '3.04%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:presentation-line',
    iconBg: 'var(--art-secondary)'
  },
  {
    title: '跳出率',
    value: '38.2%',
    change: '1.12%',
    changeIcon: 'ri:arrow-down-line',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:percent-line',
    iconBg: 'var(--art-success)'
  },
  {
    title: '平均会话时长',
    value: '4分12秒',
    change: '0.84%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:timer-flash-line',
    iconBg: 'var(--art-warning)'
  }
]

export const deviceStats: DeviceStat[] = [
  { name: '手机', value: 1842 },
  { name: '平板', value: 1026 },
  { name: '桌面端', value: 1364 }
]

export const deviceSessionData = deviceStats.map((item) => ({
  name: item.name,
  value: item.value
}))

export const months = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月'
]

export const audienceBarValues = [24, 12, 23, 29, 14, 23, 40, 22, 47, 23, 49, 38]

export const browserRows: BrowserRow[] = [
  {
    name: 'Chrome',
    company: '谷歌浏览器',
    value: '1,428',
    emoji: '🌐',
    color: 'var(--art-primary)'
  },
  {
    name: 'Edge',
    company: '微软浏览器',
    value: '1,102',
    emoji: '🌀',
    color: 'var(--art-secondary)'
  },
  {
    name: 'Safari',
    company: '苹果浏览器',
    value: '864',
    emoji: '🦊',
    color: 'var(--art-warning)'
  },
  {
    name: 'Firefox',
    company: '火狐浏览器',
    value: '934',
    emoji: '⭕',
    color: 'var(--art-info)'
  },
  {
    name: 'Opera',
    company: '欧朋浏览器',
    value: '712',
    emoji: '🧭',
    color: 'var(--art-success)'
  },
  {
    name: '夸克',
    company: 'UC 浏览器',
    value: '798',
    emoji: '🦁',
    color: 'var(--art-error)'
  }
]

export const countryRows: CountryRow[] = [
  {
    id: 1,
    flag: '🇺🇸',
    country: '美国',
    change: '(↑ 2.15%)',
    changeClass: 'text-[var(--art-success)]',
    visitors: '45,860'
  },
  {
    id: 2,
    flag: '🇦🇷',
    country: '阿根廷',
    change: '(↑ 1.62%)',
    changeClass: 'text-[var(--art-success)]',
    visitors: '12,680'
  },
  {
    id: 3,
    flag: '🇮🇹',
    country: '意大利',
    change: '(↓ 0.85%)',
    changeClass: 'text-[var(--art-danger)]',
    visitors: '7,812'
  },
  {
    id: 4,
    flag: '🇷🇺',
    country: '俄罗斯',
    change: '(↑ 3.51%)',
    changeClass: 'text-[var(--art-success)]',
    visitors: '3,954'
  },
  {
    id: 5,
    flag: '🇪🇸',
    country: '西班牙',
    change: '(↓ 0.56%)',
    changeClass: 'text-[var(--art-danger)]',
    visitors: '2,702'
  },
  {
    id: 6,
    flag: '🇦🇪',
    country: '阿联酋',
    change: '(↑ 1.92%)',
    changeClass: 'text-[var(--art-success)]',
    visitors: '2,018'
  }
]

export const campaignRows: CampaignRow[] = [
  {
    name: '陈晨',
    role: '品牌合作',
    sales: '￥12,465',
    goal: '23.3%',
    goalClass: 'font-medium text-[var(--art-primary)]',
    status: '进行中',
    statusClass:
      'bg-[color-mix(in_oklab,var(--art-secondary)_14%,var(--default-box-color))] text-[var(--art-secondary)]',
    avatar: avatar1
  },
  {
    name: '李娜',
    role: '内容合作',
    sales: '￥3,576',
    goal: '19.4%',
    goalClass: 'font-medium text-[var(--art-secondary)]',
    status: '已完成',
    statusClass:
      'bg-[color-mix(in_oklab,var(--art-success)_14%,var(--default-box-color))] text-[var(--art-success)]',
    avatar: avatar2
  },
  {
    name: '王凯',
    role: '视频推广',
    sales: '￥12,764',
    goal: '12.76%',
    goalClass: 'font-medium text-[var(--art-success)]',
    status: '进行中',
    statusClass:
      'bg-[color-mix(in_oklab,var(--art-secondary)_14%,var(--default-box-color))] text-[var(--art-secondary)]',
    avatar: avatar3
  },
  {
    name: '周敏',
    role: '内容创作者',
    sales: '￥13,864',
    goal: '16.78%',
    goalClass: 'font-medium text-[var(--art-warning)]',
    status: '已完成',
    statusClass:
      'bg-[color-mix(in_oklab,var(--art-success)_14%,var(--default-box-color))] text-[var(--art-success)]',
    avatar: avatar4
  },
  {
    name: '刘洋',
    role: '视频推广',
    sales: '￥9,756',
    goal: '6.13%',
    goalClass: 'font-medium text-[var(--art-info)]',
    status: '已完成',
    statusClass:
      'bg-[color-mix(in_oklab,var(--art-success)_14%,var(--default-box-color))] text-[var(--art-success)]',
    avatar: avatar5
  }
]

export const engagementRows: EngagementRow[] = [
  {
    id: 1,
    user: '张晨',
    sessions: 120,
    flag: '🇺🇸',
    country: '美国',
    views: 350,
    bounce: '42%',
    conversion: '5.6%',
    avatar: avatar1
  },
  {
    id: 2,
    user: '李娜',
    sessions: 95,
    flag: '🇩🇪',
    country: '德国',
    views: 240,
    bounce: '35%',
    conversion: '6.9%',
    avatar: avatar2
  },
  {
    id: 3,
    user: '陈浩',
    sessions: 110,
    flag: '🇨🇦',
    country: '加拿大',
    views: 290,
    bounce: '39%',
    conversion: '4.8%',
    avatar: avatar3
  },
  {
    id: 4,
    user: '王悦',
    sessions: 75,
    flag: '🇦🇷',
    country: '阿根廷',
    views: 200,
    bounce: '48%',
    conversion: '4.1%',
    avatar: avatar4
  },
  {
    id: 5,
    user: '赵明',
    sessions: 135,
    flag: '🇮🇳',
    country: '印度',
    views: 400,
    bounce: '28%',
    conversion: '7.4%',
    avatar: avatar5
  }
]

export const heatTimes = ['12时', '19时', '15时', '0时', '8时', '4时', '1时']
export const heatDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const heatMap = [
  [3, 2, 0, 2, 3, 3, 1],
  [1, 0, 3, 2, 1, 3, 2],
  [3, 0, 2, 2, 3, 3, 3],
  [2, 4, 3, 4, 0, 0, 3],
  [2, 1, 2, 3, 3, 2, 3],
  [1, 2, 2, 2, 4, 3, 1],
  [3, 2, 1, 0, 4, 2, 3]
]

export const referralSegments: ReferralSegment[] = [
  { width: '22%', color: 'var(--art-primary)' },
  { width: '24%', color: 'var(--art-secondary)' },
  { width: '32%', color: 'var(--art-warning)' },
  { width: '22%', color: 'var(--art-success)' }
]

export const referralRows: ReferralRow[] = [
  { url: '首页/活动页', value: '1,420', color: 'var(--art-primary)' },
  { url: '产品/新品上架', value: '1,180', color: 'var(--art-secondary)' },
  { url: '服务/增长方案', value: '1,030', color: 'var(--art-warning)' },
  { url: '定价页', value: '940', color: 'var(--art-success)' }
]

export const averageSessionDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']
export const averageSessionBarValues = [58, 32, 49, 18, 58, 88, 46]
