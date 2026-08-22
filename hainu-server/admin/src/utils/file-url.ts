function getApiAssetOrigin() {
  const apiBase = import.meta.env.DEV
    ? import.meta.env.VITE_API_PROXY_URL || import.meta.env.VITE_API_URL
    : import.meta.env.VITE_API_URL

  if (!apiBase || apiBase === '/') {
    return window.location.origin
  }

  try {
    return new URL(apiBase, window.location.origin).origin
  } catch {
    return window.location.origin
  }
}

export function normalizeFileAccessUrl(url?: string | null) {
  const rawUrl = url?.trim()
  if (!rawUrl) return ''
  if (/^(blob|data):/i.test(rawUrl)) return rawUrl

  const apiAssetOrigin = getApiAssetOrigin()
  let parsedUrl: URL

  try {
    parsedUrl = new URL(rawUrl, window.location.origin)
  } catch {
    return rawUrl
  }

  const assetPath = `${parsedUrl.pathname}${parsedUrl.search}${parsedUrl.hash}`
  const isProxyAssetPath =
    parsedUrl.pathname.startsWith('/api/') || parsedUrl.pathname.startsWith('/uploads/')

  if (import.meta.env.DEV) {
    const shouldUseDevProxy =
      parsedUrl.hostname === 'local' ||
      (isProxyAssetPath &&
        (parsedUrl.origin === apiAssetOrigin || parsedUrl.origin === window.location.origin))

    return shouldUseDevProxy ? assetPath : rawUrl
  }

  if (parsedUrl.hostname === 'local') {
    return new URL(assetPath, apiAssetOrigin).toString()
  }

  return rawUrl
}
