/**
 * 数据库种子脚本 — 填充开发/联调环境的基础数据
 * 运行：npm run seed（ts-node prisma/seed.ts）
 * 幂等：重复执行不会产生重复数据（唯一键 upsert / 先查后建）
 */
import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();
const sha256 = (p: string) => crypto.createHash('sha256').update(p).digest('hex');

async function main() {
  // ===== 系统管理：角色 + 管理员 =====
  let superRole = await prisma.role.findFirst({ where: { roleKey: 'super_admin' } });
  if (!superRole) superRole = await prisma.role.create({ data: { roleName: '超级管理员', roleKey: 'super_admin', description: '拥有全部权限' } });
  if (!(await prisma.role.findFirst({ where: { roleKey: 'operator' } }))) await prisma.role.create({ data: { roleName: '内容运营', roleKey: 'operator', description: '内容与社区运营' } });
  await prisma.adminUser.upsert({ where: { username: 'admin' }, create: { username: 'admin', passwordHash: sha256('123456'), nickname: '系统管理员', roleId: superRole?.id }, update: {} });

  // ===== 测试用户（网页端登录：00001/123456、00002/123456）=====
  const freshman = await prisma.user.upsert({ where: { uid: '00001' }, create: { openid: 'test-openid-freshman', uid: '00001', nickname: '测试新生', avatar: '', passwordHash: sha256('123456'), identity: 'freshman' }, update: {} });
  const undergrad = await prisma.user.upsert({ where: { uid: '00002' }, create: { openid: 'test-openid-undergrad', uid: '00002', nickname: '测试本科生', avatar: '', passwordHash: sha256('123456'), identity: 'undergrad', authStatus: 'verified', pointsEnabled: true, points: 100 }, update: {} });

  // ===== 站点设置（PRD §5.6，28 个配置键默认值）=====

  const settings: Array<[string, string]> = [
    ['site_name', '海大工坊'], ['login_captcha', 'false'], ['password_min_length', '6'], ['login_lock_threshold', '5'], ['lock_duration_minutes', '30'], ['jwt_expires_hours', '24'], ['page_size_default', '20'],
    ['app_name', '海大工坊'], ['app_version', 'v1.0.0'], ['theme_color', '#1D6FEB'], ['launch_bg_image', ''], ['nav_bg_image', ''], ['about_us', '海南大学校园工具小程序'], ['customer_service_wechat', 'hainu_helper'], ['customer_service_qq', '10000000'], ['customer_service_phone', '0898-66279029'], ['payment_miniprogram_path', ''], ['payment_description', '请通过学校官方缴费小程序完成缴费'],
    ['allowed_upload_types', 'jpg,png'], ['max_file_size_mb', '5'], ['max_upload_count', '9'], ['file_retention_days', '0'], ['storage_path', '/uploads'],
    ['campus_mode', 'school'], ['holiday_type', ''], ['semester_start', '2026-09-07'], ['roommate_max_modify_count', '3'], ['roommate_start_time', '2026-08-01'], ['roommate_end_time', '2026-09-30'], ['poster_template', ''],
  ];
  for (const [k, v] of settings) await prisma.systemSetting.upsert({ where: { settingKey: k }, create: { settingKey: k, settingValue: v }, update: {} });

  // ===== 校园数据库：校区 / 书院 / 学院 / 专业 / 楼栋 =====
  const campusNames = ['海甸校区', '儋州校区', '城西校区', '观澜湖校区'];
  const campuses: any[] = [];
  for (let i = 0; i < campusNames.length; i++) {
    campuses.push(await prisma.campus.upsert({ where: { id: i + 1 }, create: { id: i + 1, campusName: campusNames[i], sortOrder: i + 1 }, update: { campusName: campusNames[i] } }).catch(async () => prisma.campus.findFirst({ where: { campusName: campusNames[i] } })!));
  }
  if ((await prisma.college.count()) === 0) {
    await prisma.college.create({ data: { campusId: campuses[0].id, collegeName: '淳明书院', sortOrder: 1 } });
    await prisma.college.create({ data: { campusId: campuses[0].id, collegeName: '海德书院', sortOrder: 2 } });
    await prisma.college.create({ data: { campusId: campuses[1].id, collegeName: '热带书院', sortOrder: 3 } });
  }
  if ((await prisma.department.count()) === 0) {
    const dep1 = await prisma.department.create({ data: { campusId: campuses[0].id, departmentName: '计算机科学与技术学院', sortOrder: 1 } });
    await prisma.department.create({ data: { campusId: campuses[0].id, departmentName: '经济学院', sortOrder: 2 } });
    await prisma.department.create({ data: { campusId: campuses[1].id, departmentName: '热带农林学院', sortOrder: 3 } });
    if ((await prisma.major.count()) === 0) {
      await prisma.major.create({ data: { departmentId: dep1.id, majorName: '软件工程', sortOrder: 1 } });
      await prisma.major.create({ data: { departmentId: dep1.id, majorName: '计算机科学与技术', sortOrder: 2 } });
    }
  }
  if ((await prisma.building.count()) === 0) {
    const col1 = await prisma.college.findFirst({ where: { collegeName: '淳明书院' } });
    if (col1) { await prisma.building.create({ data: { collegeId: col1.id, buildingName: '1栋', sortOrder: 1 } }); await prisma.building.create({ data: { collegeId: col1.id, buildingName: '2栋', sortOrder: 2 } }); }
  }

  // ===== 电话簿 =====
  if ((await prisma.phonebookCategory.count()) === 0) {
    for (const c of campuses) await prisma.phonebookCategory.create({ data: { campusId: c.id, categoryName: c.campusName + '服务电话' } });
    const pc = await prisma.phonebookCategory.findFirst();
    if (pc) {
      await prisma.phonebookEntry.create({ data: { categoryId: pc.id, departmentName: '教务处', phoneNumber: '0898-66279029', description: '选课、成绩咨询', sortOrder: 1 } });
      await prisma.phonebookEntry.create({ data: { categoryId: pc.id, departmentName: '后勤服务中心', phoneNumber: '0898-66279110', description: '报修、宿舍服务', sortOrder: 2 } });
    }
  }

  // ===== 新生模块：入学指南 / 生活攻略 / FAQ =====
  const guides: Array<[string, string, string]> = [
    ['checkin', '报到流程', '新生报到流程：录取通知书 → 校门迎新点 → 学院报到 → 宿舍入住 → 领取校园卡。'],
    ['military', '军训', '军训安排在开学第一至三周，请提前准备防晒用品和运动水壶。'],
    ['dorm', '宿舍', '宿舍为4-6人间，配备空调与独立卫浴，床位由书院统一分配。'],
    ['campus-card', '校园卡', '校园卡在报到时统一发放，支持食堂消费、门禁、图书馆借阅。'],
    ['payment', '缴费', '学费与住宿费通过学校官方缴费小程序缴纳，支持微信支付。'],
    ['archive', '档案', '个人档案由生源地招办统一邮寄至学校档案馆，无需自带。'],
  ];
  for (let i = 0; i < guides.length; i++) await prisma.guideEntry.upsert({ where: { entryKey: guides[i][0] }, create: { entryKey: guides[i][0], entryTitle: guides[i][1], content: guides[i][2], sortOrder: i + 1 }, update: {} });

  if ((await prisma.lifeTopic.count()) === 0) {
    const themes = ['canteen', 'express', 'market', 'hospital', 'sport', 'print', 'traffic'];
    const titles = ['食堂攻略', '快递收发', '超市购物', '就医指南', '运动场馆', '打印服务', '交通出行'];
    for (const c of campuses) for (let i = 0; i < themes.length; i++) await prisma.lifeTopic.create({ data: { campus: c.campusName, topicKey: themes[i], topicTitle: c.campusName + titles[i], content: titles[i] + '内容完善中，欢迎补充。', sortOrder: i + 1 } });
  }
  if ((await prisma.faqCategory.count()) === 0) {
    const c1 = await prisma.faqCategory.create({ data: { categoryName: '入学准备', sortOrder: 1 } });
    const c2 = await prisma.faqCategory.create({ data: { categoryName: '校园生活', sortOrder: 2 } });
    const c3 = await prisma.faqCategory.create({ data: { categoryName: '学习相关', sortOrder: 3 } });
    await prisma.faqQuestion.createMany({ data: [
      { categoryId: c1.id, question: '录取通知书里有哪些重要材料？', answer: '含入学须知、校园卡、银行卡等，请仔细阅读入学须知。', sortOrder: 1 },
      { categoryId: c1.id, question: '可以提前到校报到吗？', answer: '建议按通知书日期报到，提前到校需自行安排住宿。', sortOrder: 2 },
      { categoryId: c2.id, question: '校内快递点在哪里？', answer: '海甸校区快递中心位于学生宿舍区旁菜鸟驿站。', sortOrder: 1 },
      { categoryId: c2.id, question: '校园卡丢了怎么办？', answer: '前往一卡通中心挂失补办，也可在小程序内自助挂失。', sortOrder: 2 },
      { categoryId: c3.id, question: '英语四六级什么时候报名？', answer: '每年3月和9月通过全国报名系统报考，注意教务通知。', sortOrder: 1 },
    ] });
  }

  // ===== 智慧海大：介绍 / 校历 / 地图 / 出行 =====
  const intros: Array<[string, string]> = [['about', '学校概况'], ['campuses', '校区分布'], ['scenery', '校园风光'], ['colleges', '院系设置'], ['culture', '校歌校徽']];
  for (let i = 0; i < intros.length; i++) await prisma.introEntry.upsert({ where: { entryKey: intros[i][0] }, create: { entryKey: intros[i][0], entryTitle: intros[i][1], content: intros[i][1] + '内容完善中。', images: [], sortOrder: i + 1 }, update: {} });
  if ((await prisma.calendarSetting.count()) === 0) await prisma.calendarSetting.create({ data: { viewMode: 'image', imageUrl: 'https://example.com/calendar-2026.png' } });
  if ((await prisma.mapSetting.count()) === 0) {
    for (const c of campuses) await prisma.mapSetting.create({ data: { campus: c.campusName, mapImageUrl: 'https://example.com/map-' + c.id + '.png' } });
    const m1 = await prisma.mapSetting.findFirst({ where: { campus: '海甸校区' } });
    if (m1) {
      await prisma.mapMarker.createMany({ data: [
        { mapId: m1.id, buildingName: '图书馆', description: '海甸校区主图书馆', positionX: 50.0, positionY: 40.0, sortOrder: 1 },
        { mapId: m1.id, buildingName: '第一食堂', description: '学生第一食堂', positionX: 30.5, positionY: 60.2, sortOrder: 2 },
        { mapId: m1.id, buildingName: '行政楼', description: '学校行政办公大楼', positionX: 70.1, positionY: 25.8, sortOrder: 3 },
      ] });
    }
  }
  if ((await prisma.busSchedule.count()) === 0) {
    await prisma.busSchedule.createMany({ data: [
      { lineName: '海甸→城西', departureTime: '07:30', departurePlace: '海甸校区东门', destination: '城西校区', notes: '工作日运行', sortOrder: 1 },
      { lineName: '海甸→儋州', departureTime: '08:00', departurePlace: '海甸校区东门', destination: '儋州校区', notes: '每周五加开一班', sortOrder: 2 },
      { lineName: '观澜湖→海甸', departureTime: '16:30', departurePlace: '观澜湖校区', destination: '海甸校区', notes: '', sortOrder: 3 },
    ] });
  }
  if ((await prisma.busStation.count()) === 0) {
    await prisma.busStation.createMany({ data: [
      { stationName: '海甸校区东门站', locationDesc: '东门岗亭旁', lines: '1路、校车海甸始发', sortOrder: 1 },
      { stationName: '海甸校区西门站', locationDesc: '西门停车场', lines: '5路、19路', sortOrder: 2 },
      { stationName: '城西校区站', locationDesc: '校区正门', lines: '校车终点', sortOrder: 3 },
    ] });
  }
  if ((await prisma.busGuide.count()) === 0) await prisma.busGuide.create({ data: { content: '乘车指南：校内班车凭校园卡免费乘坐，请提前10分钟到站候车。' } });

  // ===== 找室友 =====
  if ((await prisma.roommateSetting.count()) === 0) await prisma.roommateSetting.create({ data: { isEnabled: true, maxModifyCount: 3 } });

  // ===== 社区：集市分类 / 商品 / 模块开关 / 快讯 / 校友圈 / 抽奖 =====
  if ((await prisma.marketplaceCategory.count()) === 0) {
    const cats = ['教材书籍', '数码电子', '生活用品', '运动装备', '其他'];
    for (let i = 0; i < cats.length; i++) await prisma.marketplaceCategory.create({ data: { categoryName: cats[i], sortOrder: i + 1 } });
  }
  if ((await prisma.marketplaceItem.count()) === 0) {
    const cat = await prisma.marketplaceCategory.findFirst();
    if (cat) {
      const future = (d: number) => new Date(Date.now() + d * 86400000);
      await prisma.marketplaceItem.createMany({ data: [
        { title: '高等数学教材（第七版）', description: '九成新，含习题解答', price: 15, images: [], contact: 'QQ:10001', categoryId: cat.id, userId: undergrad.id, userIdentity: 'undergrad', autoOffAt: future(3), expireAt: future(5) },
        { title: '罗技G102鼠标', description: '使用一年，功能正常', price: 40, images: [], contact: '微信:logi102', categoryId: cat.id, userId: undergrad.id, userIdentity: 'undergrad', autoOffAt: future(3), expireAt: future(5), viewCount: 23 },
        { title: '宿舍收纳箱', description: '搬宿舍出，60*40规格', price: 10, images: [], contact: 'QQ:10002', categoryId: cat.id, userId: undergrad.id, userIdentity: 'undergrad', status: 'off', autoOffAt: future(-1), expireAt: future(1) },
      ] });
    }
  }
  if ((await prisma.communityModule.count()) === 0) {
    await prisma.communityModule.createMany({ data: [
      { moduleKey: 'marketplace', moduleName: '二手集市', isEnabled: true },
      { moduleKey: 'news', moduleName: '校园快讯', isEnabled: true },
      { moduleKey: 'lottery', moduleName: '校园抽奖', isEnabled: true },
      { moduleKey: 'alumni', moduleName: '校友圈', isEnabled: true },
    ] });
  }
  if ((await prisma.news.count()) === 0) {
    await prisma.news.createMany({ data: [
      { title: '2026级新生报到须知', content: '请全体新生于9月7日至8日到校报到。', target: 'freshman', status: 'published', isPinned: true, publishedAt: new Date() },
      { title: '图书馆开放时间调整公告', content: '考试周期间图书馆延长开放至23:00。', target: 'all_student', status: 'published', publishedAt: new Date() },
      { title: '四六级考试报名即将开始', content: '请留意教务处通知，按时完成报名。', target: 'undergrad', status: 'published', publishedAt: new Date() },
    ] });
  }
  if ((await prisma.alumniSection.count()) === 0) {
    await prisma.alumniSection.createMany({ data: [{ sectionName: '校园生活', sortOrder: 1 }, { sectionName: '学习交流', sortOrder: 2 }, { sectionName: '跳蚤市场', sortOrder: 3 }] });
  }
  if ((await prisma.alumniPost.count()) === 0) {
    const sec = await prisma.alumniSection.findFirst();
    await prisma.alumniPost.create({ data: { type: 'post', sectionId: sec?.id, userId: undergrad.id, title: '求推荐海甸食堂窗口', content: '刚来学校，求学长学姐推荐好吃的窗口！', images: [], likeCount: 3, commentCount: 1 } });
    await prisma.alumniPost.create({ data: { type: 'confession', userId: undergrad.id, content: '图书馆三楼穿蓝色衣服的同学，可以认识一下吗？', images: [], isAnonymous: true, likeCount: 8 } });
  }
  if ((await prisma.lotteryActivity.count()) === 0) {
    const act = await prisma.lotteryActivity.create({ data: { name: '开学季抽奖', type: 'free', startTime: new Date(Date.now() - 86400000), endTime: new Date(Date.now() + 7 * 86400000), description: '开学季免费抽奖，每人1次机会', status: 'listed' } });
    await prisma.lotteryPrize.createMany({ data: [
      { activityId: act.id, name: '定制笔记本', image: '', quantity: 10, remaining: 10, probability: 0.1, sortOrder: 1 },
      { activityId: act.id, name: '校园卡套', image: '', quantity: 20, remaining: 20, probability: 0.3, sortOrder: 2 },
      { activityId: act.id, name: '谢谢参与', image: '', quantity: 0, remaining: 0, probability: 0.6, sortOrder: 3 },
    ] });
  }

  // ===== 课表：颜色 / 节次 / 学期 / 周制 =====
  if ((await prisma.courseColor.count()) === 0) {
    const colors: Array<[string, string]> = [['蓝色', '#4A90D9'], ['绿色', '#52C41A'], ['橙色', '#FA8C16'], ['紫色', '#722ED1'], ['红色', '#F5222D'], ['青色', '#13C2C2'], ['粉色', '#EB2F96'], ['灰色', '#8C8C8C']];
    for (let i = 0; i < colors.length; i++) await prisma.courseColor.create({ data: { colorName: colors[i][0], colorValue: colors[i][1], sortOrder: i + 1 } });
  }
  if ((await prisma.section.count()) === 0) {
    const times: Array<[number, string, string]> = [[1, '08:00', '08:45'], [2, '08:55', '09:40'], [3, '10:00', '10:45'], [4, '10:55', '11:40'], [5, '14:30', '15:15']];
    for (const [n, s, e] of times) await prisma.section.create({ data: { sectionNumber: n, startTime: s, endTime: e, sortOrder: n } });
  }
  if ((await prisma.semester.count()) === 0) {
    const sem = await prisma.semester.create({ data: { semesterName: '2026-2027学年第1学期', startDate: new Date('2026-09-07'), endDate: new Date('2027-01-17'), sortOrder: 1 } });
    for (let w = 0; w < 20; w++) {
      const start = new Date(2026, 8, 7 + w * 7);
      await prisma.termWeek.create({ data: { semesterId: sem.id, weekNumber: w + 1, startDate: start, endDate: new Date(start.getTime() + 6 * 86400000) } });
    }
  }

  // ===== 工具箱：分类 / 工具 / 解析线路 =====
  if ((await prisma.toolCategory.count()) === 0) {
    const t1 = await prisma.toolCategory.create({ data: { categoryName: '生活娱乐', sortOrder: 1 } });
    const t2 = await prisma.toolCategory.create({ data: { categoryName: '学习工具', sortOrder: 2 } });
    const t3 = await prisma.toolCategory.create({ data: { categoryName: '趣味测试', sortOrder: 3 } });
    const tools: Array<[number, string, string]> = [
      [t1.id, '证件照生成', 'id-photo'], [t1.id, '影视解析', 'video-parse'], [t1.id, '摇骰子', 'dice'],
      [t2.id, '科学计算器', 'calculator'],
      [t3.id, 'SBTI人格测试', 'sbti'], [t3.id, '命运转盘', 'wheel'], [t3.id, '舒尔特方格', 'schulte'], [t3.id, 'MBTI测试', 'mbti'], [t3.id, '黑暗三角测试', 'dark-triad'], [t3.id, '七宗罪VS七美德', 'seven-sins'],
    ];
    for (let i = 0; i < tools.length; i++) await prisma.tool.upsert({ where: { toolKey: tools[i][2] }, create: { categoryId: tools[i][0], toolName: tools[i][1], toolKey: tools[i][2], description: tools[i][1] + '——当前阶段免费使用', pointsEnabled: false, pointsCost: 0, pointsMode: 'free', sortOrder: i + 1 }, update: {} });
  }
  if ((await prisma.videoParseLine.count()) === 0) {
    await prisma.videoParseLine.createMany({ data: [
      { lineName: '线路一（稳定）', apiUrl: 'https://jx.example.com/?url=', sortOrder: 1 },
      { lineName: '线路二（备用）', apiUrl: 'https://jx2.example.com/?url=', sortOrder: 2, isActive: false },
    ] });
  }

  // ===== 字典 / 通知 =====
  const dt = await prisma.dictType.upsert({ where: { typeKey: 'identity' }, create: { typeName: '用户身份', typeKey: 'identity', description: '小程序用户身份' }, update: {} });
  if ((await prisma.dict.count({ where: { dictType: 'identity' } })) === 0) {
    await prisma.dict.createMany({ data: [
      { dictType: dt.typeKey, dictLabel: '新生', dictValue: 'freshman', sortOrder: 1 },
      { dictType: dt.typeKey, dictLabel: '本科生', dictValue: 'undergrad', sortOrder: 2 },
      { dictType: dt.typeKey, dictLabel: '研究生', dictValue: 'grad', sortOrder: 3 },
    ] });
  }
  if ((await prisma.notificationType.count()) === 0) {
    await prisma.notificationType.createMany({ data: [{ typeName: '系统通知', sortOrder: 1 }, { typeName: '审核结果', sortOrder: 2 }, { typeName: '活动提醒', sortOrder: 3 }] });
  }
  const nt = await prisma.notificationType.findFirst();
  if (nt && (await prisma.notification.count()) === 0) {
    await prisma.notification.create({ data: { typeId: nt.id, title: '欢迎使用海大工坊', content: '欢迎来到海大工坊，祝你校园生活愉快！', target: 'all' } });
  }

  // ===== 管理后台菜单（动态路由 + 按钮权限）— 按 menuKey upsert，增量同步 =====
  {
    const { buildMenuSeed } = await require('./menu-data');
    const items = buildMenuSeed();
    const idByKey = new Map<string, number>();
    // 已存在的行直接入映射（更新其字段），不存在的新建；先根节点再按父子逐层
    const existing = await prisma.menu.findMany();
    for (const row of existing) idByKey.set(row.menuKey, row.id);
    let created = 0;
    for (const it of items.filter((i: any) => !i.parentId)) {
      const data = { menuName: it.menuName, menuType: it.menuType, icon: it.icon || null, path: it.path || null, component: it.component || null, sortOrder: it.sortOrder, isVisible: it.isVisible };
      const row = await prisma.menu.upsert({ where: { menuKey: it.menuKey }, create: { menuKey: it.menuKey, ...data }, update: data });
      idByKey.set(it.menuKey, row.id); if (!existing.some((e) => e.menuKey === it.menuKey)) created++;
    }
    for (let depth = 0; depth < 3; depth++) {
      for (const it of items.filter((i: any) => i.parentId && idByKey.has(i.parentId) && !idByKey.has(i.menuKey))) {
        const data = { menuName: it.menuName, menuType: it.menuType, icon: it.icon || null, path: it.path || null, component: it.component || null, sortOrder: it.sortOrder, isVisible: it.isVisible, parentId: idByKey.get(it.parentId as string)! };
        const row = await prisma.menu.upsert({ where: { menuKey: it.menuKey }, create: { menuKey: it.menuKey, ...data }, update: data });
        idByKey.set(it.menuKey, row.id); created++;
      }
    }
    console.log('[seed] 菜单同步完成：共 ' + idByKey.size + ' 项，新增 ' + created + ' 项');
  }

  console.log('[seed] 种子数据完成：管理员 admin/123456，测试用户 00001/00002（密码 123456）');
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
