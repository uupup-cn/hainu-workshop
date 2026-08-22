// Mock API Server for Ci-Yuu-Plus
import http from "node:http";
import https from "node:https";
import crypto from "node:crypto";
import os from "node:os";

const PORT = 13000;
const VALID_USERNAME = "Super";
const VALID_PASSWORD = "123456";

const { publicKey, privateKey } = crypto.generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const KEY_ID = crypto.randomUUID().slice(0, 8);
let activeTokens = new Set();

const ALL_PERMISSIONS = [
  "account:feedback:create",
  "account:info:view",
  "account:notification:detail",
  "account:notification:inbox:list",
  "account:notification:read",
  "account:notification:read-all",
  "account:notification:stats",
  "account:password:change",
  "account:profile:update",
  "account:profile:view",
  "account:session:list",
  "account:session:logout",
  "account:session:revoke",
  "account:session:revoke-others",
  "account:workflow-instance:cancel",
  "account:workflow-instance:start",
  "account:workflow-task:add-sign",
  "account:workflow-task:approve",
  "account:workflow-task:comment",
  "account:workflow-task:detail",
  "account:workflow-task:overview",
  "account:workflow-task:pending:list",
  "account:workflow-task:processed:list",
  "account:workflow-task:reject",
  "account:workflow-task:transfer",
  "mall:aftersale-notice:get",
  "mall:aftersale-notice:update",
  "mall:aftersale:approve",
  "mall:aftersale:cancel",
  "mall:aftersale:create",
  "mall:aftersale:detail",
  "mall:aftersale:list",
  "mall:aftersale:refund",
  "mall:aftersale:reject",
  "mall:attribute-template:create",
  "mall:attribute-template:delete",
  "mall:attribute-template:enable",
  "mall:attribute-template:list",
  "mall:attribute-template:update",
  "mall:brand:create",
  "mall:brand:delete",
  "mall:brand:enable",
  "mall:brand:list",
  "mall:brand:update",
  "mall:category:create",
  "mall:category:delete",
  "mall:category:list",
  "mall:category:update",
  "mall:express-company:create",
  "mall:express-company:delete",
  "mall:express-company:enable",
  "mall:express-company:list",
  "mall:express-company:update",
  "mall:inbound:confirm",
  "mall:inbound:create",
  "mall:inbound:detail",
  "mall:inbound:list",
  "mall:inbound:update",
  "mall:inbound:void",
  "mall:inventory-log:list",
  "mall:inventory-query:detail",
  "mall:inventory-query:list",
  "mall:order:adjust-address",
  "mall:order:adjust-price",
  "mall:order:cancel",
  "mall:order:close",
  "mall:order:create",
  "mall:order:customer-suggestions",
  "mall:order:detail",
  "mall:order:list",
  "mall:order:note",
  "mall:order:overview",
  "mall:order:pay",
  "mall:order:ship",
  "mall:order:shipment-create",
  "mall:order:shipment-list",
  "mall:order:shipment-update",
  "mall:outbound:confirm",
  "mall:outbound:create",
  "mall:outbound:detail",
  "mall:outbound:list",
  "mall:outbound:update",
  "mall:outbound:void",
  "mall:payment-channel:create",
  "mall:payment-channel:delete",
  "mall:payment-channel:detail",
  "mall:payment-channel:enable",
  "mall:payment-channel:list",
  "mall:payment-channel:test",
  "mall:payment-channel:update",
  "mall:payment-transaction:detail",
  "mall:payment-transaction:list",
  "mall:payment-transaction:order-list",
  "mall:payment-webhook:detail",
  "mall:payment-webhook:list",
  "mall:payment-webhook:retry",
  "mall:payment:close-pending-payment",
  "mall:payment:create-payment",
  "mall:payment:query-payment",
  "mall:payment:query-refund",
  "mall:payment:refund-online",
  "mall:product-service:create",
  "mall:product-service:delete",
  "mall:product-service:enable",
  "mall:product-service:list",
  "mall:product-service:update",
  "mall:product:batch-assign-warehouse",
  "mall:product:batch-export",
  "mall:product:batch-off-shelf",
  "mall:product:batch-on-sale",
  "mall:product:batch-recycle",
  "mall:product:copy",
  "mall:product:create",
  "mall:product:delete",
  "mall:product:detail",
  "mall:product:list",
  "mall:product:off-shelf",
  "mall:product:on-sale",
  "mall:product:overview",
  "mall:product:permanent-delete",
  "mall:product:recycle",
  "mall:product:restore",
  "mall:product:update",
  "mall:review:aggregate",
  "mall:review:batch-toggle-recommend",
  "mall:review:batch-toggle-top",
  "mall:review:batch-toggle-visible",
  "mall:review:create",
  "mall:review:delete",
  "mall:review:detail",
  "mall:review:list",
  "mall:review:update",
  "mall:shipping-template:create",
  "mall:shipping-template:delete",
  "mall:shipping-template:enable",
  "mall:shipping-template:list",
  "mall:shipping-template:update",
  "mall:stocktake:complete",
  "mall:stocktake:create",
  "mall:stocktake:detail",
  "mall:stocktake:list",
  "mall:stocktake:start",
  "mall:stocktake:update",
  "mall:stocktake:update-item",
  "mall:stocktake:void",
  "mall:transfer:create",
  "mall:transfer:detail",
  "mall:transfer:list",
  "mall:transfer:receive",
  "mall:transfer:review",
  "mall:transfer:ship",
  "mall:transfer:update",
  "mall:transfer:void",
  "mall:warehouse:create",
  "mall:warehouse:delete",
  "mall:warehouse:enable",
  "mall:warehouse:list",
  "mall:warehouse:update",
  "system:ai-generator:apply",
  "system:ai-generator:check",
  "system:ai-generator:diagnose",
  "system:ai-generator:history",
  "system:ai-generator:parse",
  "system:ai-generator:plan",
  "system:ai-generator:preview",
  "system:ai-generator:rollback",
  "system:ai-generator:smoke-test",
  "system:ai-generator:validate",
  "system:api-permission:catalog",
  "system:content-category:create",
  "system:content-category:delete",
  "system:content-category:list",
  "system:content-category:update",
  "system:content-recycle:list",
  "system:content-recycle:purge",
  "system:content-recycle:restore",
  "system:content-tag:create",
  "system:content-tag:delete",
  "system:content-tag:list",
  "system:content-tag:update",
  "system:content:create",
  "system:content:delete",
  "system:content:detail",
  "system:content:list",
  "system:content:offline",
  "system:content:overview",
  "system:content:publish",
  "system:content:update",
  "system:department:create",
  "system:department:delete",
  "system:department:detail",
  "system:department:list",
  "system:department:update",
  "system:dict:data:create",
  "system:dict:data:delete",
  "system:dict:data:detail",
  "system:dict:data:list",
  "system:dict:data:update",
  "system:dict:type:create",
  "system:dict:type:delete",
  "system:dict:type:detail",
  "system:dict:type:list",
  "system:dict:type:update",
  "system:feedback:detail",
  "system:feedback:list",
  "system:feedback:overview",
  "system:feedback:status:update",
  "system:file-folder:create",
  "system:file-folder:delete",
  "system:file-folder:tree",
  "system:file-folder:update",
  "system:file:batch-delete",
  "system:file:batch-move",
  "system:file:complete",
  "system:file:delete",
  "system:file:detail",
  "system:file:download-url",
  "system:file:list",
  "system:file:public-link",
  "system:file:upload-proxy",
  "system:file:upload-ticket:create",
  "system:log:login:clear",
  "system:log:login:delete",
  "system:log:login:detail",
  "system:log:login:export",
  "system:log:login:list",
  "system:log:operation:clear",
  "system:log:operation:delete",
  "system:log:operation:detail",
  "system:log:operation:export",
  "system:log:operation:list",
  "system:menu:auth:create",
  "system:menu:auth:delete",
  "system:menu:auth:update",
  "system:menu:create",
  "system:menu:delete",
  "system:menu:list",
  "system:menu:manage:list",
  "system:menu:sort",
  "system:menu:update",
  "system:monitor:cache:refresh",
  "system:monitor:cache:view",
  "system:monitor:online-user:detail",
  "system:monitor:online-user:force-logout",
  "system:monitor:online-user:list",
  "system:monitor:overview",
  "system:monitor:system-resource:view",
  "system:monitor:visitor-analytics:view",
  "system:notification:admin:detail",
  "system:notification:admin:list",
  "system:notification:create",
  "system:notification:delete",
  "system:notification:publish",
  "system:notification:revoke",
  "system:notification:update",
  "system:param:create",
  "system:param:delete",
  "system:param:detail",
  "system:param:list",
  "system:param:refresh-cache",
  "system:param:resolve",
  "system:param:update",
  "system:post:create",
  "system:post:delete",
  "system:post:detail",
  "system:post:list",
  "system:post:update",
  "system:role:create",
  "system:role:data-permission:detail",
  "system:role:data-permission:meta",
  "system:role:data-permission:update",
  "system:role:delete",
  "system:role:list",
  "system:role:permission:detail",
  "system:role:permission:update",
  "system:role:update",
  "system:scheduled-task:create",
  "system:scheduled-task:cron:preview",
  "system:scheduled-task:delete",
  "system:scheduled-task:detail",
  "system:scheduled-task:handler:list",
  "system:scheduled-task:list",
  "system:scheduled-task:log:clear",
  "system:scheduled-task:log:delete",
  "system:scheduled-task:log:detail",
  "system:scheduled-task:log:list",
  "system:scheduled-task:run",
  "system:scheduled-task:status",
  "system:scheduled-task:update",
  "system:security-audit:event:detail",
  "system:security-audit:event:list",
  "system:security-audit:event:status:update",
  "system:security-audit:overview",
  "system:site-setting:admin:view",
  "system:site-setting:update",
  "system:user:create",
  "system:user:delete",
  "system:user:detail",
  "system:user:list",
  "system:user:update",
  "system:workflow-category:create",
  "system:workflow-category:delete",
  "system:workflow-category:list",
  "system:workflow-category:update",
  "system:workflow-definition-version:detail",
  "system:workflow-definition-version:list",
  "system:workflow-definition-version:rollback",
  "system:workflow-definition:copy",
  "system:workflow-definition:create",
  "system:workflow-definition:delete",
  "system:workflow-definition:detail",
  "system:workflow-definition:list",
  "system:workflow-definition:option:list",
  "system:workflow-definition:overview",
  "system:workflow-definition:preview",
  "system:workflow-definition:status",
  "system:workflow-definition:update",
  "system:workflow-definition:validate",
  "system:workflow-instance:detail",
  "system:workflow-instance:list",
  "system:workflow-instance:overview",
  "system:workflow:meta",
  // 工具箱管理权限
  "toolbox:category:list",
  "toolbox:category:create",
  "toolbox:category:update",
  "toolbox:category:delete",
  "toolbox:tool:list",
  "toolbox:tool:create",
  "toolbox:tool:update",
  "toolbox:tool:delete",
  "toolbox:tool:enable",
  "toolbox:log:list",
];

function parseBody(req) {
  return new Promise((resolve) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try { resolve(body ? JSON.parse(body) : {}); } catch { resolve({}); }
    });
  });
}

function jsonResponse(res, httpStatus, data, msg = "") {
  const body = JSON.stringify({ code: httpStatus === 200 ? 200 : httpStatus, msg, data });
  res.writeHead(httpStatus, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": "true",
  });
  res.end(body);
}

function sseResponse(res, onClose) {
  res.writeHead(200, {
    "Content-Type": "text/event-stream; charset=utf-8",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
  });
  const timer = setInterval(() => res.write(": ping\n\n"), 15000);
  res.on("close", () => { clearInterval(timer); if (onClose) onClose(); });
  return (event, data) => res.write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
}

function decryptPassword(encryptedBase64) {
  try {
    const buffer = Buffer.from(encryptedBase64, "base64");
    const decrypted = crypto.privateDecrypt(
      { key: privateKey, padding: crypto.constants.RSA_PKCS1_OAEP_PADDING, oaepHash: "sha256" },
      buffer
    );
    return decrypted.toString("utf-8");
  } catch { return null; }
}

function generateAccessToken() {
  const token = "mock-jwt-" + crypto.randomUUID();
  activeTokens.add(token);
  return token;
}

function extractToken(headers) {
  const auth = headers["authorization"] || "";
  return auth.startsWith("Bearer ") ? auth.slice(7) : null;
}

function isAuthed(req) {
  const token = extractToken(req.headers);
  return Boolean(token && activeTokens.has(token));
}

function getDefaultSiteSettings() {
  return {
    id: 1, key: "default",
    siteName: "Ci-Yuu-Plus",
    siteDescription: "商业化中后台管理系统",
    loginWelcomeTitle: "欢迎使用 Ci-Yuu-Plus",
    loginWelcomeDescription: "面向商业应用的高质量后台平台，让管理更高效，让业务更卓越。",
    seoTitle: "Ci-Yuu-Plus",
    seoDescription: "商业化中后台管理系统",
    seoKeywords: "后台管理系统,企业管理平台,运营后台",
    supportEmail: "", supportPhone: "", contactAddress: "",
    copyrightText: "Copyright © Ci-Yuu-Plus",
    icpNo: "", publicSecurityNo: "",
    maintenanceMode: false, maintenanceMessage: "",
    watermarkEnabled: true, watermarkMode: "USERNAME", watermarkText: "Ci-Yuu-Plus",
    allowRegister: false, feedbackEnabled: true,
    captchaEnabled: false, captchaType: "IMAGE",
    loginMaxRetryCount: null, loginLockMinutes: 10,
    defaultLanguage: "zh", orderPaymentTimeoutMinutes: 30,
    updatedByUser: null, updatedAt: new Date().toISOString(),
  };
}

// --------- time / random helpers ---------
const nowIso = () => new Date().toISOString();
const daysAgo = (n) => new Date(Date.now() - n * 86400000).toISOString();
const pick = (arr) => arr[Math.floor(Math.random() * arr.length)];
const range = (n) => Array.from({ length: n }, (_, i) => i);
const pad = (n, w = 2) => String(n).padStart(w, "0");
function paginate(list, query = {}) {
  const current = Math.max(1, parseInt(query.current || "1", 10) || 1);
  const size = Math.max(1, parseInt(query.size || "20", 10) || 20);
  const total = list.length;
  const records = list.slice((current - 1) * size, current * size);
  return { records, total, current, size };
}

