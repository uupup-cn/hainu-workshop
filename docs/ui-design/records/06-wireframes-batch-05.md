海大工坊 · 第五批真实页面线框
全局网格与配色约定(继承前四批)
项	取值
页面宽度	375(标准 iPhone 设计稿基准)
页面内 padding	space-4(16)左右
区块间距	space-6(24),卡片间 space-3(12)
NavBar 总高	88
数字	UID / 积分 / 时间 / 节次 / 点赞数等全部 tnum 等宽
颜色	主色 ≤25%,薄荷 ≤10%,橙 ≤5%
1. 校友圈主页 <AlumniFeed>
进入路径:社区主页版块入口「校友圈」 页面用途:校友帖 + 表白墙双 Tab 流,带发布入口

布局说明
从上到下 4 个区块:

NavBar + 发布按钮
顶部双 Tab(帖子 / 表白墙)+ 内容分类 Segment(可选)
帖子列表(PostItem)
上滑加载 + FAB 发布按钮(可选)
线框
┌──────────────────────────────────────┐
│  [←]   校友圈          ✍️ [发布]     │  NavBar + 发布 text button
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 顶部双 Tab
│  │  [●帖子]    [表白墙]              │ │  Segment 二段
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  (当前:帖子)                            │
│                                      │
│  ┌────────────────────────────────┐ │ ← 帖子卡 1
│  │ [头像 40] @张三 · 5 分钟前     │ │  PostItem
│  │           [mint 校友]           │ │  Tag mint 校友
│  ├────────────────────────────────┤
│  │  caption: 校园生活第 3 年,看到…   │ │  body 14/22 text-primary
│  │                                │ │
│  │  ┌────────────────────────────┐│ │  4:3 单图
│  │  │      16:9 图片              ││ │  radius-md 8
│  │  └────────────────────────────┘│ │
│  │                                │ │
│  │  💬 12   👍 34   ⭐             │ │  互动 caption tnum
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 帖子卡 2
│  │ [头像 40] @李同学 · 30 分钟前   │ │
│  │           [primary 同班]        │ │  Tag primary 同班
│  ├────────────────────────────────┤
│  │  caption: 周末篮球赛组队…        │ │
│  │                                │ │
│  │  ┌──────┬──────┬──────┐         │ │  3 图网格
│  │  │ 1:1  │ 1:1  │ 1:1  │         │ │
│  │  └──────┴──────┴──────┘         │ │
│  │                                │ │
│  │  💬 5    👍 78   ⭐             │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 帖子卡 3
│  │ [头像 40] @王五 · 1 小时前      │ │
│  │           [mint 校友]           │ │
│  ├────────────────────────────────┤
│  │  caption: 寻找同乡…              │ │
│  │                                │ │
│  │  💬 8    👍 22   ⭐             │ │
│  └────────────────────────────────┘ │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
│                              ┌───┐   │ ← FAB
│                              │ ✍ │   │  primary-500 bg
│                              └───┘   │  56×56 radius-full
│                                      │  shadow-float
└──────────────────────────────────────┘
切到「表白墙」Tab 时
│  ┌────────────────────────────────┐ │ ← 表白墙卡 1
│  │ [头像 40] 匿名 · 2 小时前       │ │  Avatar + 匿名
│  ├────────────────────────────────┤
│  │  body: 想对图书馆三楼那个总是…   │ │  body text-primary
│  │                                │ │
│  │  [mint 暗恋] [orange 表白]      │ │  Tag mint/orange
│  │                                │ │
│  │  💬 56   👍 120   ⭐            │ │
│  └────────────────────────────────┘ │
组件 & Token 引用
区块	组件	Token
NavBar 发布	text button	text-link primary-500
顶部双 Tab	Segment 二段	active primary-500
帖子卡	Card.PostItem	bg bg-card, radius-lg 12, shadow-card
Avatar	Avatar circle 40	primary-50 底
昵称 / 时间	caption	text-secondary / text-tertiary
「校友」Tag	Tag mint	mint-50 + mint-700
「同班」Tag	Tag primary	primary-50 + primary-500
「暗恋」Tag	Tag mint	mint-50 + mint-700
「表白」Tag	Tag orange	orange-50 + orange-700
帖子正文	body 14/22	text-primary
单图 / 多图网格	Image 网格	radius-md 8
互动图标	16×16	text-tertiary
互动数字	caption tnum	text-tertiary
FAB	自定义 56×56	primary-500 bg, white icon, shadow-float
加载更多	Button weak	primary-50 + primary-500
交互路径
触发	行为
顶部 Tab 切换	列表整片替换
点击帖子	跳帖子详情(本批 #2)
点赞	数字 +1,icon 变填充 primary-500
评论	弹评论输入框(本批「发布器」)
收藏	写入「我的收藏」
FAB / 发布	跳发帖 / 发表白墙(本批 #3)
点击头像	跳用户主页
颜色配比自检
颜色	占比
bg / 文字 / 图	~ 82%
primary(Tab + 链接 + FAB + 同班 Tag)	~ 12%
mint(校友 + 暗恋 Tag)	~ 4%
orange(表白 Tag)	~ 2%
主色 12% ✓ / 薄荷 4% ✓ / 橙 2% ✓

2. 帖子详情页 <PostDetail>
进入路径:校友圈主页 / 消息通知 / 分享链接 页面用途:完整帖子内容 + 评论区 + 底部操作条

布局说明
从上到下 5 个区块:

NavBar + 举报 / 分享
帖子主体(头像 + 昵称 + Tag + 正文 + 图)
互动统计 + 时间
评论区(评论列表 + 输入框入口)
底部固定操作条(点赞 / 评论 / 收藏 / 分享)
线框
┌──────────────────────────────────────┐
│  [←]  帖子详情    ⚠️举报  ↗分享       │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 帖子主体
│  │ [头像 48] @张三                │ │  Avatar + H4
│  │           计算机学院 · 海甸校区   │ │  caption text-tertiary
│  │           [mint 校友]            │ │  Tag mint
│  ├────────────────────────────────┤
│  │                                │ │
│  │  body: 校园生活第 3 年,看到樱花…  │ │  body 14/22 text-primary
│  │  body: 想起刚入学时的那个夏天…     │ │
│  │                                │ │
│  │  ┌────────────────────────────┐│ │  16:9 单图
│  │  │      16:9 图片              ││ │  radius-md 8
│  │  └────────────────────────────┘│ │
│  │                                │ │
│  │  5 分钟前 · 来自 iPhone         │ │  caption text-tertiary
│  │  💬 12    👍 34    ⭐ 8         │ │  caption tnum
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │ space-6
│  评论 (12)                             │  H4 text-primary + tnum
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 评论 1
│  │ [头像 32] @李同学    3 分钟前   │ │  Avatar + caption
│  ├────────────────────────────────┤
│  │  body: 一样的感受!              │ │  body 14/22 text-primary
│  │  👍 5    💬 回复                 │ │  caption tnum
│  ├────────────────────────────────┤
│  │     [头像 24] @王五  2 分钟前   │ │  二级回复缩进
│  │     body: 同感                 │ │
│  ├────────────────────────────────┤
│  │ [头像 32] @赵六    10 分钟前    │ │
│  ├────────────────────────────────┤
│  │  body: 照片拍得真好            │ │
│  │  👍 2    💬 回复                 │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 评论输入入口
│  │  ✍️  写下你的评论…                 │ │  bg neutral-100
│  └────────────────────────────────┘ │  radius-full
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐  │ ← 固定底部操作条
  │ [♡ 34]  [💬 12]  [⭐ 8]  [↗ 分享]│  │  bg bg-card
  └──────────────────────────────────┘  │  shadow-tab
                                          │  90h 安全区
组件 & Token 引用
区块	组件	Token
NavBar 举报 / 分享	icon 24	text-tertiary / text-link
帖子主体	Card.PostItem	bg bg-card, radius-lg 12, shadow-card
Avatar	Avatar circle 48 / 32 / 24	primary-50 底
昵称	H4 16/24/600	text-primary
单位	caption	text-tertiary
「校友」Tag	Tag mint	mint-50 + mint-700
正文	body 14/22	text-primary
单图	Image 16:9	radius-md 8
时间	caption tnum	text-tertiary
互动统计	caption tnum	text-tertiary
评论标题	H4 + tnum	text-primary
评论 Cell	Cell + Avatar	bg-card, border-light
二级回复	缩进 Cell + Avatar 24	border-light
评论输入入口	自定义输入条	neutral-100 bg, radius-full
底部操作条	固定栏 + Button × 4	bg bg-card, shadow-tab
「点赞」	Button weak + icon	primary-50 + primary-500
「评论」	Button weak + icon	primary-50 + primary-500
「收藏」	Button weak + icon	primary-50 + primary-500
「分享」	Button primary	primary-500
交互路径
触发	行为
点赞	数字 +1,icon 变填充 primary-500
评论	弹输入框(本批「发布器」)
二级回复	缩进显示,支持嵌套 2 层
收藏	Toast success
分享	ActionSheet:微信好友 / 朋友圈 / 复制链接
举报	ActionSheet:广告 / 人身攻击 / 不实信息 / 其他
颜色配比自检
颜色	占比
bg / 文字 / 图	~ 80%
primary(链接 + CTA + 操作条 + 选中态)	~ 15%
mint(校友 Tag)	~ 3%
orange	0%
主色 15% ✓ / 薄荷 3% ✓ / 橙 0% ✓

3. 发帖 / 发表白墙页 <PostEditor>
进入路径:校友圈 FAB / NavBar 发布按钮 / 帖子详情二次编辑 页面用途:统一发帖编辑器,支持普通帖 + 表白墙两种类型

布局说明
从上到下 5 个区块:

NavBar + 草稿 + 字数
类型选择(帖子 / 表白墙)Segment
文本编辑器(自动撑高)
图片上传网格(最多 9 张)
版块选择 + 底部发布按钮
线框
┌──────────────────────────────────────┐
│  [←]  发帖        📝草稿  0/1000      │  NavBar + 草稿 + 字数 tnum
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 类型 Segment
│  │ [●帖子]    [表白墙]              │ │  active primary-500
│  └────────────────────────────────┘ │
│                                      │
│  ┌────────────────────────────────┐ │ ← 文本编辑器
│  │                                │ │  bg bg-card
│  │  说点什么…                      │ │  placeholder text-placeholder
│  │                                │ │  border-default
│  │  (自动撑高)                       │ │  radius-md 8
│  │                                │ │  padding 16
│  │                                │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 图片上传 9 宫格
│  │ ┌──┐┌──┐┌──┐                    │ │  占位 80×80
│  │ │图││图││图│                    │ │  radius-md 8
│  │ └──┘└──┘└──┘                    │ │  border-default
│  │ ┌──┐┌──┐┌──┐                    │ │
│  │ │图││图││图│                    │ │
│  │ └──┘└──┘└──┘                    │ │
│  │ ┌──┐┌──┐┌──┐                    │ │
│  │ │图││图││+ │                    │ │  「+」占位
│  │ └──┘└──┘└──┘                    │ │  primary-50 底
│  │  caption: 6 / 9                  │ │  caption tnum text-tertiary
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  版块选择                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 版本 Segment 横向
│  │ [●校友圈] [二手集市] [快讯] [失物]  │ │  active primary-500
│  └────────────────────────────────┘ │
│                                      │ space-3
│  话题标签(可选,最多 3 个)              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← Tag 选择
│  │ [●新生][ 校园生活][ 周末][ + 添加]  │ │  选中:primary-50 + primary-500
│  └────────────────────────────────┘ │
│                                      │ space-3
│  (表白墙类型显示)                      │
│  ┌────────────────────────────────┐ │
│  │ 匿名发布     [○ Switch]         │ │  Switch
│  └────────────────────────────────┘ │
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐  │ ← 固定底部
  │  [保存草稿]       [立即发布]       │  │  bg bg-card
  └──────────────────────────────────┘  │  shadow-tab
                                          │  90h 安全区
组件 & Token 引用
区块	组件	Token
NavBar 草稿	text button	text-link primary-500
字数	caption tnum	text-tertiary
类型 Segment	Segment	active primary-500
文本编辑器	Input type="textarea"	bg bg-card, border-default, radius-md 8
placeholder	caption	text-placeholder
图片上传网格	自定义组合	占位 radius-md 8, border-default
「+」上传按钮	自定义占位	primary-50 底, primary-500 icon
图片计数	caption tnum	text-tertiary
分隔线	border-light	neutral-100
版块 Segment	Segment 横向	active primary-500
话题 Tag	Tag primary selectable	primary-50 + primary-500
匿名 Switch	Switch	primary-500 选中
底部按钮组	Button × 2	bg bg-card, shadow-tab
「保存草稿」	Button secondary	border-default
「立即发布」	Button primary	primary-500
交互路径
触发	行为
类型切换	帖子 ⇄ 表白墙,匿名开关显隐
文本输入	实时计数,1000 字上限
图片上传	弹选择:相机 / 相册,≤ 9 张
话题 Tag	切换选中(≤ 3)
匿名 Switch	仅表白墙类型可见
保存草稿	Toast success「已保存草稿」
立即发布	提交 → Toast success → 跳帖子详情
表单验证规则
字段	规则
正文	必填,1-1000 字
图片	≤ 9 张,单张 ≤ 10MB
版块	必选
话题	≤ 3 个
颜色配比自检
颜色	占比
bg / 文字	~ 84%
primary(Tab + 链接 + 上传 + CTA)	~ 13%
mint	0%
orange	0%
主色 13% ✓ / 薄荷 0% ✓ / 橙 0% ✓

4. 课表详情 / 设置页 <CourseDetail>
进入路径:课表主页课程格 / 课程列表项 页面用途:单课程详情 + 编辑 + 删除 + 导出

布局说明
从上到下 5 个区块:

NavBar + 编辑 / 删除
课程信息卡(色条 + 名称 + 老师 + 教室 + 节次)
上课时间(周次)
课程备注 + 关联操作
底部导出按钮
线框
┌──────────────────────────────────────┐
│  [←]   课程详情      ✏️编辑  🗑删除 │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 课程信息卡
│  │▌                                │ │  左侧 4px 色条
│  │▌  高等数学                      │ │  H2 text-primary
│  │▌  caption: 必修 · 4 学分         │ │  Tag primary 必修
│  │▌                                │ │
│  │▌  👤 李教授                      │ │  H4 text-primary
│  │▌  📍 教务楼 301                  │ │  caption text-secondary
│  │▌  🕐 周一 第 1-2 节  08:00-09:40  │ │  tnum primary-500
│  │▌                                │ │
│  │▌  色条 primary-500               │ │  必修
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │  shadow-card
│                                      │ space-6
│  上课时间                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 周次网格
│  │  ●1 ●2 ●3 ●4 ●5 ●6 ●7 ●8 ●9 ●10│ │  圆点 8×8
│  │  ●11 ●12 ●13 ●14 ●15 ○16 ○17  │ │  primary-500 已上
│  │  ○18 ○19 ○20                    │ │  neutral-300 待上
│  └────────────────────────────────┘ │  bg bg-card radius-md 8
│                                      │  caption: 已上 15 / 20 tnum
│                                      │ space-6
│  课程备注                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  body: 注意带教材 + 作业本         │ │  body text-primary
│  └────────────────────────────────┘ │  bg bg-card radius-md 8
│                                      │ space-6
│  关联操作                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ 📚  课程资料                  › │ │  Cell
│  ├────────────────────────────────┤
│  │ 📝  课程作业                  › │
│  ├────────────────────────────────┤
│  │ 💬  课程讨论                  › │
│  └────────────────────────────────┘ │
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐  │ ← 固定底部
  │       [导出为日历]                │  │  Button primary large
  └──────────────────────────────────┘  │  bg bg-card, shadow-tab
                                          │  90h 安全区
编辑模式线框
┌──────────────────────────────────────┐
│  [←]   编辑课程         ✓ 保存        │  NavBar
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │
│  │  课程名称                        │ │  label
│  │  ┌──────────────────────────┐ │ │  Input
│  │  │  高等数学                  │ │ │
│  │  └──────────────────────────┘ │ │
│  │                                │ │
│  │  课程类型                        │ │  label
│  │  ┌──────┬──────┬──────┐         │ │  Segmented
│  │  │●必修 │ 选修 │ 实验 │         │ │  active primary-500
│  │  └──────┴──────┴──────┘         │ │
│  │                                │ │
│  │  老师 / 教室 / 节次 / 周次        │ │  Select 多个
│  │  ...                           │ │
│  │                                │ │
│  │  颜色                            │ │  label
│  │  [●primary][ mint][ orange]    │ │  Tag 选择
│  └────────────────────────────────┘ │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 编辑 / 删除	icon 24	text-tertiary / text-link
课程信息卡	Card + 4px 色条	bg bg-card, radius-lg 12, shadow-card
必修色条	4px primary	primary-500
选修色条	4px mint	mint-500
实验色条	4px orange	orange-500
课程名称	H2 22/30/600	text-primary
类型 Tag	Tag primary / mint / orange	三色
老师	H4	text-primary
教室 / 时间	caption + tnum	text-secondary / primary-500
周次网格	自定义 20 圆点	已上 primary-500, 待上 neutral-300
进度	caption tnum	text-secondary
备注	body	text-primary
关联操作	Cell	bg-card, border-light
底部导出	Button primary large	primary-500, shadow-tab
编辑模式 Input	Input	bg-card, border-default
编辑模式 Segmented	Segment	active primary-50 + primary-500
颜色选择 Tag	Tag × 3 selectable	primary/mint/orange
交互路径
触发	行为
编辑	切到编辑模式
删除	Dialog 二次确认,确认后删除
点击周次圆点	Popover 显示该周课程状态
关联操作	跳对应详情页
导出为日历	弹 ActionSheet:微信日历 / 系统 .ics 文件
保存	Toast success → 返回详情页
颜色配比自检
颜色	占比
bg / 文字	~ 85%
primary(色条 + 时间 + 链接 + CTA + 必修 Tag)	~ 11%
mint(选修类型)	~ 2%
orange(实验类型)	~ 2%
主色 11% ✓ / 薄荷 2% ✓ / 橙 2% ✓

5. 工具箱主页 <Toolbox>
进入路径:首页 TabBar / 智慧海大主页工具区 页面用途:按分类分区(免费 / 积分)的工具宫格,每项显示解锁状态

布局说明
从上到下 5 个区块:

NavBar + 搜索
免费工具分组(宫格)
积分工具分组(宫格 + 积分标签)
已解锁工具分组(可选)
推荐位 / 公告
线框
┌──────────────────────────────────────┐
│  [←]   工具箱             🔍 搜索     │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ━━━ 免费工具 ━━━                       │  分组标题
│  ┌────────────────────────────────┐ │  caption text-secondary
│  │ ┌──────┬──────┬──────┬──────┐   │ │  4 列宫格
│  │ │ 🧮   │ 📅   │ ⏰   │ 📐   │   │ │  图标底 48
│  │ │ 证件照 │ 影视解析 │ 科学计算器 │ 转盘│   │ │  primary-50
│  │ │primary│primary│primary│primary│   │  caption 12
│  │ └──────┴──────┴──────┴──────┘   │ │  整卡 bg bg-card
│  └────────────────────────────────┘ │  radius-xl 16
│                                      │ space-6
│  ━━━ 积分工具 ━━━                       │  分组标题
│  ┌────────────────────────────────┐ │
│  │ ┌──────┬──────┬──────┬──────┐   │ │  4 列宫格
│  │ │ 📊   │ 🤖   │ 📝   │ 🎓   │   │ │  图标底 48
│  │ │数据分析│ AI 助手│ 简历  │ 课题库│   │ │  orange-50
│  │ │[orange│[orange│[orange│[orange│   │ │  积分工具橙色底
│  │ │ 50 积]│ 100 │ 80 │ 200 ]│   │ │  Tag orange 积分
│  │ └──────┴──────┴──────┴──────┘   │ │
│  └────────────────────────────────┘ │  bg bg-card, radius-xl 16
│                                      │ space-6
│  ━━━ 已解锁 (3) ━━━                     │  分组标题
│  ┌────────────────────────────────┐ │
│  │ ┌──────┬──────┬──────┐         │ │  3 列宫格
│  │ │ 📊   │ 🤖   │ 📝   │         │ │  图标底 48
│  │ │数据分析│ AI 助手│ 简历  │         │ │  mint-50
│  │ │[mint  │[mint │[mint │         │ │  已解锁薄荷绿
│  │ │ 已解锁]│ 已解锁│ 已解锁│         │ │  Tag mint 已解锁
│  │ └──────┴──────┴──────┘         │ │
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ━━━ 工具公告 ━━━                       │  分组标题
│  ┌────────────────────────────────┐ │
│  │ 📣  本周新上 3 个积分工具          │ │  Card.Standard
│  │     caption: 立即查看 →           │ │  caption text-tertiary
│  └────────────────────────────────┘ │
│                                      │
│  [留白 + TabBar 90h]                  │
└──────────────────────────────────────┘
   [TabBar · 4 等分]                    │ 90h
组件 & Token 引用
区块	组件	Token
NavBar 搜索	icon 24	text-secondary
分组标题	caption	text-secondary
免费工具整卡	Card	bg bg-card, radius-xl 16, shadow-card
免费工具单格	圆 48 + caption	primary-50 底, primary-500 图标
积分工具整卡	Card	bg bg-card, radius-xl 16, shadow-card
积分工具单格	圆 48 + caption	orange-50 底, orange-500 图标
积分 Tag	Tag orange	orange-50 + orange-700
已解锁整卡	Card	bg bg-card, radius-xl 16
已解锁单格	圆 48 + caption	mint-50 底, mint-500 图标
已解锁 Tag	Tag mint	mint-50 + mint-700
工具公告	Card.Standard	bg-card, radius-lg 12
「立即查看」	text button	text-link primary-500
TabBar	TabBar	bg-card, shadow-tab
交互路径
触发	行为
搜索	跳搜索结果页
点击免费工具	直接跳工具详情
点击积分工具(未解锁)	弹 Dialog「消耗 X 积分解锁」
点击已解锁工具	跳工具详情
工具公告	跳工具更新说明
颜色配比自检
颜色	占比
bg / 文字	~ 80%
primary(免费工具图标底 + 主图标 + 链接)	~ 12%
mint(已解锁图标底 + Tag)	~ 5%
orange(积分工具图标底 + Tag)	~ 3%
主色 12% ✓ / 薄荷 5% ✓ / 橙 3% ✓

三色分工:免费 primary / 积分 orange / 已解锁 mint,语义清晰,比例均衡。

6. 个人中心主页 <Profile>
进入路径:底部 TabBar「我的」 页面用途:用户资料聚合 + 8 大功能入口

布局说明
从上到下 4 个区块:

NavBar
顶部用户卡(头像 + 昵称 + UID + 认证 + 积分)
数据统计 3 卡(发布 / 收藏 / 关注)
功能列表 Cell(8 项)
线框
┌──────────────────────────────────────┐
│  [←]     个人中心        ⚙️ 设置     │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 用户卡(渐变头)
│  │  ╭────────────────────────╮  │ │  linear-gradient
│  │  │ [头像 64]  张三         │  │ │  primary-700 → primary-500
│  │  │           UID 2001004567│  │ │  text-on-primary
│  │  │           [mint ✓ 已认证]│  │ │  Tag mint 已认证
│  │  │                            │  │ │
│  │  │  积分  386          [立即查看 ›]│ │  primary-500 数字 tnum
│  │  ╰────────────────────────╯  │ │
│  └────────────────────────────────┘ │  radius-xl 16, shadow-float
│                                      │ space-6
│  ┌────────────┬────────────┬────────┐ │ ← 数据统计 3 卡
│  │  发布       │  收藏       │  关注   │ │  bg bg-card
│  │   12        │   34        │   8    │ │  radius-lg 12
│  │  primary    │  primary    │ primary│ │  H2 tnum
│  └────────────┴────────────┴────────┘ │  shadow-card
│                                      │ space-6
│  我的服务                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 功能 Cell
│  │ 📤  我的发布             12 › │ │  Cell + Badge
│  ├────────────────────────────────┤
│  │ ⭐  我的收藏             34 › │ │
│  ├────────────────────────────────┤
│  │ 🪙  积分中心            386 › │ │  Badge primary
│  ├────────────────────────────────┤
│  │ ✓  认证中心             [mint] │ │  Tag mint 已认证
│  ├────────────────────────────────┤
│  │ 🔒  隐私设置               › │ │
│  ├────────────────────────────────┤
│  │ 🔔  通知设置         [●3]  › │ │  Badge danger 3
│  ├────────────────────────────────┤
│  │ 💬  反馈与建议             › │ │
│  ├────────────────────────────────┤
│  │ ⚙️  系统设置               › │ │
│  └────────────────────────────────┘ │  bg bg-card radius-lg 12
│                                      │
│  [留白 + TabBar 90h]                  │
└──────────────────────────────────────┘
   [TabBar · 4 等分]                    │ 90h
组件 & Token 引用
区块	组件	Token
NavBar 设置	icon 24	text-secondary
用户卡	Card 自定义渐变	渐变 primary-700→500, radius-xl 16, shadow-float
Avatar	Avatar circle 64	white 底
昵称	H2 22/30/600	text-on-primary
UID	caption tnum	text-on-primary 透明度 0.85
「已认证」Tag	Tag mint	mint-50 + mint-700
积分	H4 tnum	text-on-primary
「立即查看」	text button	text-on-primary
数据统计 3 卡	Card × 3	bg bg-card, radius-lg 12, shadow-card
统计数字	H2 tnum	primary-500
统计标签	caption	text-secondary
功能列表 Cell	Cell × 8	bg-card, border-light
「我的发布」Badge	Badge danger	danger + radius-full
「积分中心」Badge	Badge primary	primary-500
「认证中心」Tag	Tag mint	mint-50 + mint-700
「通知设置」Badge	Badge danger	danger
TabBar	TabBar	bg-card, shadow-tab
交互路径
触发	跳转
头像	个人资料编辑页
积分「立即查看」	积分中心
发布 / 收藏 / 关注统计卡	对应列表页
8 个功能 Cell	各自详情页
设置 icon	系统设置页
颜色配比自检
颜色	占比
bg / 文字	~ 76%
primary(用户卡渐变 + 统计数字 + 积分 Badge)	~ 18%
mint(认证 Tag)	~ 4%
orange	0%
danger(通知 / 发布 Badge)	~ 2%
主色 18% ✓ / 薄荷 4% ✓ / 橙 0% ✓

danger 是功能色,不计入主色配比。

第五批真实页面与组件对照表
页面	区块	组件	Token 引用
校友圈主页	NavBar 发布	text button	text-link
顶部双 Tab	Segment	active primary-500
帖子卡	Card.PostItem	bg-card, radius-lg 12
Avatar	Avatar circle 40	primary-50 底
「校友」Tag	Tag mint	mint-50 + mint-700
「同班」Tag	Tag primary	primary-50 + primary-500
「暗恋」Tag	Tag mint	mint-50 + mint-700
「表白」Tag	Tag orange	orange-50 + orange-700
帖子正文	body	text-primary
多图网格	Image	radius-md 8
互动数字	caption tnum	text-tertiary
FAB	自定义 56×56	primary-500, shadow-float
加载更多	Button weak	primary-50 + primary-500
帖子详情	NavBar 举报 / 分享	icon 24	text-tertiary / text-link
帖子主体	Card.PostItem	bg-card, radius-lg 12
Avatar 48/32/24	Avatar circle	primary-50 底
「校友」Tag	Tag mint	mint-50 + mint-700
单图	Image 16:9	radius-md 8
互动统计	caption tnum	text-tertiary
评论 Cell	Cell + Avatar	border-light
二级回复	缩进 Cell + Avatar 24	border-light
评论输入入口	自定义输入条	neutral-100, radius-full
底部操作条	固定栏 + Button × 4	bg-card, shadow-tab
点赞 / 评论 / 收藏	Button weak	primary-50 + primary-500
分享	Button primary	primary-500
发帖页	NavBar 草稿	text button	text-link
字数	caption tnum	text-tertiary
类型 Segment	Segment	active primary-500
文本编辑器	Input textarea	bg-card, border-default, radius-md 8
图片上传网格	自定义组合	radius-md 8, border-default
「+」上传按钮	自定义占位	primary-50, primary-500
图片计数	caption tnum	text-tertiary
版块 Segment	Segment 横向	active primary-500
话题 Tag	Tag primary selectable	primary-50 + primary-500
匿名 Switch	Switch	primary-500 选中
底部按钮组	Button × 2	bg-card, shadow-tab
草稿	Button secondary	border-default
发布	Button primary	primary-500
课表详情	NavBar 编辑 / 删除	icon 24	text-tertiary / text-link
课程信息卡	Card + 4px 色条	bg-card, radius-lg 12, shadow-card
必修色条	4px	primary-500
选修色条	4px	mint-500
实验色条	4px	orange-500
课程名称	H2	text-primary
类型 Tag	Tag 三色	primary/mint/orange
时间 / 节次	caption tnum	text-secondary / primary-500
周次网格	自定义 20 圆点	primary-500 / neutral-300
备注	body	text-primary
关联操作	Cell	border-light
底部导出	Button primary large	primary-500, shadow-tab
编辑模式 Input	Input	bg-card, border-default	
编辑 Segmented	Segment	primary-50 + primary-500	
编辑颜色 Tag	Tag × 3 selectable	primary/mint/orange	
工具箱主页	NavBar 搜索	icon 24	text-secondary
分组标题	caption	text-secondary
免费工具整卡	Card	bg-card, radius-xl 16
免费单格	圆 48 + caption	primary-50, primary-500
积分工具整卡	Card	bg-card, radius-xl 16
积分单格	圆 48 + caption	orange-50, orange-500
积分 Tag	Tag orange	orange-50 + orange-700
已解锁整卡	Card	bg-card, radius-xl 16
已解锁单格	圆 48 + caption	mint-50, mint-500
已解锁 Tag	Tag mint	mint-50 + mint-700
工具公告	Card.Standard	bg-card, radius-lg 12
「立即查看」	text button	text-link
TabBar	TabBar	bg-card, shadow-tab
个人中心	NavBar 设置	icon 24	text-secondary
用户卡	Card 自定义渐变	渐变 primary-700→500, shadow-float
Avatar	Avatar circle 64	white 底
昵称	H2	text-on-primary
UID	caption tnum	text-on-primary 0.85
「已认证」Tag	Tag mint	mint-50 + mint-700
积分	H4 tnum	text-on-primary
数据统计 3 卡	Card × 3	bg-card, radius-lg 12
统计数字	H2 tnum	primary-500
功能列表 Cell	Cell × 8	bg-card, border-light
「我的发布」Badge	Badge danger	danger
「积分中心」Badge	Badge primary	primary-500
「认证中心」Tag	Tag mint	mint-50 + mint-700
「通知设置」Badge	Badge danger	danger
TabBar	TabBar	bg-card, shadow-tab
末尾:本批页面层级的交互细节说明(不改动组件库)
#	细节	所属页面	说明
1	FAB 浮动发布按钮	校友圈	用 Button + shadow-float 组合,组件库不变
2	顶部双 Tab(帖子 / 表白墙)	校友圈	复用 Segment 二段,内容区整片替换
3	二级评论缩进	帖子详情	用 Cell + padding-left 缩进 + Avatar 24,组件库不变
4	互动数字内嵌图标	帖子详情	用 Button weak + icon 16 + caption 组合,组件库不变
5	9 宫格图片上传	发帖页	自定义组合,radius-md 8 占位,组件库不变
6	表白墙匿名 Switch	发帖页	复用 Switch,组件库不变
7	字数计数器	发帖页	用 caption + tnum 内嵌 NavBar,组件库不变
8	周次网格 20 圆点	课表详情	用自定义圆点 + tnum,组件库不变
9	课程色条 4px	课表详情	Card 内嵌 4px 左侧色条,色值用 primary/mint/orange,组件库不变
10	工具箱三色分区	工具箱	免费 primary / 积分 orange / 已解锁 mint,语义清晰,无新色
11	个人中心用户卡渐变	个人中心	Card 内嵌 linear-gradient primary-700→500,组件库不变
12	8 功能 Cell + Badge	个人中心	复用 Cell + Badge,组件库不变
13	帖子举报 ActionSheet	帖子详情	复用 ActionSheet,选项:广告 / 人身攻击 / 不实信息 / 其他
14	分享 ActionSheet	帖子详情 / 快讯详情	复用 ActionSheet,选项:微信好友 / 朋友圈 / 复制链接
15	编辑模式切换	课表详情	NavBar 切换 + 内容区替换,组件库不变
所有 6 个页面严格沿用 Design Tokens + 既有组件库,未引入新 Token 值、未新增组件。所有数字保持 tnum 等宽,颜色配比全部在约束内。
