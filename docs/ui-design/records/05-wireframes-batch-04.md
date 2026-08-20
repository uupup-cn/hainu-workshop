海大工坊 · 第四批真实页面线框
全局网格与配色约定(继承前三批)
项	取值
页面宽度	375(标准 iPhone 设计稿基准)
页面内 padding	space-4(16)左右
区块间距	space-6(24),卡片间 space-3(12)
NavBar 总高	88
数字	时刻表 / 站名编号 / 价格 / 时间等全部 tnum 等宽
颜色	主色 ≤25%,薄荷 ≤10%,橙 ≤5%
1. 校园出行主页 <Transport>
进入路径:智慧海大 / 工具箱「校园出行」入口 页面用途:校车时刻表 + 站点 + 乘车指南 三合一聚合页

布局说明
从上到下 3 个区块:

NavBar default + 顶部子功能 Tab(时刻表 / 车站信息 / 乘车指南)
主内容区(随 Tab 切换为时间线 / 卡片列表 / 富文本)
底部 TabBar(若该页是 TabBar 一级页) / 否则不显示
线框
┌──────────────────────────────────────┐
│  [←]      校园出行         [📍海甸]   │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 顶部子功能 Tab
│  │ [●时刻表] [车站信息] [乘车指南]   │ │  Segment 横向
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  (当前:时刻表)                          │
│                                      │
│  ┌─ 海甸 ↔ 城西 校车 (3 条线路)──┐    │  分组标题
│  │                                │    │  caption text-secondary
│  │  ●─────●─────●─────●            │    │
│  │  7:30  8:00  8:30  9:00         │    │  tnum primary-500
│  │  ↘ 经停: 教学楼→食堂→图书馆       │    │  caption text-tertiary
│  │                                │    │
│  │  ┌────────────────────────┐   │    │  时间线节点
│  │  │ 海甸总站              ✓   │   │    │  圆 8×8 primary
│  │  │ 7:30  发车              │   │    │  primary-500
│  │  ├────────────────────────┤   │    │
│  │  │ 教学楼                ↘   │   │    │
│  │  │ 7:35  经停              │   │    │  mint-500 经停
│  │  ├────────────────────────┤   │    │
│  │  │ 食堂                  ↘   │   │    │
│  │  │ 7:45  经停              │   │    │
│  │  ├────────────────────────┤   │    │
│  │  │ 图书馆                ↘   │   │    │
│  │  │ 8:00  终点              │   │    │  primary-500 终点
│  │  └────────────────────────┘   │    │
│  └────────────────────────────────┘    │  整卡 bg bg-card radius-lg 12
│                                      │ space-3
│  ┌─ 海甸 ↔ 观澜湖 校车 (2 条线路)──┐    │
│  │  9:30 → 10:15                    │    │  tnum primary-500
│  │  17:00 → 17:45 (返程)             │    │
│  └────────────────────────────────┘    │
│                                      │ space-3
│  ┌─ 周末加班车 ──────────────────┐    │
│  │  10:00 → 11:00                   │    │  orange Tag「加班车」
│  └────────────────────────────────┘    │
│                                      │
│  切到「车站信息」时:                     │
│                                      │
│  ┌────────────────────────────────┐ │ ← 车站卡片
│  │  🏛  海甸总站                  │ │  Card.Standard
│  │  caption: 海南大学北门             │ │
│  │  [●校车 1] [●校车 3] [加班]       │ │  Tag primary/mint/orange
│  ├────────────────────────────────┤
│  │  📚  教学楼                    │
│  │  caption: 海甸校区中部              │
│  │  [●校车 1] [●校车 5]              │
│  └────────────────────────────────┘ │
│                                      │
│  切到「乘车指南」时:                     │
│                                      │
│  ┌────────────────────────────────┐ │ ← 富文本
│  │  乘车指南                        │ │  H2 text-primary
│  │                                │ │
│  │  1. 校车购票                      │ │  H4
│  │     每票 ¥2,可刷一卡通或微信扫码     │ │  body text-primary
│  │     ¥ 2.00                       │ │  tnum
│  │                                │ │
│  │  [小图]                         │ │  Image
│  │                                │ │
│  │  2. 时间安排                      │
│  │     工作日 7:00-22:00             │
│  │     周末 8:00-20:00              │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 校区	text button	text-link primary-500
顶部子功能 Tab	Segment 横向	active primary-500
时刻表整卡	Card	bg bg-card, radius-lg 12, shadow-card
分组标题	caption	text-secondary
时间数字	H4 + tnum	primary-500
时间线节点 圆 8	自定义	primary-500(发车 / 终点)/ mint-500(经停)
连线	1.5px	primary-500(主)/ mint-500(经停段)
经停 Tag	Tag mint	mint-50 + mint-700
终点 Tag	Tag primary	primary-50 + primary-500
「加班车」Tag	Tag orange	orange-50 + orange-700
车站卡片	Cell	bg-card, border-light
车站 Tag	Tag 三色	primary-50/mint-50/orange-50
富文本段落	body	text-primary
小标题	H4	text-primary
内嵌图	Image	radius-md 8
价格数字	body + tnum	primary-500
交互路径
触发	行为
校区切换	时刻表 + 车站列表整片刷新
子功能 Tab 切换	内容区切换
点击车站卡片	车站详情 + 实时车次表
点击「加班车」标	跳加班车详细排期
颜色配比自检
颜色	占比
bg / 文字	~ 78%
primary(数字 + 节点 + 链接 + 终点)	~ 14%
mint(经停节点 + Tag)	~ 5%
orange(加班车 Tag)	~ 3%
主色 14% ✓ / 薄荷 5% ✓ / 橙 3% ✓

