import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import type {
  AcquisitionProgressItem,
  CandidateSummaryItem,
  PerformanceSeries,
  PostingRow,
  RecentActivity,
  RecentJob,
  RecentlyAddedJob,
  StatCard
} from './types'
import { artColors, artSoftClasses } from './ui'

export const statCards: StatCard[] = [
  {
    title: '招聘企业数',
    value: '1,384',
    change: '↑ 2.14%',
    changeLabel: '较上月',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:briefcase-4-line',
    iconBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))',
    iconColor: artColors.primary
  },
  {
    title: '候选人数',
    value: '4,218',
    change: '↑ 0.76%',
    changeLabel: '较上月',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:team-line',
    iconBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    iconColor: artColors.secondary
  },
  {
    title: '覆盖城市',
    value: '24',
    change: '↑ 1.20%',
    changeLabel: '较上月',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:map-pin-line',
    iconBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    iconColor: artColors.warning
  },
  {
    title: '收到简历',
    value: '14,064',
    change: '↑ 9.32%',
    changeLabel: '较上月',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:file-list-3-line',
    iconBg: 'color-mix(in oklab, var(--art-info) 14%, var(--default-box-color))',
    iconColor: artColors.info
  },
  {
    title: '活跃职位',
    value: '15,248',
    change: '↑ 3.18%',
    changeLabel: '较上月',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:notification-3-line',
    iconBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    iconColor: artColors.success
  }
]

export const performanceMonths = [
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

export const performanceData: PerformanceSeries[] = [
  {
    name: '本周',
    data: [42, 48, 39, 55, 31, 45, 32, 47, 52, 36, 43, 37]
  },
  {
    name: '本月',
    data: [48, 60, 45, 90, 28, 47, 26, 45, 60, 29, 46, 31]
  }
]

export const recentActivities: RecentActivity[] = [
  {
    name: '张晨',
    tag: '已通过',
    tagClass: artSoftClasses.primary,
    content: '已完成高级前端工程师岗位的代码评审与录用建议。',
    time: '2026-02-19 10:30',
    avatar: avatar1
  },
  {
    name: '李娜',
    tag: '已完成',
    tagClass: artSoftClasses.success,
    content: '处理技术岗面试安排并同步本周招聘进度日报。',
    time: '2026-02-19 11:15',
    avatar: avatar2
  },
  {
    name: '王凯',
    tag: '已审核',
    tagClass: artSoftClasses.primary,
    content: '已确认新零售项目的岗位需求与招聘预算范围。',
    time: '2026-02-19 13:00',
    avatar: avatar3
  },
  {
    name: '赵敏',
    tag: '待跟进',
    tagClass: artSoftClasses.warning,
    content: '已发送产品经理岗位的面试安排，等待候选人确认。',
    time: '2026-02-19 14:20',
    avatar: avatar4
  },
  {
    name: '吴昊',
    tag: '已通过',
    tagClass: artSoftClasses.primary,
    content: '完成前端负责人岗位的终面评估并提交录用意见。',
    time: '2026-02-19 15:05',
    avatar: avatar5
  },
  {
    name: '邓玲',
    tag: '已完成',
    tagClass: artSoftClasses.success,
    content: '同步销售顾问岗位的薪酬方案与入职时间窗口。',
    time: '2026-02-19 15:42',
    avatar: avatar1
  },
  {
    name: '何静',
    tag: '已审核',
    tagClass: artSoftClasses.primary,
    content: '已确认数据分析岗位的 JD 与面试官排期。',
    time: '2026-02-19 16:18',
    avatar: avatar2
  }
]

export const candidateOverviewData = [
  { name: '女性', value: 13240 },
  { name: '男性', value: 16620 }
]

export const candidateSummary: CandidateSummaryItem[] = [
  {
    label: '男性',
    value: '16,620',
    change: '↑ 3.92%',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:men-line',
    iconBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    iconColor: artColors.warning
  },
  {
    label: '女性',
    value: '13,240',
    change: '↑ 1.08%',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:women-line',
    iconBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))',
    iconColor: artColors.primary
  }
]

