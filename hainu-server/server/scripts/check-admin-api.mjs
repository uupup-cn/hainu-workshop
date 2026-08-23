/**
 * 管理后台 ↔ 后端端点连通性审计（静态分析）
 * 提取 admin/src/api/*.ts 的全部调用 URL 与 server 路由注册表比对
 * 运行：node scripts/check-admin-api.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const ADMIN_API_DIR = path.join(ROOT, '..', 'admin', 'src', 'api');
const SERVER_ROUTE_DIRS = [path.join(ROOT, 'src', 'routes')];

// ===== 1. 提取后端路由注册表 =====
const backendRoutes = [];
function walkRoutes(dir) {
  for (const f of fs.readdirSync(dir)) {
    const p = path.join(dir, f);
    if (fs.statSync(p).isDirectory()) { walkRoutes(p); continue; }
    if (!f.endsWith('.routes.ts')) continue;
    const src = fs.readFileSync(p, 'utf8');
    const prefixM = src.match(/new Router\(\{ prefix: '([^']*)'/);
    const prefix = prefixM ? prefixM[1] : '';
    const re = /router\.(get|post|put|patch|delete)\(\s*'([^']+)'/g;
    let m;
    while ((m = re.exec(src)) !== null) {
      let full = (prefix + m[2]).replace(/\/+/g, '/').replace(/\/+$/, '');
      // 归一化参数段
      full = full.replace(/:id|:key|:group|:type|:sessionId|:userId|:authMark|:parentId/g, ':param');
      backendRoutes.push({ method: m[1].toUpperCase(), path: full });
    }
  }
}
SERVER_ROUTE_DIRS.forEach(walkRoutes);

function matchBackend(method, url) {
  return backendRoutes.some((r) => {
    if (r.method !== method) return false;
    const a = r.path.split('/'); const b = url.split('/');
    if (a.length !== b.length) return false;
    return a.every((seg, i) => seg.startsWith(':') || seg === b[i]);
  });
}

// ===== 2. 提取 admin api 调用 =====
const calls = [];
for (const f of fs.readdirSync(ADMIN_API_DIR)) {
  if (!f.endsWith('.ts')) continue;
  let src = fs.readFileSync(path.join(ADMIN_API_DIR, f), 'utf8');
  // 预处理：合并 'a' + var + 'b' 字符串拼接（迭代至稳定），变量段占位 :param
  for (let i = 0; i < 5; i++) {
    const before = src;
    src = src.replace(/'([^']*)'\s*\+\s*[A-Za-z_$][\w$.]*\s*\+\s*'([^']*)'/g, (_s, a, b) => "'" + a + ':param' + b + "'");
    src = src.replace(/'([^']*)'\s*\+\s*[A-Za-z_$][\w$.]*/g, (_s, a) => "'" + a + (a.endsWith('/') ? '' : '/') + ":param'");
    if (src === before) break;
  }
  const re = /request\.(get|post|put|del|patch)(?:<[^>]*>)?\(\{[^}]*?url:\s*(`[^`]*`|'[^']*')/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    const method = m[1] === 'del' ? 'DELETE' : m[1].toUpperCase();
    let url = m[2].slice(1, -1);
    url = url.replace(/\$\{[^}]+\}/g, ':param');
    url = url.replace(/\/+/g, '/').replace(/\/+$/, '');
    if (!url.startsWith('/api/')) url = '/api/v1' + url;
    calls.push({ file: f, method, url });
  }
}

// ===== 3. 比对 =====
const missing = []; const ok = [];
const seen = new Set();
for (const c of calls) {
  const key = c.method + ' ' + c.url;
  if (seen.has(key)) continue;
  seen.add(key);
  (matchBackend(c.method, c.url) ? ok : missing).push(c);
}

console.log('=== 管理后台 API ↔ 后端路由 连通审计 ===');
console.log('后端注册路由总数：' + backendRoutes.length + '；admin 调用（去重）：' + seen.size + '\n');
console.log('✅ 已连通：' + ok.length + ' 个');
if (missing.length) {
  console.log('\n❌ 后端缺失（' + missing.length + ' 个）：');
  for (const c of missing) console.log('  ' + c.method.padEnd(6) + c.url + '   ← ' + c.file);
  process.exit(1);
} else {
  console.log('❌ 后端缺失：0 个 — 全部连通 ✅');
}