// --------- route registry ---------
const routeDefs = [];
function route(method, pattern, handler) {
  const regexStr = "^" + pattern.replace(/:[^/]+/g, "([^/]+)") + "$";
  routeDefs.push({ method, regex: new RegExp(regexStr), handler, patternString: pattern });
}
// --------- mock menus ---------
function getMockMenuList() {
  return [
    // 仪表盘 - 首页默认为数据大屏(运营概览)
    { id: 1, parentId: null, name: "Dashboard", path: "/dashboard", component: "/index/index",
      meta: { title: "仪表盘", icon: "ri-dashboard-line", sort: 1, isFirstLevel: true },
      children: [
        { id: 114, parentId: 1, name: "OperationOverview", path: "operation-overview", component: "/data-screen/operation-overview/index", meta: { title: "运营概览", icon: "ri-pie-chart-2-line", sort: 1, fixedTab: true, keepAlive: false, isFullPage: true, authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 11, parentId: 1, name: "Console", path: "console", component: "/dashboard/console/index", meta: { title: "控制台", icon: "ri-home-smile-2-line", sort: 2, keepAlive: true, authList: [{ authMark: 'view', title: '查看' }] } },
      ]},
    // 工具箱管理 - 工具箱核心模块
    { id: 17, parentId: null, name: "Toolbox", path: "/toolbox", component: "/index/index",
      meta: { title: "工具箱管理", icon: "ri-tools-line", sort: 2, isFirstLevel: true },
      children: [
        { id: 171, parentId: 17, name: "ToolCategory", path: "category", component: "/toolbox/category/index", meta: { title: "工具分类", icon: "ri-price-tag-3-line", sort: 1, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }] } },
        { id: 172, parentId: 17, name: "ToolList", path: "list", component: "/toolbox/list/index", meta: { title: "工具列表", icon: "ri-grid-line", sort: 2, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }, { authMark: 'enable', title: '启用/禁用' }] } },
        { id: 173, parentId: 17, name: "ToolLog", path: "log", component: "/toolbox/log/index", meta: { title: "使用日志", icon: "ri-file-list-3-line", sort: 3, authList: [{ authMark: 'view', title: '查看' }] } },
      ]},
    // 内容管理 - 完整保留（工具箱需要文章教程）
    { id: 5, parentId: null, name: "Content", path: "/content", component: "/index/index",
      meta: { title: "内容管理", icon: "ri-article-line", sort: 3, isFirstLevel: true },
      children: [
        { id: 51, parentId: 5, name: "ArticleList", path: "list", component: "/content/list/index", meta: { title: "文章管理", icon: "ri-file-text-line", sort: 1, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }, { authMark: 'publish', title: '发布' }, { authMark: 'offline', title: '下线' }, { authMark: 'preview', title: '预览' }] } },
        { id: 52, parentId: 5, name: "ContentCategory", path: "category", component: "/content/category/index", meta: { title: "分类管理", icon: "ri-price-tag-3-line", sort: 2, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }] } },
        { id: 53, parentId: 5, name: "ContentTag", path: "tag", component: "/content/tag/index", meta: { title: "标签管理", icon: "ri-price-tag-line", sort: 3, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }] } },
        { id: 54, parentId: 5, name: "ContentRecycle", path: "recycle", component: "/content/recycle/index", meta: { title: "回收站", icon: "ri-delete-bin-line", sort: 4, authList: [{ authMark: 'restore', title: '恢复' }, { authMark: 'purge', title: '彻底删除' }] } },
        { id: 55, parentId: 5, name: "ContentDetail", path: "detail/:id", component: "/content/detail/index", meta: { title: "内容详情", isHide: true, isHideTab: true, keepAlive: false, activePath: "/content/list", authList: [{ authMark: 'view', title: '查看' }] } },
      ]},
    // 系统管理 - 精简版：去掉部门/岗位/角色/菜单管理/字典管理
    { id: 2, parentId: null, name: "System", path: "/system", component: "/index/index",
      meta: { title: "系统管理", icon: "ri-settings-line", sort: 4, isFirstLevel: true },
      children: [
        { id: 23, parentId: 2, name: "UserMgr", path: "user", component: "/system/user/index", meta: { title: "用户管理", icon: "ri-user-line", sort: 1, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }] } },
        { id: 27, parentId: 2, name: "SiteSettings", path: "site-setting", component: "/system/site-setting/index", meta: { title: "站点设置", icon: "ri-global-line", sort: 2, authList: [{ authMark: 'edit', title: '编辑' }] } },
        { id: 28, parentId: 2, name: "SystemParam", path: "system-param", component: "/system/system-param/index", meta: { title: "系统参数", icon: "ri-settings-3-line", sort: 3, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }, { authMark: 'refresh', title: '刷新缓存' }] } },
        { id: 29, parentId: 2, name: "NotificationMgr", path: "notification", component: "/system/notification/index", meta: { title: "通知管理", icon: "ri-notification-3-line", sort: 4, authList: [{ authMark: 'add', title: '新增' }, { authMark: 'edit', title: '编辑' }, { authMark: 'delete', title: '删除' }, { authMark: 'publish', title: '发布' }, { authMark: 'revoke', title: '撤回' }, { authMark: 'view', title: '查看' }] } },
        { id: 210, parentId: 2, name: "UserCenter", path: "user-center", component: "/system/user-center/index", meta: { title: "个人中心", icon: "ri-user-settings-line", sort: 5, authList: [] } },
        { id: 211, parentId: 2, name: "NotificationInbox", path: "notification/inbox", component: "/system/notification/inbox/index", meta: { title: "收件箱", isHide: true, isHideTab: true, keepAlive: false, activePath: "/system/notification", authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 212, parentId: 2, name: "NotificationDetail", path: "notification/detail/:id", component: "/system/notification/detail/index", meta: { title: "通知详情", isHide: true, isHideTab: true, keepAlive: false, activePath: "/system/notification", authList: [{ authMark: 'view', title: '查看' }] } },
      ]},
    // 文件中心
    { id: 6, parentId: null, name: "FileCenter", path: "/file-center", component: "/index/index",
      meta: { title: "文件中心", icon: "ri-folder-3-line", sort: 5, isFirstLevel: true },
      children: [
        { id: 61, parentId: 6, name: "FileList", path: "list", component: "/system/file-center/index", meta: { title: "文件列表", icon: "ri-file-list-3-line", sort: 1, authList: [{ authMark: 'upload', title: '上传' }, { authMark: 'download', title: '下载' }, { authMark: 'move', title: '移动' }, { authMark: 'delete', title: '删除' }, { authMark: 'publicLink', title: '公开链接' }, { authMark: 'createFolder', title: '新建目录' }] } },
      ]},
    // 运维与审计
    { id: 7, parentId: null, name: "Ops", path: "/ops", component: "/index/index",
      meta: { title: "运维与审计", icon: "ri-shield-keyhole-line", sort: 6, isFirstLevel: true },
      children: [
        { id: 71, parentId: 7, name: "OperationLog", path: "operation-log", component: "/system/operation-log/index", meta: { title: "操作日志", icon: "ri-clipboard-line", sort: 1, authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 72, parentId: 7, name: "LoginLog", path: "login-log", component: "/system/login-log/index", meta: { title: "登录日志", icon: "ri-shield-user-line", sort: 2, authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 73, parentId: 7, name: "Feedback", path: "feedback", component: "/system/feedback/index", meta: { title: "用户反馈", icon: "ri-discuss-line", sort: 3, authList: [{ authMark: 'view', title: '查看' }, { authMark: 'handle', title: '处理' }] } },
      ]},
    // 异常页面
    { id: 16, parentId: null, name: "Exception", path: "/exception", component: "/index/index",
      meta: { title: "异常页面", icon: "ri-error-warning-line", sort: 7, isFirstLevel: true },
      children: [
        { id: 161, parentId: 16, name: "Exception403", path: "403", component: "/exception/403/index", meta: { title: "403 无权限", icon: "ri-lock-unlock-line", sort: 1, isFullPage: true, authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 162, parentId: 16, name: "Exception404", path: "404", component: "/exception/404/index", meta: { title: "404 未找到", icon: "ri-find-replace-line", sort: 2, isFullPage: true, authList: [{ authMark: 'view', title: '查看' }] } },
        { id: 163, parentId: 16, name: "Exception500", path: "500", component: "/exception/500/index", meta: { title: "500 服务器错误", icon: "ri-server-line", sort: 3, isFullPage: true, authList: [{ authMark: 'view', title: '查看' }] } },
      ]},
  ];
}
// --------- in-memory data stores ---------
const departments = [
  { id: 1, parentId: null, name: "总部", code: "HQ", leader: "赵哥", phone: "13800000001", email: "hq@artd.pro", sort: 1, enabled: true, remark: "涵盖行政与技术总部", createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 2, parentId: 1, name: "技术部", code: "TECH", leader: "张三星", phone: "13800000002", email: "tech@artd.pro", sort: 1, enabled: true, createdAt: daysAgo(300), updatedAt: daysAgo(20) },
  { id: 3, parentId: 1, name: "财务部", code: "FIN", leader: "李四月", phone: "13800000003", email: "fin@artd.pro", sort: 2, enabled: true, createdAt: daysAgo(300), updatedAt: daysAgo(20) },
  { id: 4, parentId: 2, name: "前端组", code: "FE", leader: "王五形", phone: "13800000004", email: "fe@artd.pro", sort: 1, enabled: true, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 5, parentId: 2, name: "后端组", code: "BE", leader: "刘六水", phone: "13800000005", email: "be@artd.pro", sort: 2, enabled: true, createdAt: daysAgo(200), updatedAt: daysAgo(10) }
];
const posts = [
  { id: 1, name: "总经理", code: "CEO", sort: 1, enabled: true, remark: "", createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 2, name: "技术部负责人", code: "TECH_LEAD", sort: 2, enabled: true, remark: "", createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 3, name: "高级工程师", code: "SENIOR_ENG", sort: 3, enabled: true, remark: "", createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 4, name: "工程师", code: "ENG", sort: 4, enabled: true, remark: "", createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 5, name: "财务专员", code: "FIN_CLERK", sort: 5, enabled: true, remark: "", createdAt: daysAgo(365), updatedAt: daysAgo(30) }
];
const userSeeds = [
  ["Super", "超级管理员", 2, 3, "超级管理员"],
  ["admin", "管理员", 2, 3, "管理员"],
  ["zhangsan", "张三", 4, 4, "前端工程师"],
  ["lisi", "李四", 5, 4, "后端工程师"],
  ["wangwu", "王五", 2, 3, "技术主管"],
  ["zhaoliu", "赵六", 3, 5, "财务专员"],
  ["sunqi", "孙七", 4, 4, "前端工程师"],
  ["zhouba", "周八", 5, 3, "后端工程师"]
];
const roles = [
  { id: 1, name: "超级管理员", code: "super-admin", description: "拥有全部权限", enabled: true, createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 2, name: "管理员", code: "admin", description: "系统管理员", enabled: true, createdAt: daysAgo(365), updatedAt: daysAgo(30) },
  { id: 3, name: "技术人员", code: "developer", description: "技术开发", enabled: true, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 4, name: "普通用户", code: "user", description: "普通会员", enabled: true, createdAt: daysAgo(100), updatedAt: daysAgo(5) }
];
let users = userSeeds.map(([username, nickName, deptIdx, postIdx, realName], i) => ({
  id: i + 1,
  username,
  departmentId: departments[deptIdx - 1].id,
  postId: posts[postIdx - 1].id,
  profile: { id: i + 1, gender: i % 2, phone: `1380000${pad(i + 1, 4)}`, realName, nickName, email: `${username}@artd.pro`, avatar: "", address: "北京市朝阳区", bio: "" },
  roles: [{ id: i === 0 ? 1 : i === 1 ? 2 : 4, name: i === 0 ? "超级管理员" : i === 1 ? "管理员" : "普通用户" }],
  departmentInfo: { id: departments[deptIdx - 1].id, name: departments[deptIdx - 1].name },
  postInfo: { id: posts[postIdx - 1].id, name: posts[postIdx - 1].name },
  createdAt: daysAgo(365 - i * 10),
  updatedAt: daysAgo(i * 3)
}));
let nextUserId = users.length + 1;
const sessions = [
  { id: "sess-" + crypto.randomUUID().slice(0, 8), userId: 1, ip: "192.168.1.10", userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)", loginAt: daysAgo(1), lastActiveAt: nowIso(), lastRefreshAt: nowIso(), revokedAt: null, revokeReason: null, current: true, status: "ACTIVE" },
  { id: "sess-" + crypto.randomUUID().slice(0, 8), userId: 2, ip: "192.168.1.23", userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 13_0)", loginAt: daysAgo(3), lastActiveAt: daysAgo(1), lastRefreshAt: daysAgo(1), revokedAt: null, revokeReason: null, current: false, status: "ACTIVE" },
  { id: "sess-" + crypto.randomUUID().slice(0, 8), userId: 3, ip: "203.0.113.5", userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17)", loginAt: daysAgo(6), lastActiveAt: daysAgo(2), lastRefreshAt: daysAgo(2), revokedAt: daysAgo(1), revokeReason: "用户主动退出", current: false, status: "REVOKED" }
];

// -------- dicts --------
const dictTypes = [
  { id: 1, name: "用户状态", code: "user_status", enabled: true, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), _count: { items: 2 } },
  { id: 2, name: "性别", code: "gender", enabled: true, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), _count: { items: 3 } },
  { id: 3, name: "文章状态", code: "content_status", enabled: true, remark: "", createdAt: daysAgo(150), updatedAt: daysAgo(5), _count: { items: 4 } }
];
const dictData = [
  { id: 1, typeId: 1, label: "启用", value: "enabled", sort: 1, enabled: true, tagType: "success", remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), type: { id: 1, name: "用户状态", code: "user_status" } },
  { id: 2, typeId: 1, label: "禁用", value: "disabled", sort: 2, enabled: true, tagType: "danger", remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), type: { id: 1, name: "用户状态", code: "user_status" } },
  { id: 3, typeId: 2, label: "男", value: "male", sort: 1, enabled: true, tagType: "info", remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), type: { id: 2, name: "性别", code: "gender" } },
  { id: 4, typeId: 2, label: "女", value: "female", sort: 2, enabled: true, tagType: "info", remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), type: { id: 2, name: "性别", code: "gender" } },
  { id: 5, typeId: 3, label: "草稿", value: "DRAFT", sort: 1, enabled: true, tagType: "info", remark: "", createdAt: daysAgo(150), updatedAt: daysAgo(5), type: { id: 3, name: "文章状态", code: "content_status" } },
  { id: 6, typeId: 3, label: "已发布", value: "PUBLISHED", sort: 2, enabled: true, tagType: "success", remark: "", createdAt: daysAgo(150), updatedAt: daysAgo(5), type: { id: 3, name: "文章状态", code: "content_status" } }
];
let nextDictTypeId = 4;
let nextDictDataId = 7;

// -------- system params --------
const systemParams = [
  { id: 1, name: "系统名称", key: "site.name", groupCode: "site", groupName: "站点配置", valueType: "STRING", value: "Ci-Yuu-Plus", parsedValue: "Ci-Yuu-Plus", defaultValue: "Ci-Yuu-Plus", options: null, sort: 1, enabled: true, builtIn: true, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 2, name: "默认语言", key: "site.defaultLanguage", groupCode: "site", groupName: "站点配置", valueType: "STRING", value: "zh", parsedValue: "zh", defaultValue: "zh", options: null, sort: 2, enabled: true, builtIn: true, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 3, name: "订单超时关单（分钟）", key: "order.paymentTimeout", groupCode: "order", groupName: "订单配置", valueType: "NUMBER", value: "30", parsedValue: 30, defaultValue: "30", options: null, sort: 1, enabled: true, builtIn: false, remark: "", createdAt: daysAgo(100), updatedAt: daysAgo(2) },
  { id: 4, name: "启用注册", key: "auth.allowRegister", groupCode: "auth", groupName: "认证配置", valueType: "BOOLEAN", value: "false", parsedValue: false, defaultValue: "false", options: null, sort: 1, enabled: true, builtIn: false, remark: "", createdAt: daysAgo(90), updatedAt: daysAgo(1) }
];
let nextParamId = 5;
function systemParamPaginated(query) {
  const result = paginate(systemParams, query);
  const groups = {};
  systemParams.forEach((p) => {
    if (!groups[p.groupCode]) groups[p.groupCode] = { code: p.groupCode, name: p.groupName, count: 0 };
    groups[p.groupCode].count++;
  });
  return {
    ...result,
    groups: Object.values(groups),
    summary: {
      total: systemParams.length,
      enabledCount: systemParams.filter((p) => p.enabled).length,
      builtInCount: systemParams.filter((p) => p.builtIn).length,
      groupCount: Object.keys(groups).length
    },
    cacheSize: systemParams.length,
    updatedAt: nowIso()
  };
}
// -------- content stores --------
const contentTitles = [
  "关于系统升级的通知",
  "开发环境配置指南",
  "商品上架操作规范",
  "上半年业务回顾报告",
  "客户成功案例分享",
  "安全认证升级公告",
  "新版本功能上线说明",
  "常见问题解决方案汇编"
];
const contentCategories = [
  { id: 1, name: "公告", code: "notice", enabled: true, sort: 1, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), _count: { contentItems: 3 } },
  { id: 2, name: "新闻", code: "news", enabled: true, sort: 2, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), _count: { contentItems: 2 } },
  { id: 3, name: "案例", code: "case", enabled: true, sort: 3, remark: "", createdAt: daysAgo(200), updatedAt: daysAgo(10), _count: { contentItems: 2 } }
];
const contentTags = [
  { id: 1, name: "重要", code: "important", enabled: true, sort: 1, remark: "", useCount: 5, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 2, name: "公告", code: "notice", enabled: true, sort: 2, remark: "", useCount: 3, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 3, name: "操作指南", code: "guide", enabled: true, sort: 3, remark: "", useCount: 4, createdAt: daysAgo(200), updatedAt: daysAgo(10) },
  { id: 4, name: "升级", code: "upgrade", enabled: true, sort: 4, remark: "", useCount: 2, createdAt: daysAgo(200), updatedAt: daysAgo(10) }
];
const contentTypes = ["ARTICLE", "NEWS", "NOTICE", "CASE_STUDY", "HELP_CENTER"];
const contents = contentTitles.map((title, i) => {
  const status = i < 4 ? "PUBLISHED" : i < 6 ? "DRAFT" : "OFFLINE";
  const categoryId = contentCategories[i % contentCategories.length].id;
  return {
    id: i + 1,
    title,
    slug: `article-${i + 1}`,
    contentType: contentTypes[i % contentTypes.length],
    categoryId,
    channel: "web",
    status,
    visibility: "PUBLIC",
    author: userSeeds[i % userSeeds.length][1],
    coverUrl: null,
    summary: title + "的摘要信息，用于列表展示。",
    content: `# ${title}\n\n这是内容正文字段，用于演示富文本内容。`,
    source: "artd.pro",
    tags: ["重要", "公告"],
    seoKeywords: ["mock"],
    seoTitle: title,
    seoDescription: title,
    isTop: i === 0,
    isRecommended: i < 3,
    allowComment: true,
    sort: i + 1,
    publishedAt: status === "PUBLISHED" ? daysAgo(i * 5) : null,
    offlineAt: status === "OFFLINE" ? daysAgo(i) : null,
    viewCount: 100 + i * 37,
    likeCount: 10 + i * 3,
    commentCount: i % 5,
    favoriteCount: i % 4,
    createdAt: daysAgo(60 - i * 4),
    updatedAt: daysAgo(10 - i),
    deletedAt: null,
    category: { id: categoryId, name: contentCategories.find((c) => c.id === categoryId).name, code: contentCategories.find((c) => c.id === categoryId).code }
  };
});
let nextContentId = contents.length + 1;
let nextContentCatId = 4;
let nextContentTagId = 5;

// -------- notifications --------
const notifSeeds = [
  ["系统升级通知", "SYSTEM", "PUBLISHED", "ALL"],
  ["开场白：新版本功能上线", "UPDATE", "PUBLISHED", "ALL"],
  ["安全警示", "ALERT", "PUBLISHED", "ROLE"],
  ["大会通知（草稿）", "ANNOUNCEMENT", "DRAFT", "ALL"],
  ["测试通知", "SYSTEM", "REVOKED", "DEPARTMENT"]
];
const notifications = notifSeeds.map(([title, type, status, targetType], i) => ({
  id: i + 1,
  title,
  summary: title + "的摘要信息",
  content: `<p>${title}的完整正文内容，用于通知细节展示。</p>`,
  type, status, targetType,
  targetRoleIds: targetType === "ROLE" ? [2] : [],
  targetDepartmentIds: targetType === "DEPARTMENT" ? [1, 2] : [],
  targetUserIds: [],
  publishedAt: status === "PUBLISHED" ? daysAgo(i * 2) : null,
  revokedAt: status === "REVOKED" ? daysAgo(1) : null,
  expiresAt: null,
  createdAt: daysAgo(30 - i * 3),
  updatedAt: daysAgo(30 - i * 3),
  createdBy: { id: 1, username: "Super" },
  updatedBy: null,
  recipientCount: 128,
  readCount: status === "PUBLISHED" ? 96 : 0,
  targetRoles: targetType === "ROLE" ? [{ id: 2, name: "管理员" }] : [],
  targetDepartments: targetType === "DEPARTMENT" ? [{ id: 1, name: "总部" }, { id: 2, name: "技术部" }] : [],
  targetUsers: []
}));
let nextNotifId = notifications.length + 1;
const notificationInbox = [
  { id: 1, recipientId: 101, title: "系统升级通知", summary: "系统于周五 22:00 升级", content: "系统将于周五 22:00 进行升级，期间可能出现不稳定。", type: "SYSTEM", isRead: false, readAt: null, publishedAt: daysAgo(1), createdBy: { id: 1, username: "Super" } },
  { id: 2, recipientId: 102, title: "新版本功能上线", summary: "流程设计器新增功能", content: "流程设计器新增条件分支等功能，欢迎体验。", type: "UPDATE", isRead: true, readAt: daysAgo(1), publishedAt: daysAgo(2), createdBy: { id: 1, username: "Super" } }
];
let nextInboxId = 3;

// -------- feedback --------
const feedbackSeeds = [
  ["希望增加批量操作", "FEATURE", "PLANNED", "MEDIUM"],
  ["页面加载缓慢", "PERFORMANCE", "IN_PROGRESS", "HIGH"],
  ["报表导出缺中文", "BUG", "RESOLVED", "URGENT"],
  ["桌面端体验积极反馈", "UX", "NEW", "LOW"]
];
const feedbackStatuses = ["NEW", "TRIAGING", "PLANNED", "IN_PROGRESS", "RESOLVED", "CLOSED"];
const feedbacks = feedbackSeeds.map(([title, type, status, priority], i) => ({
  id: i + 1,
  feedbackNo: "FB-" + pad(i + 1, 4),
  type, status, priority,
  title,
  content: title + "的详细描述内容。",
  expectedBehavior: null,
  contactName: "test-user",
  contact: "13800000000",
  pageTitle: "Mock 页面",
  pagePath: "/mock",
  pageUrl: "http://localhost/mock",
  browser: "Chrome 120",
  os: "Windows 11",
  deviceType: "desktop",
  userAgent: "Mozilla/5.0",
  ip: "127.0.0.1",
  extra: null,
  handledRemark: null,
  handledAt: null,
  createdAt: daysAgo(20 - i * 3),
  updatedAt: daysAgo(20 - i * 3),
  submitter: { id: 3, username: "zhangsan" },
  handler: status === "RESOLVED" ? { id: 1, username: "Super" } : null
}));
let nextFeedbackId = feedbacks.length + 1;

