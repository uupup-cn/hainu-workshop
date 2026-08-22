// 工具管理路由：工具分类 / 工具 / 使用记录 / 影视解析线路
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/tool.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 工具分类
router.get('/tool-categories', adminAuthMiddleware, ctrl.listToolCategories);
router.post('/tool-categories', adminAuthMiddleware, ctrl.createToolCategory);
router.put('/tool-categories/:id', adminAuthMiddleware, ctrl.updateToolCategory);
router.delete('/tool-categories/:id', adminAuthMiddleware, ctrl.deleteToolCategory);
// 工具
router.get('/tools', adminAuthMiddleware, ctrl.listTools);
router.post('/tools', adminAuthMiddleware, ctrl.createTool);
router.put('/tools/:id', adminAuthMiddleware, ctrl.updateTool);
router.delete('/tools/:id', adminAuthMiddleware, ctrl.deleteTool);
// 工具使用记录
router.get('/tools/usage-log', adminAuthMiddleware, ctrl.listUsageLogs);
// 影视解析线路
router.get('/video-parse-lines', adminAuthMiddleware, ctrl.listVideoParseLines);
router.post('/video-parse-lines', adminAuthMiddleware, ctrl.createVideoParseLine);
router.put('/video-parse-lines/:id', adminAuthMiddleware, ctrl.updateVideoParseLine);
router.delete('/video-parse-lines/:id', adminAuthMiddleware, ctrl.deleteVideoParseLine);
export default router;
