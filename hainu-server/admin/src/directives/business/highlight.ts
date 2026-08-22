/**
 * v-highlight 代码高亮指令
 *
 * 为代码块提供语法高亮和一键复制功能。
 * 基于 highlight.js 实现，支持多种编程语言的语法高亮。
 *
 * ## 主要功能
 *
 * - 语法高亮 - 使用 highlight.js 自动识别并高亮代码
 * - 一键复制 - 提供复制按钮，点击即可复制代码内容
 * - 性能优化 - 批量处理代码块，避免阻塞渲染
 * - 动态监听 - 使用 MutationObserver 监听新增代码块
 * - 防重复处理 - 自动标记已处理的代码块，避免重复处理
 *
 * ## 使用示例
 *
 * ```vue
 * <template>
 *   <!-- 基础用法 -->
 *   <div v-highlight v-html="codeContent"></div>
 *
 *   <!-- 配合 Markdown 渲染 -->
 *   <div v-highlight>
 *     <pre><code class="language-javascript">
 *       const hello = 'world';
 *       console.log(hello);
 *     </code></pre>
 *   </div>
 * </template>
 * ```
 *
 * ## 性能优化
 *
 * - 批量处理：每次处理 10 个代码块，避免长时间阻塞
 * - 延迟处理：使用 requestAnimationFrame 分批处理
 * - 重试机制：自动重试处理失败的代码块
 * - 智能监听：只在有新代码块时才触发处理
 *
 * @module directives/highlight
 * @author Ci-Yuu-Plus Team
 */

import { App, Directive } from 'vue'

export type HighlightDirective = Directive<HTMLElement>

let highlightJsLoader: Promise<(typeof import('highlight.js'))['default']> | null = null

async function loadHighlightJs() {
  if (!highlightJsLoader) {
    highlightJsLoader = import('@/utils/ui/highlight').then(({ getHighlightJs }) =>
      getHighlightJs()
    )
  }

  return highlightJsLoader
}

// 高亮代码
async function highlightCode(block: HTMLElement) {
  const hljs = await loadHighlightJs()
  hljs.highlightElement(block)
}

function isSyntaxHighlighted(block: HTMLElement) {
  const hasHighlightToken = !!block.querySelector('[class^="hljs-"], [class*=" hljs-"]')

  return block.classList.contains('hljs') || hasHighlightToken
}

function resolveCodeLanguage(block: HTMLElement) {
  const classLanguage = Array.from(block.classList)
    .find((className) => className.startsWith('language-'))
    ?.replace('language-', '')

  if (classLanguage) {
    return classLanguage
  }

  const hljsLanguage = Array.from(block.classList)
    .find((className) => className.startsWith('hljs-'))
    ?.replace('hljs-', '')

  if (hljsLanguage) {
    return hljsLanguage
  }

  const resultLanguage =
    (block as HTMLElement & { result?: { language?: string } }).result?.language || ''

  return resultLanguage
}

// 添加复制按钮
function addCopyButton(block: HTMLElement) {
  const preElement = block.parentElement
  if (!preElement || preElement.querySelector('.copy-button')) {
    return
  }

  const defaultIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M7 6V3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-3v3c0 .552-.45 1-1.007 1H4.007A1 1 0 0 1 3 21l.003-14c0-.552.45-1 1.006-1zM5.002 8L5 20h10V8zM9 6h8v10h2V4H9z"/></svg>'
  const successIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><path fill="currentColor" d="M9 16.17 4.83 12 3.41 13.41 9 19 21 7l-1.41-1.41z"/></svg>'

  const copyButton = document.createElement('i')
  copyButton.className = 'copy-button'
  copyButton.innerHTML = defaultIcon
  let resetTimer: number | null = null

  copyButton.onclick = () => {
    navigator.clipboard
      .writeText(block.innerText)
      .then(() => {
        copyButton.innerHTML = successIcon
        copyButton.setAttribute('aria-label', '复制成功')

        if (resetTimer !== null) {
          window.clearTimeout(resetTimer)
        }

        resetTimer = window.setTimeout(() => {
          copyButton.innerHTML = defaultIcon
          copyButton.setAttribute('aria-label', '复制代码')
          resetTimer = null
        }, 3000)
      })
      .catch(() => {})
  }

  copyButton.setAttribute('aria-label', '复制代码')

  const language = resolveCodeLanguage(block)
  preElement.setAttribute('data-language', language || 'code')
  preElement.appendChild(copyButton)
}

