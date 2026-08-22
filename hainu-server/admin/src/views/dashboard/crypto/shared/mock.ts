import avatar1 from '@/assets/images/avatar/avatar1.webp'
import avatar2 from '@/assets/images/avatar/avatar2.webp'
import avatar3 from '@/assets/images/avatar/avatar3.webp'
import avatar4 from '@/assets/images/avatar/avatar4.webp'
import avatar5 from '@/assets/images/avatar/avatar5.webp'
import avatar6 from '@/assets/images/avatar/avatar6.webp'
import type {
  AssetOverviewItem,
  CoinStatItem,
  KLineDataItem,
  MarketCard,
  PaymentMethod,
  PortfolioRow,
  RecentActivityItem,
  TransactionHistoryItem
} from './types'
import { artColors, artSoftClasses } from './ui'

export const marketCards: MarketCard[] = [
  {
    symbol: 'BTC',
    value: '21.235',
    change: '4.21%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    logoText: '₿',
    logoBg: 'var(--art-primary)',
    logoColor: '#fff',
    sparkColor: artColors.primary,
    sparkline: [14, 14, 13, 13, 16, 15, 12, 12, 16, 18, 15, 13, 12, 13]
  },
  {
    symbol: 'ETH',
    value: '164.75',
    change: '2.21%',
    changeIcon: 'ri:arrow-down-line',
    changeClass: 'text-[var(--art-danger)]',
    logoText: 'Ξ',
    logoBg: 'var(--art-secondary)',
    logoColor: '#fff',
    sparkColor: artColors.secondary,
    sparkline: [16, 14, 13, 14, 13, 13, 15, 17, 15, 13, 13, 15, 17, 14]
  },
  {
    symbol: 'USDT',
    value: '31,421',
    change: '12.43%',
    changeIcon: 'ri:arrow-up-line',
    changeClass: 'text-[var(--art-success)]',
    logoText: '₮',
    logoBg: 'var(--art-success)',
    logoColor: '#fff',
    sparkColor: artColors.success,
    sparkline: [17, 15, 14, 14, 13, 15, 19, 14, 13, 13, 13, 14, 13, 12]
  },
  {
    symbol: 'BNB',
    value: '4,224',
    change: '15.54%',
    changeIcon: 'ri:arrow-down-line',
    changeClass: 'text-[var(--art-danger)]',
    logoText: '◆',
    logoBg: 'var(--art-warning)',
    logoColor: '#fff',
    sparkColor: artColors.warning,
    sparkline: [14, 14, 17, 15, 12, 12, 15, 18, 17, 15, 15, 14, 14, 13]
  }
]

export const kLineData: KLineDataItem[] = [
  { time: '23:00', open: 6632, close: 6636, high: 6650, low: 6624 },
  { time: '00:00', open: 6630, close: 6634, high: 6644, low: 6621 },
  { time: '01:00', open: 6631, close: 6638, high: 6651, low: 6625 },
  { time: '02:00', open: 6638, close: 6624, high: 6640, low: 6621 },
  { time: '03:00', open: 6625, close: 6627, high: 6633, low: 6584 },
  { time: '04:00', open: 6605, close: 6607, high: 6613, low: 6601 },
  { time: '05:00', open: 6607, close: 6610, high: 6616, low: 6603 },
  { time: '06:00', open: 6610, close: 6613, high: 6619, low: 6607 },
  { time: '07:00', open: 6612, close: 6614, high: 6624, low: 6608 },
  { time: '08:00', open: 6623, close: 6615, high: 6627, low: 6610 },
  { time: '09:00', open: 6619, close: 6611, high: 6622, low: 6610 },
  { time: '10:00', open: 6612, close: 6623, high: 6627, low: 6610 },
  { time: '11:00', open: 6621, close: 6618, high: 6625, low: 6616 },
  { time: '12:00', open: 6618, close: 6615, high: 6620, low: 6609 },
  { time: '13:00', open: 6615, close: 6620, high: 6623, low: 6612 },
  { time: '14:00', open: 6620, close: 6625, high: 6634, low: 6617 },
  { time: '15:00', open: 6624, close: 6618, high: 6628, low: 6598 },
  { time: '16:00', open: 6619, close: 6588, high: 6620, low: 6570 },
  { time: '17:00', open: 6588, close: 6594, high: 6600, low: 6572 },
  { time: '18:00', open: 6593, close: 6587, high: 6599, low: 6568 },
  { time: '19:00', open: 6588, close: 6579, high: 6594, low: 6567 },
  { time: '20:00', open: 6579, close: 6577, high: 6581, low: 6570 },
  { time: '21:00', open: 6578, close: 6589, high: 6597, low: 6572 },
  { time: '22:00', open: 6589, close: 6596, high: 6600, low: 6586 },
  { time: '23:00', open: 6597, close: 6595, high: 6601, low: 6590 },
  { time: '00:00', open: 6596, close: 6602, high: 6608, low: 6594 },
  { time: '01:00', open: 6601, close: 6600, high: 6604, low: 6591 },
  { time: '02:00', open: 6600, close: 6591, high: 6602, low: 6586 },
  { time: '03:00', open: 6589, close: 6594, high: 6601, low: 6583 },
  { time: '04:00', open: 6590, close: 6600, high: 6607, low: 6585 },
  { time: '05:00', open: 6600, close: 6604, high: 6607, low: 6592 },
  { time: '06:00', open: 6604, close: 6598, high: 6605, low: 6586 },
  { time: '07:00', open: 6589, close: 6594, high: 6600, low: 6584 },
  { time: '08:00', open: 6590, close: 6588, high: 6598, low: 6582 },
  { time: '09:00', open: 6589, close: 6596, high: 6601, low: 6586 },
  { time: '10:00', open: 6598, close: 6601, high: 6607, low: 6592 },
  { time: '11:00', open: 6600, close: 6594, high: 6606, low: 6589 },
  { time: '12:00', open: 6595, close: 6603, high: 6605, low: 6593 },
  { time: '13:00', open: 6603, close: 6604, high: 6605, low: 6599 },
  { time: '14:00', open: 6604, close: 6603, high: 6605, low: 6600 },
  { time: '15:00', open: 6603, close: 6604, high: 6606, low: 6599 },
  { time: '16:00', open: 6604, close: 6606, high: 6608, low: 6601 }
]

