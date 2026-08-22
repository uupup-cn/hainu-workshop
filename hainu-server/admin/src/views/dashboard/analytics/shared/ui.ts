export const tableHeaderCellStyle = {
  background: 'transparent',
  color: 'var(--art-gray-800)',
  fontWeight: 600
}

export const tableCellStyle = {
  borderColor: 'var(--default-border)'
}

export const getHeatColor = (value: number) => {
  if (value >= 4) return 'color-mix(in srgb, var(--art-success) 66%, var(--default-box-color))'
  if (value === 3) return 'color-mix(in srgb, var(--art-success) 52%, var(--default-box-color))'
  if (value === 2) return 'color-mix(in srgb, var(--art-success) 38%, var(--default-box-color))'
  if (value === 1) return 'color-mix(in srgb, var(--art-success) 24%, var(--default-box-color))'
  return 'color-mix(in srgb, var(--art-success) 16%, var(--default-box-color))'
}