// -------- files / folders --------
const fileFolders = [
  { id: 1, parentId: null, name: "公共资源", slug: "public", visibility: "PUBLIC", sort: 1, fileCount: 4, children: [] },
  { id: 2, parentId: null, name: "个人文件", slug: "private", visibility: "PRIVATE", sort: 2, fileCount: 3, children: [] },
  { id: 3, parentId: 1, name: "图片", slug: "public/images", visibility: "PUBLIC", sort: 1, fileCount: 2, children: [] }
];
const fileNames = ["logo.png", "banner.webp", "report.pdf", "schedule.xlsx", "release-notes.md", "avatar.jpg", "demo.mp4"];
const fileKinds = ["IMAGE", "IMAGE", "DOCUMENT", "DOCUMENT", "DOCUMENT", "IMAGE", "VIDEO"];
const files = fileNames.map((name, i) => {
  const ext = name.split(".").pop();
  const mimeMap = { png: "image/png", webp: "image/webp", pdf: "application/pdf", xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", md: "text/markdown", jpg: "image/jpeg", mp4: "video/mp4" };
  return {
    id: i + 1,
    fileNo: "FILE-" + pad(i + 1, 5),
    provider: "LOCAL",
    bucket: "default",
    objectKey: `files/${i + 1}/${name}`,
    originalName: name,
    displayName: name,
    extension: ext,
    mimeType: mimeMap[ext],
    kind: fileKinds[i],
    size: 1024 * (10 + i * 20),
    etag: '"' + crypto.randomUUID().slice(0, 8) + '"',
    width: fileKinds[i] === "IMAGE" ? 800 : null,
    height: fileKinds[i] === "IMAGE" ? 600 : null,
    duration: fileKinds[i] === "VIDEO" ? 32 : null,
    pageCount: null,
    visibility: i < 3 ? "PUBLIC" : "PRIVATE",
    status: "ACTIVE",
    tags: [],
    remark: null,
    metadata: null,
    publicToken: null,
    publicUrlExpiresAt: null,
    folder: i < 3 ? { id: 1, name: "公共资源", slug: "public" } : i < 5 ? { id: 2, name: "个人文件", slug: "private" } : { id: 3, name: "图片", slug: "public/images" },
    creator: { id: 1, username: "Super" },
    createdAt: daysAgo(30 - i * 2),
    updatedAt: daysAgo(5 - i)
  };
});
let nextFileId = files.length + 1;
let nextFolderId = 4;

// -------- logs --------
const logModules = ["用户管理", "角色管理", "菜单管理", "系统监控", "工作流"];
const logOperations = ["新增", "修改", "删除", "导出", "提交", "审批"];
const operationLogs = range(12).map((i) => ({
  id: i + 1,
  logNo: "OP-" + pad(1000 + i * 3, 6),
  module: logModules[i % logModules.length],
  operationType: logOperations[i % logOperations.length],
  description: logOperations[i % logOperations.length] + "操作（mock 演示数据）",
  method: pick(["GET", "POST", "PATCH", "DELETE"]),
  path: "/api/v1/mock/operation",
  userId: (i % 5) + 1,
  username: userSeeds[i % userSeeds.length][0],
  ip: `192.168.1.${20 + i}`,
  status: i % 6 === 5 ? "FAIL" : "SUCCESS",
  durationMs: 20 + i * 8,
  requestParams: {},
  responsePayload: null,
  responseCode: i % 6 === 5 ? 500 : 200,
  errorMessage: i % 6 === 5 ? "模拟错误" : null,
  createdAt: daysAgo(10 - Math.floor(i / 3))
}));
const loginLogs = range(10).map((i) => ({
  id: i + 1,
  logNo: "LG-" + pad(2000 + i * 2, 6),
  event: pick(["登录成功", "登录失败", "Token 刷新"]),
  userId: (i % 5) + 1,
  username: userSeeds[i % userSeeds.length][0],
  ip: `45.77.${i % 8}.${30 + i}`,
  location: pick(["北京", "上海", "深圳", "杭州", "成都"]),
  deviceType: i % 4 === 0 ? "MOBILE" : "PC",
  os: i % 3 === 0 ? "iOS 17" : i % 3 === 1 ? "Windows 11" : "macOS 14",
  browser: pick(["Chrome 120", "Safari 17", "Edge 120"]),
  userAgent: "Mozilla/5.0 (mock)",
  status: i % 4 === 2 ? "FAIL" : "SUCCESS",
  description: "",
  createdAt: daysAgo(8 - Math.floor(i / 4))
}));
// -------- monitor stores --------
function buildSystemResource() {
  return {
    hostname: os.hostname(),
    platform: process.platform,
    release: os.release(),
    arch: process.arch,
    nodeVersion: process.version,
    sampledAt: nowIso(),
    uptimeSeconds: Math.floor(process.uptime()),
    health: { score: 92, level: "GOOD", warnings: [] },
    cpu: { model: "Intel(R) Xeon(R) (Mock)", cores: 8, usagePercent: 23, loadAverage: [0.4, 0.31, 0.2] },
    memory: { totalBytes: 17179869184, usedBytes: 6183783424, freeBytes: 10996085760, usagePercent: 36 },
    storage: { totalBytes: 536870912000, usedBytes: 171798912000, freeBytes: 365072000000, usagePercent: 32, disks: [{ filesystem: "/dev/vda1", mountpoint: "/", totalBytes: 536870912000, usedBytes: 171798912000, freeBytes: 365072000000, usagePercent: 32 }] },
    network: { interfaceCount: 3, upInterfaceCount: 2, publicIpv4: ["203.0.113.9"], totalRxBytes: 4294967296, totalTxBytes: 2147483648, interfaces: [{ name: "eth0", mac: "00:16:3e:12:34:56", address: "172.31.0.10", internal: true, family: "IPv4", isUp: true, rxBytes: 4294967296, txBytes: 2147483648 }] },
    process: { pid: process.pid, uptimeSeconds: Math.floor(process.uptime()), rssBytes: 134217728, heapUsedBytes: 67108864, heapTotalBytes: 134217728 }
  };
}
const cacheOverview = {
  enabled: true,
  engine: "ioredis (mock)",
  status: "CONNECTED",
  message: "连接正常",
  connection: { urlConfigured: true, keyPrefix: "artd:", database: 0, timeoutMs: 500 },
  metrics: { hitRate: 0.92, keyCount: 12840, memoryUsed: "12.4 MB", connectedClients: 3, opsPerSec: 820 },
  manageableNamespaces: [
    { key: "sys_cache", label: "系统缓存" },
    { key: "user_cache", label: "用户会话缓存" },
    { key: "config_cache", label: "配置缓存" }
  ],
  plannedPanels: ["存储分体分析", "倾归率趋势"],
  actions: { canRefresh: true, canClear: true },
  updatedAt: nowIso()
};
const onlineUsers = range(6).map((i) => ({
  sessionId: "sess-mon-" + crypto.randomUUID().slice(0, 8),
  userId: i % 5 + 1,
  username: userSeeds[i % userSeeds.length][0],
  realName: userSeeds[i % userSeeds.length][1],
  phone: "1380000" + pad(1000 + i, 4),
  email: userSeeds[i % userSeeds.length][0] + "@artd.pro",
  avatar: null,
  department: { id: (i % 5) + 1, name: departments[i % departments.length].name },
  post: { id: (i % 5) + 1, name: posts[i % posts.length].name },
  roles: [{ id: 4, code: "user", name: "普通用户" }],
  ip: `192.168.10.${30 + i}`,
  userAgent: "Mozilla/5.0",
  browser: pick(["Chrome", "Edge", "Safari"]),
  os: pick(["Windows 11", "macOS 14", "Ubuntu 22.04"]),
  deviceType: i % 4 === 0 ? "mobile" : "pc",
  loginAt: daysAgo(0),
  lastActiveAt: nowIso(),
  lastRefreshAt: nowIso(),
  revokedAt: null,
  revokeReason: null,
  status: i % 3 === 0 ? "IDLE" : "ACTIVE",
  inactiveMinutes: i % 3 === 0 ? 16 : 0,
  isCurrentSession: i === 0,
  sessionAgeMinutes: 20 + i * 11
}));

// -------- scheduled tasks --------
const taskHandlers = [
  { value: "CLEANUP_OPERATION_LOGS", label: "清理操作日志", description: "定期清理过期的操作日志", businessCategory: "日志维护", defaultCronExpression: "0 0 3 * * ?", recommendedTimeZone: "Asia/Shanghai", paramsSchema: [{ key: "retentionDays", label: "保留天数", type: "number", required: true, min: 7, max: 365, defaultValue: 90, description: "超过该天数的日志将被清理" }] },
  { value: "CLEANUP_LOGIN_LOGS", label: "清理登录日志", description: "定期清理过期的登录日志", businessCategory: "日志维护", defaultCronExpression: "0 0 4 * * ?", recommendedTimeZone: "Asia/Shanghai", paramsSchema: [{ key: "retentionDays", label: "保留天数", type: "number", required: true, min: 7, max: 365, defaultValue: 90, description: "超过该天数的日志将被清理" }] },
  { value: "EXPIRE_NOTIFICATIONS", label: "过期通知处理", description: "自动处理已过期的通知", businessCategory: "通知维护", defaultCronExpression: "0 15 2 * * ?", recommendedTimeZone: "Asia/Shanghai", paramsSchema: [] }
];
const scheduledTasks = [
  { id: 1, taskNo: "TASK-" + pad(1001, 5), name: "清理操作日志", code: "cleanup-op-logs", handler: "CLEANUP_OPERATION_LOGS", cronExpression: "0 0 3 * * ?", timeZone: "Asia/Shanghai", status: "ENABLED", concurrencyPolicy: "FORBID", params: { retentionDays: 90 }, remark: "", sort: 1, lastRunAt: daysAgo(0), lastSuccessAt: daysAgo(0), nextRunAt: daysAgo(-1), lastStatus: "SUCCESS", lastDurationMs: 832, createdAt: daysAgo(120), updatedAt: daysAgo(2), creatorName: "Super", updaterName: "Super", isRunning: false, logCount: 8 },
  { id: 2, taskNo: "TASK-" + pad(1002, 5), name: "清理登录日志", code: "cleanup-login-logs", handler: "CLEANUP_LOGIN_LOGS", cronExpression: "0 0 4 * * ?", timeZone: "Asia/Shanghai", status: "ENABLED", concurrencyPolicy: "FORBID", params: { retentionDays: 60 }, remark: "", sort: 2, lastRunAt: daysAgo(1), lastSuccessAt: daysAgo(1), nextRunAt: daysAgo(-1), lastStatus: "SUCCESS", lastDurationMs: 512, createdAt: daysAgo(100), updatedAt: daysAgo(2), creatorName: "Super", updaterName: "Super", isRunning: false, logCount: 6 },
  { id: 3, taskNo: "TASK-" + pad(1003, 5), name: "过期通知处理", code: "expire-notifications", handler: "EXPIRE_NOTIFICATIONS", cronExpression: "0 15 2 * * ?", timeZone: "Asia/Shanghai", status: "DISABLED", concurrencyPolicy: "ALLOW", params: {}, remark: "暂停", sort: 3, lastRunAt: daysAgo(5), lastSuccessAt: null, nextRunAt: null, lastStatus: "FAIL", lastDurationMs: 68, createdAt: daysAgo(60), updatedAt: daysAgo(1), creatorName: "Super", updaterName: "Super", isRunning: false, logCount: 3 }
];
let nextTaskId = 4;
const taskLogs = range(8).map((i) => ({
  id: i + 1,
  logNo: "TLOG-" + pad(3000 + i, 5),
  taskId: (i % 3) + 1,
  taskName: scheduledTasks[i % 3].name,
  taskCode: scheduledTasks[i % 3].code,
  handler: scheduledTasks[i % 3].handler,
  triggerType: i % 4 === 3 ? "MANUAL" : "SCHEDULED",
  status: i % 7 === 6 ? "FAIL" : "SUCCESS",
  startedAt: daysAgo(Math.floor(i / 2)),
  finishedAt: daysAgo(Math.floor(i / 2)),
  durationMs: 300 + i * 51,
  message: "执行完成",
  errorMessage: null,
  resultPayload: null,
  operatorUserId: 1,
  operatorUsername: "Super",
  createdAt: daysAgo(Math.floor(i / 2))
}));
let nextTaskLogId = taskLogs.length + 1;

// -------- security audit --------
const auditEvents = range(8).map((i) => ({
  id: i + 1,
  auditNo: "AUDIT-" + pad(4000 + i, 5),
  eventType: pick(["异常登录", "注入尝试", "未授权访问", "Token 异常"]),
  title: pick(["异常 IP 连续失败", "恶意字符模式", "缺少权限请求", "异常地理位置登录"]),
  severity: pick(["LOW", "MEDIUM", "HIGH", "CRITICAL"]),
  status: pick(["OPEN", "OPEN", "ACKNOWLEDGED", "RESOLVED"]),
  riskScore: 20 + i * 9,
  sourceType: pick(["login", "api", "http"]),
  occurrenceCount: 1 + i * 3,
  firstOccurredAt: daysAgo(7 - i),
  lastOccurredAt: daysAgo(i % 3),
  userId: (i % 5) + 1,
  username: userSeeds[i % userSeeds.length][0],
  ip: `45.77.2.${10 + i}`,
  module: "auth",
  method: "POST",
  path: "/api/v1/auth/signin",
  description: "模拟安全审计事件",
  payload: null,
  loginLogId: null,
  operationLogId: null,
  handledBy: null,
  handledRemark: null,
  handledAt: null,
  createdAt: daysAgo(7 - i),
  updatedAt: daysAgo(i % 3),
  handler: null
}));
// -------- mall stores --------
const mallCategories = [
  { id: 1, parentId: null, ancestorPath: "/1", name: "电子数码", code: "digital", enabled: true, sort: 1, coverUrl: null, seoTitle: null, seoDescription: null, remark: "", defaultBrandId: null, defaultAttributeTemplateId: null, defaultShippingTemplateId: null, createdAt: daysAgo(200), updatedAt: daysAgo(10), children: [] },
  { id: 2, parentId: null, ancestorPath: "/2", name: "服装鞋靴", code: "fashion", enabled: true, sort: 2, coverUrl: null, seoTitle: null, seoDescription: null, remark: "", defaultBrandId: null, defaultAttributeTemplateId: null, defaultShippingTemplateId: null, createdAt: daysAgo(200), updatedAt: daysAgo(10), children: [] },
  { id: 3, parentId: null, ancestorPath: "/3", name: "生活百货", code: "daily", enabled: true, sort: 3, coverUrl: null, seoTitle: null, seoDescription: null, remark: "", defaultBrandId: null, defaultAttributeTemplateId: null, defaultShippingTemplateId: null, createdAt: daysAgo(200), updatedAt: daysAgo(10), children: [] },
  { id: 4, parentId: 1, ancestorPath: "/1/4", name: "手机", code: "phone", enabled: true, sort: 1, coverUrl: null, seoTitle: null, seoDescription: null, remark: "", defaultBrandId: null, defaultAttributeTemplateId: null, defaultShippingTemplateId: null, createdAt: daysAgo(150), updatedAt: daysAgo(5), children: [] }
];
const mallProductNames = ["天天小拍", "智能眼镜手表", "纯棉整理服", "越野背包", "匠心电饼铛锅"];
const mallProducts = range(10).map((i) => ({
  id: i + 1,
  categoryId: (i % 3) + 1,
  productNo: "P-" + pad(5000 + i, 5),
  name: mallProductNames[i % mallProductNames.length],
  subtitle: "演示 商品百钩数据",
  status: ["ON_SALE", "OFF_SHELF", "DRAFT", "PENDING"][i % 4],
  productType: "NORMAL",
  salesMode: "IN_STOCK",
  coverUrl: null,
  galleryUrls: [],
  detail: "<p>演示商品详情</p>",
  sellingPoints: ["高品质", "时尚设计"],
  tags: ["mock"],
  seoKeywords: [],
  seoTitle: null,
  seoDescription: null,
  sort: i + 1,
  totalStock: 100 + i * 20,
  lockedStock: 5,
  totalSales: 20 + i * 7,
  priceMin: 99 + i * 20,
  priceMax: 199 + i * 30,
  marketPriceMin: 129 + i * 20,
  marketPriceMax: 259 + i * 30,
  createdAt: daysAgo(60 - i * 3),
  updatedAt: daysAgo(10 - i),
  category: { id: (i % 3) + 1, name: mallCategories[i % 3].name, code: mallCategories[i % 3].code },
  skus: [{
    id: i + 1, productId: i + 1, skuCode: `SKU-${i + 1}`, barcode: null, imageUrl: null, specText: "默认", specValues: {}, salePrice: 99 + i * 20, marketPrice: 129 + i * 20, costPrice: 60 + i * 10, stock: 100 + i * 20, lockedStock: 5, weight: 500, volume: 1, isEnabled: true, sort: 1, createdAt: daysAgo(60 - i * 3), updatedAt: daysAgo(10 - i)
  }]
}));
let nextMallProductId = mallProducts.length + 1;
let nextMallCatId = 5;
const mallOrderStatuses = ["PENDING_PAYMENT", "PAID", "PENDING_SHIPMENT", "SHIPPED", "COMPLETED", "CANCELLED"];
const mallOrders = range(10).map((i) => {
  const orderStatus = mallOrderStatuses[i % mallOrderStatuses.length];
  return {
    id: i + 1,
    orderNo: "O-" + pad(6000 + i, 6),
    userId: (i % 5) + 1,
    username: userSeeds[i % userSeeds.length][0],
    userPhone: "1380000" + pad(1000 + i, 4),
    recipientName: "张三",
    recipientPhone: "1380000" + pad(1000 + i, 4),
    recipientProvince: "北京市",
    recipientCity: "北京市",
    recipientDistrict: "朝阳区",
    recipientAddress: "建国路 88 号",
    paymentMethod: "WECHAT",
    transactionNo: "TXN" + crypto.randomUUID().slice(0, 12),
    orderStatus,
    paymentStatus: orderStatus === "PENDING_PAYMENT" ? "UNPAID" : "PAID",
    fulfillmentStatus: orderStatus === "PENDING_PAYMENT" || orderStatus === "PAID" ? "UNFULFILLED" : orderStatus === "PENDING_SHIPMENT" ? "PARTIAL_SHIPPED" : "SHIPPED",
    aftersaleStatus: null,
    productAmount: 199 + i * 30,
    discountAmount: 0,
    freightAmount: 12,
    payAmount: orderStatus === "PENDING_PAYMENT" ? 0 : 199 + i * 30,
    note: null,
    placedAt: daysAgo(10 - Math.floor(i / 2)),
    paidAt: orderStatus === "PENDING_PAYMENT" ? null : daysAgo(9 - Math.floor(i / 2)),
    shippedAt: orderStatus === "SHIPPED" || orderStatus === "COMPLETED" ? daysAgo(6 - Math.floor(i / 3)) : null,
    completedAt: orderStatus === "COMPLETED" ? daysAgo(2) : null,
    closedAt: orderStatus === "CANCELLED" ? daysAgo(1) : null,
    createdAt: daysAgo(10 - Math.floor(i / 2)),
    updatedAt: daysAgo(10 - Math.floor(i / 2)),
    items: [{
      id: i + 1, orderId: i + 1, productId: (i % 4) + 1, productSkuId: i + 1, productName: mallProducts[i % mallProducts.length].name, productSubtitle: null, coverUrl: null, skuCode: `SKU-${i + 1}`, specText: "默认", salePrice: 199 + i * 30, quantity: 1, shippedQuantity: 0, totalAmount: 199 + i * 30, createdAt: daysAgo(10 - Math.floor(i / 2)), updatedAt: daysAgo(10 - Math.floor(i / 2))
    }],
    operateLogs: [{ id: i + 1, orderId: i + 1, operatorId: 1, operatorName: "Super", action: "CREATE", note: "模拟订单", createdAt: daysAgo(10 - Math.floor(i / 2)) }]
  };
});
let nextMallOrderId = mallOrders.length + 1;

// -------- workflow stores --------
const workflowCategories = [
  { id: 1, name: "差旅报销", code: "travel", enabled: true, sort: 1, remark: "", definitionCount: 2, instanceCount: 8, createdAt: daysAgo(180), updatedAt: daysAgo(10) },
  { id: 2, name: "人事行政", code: "hr", enabled: true, sort: 2, remark: "", definitionCount: 1, instanceCount: 5, createdAt: daysAgo(180), updatedAt: daysAgo(10) },
  { id: 3, name: "财务审批", code: "finance", enabled: true, sort: 3, remark: "", definitionCount: 1, instanceCount: 4, createdAt: daysAgo(180), updatedAt: daysAgo(10) }
];
let nextWorkflowCatId = 4;
const workflowStatuses = ["DRAFT", "ENABLED", "DISABLED", "ARCHIVED"];
const workflowDefinitionNames = ["差旅报销流程", "请假流程", "采购审批流程", "合同审批流程"];
const workflowDefinitions = range(4).map((i) => {
  const status = workflowStatuses[i % workflowStatuses.length];
  const category = workflowCategories[i % workflowCategories.length];
  return {
    id: i + 1,
    workflowNo: "WF-" + pad(7000 + i, 5),
    name: workflowDefinitionNames[i],
    code: `wf_${i + 1}`,
    category: category.code,
    status,
    version: i + 1,
    summary: "演示工作流模拟数据",
    description: "演示工作流模拟数据",
    icon: "ri:git-branch-line",
    color: "#1677ff",
    allowCancel: true,
    settings: {},
    formSchema: [],
    stageSchema: [],
    flowSchema: { nodes: [], edges: [] },
    canvasSchema: null,
    schemaVersion: 1,
    instanceCount: i + 2,
    taskCount: i * 2,
    creator: { id: 1, username: "Super" },
    updater: { id: 1, username: "Super" },
    publishedAt: status === "ENABLED" ? daysAgo(20 - i) : null,
    archivedAt: status === "ARCHIVED" ? daysAgo(5) : null,
    createdAt: daysAgo(80 - i * 5),
    updatedAt: daysAgo(10 - i)
  };
});
let nextWfDefId = workflowDefinitions.length + 1;
const workflowInstanceStatuses = ["IN_PROGRESS", "IN_PROGRESS", "APPROVED", "REJECTED", "CANCELLED", "APPROVED"];
const workflowInstances = range(6).map((i) => {
  const status = workflowInstanceStatuses[i % workflowInstanceStatuses.length];
  const def = workflowDefinitions[i % workflowDefinitions.length];
  return {
    id: i + 1,
    instanceNo: "INS-" + pad(8000 + i, 5),
    definitionId: def.id,
    definitionCode: def.code,
    definitionName: def.name,
    definitionVersion: def.version,
    title: def.name + " 实例 " + (i + 1),
    businessKey: `BIZ-${i + 1}`,
    category: def.category,
    status,
    priority: ["LOW", "MEDIUM", "HIGH", "URGENT"][i % 4],
    allowCancel: true,
    settings: {},
    formData: { reason: "模拟申请内容" },
    formSchema: [],
    stageSchema: [],
    flowSchema: { nodes: [], edges: [] },
    canvasSchema: null,
    schemaVersion: 1,
    currentStageIndex: 0,
    currentStageKey: "approval",
    currentStageName: "审核审批",
    currentNodeId: "start",
    currentNodeType: "START",
    currentTaskCount: i % 3 === 0 ? 1 : 0,
    startedBy: 1,
    startedDeptId: 2,
    startedAt: daysAgo(5 - Math.floor(i / 2)),
    lastActionAt: daysAgo(1),
    finishedAt: ["APPROVED", "REJECTED", "CANCELLED"].includes(status) ? daysAgo(1) : null,
    cancelReason: null,
    createdAt: daysAgo(5 - Math.floor(i / 2)),
    updatedAt: daysAgo(1),
    starter: { id: 1, username: "Super", department: { id: 2, name: "技术部" } },
    pendingApprovers: i % 3 === 0 ? [{ id: 2, username: "admin" }] : [],
    taskCount: 1,
    recordCount: 2,
    hasApprovalAction: i % 3 !== 0,
    tasks: [{ id: i + 1, taskNo: "T-" + pad(9000 + i, 5), stageIndex: 0, stageKey: "approval", stageName: "审核审批", nodeId: "approval", nodeType: "APPROVAL", nodeName: "一级审批", approverType: "USER", approveMode: "ANY", status: i % 3 === 0 ? "PENDING" : "APPROVED", assignedAt: daysAgo(5 - Math.floor(i / 2)), actedAt: i % 3 !== 0 ? daysAgo(1) : null, comment: null, cancelReason: null, approver: { id: 2, username: "admin" }, actor: i % 3 !== 0 ? { id: 1, username: "Super" } : null }],
    records: [
      { id: i * 2 + 1, action: "SUBMIT", stageIndex: 0, stageKey: "start", stageName: "申请提交", operatorId: 1, operatorName: "Super", comment: "提交申请", payload: null, createdAt: daysAgo(5 - Math.floor(i / 2)) },
      { id: i * 2 + 2, action: "ASSIGN", stageIndex: 0, stageKey: "approval", stageName: "审核审批", operatorId: 1, operatorName: "Super", comment: null, payload: null, createdAt: daysAgo(5 - Math.floor(i / 2)) }
    ]
  };
});
let nextWfInstanceId = workflowInstances.length + 1;
const workflowTasks = workflowInstances.flatMap((ins) =>
  ins.tasks.map((t) => ({
    ...t,
    instanceId: ins.id,
    definitionId: ins.definitionId,
    approverId: t.approver.id,
    actedBy: t.actor ? t.actor.id : null,
    instance: ins,
    operationPermissions: t.status === "PENDING" ? { approve: true, reject: true, comment: true, transfer: true, addSign: true } : {}
  }))
);
let nextWfTaskId = workflowTasks.length + 1;

// -------- ai generator history --------
let aiHistory = [
  { id: "demo-user-1001", moduleName: "demo-user", moduleTitle: "用户管理", createdAt: daysAgo(2), createdBy: { userId: 1, username: "Super" }, status: "applied", fileCount: 4, version: 1, cleanupAvailable: true },
  { id: "demo-role-1002", moduleName: "demo-role", moduleTitle: "角色管理", createdAt: daysAgo(1), createdBy: { userId: 1, username: "Super" }, status: "rolled-back", fileCount: 3, version: 1, cleanupAvailable: false }
];
let nextAiRunId = 1003;
// ================= route handlers =================
function ok(res, data, msg = "success") { return jsonResponse(res, 200, data, msg); }
function nextId(arr) { return arr.length ? Math.max(...arr.map((x) => x.id)) + 1 : 1; }

// ---------- meta / site ----------
route("GET", "/api/v1/crypto/security-config", (ctx) => {
  return ok(ctx.res, {
    keyId: KEY_ID, publicKey: publicKey,
    enabled: true, serverTime: Date.now(), signatureRequired: false,
    clockSkewMs: 300000, nonceTtlMs: 300000, nonceMinLength: 32,
    unsignedPayloadToken: "unsigned-formdata",
    exemptPaths: ["/api/v1/auth/signin", "/api/v1/auth/captcha", "/api/v1/auth/refresh"],
  });
});
route("GET", "/api/v1/site-settings/public", (ctx) => ok(ctx.res, getDefaultSiteSettings()));
route("GET", "/api/v1/site-settings/admin", (ctx) => ok(ctx.res, getDefaultSiteSettings()));

// ---------- auth ----------
route("POST", "/api/v1/auth/signin", async (ctx) => {
  const { username, password } = ctx.body;
  if (!username || !password) return jsonResponse(ctx.res, 400, null, "用户名和密码不能为空");
  const decryptedPassword = decryptPassword(password);
  if (!decryptedPassword) return jsonResponse(ctx.res, 400, null, "密码解密失败");
  if (username !== VALID_USERNAME || decryptedPassword !== VALID_PASSWORD) {
    return jsonResponse(ctx.res, 401, null, "用户名或密码错误");
  }
  const accessToken = generateAccessToken();
  return ok(ctx.res, { accessToken });
});
route("GET", "/api/v1/auth/captcha", (ctx) => {
  return ok(ctx.res, {
    captchaId: crypto.randomUUID(),
    image: "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"120\" height=\"40\"><rect width=\"120\" height=\"40\" fill=\"#fff\"/><text x=\"30\" y=\"28\" font-size=\"22\">A3pQ</text></svg>",
    expiresIn: 300
  });
});
route("POST", "/api/v1/auth/signup", async (ctx) => ok(ctx.res, { accessToken: generateAccessToken() }));
route("POST", "/api/v1/auth/logout", (ctx) => {
  const token = extractToken(ctx.req.headers);
  if (token) activeTokens.delete(token);
  return ok(ctx.res, null, "退出成功");
});
route("POST", "/api/v1/auth/refresh", (ctx) => ok(ctx.res, { accessToken: generateAccessToken() }));
route("POST", "/api/v1/auth/sessions/revoke-others", (ctx) => ok(ctx.res, { message: "已注销其他会话", shouldLogout: false, count: 2 }));

// ---------- user info / profile ----------
route("GET", "/api/v1/user/info", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权访问，请重新登录");
  return ok(ctx.res, {
    id: 1, username: "Super", nickName: "超级管理员", realName: "Admin",
    email: "admin@artdesignpro.com", avatar: "",
    roles: ["super-admin"], buttons: ["add", "edit", "delete", "export", "import"],
    apiPermissions: ALL_PERMISSIONS,
  });
});
route("GET", "/api/v1/user/profile/me", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权访问，请重新登录");
  return ok(ctx.res, {
    id: 1, username: "Super", createdAt: "2024-01-01T00:00:00.000Z", updatedAt: nowIso(),
    departmentInfo: { id: 1, name: "技术部" },
    postInfo: { id: 1, name: "高级工程师" },
    roles: [{ id: 1, name: "超级管理员" }],
    profile: { gender: 1, phone: "13800000000", realName: "Admin", nickName: "超级管理员", email: "admin@artdesignpro.com", avatar: null, address: "北京市朝阳区", bio: "系统管理员" },
  });
});
route("PATCH", "/api/v1/user/profile/me", async (ctx) => {
  const user = users[0];
  if (user && ctx.body) Object.assign(user.profile, ctx.body);
  return ok(ctx.res, user ? user.profile : null, "个人资料已更新");
});

