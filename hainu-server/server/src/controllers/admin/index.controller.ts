import { Context } from 'koa';
import { success } from '../../utils/response';
import { ApiError } from '../../utils/api-error';
import * as us from '../../services/admin/user.service';
import * as cd from '../../services/admin/campus-data.service';

// 用户管理
export async function getUserList(ctx: Context) { const { page, size, keyword } = ctx.query as any; ctx.body = success(await us.getUserList(Number(page)||1, Number(size)||20, keyword)); }
export async function getUserDetail(ctx: Context) { ctx.body = success(await us.getUserDetail(Number(ctx.params.id))); }
export async function updateUser(ctx: Context) { ctx.body = success(await us.updateUser(Number(ctx.params.id), ctx.request.body)); }
export async function deleteUser(ctx: Context) { ctx.body = success(await us.deleteUser(Number(ctx.params.id))); }
// 认证审核
export async function getAuthApplications(ctx: Context) { const { page, size, status } = ctx.query as any; ctx.body = success(await us.getAuthApplications(Number(page)||1, Number(size)||20, status)); }
export async function reviewAuthApplication(ctx: Context) { const { status, reviewRemark } = ctx.request.body as any; if (!status || !['approved','rejected'].includes(status)) throw new ApiError(40001, '审核状态无效'); ctx.body = success(await us.reviewAuthApplication(Number(ctx.params.id), status, reviewRemark||'')); }

// 校区
export async function listCampuses(ctx: Context) { ctx.body = success(await cd.campuses.list()); }
export async function createCampus(ctx: Context) { ctx.body = success(await cd.campuses.create(ctx.request.body)); }
export async function updateCampus(ctx: Context) { ctx.body = success(await cd.campuses.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteCampus(ctx: Context) { ctx.body = success(await cd.campuses.delete(Number(ctx.params.id))); }
// 书院
export async function listColleges(ctx: Context) { const cid = ctx.query.campusId ? Number(ctx.query.campusId) : undefined; ctx.body = success(await cd.colleges.list(cid)); }
export async function createCollege(ctx: Context) { ctx.body = success(await cd.colleges.create(ctx.request.body)); }
export async function updateCollege(ctx: Context) { ctx.body = success(await cd.colleges.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteCollege(ctx: Context) { ctx.body = success(await cd.colleges.delete(Number(ctx.params.id))); }
// 学院
export async function listDepartments(ctx: Context) { const cid = ctx.query.campusId ? Number(ctx.query.campusId) : undefined; ctx.body = success(await cd.departments.list(cid)); }
export async function createDepartment(ctx: Context) { ctx.body = success(await cd.departments.create(ctx.request.body)); }
export async function updateDepartment(ctx: Context) { ctx.body = success(await cd.departments.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteDepartment(ctx: Context) { ctx.body = success(await cd.departments.delete(Number(ctx.params.id))); }
// 专业
export async function listMajors(ctx: Context) { const did = ctx.query.departmentId ? Number(ctx.query.departmentId) : undefined; ctx.body = success(await cd.majors.list(did)); }
export async function createMajor(ctx: Context) { ctx.body = success(await cd.majors.create(ctx.request.body)); }
export async function updateMajor(ctx: Context) { ctx.body = success(await cd.majors.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteMajor(ctx: Context) { ctx.body = success(await cd.majors.delete(Number(ctx.params.id))); }
// 楼栋
export async function listBuildings(ctx: Context) { const cid = ctx.query.collegeId ? Number(ctx.query.collegeId) : undefined; ctx.body = success(await cd.buildings.list(cid)); }
export async function createBuilding(ctx: Context) { ctx.body = success(await cd.buildings.create(ctx.request.body)); }
export async function updateBuilding(ctx: Context) { ctx.body = success(await cd.buildings.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteBuilding(ctx: Context) { ctx.body = success(await cd.buildings.delete(Number(ctx.params.id))); }
// 书院楼栋树
export async function getCollegeTree(ctx: Context) { const cid = ctx.query.campusId ? Number(ctx.query.campusId) : undefined; ctx.body = success(await cd.getCollegeTree(cid)); }
export async function getAuthApplicationDetail(ctx: Context) { ctx.body = success(await us.getAuthApplicationDetail(Number(ctx.params.id))); }
