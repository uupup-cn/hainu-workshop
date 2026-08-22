import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import type {
  ApplicantRow,
  AttendanceLegendItem,
  CandidateChartSeries,
  EmployeeRow,
  EmployeeStatusItem,
  EmployeeStatusSegment,
  StatCard,
  TodayAttendanceRow
} from './types'

export const statCards: StatCard[] = [
  {
    title: '员工总数',
    value: '12,860',
    change: '2.84%',
    changeIcon: 'ri-arrow-up-line',
    changeClass: 'bg-success/12 text-success',
    icon: 'ri-briefcase-4-line',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    title: '新增员工',
    value: '1,126',
    change: '4.13%',
    changeIcon: 'ri-arrow-down-line',
    changeClass: 'bg-danger/12 text-danger',
    icon: 'ri-user-add-line',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    title: '求职申请数',
    value: '2,418',
    change: '3.56%',
    changeIcon: 'ri-arrow-up-line',
    changeClass: 'bg-success/12 text-success',
    icon: 'ri-suitcase-line',
    iconClass: 'bg-success/12 text-success'
  },
  {
    title: '离职员工',
    value: '206',
    change: '1.05%',
    changeIcon: 'ri-arrow-up-line',
    changeClass: 'bg-warning/12 text-warning',
    icon: 'ri-user-unfollow-line',
    iconClass: 'bg-warning/12 text-warning'
  }
]

export const employeeStatusSegments: EmployeeStatusSegment[] = [
  { label: '远程办公', percent: '28%', color: 'var(--art-primary)' },
  { label: '试用期', percent: '22%', color: 'var(--art-success)' },
  { label: '正式员工', percent: '34%', color: 'var(--art-warning)' },
  { label: '外包/合同', percent: '16%', color: 'var(--art-danger)' }
]

export const employeeStatusItems: EmployeeStatusItem[] = [
  { label: '远程办公', value: '3,624', color: 'var(--art-primary)' },
  { label: '试用员工', value: '2,885', color: 'var(--art-success)' },
  { label: '正式员工', value: '4,372', color: 'var(--art-warning)' },
  { label: '外包/合同', value: '1,979', color: 'var(--art-danger)' }
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

export const candidateChartData: CandidateChartSeries[] = [
  {
    name: '录用人数',
    data: [14, 23, 20, 25, 10, 13, 14, 16, 13, 23, 20, 25]
  },
  {
    name: '收到反馈',
    data: [20, 30, 25, 40, 25, 30, 20, 35, 20, 30, 25, 30]
  }
]

export const departmentLabels = [
  '技术研发',
  '市场部',
  '运营部',
  '财务部',
  '销售部',
  '客服部',
  '人力资源部'
]

export const departmentValues = [520, 430, 360, 480, 510, 490, 445]

export const employeeRows: EmployeeRow[] = [
  {
    name: '林雨',
    role: '市场经理',
    department: '市场部',
    date: '2024-05-20',
    tagClass: 'bg-primary/12 text-primary',
    avatar: avatar1
  },
  {
    name: '周远',
    role: '后端开发工程师',
    department: '技术研发',
    date: '2022-11-30',
    tagClass: 'bg-warning/12 text-warning',
    avatar: avatar2
  },
  {
    name: '陈静',
    role: '项目经理',
    department: '运营部',
    date: '2021-07-08',
    tagClass: 'bg-secondary/12 text-secondary',
    avatar: avatar3
  },
  {
    name: '王哲',
    role: '数据分析师',
    department: '技术研发',
    date: '2020-10-10',
    tagClass: 'bg-info/12 text-info',
    avatar: avatar4
  },
  {
    name: '赵欣',
    role: '财务分析师',
    department: '财务部',
    date: '2022-02-28',
    tagClass: 'bg-success/12 text-success',
    avatar: avatar5
  },
  {
    name: '刘洋',
    role: '销售主管',
    department: '销售部',
    date: '2022-08-05',
    tagClass: 'bg-success/12 text-success',
    avatar: avatar2
  }
]

export const todayAttendanceRows: TodayAttendanceRow[] = [
  {
    name: '张伟',
    role: '经理',
    time: '8:48',
    status: '全天出勤',
    statusClass: 'bg-primary/12 text-primary',
    avatar: avatar3
  },
  {
    name: '李娜',
    role: '开发工程师',
    time: '9:20',
    status: '迟到',
    statusClass: 'bg-danger/12 text-danger',
    avatar: avatar4
  },
  {
    name: '王强',
    role: '人事专员',
    time: '8:10',
    status: '全天出勤',
    statusClass: 'bg-primary/12 text-primary',
    avatar: avatar2
  },
  {
    name: '陈晨',
    role: '分析师',
    time: '7:20',
    status: '早退',
    statusClass: 'bg-warning/12 text-warning',
    avatar: avatar1
  },
  {
    name: '周敏',
    role: '设计师',
    time: '10:30',
    status: '全天出勤',
    statusClass: 'bg-primary/12 text-primary',
    avatar: avatar5
  },
  {
    name: '赵磊',
    role: '产品经理',
    time: '8:35',
    status: '全天出勤',
    statusClass: 'bg-primary/12 text-primary',
    avatar: avatar3
  },
  {
    name: '林晓',
    role: '测试工程师',
    time: '9:05',
    status: '迟到',
    statusClass: 'bg-danger/12 text-danger',
    avatar: avatar4
  }
]

export const applicantRows: ApplicantRow[] = [
  {
    id: '#SPT-011',
    name: '许悦',
    position: '系统管理员',
    date: '2023-11-24',
    email: 'xuyue@company.com',
    experience: '2年以上',
    status: '新申请',
    statusClass: 'bg-primary/12 text-primary',
    avatar: avatar1
  },
  {
    id: '#SPT-012',
    name: '吴昊',
    position: '数据分析',
    date: '2023-12-13',
    email: 'wuhao@company.com',
    experience: '3年以上',
    status: '已面试',
    statusClass: 'bg-success/12 text-success',
    avatar: avatar2
  },
  {
    id: '#SPT-013',
    name: '宋婧',
    position: 'UX/UI 设计师',
    date: '2023-11-10',
    email: 'songjing@company.com',
    experience: '应届',
    status: '已录用',
    statusClass: 'bg-info/12 text-info',
    avatar: avatar3
  },
  {
    id: '#SPT-014',
    name: '叶琳',
    position: '数据库管理',
    date: '2023-12-16',
    email: 'yelin@company.com',
    experience: '1年',
    status: '待复审',
    statusClass: 'bg-secondary/12 text-secondary',
    avatar: avatar4
  },
  {
    id: '#SPT-015',
    name: '唐凯',
    position: 'AI 与机器学习',
    date: '2023-12-22',
    email: 'tangkai@company.com',
    experience: '5年以上',
    status: '已淘汰',
    statusClass: 'bg-danger/12 text-danger',
    avatar: avatar5
  }
]

export const buildAttendanceLegend = (chartColors: string[]): AttendanceLegendItem[] => [
  { label: '正常出勤', value: '1,754', color: chartColors[0] },
  { label: '迟到', value: '878', color: chartColors[1] },
  { label: '请假', value: '634', color: chartColors[2] },
  { label: '缺勤', value: '470', color: chartColors[4] }
]
