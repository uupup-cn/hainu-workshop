export interface StatCard {
  title: string
  value: string
  change: string
  changeLabel: string
  changeClass: string
  icon: string
  iconBg: string
  iconColor: string
}

export interface PerformanceSeries {
  name: string
  data: number[]
}

export interface RecentActivity {
  name: string
  tag: string
  tagClass: string
  content: string
  time: string
  avatar: string
}

export interface CandidateSummaryItem {
  label: string
  value: string
  change: string
  changeClass: string
  icon: string
  iconBg: string
  iconColor: string
}

export interface RecentlyAddedJob {
  company: string
  logo: string
  logoBg: string
  logoColor: string
  role: string
  location: string
  type: string
  typeClass: string
}

export interface AcquisitionProgressItem {
  label: string
  value: string
  percent: string
  color: string
  badgeBg: string
}

export interface RecentJob {
  title: string
  company: string
  type: string
  tag: string
  tagClass: string
  avatarText: string
  avatarBg: string
  avatarColor: string
}

export interface PostingRow {
  id: string
  jobTitle: string
  department: string
  company: string
  location: string
  applications: number
  status: string
  statusClass: string
  publisher: string
  date: string
  avatar: string
}
