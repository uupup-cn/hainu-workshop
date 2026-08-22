import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import avatar6 from '@/assets/images/avatar/avatar6.webp'
import avatar7 from '@/assets/images/avatar/avatar7.webp'
import type {
  ChartDatum,
  DealStat,
  DealTableRow,
  LeadOverview,
  LeadSource,
  StatCard,
  TaskItem,
  TopDeal
} from './types'

export const statCards: StatCard[] = [
  {
    title: '总客户数',
    value: '34,280',
    change: '3.18%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:group-line',
    iconBg: 'var(--art-primary)'
  },
  {
    title: '总成交数',
    value: '5,924',
    change: '2.84%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:briefcase-4-line',
    iconBg: 'var(--art-secondary)'
  },
  {
    title: '转化率',
    value: '14.08%',
    change: '3.22%',
    changeIcon: 'ri:arrow-down-line',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:pulse-line',
    iconBg: 'var(--art-success)'
  },
  {
    title: '总收入',
    value: '￥58,430',
    change: '1.16%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:money-dollar-circle-line',
    iconBg: 'var(--art-warning)'
  }
]

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

export const revenueValues = [160, 260, 340, 580, 360, 210, 430, 240, 630, 420, 320, 450]

export const tasks: TaskItem[] = [
  {
    title: '准备新客户提案',
    code: '编号：#CRM-107',
    owner: '张伟',
    priority: '高',
    date: '2025-02-16',
    done: true,
    badgeClass: 'bg-danger/12 text-danger'
  },
  {
    title: '第一季度策略团队会议',
    code: '编号：#CRM-108',
    owner: '李娜',
    priority: '中',
    date: '2025-02-18',
    done: false,
    badgeClass: 'bg-warning/12 text-warning'
  },
  {
    title: '更新客户管理数据',
    code: '编号：#CRM-109',
    owner: '王强',
    priority: '低',
    date: '2025-02-20',
    done: true,
    badgeClass: 'bg-success/12 text-success'
  },
  {
    title: '开展市场调研',
    code: '编号：#CRM-110',
    owner: '陈晨',
    priority: '中',
    date: '2025-02-22',
    done: false,
    badgeClass: 'bg-warning/12 text-warning'
  },
  {
    title: '审核合同条款...',
    code: '编号：#CRM-111',
    owner: '刘洋',
    priority: '高',
    date: '2025-02-25',
    done: false,
    badgeClass: 'bg-danger/12 text-danger'
  },
  {
    title: '跟进投资人',
    code: '编号：#CRM-112',
    owner: '周敏',
    priority: '高',
    date: '2025-02-28',
    done: true,
    badgeClass: 'bg-danger/12 text-danger'
  }
]

export const leadSources: LeadSource[] = [
  {
    name: '自然搜索',
    value: '1,860',
    change: '↑ 0.72%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-primary)'
  },
  {
    name: '付费搜索',
    value: '1,298',
    change: '↓ 2.12%',
    changeClass: 'font-semibold text-[var(--art-danger)]',
    color: 'var(--art-secondary)'
  },
  {
    name: '直接访问',
    value: '912',
    change: '↑ 1.88%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-success)'
  },
  {
    name: '社交媒体',
    value: '326',
    change: '↑ 1.46%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-warning)'
  },
  {
    name: '引荐来源',
    value: '912',
    change: '↑ 1.46%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-info)'
  },
  {
    name: '其他',
    value: '326',
    change: '↑ 1.46%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-warning)'
  },
  {
    name: '视频平台',
    value: '438',
    change: '↑ 0.92%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-secondary)'
  },
  {
    name: '电子邮件',
    value: '382',
    change: '↑ 0.56%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-info)'
  },
  {
    name: '展会活动',
    value: '314',
    change: '↓ 0.18%',
    changeClass: 'font-semibold text-[var(--art-danger)]',
    color: 'var(--art-danger)'
  },
  {
    name: '线下推荐',
    value: '548',
    change: '↑ 1.28%',
    changeClass: 'font-semibold text-[var(--art-success)]',
    color: 'var(--art-success)'
  }
]

export const leadSourceChartData: ChartDatum[] = [
  { name: '自然搜索', value: 14 },
  { name: '付费搜索', value: 23 },
  { name: '直接访问', value: 21 },
  { name: '社交媒体', value: 17 },
  { name: '引荐来源', value: 15 },
  { name: '其他', value: 10 }
]

