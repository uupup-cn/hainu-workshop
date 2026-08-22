/**
 * 将文件字节数格式化为适合页面展示的容量文本。
 * @param size 文件大小，单位为字节。
 * @returns 带容量单位的展示文本。
 */
export function formatFileBytes(size: number) {
  if (!size) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const index = Math.min(Math.floor(Math.log(size) / Math.log(1024)), units.length - 1)
  const value = size / 1024 ** index
  return `${value.toFixed(value >= 10 || index === 0 ? 0 : 1)} ${units[index]}`
}

/**
 * 将接口返回的时间字符串格式化为本地时间文本。
 * @param value 可被 Date 解析的时间字符串。
 * @returns 本地化后的日期时间。
 */
export function formatFileDateTime(value: string) {
  return new Date(value).toLocaleString()
}

/**
 * 根据文件分类解析对应的 Remix Icon 图标名。
 * @param kind 文件分类。
 * @returns 图标名称。
 */
export function resolveFileKindIcon(kind: Api.Files.Kind) {
  const map: Record<Api.Files.Kind, string> = {
    IMAGE: 'ri:image-2-line',
    VIDEO: 'ri:movie-line',
    AUDIO: 'ri:disc-line',
    DOCUMENT: 'ri:file-text-line',
    ARCHIVE: 'ri:file-zip-line',
    OTHER: 'ri:file-cloud-line'
  }
  return map[kind]
}

/**
 * 将文件夹树扁平化为下拉选择器可用的层级选项。
 * @param nodes 文件夹树节点。
 * @param depth 当前递归层级，用于生成缩进。
 * @returns 文件夹下拉选项列表。
 */
export function flattenFolderOptions(nodes: Api.Files.FileFolderNode[], depth = 0) {
  const result: Array<{ id: number; label: string }> = []

  nodes.forEach((item) => {
    result.push({
      id: item.id,
      label: `${'　'.repeat(depth)}${item.name}`
    })
    if (item.children?.length) {
      result.push(...flattenFolderOptions(item.children, depth + 1))
    }
  })

  return result
}
