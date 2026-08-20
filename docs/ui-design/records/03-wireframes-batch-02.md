海大工坊 · 第二批页面线框
全局网格约定(继承第一批)
项	取值
页面宽度	375(标准 iPhone 设计稿基准)
页面内 padding	space-4(16)左右
卡片间距	区块间 space-6(24),卡片间 space-3(12)
状态栏 + NavBar	44 + 44 = 88
TabBar 高度	56 + 34(安全区)= 90
数字	所有时间/节次/价格开 tnum 等宽
1. 新生专题主页 <FreshmanHub>
进入路径:TabBar 中间位「新生专题」/ 首页「必办 4 项 → 更多」 页面用途:新生独立模块入口聚合,所有新生相关功能在这里聚合展开

布局说明
从上到下 5 个区块:

NavBar(gradient)
欢迎大卡(品牌头延伸)
主入口 4 项(2×2 Grid)
副入口 3 项(横向卡)
近期新生公告(列表)
线框
┌──────────────────────────────────────┐
│  ←   (gradient bg)        🔔 [Badge 3]│  NavBar gradient 88h
│       海 大 工 坊 · 新 生 专 题          │  H3 text-on-primary
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 欢迎大卡 bg bg-card
│  │  你好,小海 Newbie 🐚           │ │  radius-xl 16, shadow-card
│  │                                │ │
│  │  距离开学 47 天                  │ │  caption text-secondary
│  │  报到日 9 月 12 日 周四          │ │  h4 text-primary
│  │                                │ │
│  │  [今日新公告 3]   ›             │ │  primary 链接 + Badge
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────┬────────────┐        │ ← 主入口 2×2
│  │   📋         │   🚆       │        │
│  │  primary-50│ primary-50 │        │  Grid 4 列
│  ├────────────┼────────────┤        │
│  │  报到流程   │  来校路线   │        │  H4 16/24
│  │            │            │        │
│  ├────────────┼────────────┤        │
│  │  🏠 找室友  │  ❓ 新生问答 │        │
│  │  primary-50│  primary-50 │        │
│  ├────────────┴────────────┤        │
│  └────────────────────────┘         │
│  ↑ 整卡 bg bg-card radius-lg 12      │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 副入口 横向卡
│  │  💬 学长学姐答疑           ›   │ │  Card.Standard
│  ├────────────────────────────────┤
│  │  📮 校长信箱          [新功能]  │ │  mint Tag
│  ├────────────────────────────────┤
│  │  👥 新生群组          [找组织]  │ │  orange Tag
│  └────────────────────────────────┘ │
│                                      │ space-3
│  近期新生公告                           │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  [重要] 9 月 1 日新生报到…      │ │  PostItem 简化(详见社区)
│  │       校学生会 · 2 小时前        │
│  ├────────────────────────────────┤
│  │  [活动] 新生辩论赛报名启动…     │ │  orange Tag
│  │       校辩论队 · 昨天           │
│  └────────────────────────────────┘ │
│                                      │
│  [留白 + TabBar 安全区 90h]              │
└──────────────────────────────────────┘
   [TabBar · 4 等分]                    │ 90h