// ---------- toolbox ----------
const toolCategories = [
  { id: 1, name: "文本处理", icon: "ri:file-text-line", sort: 1, description: "文字、编码、格式转换等工具", toolCount: 5, enabled: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
  { id: 2, name: "图片处理", icon: "ri:image-line", sort: 2, description: "图片压缩、格式转换、裁剪等", toolCount: 3, enabled: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
  { id: 3, name: "编码转换", icon: "ri:code-line", sort: 3, description: "Base64、URL、JSON 等编码解码", toolCount: 4, enabled: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
  { id: 4, name: "开发工具", icon: "ri:tools-line", sort: 4, description: "正则测试、时间戳转换、UUID 生成等", toolCount: 6, enabled: true, createdAt: daysAgo(30), updatedAt: daysAgo(5) },
];
let nextCategoryId = 5;
const tools = [
  { id: 1, name: "Base64 编解码", description: "文本与 Base64 互转", categoryId: 3, categoryName: "编码转换", icon: "ri:file-code-line", type: "builtin", route: "/tools/base64", sort: 1, enabled: true, visitCount: 1280, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 2, name: "JSON 格式化", description: "JSON 格式化与校验", categoryId: 3, categoryName: "编码转换", icon: "ri:braces-line", type: "builtin", route: "/tools/json", sort: 2, enabled: true, visitCount: 980, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 3, name: "时间戳转换", description: "Unix 时间戳与日期互转", categoryId: 4, categoryName: "开发工具", icon: "ri:time-line", type: "builtin", route: "/tools/timestamp", sort: 1, enabled: true, visitCount: 750, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 4, name: "正则测试", description: "正则表达式在线测试", categoryId: 4, categoryName: "开发工具", icon: "ri:regex-line", type: "builtin", route: "/tools/regex", sort: 2, enabled: true, visitCount: 520, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 5, name: "图片压缩", description: "PNG/JPEG 图片在线压缩", categoryId: 2, categoryName: "图片处理", icon: "ri:compress-line", type: "api-proxy", route: "/tools/image-compress", apiConfig: { method: "POST", url: "https://api.example.com/image/compress", timeout: 30000 }, sort: 1, enabled: true, visitCount: 320, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 6, name: "UUID 生成器", description: "生成各种版本的 UUID", categoryId: 4, categoryName: "开发工具", icon: "ri:key-line", type: "builtin", route: "/tools/uuid", sort: 3, enabled: true, visitCount: 210, createdAt: daysAgo(30), updatedAt: daysAgo(3) },
  { id: 7, name: "在线 PS", description: "跳转到在线图片编辑器", categoryId: 2, categoryName: "图片处理", icon: "ri:image-edit-line", type: "link", linkUrl: "https://www.photopea.com", sort: 2, enabled: true, visitCount: 86, createdAt: daysAgo(20), updatedAt: daysAgo(2) },
];
let nextToolId = 7;
const toolLogs = [
  { id: 1, toolId: 1, toolName: "Base64 编解码", userId: 1, username: "Super", type: "builtin", requestUrl: null, requestMethod: null, statusCode: null, duration: 12, ip: "192.168.1.100", createdAt: daysAgo(1) },
  { id: 2, toolId: 2, toolName: "JSON 格式化", userId: 1, username: "Super", type: "builtin", requestUrl: null, requestMethod: null, statusCode: null, duration: 8, ip: "192.168.1.100", createdAt: daysAgo(0) },
  { id: 3, toolId: 5, toolName: "图片压缩", userId: 2, username: "Admin", type: "api-proxy", requestUrl: "https://api.example.com/image/compress", requestMethod: "POST", statusCode: 200, duration: 1250, ip: "192.168.1.101", createdAt: daysAgo(0) },
];
let nextLogId = 4;

route("GET", "/api/v1/toolbox/category", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  let list = [...toolCategories];
  if (ctx.query.name) list = list.filter(c => c.name.includes(ctx.query.name));
  if (ctx.query.enabled !== undefined) list = list.filter(c => String(c.enabled) === ctx.query.enabled);
  return ok(ctx.res, paginate(list, ctx.query));
});
route("POST", "/api/v1/toolbox/category", async (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const item = { id: nextCategoryId++, ...ctx.body, toolCount: 0, enabled: true, createdAt: nowIso(), updatedAt: nowIso() };
  toolCategories.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/toolbox/category/:id", async (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const idx = toolCategories.findIndex(c => c.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "分类不存在");
  toolCategories[idx] = { ...toolCategories[idx], ...ctx.body, updatedAt: nowIso() };
  return ok(ctx.res, toolCategories[idx], "更新成功");
});
route("DELETE", "/api/v1/toolbox/category/:id", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const idx = toolCategories.findIndex(c => c.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "分类不存在");
  toolCategories.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});

route("GET", "/api/v1/toolbox/tool", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  let list = [...tools];
  if (ctx.query.name) list = list.filter(t => t.name.includes(ctx.query.name));
  if (ctx.query.categoryId) list = list.filter(t => t.categoryId === Number(ctx.query.categoryId));
  if (ctx.query.type) list = list.filter(t => t.type === ctx.query.type);
  if (ctx.query.enabled !== undefined) list = list.filter(t => String(t.enabled) === ctx.query.enabled);
  return ok(ctx.res, paginate(list, ctx.query));
});
route("POST", "/api/v1/toolbox/tool", async (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const cat = toolCategories.find(c => c.id === ctx.body.categoryId);
  const item = { id: nextToolId++, ...ctx.body, categoryName: cat ? cat.name : "", visitCount: 0, enabled: true, createdAt: nowIso(), updatedAt: nowIso() };
  tools.push(item);
  if (cat) cat.toolCount++;
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/toolbox/tool/:id", async (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const idx = tools.findIndex(t => t.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "工具不存在");
  tools[idx] = { ...tools[idx], ...ctx.body, updatedAt: nowIso() };
  if (ctx.body.categoryId) {
    const cat = toolCategories.find(c => c.id === ctx.body.categoryId);
    if (cat) tools[idx].categoryName = cat.name;
  }
  return ok(ctx.res, tools[idx], "更新成功");
});
route("DELETE", "/api/v1/toolbox/tool/:id", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const idx = tools.findIndex(t => t.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "工具不存在");
  const cat = toolCategories.find(c => c.id === tools[idx].categoryId);
  if (cat) cat.toolCount--;
  tools.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});
route("PATCH", "/api/v1/toolbox/tool/:id/status", async (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  const idx = tools.findIndex(t => t.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "工具不存在");
  tools[idx].enabled = ctx.body.enabled;
  tools[idx].updatedAt = nowIso();
  return ok(ctx.res, null, tools[idx].enabled ? "已启用" : "已禁用");
});

route("GET", "/api/v1/toolbox/log", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权");
  let list = [...toolLogs];
  if (ctx.query.toolName) list = list.filter(l => l.toolName.includes(ctx.query.toolName));
  return ok(ctx.res, paginate(list, ctx.query));
});

// ---------- menus ----------
route("GET", "/api/v3/system/menus", (ctx) => {
  if (!isAuthed(ctx.req)) return jsonResponse(ctx.res, 401, null, "未授权访问，请重新登录");
  return ok(ctx.res, getMockMenuList());
});
route("GET", "/api/v3/system/menus/manage", (ctx) => ok(ctx.res, getMockMenuList()));
// ---------- users ----------
route("GET", "/api/v1/user", (ctx) => {
  const q = ctx.query;
  let list = users.slice();
  if (q.username) list = list.filter((u) => u.username.includes(q.username));
  if (q.realName) list = list.filter((u) => u.profile?.realName?.includes(q.realName));
  if (q.phone) list = list.filter((u) => u.profile?.phone?.includes(q.phone));
  if (q.departmentId) list = list.filter((u) => u.departmentId === Number(q.departmentId));
  if (q.postId) list = list.filter((u) => u.postId === Number(q.postId));
  if (q.role) list = list.filter((u) => u.roles?.some((r) => r.id === Number(q.role)));
  return ok(ctx.res, paginate(list, q));
});
route("POST", "/api/v1/user", async (ctx) => {
  const data = ctx.body;
  const user = {
    id: nextUserId++,
    username: data.username,
    departmentId: data.departmentId ?? null,
    postId: data.postId ?? null,
    profile: { id: nextUserId, gender: data.profile?.gender ?? 1, phone: data.profile?.phone || null, realName: data.profile?.realName || null, nickName: data.profile?.nickName || data.username, email: data.profile?.email || null, avatar: null, address: null, bio: null },
    roles: (data.roles || []).map((rid) => { const r = roles.find((x) => x.id === rid); return { id: rid, name: r ? r.name : "" }; }),
    departmentInfo: data.departmentId ? departments.find((d) => d.id === data.departmentId) : null,
    postInfo: data.postId ? posts.find((p) => p.id === data.postId) : null,
    createdAt: nowIso(), updatedAt: nowIso()
  };
  users.push(user);
  return ok(ctx.res, user, "新增成功");
});
route("PATCH", "/api/v1/user/:id", async (ctx) => {
  const user = users.find((u) => u.id === Number(ctx.params.id));
  if (!user) return jsonResponse(ctx.res, 404, null, "用户不存在");
  const data = ctx.body;
  Object.assign(user, data);
  if (data.profile) Object.assign(user.profile, data.profile);
  if (data.roles) user.roles = data.roles.map((rid) => { const r = roles.find((x) => x.id === rid); return { id: rid, name: r ? r.name : "" }; });
  user.updatedAt = nowIso();
  return ok(ctx.res, user, "更新成功");
});
route("DELETE", "/api/v1/user/:id", (ctx) => {
  const idx = users.findIndex((u) => u.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "用户不存在");
  users.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});
route("POST", "/api/v1/user/password/change", (ctx) => ok(ctx.res, null, "密码修改成功"));
route("GET", "/api/v1/auth/sessions", (ctx) => ok(ctx.res, paginate(sessions.slice(), ctx.query)));
route("DELETE", "/api/v1/auth/sessions/:id", (ctx) => {
  const idx = sessions.findIndex((s) => s.id === ctx.params.id);
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "会话不存在");
  sessions.splice(idx, 1);
  return ok(ctx.res, null, "已注销会话");
});

// ---------- roles ----------
const permissionCatalog = [
  { module: "系统管理", categories: [
    { category: "用户", permissions: range(6).map((i) => ({ id: i + 1, code: "system:user:" + ["list", "create", "update", "delete", "detail", "export"][i], name: ["查询", "新增", "修改", "删除", "详情", "导出"][i] + "用户", module: "系统管理", category: "用户", method: ["GET", "POST", "PATCH", "DELETE", "GET", "GET"][i], path: "/api/v1/user", enabled: true, sort: i, createdAt: daysAgo(90), updatedAt: daysAgo(10) })) },
    { category: "角色", permissions: range(4).map((i) => ({ id: 10 + i, code: "system:role:" + ["list", "create", "update", "delete"][i], name: ["查询", "新增", "修改", "删除"][i] + "角色", module: "系统管理", category: "角色", method: "GET", path: "/api/v1/roles", enabled: true, sort: i, createdAt: daysAgo(90), updatedAt: daysAgo(10) })) }
  ]},
  { module: "日志监控", categories: [
    { category: "日志", permissions: range(3).map((i) => ({ id: 20 + i, code: "system:log:operation:" + ["list", "clear", "export"][i], name: ["查询", "清空", "导出"][i] + "操作日志", module: "日志监控", category: "日志", method: "GET", path: "/api/v1/logs/operation", enabled: true, sort: i, createdAt: daysAgo(90), updatedAt: daysAgo(10) })) }
  ]}
];
route("GET", "/api/v1/roles", (ctx) => {
  const q = ctx.query;
  let list = roles.slice();
  if (q.name) list = list.filter((r) => r.name.includes(q.name));
  if (q.code) list = list.filter((r) => r.code.includes(q.code));
  return ok(ctx.res, paginate(list, q));
});
route("POST", "/api/v1/roles", async (ctx) => {
  const data = ctx.body;
  const role = { id: nextId(roles), ...data, createdAt: nowIso(), updatedAt: nowIso() };
  roles.push(role);
  return ok(ctx.res, role, "新增成功");
});
route("PATCH", "/api/v1/roles/:id", async (ctx) => {
  const role = roles.find((r) => r.id === Number(ctx.params.id));
  if (!role) return jsonResponse(ctx.res, 404, null, "角色不存在");
  Object.assign(role, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, role, "更新成功");
});
route("DELETE", "/api/v1/roles/:id", (ctx) => {
  const idx = roles.findIndex((r) => r.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "角色不存在");
  roles.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});
route("GET", "/api/v1/roles/:id/permissions", (ctx) => ok(ctx.res, { roleId: Number(ctx.params.id), permissionKeys: ["system:user:list", "system:role:list"], apiPermissionCodes: ALL_PERMISSIONS.slice(0, 30) }));
route("PATCH", "/api/v1/roles/:id/permissions", (ctx) => ok(ctx.res, { roleId: Number(ctx.params.id), permissionKeys: ctx.body.permissionKeys || [], apiPermissionCodes: ctx.body.apiPermissionCodes || [] }, "权限已更新"));
route("GET", "/api/v1/api-permissions/catalog", (ctx) => ok(ctx.res, permissionCatalog));
route("GET", "/api/v1/roles/data-permissions/meta", (ctx) => ok(ctx.res, {
  resources: [
    { resourceCode: "user", resourceName: "用户数据", entity: "User", treeStrategy: "NONE", supportedActions: ["view", "create", "update", "delete", "export"], supportedDimensions: ["DEPT", "USER"] },
    { resourceCode: "order", resourceName: "订单数据", entity: "Order", treeStrategy: "ANCESTOR_PLUS_SUBTREE", supportedActions: ["view", "approve", "assign"], supportedDimensions: ["DEPT", "STORE", "USER"] }
  ],
  scopeOptions: [{ value: "ALL", label: "全部数据" }, { value: "ORG_AND_CHILD", label: "本机构及下属" }, { value: "ORG", label: "本机构" }, { value: "SELF", label: "仅本人" }, { value: "CUSTOM", label: "自定义" }, { value: "NONE", label: "不可访问" }],
  dimensionOptions: [{ value: "DEPT", label: "部门" }, { value: "REGION", label: "区域" }, { value: "STORE", label: "门店" }, { value: "USER", label: "用户" }],
  actionOptions: [
    { value: "view", label: "查看" }, { value: "create", label: "新增" }, { value: "update", label: "修改" },
    { value: "delete", label: "删除" }, { value: "export", label: "导出" }, { value: "approve", label: "审批" }, { value: "assign", label: "分配" }
  ],
  departments
}));
route("GET", "/api/v1/roles/:id/data-permissions", (ctx) => ok(ctx.res, { roleId: Number(ctx.params.id), policies: [] }));
route("PATCH", "/api/v1/roles/:id/data-permissions", (ctx) => ok(ctx.res, { roleId: Number(ctx.params.id), policies: ctx.body.policies || [] }, "数据权限已更新"));

// ---------- departments ----------
function buildDeptTree(list) {
  const map = new Map(list.map((d) => [d.id, { ...d, children: [] }]));
  const roots = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) map.get(node.parentId).children.push(node);
    else roots.push(node);
  });
  return roots;
}
route("GET", "/api/v1/departments", (ctx) => {
  let list = departments.slice();
  const q = ctx.query;
  if (q.keyword) list = list.filter((d) => d.name.includes(q.keyword) || d.code.includes(q.keyword));
  if (q.enabled === "false") list = list.filter((d) => !d.enabled);
  return ok(ctx.res, buildDeptTree(list));
});
route("POST", "/api/v1/departments", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextId(departments), ...data, enabled: data.enabled ?? true, sort: data.sort ?? 99, createdAt: nowIso(), updatedAt: nowIso(), children: [] };
  departments.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/departments/:id", async (ctx) => {
  const dept = departments.find((d) => d.id === Number(ctx.params.id));
  if (!dept) return jsonResponse(ctx.res, 404, null, "部门不存在");
  Object.assign(dept, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, dept, "更新成功");
});
route("DELETE", "/api/v1/departments/:id", (ctx) => {
  const idx = departments.findIndex((d) => d.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "部门不存在");
  departments.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});

