// 社区管理 管理端服务（二手集市/社区启停/快讯/校友圈/抽奖/举报处理）
import { prisma } from '../../utils/prisma';
import { ApiError } from '../../utils/api-error';
import { sanitizeHtml } from '../../utils/html-sanitize';
import { paginatedResult } from '../../utils/pagination';

// ========== 二手集市分类 ==========
export const marketplaceCategories = {
  list: () => prisma.marketplaceCategory.findMany({ orderBy: { sortOrder: 'asc' } }),
  create: (d: any) => prisma.marketplaceCategory.create({ data: d }),
  update: (id: number, d: any) => prisma.marketplaceCategory.update({ where: { id }, data: d }),
  delete: async (id: number) => { const n = await prisma.marketplaceItem.count({ where: { categoryId: id } }); if (n > 0) throw new ApiError(40001, '该分类下存在商品，无法删除'); return prisma.marketplaceCategory.delete({ where: { id } }); },
};
// ========== 二手集市商品 ==========
export async function getMarketplaceItems(page: number, size: number, status?: string, categoryId?: number, keyword?: string) {
  const where: any = {};
  if (status) where.status = status;
  if (categoryId) where.categoryId = Number(categoryId);
  if (keyword) where.title = { contains: keyword };
  const [list, total] = await Promise.all([
    prisma.marketplaceItem.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { publishedAt: 'desc' }, include: { category: true, user: { select: { uid: true, nickname: true } } } }),
    prisma.marketplaceItem.count({ where }),
  ]);
  return paginatedResult(list, total, page, size);
}
export async function getMarketplaceItem(id: number) {
  const i = await prisma.marketplaceItem.findUnique({ where: { id }, include: { category: true, user: { select: { uid: true, nickname: true } } } });
  if (!i) throw new ApiError(40003, '商品不存在');
  return i;
}
export async function deleteMarketplaceItem(id: number) {
  const i = await prisma.marketplaceItem.findUnique({ where: { id } });
  if (!i) throw new ApiError(40003, '商品不存在');
  await prisma.marketplaceItem.delete({ where: { id } });
  return true;
}
// ========== 社区模块启停（按 moduleKey upsert） ==========
export async function setCommunityModule(key: string, d: any) {
  return prisma.communityModule.upsert({
    where: { moduleKey: key },
    create: { moduleKey: key, moduleName: d.moduleName || key, isEnabled: !!d.isEnabled },
    update: { isEnabled: !!d.isEnabled, ...(d.moduleName ? { moduleName: d.moduleName } : {}) },
  });
}
// ========== 快讯 ==========
export async function getNewsList(page: number, size: number, keyword?: string, status?: string) {
  const where: any = {};
  if (keyword) where.title = { contains: keyword };
  if (status) where.status = status;
  const [list, total] = await Promise.all([
    prisma.news.findMany({ where, skip: (page - 1) * size, take: size, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }] }),
    prisma.news.count({ where }),
  ]);
  return paginatedResult(list, total, page, size);
}
export async function createNews(d: any) { const data = { ...d }; if (data.content) data.content = sanitizeHtml(data.content); if (data.status === 'published') data.publishedAt = new Date(); return prisma.news.create({ data }); }
export async function updateNews(id: number, d: any) {
  const n = await prisma.news.findUnique({ where: { id } });
  if (!n) throw new ApiError(40003, '快讯不存在');
  const data = { ...d };
  if (data.content) data.content = sanitizeHtml(data.content);
  if (data.status === 'published' && !n.publishedAt) data.publishedAt = new Date();
  return prisma.news.update({ where: { id }, data });
}
export async function deleteNews(id: number) {
  const n = await prisma.news.findUnique({ where: { id } });
  if (!n) throw new ApiError(40003, '快讯不存在');
  await prisma.news.delete({ where: { id } });
  return true;
}
// ========== 校友圈版块 ==========
export const alumniSections = {
  list: () => prisma.alumniSection.findMany({ orderBy: { sortOrder: 'asc' } }),
  create: (d: any) => prisma.alumniSection.create({ data: d }),
  update: (id: number, d: any) => prisma.alumniSection.update({ where: { id }, data: d }),
  delete: async (id: number) => { const n = await prisma.alumniPost.count({ where: { sectionId: id } }); if (n > 0) throw new ApiError(40001, '该版块下存在帖子，无法删除'); return prisma.alumniSection.delete({ where: { id } }); },
};
// ========== 校友圈帖子/评论 ==========
export async function getAlumniPosts(page: number, size: number, type?: string, keyword?: string) {
  const where: any = {}; if (type) where.type = type;
  if (keyword) where.OR = [{ title: { contains: keyword } }, { content: { contains: keyword } }];
  const [list, total] = await Promise.all([
    prisma.alumniPost.findMany({ where, skip: (page - 1) * size, take: size, orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }], include: { user: { select: { uid: true, nickname: true } }, section: true } }),
    prisma.alumniPost.count({ where }),
  ]);
  return paginatedResult(list, total, page, size);
}
// 帖子详情（含用户、版块、评论）
export async function getAlumniPostDetail(id: number) {
  const p = await prisma.alumniPost.findUnique({ where: { id }, include: { user: { select: { uid: true, nickname: true } }, section: true, comments: { orderBy: { createdAt: 'desc' }, include: { user: { select: { uid: true, nickname: true } } } } } });
  if (!p) throw new ApiError(40003, '帖子不存在');
  return p;
}
// 编辑帖子内容（title/content/isAnonymous，content 经 XSS 过滤）
export async function updateAlumniPost(id: number, d: any) {
  const p = await prisma.alumniPost.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '帖子不存在');
  const data: any = {};
  if (d.title !== undefined) data.title = d.title;
  if (d.sectionId !== undefined) data.sectionId = d.sectionId;
  if (d.isAnonymous !== undefined) data.isAnonymous = !!d.isAnonymous;
  if (d.content !== undefined) data.content = sanitizeHtml(d.content);
  return prisma.alumniPost.update({ where: { id }, data });
}
// 上线/下线（下线时需填原因，发送站内信通知作者）
export async function setAlumniPostStatus(id: number, isActive: boolean, reason?: string) {
  const p = await prisma.alumniPost.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '帖子不存在');
  if (!isActive && !reason) throw new ApiError(40001, '下架需填写原因备注');
  const updated = await prisma.alumniPost.update({ where: { id }, data: { isActive } });
  // 下线时发站内信通知作者
  if (!isActive) {
    const postType = p.type === 'confession' ? '表白墙' : '帖子';
    await prisma.notification.create({ data: { typeId: 1, title: `您的${postType}已被下架`, content: `您的${postType}已被管理员下架。原因：${reason}`, target: 'all' } });
  }
  return updated;
}
// 分页查询帖子评论
export async function getAlumniComments(postId: number, page: number, size: number) {
  const where = { postId };
  const [list, total] = await Promise.all([
    prisma.alumniComment.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' }, include: { user: { select: { uid: true, nickname: true } } } }),
    prisma.alumniComment.count({ where }),
  ]);
  return paginatedResult(list, total, page, size);
}
export async function pinAlumniPost(id: number, isPinned: boolean) {
  const p = await prisma.alumniPost.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '帖子不存在');
  return prisma.alumniPost.update({ where: { id }, data: { isPinned } });
}
export async function deleteAlumniPost(id: number) {
  const p = await prisma.alumniPost.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '帖子不存在');
  await prisma.$transaction([
    prisma.alumniLike.deleteMany({ where: { postId: id } }),
    prisma.alumniComment.deleteMany({ where: { postId: id } }),
    prisma.alumniPost.delete({ where: { id } }),
  ]);
  return true;
}
export async function deleteAlumniComment(id: number) {
  const c = await prisma.alumniComment.findUnique({ where: { id } });
  if (!c) throw new ApiError(40003, '评论不存在');
  const childCount = await prisma.alumniComment.count({ where: { parentId: id } });
  await prisma.$transaction([
    prisma.alumniComment.deleteMany({ where: { parentId: id } }),
    prisma.alumniComment.delete({ where: { id } }),
    prisma.alumniPost.update({ where: { id: c.postId }, data: { commentCount: { decrement: 1 + childCount } } }),
  ]);
  return true;
}
// ========== 抽奖管理 ==========
export async function createLotteryActivity(d: any) { return prisma.lotteryActivity.create({ data: d }); }
export async function getLotteryActivities(page: number, size: number) {
  const [list, total] = await Promise.all([
    prisma.lotteryActivity.findMany({ skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' }, include: { prizes: true } }),
    prisma.lotteryActivity.count(),
  ]);
  return paginatedResult(list, total, page, size);
}
export async function getLotteryActivity(id: number) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id }, include: { prizes: { orderBy: { sortOrder: 'asc' } } } });
  if (!a) throw new ApiError(40003, '活动不存在');
  return a;
}
// 上架/下架（status 仅允许 listed / off_shelf；上架前必须有奖品）
export async function setLotteryActivityList(id: number, status: string) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id }, include: { prizes: true } });
  if (!a) throw new ApiError(40003, '活动不存在');
  if (status === 'listed' && a.prizes.length === 0) throw new ApiError(40001, '上架前必须添加奖品');
  return prisma.lotteryActivity.update({ where: { id }, data: { status } });
}
// 删除活动（仅未上架/已下架可删；需同步删除奖品与抽奖记录）
export async function deleteLotteryActivity(id: number) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id } });
  if (!a) throw new ApiError(40003, '活动不存在');
  if (!['unlisted', 'off_shelf'].includes(a.status)) throw new ApiError(40001, '仅未上架或已下架的活动可删除');
  await prisma.$transaction([
    prisma.lotteryRecord.deleteMany({ where: { activityId: id } }),
    prisma.lotteryPrize.deleteMany({ where: { activityId: id } }),
    prisma.lotteryActivity.delete({ where: { id } }),
  ]);
  return true;
}
// 新增奖品（remaining 初始等于 quantity）
export async function createLotteryPrize(activityId: number, d: any) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id: activityId } });
  if (!a) throw new ApiError(40003, '活动不存在');
  const quantity = Number(d.quantity) || 0;
  return prisma.lotteryPrize.create({ data: { ...d, activityId, quantity, remaining: quantity } });
}
// 编辑奖品（修改 quantity 时同步按已发放数量重算 remaining）
export async function updateLotteryPrize(id: number, d: any) {
  const p = await prisma.lotteryPrize.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '奖品不存在');
  const data: any = { ...d };
  if (d.quantity !== undefined) {
    const issued = p.quantity - p.remaining;
    const q = Number(d.quantity) || 0;
    data.quantity = q;
    data.remaining = Math.max(0, q - issued);
  }
  return prisma.lotteryPrize.update({ where: { id }, data });
}
// 删除奖品（已有发放记录则不可删，同步校验库存）
export async function deleteLotteryPrize(id: number) {
  const p = await prisma.lotteryPrize.findUnique({ where: { id } });
  if (!p) throw new ApiError(40003, '奖品不存在');
  if (p.quantity - p.remaining > 0) throw new ApiError(40001, '该奖品已发放部分库存，无法删除');
  await prisma.lotteryPrize.delete({ where: { id } });
  return true;
}
// 编辑活动说明
export async function updateLotteryDescription(id: number, description: string) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id } });
  if (!a) throw new ApiError(40003, '活动不存在');
  return prisma.lotteryActivity.update({ where: { id }, data: { description } });
}
// 中奖记录（含用户 uid 与奖品名；schema 中 LotteryRecord 未建 prize 关联，奖品名按 prizeId 手动映射）
export async function getLotteryWinners(activityId: number, page: number, size: number) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id: activityId } });
  if (!a) throw new ApiError(40003, '活动不存在');
  const where = { activityId, isWin: true };
  const [list, total, prizes] = await Promise.all([
    prisma.lotteryRecord.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' }, include: { user: { select: { uid: true, nickname: true } } } }),
    prisma.lotteryRecord.count({ where }),
    prisma.lotteryPrize.findMany({ where: { activityId }, select: { id: true, name: true } }),
  ]);
  const pm: any = {}; prizes.forEach((p: any) => { pm[p.id] = p.name; });
  return paginatedResult(list.map(r => ({ ...r, prizeName: r.prizeId ? pm[r.prizeId] || '' : '' })), total, page, size);
}
// 中奖记录导出数据
export async function exportLotteryWinners(activityId: number) {
  const a = await prisma.lotteryActivity.findUnique({ where: { id: activityId } });
  if (!a) throw new ApiError(40003, '活动不存在');
  const [records, prizes] = await Promise.all([
    prisma.lotteryRecord.findMany({ where: { activityId, isWin: true }, orderBy: { createdAt: 'asc' }, include: { user: { select: { uid: true, nickname: true } } } }),
    prisma.lotteryPrize.findMany({ where: { activityId }, select: { id: true, name: true } }),
  ]);
  const pm: any = {}; prizes.forEach((p: any) => { pm[p.id] = p.name; });
  return records.map(r => ({ uid: r.user ? r.user.uid : '', nickname: r.user ? r.user.nickname : '', prizeName: r.prizeId ? pm[r.prizeId] || '' : '', wonAt: r.createdAt }));
}
// ========== 举报管理 ==========
export async function getReports(page: number, size: number, targetType?: string, status?: string) {
  const where: any = {};
  if (targetType) where.targetType = targetType;
  if (status) where.status = status;
  const [list, total] = await Promise.all([
    prisma.report.findMany({ where, skip: (page - 1) * size, take: size, orderBy: { createdAt: 'desc' } }),
    prisma.report.count({ where }),
  ]);
  const ids = Array.from(new Set(list.map(r => r.reporterUserId)));
  const users = ids.length ? await prisma.user.findMany({ where: { id: { in: ids } }, select: { id: true, uid: true, nickname: true } }) : [];
  const um: any = {}; users.forEach((u: any) => { um[u.id] = u; });
  return paginatedResult(list.map(r => ({ ...r, reporterUid: um[r.reporterUserId] ? um[r.reporterUserId].uid : '', reporterNickname: um[r.reporterUserId] ? um[r.reporterUserId].nickname : '' })), total, page, size);
}
// 查询被举报对象归属的用户 id（用于通知被举报者）
async function findTargetOwner(targetType: string, targetId: number): Promise<number | null> {
  if (targetType === 'item') { const i = await prisma.marketplaceItem.findUnique({ where: { id: targetId } }); return i ? i.userId : null; }
  if (targetType === 'post' || targetType === 'confession') { const p = await prisma.alumniPost.findUnique({ where: { id: targetId } }); return p ? p.userId : null; }
  if (targetType === 'comment') { const c = await prisma.alumniComment.findUnique({ where: { id: targetId } }); return c ? c.userId : null; }
  return null;
}
// 处理举报：takedown 商品下架/帖子删除；delete 直接删除被举报对象；ignore 忽略；处理后通知双方
export async function handleReport(id: number, action: string, handleRemark: string) {
  const r = await prisma.report.findUnique({ where: { id } });
  if (!r) throw new ApiError(40003, '举报不存在');
  const ownerId = await findTargetOwner(r.targetType, r.targetId);
  if (action === 'takedown') {
    if (r.targetType === 'item') {
      const it = await prisma.marketplaceItem.findUnique({ where: { id: r.targetId } });
      if (it) await prisma.marketplaceItem.update({ where: { id: r.targetId }, data: { status: 'off' } });
    } else if (r.targetType === 'post' || r.targetType === 'confession') {
      const p = await prisma.alumniPost.findUnique({ where: { id: r.targetId } });
      if (p) await deleteAlumniPost(r.targetId);
    }
  } else if (action === 'delete') {
    if (r.targetType === 'item') {
      const it = await prisma.marketplaceItem.findUnique({ where: { id: r.targetId } });
      if (it) await prisma.marketplaceItem.delete({ where: { id: r.targetId } });
    } else if (r.targetType === 'post' || r.targetType === 'confession') {
      const p = await prisma.alumniPost.findUnique({ where: { id: r.targetId } });
      if (p) await deleteAlumniPost(r.targetId);
    } else if (r.targetType === 'comment') {
      const c = await prisma.alumniComment.findUnique({ where: { id: r.targetId } });
      if (c) await deleteAlumniComment(r.targetId);
    }
  }
  const status = action === 'ignore' ? 'ignored' : 'handled';
  const updated = await prisma.report.update({ where: { id }, data: { status, handleResult: handleRemark || '' } });
  // 站内信通知举报者与被举报者
  const reporterMsg = action === 'ignore' ? '您的举报已处理：经核实暂未发现违规，感谢您的反馈。' : '您的举报已核实，相关内容已处理，感谢您的反馈。';
  await prisma.notification.create({ data: { typeId: 1, title: '举报处理通知', content: reporterMsg, target: 'all' } });
  if (ownerId !== null) {
    const ownerMsg = action === 'ignore' ? '有用户举报了您发布的内容，经核实未发现违规。' : '您发布的内容经举报核实违规，已被处理，请遵守社区规范。';
    await prisma.notification.create({ data: { typeId: 1, title: '内容举报通知', content: ownerMsg, target: 'all' } });
  }
  return updated;
}
