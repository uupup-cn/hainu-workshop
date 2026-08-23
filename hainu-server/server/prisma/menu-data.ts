/**
 * 管理后台菜单种子数据 —— 完整目标菜单结构（单一数据源）
 * 来源：admin/src/router/modules/ 下各路由模块（dashboard/wise/freshman/community/schedule/tool-module/monitor/system/notification）
 * 说明：
 *  - parentId 存父节点 menuKey 引用（根节点为 null），seed.ts 按先父后子两次遍历解析
 *  - menuType: menu=菜单/目录, button=按钮权限；button 节点在菜单接口中转为父节点 meta.authList
 *  - 图标统一使用 RemixIcon 中划线风格（ri-xxx），与 mock 菜单返回一致
 *  - 已排除模板遗留页：department/post/system-param/visitor-analytics/ai-generator；user-center 保留但隐藏
 */

export interface MenuSeedItem {
  menuKey: string;
  menuName: string;
  menuType: 'menu' | 'button';
  parentId: string | null;
  icon?: string;
  path?: string;
  component?: string;
  sortOrder: number;
  isVisible: boolean;
}

// 按钮（新增/编辑/删除）快捷构造
function crudButtons(parentKey: string): MenuSeedItem[] {
  return [
    { menuKey: `${parentKey}:add`, menuName: '新增', menuType: 'button', parentId: parentKey, sortOrder: 1, isVisible: true },
    { menuKey: `${parentKey}:edit`, menuName: '编辑', menuType: 'button', parentId: parentKey, sortOrder: 2, isVisible: true },
    { menuKey: `${parentKey}:delete`, menuName: '删除', menuType: 'button', parentId: parentKey, sortOrder: 3, isVisible: true },
  ];
}

