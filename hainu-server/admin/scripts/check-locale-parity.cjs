/**
 * Locale parity check (zh vs en)
 *
 * Compares the set of keys (dotted paths) between zh.json and en.json
 * and prints any keys that exist in only one of the two files plus
 * any empty values, to be used during M5 i18n acceptance.
 */
const path = require('path')
const a = require(path.resolve(__dirname, '../src/locales/langs/zh.json'))
const b = require(path.resolve(__dirname, '../src/locales/langs/en.json'))

/** Walk a nested JSON object, collecting dotted key paths. */
function collectKeys(obj, prefix, out) {
  out = out || []
  prefix = prefix || ''
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      collectKeys(obj[k], prefix ? prefix + '.' + k : k, out)
    }
  } else {
    out.push({ path: prefix, value: obj })
  }
  return out
}

const ka = collectKeys(a).sort((x, y) => x.path.localeCompare(y.path))
const kb = collectKeys(b).sort((x, y) => x.path.localeCompare(y.path))
const sa = new Set(ka.map((e) => e.path))
const sb = new Set(kb.map((e) => e.path))

const onlyA = ka.filter((e) => !sb.has(e.path))
const onlyB = kb.filter((e) => !sa.has(e.path))

console.log('total zh keys:', ka.length)
console.log('total en keys:', kb.length)
console.log('zh-only:', onlyA.length)
onlyA.forEach((e) => console.log(' ' + e.path))
console.log('en-only:', onlyB.length)
onlyB.forEach((e) => console.log(' ' + e.path))

const emptyZh = ka.filter((e) => e.value === undefined || e.value === null || e.value === '')
const emptyEn = kb.filter((e) => e.value === undefined || e.value === null || e.value === '')
console.log('empty zh values:', emptyZh.length)
emptyZh.forEach((e) => console.log(' ' + e.path))
console.log('empty en values:', emptyEn.length)
emptyEn.forEach((e) => console.log(' ' + e.path))

if (onlyA.length || onlyB.length || emptyZh.length || emptyEn.length) {
  process.exit(1)
}