// ---------- posts ----------
route("GET", "/api/v1/posts", (ctx) => {
  const q = ctx.query;
  let list = posts.slice();
  if (q.name) list = list.filter((p) => p.name.includes(q.name));
  if (q.code) list = list.filter((p) => p.code.includes(q.code));
  return ok(ctx.res, paginate(list, q));
});
route("POST", "/api/v1/posts", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextId(posts), ...data, enabled: data.enabled ?? true, createdAt: nowIso(), updatedAt: nowIso() };
  posts.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/posts/:id", async (ctx) => {
  const post = posts.find((p) => p.id === Number(ctx.params.id));
  if (!post) return jsonResponse(ctx.res, 404, null, "岗位不存在");
  Object.assign(post, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, post, "更新成功");
});
route("DELETE", "/api/v1/posts/:id", (ctx) => {
  const idx = posts.findIndex((p) => p.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "岗位不存在");
  posts.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});
// ---------- dicts ----------
route("GET", "/api/v1/dicts/types", (ctx) => {
  const q = ctx.query;
  let list = dictTypes.slice();
  if (q.keyword) list = list.filter((d) => d.name.includes(q.keyword) || d.code.includes(q.keyword));
  return ok(ctx.res, paginate(list, q));
});
route("POST", "/api/v1/dicts/types", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextDictTypeId++, ...data, enabled: data.enabled ?? true, createdAt: nowIso(), updatedAt: nowIso(), _count: { items: 0 } };
  dictTypes.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/dicts/types/:id", async (ctx) => {
  const type = dictTypes.find((t) => t.id === Number(ctx.params.id));
  if (!type) return jsonResponse(ctx.res, 404, null, "字典类型不存在");
  Object.assign(type, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, type, "更新成功");
});
route("DELETE", "/api/v1/dicts/types/:id", (ctx) => {
  const idx = dictTypes.findIndex((t) => t.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "字典类型不存在");
  dictTypes.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});
route("GET", "/api/v1/dicts/data", (ctx) => {
  const q = ctx.query;
  let list = dictData.slice();
  if (q.typeId) list = list.filter((d) => d.typeId === Number(q.typeId));
  if (q.label) list = list.filter((d) => d.label.includes(q.label));
  return ok(ctx.res, paginate(list, q));
});
route("POST", "/api/v1/dicts/data", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextDictDataId++, ...data, enabled: data.enabled ?? true, createdAt: nowIso(), updatedAt: nowIso(), type: dictTypes.find((t) => t.id === data.typeId) || null };
  dictData.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/dicts/data/:id", async (ctx) => {
  const item = dictData.find((d) => d.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "字典数据不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/dicts/data/:id", (ctx) => {
  const idx = dictData.findIndex((d) => d.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "字典数据不存在");
  dictData.splice(idx, 1);
  return ok(ctx.res, null, "删除成功");
});

// ---------- menu management ----------
route("POST", "/api/v3/system/menus", async (ctx) => {
  const data = ctx.body;
  const id = Math.floor(Math.random() * 9000) + 100;
  const item = { id, parentId: data.parentId ?? null, name: data.name, path: data.path, component: data.component || "", meta: { title: data.label, icon: data.icon || "", sort: data.sort || 1, isEnable: data.isEnable ?? true, keepAlive: data.keepAlive, isHide: data.isHide, isHideTab: data.isHideTab, isIframe: data.isIframe, fixedTab: data.fixedTab }, auths: [], children: [] };
  return ok(ctx.res, item, "菜单新增成功");
});
route("PATCH", "/api/v3/system/menus/:id", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "菜单更新成功"));
route("PATCH", "/api/v3/system/menus/sort", async (ctx) => ok(ctx.res, null, "排序已保存"));
route("DELETE", "/api/v3/system/menus/:id", (ctx) => ok(ctx.res, null, "菜单删除成功"));
route("POST", "/api/v3/system/menus/auths", async (ctx) => ok(ctx.res, { id: Math.floor(Math.random() * 9000) + 100, ...ctx.body }, "权限新增成功"));
route("PATCH", "/api/v3/system/menus/:parentId/auths/:authMark", async (ctx) => ok(ctx.res, { parentId: Number(ctx.params.parentId), authMark: ctx.params.authMark, ...ctx.body }, "权限更新成功"));
route("DELETE", "/api/v3/system/menus/:parentId/auths/:authMark", (ctx) => ok(ctx.res, null, "权限删除成功"));

// ---------- system params ----------
route("GET", "/api/v1/system-params", (ctx) => ok(ctx.res, systemParamPaginated(ctx.query)));
route("GET", "/api/v1/system-params/:id", (ctx) => {
  const item = systemParams.find((p) => p.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "参数不存在");
  return ok(ctx.res, item);
});
route("POST", "/api/v1/system-params", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextParamId++, ...data, enabled: data.enabled ?? true, builtIn: false, createdAt: nowIso(), updatedAt: nowIso() };
  systemParams.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/system-params/:id", async (ctx) => {
  const item = systemParams.find((p) => p.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "参数不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/system-params", (ctx) => {
  const ids = (ctx.query.ids || "").split(",").map(Number).filter(Boolean);
  ids.forEach((id) => { const idx = systemParams.findIndex((p) => p.id === id); if (idx > -1) systemParams.splice(idx, 1); });
  return ok(ctx.res, { count: ids.length }, "删除成功");
});
route("POST", "/api/v1/system-params/refresh-cache", (ctx) => ok(ctx.res, { count: systemParams.length, updatedAt: nowIso() }, "缓存已刷新"));
route("GET", "/api/v1/system-params/resolve", (ctx) => {
  const keys = (ctx.query.keys || "").split(",").filter(Boolean);
  const result = {};
  keys.forEach((k) => { const p = systemParams.find((x) => x.key === k); if (p) result[k] = p.parsedValue; });
  return ok(ctx.res, result);
});

