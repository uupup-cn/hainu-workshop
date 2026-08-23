/**
 * HTML 白名单过滤 — 存储前清洗富文本，防止 XSS
 * 无外部依赖，基于正则的标签/属性白名单
 */

// 允许的 HTML 标签
const ALLOWED_TAGS = new Set([
  'p', 'br', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'strong', 'b', 'em', 'i', 'u', 's', 'sub', 'sup', 'del', 'ins', 'mark',
  'ul', 'ol', 'li',
  'a', 'img', 'blockquote', 'pre', 'code',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'hr', 'div', 'span',
  'video', 'source',
]);

// 允许的属性（全局）
const ALLOWED_ATTRS = new Set([
  'href', 'src', 'alt', 'title', 'width', 'height', 'style', 'class',
  'controls', 'colspan', 'rowspan', 'target', 'rel', 'type',
]);

// 需要移除的标签（连同内容）
const DANGEROUS_TAGS_CONTENT = /<(script|style|iframe|embed|object|noscript|template|math|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi;

// 需要移除的标签（仅标签，保留内容）
const DANGEROUS_TAGS_ONLY = /<\/?(script|style|iframe|embed|object|noscript|template|math|svg|link|meta|base|form|input|button|textarea|select|option)\b[^>]*>/gi;

// 移除 on* 事件属性
const ON_ATTR = /\son\w+\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi;

// 移除 javascript: 协议
const JS_PROTOCOL = /(href|src)\s*=\s*("javascript:[^"]*"|'javascript:[^']*')/gi;

// 移除 data: 协议（防止 data:text/html 等，但保留 data:image）
const DATA_PROTOCOL = /(href)\s*=\s*("data:(?!image\/)[^"]*"|'data:(?!image\/)[^']*')/gi;

/**
 * 过滤 HTML，移除危险标签和属性
 */
export function sanitizeHtml(html: string): string {
  if (!html || typeof html !== 'string') return '';
  let result = html;
  // 1. 移除危险标签及其内容
  result = result.replace(DANGEROUS_TAGS_CONTENT, '');
  // 2. 移除危险标签（保留内容）
  result = result.replace(DANGEROUS_TAGS_ONLY, '');
  // 3. 移除 on* 事件属性
  result = result.replace(ON_ATTR, '');
  // 4. 移除 javascript: 协议
  result = result.replace(JS_PROTOCOL, '');
  // 5. 移除危险 data: 协议
  result = result.replace(DATA_PROTOCOL, '');
  // 6. 过滤不在白名单中的标签（移除标签但保留内容）
  result = result.replace(/<\/?(\w+)\b[^>]*>/g, (match, tag) => {
    return ALLOWED_TAGS.has(tag.toLowerCase()) ? match : '';
  });
  // 7. 过滤不在白名单中的属性
  result = result.replace(/<(\w+)\b([^>]*)>/g, (match, tag, attrs) => {
    const cleanedAttrs = attrs.replace(/\s(\w[\w-]*)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/g, (m: string, attr: string) => {
      return ALLOWED_ATTRS.has(attr.toLowerCase()) ? m : '';
    });
    return '<' + tag + cleanedAttrs + '>';
  });
  return result;
}
