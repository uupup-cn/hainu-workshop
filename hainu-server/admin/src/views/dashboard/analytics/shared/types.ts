export interface StatCard {
  title: string
  value: string
  change: string
  changeIcon: string
  changeClass: string
  icon: string
  iconBg: string
}

export interface DeviceStat {
  name: string
  value: number
}

export interface BrowserRow {
  name: string
  company: string
  value: string
  emoji: string
  color: string
}

export interface CountryRow {
  id: number
  flag: string
  country: string
  change: string
  changeClass: string
  visitors: string
}

export interface CampaignRow {
  name: string
  role: string
  sales: string
  goal: string
  goalClass: string
  status: string
  statusClass: string
  avatar: string
}

export interface EngagementRow {
  id: number
  user: string
  sessions: number
  flag: string
  country: string
  views: number
  bounce: string
  conversion: string
  avatar: string
}

export interface ReferralSegment {
  width: string
  color: string
}

export interface ReferralRow {
  url: string
  value: string
  color: string
}
