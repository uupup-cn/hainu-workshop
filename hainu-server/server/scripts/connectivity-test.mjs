/**
 * 接口连通性测试脚本 — 按 API 文档 v2.0 契约逐模块验证
 * 运行：node scripts/connectivity-test.mjs（需先启动 server 并完成 seed）
 * 约定：HTTP 状态恒为 200，业务失败通过 code 表达；本脚本断言 code === 0（或指定错误码）
 */
const BASE = process.env.API_BASE || 'http://localhost:3000/api/v1';

let passCount = 0;
let failCount = 0;
const failures = [];

async function call(method, path, body, token) {
  // /api/ 开头为绝对路径（如 /api/v3/...），需补上 origin
  const url = path.startsWith('/api/') ? BASE.replace(/\/api\/v1$/, '') + path : BASE + path;
  const res = await fetch(url, {
    method,
    headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: 'Bearer ' + token } : {}) },
    body: body ? JSON.stringify(body) : undefined,
  });
  return res.json().catch(() => ({ code: -1, message: '非 JSON 响应' }));
}

async function check(name, method, path, body, token, expectCode) {
  const expected = expectCode === undefined ? 0 : expectCode;
  try {
    const json = await call(method, path, body, token);
    if (json.code === expected) { passCount++; return json; }
    failCount++;
    failures.push(name + ' → 期望 code=' + expected + '，实际 code=' + json.code + ' (' + json.message + ')');
  } catch (e) {
    failCount++;
    failures.push(name + ' → 请求异常: ' + e.message);
  }
  return null;
}