组件 & Token 引用
区块	组件	Token
NavBar	<NavBar variant="gradient">	primary-700→500 渐变, text-on-primary
欢迎大卡	<Card> 自定义	bg bg-card, radius-xl 16, shadow-card
Badge 数字	<Badge count>	danger + radius-full
4 主入口	<Card.Grid> × 4	primary-50 图标底, primary-500 图标
副入口列表	<Cell>	bg bg-card, border-light 分隔
Tag「新功能」	<Tag variant="mint">	mint-50 + mint-700
Tag「找组织」	<Tag variant="orange">	orange-50 + orange-700
公告列表	<PostItem>	头像 + caption text-tertiary
交互路径
触发	跳转
Grid 报到流程	→ 报到流程页(本批 #2)
Grid 来校路线	→ 来校路线页(本批 #3)
Grid 找室友	→ 找室友列表 / 发布(本批 #4)
Grid 新生问答	→ 新生 FAQ(本批 #5)
副入口 / 公告	对应详情页
备注
NavBar 选 gradient 是因为这是「品牌子模块入口」,作为整页情绪延伸;如果觉得与首页太接近,可在第二轮末尾切换为 default 配顶部条带 banner。
2. 报到流程页 <EnrollmentFlow>
进入路径:新生专题主页 / 个人中心 / 推送 页面用途:6 步入学流程的可视化跟踪,完成态自动同步学校数据

布局说明
从上到下 4 个区块:

NavBar(default)
总体进度卡
竖排步骤条(6 步,当前可展开)
底部固定 CTA
线框
┌──────────────────────────────────────┐
│  [←]            入学报到流程           │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 总体进度卡
│  │  报到总进度                       │ │  caption text-secondary
│  │  ▓▓▓░░░░  2 / 6 完成             │ │  Progress primary + tnum
│  │  完成 2 步,还需 18 天              │ │  caption text-tertiary
│  └────────────────────────────────┘ │  bg bg-card, radius-xl 16, shadow-card
│                                      │ space-6
│  流程详情                              │  H4 text-primary
│                                      │
│  ┌──                                │
│  │①  注册登录            ✓ 已完成  │ │ ← 步骤 1(已完成)
│  ││                                │ │
│  ││  完成时间 8/15 14:23            │ │  caption text-tertiary
│  ││  [查看回执 ›]                    │ │
│  │●                                │  primary-500
│  ├──────────────────────────────────┤
│  │②  报到审核            [进行中]   │  primary-50 圆 + primary-500 数字
│  ││                                │
│  │●  你的审核材料已提交,预计 1 个工作日  │
│  ││  完成。审核结果将以短信通知。         │  caption text-secondary
│  ││                                │
│  ││  [上传补充材料]  [催办]              │  weak button + text button
│  │●                                │  primary-500
│  ├──────────────────────────────────┤
│  │③  宿舍分配            ○ 待开始   │  neutral-300 圆
│  ││                                │
│  │○  审核通过后自动开放分配,届时会通知。 │  caption text-tertiary
│  ││                                │
│  ├──────────────────────────────────┤
│  │④  一卡通激活          ○         │
│  ││                                │
│  │○                                │  neutral-300
│  ││                                │
│  ├──────────────────────────────────┤
│  │⑤  缴费               ○         │
│  ││  待 ④ 完成后开放                  │
│  │○                                │
│  │                                   │
│  ├──────────────────────────────────┤
│  │⑥  军训                ○         │
│  ││  缴费完成后开放                    │
│  │○                                │
│  └─                                 │
│                                      │
│  [留白]                                │
└──────────────────────────────────────┘
   ┌────────────────────────────────┐   │ ← 固定底部 CTA
   │     [查看待办事项 (2)]         │   │  Button primary large block
   └────────────────────────────────┘   │  shadow-tab 顶部分隔
                                          │  90h 安全适配
组件 & Token 引用
区块	组件	Token
NavBar	<NavBar default>	bg bg-card
进度卡	<Card> + <Progress>	bg bg-card radius-xl, Progress primary
步骤条	<Steps> 竖排(自定义组合)	—
已完成态	✓ icon + 文字 text-tertiary	success / primary
进行中态	primary-50 圆底 + primary-500 数字	primary-50, primary-500
待开始态	neutral-300 圆 + neutral-500 数字	neutral-300
连接线	主线 primary-500(已完成),虚线 neutral-200(待开始)	primary-500, neutral-200
时间	caption + tnum	text-tertiary
操作按钮	weak button / text button	primary-50 / transparent
固定 CTA	primary large + shadow-tab	primary-500
交互路径
触发	行为
点击已完成步骤	展开查看详情 + 「查看回执」
点击进行中步骤	展开素材上传 + 催办
点击待开始步骤	Toast「待 ④ 完成后开放」
点击底部 CTA	跳到「我的待办」聚合页
备注
步骤条 竖排版本:由 <Cell> + 自定义图标组合而成,未在组件库新增 Steps 组件,只组合既有元素。
3. 来校路线页 <Route>
进入路径:新生专题主页 Grid / 首页倒计时卡 页面用途:不同校区不同出发点的交通指引

布局说明
从上到下 5 个区块:

NavBar default
校区切换 Segment(4 个校区)
当前校区介绍卡
出行方式 Tabs(机场/火车站/码头/自驾)
推荐路线列表(2-3 条)
线框
┌──────────────────────────────────────┐
│  [←]            来校路线              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← Segment 横向切换
│  │ [●海甸] [儋州] [城西] [观澜湖]    │ │  active primary-500
│  └────────────────────────────────┘ │  border-light 底
│                                      │
│  ┌────────────────────────────────┐ │ ← 校区介绍卡
│  │  🏛  海甸校区(主校区)             │ │  H4 text-primary
│  │  海口市美兰区人民大道 58 号         │ │  caption text-secondary
│  │  📞 0898-6628xxxx               │
│  │  [在地图中查看 ›]                  │ │  primary 文字链接
│  └────────────────────────────────┘ │  bg bg-card radius-lg
│                                      │ space-3
│  出发方式                              │  caption text-secondary
│  ┌────────────────────────────────┐ │
│  │ [●全部] [✈️ 机场] [🚆 车站] [🚢码头][🚗自驾]│  Tab 横向滚动
│  └────────────────────────────────┘ │
│                                      │
│  推荐路线                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  ✈️  海口美兰机场 → 海甸校区      │ │  Card.Standard
│  │  方案 1  公交 + 步行  ¥8     [mint 优选]│
│  ├────────────────────────────────┤
│  │      预计 65 分钟 · 中转 1 次      │ │  caption text-tertiary
│  │  [查看详细 ›]                      │ │
│  ├────────────────────────────────┤
│  │  ✈️  海口美兰机场 → 海甸校区      │
│  │  方案 2  出租车      ¥85        │
│  │      预计 40 分钟 · 适合夜班机     │
│  │  [查看详细 ›]                      │  orange Tag「适合夜班机」
│  ├────────────────────────────────┤
│  │  🚆  海口东站 → 海甸校区          │
│  │  方案 3  地铁 + 步行  ¥5         │
│  │      预计 30 分钟 · 中转 1 次      │
│  │  [查看详细 ›]                      │
│  └────────────────────────────────┘ │
│                                      │
│  出行小贴士                             │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ 💡  校车时刻表可在「智慧海大」查看 │ │  Cell list
│  ├────────────────────────────────┤
│  │ 💡  新生可凭录取通知书免费乘车    │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
校区切换	<Segment> 横向 + 滑动	active primary-500,底 border-light
校区介绍卡	<Card> 自定义	bg bg-card, radius-lg 12, shadow-card
「在地图中查看」	文字按钮	text-link primary-500
出行方式	<Segment> 横向 + 滑动	同上
路线卡	<Cell> 多行	bg bg-card, border-light
Tag「优选」	<Tag variant="mint">	mint-50 + mint-700
Tag「适合夜班机」	<Tag variant="orange">	orange-50 + orange-700
时间 / ¥ 数字	caption + tnum	text-primary / primary-500
小贴士	<Cell> 简化	bg bg-card
交互路径
触发	行为
切换校区	内容区整片刷新(同页刷新数据)
切换出发方式	路线列表筛选
路线卡 → 查看详细	地图模式 + 详细步骤
小贴士 → 智慧海大	跳转「智慧海大」主页(本批 #6)
4. 找室友 · 发布表单页 <RoommatePost>
进入路径:新生专题主页 Grid / 找室友列表悬浮按钮 FAB / 个人中心 页面用途:新生填写找室友需求,可被其他同学查看并申请

布局说明
从上到下 4 个区块:

NavBar default + 右上「草稿」
表单分组(基本 / 习惯 / 期望)
图片上传
底部固定按钮组(草稿 / 发布)
线框
┌──────────────────────────────────────┐
│  [←]   发布找室友     📝 草稿        │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌─ 基本信息 ─────────────────┐      │  GroupTitle caption
│  │                              │      │
│  │  所在校区 *                    │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │ 海甸校区                ▼ │ │  Select 48h
│  │  └──────────────────────────┘ │  border-default
│  │                              │ │
│  │  宿舍楼栋 *                    │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │ 紫荆 1 号楼(女生)        ▼ │ │  Cascader 与校区联动
│  │  └──────────────────────────┘ │ │
│  │                              │ │
│  │  床位类型                      │ │
│  │  ┌─ 上铺 ─┬─ 下铺 ─┬─ 不限 ─┐│  Segmented 横向单选
│  │  │  ●    │       │       │   │  active primary-50 + primary-500
│  │  └───────┴───────┴───────┘   │ │
│  │                              │ │
│  │  入住时间                      │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │ 2025-09-12             📅│ │  DatePicker
│  │  └──────────────────────────┘ │ │
│  └──────────────────────────────┘ │
│                                      │ space-6
│  ┌─ 关于自己 ─────────────────┐      │
│  │                              │      │
│  │  自我介绍 *                    │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │  介绍一下自己的作息、兴趣  │ │  Textarea 80h
│  │  │  吧(至少 20 字)             │ │  bg bg-card, border-default
│  │  │                          │ │ │
│  │  │                          │ │ │
│  │  └──────────────────────────┘ │ │
│  │  0 / 200                      │  caption text-placeholder
│  │                              │ │
│  │  我的性格(多选)                  │ │
│  │  [●爱整洁][●安静][ 不熬夜][ 夜猫]│  Tag selectable 22h
│  │  [ 早起][ 爱运动][ 爱阅读][ + 其他]│  选中:primary-50 + primary-500
│  └──────────────────────────────┘ │
│                                      │ space-6
│  ┌─ 期望室友 ─────────────────┐      │
│  │                              │      │
│  │  期望性格(多选)                  │ │
│  │  [ 爱整洁][ 不抽烟][ 安静][ 早起]│  Tag selectable
│  │  [ 爱运动][ 爱学习][ + 其他]      │  选中 mint-50 + mint-700
│  │                              │ │
│  │  其他期望                      │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │  对室友的特殊要求或说明…      │ │  Textarea 60h
│  │  └──────────────────────────┘ │ │
│  └──────────────────────────────┘ │
│                                      │ space-6
│  ┌─ 照片上传 ─────────────────┐      │
│  │  [+ 添加照片]                  │  ImageUpload 4 格
│  │  [    ] [    ] [    ] [    ]  │  占位 80×80, radius-md 8
│  │  (最多 6 张)                    │  caption text-tertiary
│  └──────────────────────────────┘ │
│                                      │ space-6
└──────────────────────────────────────┘

  ┌──────────────────────────────┐     │ ← 固定底部
  │  [保存草稿]   [立即发布]      │     │  bg bg-card, shadow-tab
  └──────────────────────────────┘     │  weak + primary
组件 & Token 引用
区块	组件	Token
NavBar 草稿	text button	text-link primary-500
Group Title	caption + border-light 分割	text-secondary + neutral-200
Select	<Select>	bg bg-card, border-default → primary-500
Cascader 楼栋	<Cascader> 校区→楼栋→楼层	同 Select
Segmented 床位	<Segment> 3 段	active primary-50 + primary-500
DatePicker	<Input readonly> + 📅 icon	bg bg-card
Textarea	<Input type="textarea">	bg bg-card, border-default
性格 Tag	<Tag variant="primary" closable=false> selectable	primary-50 + primary-500
期望 Tag	<Tag variant="mint"> selectable	mint-50 + mint-700
ImageUpload	自定义(图片 + 文字),不新增组件	radius-md 8
固定底部	bg bg-card + shadow-tab	shadow-tab top
草稿	<Button variant="secondary">	bg bg-card, border-default
发布	<Button variant="primary" size="large">	primary-500
交互路径
触发	行为
校区切换	楼栋 Select 联动重置
性格 / 期望 Tag	切换选中态(可多选)
字数超出	Toast warning + 截断
必填项缺失	发布按钮 disabled
保存草稿	Toast success「已保存草稿」+ 回主页
立即发布	提交审核 → Toast success → 跳转详情页
表单验证规则
字段	规则
校区 / 楼栋 / 入住时间 / 自我介绍	必填
自我介绍	≥ 20 字 ≤ 200 字
性格 / 期望	至少各选 1 项
图片	≤ 6 张,单张 ≤ 5MB
5. 新生 FAQ 搜索列表页 <FreshmanFAQ>
进入路径:新生专题主页 Grid / 入学流程页内链 页面用途:常见问题聚合 + 全文搜索

布局说明
从上到下 5 个区块:

NavBar default
搜索框
横向分类 Segment(6 个,可滚动)
热门搜索关键词(仅 Tab=全部时显示)
手风琴列表
线框
┌──────────────────────────────────────┐
│  [←]            新生问答              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 搜索框
│  │  🔍   搜索问题、关键词               │ │  Search radius-full
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 横向分类 Segment
│  │ [全部●][报到][学籍][宿舍][财务][生活]│  滑动
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  (仅 Tab=全部时显示)                    │
│  大家在搜                               │  caption text-tertiary
│  [报到时间] [宿舍分配] [一卡通] [缴费]│  Tag mint / primary
│  [军训安排] [户口迁移] [绿色通道]      │  radius-sm 4
│                                      │ space-3
│  共找到 28 个问题                         │  caption text-secondary
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 手风琴列表
│  │  Q  报到当天需要带哪些材料?      │ │  Cell 56h 折叠
│  │                          [mint 官方] │
│  │                            ▶   │  箭头 16
│  ├════════════════════════════════┤   │  展开分隔 border-light
│  │  Q  报到当天需要带哪些材料?      │ │  展开态
│  │                          [mint 官方] │
│  │                                │
│  │  A  报到当天请携带:               │ │  caption text-secondary
│  │     ① 录取通知书原件及复印件       │
│  │     ② 身份证原件及正反面复印件     │
│  │     ③ 近期 1 寸蓝底彩色照片 8 张   │
│  │     ④ 户口迁移证(需要迁移的同学)   │
│  │     ⑤ 高考准考证                 │
│  │                                │
│  │     [查看完整流程 ›]   [👍有用]   │ │  text button + 互动
│  ├────────────────────────────────┤
│  │  Q  宿舍什么时候可以入住?          ▶│
│  ├────────────────────────────────┤
│  │  Q  一卡通如何激活?              ▶│
│  ├────────────────────────────────┤
│  │  Q  学费什么时候缴?怎么缴?       ▶│
│  ├────────────────────────────────┤
│  │  ...更多                            │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
搜索框	<Search shape="round">	neutral-100 bg, primary-500 聚焦
分类 Tab	<Segment> 横向 + 滑动	active primary-500
搜索关键词	<Tag variant="mint"> 或 primary	mint-50 / primary-50
手风琴 Cell	<Cell> + 自定义展开	bg bg-card, border-light
「官方」Tag	<Tag variant="mint">	mint-50 + mint-700
答案文字	body caption + text-secondary	text-secondary
「查看完整流程」	<Button variant="text">	text-link
箭头 ▶ / ▼	16×16 icon	text-tertiary
交互路径
触发	行为
搜索框输入	实时显示匹配问题,列表替换
切换分类	列表筛选
手风琴展开	单个展开,其他自动折叠(也可同时多展开)
「查看完整流程」	跳报到流程页
「👍有用」	Toast success + 数字 +1
6. 智慧海大主页 <SmartHNU>
进入路径:首页底部 TabBar 第二位 / 来校路线小贴士入口 页面用途:校园服务聚合入口(8 主入口 + 3 业务 + 待办)

布局说明
从上到下 5 个区块:

NavBar default
搜索框
8 主入口 2×4 Grid
常用业务 横向卡
我的待办 / 一卡通
线框
┌──────────────────────────────────────┐
│  [←]      [智能助手]      🔔 ●        │  NavBar default + Badge
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 搜索框
│  │  🔍   搜索服务,如「打印成绩单」     │ │  Search
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ┌─ 热门服务 ─────────────────┐      │  Section title h4
│  │                                │      │
│  │   [海大介绍]  [电话簿]  [校历] [图书馆]│ ← 2×4 Grid(图标 32)
│  │                                │ │
│  │   [一卡通]  [空教室]  [成绩] [校园地图] │
│  │                                │ │
│  │  ↑ 图标底 primary-50 圆          │
│  │   文字 caption                   │
│  └──────────────────────────────┘ │ 整卡 bg bg-card radius-xl 16
│                                      │ space-6
│  ┌────────────────────────────────┐ │ ← 我的待办卡
│  │  ⚡  我的待办                  3 │ │  H4 + Badge mint「3」
│  │                                │ │
│  │  [橙底] 宿舍电费充值            [去做]│ ← Card.Tool 风格
│  │  [橙底] 借书逾期归还          [提醒]│
│  │  [橙底] 体测预约                [新]│
│  └────────────────────────────────┘ │  bg bg-card radius-lg
│                                      │ space-6
│  常用业务                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← Cell 列表
│  │  📋  业务办理             ›    │ │
│  ├────────────────────────────────┤
│  │  📮  投诉建议           [免登录]│ │  mint Tag「免登录」
│  ├────────────────────────────────┤
│  │  💚  心理咨询             ›    │ │
│  ├────────────────────────────────┤
│  │  🏥  校医院预约          [24h] │ │  orange Tag「24h」
│  └────────────────────────────────┘ │
│                                      │
│  [留白 + TabBar]                        │
└──────────────────────────────────────┘
   [TabBar · 4 等分]                    │ 90h
组件 & Token 引用
区块	组件	Token
NavBar	<NavBar default> + <Badge> 红点	text-secondary
搜索框	<Search>	neutral-100 bg
8 主入口整卡	<Card> 包裹自定义网格	bg bg-card, radius-xl 16, shadow-card
8 单格	圆 48 + primary-50 底 + primary-500 图标 24 + caption	primary-50, primary-500
待办卡	<Card.Tool>	orange-50 装饰, caption text-tertiary
业务 Cell	<Cell>	bg bg-card, border-light
待办 Badge	<Badge variant="mint"> count	mint-500(注:见末尾备注)
「免登录」Tag	<Tag variant="mint">	mint-50 + mint-700
「24h」Tag	<Tag variant="orange">	orange-50 + orange-700
颜色配比自检
颜色	用处	占比(估)
中性色 / bg	卡片底、底色、文字	~ 75%
primary-50	8 主入口图标底	~ 18%
primary-500	图标、链接、CTA	~ 5%(合不超过 25%)
mint	Tag + Badge	~ 4%(<10%)
orange	Tag + 待办装饰	~ 3%(<5%)
主色 18 + 5 = 23%,薄荷 4% < 10%,橙 3% < 5% ✓

7. 社区主页 <Community>
进入路径:底部 TabBar 第三位(全员) 页面用途:信息流 + 版块入口 + 运营位

布局说明
从上到下 5 个区块:

NavBar default
搜索框
推荐 Banner(轮播)
5 版块横向入口
信息流(PostItem 多张)
线框
┌──────────────────────────────────────┐
│  [←]      社区         👥 [+发布]    │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 搜索框
│  │  🔍   搜索同学、话题、帖子…         │ │  Search
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 运营 Banner(轮播)
│  │                                │ │  bg orange-50 装饰
│  │  🎓  新生季话题挑战               │ │  H4 text-primary
│  │      参与赢海大周边               │ │  caption text-tertiary
│  │      [立即参加 ›]                  │ │  weak button
│  │                             [1/3]│ │  指示点 radius-full
│  └────────────────────────────────┘ │  radius-lg 12, shadow-card
│                                      │ space-6
│  版块                                   │  H4 text-primary
│  ┌──────┬──────┬──────┬──────┬─────┐ │ ← 横向滚动 5 个
│  │ 🛒    │ 📰    │ 🎓    │ 🤝   │ ✨   │ │  图标 32
│  │primary│ mint │ orange│primary│ mint │   │  icon bg
│  │ 二手   │ 快讯  │ 校友圈 │搭子  │ 兴趣 │   │  label caption
│  │ 集市  │     │        │     │     │
│  └──────┴──────┴──────┴──────┴─────┘ │
│                                      │ space-3
│  [Segment 横向分类]                   │  全部 | 关注 | 同城 | 热门
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← PostItem 1
│  │ [头像] @张三 · 5 分钟前   [#新生] │
│  │       高数第一天,有什么建议吗?     │  body 14/22
│  │       ┌────────────────┐       │
│  │       │   4:3 图片         │       │
│  │       └────────────────┘       │
│  │       标签:[自习][求学长]        │  Tag small mint / primary
│  │       💬 12   👍 34   ⭐         │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← PostItem 2(图文)
│  │ [头像] @李同学 · 30 分钟前       │
│  │       宿舍四人局,周末走起 🎬       │
│  │       ┌────────────────┐       │
│  │       │  1:1 / 4:3 拼接图  │       │
│  │       └────────────────┘       │
│  │       💬 5   👍 78   ⭐         │
│  └────────────────────────────────┘ │
│                                      │
│  ┌─ 智能助手小卡 ─┐                   │ ← 浮动小卡(可选)
│  │  💡  给新生推荐你想加的版块吧      │  Card.Tool 风格
│  │      [选一个 ›]                   │
│  └─────────────────┘                 │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 浮动发布条
│  │  ✍️  写下你的想法…                  │ │  bg bg-card + primary 装饰
│  └────────────────────────────────┘ │  radius-full ,shadow-card
│                                      │
│  [留白 + TabBar 90h]                  │
└──────────────────────────────────────┘
   [TabBar · 4 等分]                    │ 90h
组件 & Token 引用
区块	组件	Token
搜索框	<Search>	neutral-100 bg
Banner	轮播图(自定义组合 <Card>)	orange-50 装饰背景, radius-lg 12, shadow-card
指示点	圆点 6×6	选中 primary-500, 未选 neutral-300
版块 5 项	横向滚动(自定义组合)	底色循环 primary-50 / mint-50 / orange-50
分类 Segment	<Segment>	active primary-500
PostItem	<Card> + <Cell> 混合(详见 5.3)	头像 40 + caption text-tertiary
Tag「#新生」	<Tag variant="primary">	primary-50 + primary-500
Tag「自习」「求学长」	<Tag variant="mint"> 或 primary	mint-50 / primary-50
互动图标	16,数字 caption	text-tertiary
智能助手小卡	<Card.Tool>	orange-50 + orange-500
浮动发布条	文字 + primary 装饰条	bg bg-card, radius-full, shadow-card
颜色配比自检
颜色	占比
中性 / bg	~ 75%
primary 总	~ 17% (<25% ✓)
mint 总	~ 6% (<10% ✓)
orange 总	~ 4% (<5% ✓)
8. 课表主页(周视图) <ScheduleWeek>
进入路径:底部 TabBar「课表」/ 本科生首页「今日课程 → 全部」 页面用途:展示一周课程,支持切换周次、查看课程详情

布局说明
从上到下 5 个区块:

NavBar default
周次切换器(左右箭头 + 当前周 + 今日按钮)
星期 header(7 列)+ 时间列左轴
课表格子主体(按时间轴 × 星期)
浮动「+ 添加课程」FAB
线框
┌──────────────────────────────────────┐
│  [←]      课表 周视图      📅 日视图 │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 周次切换器
│  │  ◀        第 3 周              ▶│ │  H4 主色 tnum
│  │        09/16 - 09/22            │ │  caption text-secondary
│  │                  [  今日  ]      │ │  weak button
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-3
│  ┌──────────────────────────────────┐│ ← 星期 header(7 列)
│  │ │ 一 │ 二 │ 三●│ 四 │ 五 │ 六 │ 日 │
│  │ │ 16│ 17│ 18│ 19│ 20│ 21│ 22│ │  caption tnum
│  │ │─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬─┬┤
│  │ 08:00                                            │ │ 时间轴左列
│  │ │  ┌──────────┐               │              │  │  ↓
│  │ │ │▌高等数学   │                                │ │  课程格子
│  │ │ │▌教务楼 301│                                │ │  4px 色条
│  │ │ │▌ 1-2 节  │                                │ │  primary
│  │ │ │▌李教授   │                                │ │  必修
│  │ │ │└──────────┘                                │ │
│  │ 10:00  ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│  │ 12:00                                            │
│  │ │  ┌──────────┐                                │
│  │ │ │▌大学英语   │       ┌──────────┐            │
│  │ │ │▌教学楼 205│       │▌软件工程   │            │
│  │ │ │▌ 3-4 节  │       │▌实验楼 401│            │
│  │ │ │▌王老师   │       │▌实验       │            │
│  │ │ │primary   │       │orange-500 │            │
│  │ │ └──────────┘       └──────────┘            │
│  │ 14:00                                            │
│  │ │           ┌──────────┐                       │
│  │ │           │▌数据库原理 │                       │
│  │ │           │▌机房 201│                       │
│  │ │           │▌ mint-500│                       │  选修
│  │ │           │└──────────┘                       │
│  │ 16:00 ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─ ─       │
│  │ 18:00                                            │
│  │ 20:00                                            │
│  │     ──(当前时间线,primary-500 横线)─              │
│  │ 22:00                                            │
│  └──────────────────────────────────┘
│                                      │
│  [留白]                                │
└──────────────────────────────────────┘
   [+ 添加课程]  ← 浮动 FAB         │  primary-500 bg, radius-full 56×56
   [TabBar · 4 等分]                │ 90h
组件 & Token 引用
区块	组件	Token
周次切换	<Card> 自定义 + 箭头 + weak button	bg bg-card, radius-lg 12
箭头	24×24 icon	text-tertiary
周次数字	H4 主色 + tnum	primary-500
「今日」按钮	<Button variant="weak" size="small">	primary-50 + primary-500
星期 header	caption + tnum	当前日 primary-500, 其他 text-secondary
课表外框	<Card>	bg bg-card, radius-lg 12, shadow-card
课程格	圆角 radius-md 8,左 4px 色条	bg bg-card, shadow-xs
必修色条	primary-500	—
选修色条	mint-500	—
实验色条	orange-500	—
当前时间线	横线 1.5px primary-500 + 8 圆点	primary-500
时间轴左列	caption + tnum	text-tertiary
FAB	自定义 56×56	primary-500 bg, white icon, shadow-float
课程类型颜色限定
类型	色条	备注
必修	primary-500	所有身份主色
选修	mint-500	体育 / 通识
实验 / 实践	orange-500	上机 / 实验课
不引入新色,严格使用三档。

交互路径
触发	行为
◀ / ▶ 切换周次	周次切换器更新 + 课程列表刷新(带过渡)
「今日」	周次滑动到当前,星期聚焦当前日
点击课程格	跳课程详情(下一批)
「日视图」	切到日视图(下一批页面)
FAB 添加课程	弹课程表单(下一批)
颜色配比自检
颜色	占比
bg-page + bg-card	~ 85%
primary-500(色条 + 文字 + FAB + 当前线 + 周次数字)	~ 11%
mint-500(选修 1 条)	~ 2%
orange-500(实验 1 条)	~ 2%
主色 11%,薄荷 2%,橙 2%,全部远低于上限 ✓

第二批页面与组件对照表
页面	区块	组件	Token 引用
新生专题主页	NavBar	NavBar gradient	primary-700→500
欢迎卡	Card 自定义	bg-card, radius-xl
Badge 3	Badge	danger + radius-full
主入口 4 项	Card.Grid × 4	primary-50, primary-500
副入口	Cell	border-light
Tag 新功能	Tag mint	mint-50 + mint-700
Tag 找组织	Tag orange	orange-50 + orange-700
报到流程页	NavBar	NavBar default	bg-card
进度卡	Card + Progress	bg-card, Progress primary
步骤条	Cell + 自定义组合	primary-500 / neutral-300
「催办」「上传」	weak / text button	primary-50 / transparent
底部固定	Button large + shadow-tab	primary-500
来校路线页	NavBar	NavBar default	bg-card
校区 Segment	Segment 横向 + 滑动	active primary-500
校区介绍	Card	bg-card, radius-lg
路线列表	Cell 多行	bg-card, border-light
Tag 优选	Tag mint	mint-50 + mint-700
Tag 夜班机	Tag orange	orange-50 + orange-700
找室友表单页	NavBar 草稿	text button	text-link
Select 校区	Select	bg-card, border-default
Cascader 楼栋	Cascader(联动)	bg-card
Segmented 床位	Segment	primary-50 + primary-500
Textarea	Input textarea	bg-card
性格 Tag	Tag primary selectable	primary-50 + primary-500
期望 Tag	Tag mint selectable	mint-50 + mint-700
底部固定	secondary + primary + shadow-tab	bg-card, primary-500
FAQ 搜索列表	Search	Search round	neutral-100 bg
分类 Segment	Segment 横向滚动	active primary-500
搜索关键词	Tag mint/primary	mint-50 / primary-50
手风琴	Cell + 自定义展开	bg-card, border-light
Tag 官方	Tag mint	mint-50 + mint-700
智慧海大主页	Search	Search	neutral-100 bg
8 主入口整卡	Card + Grid	bg-card, radius-xl
8 单格	图标底 + caption	primary-50, primary-500
待办卡	Card.Tool	orange-50
Badge 3	Badge variant mint(见备注)	mint-500
业务 Cell	Cell	border-light
Tag 免登录	Tag mint	mint-50 + mint-700
Tag 24h	Tag orange	orange-50 + orange-700
社区主页	Search	Search	neutral-100 bg
Banner 轮播	Card + 圆点指示器	orange-50, primary-500 选中
版块 5	横滚(组合)	primary-50 / mint-50 / orange-50
分类 Segment	Segment	active primary-500
PostItem	Card + Cell 混合	头像 40, caption text-tertiary
Tag #新生	Tag primary	primary-50 + primary-500
Tag 自习	Tag mint	mint-50 + mint-700
智能助手小卡	Card.Tool	orange-50
浮动发布条	自定义 radius-full	bg-card, primary-500
课表主页(周视图)	周次切换	Card + weak button	bg-card, radius-lg
周次数字	H4 tnum	primary-500
「今日」	Button weak small	primary-50 + primary-500
星期 header	caption + tnum	当日 primary-500
课表外框	Card	bg-card, radius-lg, shadow-card
课程格	Cell 自定义 + radius-md	shadow-xs
必修色条	自定义 4px	primary-500
选修色条	自定义 4px	mint-500
实验色条	自定义 4px	orange-500
当前时间线	自定义横线 + 点	primary-500
FAB	自定义圆按钮	primary-500 bg, shadow-float
末尾:本批页面层级的交互细节说明(不改动组件库)
以下只在「页面组合」层面新增,不改任何既有组件的内部实现:

#	细节	所属页面	说明
1	步骤条	报到流程页	用 <Cell> + 自定义圆点 + 连接线组合,组件库不变
2	FAB	课表主页	自定义 56×56 浮动按钮,复用 Button 大小档 + shadow-float
3	手风琴	FAQ	用 <Cell> + 受控展开,组件库不变
4	轮播 Banner	社区主页	自定义组合,组件库不变
5	Badge 变色	智慧海大	待办 Badge 用 mint-500 而非 danger(详见下方「备注」)
「Badge 变色」说明:原组件库中 Badge 是 danger 红色;智慧海大的「我的待办 · 3」是任务提示,不应使用 danger 而应用 mint-500(表达「积极进行」)。这是页面层级调色,不改变 Badge 组件本身的默认色。后续如有同样需求的页面也按 mint 处理;只有「未读消息 / 错误提醒 / 数量预警」才用 danger 红。

周视图课表大网格:水平 7 列 + 垂直时间轴,在 375 宽度上每列 ≈ 50px,课程格最小高度 64。窄屏下可以加横向滚动或切换到日视图(下一批)。本批线框以标准宽度为基准。

如果这批 8 个页面没问题:

「继续」 → 我出第三批:智慧海大子页(业务办理/校历/图书馆/一卡通/空教室/成绩/地图) + 课表日视图 + 课程详情 + 个人中心 + 消息中心 + 发布器
「改 XXX」 → 指出页面或区块,就地改