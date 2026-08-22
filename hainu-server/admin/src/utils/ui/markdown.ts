import { getHighlightJs } from './highlight'

function escapeHtml(value: string) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}

function applyInlineMarkdown(value: string) {
  const escaped = escapeHtml(value)

  return escaped
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>')
    .replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)/g,
      '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>'
    )
}

function isCodeIntroLine(line: string) {
  return /^(示例)?代码(?:如下)?[：:]?$/.test(line.trim())
}

function isIndentedCodeLine(line: string) {
  return /^(?:\t| {4,})\S/.test(line)
}

function isMarkdownHeadingLine(line: string) {
  return /^#{1,6}\s+\S/.test(line)
}

function isMarkdownThematicBreakLine(line: string) {
  return /^([-*_])(?:\s*\1){2,}\s*$/.test(line)
}

function isLikelyCodeLine(line: string) {
  const trimmed = line.trim()
  if (!trimmed) return false
  if (isMarkdownHeadingLine(trimmed) || isMarkdownThematicBreakLine(trimmed)) {
    return false
  }

  if (
    /^(const|let|var|function|class|def|import|from|return|if|else|elif|for|while|try|except|finally|print|console\.log|async|await|public|private|protected|interface|type)\b/.test(
      trimmed
    )
  ) {
    return true
  }

  if (
    /[{}()[\];]|=>|:=|==|===|!=|!==|<=|>=|\+\+|--|<\/?[a-z][^>]*>|^<!DOCTYPE\b|^\s*#include\b|^\s*@\w+/.test(
      trimmed
    )
  ) {
    return true
  }

  if (/^[\w$.-]+\s*[:=]\s*.+$/.test(trimmed)) {
    return true
  }

  if (/^[a-zA-Z_][\w.]*\([^)]*\)\s*$/.test(trimmed)) {
    return true
  }

  if (/^\s*(\/\/|#(?!#)|--(?!-))\s*\S+/.test(trimmed)) {
    return true
  }

  return false
}

