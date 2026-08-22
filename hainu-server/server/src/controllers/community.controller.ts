import { Context } from 'koa';
import { success } from '../utils/response';
import * as svc from '../services/community.service';


// 社区模块启停状态（用户端）
export async function getModules(ctx: Context) { ctx.body = success(await svc.listModules()); }