2. 智慧海大 · 校园数据库 <CampusDB>
进入路径:智慧海大主页「校园数据库」入口(数据库类入口) 页面用途:结构化数据浏览,分类入口 + 列表 + 详情页

布局说明
从上到下 4 个区块:

NavBar default + 搜索
分类入口 5 卡(校区 / 学院 / 专业 / 书院 / 楼栋)
当前分类列表(每项 = 一张可点的 Cell)
(点击进入)详情页(统一模板)
线框 — 数据库主页
┌──────────────────────────────────────┐
│  [←]      校园数据库            🔍    │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 搜索
│  │  🔍   搜索校区 / 学院 / 楼栋        │ │  Search round
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ┌─ 分类入口 ──────────────────┐    │  H4 text-primary
│  │                                │    │
│  │   🏛  校区     ●4               │    │  ← 5 张统一规格
│  │   primary-50  圆点 + 数字        │    │     卡片
│  │   caption: 海甸 / 儋州 / 城西 / 观澜湖 │    │
│  ├────────────────────────────────┤
│  │   🎓  学院     ●24             │    │  Badge mint 数字
│  │   primary-50                   │    │
│  │   caption: 24 个二级学院         │    │
│  ├────────────────────────────────┤
│  │   📚  专业     ●120             │    │
│  │   primary-50                   │    │
│  │   caption: 11 大学科门类         │    │
│  ├────────────────────────────────┤
│  │   🏠  书院     ●9               │    │
│  │   primary-50                   │    │
│  │   caption: 9 个学生书院          │    │
│  ├────────────────────────────────┤
│  │   🏢  楼栋     ●60               │    │
│  │   primary-50                   │    │
│  │   caption: 教学楼 / 宿舍 / 实验楼  │    │
│  └────────────────────────────────┘    │  整卡 bg bg-card radius-xl 16
│                                      │
│  (点击分类后)                          │
│                                      │
│  共找到 24 条                           │  caption text-secondary
│                                      │
│  ┌────────────────────────────────┐ │ ← 列表
│  │ 🏛  计算机科学与技术学院         │ │  Cell
│  │    caption: 1958 年成立 · 6 个本科专业 │
│  │                            [primary 院级]│ │  Tag primary 院级
│  ├────────────────────────────────┤
│  │ 🏛  信息科学与技术学院         │ │
│  │    caption: 信息科学 + 工程学      │
│  │                            [primary 院级]│
│  ├────────────────────────────────┤
│  │ 🏛  人文学院                   │ │
│  │    caption: 中文 + 历史 + 哲学     │
│  │                            [mint 通识]│ │  Tag mint
│  └────────────────────────────────┘ │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
线框 — 详情页(统一模板)
┌──────────────────────────────────────┐
│  [←]  计算机科学与技术学院    ⭐ 收藏 │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 封面 16:9
│  │      学院封面图                  │ │  radius-lg 12
│  └────────────────────────────────┘ │
│                                      │ space-3
│  计算机科学与技术学院                   │  H2 text-primary
│  caption: 1958 年成立 · 海甸校区主楼    │
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  01  学院简介                          │  H4
│  正文…                               │  body text-primary
│                                      │
│  02  本科专业                          │  H4
│  ┌────────────────────────────────┐ │
│  │ • 软件工程                       │ │  Tag primary 院级
│  │ • 人工智能                       │ │  Tag mint 校级通识
│  │ • 数据科学                       │ │
│  │ • 网络空间安全                   │ │
│  └────────────────────────────────┘ │
│                                      │
│  03  师资力量                          │  H4
│  正文…                               │
│                                      │
│  04  联系方式                          │  H4
│  📞 0898-6628xxxx                    │  text-link primary-500 tnum
│  📍 海甸校区主楼 305                  │  caption text-secondary
│                                      │
│  相关推荐                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ 🎓 信息科学与技术学院          ›│ │
│  │ 🏛 院系设置                  › │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 搜索	icon 24	text-secondary
搜索	Search round	neutral-100 bg
分类入口整卡	Card	bg bg-card, radius-xl 16, shadow-card
5 单格	圆 48 + caption	primary-50 底, primary-500 图标
Badge 数字	Badge mint	mint-500 + radius-full
列表分组标题	caption	text-secondary
列表 Cell	Cell	bg-card, border-light
「院级」Tag	Tag primary	primary-50 + primary-500
「校级通识」Tag	Tag mint	mint-50 + mint-700
「加载更多」	Button weak	primary-50 + primary-500
详情封面	Card(Image)	radius-lg 12
详情主标题	H2 22/30/600	text-primary
详情正文	body 14/22	text-primary
详情小标题	H4 16/24/600	text-primary
联系电话	text-link tnum	primary-500
相关推荐	Cell	border-light
交互路径
触发	行为
搜索	跨分类全库检索
点击分类入口	进入对应列表(同页切换)
点击列表项	跳详情页(统一模板)
详情页收藏	写入个人中心
详情页电话	调用拨号
详情页「相关推荐」	跳同类详情
颜色配比自检
颜色	占比
bg / 文字	~ 84%
primary(图标底 + 主图标 + 链接 + 院级 Tag + 加载更多)	~ 12%
mint(Badge 数字 + 校级 Tag)	~ 4%
orange	0%
主色 12% ✓ / 薄荷 4% ✓ / 橙 0% ✓

