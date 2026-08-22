export interface StatCard {
  title: string
  value: string
  change: string
  changeIcon: string
  changeClass: string
  icon: string
  iconClass: string
}

export interface CountryRow {
  id: number
  flag: string
  country: string
  engagement: string
  followers: string
  change: string
  changeClass: string
}

export interface PostRow {
  name: string
  date: string
  platform: string
  views: string
  iconClass: string
  icon: string
  platformClass: string
}

export interface PerformanceRow {
  id: number
  platform: string
  posts: number
  likes: string
  shares: string
  comments: string
  impressions: string
  followers: string
  ctr: string
  ctrBg: string
  ctrColor: string
  icon: string
  iconClass: string
}

export interface ActivityItem {
  platform: string
  content: string
  time: string
  icon: string
  iconClass: string
  tagClass: string
}

export interface AgeMetric {
  label: string
  value: number
  count: number
}

export interface SuggestionRow {
  name: string
  mutual: string
  avatar: string
}