// 检查代码块是否已经被处理过
function isBlockProcessed(block: HTMLElement): boolean {
  return (
    block.hasAttribute('data-highlighted') ||
    block.hasAttribute('data-highlight-pending') ||
    !!block.parentElement?.querySelector('.copy-button')
  )
}

// 标记代码块为已处理
function markBlockAsProcessed(block: HTMLElement) {
  block.removeAttribute('data-highlight-pending')
  block.setAttribute('data-highlighted', 'true')
}

function markBlockAsPending(block: HTMLElement) {
  block.setAttribute('data-highlight-pending', 'true')
}

function clearBlockPending(block: HTMLElement) {
  block.removeAttribute('data-highlight-pending')
}

// 处理单个代码块
async function processBlock(block: HTMLElement) {
  if (isBlockProcessed(block)) {
    return
  }

  markBlockAsPending(block)

  try {
    if (!isSyntaxHighlighted(block)) {
      await highlightCode(block)
    }
    addCopyButton(block)
    markBlockAsProcessed(block)
  } catch (error) {
    clearBlockPending(block)
    console.warn('处理代码块时出错:', error)
  }
}

// 查找并处理所有代码块
function processAllCodeBlocks(el: HTMLElement) {
  const blocks = Array.from(el.querySelectorAll<HTMLElement>('pre code'))
  const unprocessedBlocks = blocks.filter((block) => !isBlockProcessed(block))

  if (unprocessedBlocks.length === 0) {
    return
  }

  if (unprocessedBlocks.length <= 10) {
    // 如果代码块数量少于等于10，直接处理所有代码块
    unprocessedBlocks.forEach((block) => {
      void processBlock(block)
    })
  } else {
    // 定义每次处理的代码块数
    const batchSize = 10
    let currentIndex = 0

    const processBatch = () => {
      const batch = unprocessedBlocks.slice(currentIndex, currentIndex + batchSize)

      batch.forEach((block) => {
        void processBlock(block)
      })

      // 更新索引并继续处理下一批
      currentIndex += batchSize
      if (currentIndex < unprocessedBlocks.length) {
        // 使用 requestAnimationFrame 确保下一帧再处理
        requestAnimationFrame(processBatch)
      }
    }

    // 开始处理第一批代码块
    processBatch()
  }
}

// 重试处理函数
function retryProcessing(el: HTMLElement, maxRetries: number = 3, delay: number = 200) {
  let retryCount = 0

  const tryProcess = () => {
    processAllCodeBlocks(el)

    // 检查是否还有未处理的代码块
    const remainingBlocks = Array.from(el.querySelectorAll<HTMLElement>('pre code')).filter(
      (block) => !isBlockProcessed(block)
    )

    if (remainingBlocks.length > 0 && retryCount < maxRetries) {
      retryCount++
      setTimeout(tryProcess, delay * retryCount) // 递增延迟
    }
  }

  tryProcess()
}

// 代码高亮、复制按钮
const highlightDirective: HighlightDirective = {
  mounted(el: HTMLElement) {
    // 立即尝试处理一次
    processAllCodeBlocks(el)

    // 延迟处理，确保 v-html 内容已经渲染
    setTimeout(() => {
      retryProcessing(el)
    }, 100)

    // 使用 MutationObserver 监听 DOM 变化
    const observer = new MutationObserver((mutations) => {
      let hasNewCodeBlocks = false

      mutations.forEach((mutation) => {
        if (mutation.type === 'childList') {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement
              // 检查新添加的节点是否包含代码块
              if (element.tagName === 'PRE' || element.querySelector('pre code')) {
                hasNewCodeBlocks = true
              }
            }
          })
        }
      })

      if (hasNewCodeBlocks) {
        // 延迟处理新添加的代码块
        setTimeout(() => {
          processAllCodeBlocks(el)
        }, 50)
      }
    })

    // 开始观察
    observer.observe(el, {
      childList: true,
      subtree: true
    })

    // 将 observer 存储到元素上，以便在 unmounted 时清理
    ;(el as any)._highlightObserver = observer
  },

  updated(el: HTMLElement) {
    // 当组件更新时，重新处理代码块
    setTimeout(() => {
      processAllCodeBlocks(el)
    }, 50)
  },

  unmounted(el: HTMLElement) {
    // 清理 MutationObserver
    const observer = (el as any)._highlightObserver
    if (observer) {
      observer.disconnect()
      delete (el as any)._highlightObserver
    }
  }
}

export function setupHighlightDirective(app: App) {
  app.directive('highlight', highlightDirective)
}
