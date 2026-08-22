/**
 * 节日庆祝配置
 *
 * 配置系统的节日烟花效果和祝福文本。
 * 支持单日节日和跨日期节日，可自定义单次触发的礼花播放次数。
 *
 * ## 配置说明
 *
 * - name: 节日名称
 * - date: 节日开始日期（格式：YYYY-MM-DD）
 * - endDate: 节日结束日期（可选，用于跨日期节日）
 * - image: 烟花图片（需要预先导入）
 * - scrollText: 滚动显示的祝福文本
 * - count: 单次触发时的礼花播放次数（可选，默认为 3 次）
 * - dailyFireworks: 日期区间内礼花是否每天触发一次（可选，默认为 false）
 *
 * ## 注意事项
 *
 * - 图片需要预先导入并在配置中引用
 * - 跨日期节日会在整个日期范围内生效
 * - 默认每个活动只触发一次礼花效果，dailyFireworks 为 true 时每天触发一次礼花
 *
 * @module config/modules/festival
 * @author Ci-Yuu-Plus Team
 */

import { FestivalConfig } from '@/types/config'
// import { WEB_LINKS } from '@/utils/constants'

// 导入烟花图片（根据需要取消注释）
// import sd from '@imgs/ceremony/sd.png'
// import yd from '@imgs/ceremony/yd.png'

export const festivalConfigList: FestivalConfig[] = [
  // 跨日期示例
  // {
  //   name: '6.18 活动',
  //   date: '2026-06-11',
  //   endDate: '2026-06-19',
  //   image: '',
  //   count: 3,
  //   dailyFireworks: true,
  //   scrollText: `🎉 618 限时特惠｜6 月 12 日 - 6 月 18 日 自用授权仅需 999 元，商业授权仅需 1899 元，最高立省 ¥400，活动结束恢复原价 <a href="${WEB_LINKS.PRO_INTRODUCE}" target="_blank" rel="noopener noreferrer">立即抢购 →</a>`
  // }
  // 单日示例：圣诞节
  // {
  //   name: '圣诞节',
  //   date: '2024-12-25',
  //   image: sd,
  //   count: 3 // 可选，不设置则使用默认值 3 次
  //   scrollText: 'Merry Christmas！Ci-Yuu-Plus 祝您圣诞快乐，愿节日的欢乐与祝福如雪花般纷至沓来！',
  // }
]