function inferCodeLanguage(code: string) {
  const trimmed = code.trim()
  if (!trimmed) return ''

  if (
    /<template[\s>]|<script[\s>]|<style[\s>]|export\s+default|defineProps\(|defineEmits\(/i.test(
      trimmed
    )
  ) {
    return 'vue'
  }

  if (/^<!DOCTYPE\b|<html[\s>]|<body[\s>]|<head[\s>]|<\/[a-z-]+>/im.test(trimmed)) {
    return 'html'
  }

  if (/^(import|from)\s+\w+|def\s+\w+\(|print\(|except\b|elif\b/im.test(trimmed)) {
    return 'python'
  }

  if (
    /(?:const|let|var)\s+\w+|console\.log\(|function\s+\w+\(|=>|import\s.+from\s|export\s/im.test(
      trimmed
    )
  ) {
    return 'typescript'
  }

  if (/^\s*[{[][\s\S]*[}\]]\s*$/m.test(trimmed) && /"\s*:/.test(trimmed)) {
    return 'json'
  }

  if (/^SELECT\b|^INSERT\b|^UPDATE\b|^DELETE\b|^CREATE\b|^ALTER\b/im.test(trimmed)) {
    return 'sql'
  }

  if (/^#!/.test(trimmed) || /^(npm|pnpm|yarn|git|curl|chmod|ls|cd)\b/im.test(trimmed)) {
    return 'bash'
  }

  return ''
}

function collectHeuristicCodeBlock(lines: string[], startIndex: number) {
  const codeLines: string[] = []
  let index = startIndex
  let blankCount = 0

  while (index < lines.length) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!trimmed) {
      const nextLine = lines[index + 1]
      if (!codeLines.length || !nextLine || !isLikelyCodeLine(nextLine) || blankCount > 0) {
        break
      }
      codeLines.push('')
      blankCount++
      index++
      continue
    }

    if (!isLikelyCodeLine(line) && !isIndentedCodeLine(line)) {
      break
    }

    codeLines.push(line)
    blankCount = 0
    index++
  }

  return {
    codeLines,
    nextIndex: index
  }
}

function renderCodeBlock(code: string, language = '') {
  const hljs = getHighlightJs()
  const normalizedLanguage = language || inferCodeLanguage(code)
  let resolvedLanguage = normalizedLanguage
  let highlightedHtml = escapeHtml(code)

  try {
    if (normalizedLanguage && hljs.getLanguage(normalizedLanguage)) {
      highlightedHtml = hljs.highlight(code, {
        language: normalizedLanguage,
        ignoreIllegals: true
      }).value
    } else {
      const autoResult = hljs.highlightAuto(code)
      highlightedHtml = autoResult.value
      resolvedLanguage = autoResult.language || normalizedLanguage
    }
  } catch {
    highlightedHtml = escapeHtml(code)
    resolvedLanguage = normalizedLanguage
  }

  const languageClass = resolvedLanguage ? ` language-${escapeHtml(resolvedLanguage)}` : ''
  const languageData = escapeHtml(resolvedLanguage || 'code')

  return `<pre data-language="${languageData}"><code class="hljs${languageClass}">${highlightedHtml}</code></pre>`
}

function isMarkdownTableDividerLine(line: string) {
  return /^\|?(?:\s*:?-{3,}:?\s*\|)+(?:\s*:?-{3,}:?\s*)\|?$/.test(line.trim())
}

function splitMarkdownTableRow(line: string) {
  return line
    .trim()
    .replace(/^\||\|$/g, '')
    .split('|')
    .map((cell) => cell.trim())
}

function isMarkdownTableRowLine(line: string) {
  if (!line.includes('|')) return false

  const cells = splitMarkdownTableRow(line)
  return cells.length >= 2 && cells.some((cell) => cell.length > 0)
}

function renderTable(headerLine: string, bodyLines: string[]) {
  const headers = splitMarkdownTableRow(headerLine)
  const rows = bodyLines.map((line) => splitMarkdownTableRow(line))

  const thead = `<thead><tr>${headers
    .map((cell) => `<th>${applyInlineMarkdown(cell)}</th>`)
    .join('')}</tr></thead>`
  const tbody = rows.length
    ? `<tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${applyInlineMarkdown(cell)}</td>`).join('')}</tr>`).join('')}</tbody>`
    : ''

  return `<div class="art-chat-table-wrap"><table>${thead}${tbody}</table></div>`
}

function unwrapMarkdownFence(markdown: string) {
  const wrappedMarkdownMatch = markdown.match(/^```(?:md|markdown)\s*\n([\s\S]*?)\n```\s*$/i)

  return wrappedMarkdownMatch?.[1] || markdown
}

export function renderMarkdownToHtml(markdown: string) {
  const normalized = unwrapMarkdownFence(markdown.replace(/\r\n/g, '\n').trim())
  if (!normalized) {
    return ''
  }

  const lines = normalized.split('\n')
  const html: string[] = []
  const paragraphLines: string[] = []
  let inCodeBlock = false
  let codeLanguage = ''
  let codeLines: string[] = []
  let listType: 'ul' | 'ol' | null = null

  const flushParagraph = () => {
    if (!paragraphLines.length) return
    html.push(`<p>${paragraphLines.map((line) => applyInlineMarkdown(line)).join('<br />')}</p>`)
    paragraphLines.length = 0
  }

  const closeList = () => {
    if (!listType) return
    html.push(`</${listType}>`)
    listType = null
  }

  const closeCodeBlock = () => {
    if (!inCodeBlock) return
    html.push(renderCodeBlock(codeLines.join('\n'), codeLanguage))
    inCodeBlock = false
    codeLanguage = ''
    codeLines = []
  }

  for (let index = 0; index < lines.length; index++) {
    const line = lines[index]
    const trimmed = line.trim()

    if (!inCodeBlock) {
      const codeMatch = line.match(/^```([\w-]+)?\s*$/)
      if (codeMatch) {
        flushParagraph()
        closeList()
        inCodeBlock = true
        codeLanguage = codeMatch[1] || ''
        continue
      }
    }

    if (inCodeBlock && /^```\s*$/.test(line)) {
      flushParagraph()
      closeList()
      closeCodeBlock()
      continue
    }

    if (inCodeBlock) {
      codeLines.push(line)
      continue
    }

    if (!trimmed) {
      flushParagraph()
      closeList()
      continue
    }

    if (isMarkdownThematicBreakLine(trimmed)) {
      flushParagraph()
      closeList()
      html.push('<hr />')
      continue
    }

    if (isIndentedCodeLine(line)) {
      flushParagraph()
      closeList()

      const indentedCodeLines = [line.replace(/^(?:\t| {4})/, '')]
      let nextIndex = index + 1

      while (nextIndex < lines.length) {
        const nextLine = lines[nextIndex]
        if (!nextLine.trim()) {
          indentedCodeLines.push('')
          nextIndex++
          continue
        }

        if (!isIndentedCodeLine(nextLine)) {
          break
        }

        indentedCodeLines.push(nextLine.replace(/^(?:\t| {4})/, ''))
        nextIndex++
      }

      const indentedCode = indentedCodeLines.join('\n')
      html.push(renderCodeBlock(indentedCode))
      index = nextIndex - 1
      continue
    }

    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/)
    if (headingMatch) {
      flushParagraph()
      closeList()
      const level = headingMatch[1].length
      html.push(`<h${level}>${applyInlineMarkdown(headingMatch[2])}</h${level}>`)
      continue
    }

    const orderedMatch = line.match(/^\d+\.\s+(.+)$/)
    if (orderedMatch) {
      flushParagraph()
      if (listType !== 'ol') {
        closeList()
        listType = 'ol'
        html.push('<ol>')
      }
      html.push(`<li>${applyInlineMarkdown(orderedMatch[1])}</li>`)
      continue
    }

    const unorderedMatch = line.match(/^[-*]\s+(.+)$/)
    if (unorderedMatch) {
      flushParagraph()
      if (listType !== 'ul') {
        closeList()
        listType = 'ul'
        html.push('<ul>')
      }
      html.push(`<li>${applyInlineMarkdown(unorderedMatch[1])}</li>`)
      continue
    }

    closeList()

    const blockquoteMatch = line.match(/^>\s?(.*)$/)
    if (blockquoteMatch) {
      flushParagraph()
      html.push(`<blockquote><p>${applyInlineMarkdown(blockquoteMatch[1])}</p></blockquote>`)
      continue
    }

    if (isMarkdownTableRowLine(line) && isMarkdownTableDividerLine(lines[index + 1] || '')) {
      flushParagraph()
      closeList()

      const bodyLines: string[] = []
      let nextIndex = index + 2

      while (nextIndex < lines.length && isMarkdownTableRowLine(lines[nextIndex])) {
        bodyLines.push(lines[nextIndex])
        nextIndex++
      }

      html.push(renderTable(line, bodyLines))
      index = nextIndex - 1
      continue
    }

    if (isCodeIntroLine(line)) {
      flushParagraph()
      html.push(`<p>${applyInlineMarkdown(line)}</p>`)

      const { codeLines: inferredCodeLines, nextIndex } = collectHeuristicCodeBlock(
        lines,
        index + 1
      )
      if (inferredCodeLines.length > 0) {
        const inferredCode = inferredCodeLines.join('\n')
        html.push(renderCodeBlock(inferredCode))
        index = nextIndex - 1
      }
      continue
    }

    const { codeLines: inferredCodeLines, nextIndex } = collectHeuristicCodeBlock(lines, index)
    if (inferredCodeLines.length >= 2) {
      flushParagraph()
      const inferredCode = inferredCodeLines.join('\n')
      html.push(renderCodeBlock(inferredCode))
      index = nextIndex - 1
      continue
    }

    paragraphLines.push(line)
  }

  flushParagraph()
  closeList()
  closeCodeBlock()

  return html.join('')
}