// 完整菜单树（8 个根模块，逐条翻译自 admin 路由模块）
export function buildMenuSeed(): MenuSeedItem[] {
  const list: MenuSeedItem[] = [
    // ===== 根节点 =====
    { menuKey: 'dashboard', menuName: '仪表盘', menuType: 'menu', parentId: null, icon: 'ri-dashboard-line', path: '/dashboard', component: '/index/index', sortOrder: 1, isVisible: true },
    { menuKey: 'freshman', menuName: '新生模块', menuType: 'menu', parentId: null, icon: 'ri-graduation-cap-line', path: '/freshman', component: '/index/index', sortOrder: 2, isVisible: true },
    { menuKey: 'wise', menuName: '智慧海大', menuType: 'menu', parentId: null, icon: 'ri-building-line', path: '/wise', component: '/index/index', sortOrder: 3, isVisible: true },
    { menuKey: 'community', menuName: '社区模块', menuType: 'menu', parentId: null, icon: 'ri-group-line', path: '/community', component: '/index/index', sortOrder: 4, isVisible: true },
    { menuKey: 'tool', menuName: '工具模块', menuType: 'menu', parentId: null, icon: 'ri-tools-line', path: '/tool-module', component: '/index/index', sortOrder: 5, isVisible: true },
    { menuKey: 'schedule', menuName: '课表模块', menuType: 'menu', parentId: null, icon: 'ri-calendar-todo-line', path: '/schedule', component: '/index/index', sortOrder: 6, isVisible: true },
    { menuKey: 'monitor', menuName: '系统监控', menuType: 'menu', parentId: null, icon: 'ri-pulse-line', path: '/monitor', component: '/index/index', sortOrder: 7, isVisible: true },
    { menuKey: 'system', menuName: '系统管理', menuType: 'menu', parentId: null, icon: 'ri-settings-line', path: '/system', component: '/index/index', sortOrder: 8, isVisible: true },

    // ===== 仪表盘 =====
    { menuKey: 'dashboard:console', menuName: '控制台', menuType: 'menu', parentId: 'dashboard', icon: 'ri-home-smile-2-line', path: 'console', component: '/dashboard/console/index', sortOrder: 2, isVisible: true },
    { menuKey: 'dashboard:marketplace-analytics', menuName: '二手集市分析', menuType: 'menu', parentId: 'dashboard', icon: 'ri-shopping-cart-2-line', path: 'marketplace-analytics', component: '/dashboard/marketplace-analytics/index', sortOrder: 3, isVisible: true },

    // ===== 新生模块 =====
    { menuKey: 'freshman:guide', menuName: '入学指南', menuType: 'menu', parentId: 'freshman', icon: 'ri-file-list-2-line', path: 'guide', component: '/freshman/guide/index', sortOrder: 1, isVisible: true },
    { menuKey: 'freshman:life', menuName: '生活攻略', menuType: 'menu', parentId: 'freshman', icon: 'ri-restaurant-line', path: 'life', component: '/freshman/life/index', sortOrder: 2, isVisible: true },
    { menuKey: 'freshman:faq-category', menuName: 'FAQ分类管理', menuType: 'menu', parentId: 'freshman', icon: 'ri-folder-line', path: 'faq/category', component: '/freshman/faq-category/index', sortOrder: 3, isVisible: true },
    { menuKey: 'freshman:faq-question', menuName: 'FAQ问题管理', menuType: 'menu', parentId: 'freshman', icon: 'ri-question-line', path: 'faq/question', component: '/freshman/faq-question/index', sortOrder: 4, isVisible: true },
    { menuKey: 'freshman:roommate', menuName: '找室友', menuType: 'menu', parentId: 'freshman', icon: 'ri-user-add-line', path: 'roommate', component: '/freshman/roommate/index', sortOrder: 5, isVisible: true },

    // ===== 智慧海大 =====
    { menuKey: 'wise:intro', menuName: '海大介绍', menuType: 'menu', parentId: 'wise', icon: 'ri-information-line', path: 'intro', component: '/wise/intro/index', sortOrder: 1, isVisible: true },
    { menuKey: 'wise:phonebook', menuName: '电话簿', menuType: 'menu', parentId: 'wise', icon: 'ri-phone-line', path: 'phonebook', component: '/wise/phonebook/index', sortOrder: 2, isVisible: true },
    { menuKey: 'wise:calendar', menuName: '校历', menuType: 'menu', parentId: 'wise', icon: 'ri-calendar-line', path: 'calendar', component: '/wise/calendar/index', sortOrder: 3, isVisible: true },
    { menuKey: 'wise:map', menuName: '校园地图', menuType: 'menu', parentId: 'wise', icon: 'ri-map-2-line', path: 'map', component: '/wise/map/index', sortOrder: 4, isVisible: true },
    { menuKey: 'wise:bus-schedule', menuName: '班车时刻表', menuType: 'menu', parentId: 'wise', icon: 'ri-bus-line', path: 'bus-schedule', component: '/wise/bus-schedule/index', sortOrder: 5, isVisible: true },
    { menuKey: 'wise:bus-station', menuName: '车站信息', menuType: 'menu', parentId: 'wise', icon: 'ri-map-pin-line', path: 'bus-station', component: '/wise/bus-station/index', sortOrder: 6, isVisible: true },
    { menuKey: 'wise:bus-guide', menuName: '乘车指南', menuType: 'menu', parentId: 'wise', icon: 'ri-road-map-line', path: 'bus-guide', component: '/wise/bus-guide/index', sortOrder: 7, isVisible: true },
    { menuKey: 'wise:campus', menuName: '校区管理', menuType: 'menu', parentId: 'wise', icon: 'ri-community-line', path: 'campus-database/campus', component: '/wise/campus-database/campus/index', sortOrder: 8, isVisible: true },
    { menuKey: 'wise:department', menuName: '学院管理', menuType: 'menu', parentId: 'wise', icon: 'ri-school-line', path: 'campus-database/department', component: '/wise/campus-database/department/index', sortOrder: 9, isVisible: true },
    { menuKey: 'wise:major', menuName: '专业管理', menuType: 'menu', parentId: 'wise', icon: 'ri-book-line', path: 'campus-database/major', component: '/wise/campus-database/major/index', sortOrder: 10, isVisible: true },
    { menuKey: 'wise:college', menuName: '书院管理', menuType: 'menu', parentId: 'wise', icon: 'ri-home-line', path: 'campus-database/college', component: '/wise/campus-database/college/index', sortOrder: 11, isVisible: true },
    { menuKey: 'wise:building', menuName: '楼栋管理', menuType: 'menu', parentId: 'wise', icon: 'ri-building-2-line', path: 'campus-database/building', component: '/wise/campus-database/building/index', sortOrder: 12, isVisible: true },

    // ===== 社区模块 =====
    { menuKey: 'community:marketplace-category', menuName: '集市分类管理', menuType: 'menu', parentId: 'community', icon: 'ri-price-tag-3-line', path: 'marketplace-category', component: '/community/marketplace-category/index', sortOrder: 1, isVisible: true },
    { menuKey: 'community:marketplace-item', menuName: '集市商品管理', menuType: 'menu', parentId: 'community', icon: 'ri-shopping-bag-line', path: 'marketplace-item', component: '/community/marketplace-item/index', sortOrder: 2, isVisible: true },
    { menuKey: 'community:news', menuName: '快讯管理', menuType: 'menu', parentId: 'community', icon: 'ri-newspaper-line', path: 'news', component: '/community/news/index', sortOrder: 2, isVisible: true },
    { menuKey: 'community:posts', menuName: '帖子管理', menuType: 'menu', parentId: 'community', icon: 'ri-chat-1-line', path: 'alumni/posts', component: '/community/alumni/posts/index', sortOrder: 3, isVisible: true },
    { menuKey: 'community:confession', menuName: '表白墙管理', menuType: 'menu', parentId: 'community', icon: 'ri-heart-line', path: 'alumni/confession', component: '/community/alumni/confession/index', sortOrder: 4, isVisible: true },
    { menuKey: 'community:section', menuName: '版块管理', menuType: 'menu', parentId: 'community', icon: 'ri-layout-grid-line', path: 'alumni/section', component: '/community/alumni/section/index', sortOrder: 5, isVisible: true },
    { menuKey: 'community:lottery', menuName: '抽奖管理', menuType: 'menu', parentId: 'community', icon: 'ri-gift-line', path: 'lottery', component: '/community/lottery/index', sortOrder: 6, isVisible: true },

    // ===== 工具模块 =====
    { menuKey: 'tool:manage', menuName: '工具管理', menuType: 'menu', parentId: 'tool', icon: 'ri-hammer-line', path: 'manage', component: '/tool/manage/index', sortOrder: 1, isVisible: true },
    { menuKey: 'tool:category', menuName: '分类管理', menuType: 'menu', parentId: 'tool', icon: 'ri-folder-line', path: 'category', component: '/tool/category/index', sortOrder: 2, isVisible: true },
    { menuKey: 'tool:usage-log', menuName: '使用记录', menuType: 'menu', parentId: 'tool', icon: 'ri-bar-chart-line', path: 'usage-log', component: '/tool/usage-log/index', sortOrder: 3, isVisible: true },
    { menuKey: 'tool:video-parse', menuName: '影视解析配置', menuType: 'menu', parentId: 'tool', icon: 'ri-film-line', path: 'video-parse', component: '/tool/video-parse/index', sortOrder: 4, isVisible: true },

    // ===== 课表模块（三级分组）=====
    { menuKey: 'schedule:course-mgmt', menuName: '课程管理', menuType: 'menu', parentId: 'schedule', icon: 'ri-book-2-line', path: 'course-mgmt', component: '/index/index', sortOrder: 1, isVisible: true },
    { menuKey: 'schedule:course', menuName: '课程库', menuType: 'menu', parentId: 'schedule:course-mgmt', icon: 'ri-book-2-line', path: 'course', component: '/schedule/course/index', sortOrder: 1, isVisible: true },
    { menuKey: 'schedule:color', menuName: '课程颜色', menuType: 'menu', parentId: 'schedule:course-mgmt', icon: 'ri-palette-line', path: 'color', component: '/schedule/color/index', sortOrder: 2, isVisible: true },
    { menuKey: 'schedule:week-mgmt', menuName: '学习周管理', menuType: 'menu', parentId: 'schedule', icon: 'ri-calendar-line', path: 'week-mgmt', component: '/index/index', sortOrder: 2, isVisible: true },
    { menuKey: 'schedule:semester', menuName: '学期管理', menuType: 'menu', parentId: 'schedule:week-mgmt', icon: 'ri-calendar-line', path: 'semester', component: '/schedule/semester/index', sortOrder: 1, isVisible: true },
    { menuKey: 'schedule:term-week', menuName: '学期周制', menuType: 'menu', parentId: 'schedule:week-mgmt', icon: 'ri-calendar-check-line', path: 'term-week', component: '/schedule/term-week/index', sortOrder: 2, isVisible: true },
    { menuKey: 'schedule:section', menuName: '节次管理', menuType: 'menu', parentId: 'schedule', icon: 'ri-time-line', path: 'section', component: '/schedule/section/index', sortOrder: 3, isVisible: true },
    { menuKey: 'schedule:share-code', menuName: '分享码管理', menuType: 'menu', parentId: 'schedule', icon: 'ri-share-line', path: 'share-code', component: '/schedule/share-code/index', sortOrder: 4, isVisible: true },

    // ===== 系统监控 =====
    { menuKey: 'monitor:overview', menuName: '监控概览', menuType: 'menu', parentId: 'monitor', icon: 'ri-dashboard-horizontal-line', path: 'overview', component: '/monitor/index', sortOrder: 1, isVisible: true },
    { menuKey: 'monitor:online-user', menuName: '在线用户', menuType: 'menu', parentId: 'monitor', icon: 'ri-user-shared-line', path: 'online-user', component: '/monitor/online-user/index', sortOrder: 2, isVisible: true },
    { menuKey: 'monitor:server', menuName: '服务器监控', menuType: 'menu', parentId: 'monitor', icon: 'ri-server-line', path: 'server', component: '/monitor/server/index', sortOrder: 3, isVisible: true },
    { menuKey: 'monitor:cache', menuName: '缓存监控', menuType: 'menu', parentId: 'monitor', icon: 'ri-database-2-line', path: 'cache', component: '/monitor/cache/index', sortOrder: 4, isVisible: true },

    // ===== 系统管理 =====
    { menuKey: 'system:user', menuName: '用户管理', menuType: 'menu', parentId: 'system', icon: 'ri-user-line', path: 'user', component: '/system/user/index', sortOrder: 1, isVisible: true },
    { menuKey: 'system:role', menuName: '角色管理', menuType: 'menu', parentId: 'system', icon: 'ri-user-settings-line', path: 'role', component: '/system/role/index', sortOrder: 2, isVisible: true },
    { menuKey: 'system:dict', menuName: '字典管理', menuType: 'menu', parentId: 'system', icon: 'ri-book-2-line', path: 'dict', component: '/system/dict/index', sortOrder: 3, isVisible: true },
    { menuKey: 'system:site-setting', menuName: '站点设置', menuType: 'menu', parentId: 'system', icon: 'ri-global-line', path: 'site-setting', component: '/system/site-setting/index', sortOrder: 4, isVisible: true },
    { menuKey: 'system:file-center', menuName: '文件中心', menuType: 'menu', parentId: 'system', icon: 'ri-folder-shield-2-line', path: 'file-center', component: '/system/file-center/index', sortOrder: 5, isVisible: true },
    { menuKey: 'system:menu', menuName: '功能管理', menuType: 'menu', parentId: 'system', icon: 'ri-menu-line', path: 'menu', component: '/system/menu/index', sortOrder: 6, isVisible: true },
    { menuKey: 'system:notification', menuName: '通知管理', menuType: 'menu', parentId: 'system', icon: 'ri-notification-3-line', path: 'notification', component: '/system/notification/index', sortOrder: 7, isVisible: true },
    { menuKey: 'system:notification:inbox', menuName: '收件箱', menuType: 'menu', parentId: 'system:notification', icon: 'ri-inbox-line', path: 'inbox', component: '/system/notification/inbox', sortOrder: 1, isVisible: false },
    { menuKey: 'system:notification:detail', menuName: '通知详情', menuType: 'menu', parentId: 'system:notification', icon: 'ri-file-text-line', path: 'detail/:id', component: '/system/notification/detail', sortOrder: 2, isVisible: false },
    { menuKey: 'system:app-user', menuName: '小程序用户', menuType: 'menu', parentId: 'system', icon: 'ri-smartphone-line', path: 'app-user', component: '/system/app-user/index', sortOrder: 8, isVisible: true },
    { menuKey: 'system:auth-review', menuName: '认证审核', menuType: 'menu', parentId: 'system', icon: 'ri-shield-check-line', path: 'auth-review', component: '/system/auth-review/index', sortOrder: 9, isVisible: true },
    { menuKey: 'monitor:operation-log', menuName: '操作日志', menuType: 'menu', parentId: 'monitor', icon: 'ri-file-list-3-line', path: 'operation-log', component: '/system/operation-log/index', sortOrder: 6, isVisible: true },
    { menuKey: 'monitor:login-log', menuName: '登录日志', menuType: 'menu', parentId: 'monitor', icon: 'ri-shield-user-line', path: 'login-log', component: '/system/login-log/index', sortOrder: 7, isVisible: true },
    { menuKey: 'monitor:feedback', menuName: '用户反馈', menuType: 'menu', parentId: 'monitor', icon: 'ri-message-2-line', path: 'feedback', component: '/system/feedback/index', sortOrder: 8, isVisible: true },
    { menuKey: 'system:user-center', menuName: '个人中心', menuType: 'menu', parentId: 'system', icon: 'ri-user-settings-line', path: 'user-center', component: '/system/user-center/index', sortOrder: 13, isVisible: false },
  ];

  // ===== 核心 CRUD 页面按钮权限（menuType=button，转为父节点 meta.authList）=====
  const crudPages = [
    'freshman:guide', 'freshman:life', 'freshman:faq', 'freshman:roommate',
    'wise:intro', 'wise:phonebook', 'wise:calendar', 'wise:map', 'wise:bus',
    'wise:campus', 'wise:department', 'wise:major', 'wise:college', 'wise:building',
    'community:marketplace', 'community:news', 'community:posts', 'community:confession', 'community:section', 'community:lottery',
    'tool:manage', 'tool:category', 'tool:video-parse',
    'schedule:course', 'schedule:color', 'schedule:semester', 'schedule:section', 'schedule:share-code',
    'system:user', 'system:role', 'system:menu', 'system:dict', 'system:notification',
  ];
  for (const p of crudPages) list.push(...crudButtons(p));

  // ===== 监控页面按钮权限（翻译自路由模块 authList）=====
  list.push(
    { menuKey: 'monitor:online-user:view', menuName: '查看', menuType: 'button', parentId: 'monitor:online-user', sortOrder: 1, isVisible: true },
    { menuKey: 'monitor:online-user:forceLogout', menuName: '强制下线', menuType: 'button', parentId: 'monitor:online-user', sortOrder: 2, isVisible: true },
    { menuKey: 'monitor:cache:view', menuName: '查看', menuType: 'button', parentId: 'monitor:cache', sortOrder: 1, isVisible: true },
    { menuKey: 'monitor:cache:refresh', menuName: '刷新', menuType: 'button', parentId: 'monitor:cache', sortOrder: 2, isVisible: true },
    { menuKey: 'system:site-setting:edit', menuName: '编辑', menuType: 'button', parentId: 'system:site-setting', sortOrder: 1, isVisible: true },
    { menuKey: 'system:file-center:upload', menuName: '上传', menuType: 'button', parentId: 'system:file-center', sortOrder: 1, isVisible: true },
    { menuKey: 'system:file-center:delete', menuName: '删除', menuType: 'button', parentId: 'system:file-center', sortOrder: 2, isVisible: true },
  );

  return list;
}