// ---------- site-settings admin update ----------
route("PATCH", "/api/v1/site-settings/admin", async (ctx) => ok(ctx.res, { ...getDefaultSiteSettings(), ...ctx.body, updatedAt: nowIso() }, "站点配置已保存"));
// ---------- contents ----------
function contentOverview() {
  return {
    total: contents.length,
    draft: contents.filter((c) => c.status === "DRAFT").length,
    reviewing: contents.filter((c) => c.status === "REVIEWING").length,
    published: contents.filter((c) => c.status === "PUBLISHED").length,
    offline: contents.filter((c) => c.status === "OFFLINE").length,
    topCount: contents.filter((c) => c.isTop).length,
    recommended: contents.filter((c) => c.isRecommended).length,
    totalViews: contents.reduce((s, c) => s + c.viewCount, 0),
    totalLikes: contents.reduce((s, c) => s + c.likeCount, 0),
    totalComments: contents.reduce((s, c) => s + c.commentCount, 0),
    totalFavorites: contents.reduce((s, c) => s + c.favoriteCount, 0)
  };
}
route("GET", "/api/v1/contents/overview", (ctx) => ok(ctx.res, contentOverview()));
route("GET", "/api/v1/contents", (ctx) => {
  const q = ctx.query;
  let list = contents.filter((c) => !c.deletedAt).slice();
  if (q.keyword) list = list.filter((c) => c.title.includes(q.keyword));
  if (q.status) list = list.filter((c) => c.status === q.status);
  if (q.contentType) list = list.filter((c) => c.contentType === q.contentType);
  if (q.categoryId) list = list.filter((c) => c.categoryId === Number(q.categoryId));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/contents/recycle-bin", (ctx) => ok(ctx.res, paginate(contents.filter((c) => c.deletedAt).slice(), ctx.query)));
route("GET", "/api/v1/contents/:id", (ctx) => {
  const item = contents.find((c) => c.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "内容不存在");
  return ok(ctx.res, item);
});
route("POST", "/api/v1/contents", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextContentId++, ...data, slug: data.slug || `article-${nextContentId}`, author: "Super", viewCount: 0, likeCount: 0, commentCount: 0, favoriteCount: 0, createdAt: nowIso(), updatedAt: nowIso(), deletedAt: null, category: data.categoryId ? contentCategories.find((c) => c.id === data.categoryId) : null };
  contents.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/contents/:id", async (ctx) => {
  const item = contents.find((c) => c.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "内容不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("PATCH", "/api/v1/contents/:id/publish", (ctx) => ok(ctx.res, null, "已发布"));
route("PATCH", "/api/v1/contents/:id/offline", (ctx) => ok(ctx.res, null, "已下线"));
route("PATCH", "/api/v1/contents/:id/restore", (ctx) => ok(ctx.res, null, "已还原"));
route("DELETE", "/api/v1/contents/:id", (ctx) => ok(ctx.res, null, "已移入回收站"));
route("DELETE", "/api/v1/contents/:id/purge", (ctx) => ok(ctx.res, null, "已彻底删除"));

// ---------- content categories & tags ----------
route("GET", "/api/v1/content-categories", (ctx) => {
  const q = ctx.query;
  let list = contentCategories.slice();
  if (q.keyword) list = list.filter((c) => c.name.includes(q.keyword));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/content-categories/enabled/options", (ctx) => ok(ctx.res, contentCategories.filter((c) => c.enabled)));
route("POST", "/api/v1/content-categories", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextContentCatId++, code: "cat-" + nextContentCatId, ...data, enabled: data.enabled ?? true, createdAt: nowIso(), updatedAt: nowIso(), _count: { contentItems: 0 } };
  contentCategories.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/content-categories/:id", async (ctx) => {
  const item = contentCategories.find((c) => c.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "分类不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/content-categories/:id", (ctx) => ok(ctx.res, null, "删除成功"));

route("GET", "/api/v1/content-tags", (ctx) => {
  const q = ctx.query;
  let list = contentTags.slice();
  if (q.keyword) list = list.filter((t) => t.name.includes(q.keyword));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/content-tags/enabled/options", (ctx) => ok(ctx.res, contentTags.filter((t) => t.enabled)));
route("POST", "/api/v1/content-tags", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextContentTagId++, code: "tag-" + nextContentTagId, ...data, enabled: data.enabled ?? true, useCount: 0, createdAt: nowIso(), updatedAt: nowIso() };
  contentTags.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/content-tags/:id", async (ctx) => {
  const item = contentTags.find((t) => t.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "标签不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/content-tags/:id", (ctx) => ok(ctx.res, null, "删除成功"));

// ---------- notifications ----------
route("GET", "/api/v1/notifications/admin", (ctx) => {
  const q = ctx.query;
  let list = notifications.slice();
  if (q.keyword) list = list.filter((n) => n.title.includes(q.keyword));
  if (q.type) list = list.filter((n) => n.type === q.type);
  if (q.status) list = list.filter((n) => n.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/notifications/admin/:id", (ctx) => {
  const item = notifications.find((n) => n.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "通知不存在");
});
route("POST", "/api/v1/notifications/admin", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextNotifId++, ...data, status: data.status || "DRAFT", recipientCount: 0, readCount: 0, createdAt: nowIso(), updatedAt: nowIso(), createdBy: { id: 1, username: "Super" }, targetRoles: [], targetDepartments: [], targetUsers: [] };
  notifications.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/notifications/admin/:id", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "更新成功"));
route("POST", "/api/v1/notifications/admin/:id/publish", (ctx) => ok(ctx.res, null, "已发布"));
route("POST", "/api/v1/notifications/admin/:id/revoke", (ctx) => ok(ctx.res, null, "已撤回"));
route("DELETE", "/api/v1/notifications/admin/:id", (ctx) => ok(ctx.res, null, "删除成功"));
route("PATCH", "/api/v1/notifications/inbox/:id/read", (ctx) => {
  const item = notificationInbox.find((n) => n.id === Number(ctx.params.id));
  if (item) { item.isRead = true; item.readAt = nowIso(); }
  return ok(ctx.res, null, "已标记已读");
});
route("PATCH", "/api/v1/notifications/inbox/read-all", (ctx) => {
  notificationInbox.forEach((n) => { n.isRead = true; n.readAt = nowIso(); });
  return ok(ctx.res, null, "已全部标记已读");
});
route("GET", "/api/v1/notifications/inbox", (ctx) => {
  const result = paginate(notificationInbox.slice(), ctx.query);
  result.unreadCount = notificationInbox.filter((n) => !n.isRead).length;
  return ok(ctx.res, result);
});
route("GET", "/api/v1/notifications/inbox/:id", (ctx) => {
  const item = notificationInbox.find((n) => n.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "通知不存在");
});
route("GET", "/api/v1/notifications/stats", (ctx) => ok(ctx.res, { unreadCount: notificationInbox.filter((n) => !n.isRead).length }));
route("POST", "/api/v1/notifications/stream-token", (ctx) => ok(ctx.res, { token: "mock-stream-" + crypto.randomUUID().slice(0, 8) }));
// ---------- feedback ----------
route("GET", "/api/v1/feedback/overview", (ctx) => ok(ctx.res, {
  summary: { totalCount: feedbacks.length, activeCount: feedbacks.filter((f) => !["RESOLVED", "CLOSED"].includes(f.status)).length, todayCount: 1, resolvedCount: feedbacks.filter((f) => f.status === "RESOLVED").length, generatedAt: nowIso() },
  statusBuckets: feedbackStatuses.map((status) => ({ status, count: feedbacks.filter((f) => f.status === status).length })),
  typeBuckets: ["BUG", "FEATURE", "UX", "PERFORMANCE", "OTHER"].map((type) => ({ type, count: feedbacks.filter((f) => f.type === type).length })),
  latestRecords: feedbacks.slice(0, 3)
}));
route("GET", "/api/v1/feedback", (ctx) => {
  const q = ctx.query;
  let list = feedbacks.slice();
  if (q.keyword) list = list.filter((f) => f.title.includes(q.keyword));
  if (q.type) list = list.filter((f) => f.type === q.type);
  if (q.status) list = list.filter((f) => f.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/feedback/:id", (ctx) => {
  const item = feedbacks.find((f) => f.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "反馈不存在");
});
route("POST", "/api/v1/feedback", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextFeedbackId++, feedbackNo: "FB-" + pad(nextFeedbackId, 4), ...data, status: "NEW", createdAt: nowIso(), updatedAt: nowIso(), submitter: { id: 1, username: "Super" }, handler: null };
  feedbacks.push(item);
  return ok(ctx.res, item, "反馈已提交");
});
route("PATCH", "/api/v1/feedback/:id/status", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "状态已更新"));

// ---------- files / folders ----------
route("GET", "/api/v1/files", (ctx) => {
  const q = ctx.query;
  let list = files.slice();
  if (q.keyword) list = list.filter((f) => f.displayName.includes(q.keyword));
  if (q.folderId) list = list.filter((f) => f.folder?.id === Number(q.folderId));
  if (q.kind) list = list.filter((f) => f.kind === q.kind);
  if (q.visibility) list = list.filter((f) => f.visibility === q.visibility);
  const result = paginate(list, q);
  result.summary = { total: files.length, privateCount: files.filter((f) => f.visibility === "PRIVATE").length, publicCount: files.filter((f) => f.visibility === "PUBLIC").length };
  return ok(ctx.res, result);
});
route("GET", "/api/v1/files/:id", (ctx) => {
  const item = files.find((f) => f.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "文件不存在");
});
route("POST", "/api/v1/files/upload-tickets", async (ctx) => {
  const data = ctx.body;
  const file = { id: nextFileId, fileNo: "FILE-" + pad(nextFileId, 5), provider: "LOCAL", bucket: "mock", objectKey: "mock/" + data.fileName, originalName: data.fileName, displayName: data.fileName, extension: data.fileName.split(".").pop(), mimeType: data.mimeType, kind: "OTHER", size: data.size, etag: null, width: null, height: null, duration: null, pageCount: null, visibility: data.visibility || "PRIVATE", status: "PENDING", tags: [], remark: null, metadata: null, publicToken: null, publicUrlExpiresAt: null, folder: null, creator: { id: 1, username: "Super" }, createdAt: nowIso(), updatedAt: nowIso() };
  return ok(ctx.res, {
    file,
    sessionId: "sess-upload-" + crypto.randomUUID().slice(0, 8),
    provider: "LOCAL",
    bucket: "mock",
    objectKey: "mock/" + data.fileName,
    uploadUrl: "/api/v1/files/upload-proxy",
    method: "POST",
    headers: {},
    formData: {},
    expiresAt: daysAgo(-1)
  });
});
route("POST", "/api/v1/files/upload-proxy", async (ctx) => {
  const fileName = "upload-" + Date.now() + ".png";
  const file = { id: nextFileId++, fileNo: "FILE-" + pad(nextFileId, 5), provider: "LOCAL", bucket: "mock", objectKey: "mock/" + fileName, originalName: fileName, displayName: fileName, extension: "png", mimeType: "image/png", kind: "IMAGE", size: 1024, etag: '"' + crypto.randomUUID().slice(0, 8) + '"', width: 800, height: 600, duration: null, pageCount: null, visibility: ctx.query.visibility || "PRIVATE", status: "ACTIVE", tags: [], remark: null, metadata: null, publicToken: null, publicUrlExpiresAt: null, folder: ctx.query.folderId ? { id: Number(ctx.query.folderId), name: "文件夹", slug: "folder-" + ctx.query.folderId } : null, creator: { id: 1, username: "Super" }, createdAt: nowIso(), updatedAt: nowIso() };
  files.push(file);
  return ok(ctx.res, file, "上传成功");
});
route("POST", "/api/v1/files/:id/complete", async (ctx) => ok(ctx.res, files.find((f) => f.id === Number(ctx.params.id)) || null, "上传完成"));
route("POST", "/api/v1/files/:id/public-link", (ctx) => ok(ctx.res, { token: "pub-" + crypto.randomUUID().slice(0, 8), visibility: "PUBLIC", publicUrl: "/mock/" + ctx.params.id }));
route("POST", "/api/v1/files/:id/download-url", (ctx) => ok(ctx.res, { url: "/mock/download/" + ctx.params.id, expiresAt: daysAgo(-1) }));
route("DELETE", "/api/v1/files/:id", (ctx) => ok(ctx.res, { success: true }, "删除成功"));
route("POST", "/api/v1/files/batch/move", async (ctx) => ok(ctx.res, { count: (ctx.body.ids || []).length }, "批量移动成功"));
route("POST", "/api/v1/files/batch/delete", async (ctx) => ok(ctx.res, { count: (ctx.body.ids || []).length }, "批量删除成功"));
route("GET", "/api/v1/file-folders/tree", (ctx) => ok(ctx.res, fileFolders.map((f) => ({ ...f, children: f.children || [] }))));
route("POST", "/api/v1/file-folders", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextFolderId++, parentId: data.parentId ?? null, name: data.name, slug: "folder-" + nextFolderId, visibility: data.visibility || "PRIVATE", sort: data.sort || 1, fileCount: 0, children: [] };
  fileFolders.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/file-folders/:id", async (ctx) => {
  const item = fileFolders.find((f) => f.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "文件夹不存在");
  Object.assign(item, ctx.body);
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/file-folders/:id", (ctx) => {
  const idx = fileFolders.findIndex((f) => f.id === Number(ctx.params.id));
  if (idx === -1) return jsonResponse(ctx.res, 404, null, "文件夹不存在");
  fileFolders.splice(idx, 1);
  return ok(ctx.res, { success: true }, "删除成功");
});
// ---------- logs ----------
route("GET", "/api/v1/logs/operation", (ctx) => {
  const q = ctx.query;
  let list = operationLogs.slice();
  if (q.module) list = list.filter((l) => l.module.includes(q.module));
  if (q.username) list = list.filter((l) => l.username?.includes(q.username));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/logs/operation/:id", (ctx) => {
  const item = operationLogs.find((l) => l.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "日志不存在");
});
route("GET", "/api/v1/logs/operation/export", (ctx) => ok(ctx.res, operationLogs));
route("DELETE", "/api/v1/logs/operation", (ctx) => ok(ctx.res, { count: 1 }, "删除成功"));
route("DELETE", "/api/v1/logs/operation/clear", (ctx) => ok(ctx.res, null, "清空成功"));
route("GET", "/api/v1/logs/login", (ctx) => {
  const q = ctx.query;
  let list = loginLogs.slice();
  if (q.username) list = list.filter((l) => l.username?.includes(q.username));
  if (q.event) list = list.filter((l) => l.event?.includes(q.event));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/logs/login/:id", (ctx) => {
  const item = loginLogs.find((l) => l.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "日志不存在");
});
route("GET", "/api/v1/logs/login/export", (ctx) => ok(ctx.res, loginLogs));
route("DELETE", "/api/v1/logs/login", (ctx) => ok(ctx.res, { count: 1 }, "删除成功"));
route("DELETE", "/api/v1/logs/login/clear", (ctx) => ok(ctx.res, null, "清空成功"));

// ---------- monitor ----------
route("GET", "/api/v1/monitor/overview", (ctx) => ok(ctx.res, {
  summary: {
    totalUsers: users.length,
    activeSessionCount: onlineUsers.filter((u) => u.status === "ACTIVE").length,
    idleSessionCount: onlineUsers.filter((u) => u.status === "IDLE").length,
    uniqueOnlineUserCount: onlineUsers.length,
    totalSessionCount: sessions.length,
    todayLoginSuccessCount: 12,
    todayLoginFailCount: 3,
    todayRefreshCount: 8,
    todayOperationCount: 86,
    enabledTaskCount: scheduledTasks.filter((t) => t.status === "ENABLED").length,
    systemParamCount: systemParams.length,
    securityLevel: "MEDIUM",
    generatedAt: nowIso()
  },
  loginTrend: range(7).map((i) => ({ date: daysAgo(6 - i).slice(0, 10), successCount: 4 + i * 3, failCount: i % 3 })),
  recentSessions: onlineUsers.slice(0, 5),
  recentLogins: loginLogs.slice(0, 5),
  systemResource: buildSystemResource(),
  cache: cacheOverview
}));
route("GET", "/api/v1/monitor/online-users", (ctx) => {
  const q = ctx.query;
  let list = onlineUsers.slice();
  if (q.keyword) list = list.filter((u) => u.username.includes(q.keyword));
  if (q.status) list = list.filter((u) => u.status === q.status);
  const result = paginate(list, q);
  result.summary = {
    total: onlineUsers.length,
    activeCount: onlineUsers.filter((u) => u.status === "ACTIVE").length,
    idleCount: onlineUsers.filter((u) => u.status === "IDLE").length,
    uniqueUserCount: onlineUsers.length,
    browserStats: [{ name: "Chrome", count: 3 }, { name: "Edge", count: 2 }, { name: "Safari", count: 1 }],
    generatedAt: nowIso()
  };
  return ok(ctx.res, result);
});
route("GET", "/api/v1/monitor/online-users/:id", (ctx) => {
  const item = onlineUsers.find((u) => u.sessionId === ctx.params.id);
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "会话不存在");
});
route("POST", "/api/v1/monitor/online-users/force-logout", async (ctx) => ok(ctx.res, { count: (ctx.body.sessionIds || []).length }, "已强制下线"));
route("GET", "/api/v1/monitor/cache", (ctx) => ok(ctx.res, cacheOverview));
route("GET", "/api/v1/monitor/system-resource", (ctx) => ok(ctx.res, buildSystemResource()));
route("POST", "/api/v1/monitor/cache/refresh", (ctx) => ok(ctx.res, { updatedAt: nowIso() }, "缓存已刷新"));
route("POST", "/api/v1/monitor/cache/clear", async (ctx) => ok(ctx.res, { namespace: ctx.body.namespace || ctx.query.namespace, cleared: true }, "缓存已清理"));

// ---------- visitor analytics ----------
route("GET", "/api/v1/monitor/visitor-analytics", (ctx) => {
  const records = range(8).map((i) => ({
    id: i + 1,
    alias: "访客-" + (i + 1),
    signature: "sig-" + crypto.randomUUID().slice(0, 8),
    account: i % 2 ? userSeeds[i % userSeeds.length][0] : "unknown",
    visitorType: pick(["稳定办公访客", "移动巡检访客", "夜间活跃访客", "高频切换访客"]),
    isDemoAccount: i % 3 === 0,
    ip: `203.0.113.${10 + i}`,
    location: pick(["北京", "上海", "深圳", "杭州"]),
    browser: pick(["Chrome", "Safari", "Edge"]),
    os: pick(["Windows 11", "macOS 14", "iOS 17"]),
    deviceType: pick(["desktop", "mobile", "tablet"]),
    deviceLabel: pick(["Windows 11 / Chrome", "macOS 14 / Safari", "iPhone / Safari"]),
    confidence: 0.6 + (i % 4) * 0.1,
    riskLevel: pick(["LOW", "MEDIUM", "HIGH"]),
    firstVisitAt: daysAgo(10 - i),
    lastVisitAt: daysAgo(i),
    sessionCount: 3 + i,
    pageViewCount: 20 + i * 7,
    avgDuration: "00:" + pad(2 + i) + ":12",
    topPaths: ["/dashboard/analysis", "/system/user", "/mall/product"],
    signals: [{ label: "账号复用", score: 0.8, desc: "多个会话共享同一账号" }],
    suggestions: ["建议复核账号真实性"],
    activeHours: [9, 10, 14, 15, 20, 21],
    activityDates: [daysAgo(1).slice(0, 10), daysAgo(2).slice(0, 10)]
  }));
  const paged = paginate(records, ctx.query);
  return ok(ctx.res, {
    snapshotAt: nowIso(),
    summary: {
      visitorCount: records.length,
      businessVisitorCount: 6,
      demoVisitorCount: 2,
      lifetimeVisitorCount: 120,
      lifetimeDemoVisitorCount: 30,
      uniqueAccounts: 8,
      totalSessions: 328,
      totalPageViews: 2084,
      highRiskCount: 2,
      highConfidenceCount: 5,
      averageConfidence: 0.78,
      accountReuseRate: 0.35
    },
    trends: {
      "7d": { labels: range(7).map((i) => daysAgo(6 - i).slice(5, 10)), visits: range(7).map((i) => 20 + i * 5), visitors: range(7).map((i) => 8 + i * 2), trusted: range(7).map((i) => 6 + i * 2) },
      "14d": { labels: range(14).map((i) => daysAgo(13 - i).slice(5, 10)), visits: range(14).map((i) => 15 + i * 3), visitors: range(14).map((i) => 6 + i), trusted: range(14).map((i) => 5 + i) }
    },
    identityRules: [
      { title: "设备指纹", weight: "40%", desc: "基于 UA、Canvas、WebGL 组合" },
      { title: "账号活跃规律", weight: "30%", desc: "分析登录时段规律" },
      { title: "网络特征", weight: "30%", desc: "IP、端口、TLS 指纹" }
    ],
    confidenceBuckets: [
      { label: "0-0.4", count: 2, color: "#909399", percent: 25 },
      { label: "0.4-0.7", count: 3, color: "#e6a23c", percent: 37 },
      { label: "0.7-1.0", count: 3, color: "#67c23a", percent: 37 }
    ],
    deviceDistribution: [
      { name: "PC", value: 5 }, { name: "移动端", value: 2 }, { name: "平板", value: 1 }
    ],
    browserBreakdown: [
      { name: "Chrome", count: 4, percent: 50, icon: "ri:chrome-line", iconBg: "#ecfdf5", iconColor: "#34d399", barColor: "#34d399", note: "主要浏览器" },
      { name: "Safari", count: 2, percent: 25, icon: "ri:safari-line", iconBg: "#eff6ff", iconColor: "#60a5fa", barColor: "#60a5fa", note: "" },
      { name: "Edge", count: 2, percent: 25, icon: "ri:edge-line", iconBg: "#f0f9ff", iconColor: "#38bdf8", barColor: "#38bdf8", note: "" }
    ],
    hourlyActivity: { labels: range(24).map((i) => i + "时"), values: range(24).map((i) => (i >= 9 && i <= 18 ? 5 + Math.floor(Math.random() * 8) : Math.floor(Math.random() * 3))) },
    sharedAccountRanking: [
      { account: "zhangsan", visitors: 12, sessions: 30, percent: 22, label: "高频共享", tagType: "danger", color: "#f56c6c" },
      { account: "admin", visitors: 8, sessions: 18, percent: 15, label: "中频", tagType: "warning", color: "#e6a23c" },
      { account: "lisi", visitors: 5, sessions: 10, percent: 9, label: "低频", tagType: "info", color: "#909399" }
    ],
    anomalyAlerts: [
      { title: "异地同时登录", desc: "同一账号短时在多地登录", level: "高", type: "danger" },
      { title: "非常规时段活跃", desc: "凌晨 3 点出现高频访问", level: "中", type: "warning" }
    ],
    records: paged
  });
});
// ---------- scheduler ----------
route("GET", "/api/v1/scheduled-tasks/handlers", (ctx) => ok(ctx.res, taskHandlers));
route("POST", "/api/v1/scheduled-tasks/cron/preview", async (ctx) => {
  const data = ctx.body;
  const count = data.count || 5;
  return ok(ctx.res, {
    expression: data.cronExpression || "0 0 3 * * ?",
    timeZone: data.timeZone || "Asia/Shanghai",
    description: "Cron 表达式描述",
    nextRuns: range(Math.min(count, 10)).map((i) => ({ runAt: daysAgo(-(i + 1)), displayText: `下一次执行 ${i + 1}` })),
    warnings: []
  });
});
route("GET", "/api/v1/scheduled-tasks", (ctx) => {
  const q = ctx.query;
  let list = scheduledTasks.slice();
  if (q.keyword) list = list.filter((t) => t.name.includes(q.keyword) || t.code.includes(q.keyword));
  if (q.status) list = list.filter((t) => t.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/scheduled-tasks/:id", (ctx) => {
  const item = scheduledTasks.find((t) => t.id === Number(ctx.params.id));
  return item ? ok(ctx.res, { ...item, recentLogs: taskLogs.filter((l) => l.taskId === item.id).slice(0, 3) }) : jsonResponse(ctx.res, 404, null, "任务不存在");
});
route("POST", "/api/v1/scheduled-tasks", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextTaskId++, taskNo: "TASK-" + pad(nextTaskId + 1000, 5), ...data, status: data.status || "DISABLED", concurrencyPolicy: data.concurrencyPolicy || "FORBID", createdAt: nowIso(), updatedAt: nowIso(), creatorName: "Super", updaterName: "Super", isRunning: false, logCount: 0, params: data.params || {} };
  scheduledTasks.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/scheduled-tasks/:id", async (ctx) => {
  const item = scheduledTasks.find((t) => t.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "任务不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("PATCH", "/api/v1/scheduled-tasks/:id/status", async (ctx) => {
  const item = scheduledTasks.find((t) => t.id === Number(ctx.params.id));
  if (item && ctx.body) item.status = ctx.body.status;
  return ok(ctx.res, item || null, "状态已更新");
});
route("POST", "/api/v1/scheduled-tasks/:id/run", (ctx) => ok(ctx.res, null, "已触发执行"));
route("DELETE", "/api/v1/scheduled-tasks/:id", (ctx) => ok(ctx.res, null, "删除成功"));
route("GET", "/api/v1/scheduled-tasks/logs/list", (ctx) => {
  const q = ctx.query;
  let list = taskLogs.slice();
  if (q.taskId) list = list.filter((l) => l.taskId === Number(q.taskId));
  if (q.status) list = list.filter((l) => l.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/scheduled-tasks/logs/:id", (ctx) => {
  const item = taskLogs.find((l) => l.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "日志不存在");
});
route("DELETE", "/api/v1/scheduled-tasks/logs", (ctx) => ok(ctx.res, { count: 1 }, "删除成功"));
route("DELETE", "/api/v1/scheduled-tasks/logs/clear", (ctx) => ok(ctx.res, null, "清空成功"));

// ---------- security audit ----------
route("GET", "/api/v1/security-audit/overview", (ctx) => ok(ctx.res, {
  summary: {
    openCount: auditEvents.filter((e) => e.status === "OPEN").length,
    criticalOpenCount: auditEvents.filter((e) => e.severity === "CRITICAL" && e.status === "OPEN").length,
    todayCount: 5,
    handledTodayCount: 2,
    generatedAt: nowIso()
  },
  severityBuckets: ["LOW", "MEDIUM", "HIGH", "CRITICAL"].map((severity) => ({ severity, count: auditEvents.filter((e) => e.severity === severity).length })),
  topRiskIps: [{ ip: "45.77.2.13", count: 6, maxRiskScore: 86, lastOccurredAt: daysAgo(0) }, { ip: "45.77.2.15", count: 3, maxRiskScore: 55, lastOccurredAt: daysAgo(1) }],
  recentEvents: auditEvents.slice(0, 5)
}));
route("GET", "/api/v1/security-audit/events", (ctx) => {
  const q = ctx.query;
  let list = auditEvents.slice();
  if (q.severity) list = list.filter((e) => e.severity === q.severity);
  if (q.status) list = list.filter((e) => e.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/security-audit/events/:id", (ctx) => {
  const item = auditEvents.find((e) => e.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "事件不存在");
});
route("PATCH", "/api/v1/security-audit/events/:id/status", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "状态已更新"));
// ---------- mall ----------
function mallProductOverview() {
  return {
    total: mallProducts.length,
    draft: mallProducts.filter((p) => p.status === "DRAFT").length,
    pending: mallProducts.filter((p) => p.status === "PENDING").length,
    onSale: mallProducts.filter((p) => p.status === "ON_SALE").length,
    offShelf: mallProducts.filter((p) => p.status === "OFF_SHELF").length,
    lowStock: 2,
    totalStock: mallProducts.reduce((s, p) => s + p.totalStock, 0),
    lockedStock: mallProducts.reduce((s, p) => s + p.lockedStock, 0),
    totalSales: mallProducts.reduce((s, p) => s + p.totalSales, 0)
  };
}
function mallOrderOverview() {
  return {
    total: mallOrders.length,
    pendingPayment: mallOrders.filter((o) => o.orderStatus === "PENDING_PAYMENT").length,
    pendingShipment: mallOrders.filter((o) => o.orderStatus === "PENDING_SHIPMENT" || o.orderStatus === "PAID").length,
    shipped: mallOrders.filter((o) => o.orderStatus === "SHIPPED").length,
    completed: mallOrders.filter((o) => o.orderStatus === "COMPLETED").length,
    cancelled: mallOrders.filter((o) => o.orderStatus === "CANCELLED").length,
    refundPending: 0,
    totalAmount: mallOrders.reduce((s, o) => s + o.payAmount, 0),
    todayOrderCount: 3
  };
}
route("GET", "/api/v1/mall/products/overview", (ctx) => ok(ctx.res, mallProductOverview()));
route("GET", "/api/v1/mall/products", (ctx) => {
  const q = ctx.query;
  let list = mallProducts.slice();
  if (q.keyword) list = list.filter((p) => p.name.includes(q.keyword));
  if (q.status) list = list.filter((p) => p.status === q.status);
  if (q.categoryId) list = list.filter((p) => p.categoryId === Number(q.categoryId));
  if (q.tab === "recycle") list = [];
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/mall/products/:id", (ctx) => {
  const item = mallProducts.find((p) => p.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "商品不存在");
});
route("POST", "/api/v1/mall/products", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextMallProductId++, productNo: "P-" + pad(5000 + nextMallProductId, 5), ...data, status: data.status || "DRAFT", totalStock: data.skus ? data.skus.reduce((s, k) => s + (k.stock || 0), 0) : 0, lockedStock: 0, totalSales: 0, createdAt: nowIso(), updatedAt: nowIso(), galleryUrls: data.galleryUrls || [], sellingPoints: data.sellingPoints || [], tags: data.tags || [], seoKeywords: [], skus: data.skus || [] };
  mallProducts.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/mall/products/:id", async (ctx) => {
  const item = mallProducts.find((p) => p.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "商品不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("POST", "/api/v1/mall/products/:id/copy", (ctx) => {
  const item = mallProducts.find((p) => p.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "商品不存在");
  const copy = { ...item, id: nextMallProductId++, name: item.name + " 副本", productNo: "P-" + pad(9000 + item.id, 5), status: "DRAFT", createdAt: nowIso(), updatedAt: nowIso() };
  mallProducts.push(copy);
  return ok(ctx.res, copy, "复制成功");
});
route("PATCH", "/api/v1/mall/products/:id/on-sale", (ctx) => ok(ctx.res, null, "已上架"));
route("PATCH", "/api/v1/mall/products/:id/off-shelf", (ctx) => ok(ctx.res, null, "已下架"));
route("DELETE", "/api/v1/mall/products/:id", (ctx) => ok(ctx.res, null, "已移入回收站"));

route("GET", "/api/v1/mall/categories", (ctx) => {
  const q = ctx.query;
  let list = mallCategories.slice();
  if (q.keyword) list = list.filter((c) => c.name.includes(q.keyword));
  const map = new Map(list.map((c) => [c.id, { ...c, children: [] }]));
  const roots = [];
  map.forEach((node) => {
    if (node.parentId && map.has(node.parentId)) map.get(node.parentId).children.push(node);
    else roots.push(node);
  });
  return ok(ctx.res, roots);
});
route("POST", "/api/v1/mall/categories", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextMallCatId++, ancestorPath: "/" + nextMallCatId, ...data, enabled: data.enabled ?? true, createdAt: nowIso(), updatedAt: nowIso(), children: [] };
  mallCategories.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/mall/categories/:id", async (ctx) => {
  const item = mallCategories.find((c) => c.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "分类不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/mall/categories/:id", (ctx) => ok(ctx.res, null, "删除成功"));

route("GET", "/api/v1/mall/orders/overview", (ctx) => ok(ctx.res, mallOrderOverview()));
route("GET", "/api/v1/mall/orders", (ctx) => {
  const q = ctx.query;
  let list = mallOrders.slice();
  if (q.keyword) list = list.filter((o) => o.orderNo.includes(q.keyword) || o.recipientName.includes(q.keyword));
  if (q.orderStatus) list = list.filter((o) => o.orderStatus === q.orderStatus);
  if (q.paymentStatus) list = list.filter((o) => o.paymentStatus === q.paymentStatus);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/mall/orders/:id", (ctx) => {
  const item = mallOrders.find((o) => o.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "订单不存在");
});
route("POST", "/api/v1/mall/orders", async (ctx) => {
  const data = ctx.body;
  const order = { id: nextMallOrderId++, orderNo: "O-" + pad(6000 + nextMallOrderId, 6), ...data, orderStatus: data.orderStatus || "PENDING_PAYMENT", paymentStatus: "UNPAID", fulfillmentStatus: "UNFULFILLED", createdAt: nowIso(), updatedAt: nowIso(), items: data.items || [], operateLogs: [] };
  mallOrders.push(order);
  return ok(ctx.res, order, "下单成功");
});
route("GET", "/api/v1/mall/orders/customer-suggestions", (ctx) => ok(ctx.res, {
  items: [
    { orderId: 1, customerName: "张三", suggestion: "希望提供优惠券", createdAt: daysAgo(2) },
    { orderId: 3, customerName: "李四", suggestion: "配送等待时间过长", createdAt: daysAgo(1) }
  ],
  total: 2
}));
route("PATCH", "/api/v1/mall/orders/:id/pay", async (ctx) => ok(ctx.res, null, "已支付"));
route("PATCH", "/api/v1/mall/orders/:id/ship", async (ctx) => ok(ctx.res, null, "已发货"));
route("PATCH", "/api/v1/mall/orders/:id/close", async (ctx) => ok(ctx.res, null, "已关闭"));
route("PATCH", "/api/v1/mall/orders/:id/note", async (ctx) => ok(ctx.res, null, "备注已保存"));

// ---------- generic mall sub-resource handlers ----------
// These handle all mall sub-resource endpoints not explicitly defined above
// Matches: /api/v1/mall/:resource, /api/v1/mall/:resource/:id, /api/v1/mall/:resource/:id/subaction
const mallSubResources = [
  "brands", "product-reviews", "aftersales", "aftersale-notice", "attribute-templates",
  "product-services", "express-companies", "shipping-templates", "warehouses",
  "inbound-orders", "outbound-orders", "transfer-orders", "stocktake-orders",
  "inventory-logs", "inventory-query", "order-shipments", "payment-channels"
];
// enabled/options endpoints
for (const resource of mallSubResources) {
  route("GET", "/api/v1/mall/" + resource + "/enabled/options", (ctx) => ok(ctx.res, [{ id: 1, name: "默认选项", value: "default" }]));
}
// list paginated
for (const resource of mallSubResources) {
  route("GET", "/api/v1/mall/" + resource, (ctx) => ok(ctx.res, paginate([], ctx.query)));
}
// create
for (const resource of mallSubResources) {
  route("POST", "/api/v1/mall/" + resource, async (ctx) => ok(ctx.res, { id: 1, ...ctx.body }, "新增成功"));
}
// detail
for (const resource of mallSubResources) {
  route("GET", "/api/v1/mall/" + resource + "/:id", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), name: "mock", enabled: true }));
}
// update
for (const resource of mallSubResources) {
  route("PATCH", "/api/v1/mall/" + resource + "/:id", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "更新成功"));
}
// delete
for (const resource of mallSubResources) {
  route("DELETE", "/api/v1/mall/" + resource + "/:id", (ctx) => ok(ctx.res, null, "删除成功"));
}
// enable/disable toggle
for (const resource of mallSubResources) {
  route("PATCH", "/api/v1/mall/" + resource + "/:id/enabled", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), enabled: true }, "操作成功"));
}
// product-reviews batch operations
for (const action of ["batch/toggle-visible", "batch/toggle-top", "batch/toggle-recommend"]) {
  route("POST", "/api/v1/mall/product-reviews/" + action, async (ctx) => ok(ctx.res, { count: 1 }, "批量操作成功"));
}
// product-reviews aggregate
route("GET", "/api/v1/mall/product-reviews/aggregate/:productId", (ctx) => ok(ctx.res, { productId: Number(ctx.params.productId), totalReviews: 0, averageRating: 0, ratingDistribution: [] }));
// aftersales operations
route("POST", "/api/v1/mall/aftersales/:id/approve", async (ctx) => ok(ctx.res, null, "已同意"));
route("POST", "/api/v1/mall/aftersales/:id/reject", async (ctx) => ok(ctx.res, null, "已驳回"));
route("POST", "/api/v1/mall/aftersales/:id/refund", async (ctx) => ok(ctx.res, null, "已退款"));
route("POST", "/api/v1/mall/aftersales/:id/cancel", async (ctx) => ok(ctx.res, null, "已取消"));
// inbound / outbound operations
for (const resource of ["inbound-orders", "outbound-orders"]) {
  route("POST", "/api/v1/mall/" + resource + "/:id/confirm", async (ctx) => ok(ctx.res, null, "已确认"));
  route("POST", "/api/v1/mall/" + resource + "/:id/void", async (ctx) => ok(ctx.res, null, "已作废"));
}
// transfer operations
for (const action of ["receive", "review", "ship", "void"]) {
  route("POST", "/api/v1/mall/transfer-orders/:id/" + action, async (ctx) => ok(ctx.res, null, "操作成功"));
}
// stocktake operations
for (const action of ["start", "complete", "void"]) {
  route("POST", "/api/v1/mall/stocktake-orders/:id/" + action, async (ctx) => ok(ctx.res, null, "操作成功"));
}

