import hljs from 'highlight.js/lib/core'
import bash from 'highlight.js/lib/languages/bash'
import css from 'highlight.js/lib/languages/css'
import graphql from 'highlight.js/lib/languages/graphql'
import javascript from 'highlight.js/lib/languages/javascript'
import json from 'highlight.js/lib/languages/json'
import markdown from 'highlight.js/lib/languages/markdown'
import scss from 'highlight.js/lib/languages/scss'
import sql from 'highlight.js/lib/languages/sql'
import typescript from 'highlight.js/lib/languages/typescript'
import xml from 'highlight.js/lib/languages/xml'

const languageRegistrations = {
  bash,
  css,
  graphql,
  javascript,
  json,
  markdown,
  scss,
  shell: bash,
  sql,
  ts: typescript,
  typescript,
  vue: xml,
  xml
}

let registered = false

function ensureHighlightLanguages() {
  if (registered) return

  Object.entries(languageRegistrations).forEach(([name, language]) => {
    hljs.registerLanguage(name, language)
  })
  registered = true
}

export function getHighlightJs() {
  ensureHighlightLanguages()
  return hljs
}

export function highlightCode(value: string, language = '') {
  const highlighter = getHighlightJs()

  if (language && highlighter.getLanguage(language)) {
    return highlighter.highlight(value, {
      language,
      ignoreIllegals: true
    }).value
  }

  return highlighter.highlightAuto(value).value
}