export const recentlyAddedJobs: RecentlyAddedJob[] = [
  {
    company: 'Nucleus OP',
    logo: 'N',
    logoBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    logoColor: artColors.success,
    role: '产品工程师',
    location: '海得拉巴',
    type: '全职',
    typeClass: artSoftClasses.primary
  },
  {
    company: 'Data SC',
    logo: 'D',
    logoBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    logoColor: artColors.secondary,
    role: '品牌专员',
    location: '班加罗尔',
    type: '实习',
    typeClass: artSoftClasses.secondary
  },
  {
    company: 'Delooit XP',
    logo: 'DX',
    logoBg: 'color-mix(in oklab, var(--art-info) 14%, var(--default-box-color))',
    logoColor: artColors.info,
    role: 'UI 开发工程师',
    location: '钦奈',
    type: '全职',
    typeClass: artSoftClasses.primary
  },
  {
    company: 'Tech IP',
    logo: 'T',
    logoBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))',
    logoColor: artColors.primary,
    role: '手动测试工程师',
    location: '海得拉巴',
    type: '兼职',
    typeClass: artSoftClasses.success
  },
  {
    company: 'LogoTech',
    logo: 'L',
    logoBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    logoColor: artColors.warning,
    role: 'AWS 开发工程师',
    location: '喀拉拉',
    type: '自由职业',
    typeClass: artSoftClasses.warning
  },
  {
    company: 'ByteNest',
    logo: 'B',
    logoBg: 'color-mix(in oklab, var(--art-info) 14%, var(--default-box-color))',
    logoColor: artColors.info,
    role: '数据分析师',
    location: '纽约',
    type: '全职',
    typeClass: artSoftClasses.primary
  },
  {
    company: 'CloudMint',
    logo: 'C',
    logoBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    logoColor: artColors.success,
    role: '后端开发工程师',
    location: '西雅图',
    type: '全职',
    typeClass: artSoftClasses.success
  },
  {
    company: 'NovaFlow',
    logo: 'Nf',
    logoBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))',
    logoColor: artColors.primary,
    role: '产品设计师',
    location: '远程',
    type: '兼职',
    typeClass: artSoftClasses.secondary
  }
]

export const acquisitionProgress: AcquisitionProgressItem[] = [
  {
    label: '总投递数',
    value: '1,982',
    percent: '52%',
    color: artColors.primary,
    badgeBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))'
  },
  {
    label: '已录用',
    value: '214',
    percent: '14%',
    color: artColors.secondary,
    badgeBg: 'color-mix(in oklab, var(--art-secondary) 12%, var(--default-box-color))'
  },
  {
    label: '入围候选',
    value: '262',
    percent: '16%',
    color: artColors.success,
    badgeBg: 'color-mix(in oklab, var(--art-success) 12%, var(--default-box-color))'
  },
  {
    label: '已拒绝',
    value: '395',
    percent: '10%',
    color: artColors.warning,
    badgeBg: 'color-mix(in oklab, var(--art-warning) 12%, var(--default-box-color))'
  },
  {
    label: '已冻结',
    value: '79',
    percent: '8%',
    color: artColors.danger,
    badgeBg: 'color-mix(in oklab, var(--art-danger) 12%, var(--default-box-color))'
  }
]

