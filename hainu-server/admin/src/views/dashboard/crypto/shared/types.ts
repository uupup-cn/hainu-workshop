import type { KLineDataItem } from '@/types/component/chart'

export interface MarketCard {
  symbol: string
  value: string
  change: string
  changeIcon: string
  changeClass: string
  logoText: string
  logoBg: string
  logoColor: string
  sparkColor: string
  sparkline: number[]
}

export interface TransactionHistoryItem {
  type: string
  time: string
  amount: string
  status: string
  statusClass: string
  iconText?: string
  icon?: string
  iconClass: string
}

export interface RecentActivityItem {
  name: string
  asset: string
  date: string
  type: string
  typeClass: string
  avatar: string
}

export interface CoinStatItem {
  label: string
  value: string
  valueClass?: string
  tip?: string
  tipClass?: string
}

export interface PortfolioRow {
  name: string
  balance: string
  price: string
  total: string
  change: string
  changeBg: string
  changeColor: string
  profit: string
  volume: string
  rank: string
  iconText?: string
  icon?: string
  iconClass: string
}

export interface PaymentMethod {
  value: string
  label: string
}

export interface AssetOverviewItem {
  label: string
  value: string
  change: string
  changeClass: string
  icon: string
  iconClass: string
}

export type { KLineDataItem }
