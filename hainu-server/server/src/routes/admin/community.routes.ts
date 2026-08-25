// 社区管理 路由（二手集市/社区启停/快讯/校友圈/抽奖/举报处理）
import Router from 'koa-router';
import { adminAuthMiddleware } from '../../middlewares/auth.middleware';
import * as ctrl from '../../controllers/admin/community.controller';
const router = new Router({ prefix: '/api/v1/admin' });
// 二手集市
router.get('/marketplace/categories', adminAuthMiddleware, ctrl.listMarketplaceCategories);
router.post('/marketplace/categories', adminAuthMiddleware, ctrl.createMarketplaceCategory);
router.put('/marketplace/categories/:id', adminAuthMiddleware, ctrl.updateMarketplaceCategory);
router.delete('/marketplace/categories/:id', adminAuthMiddleware, ctrl.deleteMarketplaceCategory);
router.get('/marketplace/items', adminAuthMiddleware, ctrl.listMarketplaceItems);
router.get('/marketplace/items/:id', adminAuthMiddleware, ctrl.getMarketplaceItem);
router.delete('/marketplace/items/:id', adminAuthMiddleware, ctrl.deleteMarketplaceItem);
// 社区模块启停
router.put('/community/modules/:key', adminAuthMiddleware, ctrl.setCommunityModule);
// 快讯
router.get('/news', adminAuthMiddleware, ctrl.listNews);
router.post('/news', adminAuthMiddleware, ctrl.createNews);
router.put('/news/:id', adminAuthMiddleware, ctrl.updateNews);
router.delete('/news/:id', adminAuthMiddleware, ctrl.deleteNews);
// 校友圈版块
router.get('/alumni/sections', adminAuthMiddleware, ctrl.listAlumniSections);
router.post('/alumni/sections', adminAuthMiddleware, ctrl.createAlumniSection);
router.put('/alumni/sections/:id', adminAuthMiddleware, ctrl.updateAlumniSection);
router.delete('/alumni/sections/:id', adminAuthMiddleware, ctrl.deleteAlumniSection);
// 校友圈帖子/评论
router.get('/alumni/posts', adminAuthMiddleware, ctrl.listAlumniPosts);
router.get('/alumni/posts/:id/comments', adminAuthMiddleware, ctrl.listAlumniComments);
router.get('/alumni/posts/:id', adminAuthMiddleware, ctrl.getAlumniPost);
router.put('/alumni/posts/:id/pin', adminAuthMiddleware, ctrl.pinAlumniPost);
router.put('/alumni/posts/:id/status', adminAuthMiddleware, ctrl.setAlumniPostStatus);
router.put('/alumni/posts/:id', adminAuthMiddleware, ctrl.updateAlumniPost);
router.delete('/alumni/posts/:id', adminAuthMiddleware, ctrl.deleteAlumniPost);
router.delete('/alumni/comments/:id', adminAuthMiddleware, ctrl.deleteAlumniComment);
// 抽奖活动
router.post('/lottery/activities', adminAuthMiddleware, ctrl.createLotteryActivity);
router.get('/lottery/activities', adminAuthMiddleware, ctrl.listLotteryActivities);
router.get('/lottery/activities/:id', adminAuthMiddleware, ctrl.getLotteryActivity);
router.put('/lottery/activities/:id/list', adminAuthMiddleware, ctrl.setLotteryActivityList);
router.delete('/lottery/activities/:id', adminAuthMiddleware, ctrl.deleteLotteryActivity);
router.post('/lottery/activities/:id/prizes', adminAuthMiddleware, ctrl.createLotteryPrize);
router.put('/lottery/activities/:id/description', adminAuthMiddleware, ctrl.updateLotteryDescription);
router.get('/lottery/activities/:id/winners/export', adminAuthMiddleware, ctrl.exportLotteryWinners);
router.get('/lottery/activities/:id/winners', adminAuthMiddleware, ctrl.getLotteryWinners);
// 抽奖奖品
router.put('/lottery/prizes/:id', adminAuthMiddleware, ctrl.updateLotteryPrize);
router.delete('/lottery/prizes/:id', adminAuthMiddleware, ctrl.deleteLotteryPrize);
// 举报
router.get('/reports', adminAuthMiddleware, ctrl.listReports);
router.put('/reports/:id', adminAuthMiddleware, ctrl.handleReport);
export default router;
