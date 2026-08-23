// 内容管理 + 找室友管理 控制器（入学指南/生活攻略/FAQ/海大介绍/电话簿/校历/地图/出行/找室友）
import { Context } from 'koa';
import { success } from '../../utils/response';
import { parsePagination } from '../../utils/pagination';
import { ApiError } from '../../utils/api-error';
import * as cs from '../../services/admin/content.service';

// 入学指南
export async function listGuideEntries(ctx: Context) { const { keyword } = ctx.query as any; ctx.body = success(await cs.guideEntries.list(keyword)); }
export async function getGuideEntry(ctx: Context) { ctx.body = success(await cs.guideEntries.get(Number(ctx.params.id))); }
export async function createGuideEntry(ctx: Context) { ctx.body = success(await cs.guideEntries.create(ctx.request.body)); }
export async function updateGuideEntry(ctx: Context) { ctx.body = success(await cs.guideEntries.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteGuideEntry(ctx: Context) { ctx.body = success(await cs.guideEntries.delete(Number(ctx.params.id))); }
// 生活攻略
export async function listLifeTopics(ctx: Context) { const { campus, keyword } = ctx.query as any; ctx.body = success(await cs.lifeTopics.list(campus, keyword)); }
export async function getLifeTopic(ctx: Context) { ctx.body = success(await cs.lifeTopics.get(Number(ctx.params.id))); }
export async function createLifeTopic(ctx: Context) { ctx.body = success(await cs.lifeTopics.create(ctx.request.body)); }
export async function updateLifeTopic(ctx: Context) { ctx.body = success(await cs.lifeTopics.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteLifeTopic(ctx: Context) { ctx.body = success(await cs.lifeTopics.delete(Number(ctx.params.id))); }
// 新生FAQ 分类
export async function listFaqCategories(ctx: Context) { const { keyword } = ctx.query as any; ctx.body = success(await cs.faqCategories.list(keyword)); }
export async function getFaqCategory(ctx: Context) { ctx.body = success(await cs.faqCategories.get(Number(ctx.params.id))); }
export async function createFaqCategory(ctx: Context) { ctx.body = success(await cs.faqCategories.create(ctx.request.body)); }
export async function updateFaqCategory(ctx: Context) { ctx.body = success(await cs.faqCategories.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteFaqCategory(ctx: Context) { ctx.body = success(await cs.faqCategories.delete(Number(ctx.params.id))); }
// 新生FAQ 问题
export async function listFaqQuestions(ctx: Context) { const { categoryId, keyword } = ctx.query as any; ctx.body = success(await cs.faqQuestions.list(categoryId, keyword)); }
export async function getFaqQuestion(ctx: Context) { ctx.body = success(await cs.faqQuestions.get(Number(ctx.params.id))); }
export async function createFaqQuestion(ctx: Context) { ctx.body = success(await cs.faqQuestions.create(ctx.request.body)); }
export async function updateFaqQuestion(ctx: Context) { ctx.body = success(await cs.faqQuestions.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteFaqQuestion(ctx: Context) { ctx.body = success(await cs.faqQuestions.delete(Number(ctx.params.id))); }
// 海大介绍
export async function listIntroEntries(ctx: Context) { const { keyword } = ctx.query as any; ctx.body = success(await cs.introEntries.list(keyword)); }
export async function getIntroEntry(ctx: Context) { ctx.body = success(await cs.introEntries.get(Number(ctx.params.id))); }
export async function createIntroEntry(ctx: Context) { ctx.body = success(await cs.introEntries.create(ctx.request.body)); }
export async function updateIntroEntry(ctx: Context) { ctx.body = success(await cs.introEntries.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteIntroEntry(ctx: Context) { ctx.body = success(await cs.introEntries.delete(Number(ctx.params.id))); }
// 电话簿分类
export async function listPhonebookCategories(ctx: Context) { const { campusId, keyword } = ctx.query as any; ctx.body = success(await cs.phonebookCategories.list(campusId, keyword)); }
export async function getPhonebookCategory(ctx: Context) { ctx.body = success(await cs.phonebookCategories.get(Number(ctx.params.id))); }
export async function createPhonebookCategory(ctx: Context) { ctx.body = success(await cs.phonebookCategories.create(ctx.request.body)); }
export async function updatePhonebookCategory(ctx: Context) { ctx.body = success(await cs.phonebookCategories.update(Number(ctx.params.id), ctx.request.body)); }
export async function deletePhonebookCategory(ctx: Context) { ctx.body = success(await cs.phonebookCategories.delete(Number(ctx.params.id))); }
// 电话簿条目
export async function listPhonebookEntries(ctx: Context) { const { categoryId, keyword } = ctx.query as any; ctx.body = success(await cs.phonebookEntries.list(categoryId, keyword)); }
export async function getPhonebookEntry(ctx: Context) { ctx.body = success(await cs.phonebookEntries.get(Number(ctx.params.id))); }
export async function createPhonebookEntry(ctx: Context) { ctx.body = success(await cs.phonebookEntries.create(ctx.request.body)); }
export async function updatePhonebookEntry(ctx: Context) { ctx.body = success(await cs.phonebookEntries.update(Number(ctx.params.id), ctx.request.body)); }
export async function deletePhonebookEntry(ctx: Context) { ctx.body = success(await cs.phonebookEntries.delete(Number(ctx.params.id))); }
// 校历（单例设置）
export async function listCalendar(ctx: Context) { ctx.body = success(await cs.calendar.list()); }
export async function updateCalendar(ctx: Context) { ctx.body = success(await cs.calendar.update(Number(ctx.params.id), ctx.request.body)); }
// 校园地图
export async function listMaps(ctx: Context) { ctx.body = success(await cs.maps.list()); }
export async function updateMap(ctx: Context) { ctx.body = success(await cs.maps.update(Number(ctx.params.id), ctx.request.body)); }
// 地图标记
export async function listMapMarkers(ctx: Context) { ctx.body = success(await cs.mapMarkers.list(Number(ctx.params.id))); }
export async function createMapMarker(ctx: Context) { ctx.body = success(await cs.mapMarkers.create(Number(ctx.params.id), ctx.request.body)); }
export async function updateMapMarker(ctx: Context) { ctx.body = success(await cs.mapMarkers.update(Number(ctx.params.markerId), ctx.request.body)); }
export async function deleteMapMarker(ctx: Context) { ctx.body = success(await cs.mapMarkers.delete(Number(ctx.params.markerId))); }
// 校园出行（班车时刻）
export async function listBusSchedules(ctx: Context) { const { keyword } = ctx.query as any; ctx.body = success(await cs.busSchedules.list(keyword)); }
export async function getBusSchedule(ctx: Context) { ctx.body = success(await cs.busSchedules.get(Number(ctx.params.id))); }
export async function createBusSchedule(ctx: Context) { ctx.body = success(await cs.busSchedules.create(ctx.request.body)); }
export async function updateBusSchedule(ctx: Context) { ctx.body = success(await cs.busSchedules.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteBusSchedule(ctx: Context) { ctx.body = success(await cs.busSchedules.delete(Number(ctx.params.id))); }
// 校园出行（车站）
export async function listBusStations(ctx: Context) { const { keyword } = ctx.query as any; ctx.body = success(await cs.busStations.list(keyword)); }
export async function getBusStation(ctx: Context) { ctx.body = success(await cs.busStations.get(Number(ctx.params.id))); }
export async function createBusStation(ctx: Context) { ctx.body = success(await cs.busStations.create(ctx.request.body)); }
export async function updateBusStation(ctx: Context) { ctx.body = success(await cs.busStations.update(Number(ctx.params.id), ctx.request.body)); }
export async function deleteBusStation(ctx: Context) { ctx.body = success(await cs.busStations.delete(Number(ctx.params.id))); }
// 找室友管理
export async function getRoommateSettings(ctx: Context) { ctx.body = success(await cs.getRoommateSetting()); }
export async function updateRoommateSettings(ctx: Context) { ctx.body = success(await cs.updateRoommateSetting(ctx.request.body)); }
export async function listRoommatePosts(ctx: Context) { const { page, size } = parsePagination(ctx.query); const { campusId } = ctx.query as any; ctx.body = success(await cs.getRoommatePosts(page, size, campusId)); }
export async function getRoommatePost(ctx: Context) { ctx.body = success(await cs.getRoommatePost(Number(ctx.params.id))); }
export async function deleteRoommatePost(ctx: Context) { ctx.body = success(await cs.deleteRoommatePost(Number(ctx.params.id))); }
export async function getBusGuide(ctx: Context) { ctx.body = success(await cs.busGuide.get()); }
export async function updateBusGuide(ctx: Context) { const { content } = ctx.request.body as any; if (typeof content !== 'string' || !content.trim()) throw new ApiError(40001, '指南内容不能为空'); ctx.body = success(await cs.busGuide.update(content)); }
