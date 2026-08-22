export const artColors = {
  primary: 'var(--art-primary)',
  secondary: 'var(--art-secondary)',
  success: 'var(--art-success)',
  warning: 'var(--art-warning)',
  danger: 'var(--art-danger)',
  info: 'var(--art-info)'
}

export const tableHeaderCellStyle = {
  background: 'transparent',
  color: 'var(--art-gray-800)',
  fontWeight: 600
}

export const tableCellStyle = {
  borderColor: 'var(--default-border)'
}

export const getHeatColor = (value: number) => {
  if (value >= 3) return 'color-mix(in srgb, var(--art-primary) 92%, white)'
  if (value === 2) return 'color-mix(in srgb, var(--art-primary) 76%, white)'
  if (value === 1) return 'color-mix(in srgb, var(--art-primary) 58%, white)'
  return 'color-mix(in srgb, var(--art-primary) 28%, white)'
}