export const recentJobs: RecentJob[] = [
  {
    title: 'UI 开发工程师',
    company: '智创科技 · 12 小时前',
    type: '全职',
    tag: '应届优先',
    tagClass: artSoftClasses.success,
    avatarText: 'AC',
    avatarBg: 'color-mix(in oklab, var(--art-primary) 12%, var(--default-box-color))',
    avatarColor: artColors.primary
  },
  {
    title: 'AWS 工程师',
    company: '云程科技 · 2 小时前',
    type: '兼职',
    tag: '+1 年经验',
    tagClass: artSoftClasses.info,
    avatarText: 'SI',
    avatarBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    avatarColor: artColors.secondary
  },
  {
    title: 'React 开发工程师',
    company: '星途互联 · 6 小时前',
    type: '自由职业',
    tag: '应届优先',
    tagClass: artSoftClasses.success,
    avatarText: 'LS',
    avatarBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    avatarColor: artColors.success
  },
  {
    title: 'Angular 开发工程师',
    company: '智云软件 · 14 小时前',
    type: '全职',
    tag: '+2 年经验',
    tagClass: artSoftClasses.info,
    avatarText: 'MS',
    avatarBg: 'color-mix(in oklab, var(--art-warning) 14%, var(--default-box-color))',
    avatarColor: artColors.warning
  },
  {
    title: 'UI 测试工程师',
    company: '跃动科技 · 2 天前',
    type: '全职',
    tag: '+3 年经验',
    tagClass: artSoftClasses.info,
    avatarText: 'J',
    avatarBg: 'color-mix(in oklab, var(--art-danger) 12%, var(--default-box-color))',
    avatarColor: artColors.danger
  },
  {
    title: '数据产品经理',
    company: '启航科技 · 3 天前',
    type: '全职',
    tag: '+5 年经验',
    tagClass: artSoftClasses.warning,
    avatarText: 'AT',
    avatarBg: 'color-mix(in oklab, var(--art-info) 14%, var(--default-box-color))',
    avatarColor: artColors.info
  },
  {
    title: '测试开发工程师',
    company: '字节工坊 · 4 天前',
    type: '兼职',
    tag: '应届优先',
    tagClass: artSoftClasses.success,
    avatarText: 'BW',
    avatarBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    avatarColor: artColors.success
  },
  {
    title: '前端架构师',
    company: '新极实验室 · 5 天前',
    type: '全职',
    tag: '+8 年经验',
    tagClass: artSoftClasses.info,
    avatarText: 'NL',
    avatarBg: 'color-mix(in oklab, var(--art-secondary) 14%, var(--default-box-color))',
    avatarColor: artColors.secondary
  }
]

export const allPostingRows: PostingRow[] = [
  {
    id: '01',
    jobTitle: '软件工程师',
    department: '技术部',
    company: '星云科技',
    location: '上海',
    applications: 35,
    status: '招聘中',
    statusClass: artSoftClasses.success,
    publisher: '张晨',
    date: '2026-02-15',
    avatar: avatar1
  },
  {
    id: '02',
    jobTitle: '人力资源经理',
    department: '人力资源',
    company: '人和咨询',
    location: '北京',
    applications: 10,
    status: '已关闭',
    statusClass: artSoftClasses.danger,
    publisher: '李娜',
    date: '2026-01-30',
    avatar: avatar2
  },
  {
    id: '03',
    jobTitle: '市场专员',
    department: '市场部',
    company: '市场动力',
    location: '深圳',
    applications: 25,
    status: '招聘中',
    statusClass: artSoftClasses.success,
    publisher: '王凯',
    date: '2026-02-10',
    avatar: avatar3
  },
  {
    id: '04',
    jobTitle: '数据科学家',
    department: '技术部',
    company: '数智未来',
    location: '远程',
    applications: 12,
    status: '招聘中',
    statusClass: artSoftClasses.success,
    publisher: '陈倩',
    date: '2026-02-05',
    avatar: avatar4
  },
  {
    id: '05',
    jobTitle: '平面设计师',
    department: '设计部',
    company: '创想设计',
    location: '杭州',
    applications: 20,
    status: '已关闭',
    statusClass: artSoftClasses.danger,
    publisher: '周立',
    date: '2026-01-25',
    avatar: avatar5
  },
  {
    id: '06',
    jobTitle: '客服经理',
    department: '客户成功',
    company: '客服在线',
    location: '远程',
    applications: 8,
    status: '招聘中',
    statusClass: artSoftClasses.success,
    publisher: '刘敏',
    date: '2026-01-20',
    avatar: avatar3
  }
]
