export const artColors = {
  primary: 'var(--art-primary)',
  secondary: 'var(--art-secondary)',
  success: 'var(--art-success)',
  warning: 'var(--art-warning)',
  danger: 'var(--art-danger)',
  info: 'var(--art-info)'
}

export const artSoftClasses = {
  primary:
    'bg-[color-mix(in_oklab,var(--art-primary)_14%,var(--default-box-color))] text-[var(--art-primary)]',
  secondary:
    'bg-[color-mix(in_oklab,var(--art-secondary)_14%,var(--default-box-color))] text-[var(--art-secondary)]',
  success:
    'bg-[color-mix(in_oklab,var(--art-success)_14%,var(--default-box-color))] text-[var(--art-success)]',
  warning:
    'bg-[color-mix(in_oklab,var(--art-warning)_14%,var(--default-box-color))] text-[var(--art-warning)]',
  danger:
    'bg-[color-mix(in_oklab,var(--art-danger)_14%,var(--default-box-color))] text-[var(--art-danger)]',
  info: 'bg-[color-mix(in_oklab,var(--art-info)_14%,var(--default-box-color))] text-[var(--art-info)]'
}

export const tableHeaderCellStyle = {
  background: 'transparent',
  color: 'var(--art-gray-800)',
  fontWeight: 600
}

export const tableCellStyle = {
  borderColor: 'var(--default-border)'
}

export const buildSparkPath = (points: number[]) => {
  const width = 86
  const height = 28
  const max = Math.max(...points)
  const min = Math.min(...points)
  const step = width / (points.length - 1)

  return points
    .map((point, index) => {
      const x = index * step
      const ratio = max === min ? 0.5 : (point - min) / (max - min)
      const y = height - ratio * (height - 4) - 2
      return `${index === 0 ? 'M' : 'L'}${x.toFixed(2)} ${y.toFixed(2)}`
    })
    .join(' ')
}
