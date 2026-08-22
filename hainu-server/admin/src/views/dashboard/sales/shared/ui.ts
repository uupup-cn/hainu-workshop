import { useChartOps } from '@/hooks/core/useChart'
import { getCssVar } from '@/utils/ui'

export const themeColors = {
  primary: getCssVar('--art-primary'),
  secondary: getCssVar('--art-secondary'),
  success: getCssVar('--art-success'),
  warning: getCssVar('--art-warning'),
  danger: getCssVar('--art-danger'),
  info: getCssVar('--art-info')
}

export const useSalesUiConfig = () => {
  const overviewColors = useChartOps().colors.slice(0, 3)

  return {
    overviewColors,
    tableHeaderCellStyle: {
      background: 'transparent',
      color: 'var(--art-gray-800)',
      fontWeight: 600
    },
    tableCellStyle: {
      borderColor: 'var(--default-border)'
    }
  }
}

export const getInvoiceStatusClass = (status: string) => {
  if (status === '已支付') return 'bg-success/12 text-success'
  if (status === '待处理') return 'bg-warning/12 text-warning'
  if (status === '已逾期' || status === '失败') return 'bg-danger/12 text-danger'
  return 'bg-g-100 text-g-700'
}
