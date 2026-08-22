import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import type {
  ActivityItem,
  AgeMetric,
  CountryRow,
  PerformanceRow,
  PostRow,
  StatCard,
  SuggestionRow
} from './types'
import { artColors } from './ui'

export const statCards: StatCard[] = [
  {
    title: '总访客',
    value: '128,560',
    change: '2.74%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:team-line',
    iconClass: 'bg-primary/14 text-primary'
  },
  {
    title: '互动量',
    value: '31,028',
    change: '1.46%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:bubble-chart-line',
    iconClass: 'bg-secondary/14 text-secondary'
  },
  {
    title: '点赞数',
    value: '36,102',
    change: '1.08%',
    changeIcon: 'ri:arrow-down-line',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:heart-3-fill',
    iconClass: 'bg-success/14 text-success'
  },
  {
    title: '跳出率',
    value: '14.8%',
    change: '5.12%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:line-chart-line',
    iconClass: 'bg-warning/14 text-warning'
  }
]

export const monthLabels = [
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

export const profileVisitSeries = [
  { name: 'Facebook', data: [36, 18, 66, 57, 41, 63, 98, 45, 80, 78, 36, 24] },
  { name: 'Instagram', data: [60, 62, 44, 54, 67, 49, 59, 35, 19, 66, 55, 40] },
  { name: 'Twitter', data: [50, 32, 53, 72, 24, 62, 55, 16, 51, 30, 21, 71] }
]

export const genderIndicators = [
  { name: '2019', max: 100 },
  { name: '2020', max: 100 },
  { name: '2021', max: 100 },
  { name: '2022', max: 100 },
  { name: '2023', max: 100 },
  { name: '2024', max: 100 }
]

export const genderRadarData = [
  { name: '男性', value: [66, 42, 58, 95, 28, 84] },
  { name: '女性', value: [44, 62, 74, 36, 57, 53] }
]

export const countryRows: CountryRow[] = [
  {
    id: 1,
    flag: '🇺🇸',
    country: '美国',
    engagement: '15,480',
    followers: '35,620',
    change: '↗ 12.8%',
    changeClass: 'text-[var(--art-success)]'
  },
  {
    id: 2,
    flag: '🇮🇳',
    country: '印度',
    engagement: '12,260',
    followers: '25,410',
    change: '↘ 6.5%',
    changeClass: 'text-[var(--art-danger)]'
  },
  {
    id: 3,
    flag: '🇨🇦',
    country: '加拿大',
    engagement: '8,720',
    followers: '20,340',
    change: '↗ 7.8%',
    changeClass: 'text-[var(--art-success)]'
  },
  {
    id: 4,
    flag: '🇩🇪',
    country: '德国',
    engagement: '4,950',
    followers: '12,690',
    change: '↗ 10.9%',
    changeClass: 'text-[var(--art-success)]'
  },
  {
    id: 5,
    flag: '🇫🇷',
    country: '法国',
    engagement: '4,120',
    followers: '11,240',
    change: '↘ 4.7%',
    changeClass: 'text-[var(--art-danger)]'
  }
]

export const postRows: PostRow[] = [
  {
    name: '幕后花絮',
    date: '2月2日',
    platform: 'YouTube',
    views: '9.5K+',
    iconClass: 'bg-primary/14 text-primary',
    icon: 'ri:clapperboard-line',
    platformClass: 'bg-danger/12 text-danger'
  },
  {
    name: '周一激励',
    date: '2月14日',
    platform: 'Instagram',
    views: '1M+',
    iconClass: 'bg-secondary/14 text-secondary',
    icon: 'ri:flashlight-line',
    platformClass: 'bg-secondary/12 text-secondary'
  },
  {
    name: '旅行日记',
    date: '2月13日',
    platform: 'Twitter',
    views: '10K+',
    iconClass: 'bg-info/14 text-info',
    icon: 'ri:flight-takeoff-line',
    platformClass: 'bg-info/12 text-info'
  },
  {
    name: '今日食谱',
    date: '2月12日',
    platform: 'LinkedIn',
    views: '3.5K',
    iconClass: 'bg-warning/14 text-warning',
    icon: 'ri:restaurant-line',
    platformClass: 'bg-primary/12 text-primary'
  },
  {
    name: '时尚前线',
    date: '2月11日',
    platform: 'Pinterest',
    views: '1.6M+',
    iconClass: 'bg-danger/14 text-danger',
    icon: 'ri:shirt-line',
    platformClass: 'bg-warning/12 text-warning'
  }
]

export const performanceRows: PerformanceRow[] = [
  {
    id: 1,
    platform: 'Facebook',
    posts: 126,
    likes: '8,860',
    shares: '1,260',
    comments: '980',
    impressions: '12.9%',
    followers: '36k',
    ctr: '4.4%',
    ctrBg: 'color-mix(in oklab, var(--art-primary) 14%, var(--default-box-color))',
    ctrColor: artColors.primary,
    icon: 'ri:facebook-fill',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    id: 2,
    platform: 'Instagram',
    posts: 99,
    likes: '12,480',
    shares: '2,180',
    comments: '1,860',
    impressions: '14.8%',
    followers: '43k',
    ctr: '5.2%',
    ctrBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    ctrColor: artColors.secondary,
    icon: 'ri:instagram-line',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    id: 3,
    platform: 'Twitter',
    posts: 184,
    likes: '5,860',
    shares: '1,560',
    comments: '1,040',
    impressions: '10.2%',
    followers: '29k',
    ctr: '3.7%',
    ctrBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    ctrColor: artColors.warning,
    icon: 'ri:twitter-x-line',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    id: 4,
    platform: 'LinkedIn',
    posts: 75,
    likes: '4,200',
    shares: '800',
    comments: '600',
    impressions: '11.2%',
    followers: '20k',
    ctr: '3.8%',
    ctrBg: 'color-mix(in oklab, var(--art-info) 14%, var(--default-box-color))',
    ctrColor: artColors.info,
    icon: 'ri:linkedin-box-fill',
    iconClass: 'bg-info/12 text-info'
  },
  {
    id: 5,
    platform: 'YouTube',
    posts: 30,
    likes: '22,000',
    shares: '4,000',
    comments: '3,800',
    impressions: '18.5%',
    followers: '65k',
    ctr: '7.8%',
    ctrBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    ctrColor: artColors.success,
    icon: 'ri:youtube-fill',
    iconClass: 'bg-success/12 text-success'
  },
  {
    id: 6,
    platform: 'Snapchat',
    posts: 60,
    likes: '6,500',
    shares: '1,200',
    comments: '900',
    impressions: '10.1%',
    followers: '22k',
    ctr: '3.9%',
    ctrBg: 'color-mix(in oklab, var(--art-danger) 14%, var(--default-box-color))',
    ctrColor: artColors.danger,
    icon: 'ri:snapchat-line',
    iconClass: 'bg-danger/12 text-danger'
  },
  {
    id: 7,
    platform: 'TikTok',
    posts: 88,
    likes: '18,400',
    shares: '3,500',
    comments: '2,100',
    impressions: '16.9%',
    followers: '54k',
    ctr: '6.4%',
    ctrBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    ctrColor: artColors.secondary,
    icon: 'ri:tiktok-fill',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    id: 8,
    platform: 'Reddit',
    posts: 42,
    likes: '3,700',
    shares: '980',
    comments: '1,240',
    impressions: '8.7%',
    followers: '18k',
    ctr: '2.9%',
    ctrBg: 'color-mix(in oklab, var(--art-primary) 14%, var(--default-box-color))',
    ctrColor: artColors.primary,
    icon: 'ri:reddit-fill',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    id: 9,
    platform: 'X',
    posts: 102,
    likes: '7,800',
    shares: '1,650',
    comments: '1,050',
    impressions: '10.4%',
    followers: '29k',
    ctr: '3.7%',
    ctrBg: 'color-mix(in oklab, var(--art-gray-800) 14%, var(--default-box-color))',
    ctrColor: 'var(--art-gray-900)',
    icon: 'ri:twitter-x-line',
    iconClass: 'bg-gray-800/12 text-gray-900'
  },
  {
    id: 10,
    platform: 'Behance',
    posts: 36,
    likes: '4,950',
    shares: '870',
    comments: '510',
    impressions: '7.9%',
    followers: '16k',
    ctr: '2.4%',
    ctrBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    ctrColor: artColors.warning,
    icon: 'ri:behance-fill',
    iconClass: 'bg-warning/12 text-warning'
  }
]

export const activities: ActivityItem[] = [
  {
    platform: 'Facebook',
    content: '发布了新的春季促销内容',
    time: '10:15',
    icon: 'ri:facebook-fill',
    iconClass: 'bg-primary/12 text-primary',
    tagClass: 'bg-primary/12 text-primary'
  },
  {
    platform: 'Instagram',
    content: '上传了 3 张海边主题照片',
    time: '15:45',
    icon: 'ri:instagram-line',
    iconClass: 'bg-secondary/12 text-secondary',
    tagClass: 'bg-secondary/12 text-secondary'
  },
  {
    platform: 'LinkedIn',
    content: '更新了市场岗位招聘动态',
    time: '11:30',
    icon: 'ri:linkedin-box-fill',
    iconClass: 'bg-warning/12 text-warning',
    tagClass: 'bg-warning/12 text-warning'
  },
  {
    platform: 'Twitter',
    content: '发送了新品发布预热推文',
    time: '18:00',
    icon: 'ri:twitter-x-line',
    iconClass: 'bg-success/12 text-success',
    tagClass: 'bg-success/12 text-success'
  },
  {
    platform: 'Pinterest',
    content: '置顶了节日装饰灵感图板',
    time: '11:30',
    icon: 'ri:pinterest-fill',
    iconClass: 'bg-danger/12 text-danger',
    tagClass: 'bg-danger/12 text-danger'
  }
]

export const ageMetrics: AgeMetric[] = [
  { label: '10-20', value: 78, count: 470 },
  { label: '20-30', value: 75, count: 455 },
  { label: '30-40', value: 57, count: 345 },
  { label: '40-50', value: 89, count: 535 },
  { label: '50-60', value: 80, count: 480 },
  { label: '60-70', value: 84, count: 505 },
  { label: '70-80', value: 82, count: 492 }
]

export const suggestionRows: SuggestionRow[] = [
  { name: '陈雨', mutual: '3 位共同好友', avatar: avatar1 },
  { name: '李响', mutual: '1 位共同好友', avatar: avatar2 },
  { name: '王珂', mutual: '2 位共同好友', avatar: avatar3 },
  { name: '周琳', mutual: '12 位共同好友', avatar: avatar4 },
  { name: '宋佳', mutual: '6 位共同好友', avatar: avatar5 }
]

export const heatTimes = ['12时', '19时', '15时', '12时', '8时', '4时']
export const heatDays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六']

export const heatMap = [
  [2, 2, 1, 2, 1, 1, 3],
  [1, 3, 3, 1, 3, 2, 3],
  [3, 1, 2, 1, 3, 2, 3],
  [2, 0, 3, 3, 3, 3, 1],
  [3, 3, 3, 2, 3, 3, 1],
  [2, 2, 2, 2, 2, 1, 0]
]
