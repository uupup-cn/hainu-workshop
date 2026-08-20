海大工坊 · 第三批真实页面线框
全局网格与配色约定(继承前两批)
项	取值
页面宽度	375(标准 iPhone 设计稿基准)
页面内 padding	space-4(16)左右
区块间距	space-6(24)
NavBar 总高	88(状态栏 44 + 标题栏 44)
数字	时间/电话/学分/电话/成绩等全部 tnum 等宽
颜色	主色 ≤25%,薄荷 ≤10%,橙 ≤5%
1. 海大介绍 · 列表页 <AboutHub>
进入路径:智慧海大主页「海大介绍」图标入口 页面用途:5 大子模块的统一聚合入口

布局说明
从上到下 3 个区块:

NavBar default
顶部品牌横幅(简短介绍)
5 张统一规格的图标卡片列表
线框
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
顶部品牌横幅	Card	bg-card, radius-xl 16, shadow-card
卡片列表	Cell × 5	bg bg-card, border-light 分隔
图标	24×24	text-secondary
主标题	H4 16/24/600	text-primary
描述	caption 14/22	text-tertiary
箭头	16×16	text-tertiary
交互路径
触发	跳转
学校概况 / 校区介绍 / 院系设置	富文本详情页(变体 A)
校园风光	图片瀑布流(变体 B)
校歌校徽	详情页 + 播放音频
颜色配比自检
颜色	占比
bg / 文字	~ 88%
primary(状态栏装饰)	~ 10%
mint	0%
orange	0%
主色 10% ✓ / 薄荷 0% ✓ / 橙 0% ✓

2. 海大介绍 · 详情页 <AboutDetail>
进入路径:海大介绍列表 5 项 / 个人中心常用 页面用途:内容详情,分两种变体(富文本 / 图片瀑布流)

布局说明 — 变体 A · 富文本(学校概况、校区介绍、院系设置)
从上到下 4 个区块:

NavBar default + 收藏
封面图 + 标题 + 副标题
富文本正文(支持小标题 + 段落 + 内嵌图)
底部目录锚点 + 相关推荐
线框 — 变体 A
┌──────────────────────────────────────┐
│  [←]         学校概况       ⭐ 收藏   │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 封面图 16:9
│  │       16:9 校园封面             │ │ │  radius-lg 12
│  └────────────────────────────────┘ │
│                                      │ space-3
│  学校概况                              │  H2 22/30/600 text-primary
│  caption: 海南大学 · 创建于 1958        │
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light 分隔
│                                      │
│  01  历史沿革                          │  H4 16/24/600 text-primary
│  1958 年 …                            │  body 14/22 text-primary
│  1981 年 …                            │
│  2008 年 …                            │
│                                      │
│  [内嵌单图 16:9 radius-md]            │  shadow-xs
│                                      │
│  02  学科建设                          │
│  …                                   │
│                                      │ space-6
│  目录                                  │  caption text-secondary
│  ┌────────────────────────────────┐ │
│  │ 01 历史沿革                      │
│  │ 02 学科建设                      │
│  │ 03 校园文化                      │
│  │ 04 校园风光                      │  text-link primary-500
│  └────────────────────────────────┘ │
│                                      │
│  相关推荐                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ 📷 校园风光 ›                   │
│  │ 📘 院系设置 ›                   │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
布局说明 — 变体 B · 校园风光(图片瀑布流)
从上到下 3 个区块:

NavBar + 收藏
横向分类 Segment(全部 / 春 / 夏 / 秋 / 冬)
图片瀑布流 2 列(高度错位)
线框 — 变体 B
┌──────────────────────────────────────┐
│  [←]        校园风光        ⭐ 收藏   │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 季节切换 Segment
│  │ [●全部] [春] [夏] [秋] [冬]      │ │  active primary-500
│  └────────────────────────────────┘ │
│                                      │
│  共 96 张                                │  caption text-secondary
│                                      │
│  ┌───────────┬───────────┐           │ ← 2 列瀑布流
│  │ 高图 3:4    │ 扁图 16:9   │           │  Card radius-lg 12
│  │ caption 春   │ caption 夏   │           │  shadow-card
│  ├─────┐     ├─────┬─────┤           │
│  │ 高   │     │ 16:9 │ 4:3 │           │
│  │ 图 4:5│    │ 4 张  │ 4 张 │           │
│  │ caption│    └─────┴─────┘           │
│  ├─────┴─────┐                        │
│  │ 扁图        │                       │
│  │ 16:9       │                       │
│  └────────────┘                       │
│                                      │
│  ↑ 上滑加载更多                          │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用(变体 A & B 共用 + 各自差异)
区块	组件	Token
NavBar 收藏	text button / icon	text-link primary-500
封面图 16:9	Card(Image)	radius-lg 12, shadow-card
主标题	H2 22/30/600	text-primary
副标题	caption 12/18	text-tertiary
内嵌图	Image 内嵌	radius-md 8, shadow-xs
正文	body 14/22	text-primary
小标题	H4 16/24/600	text-primary
目录链接	text-link	primary-500
推荐 Cell	Cell	bg-card, border-light
季节 Segment(变体 B)	Segment 横向	active primary-500
瀑布流图卡(变体 B)	Card.Image	bg bg-card, radius-lg 12
图 caption(变体 B)	caption 12/18	text-tertiary
交互路径
触发	行为
收藏	写入收藏列表,Toast success
目录锚点	平滑滚动到对应章节
变体 B 季节切换	列表过滤
变体 B 图片点击	全屏预览 + 双指缩放 + 滑动切图
备注
「校区介绍」详情页是富文本变体 A 的子模板:正文前添加 4 校区 Tabs(横向),其余结构同变体 A。本批不重复画线框,组件完全复用变体 A。
颜色配比自检
颜色(变体 A)	占比
bg / 文字 / 图片	~ 88%
primary(图标 + 链接 + 锚点)	~ 11%
mint	0%
orange	0%
主色 11% ✓ / 薄荷 0% ✓ / 橙 0% ✓

颜色(变体 B)	占比
bg / 图	~ 92%
primary(激活 Tab + 边框点缀)	~ 7%
mint / orange	0%
主色 7% ✓ / 薄荷 0% ✓ / 橙 0% ✓

3. 电话簿 <PhoneBook>
进入路径:智慧海大主页「电话簿」图标入口 页面用途:校园常用联系电话(分校区),支持快速拨号

布局说明
从上到下 4 个区块:

NavBar default
搜索框
校区横向 Segment(4 个)
电话卡片列表(部门名 + 电话 + 拨号按钮)
线框
┌──────────────────────────────────────┐
│  [←]              电话簿              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 搜索
│  │  🔍   搜索部门或电话              │ │  Search round
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 校区 Segment 横向
│  │ [●海甸] [儋州] [城西] [观澜湖]      │ │  active primary-500
│  └────────────────────────────────┘ │
│                                      │ space-3
│  海甸校区 · 常用部门                     │  caption text-secondary
│                                      │
│  ┌────────────────────────────────┐ │ ← 电话卡片 Cell
│  │ 📞  校长办公室           [📞 拨号]│ │  Card.Standard 行内带按钮
│  │    0898-6628 0000              │ │  电话 tnum
│  ├────────────────────────────────┤
│  │ 📞  教务处              [📞 拨号]│
│  │    0898-6628 1111              │
│  ├────────────────────────────────┤
│  │ 📞  学生工作处           [📞 拨号]│
│  │    0898-6628 2222              │
│  ├────────────────────────────────┤
│  │ 📞  校信息中心           [📞 拨号]│
│  │    0898-6628 3333              │
│  ├────────────────────────────────┤
│  │ 📞  校医院        [orange 24h]│ │ ← Tag
│  │    0898-6628 4444              │
│  ├────────────────────────────────┤
│  │ 📞  保卫处              [📞 拨号]│
│  │    0898-6628 5555              │
│  ├────────────────────────────────┤
│  │ 📞  招办                 [📞 拨号]│
│  │    0898-6628 6666              │
│  ├────────────────────────────────┤
│  │ 📞  网络信息中心           [📞 拨号]│
│  │    0898-6628 7777              │
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │
│  [显示更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
搜索	Search round	neutral-100 bg
校区 Segment	Segment 横向(可滑动)	active primary-500
分组标题	caption	text-secondary
电话 Cell	Cell 自定义(右侧主按钮)	bg bg-card, border-light
「24h」Tag	Tag orange	orange-50 + orange-700
拨号按钮	text button 或 24×24 icon	text-link primary-500
电话号码	caption 14/22 + tnum	text-secondary
「显示更多」	Button weak	primary-50 + primary-500
交互路径
触发	行为
校区切换	列表刷新
搜索	实时过滤
点击拨号	触发 wx.makePhoneCall(小程序原生)+ Toast
收藏	个人中心「我的收藏」(下一批)
颜色配比自检
颜色	占比
bg / 文字	~ 84%
primary(拨号按钮 + 选中 Tab + weak 按钮)	~ 14%
mint	0%
orange(24h Tag)	~ 2%
主色 14% ✓ / 薄荷 0% ✓ / 橙 2% ✓

4. 校历 <Calendar>
进入路径:智慧海大主页「校历」图标入口 页面用途:双模式查看学年关键节点

图片模式:整图展示 + 双指缩放 + 拖动
日历模式:月历 + 圆点 + 文字标签,点击查看详情
布局说明
从上到下 4 个区块:

NavBar + 模式切换(图/历)
模式子导航 Segment
主体(图/历)
图例 + 详情 Popover
线框 — 图片模式
┌──────────────────────────────────────┐
│  [←]  校历   [📷图片│📅日历]         │  NavBar + 模式切换
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 子导航
│  │ [●图片模式] [日历模式]             │ │  Segment
│  └────────────────────────────────┘ │
│                                      │
│  2025-2026 学年                         │  caption text-secondary
│                                      │
│  ┌────────────────────────────────┐ │ ← 大图区
│  │                                │ │  bg bg-page 围边
│  │       16:9 校历整图               │ │  内含手势操作提示
│  │                                │ │
│  │                                │ │  ↑ 双指可缩放
│  │                                │ │  ↑ 单指可拖动
│  │  ↑ 提示浮层:「双指缩放,单指拖动」│ │  caption label text-placeholder
│  └────────────────────────────────┘ │  radius-lg 12, shadow-card
│  ↑ 角标:可左右滑动查看上 / 下学年       │
│                                      │
│  缩放控制                              │  caption text-secondary
│  [−] 100% [+]  [↻ 还原]                 │  weak button 3 段
│                                      │
└──────────────────────────────────────┘
线框 — 日历模式
┌──────────────────────────────────────┐
│  [←]  校历   [📷图片│📅日历]         │
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │ [图片模式] [●日历模式]             │ │
│  └────────────────────────────────┘ │
│                                      │
│  [◀]  2025 年 9 月  [▶]    [今天]      │  月份切换
│                                      │
│  ┌────────────────────────────────┐ │
│  │  日  一  二  三  四  五  六        │  星期表头
│  │                                  │
│  │   1   2   ●3  ●4  ●5   6   7   │ ← ● 圆点 + 数字
│  │              开学       校庆     │   文字 label 11
│  │                                  │
│  │   8   9   10  [11] 12  [13] 14  │ ← 假期 orange-50 背景
│  │              新生       校庆     │     [今天] primary 边框
│  │                                  │
│  │  15  16  17  ...                  │
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │
│  图例                                   │  caption text-secondary
│  ● 学期上课(primary-500)               │
│  ● 假期(orange)                         │
│  ● 考试(mint)                           │
│  ● 校庆(primary-100)                    │
│                                      │
│  近期重要日期                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← Cell
│  │ • 9月3日 周三  秋季学期开学  [mint]│ │
│  │ • 9月4日 周四  校庆开放日   [primary]│ │
│  │ • 9月11-12日   新生报到       [primary]│ │
│  │ • 10月1-7日   国庆假期     [orange] │ │
│  │ • 1月5-16日   期末考试周     [mint]│ │
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
线框 — 日期弹气泡(点击 9 月 11 日后)
┌──────────────────────────────────────┐
│   ... 日历主体 ...                    │
│                                      │
│         ┌──────────────────────┐    │ ← Popover
│         │ 9月11日 周四           │    │  bg bg-card
│         │                       │    │  radius-lg 12
│         │ 新生报到               │    │  shadow-float
│         │ 8:00-17:00 海甸校区    │    │
│         │                       │    │
│         │ [查看详情 ›]            │    │  primary-500 text-link
│         └────────▼──────────────┘    │
│                                      │
│   ... 全屏暗化遮罩 bg-mask ...         │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 模式切换	Segment	active primary-500
子导航	Segment	active primary-500
大图	Card(Image)	bg bg-card, radius-lg 12, shadow-card
提示浮层	caption label	text-placeholder
缩放控制	Button weak × 3	primary-50 + primary-500
日历网格	自定义 7 × 6	bg bg-card, border-light
「今天」边框	2px primary	primary-500
上课日圆点	圆 6,primary	primary-500
假期日	bg orange-50 + orange 圆点	orange-50, orange-500
考试日	bg mint-50 + mint 圆点	mint-50, mint-500
校庆日	bg primary-100 + primary-700 圆点	primary-100, primary-700
日期文字	caption tnum	text-primary / white(高亮日)
「开学」「新生」等标签	label 11 inline	跟随所属类型色
图例	row caption	text-secondary
重要日期 Cell	Cell	bg bg-card, border-light
Tag「mint」考试	Tag mint	mint-50 + mint-700
Tag「orange」假期	Tag orange	orange-50 + orange-700
Tag「primary」开学	Tag primary	primary-50 + primary-500
日期气泡	Popover	bg bg-card, radius-lg 12, shadow-float
日期气泡三角	Popover arrow	white + 框线 border-strong
「查看详情」	text button	text-link primary-500
交互路径
触发	行为
模式切换	主体整页替换
图片双指缩放	100% / 200% / 400% 三段
图片拖动	跟随手势
月份 ◀ / ▶	日历刷新
缩放控制 [−] [+] [↻]	跟随点击缩放和还原
点击日期	Popover 弹出当日事件
点击 Popover「查看详情」	跳详情页(下一批)
颜色配比自检
颜色(图模式)	占比
bg / 图 / 文字	~ 95%
primary(导航 + 缩放 + caption)	~ 5%
mint / orange	0%
颜色(历模式)	占比
bg / 文字	~ 80%
primary(今天 + 上课 + 开学)	~ 8%
mint(考试 + 校庆)	~ 7%
orange(假期)	~ 5%
两模式主色 ≤25% ✓ / 薄荷 ≤10% ✓ / 橙 ≤5% ✓

5. 校园地图 <CampusMap>
进入路径:智慧海大主页「校园地图」图标入口 页面用途:4 校区的统一地图浏览,标注建筑,可寻路 / 看简介

布局说明
从上到下 3 个区块:

NavBar + 搜索
地图大画布(双指缩放 + 拖动 + 标注点)
底部固定 4 校区 Segment Tab
线框
┌──────────────────────────────────────┐
│  [←]   校园地图       🔍 搜索       │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 地图区域
│  │                                │ │  bg bg-page
│  │       (地图画布 · 全屏)            │ │
│  │                                │ │
│  │        ●图书馆                   │ ← 标注圆点 8×8
│  │       /    \                     │ │
│  │   ●教学楼1   ●主楼               │
│  │      |                          │
│  │      ●学生食堂                   │
│  │                                │ │
│  │      ↓ 点击圆点后弹出气泡          │
│  │      ┌─────────────────────┐    │
│  │      │ 图书馆              │    │ ← Popover
│  │      │ ⏰ 7:00 - 22:00       │    │  radius-lg 12
│  │      │ 📖 藏书 200 万册       │    │  shadow-float
│  │      │ [查看详情 ›]  [导航 →]  │    │
│  │      └─────────▼─────────────┘    │
│  │                                │ │
│  │                                │ │
│  │   ⚙️  显隐标注图层(右上浮动)         │ │  icon 24 text-secondary
│  └────────────────────────────────┘ │  radius-lg 12
│                                      │  ↑ 双指缩放 + 单指拖动
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 底部校区 Tab
│  │ [●海甸] [儋州] [城西] [观澜湖]      │ │  固定底栏
│  └────────────────────────────────┘ │  bg bg-card, shadow-tab
│                                      │  active primary-500
│                                      │
└──────────────────────────────────────┘

   (点击标注点的弹气泡特写)

   ┌──────────────────────┐
   │  图书馆               │ ← H4 text-primary
   │  ────                │ ← border-light
   │                      │
   │  简介 200 字内        │ ← caption text-secondary
   │  · 海南大学图书馆…     │
   │                      │
   │  开放  7:00 - 22:00  │ ← tnum
   │  楼层  6 层           │
   │  服务  借阅 / 自习 / 研讨 │
   │                      │
   │  [查看详情 ›]  [导航 →]│ ← text button + text button
   └──────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 搜索	icon 24	text-secondary
地图画布	Card(Image)	bg bg-page, radius-lg 12, shadow-card
标注圆点	自定义 8×8	primary-500 + white 边框 2px
气泡	Popover	bg bg-card, radius-lg 12, shadow-float
气泡三角	Popover arrow	white + border-strong
气泡分隔	border-light	neutral-100
简介文字	caption 12/18	text-secondary
时间 / 楼层数字	caption tnum	text-primary
「查看详情」	text button	text-link primary-500
「导航」	text button	text-link primary-500
图层开关	icon 24 + Switch	primary-500 选中
底部 Tab	Segment + shadow-tab 边框	active primary-500
底部固定栏	固定底	bg bg-card, shadow-tab
交互路径
触发	行为
校区切换	整图刷新
双指缩放	100% / 150% / 200% 多段
单指拖动	地图跟随
点击标注圆点	Popover 显示简介
「导航」	调用 wx.openLocation 打开地图
图层开关	切换自习 / 食堂 / 体育 / 宿舍 / 教学楼
「查看详情」	跳建筑详情页(下一批)
颜色配比自检
颜色	占比
bg / 地图底色 / 文字	~ 88%
primary(标注点 + 链接 + 选中校区)	~ 9%
mint	0%
orange	0%
主色 9% ✓ / 薄荷 0% ✓ / 橙 0% ✓

第三批真实页面与组件对照表
页面	区块	组件	Token 引用
海大介绍列表	NavBar	NavBar default	bg-card
顶部品牌横幅	Card	bg-card, radius-xl 16, shadow-card
5 卡片列表	Cell	border-light
详情页 A 富文本	NavBar 收藏	icon 24	text-link
封面图	Card(Image)	radius-lg 12
正文段落	body	text-primary
小标题	H4	text-primary
内嵌图	Image	radius-md 8, shadow-xs
目录锚点	text-link	primary-500
相关推荐	Cell	border-light
详情页 B 校园风光	季节 Segment	Segment	active primary-500
瀑布流图卡	Card(Image)	bg-card, radius-lg 12
图 caption	caption	text-tertiary
电话簿	NavBar	NavBar default	bg-card
搜索	Search round	neutral-100
校区 Segment	Segment 横向	active primary-500
电话 Cell	Cell 自定义	border-light
「24h」Tag	Tag orange	orange-50 + orange-700
拨号按钮	text button	text-link primary-500
电话号	caption tnum	text-secondary
「显示更多」	Button weak	primary-50 + primary-500
校历(图模式)	模式切换	Segment	active primary-500
大图画布	Card(Image)	bg-card, radius-lg 12
提示浮层	caption	text-placeholder
缩放控制	Button weak × 3	primary-50 + primary-500
校历(历模式)	月份切换	自定义 + Button weak	—
「今天」	NavBar text button	text-link primary-500
日历网格	自定义 7×6	bg-card, border-light
「今天」边框	2px	primary-500
上课日圆点	6×6 圆	primary-500
假期日	自定义日格	orange-50 + orange 圆点
考试日	自定义日格	mint-50 + mint 圆点
校庆日	自定义日格	primary-100 + primary-700 圆点
重要日期 Cell	Cell	border-light
Tag 考试 / mint	Tag mint	mint-50 + mint-700
Tag 假期 / orange	Tag orange	orange-50 + orange-700
Tag 开学 / primary	Tag primary	primary-50 + primary-500
日期气泡	Popover	bg-card, radius-lg 12, shadow-float
校园地图	NavBar	NavBar default	bg-card
搜索	icon 24	text-secondary
地图画布	Card(Image)	bg bg-page, radius-lg 12, shadow-card
标注圆点	自定义 8×8	primary-500 + white 边框
建筑气泡	Popover	bg-card, radius-lg 12, shadow-float
气泡三角	Popover arrow	white + border-strong
「查看详情」	text button	text-link primary-500
「导航」	text button	text-link primary-500
图层开关	Switch + icon	primary-500
底部 Tab	Segment + shadow-tab	bg-card, active primary-500
末尾:本批页面层级的交互细节说明(不改动组件库)
#	细节	所属页面	说明
1	双指缩放 + 单指拖动	校历图模式 / 校园地图	在画布区域自定义手势识别,组件库不变
2	缩放控制条 [−][100%][+][↻]	校历图模式	复用 weak button 三段组合,组件库不变
3	4 色日历标注	校历	复用已有色板:primary、orange、mint、primary-100,共 4 种事件类型,无新色
4	日期 Popover	校历	用 Popover 锚定具体日期格,组件库不变
5	地图标注气泡	校园地图	用 Popover 锚定标注圆点,组件库不变
6	底部固定 Tab	校园地图	用 Segment 嵌入底部固定栏 + shadow-tab,组件库不变
7	图层开关	校园地图	用 Switch + icon 组合,组件库不变
8	「校区介绍」详情	海大介绍	复用变体 A 富文本 + 顶部加 4 校区 Tab,模板同变体 A
9	「校歌校徽」详情	海大介绍	复用变体 A 富文本 + 嵌入音频播放条(自定义 bg bg-card + primary-500 进度 + ▶ 按钮)
10	拨号	电话簿	调用 wx.makePhoneCall(小程序原生 API),Token 层不变
所有 5 个页面严格沿用 Design Tokens + 既有组件库,未引入新的 Token 值、未新增组件。所有数字保持 tnum 等宽,颜色配比全部在约束内。