// ---------- mall payment sub-module ----------
// payment-channels
route("GET", "/api/v1/mall/payment/channels", (ctx) => ok(ctx.res, paginate([], ctx.query)));
route("GET", "/api/v1/mall/payment/channels/:id", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), name: "mock通道", enabled: true }));
route("POST", "/api/v1/mall/payment/channels", async (ctx) => ok(ctx.res, { id: 1, ...ctx.body }, "新增成功"));
route("PATCH", "/api/v1/mall/payment/channels/:id", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), ...ctx.body }, "更新成功"));
route("PATCH", "/api/v1/mall/payment/channels/:id/enable", async (ctx) => ok(ctx.res, { id: Number(ctx.params.id), enabled: true }, "操作成功"));
route("POST", "/api/v1/mall/payment/channels/:id/test", async (ctx) => ok(ctx.res, { success: true, message: "测试成功" }, "测试成功"));
route("DELETE", "/api/v1/mall/payment/channels/:id", (ctx) => ok(ctx.res, null, "删除成功"));
// payment-transactions
route("GET", "/api/v1/mall/payment/transactions", (ctx) => ok(ctx.res, paginate([], ctx.query)));
route("GET", "/api/v1/mall/payment/transactions/:id", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), status: "SUCCESS", amount: 100 }));
route("GET", "/api/v1/mall/payment/by-order/:orderId", (ctx) => ok(ctx.res, { orderId: Number(ctx.params.orderId), transactions: [] }));
route("GET", "/api/v1/mall/payment/orders/:orderId/payments", (ctx) => ok(ctx.res, { orderId: Number(ctx.params.orderId), payments: [] }));
// payment-webhooks
route("GET", "/api/v1/mall/payment/webhook-events", (ctx) => ok(ctx.res, paginate([], ctx.query)));
route("GET", "/api/v1/mall/payment/webhook-events/:id", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), status: "PENDING", event: "mock" }));
route("POST", "/api/v1/mall/payment/webhook-events/:id/retry", async (ctx) => ok(ctx.res, null, "已重试"));
// general payment
route("POST", "/api/v1/mall/payment/orders/:orderId/payments", async (ctx) => ok(ctx.res, { id: 1, status: "PENDING" }, "发起支付成功"));
route("GET", "/api/v1/mall/payment/transactions/:id/query", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), status: "SUCCESS" }));
route("POST", "/api/v1/mall/payment/transactions/:id/close", async (ctx) => ok(ctx.res, null, "已关闭"));
// refunds
route("POST", "/api/v1/mall/payment/refunds/aftersales/:aftersaleId", async (ctx) => ok(ctx.res, { id: 1, status: "PENDING" }, "退款发起成功"));
route("POST", "/api/v1/mall/payment/refunds/:id/retry", async (ctx) => ok(ctx.res, null, "已重试"));
route("GET", "/api/v1/mall/payment/refunds/:id", (ctx) => ok(ctx.res, { id: Number(ctx.params.id), status: "SUCCESS", amount: 100 }));
// aftersale-notice
route("GET", "/api/v1/mall/aftersale-notice", (ctx) => ok(ctx.res, { id: 1, notice: "mock售后通知" }));
route("PATCH", "/api/v1/mall/aftersale-notice", async (ctx) => ok(ctx.res, { ...ctx.body }, "更新成功"));
// product batch operations
route("POST", "/api/v1/mall/products/batch/on-sale", async (ctx) => ok(ctx.res, { count: 1 }, "批量上架成功"));
route("POST", "/api/v1/mall/products/batch/off-shelf", async (ctx) => ok(ctx.res, { count: 1 }, "批量下架成功"));
route("POST", "/api/v1/mall/products/batch/recycle", async (ctx) => ok(ctx.res, { count: 1 }, "批量回收成功"));
route("POST", "/api/v1/mall/products/batch/assign-warehouse", async (ctx) => ok(ctx.res, { count: 1 }, "批量分配仓库成功"));
route("POST", "/api/v1/mall/products/batch/export", async (ctx) => ok(ctx.res, { count: 1 }, "批量导出已触发"));
// ---------- workflow ----------
const workflowMeta = {
  categories: [
    { value: "travel", label: "差旅报销" },
    { value: "hr", label: "人事行政" },
    { value: "finance", label: "财务审批" }
  ],
  definitionStatuses: workflowStatuses.map((s) => ({ value: s, label: s })),
  instanceStatuses: ["IN_PROGRESS", "APPROVED", "REJECTED", "CANCELLED", "AUTO_SKIPPED"].map((s) => ({ value: s, label: s })),
  taskStatuses: ["PENDING", "APPROVED", "REJECTED", "CANCELLED", "SKIPPED"].map((s) => ({ value: s, label: s })),
  priorities: ["LOW", "MEDIUM", "HIGH", "URGENT"].map((s) => ({ value: s, label: s })),
  fieldTypes: ["INPUT", "TEXTAREA", "NUMBER", "AMOUNT", "DATE", "DATE_RANGE", "DATETIME", "SELECT", "RADIO", "CHECKBOX", "SWITCH", "USER", "DEPARTMENT", "ATTACHMENT", "IMAGE_VIDEO", "DOCUMENT"].map((s) => ({ value: s, label: s })),
  approverTypes: ["USER", "ROLE", "DEPARTMENT", "STARTER_MANAGER"].map((s) => ({ value: s, label: s })),
  approveModes: ["ANY", "ALL"].map((s) => ({ value: s, label: s })),
  nodeTypes: ["START", "APPROVAL", "CONDITION", "CC", "END"].map((s) => ({ value: s, label: s })),
  users: users.map((u) => ({ value: u.id, label: u.username })),
  departments: departments.map((d) => ({ value: d.id, label: d.name }))
};
route("GET", "/api/v1/workflows/definitions/meta", (ctx) => ok(ctx.res, workflowMeta));
route("GET", "/api/v1/workflows/categories", (ctx) => {
  const q = ctx.query;
  let list = workflowCategories.slice();
  if (q.keyword) list = list.filter((c) => c.name.includes(q.keyword));
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/workflows/categories/enabled/options", (ctx) => ok(ctx.res, workflowCategories.filter((c) => c.enabled)));
route("POST", "/api/v1/workflows/categories", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextWorkflowCatId++, code: "wf-cat-" + nextWorkflowCatId, ...data, enabled: data.enabled ?? true, definitionCount: 0, instanceCount: 0, createdAt: nowIso(), updatedAt: nowIso() };
  workflowCategories.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/workflows/categories/:id", async (ctx) => {
  const item = workflowCategories.find((c) => c.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "分类不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("DELETE", "/api/v1/workflows/categories/:id", (ctx) => ok(ctx.res, null, "删除成功"));

route("GET", "/api/v1/workflows/definitions/overview", (ctx) => ok(ctx.res, {
  total: workflowDefinitions.length,
  enabled: workflowDefinitions.filter((d) => d.status === "ENABLED").length,
  draft: workflowDefinitions.filter((d) => d.status === "DRAFT").length,
  disabled: workflowDefinitions.filter((d) => d.status === "DISABLED").length,
  archived: workflowDefinitions.filter((d) => d.status === "ARCHIVED").length,
  totalInstances: workflowInstances.length
}));
route("GET", "/api/v1/workflows/definitions/options", (ctx) => ok(ctx.res, workflowDefinitions.map((d) => ({ id: d.id, name: d.name, code: d.code, category: d.category, summary: d.summary, color: d.color, icon: d.icon, formSchema: d.formSchema, stageSchema: d.stageSchema, flowSchema: d.flowSchema }))));
route("GET", "/api/v1/workflows/definitions", (ctx) => {
  const q = ctx.query;
  let list = workflowDefinitions.slice();
  if (q.keyword) list = list.filter((d) => d.name.includes(q.keyword) || d.code.includes(q.keyword));
  if (q.status) list = list.filter((d) => d.status === q.status);
  if (q.category) list = list.filter((d) => d.category === q.category);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/workflows/definitions/:id", (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "流程不存在");
});
route("POST", "/api/v1/workflows/definitions", async (ctx) => {
  const data = ctx.body;
  const item = { id: nextWfDefId++, workflowNo: "WF-" + pad(7000 + nextWfDefId, 5), ...data, code: data.code || "wf_" + nextWfDefId, status: data.status || "DRAFT", version: 1, schemaVersion: 1, instanceCount: 0, taskCount: 0, creator: { id: 1, username: "Super" }, updater: { id: 1, username: "Super" }, createdAt: nowIso(), updatedAt: nowIso(), formSchema: data.formSchema || [], stageSchema: data.stageSchema || [], flowSchema: data.flowSchema || { nodes: [], edges: [] } };
  workflowDefinitions.push(item);
  return ok(ctx.res, item, "新增成功");
});
route("PATCH", "/api/v1/workflows/definitions/:id", async (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "流程不存在");
  Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item, "更新成功");
});
route("POST", "/api/v1/workflows/definitions/:id/save-draft", async (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  if (item && ctx.body) Object.assign(item, ctx.body, { updatedAt: nowIso() });
  return ok(ctx.res, item || null, "草稿已保存");
});
route("POST", "/api/v1/workflows/definitions/validate", async (ctx) => ok(ctx.res, { valid: true, schemaVersion: 1, nodeCount: 3, edgeCount: 2, diagnostics: [], warnings: [] }));
route("POST", "/api/v1/workflows/definitions/:id/validate", async (ctx) => ok(ctx.res, { valid: true, schemaVersion: 1, nodeCount: 3, edgeCount: 2, diagnostics: [], warnings: [] }));
route("POST", "/api/v1/workflows/definitions/:id/publish", async (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  if (item) { item.status = "ENABLED"; item.publishedAt = nowIso(); item.updatedAt = nowIso(); }
  return ok(ctx.res, item || null, "已发布");
});
route("POST", "/api/v1/workflows/definitions/:id/preview", async (ctx) => ok(ctx.res, {
  definitionId: Number(ctx.params.id),
  definitionVersion: 1,
  schemaVersion: 1,
  variables: { starter: { userId: 1, username: "Super", departmentId: 2 }, formData: ctx.body.formData || {} },
  formSchema: [],
  steps: [{ nodeId: "start", nodeName: "开始", nodeType: "START", status: "success", message: "通过" }],
  tasks: [],
  records: [],
  warnings: []
}));
route("POST", "/api/v1/workflows/definitions/:id/simulate", async (ctx) => ok(ctx.res, {
  definitionId: Number(ctx.params.id),
  definitionVersion: 1,
  schemaVersion: 1,
  variables: { starter: { userId: 1, username: "Super", departmentId: 2 }, formData: ctx.body.formData || {} },
  formSchema: [],
  steps: [{ nodeId: "start", nodeName: "开始", nodeType: "START", status: "success", message: "通过" }],
  tasks: [],
  records: [],
  warnings: []
}));
route("GET", "/api/v1/workflows/definitions/:id/versions", (ctx) => ok(ctx.res, workflowDefinitions.map((d) => ({ id: d.id * 10, definitionId: d.id, version: d.version, status: d.status, name: d.name, code: d.code, category: d.category, schemaVersion: 1, changeSummary: null, publishSummary: null, diagnosticsSnapshot: null, publishedBy: 1, publishedByName: "Super", publishedAt: d.publishedAt || d.createdAt, restoredFromId: null })).filter((v) => v.definitionId === Number(ctx.params.id))));
route("GET", "/api/v1/workflows/definitions/:id/versions/:versionId", (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  return item ? ok(ctx.res, { ...item, id: Number(ctx.params.versionId), publishedBy: 1, publishedByName: "Super", publishedAt: item.publishedAt || item.createdAt }) : jsonResponse(ctx.res, 404, null, "版本不存在");
});
route("GET", "/api/v1/workflows/definitions/:id/versions/:versionId/diff", (ctx) => ok(ctx.res, { fromVersion: Number(ctx.params.versionId) - 1, toVersion: Number(ctx.params.versionId), items: [{ scope: "FORM", type: "ADDED", targetId: "title", title: "新增表单字段", description: "增加标题字段" }] }));
route("POST", "/api/v1/workflows/definitions/:id/versions/rollback", async (ctx) => ok(ctx.res, null, "已回滚"));
route("PATCH", "/api/v1/workflows/definitions/:id/status", async (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  if (item && ctx.body) item.status = ctx.body.status;
  return ok(ctx.res, item || null, "状态已更新");
});
route("POST", "/api/v1/workflows/definitions/:id/copy", (ctx) => {
  const item = workflowDefinitions.find((d) => d.id === Number(ctx.params.id));
  if (!item) return jsonResponse(ctx.res, 404, null, "流程不存在");
  const copy = { ...item, id: nextWfDefId++, name: item.name + " 副本", code: item.code + "_copy", status: "DRAFT", version: 1, createdAt: nowIso(), updatedAt: nowIso() };
  workflowDefinitions.push(copy);
  return ok(ctx.res, copy, "复制成功");
});
route("DELETE", "/api/v1/workflows/definitions/:id", (ctx) => ok(ctx.res, null, "删除成功"));

route("GET", "/api/v1/workflows/instances/overview", (ctx) => ok(ctx.res, {
  total: workflowInstances.length,
  inProgress: workflowInstances.filter((i) => i.status === "IN_PROGRESS").length,
  approved: workflowInstances.filter((i) => i.status === "APPROVED").length,
  rejected: workflowInstances.filter((i) => i.status === "REJECTED").length,
  cancelled: workflowInstances.filter((i) => i.status === "CANCELLED").length,
  pendingMine: 1
}));
route("GET", "/api/v1/workflows/instances", (ctx) => {
  const q = ctx.query;
  let list = workflowInstances.slice();
  if (q.keyword) list = list.filter((i) => i.title.includes(q.keyword) || i.instanceNo.includes(q.keyword));
  if (q.status) list = list.filter((i) => i.status === q.status);
  return ok(ctx.res, paginate(list, q));
});
route("GET", "/api/v1/workflows/instances/:id", (ctx) => {
  const item = workflowInstances.find((i) => i.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "实例不存在");
});
route("POST", "/api/v1/workflows/instances", async (ctx) => {
  const data = ctx.body;
  const def = workflowDefinitions.find((d) => d.id === data.definitionId) || workflowDefinitions[0];
  const item = { id: nextWfInstanceId++, instanceNo: "INS-" + pad(8000 + nextWfInstanceId, 5), definitionId: def.id, definitionCode: def.code, definitionName: def.name, definitionVersion: def.version, title: data.title || def.name + " 新实例", businessKey: null, category: def.category, status: "IN_PROGRESS", priority: data.priority || "MEDIUM", allowCancel: true, settings: {}, formData: data.formData || {}, formSchema: [], stageSchema: [], flowSchema: { nodes: [], edges: [] }, canvasSchema: null, schemaVersion: 1, currentStageIndex: 0, currentStageKey: "approval", currentStageName: "审核审批", currentNodeId: "start", currentNodeType: "START", currentTaskCount: 0, startedBy: 1, startedDeptId: 2, startedAt: nowIso(), lastActionAt: null, finishedAt: null, cancelReason: null, createdAt: nowIso(), updatedAt: nowIso(), starter: { id: 1, username: "Super", department: { id: 2, name: "技术部" } }, pendingApprovers: [], taskCount: 0, recordCount: 1, hasApprovalAction: false, tasks: [], records: [{ id: 1, action: "SUBMIT", stageIndex: 0, stageKey: "start", stageName: "申请提交", operatorId: 1, operatorName: "Super", comment: "提交申请", payload: null, createdAt: nowIso() }] };
  workflowInstances.push(item);
  return ok(ctx.res, item, "已发起流程");
});
route("POST", "/api/v1/workflows/instances/:id/cancel", async (ctx) => ok(ctx.res, null, "已取消"));
route("GET", "/api/v1/workflows/tasks/overview", (ctx) => ok(ctx.res, { pending: 2, processed: 4, approvedToday: 3, rejectedToday: 0, urgentPending: 1 }));
route("GET", "/api/v1/workflows/tasks/pending", (ctx) => ok(ctx.res, paginate(workflowTasks.filter((t) => t.status === "PENDING").slice(), ctx.query)));
route("GET", "/api/v1/workflows/tasks/processed", (ctx) => ok(ctx.res, paginate(workflowTasks.filter((t) => t.status !== "PENDING").slice(), ctx.query)));
route("GET", "/api/v1/workflows/tasks/:id", (ctx) => {
  const item = workflowTasks.find((t) => t.id === Number(ctx.params.id));
  return item ? ok(ctx.res, item) : jsonResponse(ctx.res, 404, null, "任务不存在");
});
route("POST", "/api/v1/workflows/tasks/:id/approve", async (ctx) => ok(ctx.res, null, "已通过"));
route("POST", "/api/v1/workflows/tasks/:id/reject", async (ctx) => ok(ctx.res, null, "已驳回"));
route("POST", "/api/v1/workflows/tasks/:id/comment", async (ctx) => ok(ctx.res, null, "评论已提交"));
route("POST", "/api/v1/workflows/tasks/:id/transfer", async (ctx) => ok(ctx.res, null, "已转办"));
route("POST", "/api/v1/workflows/tasks/:id/add-sign", async (ctx) => ok(ctx.res, null, "已加签"));
route("POST", "/api/v1/workflows/attachments/upload", async (ctx) => ok(ctx.res, { id: 1, url: "/mock/wf-upload", name: "附件.png" }));
route("POST", "/api/v1/workflows/attachments/:id/download-url", (ctx) => ok(ctx.res, { url: "/mock/wf-download/" + ctx.params.id, expiresAt: daysAgo(-1) }));
// ---------- ai generator ----------
// 真实 AI 供方配置（通过环境变量覆盖，测试时内嵌默认值）
const AI_BASE_URL = process.env.AI_BASE_URL || "https://token.sensenova.cn/v1";
const AI_API_KEY = process.env.AI_API_KEY || "sk-gwrg3eQ8UFDwTPtza6qYedhFEeRBjahU";
const AI_MODEL = process.env.AI_MODEL || "deepseek-v4-flash";
const AI_REASONING_EFFORT = process.env.AI_REASONING_EFFORT || "high";

// 统一调用 chat/completions 并取回纯文本
function aiChat(messages, { maxTokens = 4000, temperature = 0.3, retries = 2, retryDelayMs = 1200 } = {}) {
  const attempt = (round) => new Promise((resolve, reject) => {
    const payload = JSON.stringify({
      model: AI_MODEL,
      messages,
      max_tokens: maxTokens,
      temperature,
      reasoning_effort: AI_REASONING_EFFORT
    });
    const req = https.request(
      AI_BASE_URL + "/chat/completions",
      { method: "POST", headers: { "Content-Type": "application/json", Authorization: "Bearer " + AI_API_KEY } },
      (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          // 瞬时故障可重试：503 / 429 / 5xx / 连接重置
          const retryable =
            res.statusCode >= 500 || res.statusCode === 429 || res.statusCode === 408;
          if (res.statusCode !== 200) {
            const err = new Error("AI " + res.statusCode + ": " + data.slice(0, 300));
            err.retryable = retryable;
            return reject(err);
          }
          try {
            const json = JSON.parse(data);
            const content = json.choices?.[0]?.message?.content || "";
            if (!content.trim()) {
              const err = new Error("AI 返回空内容（可能 token 不足或触发安全限制）");
              err.retryable = true;
              return reject(err);
            }
            resolve(content);
          } catch {
            const err = new Error("AI 响应解析失败");
            err.retryable = true;
            return reject(err);
          }
        });
      }
    );
    req.on("error", (e) => { e.retryable = true; reject(e); });
    req.setTimeout(60000, () => { req.destroy(new Error("AI 请求超时")); });
    req.write(payload);
    req.end();
  });

  const run = (round) =>
    attempt(round).catch((err) => {
      if (round < retries && err.retryable) {
        return new Promise((r2) => setTimeout(r2, retryDelayMs * Math.pow(2, round))).then(() =>
          run(round + 1)
        );
      }
      throw err;
    });
  return run(0);
}