export const transactionHistory: TransactionHistoryItem[] = [
  {
    type: '充值',
    time: '2025-02-10 14:30',
    amount: '0.25 BTC',
    status: '已完成',
    statusClass: artSoftClasses.success,
    iconText: '₿',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    type: '提现',
    time: '2025-02-11 10:00',
    amount: '500 ETH',
    status: '处理中',
    statusClass: artSoftClasses.warning,
    iconText: 'Ξ',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    type: '转账',
    time: '2025-02-12 16:45',
    amount: '2,000 XRP',
    status: '已完成',
    statusClass: artSoftClasses.success,
    icon: 'ri:exchange-funds-line',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    type: '充值',
    time: '2025-02-13 09:30',
    amount: '1.5 BTC',
    status: '失败',
    statusClass: artSoftClasses.danger,
    iconText: '₿',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    type: '提现',
    time: '2025-02-14 13:20',
    amount: '1500 USDT',
    status: '已完成',
    statusClass: artSoftClasses.success,
    iconText: '₮',
    iconClass: 'bg-success/12 text-success'
  },
  {
    type: '充值',
    time: '2025-02-14 17:05',
    amount: '5.0 BTC',
    status: '处理中',
    statusClass: artSoftClasses.warning,
    iconText: '₿',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    type: '转账',
    time: '2025-02-15 08:40',
    amount: '780 SOL',
    status: '已完成',
    statusClass: artSoftClasses.success,
    icon: 'ri:send-plane-line',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    type: '提现',
    time: '2025-02-15 12:18',
    amount: '320 ADA',
    status: '处理中',
    statusClass: artSoftClasses.warning,
    iconText: 'A',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    type: '充值',
    time: '2025-02-16 09:56',
    amount: '12.8 ETH',
    status: '已完成',
    statusClass: artSoftClasses.success,
    iconText: 'Ξ',
    iconClass: 'bg-secondary/12 text-secondary'
  }
]

export const recentActivities: RecentActivityItem[] = [
  {
    name: '林雨',
    asset: '比特币 - (0.12)',
    date: '2025-02-10',
    type: '转出 - 04:24PM',
    typeClass: 'text-[var(--art-danger)]',
    avatar: avatar1
  },
  {
    name: '李娜',
    asset: '以太坊 - (9.20)',
    date: '2025-02-11',
    type: '转入 - 11:57PM',
    typeClass: 'text-[var(--art-success)]',
    avatar: avatar2
  },
  {
    name: '王凯',
    asset: '达世币 - (830.9)',
    date: '2025-02-12',
    type: '转入 - 02:28AM',
    typeClass: 'text-[var(--art-success)]',
    avatar: avatar3
  },
  {
    name: '陈晨',
    asset: '欧元 - (11.23)',
    date: '2025-02-13',
    type: '处理中 - 10:08AM',
    typeClass: 'text-[var(--art-info)]',
    avatar: avatar4
  },
  {
    name: '周洋',
    asset: '比特币 - (0.56)',
    date: '2025-02-12',
    type: '转出 - 02:34PM',
    typeClass: 'text-[var(--art-danger)]',
    avatar: avatar5
  },
  {
    name: '刘森',
    asset: '莱特币 - (125.65)',
    date: '2025-02-14',
    type: '转入 - 06:05PM',
    typeClass: 'text-[var(--art-success)]',
    avatar: avatar6
  },
  {
    name: '许诺',
    asset: '索拉纳 - (42.80)',
    date: '2025-02-15',
    type: '转入 - 09:16AM',
    typeClass: 'text-[var(--art-success)]',
    avatar: avatar1
  },
  {
    name: '何宇',
    asset: '瑞波币 - (530.00)',
    date: '2025-02-15',
    type: '处理中 - 01:42PM',
    typeClass: 'text-[var(--art-info)]',
    avatar: avatar2
  },
  {
    name: '唐雅',
    asset: '比特币 - (1.08)',
    date: '2025-02-16',
    type: '转出 - 08:30PM',
    typeClass: 'text-[var(--art-danger)]',
    avatar: avatar5
  }
]

