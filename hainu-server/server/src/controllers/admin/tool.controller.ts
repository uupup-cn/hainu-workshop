// 工具管理控制器：工具分类 / 工具 / 使用记录 / 影视解析线路
import { Context } from 'koa';
import { success } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import * as svc from '../../services/admin/tool.service';

// 工具分类
export async function listToolCategories(ctx: Context) { ctx.body = success(await svc.toolCategories.list()); }
export async function createToolCategory(ctx: Context) { ctx.body = success(await svc.toolCategories.create(ctx.request.body)); }
export async function updateToolCategory(ctx: Context) { ctx.body = success(await svc.toolCategories.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteToolCategory(ctx: Context) { ctx.body = success(await svc.toolCategories.delete(Number(ctx.params.id))); }
// 工具
export async function listTools(ctx: Context) { ctx.body = success(await svc.tools.list()); }
export async function createTool(ctx: Context) { ctx.body = success(await svc.tools.create(ctx.request.body)); }
export async function updateTool(ctx: Context) { ctx.body = success(await svc.tools.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteTool(ctx: Context) { ctx.body = success(await svc.tools.delete(Number(ctx.params.id))); }
// 工具使用记录
export async function listUsageLogs(ctx: Context) { const { page, size } = parsePagination(ctx.query); const toolKey = ctx.query.toolKey as string | undefined; ctx.body = success(await svc.listUsageLogs(page, size, toolKey)); }
// 影视解析线路
export async function listVideoParseLines(ctx: Context) { ctx.body = success(await svc.videoParseLines.list()); }
export async function createVideoParseLine(ctx: Context) { ctx.body = success(await svc.videoParseLines.create(ctx.request.body)); }
export async function updateVideoParseLine(ctx: Context) { ctx.body = success(await svc.videoParseLines.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteVideoParseLine(ctx: Context) { ctx.body = success(await svc.videoParseLines.delete(Number(ctx.params.id))); }
