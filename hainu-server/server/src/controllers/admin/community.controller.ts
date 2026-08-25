// 社区管理 控制器（二手集市/社区启停/快讯/校友圈/抽奖/举报处理）
import { Context } from 'koa';
import { success } from '../../utils/response';
import { ApiError } from '../../utils/api-error';
import { parsePagination } from '../../utils/pagination';
import * as cm from '../../services/admin/community.service';

// 二手集市分类
export async function listMarketplaceCategories(ctx: Context) { ctx.body = success(await cm.marketplaceCategories.list()); }
export async function createMarketplaceCategory(ctx: Context) { ctx.body = success(await cm.marketplaceCategories.create(ctx.request.body)); }
export async function updateMarketplaceCategory(ctx: Context) { ctx.body = success(await cm.marketplaceCategories.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteMarketplaceCategory(ctx: Context) { ctx.body = success(await cm.marketplaceCategories.delete(Number(ctx.params.id))); }
// 二手集市商品
export async function listMarketplaceItems(ctx: Context) { const { page, size } = parsePagination(ctx.query); const { status, categoryId, keyword } = ctx.query as any; ctx.body = success(await cm.getMarketplaceItems(page, size, status, categoryId, keyword)); }
export async function getMarketplaceItem(ctx: Context) { ctx.body = success(await cm.getMarketplaceItem(Number(ctx.params.id))); }
export async function deleteMarketplaceItem(ctx: Context) { ctx.body = success(await cm.deleteMarketplaceItem(Number(ctx.params.id))); }
// 社区模块启停
export async function setCommunityModule(ctx: Context) { const { isEnabled, moduleName } = ctx.request.body as any; if (typeof isEnabled !== 'boolean') throw new ApiError(40001, 'isEnabled 参数无效'); ctx.body = success(await cm.setCommunityModule(String(ctx.params.key), { isEnabled, moduleName })); }
// 快讯
export async function listNews(ctx: Context) { const { page, size } = parsePagination(ctx.query); const { keyword, status } = ctx.query as any; ctx.body = success(await cm.getNewsList(page, size, keyword, status)); }
export async function createNews(ctx: Context) { ctx.body = success(await cm.createNews(ctx.request.body)); }
export async function updateNews(ctx: Context) { ctx.body = success(await cm.updateNews(Number(ctx.params.id), ctx.request.body)); }
export async function deleteNews(ctx: Context) { ctx.body = success(await cm.deleteNews(Number(ctx.params.id))); }
// 校友圈版块
export async function listAlumniSections(ctx: Context) { ctx.body = success(await cm.alumniSections.list()); }
export async function createAlumniSection(ctx: Context) { ctx.body = success(await cm.alumniSections.create(ctx.request.body)); }
export async function updateAlumniSection(ctx: Context) { ctx.body = success(await cm.alumniSections.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteAlumniSection(ctx: Context) { ctx.body = success(await cm.alumniSections.delete(Number(ctx.params.id))); }
// 校友圈帖子/评论
export async function listAlumniPosts(ctx: Context) { const { page, size } = parsePagination(ctx.query); const { type, keyword } = ctx.query as any; ctx.body = success(await cm.getAlumniPosts(page, size, type, keyword)); }
export async function getAlumniPost(ctx: Context) { ctx.body = success(await cm.getAlumniPostDetail(Number(ctx.params.id))); }
export async function updateAlumniPost(ctx: Context) { ctx.body = success(await cm.updateAlumniPost(Number(ctx.params.id), ctx.request.body)); }
export async function setAlumniPostStatus(ctx: Context) { const { isActive } = ctx.request.body as any; if (typeof isActive !== 'boolean') throw new ApiError(40001, 'isActive 参数无效'); ctx.body = success(await cm.setAlumniPostStatus(Number(ctx.params.id), isActive)); }
export async function listAlumniComments(ctx: Context) { const { page, size } = parsePagination(ctx.query); ctx.body = success(await cm.getAlumniComments(Number(ctx.params.id), page, size)); }
export async function pinAlumniPost(ctx: Context) { const { isPinned } = ctx.request.body as any; if (typeof isPinned !== 'boolean') throw new ApiError(40001, 'isPinned 参数无效'); ctx.body = success(await cm.pinAlumniPost(Number(ctx.params.id), isPinned)); }
export async function deleteAlumniPost(ctx: Context) { ctx.body = success(await cm.deleteAlumniPost(Number(ctx.params.id))); }
export async function deleteAlumniComment(ctx: Context) { ctx.body = success(await cm.deleteAlumniComment(Number(ctx.params.id))); }
// 抽奖活动
export async function createLotteryActivity(ctx: Context) { const d = ctx.request.body as any; if (!d.name || !d.type || !d.startTime || !d.endTime) throw new ApiError(40001, '活动名称、类型、起止时间为必填项'); ctx.body = success(await cm.createLotteryActivity(d)); }
export async function listLotteryActivities(ctx: Context) { const { page, size } = parsePagination(ctx.query); ctx.body = success(await cm.getLotteryActivities(page, size)); }
export async function getLotteryActivity(ctx: Context) { ctx.body = success(await cm.getLotteryActivity(Number(ctx.params.id))); }
export async function setLotteryActivityList(ctx: Context) { const { status } = ctx.request.body as any; if (!['listed', 'off_shelf'].includes(status)) throw new ApiError(40001, 'status 仅支持 listed/off_shelf'); ctx.body = success(await cm.setLotteryActivityList(Number(ctx.params.id), status)); }
export async function deleteLotteryActivity(ctx: Context) { ctx.body = success(await cm.deleteLotteryActivity(Number(ctx.params.id))); }
// 抽奖奖品
export async function createLotteryPrize(ctx: Context) { const d = ctx.request.body as any; if (!d.name || !d.image || d.probability === undefined) throw new ApiError(40001, '奖品名称、图片、概率为必填项'); ctx.body = success(await cm.createLotteryPrize(Number(ctx.params.id), d)); }
export async function updateLotteryPrize(ctx: Context) { ctx.body = success(await cm.updateLotteryPrize(Number(ctx.params.id), ctx.request.body)); }
export async function deleteLotteryPrize(ctx: Context) { ctx.body = success(await cm.deleteLotteryPrize(Number(ctx.params.id))); }
// 抽奖活动说明 / 中奖数据
export async function updateLotteryDescription(ctx: Context) { const { description } = ctx.request.body as any; if (typeof description !== 'string') throw new ApiError(40001, '缺少活动说明'); ctx.body = success(await cm.updateLotteryDescription(Number(ctx.params.id), description)); }
export async function getLotteryWinners(ctx: Context) { const { page, size } = parsePagination(ctx.query); ctx.body = success(await cm.getLotteryWinners(Number(ctx.params.id), page, size)); }
// 中奖数据导出 CSV（UTF-8 BOM，便于 Excel 打开）
export async function exportLotteryWinners(ctx: Context) {
  const rows = await cm.exportLotteryWinners(Number(ctx.params.id));
  const esc = (v: any) => { const s = String(v === null || v === undefined ? '' : v); return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s; };
  const lines = [['用户UID', '用户昵称', '奖品名称', '中奖时间'].join(',')];
  for (const r of rows) lines.push([esc(r.uid), esc(r.nickname), esc(r.prizeName), esc(new Date(r.wonAt).toISOString())].join(','));
  ctx.set('Content-Type', 'text/csv; charset=utf-8');
  ctx.set('Content-Disposition', 'attachment; filename="lottery-winners-' + ctx.params.id + '.csv"');
  ctx.body = '\uFEFF' + lines.join('\r\n');
}
// 举报
export async function listReports(ctx: Context) { const { page, size } = parsePagination(ctx.query); const { targetType, status } = ctx.query as any; ctx.body = success(await cm.getReports(page, size, targetType, status)); }
export async function handleReport(ctx: Context) { const { action, handleRemark } = ctx.request.body as any; if (!['takedown', 'delete', 'ignore'].includes(action)) throw new ApiError(40001, 'action 仅支持 takedown/delete/ignore'); ctx.body = success(await cm.handleReport(Number(ctx.params.id), action, handleRemark || '')); }