// 从 AI 回复中提取第一个 JSON 对象/数组（容忍 markdown 包裹）
function extractJson(text) {
  if (!text) return null;
  const cleaned = text.replace(/```json\s*/gi, "").replace(/```/g, "").trim();
  const start = cleaned.indexOf("{");
  const arrStart = cleaned.indexOf("[");
  let begin = start;
  if (arrStart !== -1 && (begin === -1 || arrStart < begin)) begin = arrStart;
  if (begin === -1) return null;
  const slice = cleaned.slice(begin);
  try {
    return JSON.parse(slice);
  } catch {
    // 尝试截断到最后一个闭合括号
    const depthMatch = slice.match(/^[\s\S]*?(\]|\})(?=\s*$|[\s\S]*?\})/);
    try {
      const trimmed = slice.slice(0, slice.lastIndexOf("}") + 1);
      return JSON.parse(trimmed);
    } catch {
      const arrTrimmed = slice.slice(0, slice.lastIndexOf("]") + 1);
      try { return JSON.parse(arrTrimmed); } catch { return null; }
    }
  }
}

// Schema 规范化：兜底所有必填字段，保证前端可用
function normalizeSchema(raw) {
  if (!raw || typeof raw !== "object") raw = {};
  const moduleName = raw.moduleName || "demo-module";
  const moduleTitle = raw.moduleTitle || "演示模块";
  const fields = Array.isArray(raw.fields) ? raw.fields.map((f, i) => ({
    name: f?.name || "field" + (i + 1),
    label: f?.label || "字段" + (i + 1),
    type: f?.type || "string",
    required: !!f?.required,
    searchable: f?.searchable ?? true,
    tableVisible: f?.tableVisible ?? true,
    formVisible: f?.formVisible ?? true,
    sortable: !!f?.sortable,
    maxLength: f?.maxLength,
    defaultValue: f?.defaultValue,
    options: Array.isArray(f?.options) ? f.options.map((o) => ({ label: String(o?.label ?? o?.value ?? ""), value: o?.value ?? o?.label })) : undefined,
    relation: f?.relation,
    validation: f?.validation
  })) : [];
  return {
    moduleName,
    moduleTitle,
    domain: raw.domain || "system",
    entityName: raw.entityName || moduleName.replace(/-/g, "").replace(/^\w/, (c) => c.toUpperCase()),
    routePath: raw.routePath || "/system/" + moduleName.replace(/^-+/, ""),
    apiPath: raw.apiPath || "/api/v1/" + moduleName,
    features: validateFeatures(raw.features),
    fields,
    fieldGroups: Array.isArray(raw.fieldGroups) && raw.fieldGroups.length
      ? raw.fieldGroups
      : [{ key: "base", label: "基础信息", fields: fields.map((f) => f.name) }],
    uiConfig: { ...(raw.uiConfig || {}), formContainer: raw.uiConfig?.formContainer || "dialog" },
    strategy: raw.strategy,
    children: Array.isArray(raw.children) ? raw.children : [],
    permissions: Array.isArray(raw.permissions) && raw.permissions.length
      ? raw.permissions
      : ["list", "create", "update", "delete", "detail", "export"].map((a) => `${raw.apiPath || "/api/v1/" + moduleName}:${a}`)
  };
}
const ALL_FEATURES = ["list", "detail", "create", "update", "delete", "batchDelete", "statusToggle", "softDelete"];
function validateFeatures(features) {
  if (!Array.isArray(features)) return ["list", "create", "update", "delete"];
  const out = features.filter((f) => ALL_FEATURES.includes(f));
  return out.length ? out : ["list", "create", "update", "delete"];
}

// 基于 markdown-free 的 schema 生成校验结果
function buildValidationResult(schema) {
  const errors = [];
  const warnings = [];
  if (!schema.moduleName) errors.push("moduleName 不能为空");
  if (!schema.apiPath) errors.push("apiPath 不能为空");
  if (!Array.isArray(schema.fields) || !schema.fields.length) {
    errors.push("至少需要一个业务字段");
  } else {
    schema.fields.forEach((f, i) => {
      if (!f?.name) errors.push(`第 ${i + 1} 个字段缺少 name`);
      if (!f?.label) errors.push(`第 ${i + 1} 个字段缺少 label`);
      if (f?.type === "enum" && !Array.isArray(f.options)) warnings.push(`字段 ${f?.label || f?.name} 为枚举类型但缺少选项`);
    });
  }
  if (!schema.features?.length) warnings.push("未声明模块功能，将按默认列表页生成");
  return { valid: errors.length === 0, errors, warnings, schema };
}

// 生成代码预览文件
function buildPreviewFiles(schema) {
  const { moduleName, moduleTitle, entityName, fields } = schema;
  const lower = moduleName.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  const columns = fields.filter((f) => f.tableVisible !== false).map((f) => `      { prop: "${f.name}", label: "${f.label}" }`).join("\n");
  const searchFields = fields.filter((f) => f.searchable).slice(0, 3).map((f) => `        <ElInput placeholder="${f.label}" />`).join("\n");
  const formFields = fields.filter((f) => f.formVisible !== false).map((f) => `        <ElFormItem label="${f.label}"><ElInput v-model="model.${f.name}" /></ElFormItem>`).join("\n");
  const apiFields = fields.filter((f) => f.formVisible !== false).map((f) => `  ${f.name}: ${jsonTypeOf(f.type)}`).join("\n");
  return [
    {
      path: `src/views/${lower}/modules/${lower}-search.vue`,
      language: "vue",
      action: "create",
      content: `<template>\n  <div class="art-card-xs p-3"><ElForm>\n${searchFields}\n  </ElForm></div>\n</template>\n<script setup lang="ts">\ndefineOptions({ name: "${moduleName}-search" })\n</script>`
    },
    {
      path: `src/api/${lower}.ts`,
      language: "typescript",
      action: "create",
      content: `import request from "@/utils/http"\n\nconst prefix = "${schema.apiPath || "/api/v1/" + moduleName}"\nexport const fetchList = (params: any) => request.get({ url: prefix, params })\nexport const fetchCreate = (data: any) => request.post({ url: prefix, data })\nexport const fetchUpdate = (id: number, data: any) => request.patch({ url: prefix + "/" + id, data })\nexport const fetchDelete = (id: number) => request.del({ url: prefix + "/" + id })`
    },
    {
      path: `src/types/api/${lower}.d.ts`,
      language: "typescript",
      action: "create",
      content: `interface ${entityName}Payload {\n${apiFields}\n}\nexport type { ${entityName}Payload }`
    },
    {
      path: `src/views/${lower}/index.vue`,
      language: "vue",
      action: "create",
      content: `<template>\n  <div class="art-full-height">\n    <div class="art-table-card">\n      <ElTable :data="list" border>\n${columns}\n      </ElTable>\n    </div>\n    <ElDialog title="${moduleTitle}">\n${formFields}\n    </ElDialog>\n  </div>\n</template>\n<script setup lang="ts">\ndefineOptions({ name: "${moduleName}" })\n</script>`
    }
  ];
}
function jsonTypeOf(type) {
  if (type === "number") return "number";
  if (type === "boolean") return "boolean";
  if (type === "date" || type === "datetime") return "string";
  return "string";
}

// 生成写入计划文件项
function planFilesFrom(schema, generated) {
  return generated.map((g) => ({
    path: g.path,
    targetPath: g.path,
    language: g.language,
    action: g.action,
    status: "create",
    existedBefore: false,
    description: g.action === "overwrite" ? "覆盖已有文件" : "新建文件",
    previewContent: g.content,
    diffStats: { additions: g.content.split("\n").length, deletions: 0, changed: false },
    diffHunks: []
  }));
}

route("POST", "/api/v1/ai-generator/requirements/parse", async (ctx) => {
  const requirement = ctx.body?.requirement || "";
  const domain = ctx.body?.domain || "system";
  if (!requirement) return jsonResponse(ctx.res, 400, null, "需求描述不能为空");
  const systemPrompt = [
    "你是一名中后台管理系统 CRUD 模块规划师。请根据用户用自然语言描述的业务需求，输出一个符合 JSON Schema 的模块结构（ModuleSchema）。",
    "必须严格输出 JSON，不要输出任何解释、markdown 代码块标记或其他文字。",
    "ModuleSchema 结构：{ \"moduleName\":\"kebab-case 模块标识\", \"moduleTitle\":\"中文模块名\", \"domain\":\"业务域\", \"entityName\":\"PascalCase 实体名\", \"routePath\":\"/system/xxx\", \"apiPath\":\"/api/v1/xxx\", \"features\":[\"list\",\"create\",\"update\",\"delete\",\"detail\"], \"fields\":[{ \"name\":\"字段名\", \"label\":\"中文标签\", \"type\":\"string|number|boolean|enum|date|datetime|textarea|richtext|image|file|relation\", \"required\":true, \"searchable\":true, \"tableVisible\":true, \"formVisible\":true, \"options\":[{\"label\":\"\",\"value\":\"\"}] }], \"permissions\":[\"xxx:list\"] }"
  ].join("\n");
  try {
    const raw = await aiChat([
      { role: "system", content: systemPrompt },
      { role: "user", content: `业务域：${domain}\n需求描述：${requirement}` }
    ], { maxTokens: 6000, temperature: 0.2 });
    const parsed = extractJson(raw);
    if (!parsed) throw new Error("AI 未返回合法 JSON");
    const schema = normalizeSchema(parsed);
    return ok(ctx.res, buildValidationResult(schema));
  } catch (err) {
    // AI 不可用时降级为演示结构，保证流程可用；warnings 里注明原因
    console.error("  [ai-generator] parse 降级: " + (err?.message || "unknown"));
    const fallbackSchema = buildFallbackSchema(requirement, domain);
    const result = buildValidationResult(fallbackSchema);
    result.warnings.push("AI 服务暂不可用，已返回演示结构（" + (err?.message || "unknown") + "）。请稍后重试获得更准确的模块结构。");
    return ok(ctx.res, result);
  }
});

// 生成一个不依赖 AI 的演示 schema，保证 AI 不可用时流程仍可继续
function buildFallbackSchema(requirement, domain) {
  const moduleName = "demo-fallback";
  return normalizeSchema({
    moduleName,
    moduleTitle: "演示模块（" + (requirement ? requirement.slice(0, 20) : "未命名需求") + "）",
    domain,
    entityName: "DemoFallback",
    routePath: "/system/" + moduleName,
    apiPath: "/api/v1/" + moduleName,
    features: ["list", "create", "update", "delete"],
    fields: [
      { name: "name", label: "名称", type: "string", required: true, searchable: true, tableVisible: true, formVisible: true, maxLength: 50 },
      { name: "code", label: "编码", type: "string", searchable: true, tableVisible: true, formVisible: true, maxLength: 30 },
      { name: "status", label: "状态", type: "enum", searchable: true, tableVisible: true, formVisible: true, options: [{ label: "启用", value: "enabled" }, { label: "禁用", value: "disabled" }] },
      { name: "remark", label: "备注", type: "textarea", tableVisible: false, formVisible: true },
      { name: "createdAt", label: "创建时间", type: "datetime", tableVisible: true, searchable: true }
    ],
    permissions: ["demo-fallback:list", "demo-fallback:create", "demo-fallback:update", "demo-fallback:delete"]
  });
}

route("POST", "/api/v1/ai-generator/schema/validate", async (ctx) => {
  const schema = normalizeSchema(ctx.body?.schema || ctx.body);
  return ok(ctx.res, buildValidationResult(schema));
});

route("POST", "/api/v1/ai-generator/preview", async (ctx) => {
  const schema = normalizeSchema(ctx.body?.schema || ctx.body);
  const validation = buildValidationResult(schema);
  const files = buildPreviewFiles(schema);
  const qualityChecks = [
    { key: "schema.valid", title: "模块结构完整", status: validation.valid ? "passed" : "failed", description: validation.valid ? "结构校验通过" : validation.errors.join("；"), suggestion: validation.errors.join("\n") || undefined },
    { key: "api.path", title: "接口路径规范", status: /^\/api\/v1\//.test(schema.apiPath) ? "passed" : "warning", description: schema.apiPath, suggestion: "建议以 /api/v1/ 开头" },
    { key: "fields.count", title: "字段配置", status: schema.fields.length >= 3 ? "passed" : "warning", description: `共 ${schema.fields.length} 个字段`, suggestion: "建议至少 3 个字段" },
    { key: "features.list", title: "列表功能", status: schema.features.includes("list") ? "passed" : "warning", description: "模块包含列表页", suggestion: "建议启用 list 功能" }
  ];
  return ok(ctx.res, { schema, validation, qualityChecks, files });
});

route("GET", "/api/v1/ai-generator/environment/diagnose", (ctx) => {
  const items = [
    { key: "node", title: "Node.js", status: "ready", description: "Node 环境正常", commands: [`node -v`] },
    { key: "pnpm", title: "pnpm 包管理器", status: "ready", description: "pnpm 可用", commands: [`pnpm -v`] },
    { key: "git", title: "Git 仓库", status: "ready", description: "Git 可用", commands: [`git status`] },
    { key: "src", title: "源码目录", status: "ready", description: "src 目录存在" },
    { key: "ai", title: "AI 服务", status: "ready", description: "AI 服务已连接", commands: [] }
  ];
  return ok(ctx.res, {
    ready: true,
    checkedAt: nowIso(),
    summary: { ready: items.length, warning: 0, error: 0 },
    aiRuntime: { provider: "tokenrhythm", label: "TokenRhythm", model: AI_MODEL, configured: true },
    items
  });
});

route("POST", "/api/v1/ai-generator/readiness/check", async (ctx) => ok(ctx.res, {
  ready: true,
  items: [
    { key: "schema.valid", title: "模块结构", status: "ready", description: "结构校验通过" },
    { key: "files.generated", title: "代码文件", status: "ready", description: "预览文件已生成" },
    { key: "api.prefix", title: "接口前缀", status: "ready", description: "接口路径规范" },
    { key: "menu.sync", title: "菜单与权限", status: "ready", description: "菜单同步就绪" }
  ]
}));

route("POST", "/api/v1/ai-generator/smoke-test", async (ctx) => ok(ctx.res, {
  passed: true,
  recordId: Math.floor(Math.random() * 9000) + 100,
  items: [
    { key: "module.load", title: "模块加载", status: "passed", description: "模块加载成功", durationMs: 120 },
    { key: "api.register", title: "接口注册", status: "passed", description: "接口注册成功", durationMs: 260 },
    { key: "db.write", title: "数据写入", status: "passed", description: "临时记录创建并清理成功", durationMs: 440 }
  ]
}));

route("POST", "/api/v1/ai-generator/menu/sync", async (ctx) => ok(ctx.res, {
  synced: true,
  parentMenuId: 2,
  menuId: Math.floor(Math.random() * 8000) + 1000,
  authCount: 6,
  apiPermissionCount: 12,
  message: "菜单已同步"
}));

route("POST", "/api/v1/ai-generator/apply/plan", async (ctx) => {
  const schema = normalizeSchema(ctx.body?.schema || ctx.body);
  const generated = buildPreviewFiles(schema);
  const files = planFilesFrom(schema, generated);
  const summary = {
    total: files.length,
    create: files.filter((f) => f.status === "create").length,
    overwrite: files.filter((f) => f.status === "overwrite").length,
    merge: 0, skip: 0, unchanged: 0, conflict: 0
  };
  return ok(ctx.res, {
    ready: true,
    conflictStrategy: "abort",
    files,
    conflicts: [],
    summary,
    nextSteps: [{ title: "确认写入", description: "若无冲突可直接执行写入", commands: [], level: "info" }]
  });
});

route("POST", "/api/v1/ai-generator/apply", async (ctx) => {
  const schema = normalizeSchema(ctx.body?.schema || ctx.body);
  const generated = buildPreviewFiles(schema);
  const files = generated.map((g) => ({
    path: g.path,
    targetPath: g.path,
    language: g.language,
    action: g.action,
    applied: true,
    existedBefore: false,
    afterContent: g.content
  }));
  const runId = String(nextAiRunId++);
  const run = {
    id: runId,
    moduleName: schema.moduleName,
    moduleTitle: schema.moduleTitle,
    createdAt: nowIso(),
    createdBy: { userId: 1, username: "Super" },
    status: "applied",
    fileCount: files.length,
    version: 1,
    cleanupAvailable: true
  };
  aiHistory.push(run);
  return ok(ctx.res, {
    applied: true,
    run,
    files,
    conflicts: [],
    message: "代码已生成并写入",
    nextSteps: [{ title: "查看文件", description: "打开生成目录确认文件内容", commands: [schema.routePath], level: "info" }]
  });
});

route("POST", "/api/v1/ai-generator/apply/dev", async (ctx) => {
  const schema = normalizeSchema(ctx.body?.schema || ctx.body);
  const generated = buildPreviewFiles(schema);
  const files = generated.map((g) => ({ path: g.path, targetPath: g.path, language: g.language, action: g.action, applied: true, existedBefore: false, afterContent: g.content }));
  const runId = String(nextAiRunId++);
  aiHistory.push({ id: runId, moduleName: schema.moduleName, moduleTitle: schema.moduleTitle, createdAt: nowIso(), createdBy: { userId: 1, username: "Super" }, status: "applied", fileCount: files.length, version: 1, cleanupAvailable: true });
  return ok(ctx.res, {
    applied: true,
    message: "已写入开发环境",
    applyResult: { applied: true, run: { id: runId, moduleName: schema.moduleName, moduleTitle: schema.moduleTitle, createdAt: nowIso(), createdBy: { userId: 1, username: "Super" }, status: "applied", fileCount: files.length, version: 1 }, files, conflicts: [], message: "代码已写入" },
    schema,
    steps: [
      { key: "files.write", title: "写入源码文件", status: "passed", description: `已写入 ${files.length} 个文件` },
      { key: "menu.sync", title: "同步菜单与权限", status: "passed", description: "菜单与权限码已写入" },
      { key: "db.migrate", title: "生成数据库迁移", status: "passed", description: "已生成迁移文件", command: "pnpm prisma migrate dev" },
      { key: "typecheck", title: "类型检查", status: "warning", description: "建议运行类型检查确认", command: "pnpm build", output: "vue-tsc --noEmit" }
    ],
    migrationPath: `prisma/migrations/${new Date().toISOString().replace(/[:.]/g, "")}_${schema.moduleName}`,
    needsRestart: true
  });
});

route("POST", "/api/v1/ai-generator/runs/:id/apply/dev", (ctx) => {
  const found = aiHistory.find((r) => String(r.id) === String(ctx.params.id));
  return ok(ctx.res, {
    applied: true,
    message: "已基于历史记录完成开发环境生成",
    applyResult: found ? { applied: true, run: found, files: [], conflicts: [], message: "历史记录已应用" } : undefined,
    schema: undefined,
    steps: [
      { key: "files.write", title: "写入源码文件", status: "passed", description: "已按历史记录写入文件" },
      { key: "typecheck", title: "类型检查", status: "passed", description: "类型检查通过" }
    ],
    needsRestart: true
  });
});

route("POST", "/api/v1/ai-generator/runs/:id/rollback", (ctx) => {
  const found = aiHistory.find((r) => String(r.id) === String(ctx.params.id));
  if (found) found.status = "rolled-back";
  return ok(ctx.res, {
    rolledBack: true,
    run: found,
    conflicts: [],
    message: "已成功回滚生成记录",
    database: { droppedTable: "dropped_" + (found?.moduleName || "module"), removedMigrations: [`prisma/migrations/${found?.moduleName || "module"}`] }
  });
});

route("GET", "/api/v1/ai-generator/history", (ctx) => ok(ctx.res, aiHistory));
route("POST", "/api/v1/ai-generator/history/clear", (ctx) => {
  const deletedCount = aiHistory.length;
  aiHistory = [];
  return ok(ctx.res, { deletedCount, message: "历史已清空" });
});
// ---------- request dispatcher ----------
async function handleRequest(req, res) {
  const url = new URL(req.url, "http://" + (req.headers.host || "localhost"));
  const path = url.pathname;
  const method = req.method.toUpperCase();

  if (method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PATCH, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "*",
      "Access-Control-Allow-Credentials": "true",
      "Access-Control-Max-Age": "86400",
    });
    res.end();
    return;
  }

  console.log("  " + method + " " + path);

  const query = Object.fromEntries(url.searchParams.entries());
  const body = await parseBody(req);
  const ctx = { req, res, url, path, method, query, params: {}, body };

  // notification stream 需要保持连接，单独匹配
  if (path === "/api/v1/notifications/stream" && method === "GET") {
    const send = sseResponse(res);
    send("connected", { ok: true });
    return;
  }

  for (const def of routeDefs) {
    if (def.method !== method) continue;
    const m = path.match(def.regex);
    if (!m) continue;
    const paramNames = (def.patternString || "").match(/:[^/]+/g) || [];
    ctx.params = {};
    paramNames.forEach((name, i) => { ctx.params[name.slice(1)] = m[i + 1]; });
    return def.handler(ctx);
  }

  jsonResponse(res, 404, null, "接口不存在: " + method + " " + path);
}

// ---------- server ----------
const server = http.createServer((req, res) => {
  handleRequest(req, res).catch((err) => {
    console.error("  Error:", err.message || err);
    if (!res.headersSent) jsonResponse(res, 500, null, "服务器内部错误");
    else res.end();
  });
});

server.listen(PORT, "0.0.0.0", () => {
  console.log("");
  console.log("  Mock API Server running on http://localhost:" + PORT);
  console.log("  Default credentials: " + VALID_USERNAME + " / " + VALID_PASSWORD);
  console.log("");
});