3. 二手集市首页 <Market>
进入路径:社区主页版块入口「二手集市」 页面用途:二手商品浏览 + 发布入口

布局说明
从上到下 4 个区块:

NavBar + 发布按钮
搜索 + 分类 Tab
商品卡片流(2 列网格)
上滑加载
线框
┌──────────────────────────────────────┐
│  [←]   二手集市        ✍️ [发布]     │  NavBar + 发布 text button
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 搜索
│  │  🔍   搜索商品关键词                │ │  Search round
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 分类 Tab
│  │[●全部][数码][书籍][生活][服饰][乐器]│ │  Segment 横向滑动
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  共 86 件 · 海甸 84 件 · 城西 2 件     │  caption text-secondary
│                                      │ space-3
│  ┌──────────┬──────────┐            │ ← 2 列商品网格
│  │ ┌────────┐│ ┌────────┐│            │
│  │ │ 4:3 图  ││ │ 4:3 图  ││            │  radius-md 8
│  │ └────────┘│ └────────┘│            │  shadow-xs
│  │ 索尼相机  │ 小米手机  │            │  H4 text-primary
│  │ ¥ 380.00 │ ¥ 1200.00│            │  primary-500 tnum
│  │ @张三 9/18│ @李四 9/18│           │  caption text-tertiary
│  │ [mint 九成新]            │            │  Tag mint
│  ├──────────┼──────────┤            │
│  │ ┌────────┐│ ┌────────┐│            │
│  │ │ 4:3 图  ││ │ 4:3 图  ││            │
│  │ └────────┘│ └────────┘│            │
│  │ 自行车   │ 考研资料  │            │
│  │ ¥ 150.00 │ ¥ 50.00  │            │
│  │ @王五 9/17│ @赵六 9/17│           │
│  │ [orange 急转]            │            │  Tag orange 急转
│  ├──────────┴──────────┤            │
│  │ ┌────────┐             │            │
│  │ │ 4:3 图  │             │            │
│  │ └────────┘             │            │
│  │ 显示器   │             │            │
│  │ ¥ 600.00 │             │            │
│  │ @孙七 9/16             │            │
│  └──────────┴─────────┘            │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
发布按钮	text button	text-link primary-500
搜索	Search round	neutral-100 bg
分类 Tab	Segment 横向	active primary-500
商品卡片	Card.Image	bg bg-card, radius-lg 12, shadow-card
商品图	4:3 图	radius-md 8
商品标题	H4 16/24/600	text-primary
价格	H4 + tnum	primary-500
发布者	caption	text-tertiary
「九成新」Tag	Tag mint	mint-50 + mint-700
「急转」Tag	Tag orange	orange-50 + orange-700
「加载更多」	Button weak	primary-50 + primary-500
交互路径
触发	行为
搜索	跳搜索结果页
分类 Tab 切换	列表过滤
点击商品	跳商品详情(本批 #4)
点击发布	跳发布商品表单
点击发布者	跳用户主页(下一批)
颜色配比自检
颜色	占比
bg / 图 / 文字	~ 80%
primary(发布 + Tab + 价格)	~ 15%
mint(九成新 Tag)	~ 3%
orange(急转 Tag)	~ 2%
主色 15% ✓ / 薄荷 3% ✓ / 橙 2% ✓

4. 二手集市 · 商品详情页 <MarketDetail>
进入路径:二手集市首页商品卡片 页面用途:商品图片 + 详情 + 卖家 + 买家交互

布局说明
从上到下 5 个区块:

NavBar default + 举报 / 收藏
图片轮播(大图)
商品标题 + 价格 + 描述 + 成色 Tag
卖家信息卡
底部固定操作条(收藏 / 联系 / 举报)
线框
┌──────────────────────────────────────┐
│  [←]    商品详情     ⚠️举报  ⭐ 收藏 │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 图片轮播
│  │                                │ │  16:9 大图
│  │                                │ │  bg bg-page 围边
│  │                                │ │
│  │                                │ │
│  │                          [1/6]│ │  指示器 radius-full
│  └────────────────────────────────┘ │  radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 商品信息卡
│  │  ¥ 380.00                      │ │  H2 + tnum primary-500
│  │  原价 ¥ 500  · 9 成新 [mint]    │ │  caption text-tertiary + Tag
│  ├────────────────────────────────┤
│  │  索尼 α6000 微单相机             │ │  H4 text-primary
│  │  caption: 95 成新 · 含 1 镜头      │ │
│  │                                │ │
│  │  描述                            │ │  H4
│  │  body: 个人闲置,功能正常,无划痕…   │ │  body text-primary
│  │                                │ │
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 卖家信息
│  │ [头像 40]  @张三             ⭐   │ │  Avatar + H4 + 收藏
│  │           caption: 计算机学院 · 海甸│ │  caption text-tertiary
│  │                                │ │
│  │  信用评分 4.8 / 5               │ │  caption + tnum
│  │  已发布 6 件 · 好评率 98%       │ │
│  │                                │ │
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 猜你喜欢
│  │  相关推荐                        │ │  H4 text-primary
│  │  ┌──────┬──────┬──────┐         │ │
│  │  │ 4:3  │ 4:3  │ 4:3  │         │ │  横向滚动 3 张
│  │  │ 相机  │ 镜头 │ 三脚架│         │ │
│  │  │ ¥ 320│ ¥ 80 │ ¥ 50 │         │ │  tnum primary-500
│  │  └──────┴──────┴──────┘         │ │
│  └────────────────────────────────┘ │
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌────────────────────────────────┐    │ ← 固定底部操作条
  │  [♡ 收藏]   [💬 联系卖家]  [举报]│    │  bg bg-card
  └────────────────────────────────┘    │  shadow-tab
                                          │  90h 安全区
组件 & Token 引用
区块	组件	Token
NavBar 举报 / 收藏	icon 24	text-tertiary / text-link
图片轮播	Card(Image)自定义	radius-lg 12, shadow-card
指示器	圆点 6×6	选中 primary-500, 未选 neutral-300
商品信息卡	Card	bg bg-card, radius-lg 12, shadow-card
价格	H2 22/30/600 + tnum	primary-500
商品标题	H4 16/24/600	text-primary
成色 Tag	Tag mint	mint-50 + mint-700
描述正文	body 14/22	text-primary
卖家卡	Card + Avatar	bg-card, radius-lg 12
Avatar	Avatar circle 40	primary-50 底
信用评分	caption + tnum	text-secondary
收藏按钮	icon 24	text-tertiary → 选中 primary-500
相关推荐	Card 横向滚动	bg-card, radius-lg 12
推荐价格	H4 + tnum	primary-500
底部操作条	固定栏 + Button × 3	bg bg-card, shadow-tab
「收藏」	Button weak	primary-50 + primary-500
「联系卖家」	Button primary	primary-500
「举报」	Button secondary	border-default
交互路径
触发	行为
图片轮播	左右滑切换 6 张
收藏	写入「我的收藏」,icon 变填充态
联系卖家	微信原生客服 / 复制微信号 + Toast
举报	弹 ActionSheet:虚假信息 / 重复发布 / 其他
点击卖家卡	跳卖家主页(下一批)
颜色配比自检
颜色	占比
bg / 图 / 文字	~ 78%
primary(价格 + 链接 + CTA + 收藏选中)	~ 17%
mint(成色 Tag)	~ 3%
orange	0%
主色 17% ✓ / 薄荷 3% ✓ / 橙 0% ✓

5. 快讯列表页 <NewsList>
进入路径:社区主页版块入口「快讯」 页面用途:校园快讯聚合,按时间线 + 类型 Tab 组织

布局说明
从上到下 4 个区块:

NavBar default
类型 Tab(全部 / 公告 / 活动 / 失物 / 招领 / 其他)
时间线分组(日期分组)
加载更多
线框
┌──────────────────────────────────────┐
│  [←]          校园快讯                │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 类型 Tab
│  │[●全部][公告][活动][失物][招领][其他]│ │  Segment 横向滑动
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  ┌─ 今天 (2025-09-18) ──────────┐    │  分组标题
│  │                                │    │  caption text-secondary
│  │  ●                              │    │  时间线节点 8×8
│  │  │                              │    │  primary-500
│  │  ├──────────────────────────┐  │    │
│  │  │ 📣 9月1日新生开学典礼通知    │  │    │  Card.Standard
│  │  │ [primary 公告]              │  │    │  Tag primary
│  │  │ caption: 关于新生开学典礼的安排… │  │    │
│  │  │ caption 14:32  校办          │  │    │  caption text-tertiary
│  │  └──────────────────────────┘  │    │
│  │  │                              │    │
│  │  ●                              │    │
│  │  │                              │    │
│  │  ├──────────────────────────┐  │    │
│  │  │ 🎉 新生辩论赛报名启动         │  │    │  Tag orange 活动
│  │  │ [orange 活动]                │  │    │
│  │  │ caption: 周二晚 7 点 · 报名截止 9/20│  │
│  │  │ caption 11:05  校辩论队       │  │    │
│  │  └──────────────────────────┘  │    │
│  │                                │    │
│  └────────────────────────────────┘    │
│                                      │ space-3
│  ┌─ 昨天 (2025-09-17) ─────────┐      │
│  │  ●                              │      │
│  │  │                              │      │
│  │  ├──────────────────────────┐  │      │
│  │  │ 🔑 失物招领:黑色钱包         │  │      │  Tag mint 招领
│  │  │ [mint 招领]                  │  │      │
│  │  │ caption: 一教 305 拾到,请联系…  │  │      │
│  │  │ caption 18:20  学工处         │  │      │
│  │  └──────────────────────────┘  │      │
│  │  │                              │      │
│  │  ●                              │      │
│  │  │                              │      │
│  │  ├──────────────────────────┐  │      │
│  │  │ 📌 关于国庆放假安排的通知       │  │      │  Tag primary 公告
│  │  │ [primary 公告]                │  │      │
│  │  │ caption: 10/1-10/7,9/28 上班…   │  │      │
│  │  │ caption 09:00  校办            │  │      │
│  │  └──────────────────────────┘  │      │
│  └────────────────────────────────┘      │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
类型 Tab	Segment 横向	active primary-500
日期分组	caption	text-secondary
时间线节点	圆 8×8	primary-500
时间线连线	1.5px	primary-500
时间线卡片	Card.Standard	bg bg-card, radius-lg 12, shadow-card
「公告」Tag	Tag primary	primary-50 + primary-500
「活动」Tag	Tag orange	orange-50 + orange-700
「招领 / 失物」Tag	Tag mint	mint-50 + mint-700
时间	caption tnum	text-tertiary
发布单位	caption	text-secondary
加载更多	Button weak	primary-50 + primary-500
交互路径
触发	行为
类型 Tab 切换	列表筛选
点击快讯卡	跳详情页(本批 #6)
长按卡片	弹 ActionSheet:分享 / 收藏 / 举报
颜色配比自检
颜色	占比
bg / 文字	~ 80%
primary(Tab + 节点 + 连线 + 公告 Tag + 加载更多)	~ 13%
mint(招领 Tag)	~ 5%
orange(活动 Tag)	~ 2%
主色 13% ✓ / 薄荷 5% ✓ / 橙 2% ✓

6. 快讯详情页 <NewsDetail>
进入路径:快讯列表页 / 推送通知 / 跨页分享入口 页面用途:快讯富文本正文 + 时间 + 分享操作

布局说明
从上到下 4 个区块:

NavBar default + 分享 / 收藏
标题 + 类型 Tag + 发布信息
富文本正文
底部固定操作条(分享 / 收藏 / 评论入口)
线框
┌──────────────────────────────────────┐
│  [←]   快讯详情   ↗分享  ⭐ 收藏      │  NavBar default + 操作
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 标题区
│  │  关于国庆放假安排的通知             │ │  H2 22/30/600 text-primary
│  │  [primary 公告]                  │ │  Tag primary
│  │  caption: 校办 · 2025-09-17 09:00 │ │  caption text-tertiary tnum
│  │  阅读 1284                        │ │  caption text-tertiary tnum
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  各学院、各部门:                       │  body 14/22 text-primary
│                                      │
│  根据《国务院办公厅关于 2025 年部分节假日│
│  安排的通知》,现将国庆放假安排通知如下:  │
│                                      │
│  一、放假时间                          │  H4 text-primary
│  10 月 1 日至 10 月 7 日放假调休,共 7 天。│  body text-primary tnum
│ 9 月 28 日(周日)、10 月 11 日(周六)上班。│
│                                      │
│  二、注意事项                          │  H4
│  body...                             │
│                                      │
│  ┌────────────────────────────────┐ │ ← 内嵌图
│  │  16:9 图                         │ │  radius-md 8, shadow-xs
│  └────────────────────────────────┘ │
│  caption: 节假日时间表                  │  caption text-tertiary
│                                      │
│  三、值班安排                          │  H4
│  body...                             │
│                                      │
│  ━━━━━━━━━━━━━━━━━━━                  │
│                                      │
│  ┌────────────────────────────────┐ │ ← 来源信息
│  │  来源  校长办公室                │ │  caption text-secondary
│  │  发布  2025-09-17 09:00         │ │  caption text-tertiary tnum
│  │  阅读  1284                      │ │  caption text-tertiary tnum
│  └────────────────────────────────┘ │
│                                      │
│  相关快讯                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ 📣 关于教师节活动安排的通知     › │ │  Cell
│  ├────────────────────────────────┤
│  │ 📌 2025-2026 学年校历发布       › │ │
│  └────────────────────────────────┘ │
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌────────────────────────────────┐    │ ← 固定底部
  │  [♡ 收藏]   [💬 评论]   [↗ 分享]│    │  bg bg-card
  └────────────────────────────────┘    │  shadow-tab
                                          │  90h 安全区
组件 & Token 引用
区块	组件	Token
NavBar 分享 / 收藏	icon 24	text-tertiary → text-link
标题区	Card	bg bg-card, radius-lg 12, shadow-card
主标题	H2 22/30/600	text-primary
类型 Tag	Tag primary	primary-50 + primary-500
发布单位	caption	text-tertiary
时间 / 阅读	caption tnum	text-tertiary
正文段落	body 14/22	text-primary
小标题	H4 16/24/600	text-primary
内嵌图	Image	radius-md 8, shadow-xs
图说明	caption	text-tertiary
来源信息	Cell	border-light
相关快讯	Cell	border-light
底部操作条	固定栏 + Button × 3	bg bg-card, shadow-tab
「收藏」	Button weak	primary-50 + primary-500
「评论」	Button weak	primary-50 + primary-500
「分享」	Button primary	primary-500
交互路径
触发	行为
分享	ActionSheet:微信好友 / 朋友圈 / 复制链接
收藏	写入「我的收藏」,Toast success
评论	弹评论输入框(下一批「发布器」)
点击相关快讯	跳对应详情页
颜色配比自检
颜色	占比
bg / 文字	~ 84%
primary(Tag + 链接 + 收藏 + 分享 CTA)	~ 13%
mint	0%
orange	0%
主色 13% ✓ / 薄荷 0% ✓ / 橙 0% ✓

详情页特意收敛到主色单色,传达「正式、可信、克制」的公告感。

第四批真实页面与组件对照表
页面	区块	组件	Token 引用
校园出行	NavBar 校区	text button	text-link
顶部子功能 Tab	Segment	active primary-500
时刻表卡	Card	bg-card, radius-lg 12
时间数字	H4 tnum	primary-500
时间线节点(发车/终点)	自定义 8×8	primary-500
时间线节点(经停)	自定义 8×8	mint-500
经停 Tag	Tag mint	mint-50 + mint-700
终点 Tag	Tag primary	primary-50 + primary-500
加班车 Tag	Tag orange	orange-50 + orange-700
车站卡片	Cell	border-light
富文本段落	body	text-primary
内嵌图	Image	radius-md 8
价格	body tnum	primary-500
校园数据库	NavBar 搜索	icon 24	text-secondary
搜索	Search round	neutral-100
分类入口整卡	Card	bg-card, radius-xl 16
5 单格	圆 48 + caption	primary-50, primary-500
Badge 数字	Badge mint	mint-500
列表 Cell	Cell	border-light
院级 Tag	Tag primary	primary-50 + primary-500
校级 Tag	Tag mint	mint-50 + mint-700
加载更多	Button weak	primary-50 + primary-500
详情封面	Card(Image)	radius-lg 12
详情标题	H2	text-primary
详情正文	body	text-primary
详情电话	text-link tnum	primary-500
相关推荐	Cell	border-light
二手集市首页	NavBar 发布	text button	text-link
搜索	Search round	neutral-100
分类 Tab	Segment	active primary-500
商品卡片	Card.Image	bg-card, radius-lg 12
商品图	Image 4:3	radius-md 8
商品标题	H4	text-primary
价格	H4 tnum	primary-500
九成新 Tag	Tag mint	mint-50 + mint-700
急转 Tag	Tag orange	orange-50 + orange-700
加载更多	Button weak	primary-50 + primary-500
商品详情	NavBar 举报 / 收藏	icon 24	text-tertiary / text-link
图片轮播	Card(Image)自定义	radius-lg 12
指示器	圆 6×6	primary-500 / neutral-300
商品信息卡	Card	bg-card, radius-lg 12
价格	H2 tnum	primary-500
成色 Tag	Tag mint	mint-50 + mint-700
描述正文	body	text-primary
卖家卡	Card + Avatar	bg-card, radius-lg 12
Avatar	Avatar circle 40	primary-50 底
信用评分	caption tnum	text-secondary
收藏按钮	icon	text-tertiary → primary-500
相关推荐	Card 横向	bg-card, radius-lg 12
底部操作条	固定栏 + Button × 3	bg-card, shadow-tab
联系卖家	Button primary	primary-500
举报	Button secondary	border-default
快讯列表	NavBar	NavBar default	bg-card
类型 Tab	Segment	active primary-500
日期分组	caption	text-secondary
时间线节点	自定义 8×8	primary-500
时间线连线	1.5px	primary-500
快讯卡	Card.Standard	bg-card, radius-lg 12
公告 Tag	Tag primary	primary-50 + primary-500
活动 Tag	Tag orange	orange-50 + orange-700
招领 Tag	Tag mint	mint-50 + mint-700
时间	caption tnum	text-tertiary
加载更多	Button weak	primary-50 + primary-500
快讯详情	NavBar 分享 / 收藏	icon 24	text-tertiary / text-link
标题区	Card	bg-card, radius-lg 12
主标题	H2	text-primary
公告 Tag	Tag primary	primary-50 + primary-500
时间 / 阅读	caption tnum	text-tertiary
正文段落	body	text-primary
小标题	H4	text-primary
内嵌图	Image	radius-md 8, shadow-xs
来源信息	Cell	border-light
相关快讯	Cell	border-light
底部操作条	固定栏 + Button × 3	bg-card, shadow-tab
收藏 / 评论	Button weak	primary-50 + primary-500
分享	Button primary	primary-500
末尾:本批页面层级的交互细节说明(不改动组件库)
#	细节	所属页面	说明
1	时间线节点 + 连线	校园出行 / 快讯列表	用 Card.Standard 内嵌竖向连线 + 圆点组合,组件库不变
2	节点双色编码	校园出行	发车 / 终点 primary-500,经停 mint-500,语义区分
3	校园数据库详情统一模板	校园数据库	5 类(校区 / 学院 / 专业 / 书院 / 楼栋)共用一个详情模板,标题数据替换
4	商品卡片 2 列网格	二手集市	Card.Image 横向 2 列布局,组件库不变
5	图片轮播指示器	商品详情	自定义圆点 + 「n / N」编号,组件库不变
6	底部固定操作条	商品详情 / 快讯详情	在页面底部固定 Cell + Button 组合 + shadow-tab,组件库不变
7	类型 Tag 五色映射	快讯列表	公告 primary / 活动 orange / 招领 mint / 失物 mint / 其他 primary,只复用已有三色
8	时间线分组(日期)	快讯列表	用 caption + Card.Standard 组合,组件库不变
9	详情页富文本(段落 + 小标题 + 内嵌图)	校园数据库 / 快讯详情	用 body + H4 + Image 组合,组件库不变
10	「举报」ActionSheet	商品详情 / 快讯	复用 ActionSheet 组件,选项:虚假信息 / 重复发布 / 其他
所有 6 个页面严格沿用 Design Tokens + 既有组件库,未引入新 Token 值、未新增组件。所有数字保持 tnum 等宽,颜色配比全部在约束内。