async function main() {
  console.log('=== 接口连通性测试 · ' + BASE + ' ===\n');

  // ===== 1. 认证 =====
  console.log('[认证]');
  const adminLogin = await check('管理员登录', 'POST', '/auth/admin/login', { username: 'admin', password: '123456' });
  const adminToken = adminLogin && adminLogin.data && adminLogin.data.accessToken;
  const userLogin = await check('用户登录(00002)', 'POST', '/auth/login', { uid: '00002', password: '123456' });
  const userToken = userLogin && userLogin.data && userLogin.data.accessToken;
  await check('用户登录(00001)', 'POST', '/auth/login', { uid: '00001', password: '123456' });
  await check('错误密码返回40001', 'POST', '/auth/login', { uid: '00002', password: 'wrong' }, undefined, 40001);

  // ===== 2. 用户 =====
  console.log('[用户]');
  await check('个人信息', 'GET', '/user/profile', undefined, userToken);
  await check('隐私设置', 'GET', '/user/privacy', undefined, userToken);
  await check('积分', 'GET', '/user/points', undefined, userToken);
  await check('未登录访问返回40010', 'GET', '/user/profile', undefined, undefined, 40010);

  // ===== 3. 内容（用户端只读）=====
  console.log('[内容·用户端]');
  const guides = await check('入学指南列表', 'GET', '/guide/entries');
  if (guides && guides.data && guides.data.length) await check('指南详情', 'GET', '/guide/entries/' + guides.data[0].entryKey);
  await check('生活攻略校区', 'GET', '/life/campuses');
  await check('生活攻略主题', 'GET', '/life/topics?campus=' + encodeURIComponent('海甸校区'));
  await check('FAQ分类', 'GET', '/faq/categories');
  await check('FAQ问题', 'GET', '/faq/questions');
  const intros = await check('海大介绍列表', 'GET', '/intro/entries');
  if (intros && intros.data && intros.data.length) await check('介绍详情', 'GET', '/intro/entries/' + intros.data[0].entryKey);
  const pbCats = await check('电话簿分类', 'GET', '/phonebook/categories');
  if (pbCats && pbCats.data && pbCats.data.length) await check('电话簿条目', 'GET', '/phonebook/entries?category_id=' + pbCats.data[0].id);
  await check('校历', 'GET', '/calendar');
  const maps = await check('地图列表', 'GET', '/maps');
  if (maps && maps.data && maps.data.length) await check('校区地图', 'GET', '/maps/' + encodeURIComponent(maps.data[0].campus));
  await check('班车时刻', 'GET', '/bus/schedules');
  await check('车站信息', 'GET', '/bus/stations');
  await check('乘车指南', 'GET', '/bus/guide');

  // ===== 4. 找室友 =====
  console.log('[找室友]');
  await check('功能状态', 'GET', '/roommate/status', undefined, userToken);
  await check('校区数据源', 'GET', '/roommate/campuses', undefined, userToken);
  await check('书院数据源', 'GET', '/roommate/colleges', undefined, userToken);
  await check('信息列表', 'GET', '/roommate/posts', undefined, userToken);

  // ===== 5. 社区（用户端）=====
  console.log('[社区·用户端]');
  await check('集市分类', 'GET', '/marketplace/categories');
  const items = await check('集市商品列表', 'GET', '/marketplace/items?page=1&size=10', undefined, userToken);
  if (items && items.data && items.data.list && items.data.list.length) await check('商品详情', 'GET', '/marketplace/items/' + items.data.list[0].id, undefined, userToken);
  await check('游客访问商品返回40010', 'GET', '/marketplace/items', undefined, undefined, 40010);
  await check('快讯列表', 'GET', '/news', undefined, userToken);
  await check('社区模块状态', 'GET', '/community/modules');
  await check('校友圈版块', 'GET', '/alumni/sections', undefined, userToken);
  await check('帖子列表', 'GET', '/alumni/posts?type=post', undefined, userToken);
  await check('表白墙列表', 'GET', '/alumni/posts?type=confession', undefined, userToken);
  await check('抽奖活动', 'GET', '/lottery/activities', undefined, userToken);

  // ===== 6. 工具 & 课表 & 通知 =====
  console.log('[工具/课表/通知]');
  await check('工具分类', 'GET', '/tools/categories');
  await check('工具列表', 'GET', '/tools', undefined, userToken);
  await check('课表', 'GET', '/courses', undefined, userToken);
  await check('通知列表', 'GET', '/notifications', undefined, userToken);
  await check('系统设置', 'GET', '/system/settings');

  // ===== 7. 管理端 =====
  if (!adminToken) {
    console.log('\n[管理端] 跳过：管理员登录失败');
  } else {
    console.log('[管理端·内容]');
    await check('指南列表', 'GET', '/admin/guide/entries', undefined, adminToken);
    const testKey = 'test-entry-' + Date.now().toString(36);
    await check('新增指南', 'POST', '/admin/guide/entries', { entryKey: testKey, entryTitle: '连通性测试', content: '测试内容', sortOrder: 99 }, adminToken);
    await check('编辑指南', 'PUT', '/admin/guide/entries/1', { entryTitle: '报到流程' }, adminToken);
    await check('生活攻略管理', 'GET', '/admin/life/topics', undefined, adminToken);
    await check('FAQ分类管理', 'GET', '/admin/faq/categories', undefined, adminToken);
    await check('介绍管理', 'GET', '/admin/intro/entries', undefined, adminToken);
    await check('电话簿分类管理', 'GET', '/admin/phonebook/categories', undefined, adminToken);
    await check('电话簿条目管理', 'GET', '/admin/phonebook/entries', undefined, adminToken);
    await check('校历管理', 'GET', '/admin/calendar', undefined, adminToken);
    await check('地图管理', 'GET', '/admin/maps', undefined, adminToken);
    await check('班车管理', 'GET', '/admin/bus/schedules', undefined, adminToken);
    await check('车站管理', 'GET', '/admin/bus/stations', undefined, adminToken);

    console.log('[管理端·找室友/校园数据]');
    await check('找室友配置', 'GET', '/admin/roommate/settings', undefined, adminToken);
    await check('找室友信息列表', 'GET', '/admin/roommate/posts', undefined, adminToken);
    await check('校区CRUD', 'GET', '/admin/campuses', undefined, adminToken);
    await check('书院CRUD', 'GET', '/admin/colleges', undefined, adminToken);

    console.log('[管理端·社区]');
    await check('集市分类管理', 'GET', '/admin/marketplace/categories', undefined, adminToken);
    await check('集市商品管理', 'GET', '/admin/marketplace/items', undefined, adminToken);
    await check('快讯管理', 'GET', '/admin/news', undefined, adminToken);
    await check('版块管理', 'GET', '/admin/alumni/sections', undefined, adminToken);
    await check('帖子管理', 'GET', '/admin/alumni/posts', undefined, adminToken);
    await check('抽奖活动列表', 'GET', '/admin/lottery/activities', undefined, adminToken);
    await check('举报列表', 'GET', '/admin/reports', undefined, adminToken);

    console.log('[管理端·课表/工具]');
    await check('课程库', 'GET', '/admin/courses', undefined, adminToken);
    await check('课程颜色', 'GET', '/admin/course-colors', undefined, adminToken);
    await check('学期管理', 'GET', '/admin/semesters', undefined, adminToken);
    await check('周制管理', 'GET', '/admin/term-weeks', undefined, adminToken);
    await check('节次管理', 'GET', '/admin/sections', undefined, adminToken);
    await check('分享码列表', 'GET', '/admin/share-codes', undefined, adminToken);
    await check('工具分类管理', 'GET', '/admin/tool-categories', undefined, adminToken);
    await check('工具管理', 'GET', '/admin/tools', undefined, adminToken);
    await check('使用记录', 'GET', '/admin/tools/usage-log', undefined, adminToken);
    await check('解析线路管理', 'GET', '/admin/video-parse-lines', undefined, adminToken);

    console.log('[管理端·系统]');
    await check('用户列表', 'GET', '/admin/users', undefined, adminToken);
    await check('认证申请', 'GET', '/admin/auth-applications', undefined, adminToken);
    await check('角色列表', 'GET', '/admin/roles', undefined, adminToken);
    await check('权限列表', 'GET', '/admin/permissions', undefined, adminToken);
    await check('菜单树', 'GET', '/admin/menus', undefined, adminToken);
    await check('字典类型', 'GET', '/admin/dict-types', undefined, adminToken);
    await check('字典数据', 'GET', '/admin/dicts', undefined, adminToken);
    await check('按类型取字典', 'GET', '/admin/dicts/by-type/identity', undefined, adminToken);
    await check('通知类型', 'GET', '/admin/notification-types', undefined, adminToken);
    await check('通知管理列表', 'GET', '/admin/notifications', undefined, adminToken);
    await check('系统设置读取', 'GET', '/admin/system/settings', undefined, adminToken);
    await check('设置分组basic', 'GET', '/admin/settings/group/basic', undefined, adminToken);
    await check('全部设置', 'GET', '/admin/settings/all', undefined, adminToken);
    await check('文件列表', 'GET', '/admin/files', undefined, adminToken);
    await check('文件统计', 'GET', '/admin/files/stats', undefined, adminToken);

    console.log('[管理端·监控]');
    await check('在线用户', 'GET', '/admin/online-users', undefined, adminToken);
    await check('缓存状态', 'GET', '/admin/cache', undefined, adminToken);
    await check('服务器信息', 'GET', '/admin/server-info', undefined, adminToken);
    await check('系统日志', 'GET', '/admin/system-logs', undefined, adminToken);
    await check('登录日志', 'GET', '/admin/login-logs', undefined, adminToken);
    await check('操作日志', 'GET', '/admin/operation-logs', undefined, adminToken);
    await check('用户反馈', 'GET', '/admin/feedback', undefined, adminToken);
    await check('无Token访问返回40002', 'GET', '/admin/users', undefined, undefined, 40002);

    console.log('[管理端·模板集成]');
    await check('图形验证码', 'GET', '/auth/captcha');
    await check('管理员退出', 'POST', '/auth/logout');
    const info = await check('当前管理员信息', 'GET', '/user/info', undefined, adminToken);
    if (!(info && info.data && Array.isArray(info.data.roles))) { failCount++; failures.push('当前管理员信息 → 缺少 roles 数组'); }
    const menus = await check('动态菜单树', 'GET', '/api/v3/system/menus', undefined, adminToken);
    if (menus && menus.data) {
      if (!Array.isArray(menus.data) || menus.data.length < 8) { failCount++; failures.push('动态菜单树 → 根节点数 ' + (Array.isArray(menus.data) ? menus.data.length : '非数组') + '（期望 ≥8）'); }
      const first = menus.data && menus.data[0];
      if (!first || !first.meta || !first.meta.title || !first.component) { failCount++; failures.push('动态菜单树 → 首节点缺少 meta/component'); }
    }
    await check('菜单管理树', 'GET', '/api/v3/system/menus/manage', undefined, adminToken);
    await check('后台用户列表', 'GET', '/user', undefined, adminToken);
    await check('角色列表(模板)', 'GET', '/roles', undefined, adminToken);
    await check('权限目录', 'GET', '/api-permissions/catalog', undefined, adminToken);
    await check('字典类型(模板)', 'GET', '/dicts/types', undefined, adminToken);
    await check('站点设置(模板)', 'GET', '/site-settings/admin', undefined, adminToken);
    await check('文件列表(模板)', 'GET', '/files', undefined, adminToken);
    await check('监控概览(模板)', 'GET', '/monitor/overview', undefined, adminToken);
    await check('在线用户(模板)', 'GET', '/monitor/online-users', undefined, adminToken);
    await check('操作日志(模板)', 'GET', '/logs/operation', undefined, adminToken);
    await check('登录日志(模板)', 'GET', '/logs/login', undefined, adminToken);
    await check('反馈列表(模板)', 'GET', '/feedback', undefined, adminToken);
    await check('反馈概览(模板)', 'GET', '/feedback/overview', undefined, adminToken);
    await check('通知管理(模板)', 'GET', '/notifications/admin', undefined, adminToken);
    await check('访客趋势(模板)', 'GET', '/monitor/visitor-analytics', undefined, adminToken);
  }

  // ===== 结果 =====
  console.log('\n=== 测试结果：通过 ' + passCount + ' / 失败 ' + failCount + ' ===');
  if (failures.length) {
    console.log('\n失败明细：');
    for (const f of failures) console.log('  ✗ ' + f);
    process.exit(1);
  }
}

main().catch((e) => { console.error('测试脚本异常：', e); process.exit(1); });
