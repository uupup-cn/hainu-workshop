/**
 * AI 助手流式请求的事件回调集合。
 * 用于把 SSE 事件拆分后，分别通知元信息、增量内容、结束状态和错误。
 */
export interface AiAssistantStreamEventHandlers {
  /** 中断流式请求的控制信号。 */
  signal?: AbortSignal
  /** 接收到 meta 事件时触发。 */
  onMeta?: (meta: Api.AiAssistant.AiAssistantStreamMeta) => void
  /** 接收到 delta 事件时触发，用于追加增量内容。 */
  onDelta?: (payload: { content: string }) => void
  /** 接收到 done 事件时触发，表示生成结束。 */
  onDone?: (payload: { content: string; finishReason?: string }) => void
  /** 接收到 error 事件时触发。 */
  onError?: (payload: { message: string }) => void
}

interface BackendErrorResponse {
  message?: string
  data?: {
    msg?: string
  }
}

// 解析 AI 接口的基础地址，兼容本地、相对路径和完整 URL 配置。
function resolveApiBaseUrl() {
  const baseUrl = import.meta.env.VITE_API_URL

  if (!baseUrl || baseUrl === '/') {
    return window.location.origin
  }

  if (/^https?:\/\//i.test(baseUrl)) {
    return String(baseUrl).replace(/\/+$/, '')
  }

  return new URL(String(baseUrl), window.location.origin).toString().replace(/\/+$/, '')
}

// 拼接接口路径，确保最终得到可直接请求的绝对地址。
function buildApiUrl(path: string) {
  return new URL(path, `${resolveApiBaseUrl()}/`).toString()
}

// 将各种 HeadersInit 统一转换成普通对象，方便 fetch 使用。
function createHeadersRecord(headers: HeadersInit | undefined) {
  if (!headers) {
    return {}
  }

  if (headers instanceof Headers) {
    const result: Record<string, string> = {}
    headers.forEach((value, key) => {
      result[key] = value
    })
    return result
  }

  if (Array.isArray(headers)) {
    return Object.fromEntries(headers)
  }

  return { ...headers }
}

// 从后端响应中提取更友好的错误信息，优先展示服务端返回内容。
async function resolveErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as BackendErrorResponse
    return data?.message?.trim() || data?.data?.msg?.trim() || `AI 请求失败（${response.status}）`
  } catch {
    return `AI 请求失败（${response.status}）`
  }
}

// 解析 SSE 事件块，拆出 event 名称和 data 内容。
function parseSseBlock(block: string) {
  const event = block
    .split('\n')
    .find((line) => line.startsWith('event:'))
    ?.slice(6)
    .trim()

  const data = block
    .split('\n')
    .filter((line) => line.startsWith('data:'))
    .map((line) => line.slice(5).trim())
    .join('\n')

  return {
    event: event || 'message',
    data
  }
}

// 发起 AI 助手的流式请求，并按 SSE 事件类型分发给不同回调。
export async function requestAiAssistantStream(input: {
  path: string
  payload: { messages: Api.AiAssistant.AiAssistantMessage[] }
  headers?: HeadersInit
  handlers?: AiAssistantStreamEventHandlers
}) {
  const response = await fetch(buildApiUrl(input.path), {
    method: 'POST',
    headers: createHeadersRecord(input.headers),
    body: JSON.stringify(input.payload),
    signal: input.handlers?.signal
  })

  if (!response.ok) {
    throw new Error(await resolveErrorMessage(response))
  }

  if (!response.body) {
    throw new Error('AI 服务未返回可读取的流。')
  }

  const reader = response.body.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const blocks = buffer.split('\n\n')
      buffer = blocks.pop() || ''

      for (const block of blocks) {
        const { event, data } = parseSseBlock(block)
        if (!data || event === 'ping') {
          continue
        }

        const payload = JSON.parse(data) as
          | Api.AiAssistant.AiAssistantStreamMeta
          | { content: string; finishReason?: string }
          | { message: string }

        if (event === 'meta') {
          input.handlers?.onMeta?.(payload as Api.AiAssistant.AiAssistantStreamMeta)
          continue
        }

        if (event === 'delta') {
          input.handlers?.onDelta?.(payload as { content: string })
          continue
        }

        if (event === 'done') {
          input.handlers?.onDone?.(payload as { content: string; finishReason?: string })
          return
        }

        if (event === 'error') {
          input.handlers?.onError?.(payload as { message: string })
          throw new Error((payload as { message: string }).message || 'AI 回复失败')
        }
      }
    }
  } finally {
    reader.releaseLock()
  }
}
