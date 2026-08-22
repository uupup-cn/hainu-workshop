export interface StatCard {
  title: string
  value: string
  change: string
  changeIcon: string
  changeClass: string
  icon: string
  iconBg: string
}

export interface TaskItem {
  title: string
  code: string
  owner: string
  priority: string
  date: string
  done: boolean
  badgeClass: string
}

export interface LeadSource {
  name: string
  value: string
  change: string
  changeClass: string
  color: string
}

export interface ChartDatum {
  name: string
  value: number
}

export interface TopDeal {
  name: string
  email: string
  amount: string
  avatar: string
}

export interface DealStat {
  label: string
  width: string
}

export interface LeadOverview {
  name: string
  company: string
  status: string
  source: string
  avatar: string
  statusClass: string
}

export interface DealTableRow {
  id: string
  name: string
  client: string
  clientShort: string
  clientColor: string
  amount: string
  status: string
  statusClass: string
  date: string
  rep: string
  priority: string
}