export const topDeals: TopDeal[] = [
  { name: '张伟', email: 'zhangwei@company.com', amount: '￥2,980', avatar: avatar1 },
  { name: '李娜', email: 'lina@company.com', amount: '￥4,360', avatar: avatar2 },
  { name: '王强', email: 'wangqiang@company.com', amount: '￥6,520', avatar: avatar3 },
  { name: '陈晨', email: 'chenchen@company.com', amount: '￥3,960', avatar: avatar4 },
  { name: '刘洋', email: 'liuyang@company.com', amount: '￥2,780', avatar: avatar5 },
  { name: '周敏', email: 'zhoumin@company.com', amount: '￥2,780', avatar: avatar6 }
]

export const dealStats: DealStat[] = [
  { label: '新成交', width: '28%' },
  { label: '合格成交', width: '31%' },
  { label: '续约成交', width: '34%' },
  { label: '引荐成交', width: '39%' },
  { label: '已赢单', width: '76%' },
  { label: '已输单', width: '84%' },
  { label: '谈判中', width: '96%' }
]

export const dealStatsLabels = dealStats.map((item) => item.label)
export const dealStatsValues = dealStats.map((item) => Number(item.width.replace('%', '')))

export const leadsOverview: LeadOverview[] = [
  {
    name: '张晨',
    company: '启明科技',
    status: '新建',
    source: '网站表单',
    avatar: avatar1,
    statusClass: 'bg-primary/12 text-primary'
  },
  {
    name: '李静',
    company: '贝塔有限公司',
    status: '已联系',
    source: '推荐',
    avatar: avatar7,
    statusClass: 'bg-info/12 text-info'
  },
  {
    name: '王磊',
    company: '伽马科技',
    status: '已发提案',
    source: '领英',
    avatar: avatar3,
    statusClass: 'bg-warning/12 text-warning'
  },
  {
    name: '陈雪',
    company: '德尔塔实业',
    status: '谈判中',
    source: '陌生电话',
    avatar: avatar2,
    statusClass: 'bg-secondary/12 text-secondary'
  },
  {
    name: '刘涛',
    company: '伊普西龙公司',
    status: '已赢单',
    source: '邮件营销',
    avatar: avatar4,
    statusClass: 'bg-success/12 text-success'
  },
  {
    name: '赵颖',
    company: '星河互动',
    status: '跟进中',
    source: '活动转化',
    avatar: avatar5,
    statusClass: 'bg-primary/12 text-primary'
  }
]

export const dealTable: DealTableRow[] = [
  {
    id: '#SPK-1001',
    name: '企业套餐',
    client: '启明科技',
    clientShort: '启',
    clientColor: 'var(--art-success)',
    amount: '￥50,000',
    status: '进行中',
    statusClass: 'bg-primary/12 text-primary',
    date: '2025-02-25',
    rep: '张伟',
    priority: '高'
  },
  {
    id: '#SPK-1002',
    name: '年度合同',
    client: '贝塔有限公司',
    clientShort: '贝',
    clientColor: 'var(--art-secondary)',
    amount: '￥75,000',
    status: '已赢单',
    statusClass: 'bg-success/12 text-success',
    date: '2025-02-15',
    rep: '李娜',
    priority: '高'
  },
  {
    id: '#SPK-1003',
    name: '软件升级',
    client: '伽马科技',
    clientShort: '伽',
    clientColor: 'var(--art-success)',
    amount: '￥30,000',
    status: '已输单',
    statusClass: 'bg-danger/12 text-danger',
    date: '2025-01-30',
    rep: '王强',
    priority: '中'
  },
  {
    id: '#SPK-1004',
    name: '高端服务',
    client: '德尔塔有限公司',
    clientShort: '德',
    clientColor: 'var(--art-info)',
    amount: '￥60,000',
    status: '进行中',
    statusClass: 'bg-primary/12 text-primary',
    date: '2025-03-05',
    rep: '陈晨',
    priority: '高'
  },
  {
    id: '#SPK-1005',
    name: '订阅方案',
    client: '伊普西龙公司',
    clientShort: '伊',
    clientColor: 'var(--art-warning)',
    amount: '￥40,000',
    status: '已赢单',
    statusClass: 'bg-success/12 text-success',
    date: '2025-02-10',
    rep: '刘洋',
    priority: '中'
  },
  {
    id: '#SPK-1006',
    name: '定制集成',
    client: '泽塔解决方案',
    clientShort: '泽',
    clientColor: 'var(--art-secondary)',
    amount: '￥55,000',
    status: '已发提案',
    statusClass: 'bg-warning/12 text-warning',
    date: '2025-02-20',
    rep: '周敏',
    priority: '高'
  }
]
