export interface StatCard {
  title: string
  value: string
  change: string
  changeClass: string
  changeIcon: string
  icon: string
  iconClass: string
  accent: string
}

export interface OverviewTab {
  key: 'day' | 'week' | 'month' | 'year'
  label: string
}

export interface OverviewChartData {
  xAxis: string[]
  orders: number[]
  sales: number[]
  revenue: number[]
}

export interface DeviceLegendItem {
  name: string
  color: string
}

export interface TopProduct {
  name: string
  price: string
  stock: string
  stockClass: string
  sales: string
  image: string
}

export interface ActivityItem {
  id: number
  date: string
  time: string
  color: string
  content: string
}

export interface TopCustomer {
  initials: string
  name: string
  email: string
  amount: string
  amountClass: string
  badgeClass: string
}

export interface TopChannel {
  logoIcon: string
  logoClass: string
  name: string
  desc: string
  change: string
  changeClass: string
  value: string
  barWidth: string
  barColor: string
}

export interface InvoiceRow {
  id: number
  orderNo: string
  customer: string
  email: string
  date: string
  time: string
  productImages: string[]
  price: string
  status: string
  avatar: string
}

export interface InvoiceFilterOption {
  label: string
  value: string
}

export interface TransactionItem {
  orderNo: string
  items: number
  price: string
  date: string
  status: string
  avatars: string[]
  extra?: number
}
