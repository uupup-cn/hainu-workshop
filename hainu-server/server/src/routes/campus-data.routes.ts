import Router from 'koa-router';
import { authMiddleware, optionalAuthMiddleware, adminAuthMiddleware } from '../middlewares/auth.middleware';
import * as ctrl from '../controllers/campus-data.controller';

const router = new Router({ prefix: '/api/v1/roommate' });

router.get('/campuses', authMiddleware, ctrl.getCampuses);
router.get('/colleges', authMiddleware, ctrl.getColleges);
router.get('/departments', authMiddleware, ctrl.getDepartments);
router.get('/majors', authMiddleware, ctrl.getMajors);
router.get('/buildings', authMiddleware, ctrl.getBuildings);

export default router;
