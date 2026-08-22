import { useChartOps } from '@/hooks/core/useChart'

export const useHrmUiConfig = () => {
  const chartColors = useChartOps().colors

  return {
    chartColors,
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