export const coinStats: CoinStatItem[] = [
  { label: '比特币美元价值', value: '$98,420.00' },
  {
    label: '价格变化',
    value: '+1,112.00（1.14%） 今日',
    valueClass: 'text-[var(--art-success)]',
    tip: '上涨',
    tipClass: 'text-[var(--art-primary)]'
  },
  { label: '交易额', value: '$35.28 billion' },
  { label: '市场排名', value: '#1', tip: '3 年', tipClass: 'text-[var(--art-secondary)]' },
  { label: '本周最高', value: '$98,760.24', valueClass: 'text-[var(--art-success)]' },
  { label: '本周最低', value: '$95,880.00', valueClass: 'text-[var(--art-danger)]' },
  { label: '市场占有率', value: '69%' },
  { label: '历史最高', value: '$109,358.01', valueClass: 'text-[var(--art-info)]' },
  { label: '24H 波动率', value: '3.46%', valueClass: 'text-[var(--art-warning)]' },
  { label: '流通供应量', value: '19.72M BTC' },
  { label: '市值估算', value: '$1.94 trillion', valueClass: 'text-[var(--art-primary)]' }
]

export const portfolioRows: PortfolioRow[] = [
  {
    name: '比特币 (BTC)',
    balance: '2.5',
    price: '$30,100.60',
    total: '$75,251.50',
    change: '+1.4%',
    changeBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    changeColor: artColors.success,
    profit: '+$6,120.00',
    volume: '$6.8 Billion',
    rank: '#1',
    iconText: '₿',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    name: '以太坊 (ETH)',
    balance: '15',
    price: '$1,895.30',
    total: '$28,429.50',
    change: '+1.1%',
    changeBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    changeColor: artColors.success,
    profit: '+$2,220.00',
    volume: '$2.3 Billion',
    rank: '#2',
    iconText: 'Ξ',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    name: '狗狗币 (DOGE)',
    balance: '100,000',
    price: '$0.078',
    total: '$7,800.00',
    change: '+4.9%',
    changeBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    changeColor: artColors.success,
    profit: '+$360.00',
    volume: '$1.9 Billion',
    rank: '#9',
    iconText: 'Ð',
    iconClass: 'bg-warning/12 text-warning'
  },
  {
    name: '泰达币 (USDT)',
    balance: '10,000',
    price: '$1.00',
    total: '$10,000.00',
    change: '0.0%',
    changeBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    changeColor: artColors.success,
    profit: '$0.00',
    volume: '$25.4 Billion',
    rank: '#3',
    iconText: '₮',
    iconClass: 'bg-success/12 text-success'
  },
  {
    name: '瑞波币 (XRP)',
    balance: '5,000',
    price: '$0.78',
    total: '$3,900.00',
    change: '+2.7%',
    changeBg: 'color-mix(in oklab, var(--art-success) 14%, var(--default-box-color))',
    changeColor: artColors.success,
    profit: '+$540.00',
    volume: '$1.6 Billion',
    rank: '#6',
    icon: 'ri:exchange-dollar-line',
    iconClass: 'bg-secondary/12 text-secondary'
  },
  {
    name: '艾达币 (ADA)',
    balance: '10,000',
    price: '$0.37',
    total: '$3,700.00',
    change: '-0.6%',
    changeBg: 'color-mix(in oklab, var(--art-danger) 14%, var(--default-box-color))',
    changeColor: artColors.danger,
    profit: '-$80.00',
    volume: '$360 Million',
    rank: '#8',
    icon: 'ri:apps-2-ai-line',
    iconClass: 'bg-primary/12 text-primary'
  }
]

export const tradeTabs = ['买入', '卖出']

export const paymentMethods: PaymentMethod[] = [
  { value: 'card', label: '信用卡 / 借记卡' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'wallet', label: '钱包' }
]

export const assetRingData = [
  { name: '现货余额', value: 54 },
  { name: '交易账户', value: 46 }
]

export const assetOverviewRows: AssetOverviewItem[] = [
  {
    label: '资金账户',
    value: '$56,180 USD',
    change: '▼ 0.95%',
    changeClass: 'text-[var(--art-success)]',
    icon: 'ri:secure-payment-line',
    iconClass: 'bg-primary/12 text-primary'
  },
  {
    label: '交易账户',
    value: '$24,260 USD',
    change: '▼ 0.88%',
    changeClass: 'text-[var(--art-danger)]',
    icon: 'ri:exchange-box-line',
    iconClass: 'bg-secondary/12 text-secondary'
  }
]
