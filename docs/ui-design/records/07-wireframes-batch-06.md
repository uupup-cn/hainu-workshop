海大工坊 · 第六批真实页面线框(末批)
全局网格与配色约定(继承前五批)
项	取值
页面宽度	375(标准 iPhone 设计稿基准)
页面内 padding	space-4(16)左右
区块间距	space-6(24),卡片间 space-3(12)
NavBar 总高	88
数字	学号 / 时间 / 剩余次数 / 联系方式等全部 tnum 等宽
颜色	主色 ≤25%,薄荷 ≤10%,橙 ≤5%
1. 认证中心 <Verify>
进入路径:个人中心「认证中心」入口 页面用途:学生身份认证全流程(未认证 / 待审核 / 已认证 / 驳回),四态切换

布局说明
从上到下 4 个区块:

NavBar default
认证状态区(四态切换)
申请表单(姓名 / 学号 / 专业 / 证明图)
驳回原因 + 重新申请按钮
线框 — 状态 A · 未认证(默认)
┌──────────────────────────────────────┐
│  [←]            认证中心              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 状态卡
│  │      🔒  (icon 64)               │ │  text-tertiary
│  │                                │ │
│  │      尚未认证                    │ │  H2 text-primary
│  │  caption: 完成认证后可解锁全部功能 │ │  caption text-tertiary
│  └────────────────────────────────┘ │  bg bg-card, radius-xl 16
│                                      │  shadow-card
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  实名认证                              │  H4 text-primary
│  caption: 你的信息仅用于身份核验,不会公开展示│
│                                      │
│  ┌────────────────────────────────┐ │ ← 表单
│  │  真实姓名 *                     │ │  label
│  │  ┌──────────────────────────┐ │ │  Input 48h
│  │  │  请输入真实姓名              │ │ │  border-default
│  │  └──────────────────────────┘ │ │
│  ├────────────────────────────────┤
│  │  学号 *                        │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │  请输入 10 位学号            │ │ │  tnum
│  │  └──────────────────────────┘ │ │
│  ├────────────────────────────────┤
│  │  所在学院 *                     │ │
│  │  ┌──────────────────────────┐ │ │  Select + Cascader
│  │  │ 计算机科学与技术学院      ▼ │ │ │
│  │  └──────────────────────────┘ │ │
│  ├────────────────────────────────┤
│  │  所在专业 *                     │ │
│  │  ┌──────────────────────────┐ │ │
│  │  │ 软件工程                  ▼ │ │ │
│  │  └──────────────────────────┘ │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  证明材料                              │  H4 text-primary
│  caption: 上传一卡通正面 / 学信网截图(最多 3 张)│
│  ┌──────┬──────┬──────┐             │ ← 图片上传
│  │  图  │  图  │  +  │             │  80×80 radius-md 8
│  └──────┴──────┴──────┘             │  border-default
│  caption: 2 / 3                       │  tnum text-tertiary
│                                      │ space-6
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐  │ ← 固定底部
  │       [提交认证申请]              │  │  Button primary large
  └──────────────────────────────────┘  │  bg bg-card, shadow-tab
                                          │  90h 安全区
线框 — 状态 B · 待审核
│  ┌────────────────────────────────┐ │ ← 状态卡
│  │      ⏳  (icon 64)               │ │  primary-500
│  │                                │ │
│  │      认证审核中                  │ │  H2 text-primary
│  │  caption: 提交于 2025-09-18 14:30 │ │  caption tnum
│  │  caption: 预计 1 个工作日内完成    │ │  text-tertiary
│  │                                │ │
│  │  [查看申请详情 ›]                │ │  text-link primary-500
│  └────────────────────────────────┘ │  bg bg-card, radius-xl 16
线框 — 状态 C · 已认证
│  ┌────────────────────────────────┐ │ ← 状态卡
│  │      ✓  (icon 64)                │ │  mint-500
│  │                                │ │
│  │      认证已通过                  │ │  H2 text-primary
│  │  [mint ✓ 已认证]                │ │  Tag mint 已认证
│  │  caption: 通过时间 2025-09-19    │ │  caption tnum text-tertiary
│  │                                │ │
│  │  ⚡ 积分功能已开启                │ │  H4 primary-500
│  │  caption: 你现在可以参与积分活动   │ │  caption text-secondary
│  └────────────────────────────────┘ │  bg bg-card, radius-xl 16
│                                      │
│  认证信息                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 信息卡 Cell
│  │  姓名                  张三    │ │
│  ├────────────────────────────────┤
│  │  学号            2001004567  │ │  tnum
│  ├────────────────────────────────┤
│  │  学院     计算机科学与技术学院  │ │
│  ├────────────────────────────────┤
│  │  专业              软件工程    │ │
│  └────────────────────────────────┘ │
线框 — 状态 D · 驳回
│  ┌────────────────────────────────┐ │ ← 状态卡
│  │      ⚠️  (icon 64)               │ │  danger
│  │                                │ │
│  │      认证未通过                  │ │  H2 text-primary
│  │  [danger 驳回]                  │ │  Tag danger 驳回
│  │  caption: 驳回时间 2025-09-19    │ │  caption tnum text-tertiary
│  └────────────────────────────────┘ │
│                                      │ space-3
│  驳回原因                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  body: 上传的证明材料不清晰,     │ │  body text-primary
│  │  body: 无法识别学号信息,请重新上传 │ │
│  └────────────────────────────────┘ │  bg danger-bg, radius-md 8
│                                      │ space-3
│  重新申请                              │  H4 text-primary
│  caption: 剩余申请次数 2 / 3            │  caption tnum text-secondary
│                                      │
│  [留白 64h 底部固定条占位]              │
│
│  ┌──────────────────────────────────┐  │ ← 固定底部
│  │  [重新申请]      [查看驳回详情]   │  │  Button primary + secondary
│  └──────────────────────────────────┘  │  bg bg-card, shadow-tab
剩余次数用尽后「重新申请」置灰(disabled),文案改为「已用完申请次数,请联系管理员」。

组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
状态卡(未认证)	Card + icon 64	bg-card, radius-xl 16, shadow-card
状态卡(待审核)	Card + icon 64	bg-card, icon primary-500
状态卡(已认证)	Card + icon 64	bg-card, icon mint-500
状态卡(驳回)	Card + icon 64	bg-card, icon danger
主标题	H2 22/30/600	text-primary
副标题	caption	text-tertiary
表单 Input	Input	bg-card, border-default → primary-500
Select / Cascader	Select + Cascader	bg-card, border-default
图片上传	自定义组合	radius-md 8, border-default
「已认证」Tag	Tag mint	mint-50 + mint-700
「驳回」Tag	Tag danger	danger-bg + danger
积分功能提示	H4	primary-500
驳回原因卡	Card	bg danger-bg, radius-md 8
驳回原因正文	body	text-primary
剩余次数	caption tnum	text-secondary
申请详情链接	text button	text-link primary-500
底部固定按钮	Button primary / secondary	bg-card, shadow-tab
重新申请(用尽)	Button primary disabled	neutral-300 + text-disabled
交互路径
触发	行为
提交申请	Toast success → 切到待审核态
查看申请详情	跳申请详情页
重新申请	重置表单,剩余次数 -1
剩余次数 = 0	按钮置灰 + Toast info 提示联系管理员
颜色配比自检
颜色	占比
bg / 文字	~ 84%
primary(待审核 icon + 链接 + CTA + 积分提示)	~ 11%
mint(已认证 icon + Tag)	~ 3%
orange	0%
danger(驳回 icon + Tag + 驳回原因底)	~ 2%
主色 11% ✓ / 薄荷 3% ✓ / 橙 0% ✓

danger 是功能色,不计入主色配比。

2. 隐私设置 <Privacy>
进入路径:个人中心「隐私设置」入口 / 设置页 页面用途:隐私模式总开关 + 对外字段控制 + 预览效果

布局说明
从上到下 4 个区块:

NavBar default
隐私模式总开关卡
对外展示字段开关列表
预览效果(模拟他人视角)
线框
┌──────────────────────────────────────┐
│  [←]            隐私设置              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 总开关卡
│  │  🔒  隐私模式                   │ │  H4 text-primary
│  │  caption: 开启后,非认证用户无法查看│ │  caption text-secondary
│  │  caption: 你的主页               │ │
│  │                          [● Switch]│ │  Switch 选中 primary-500
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│  对外展示字段                          │  H4 text-primary
│  caption: 控制其他用户能看到的字段     │  caption text-tertiary
│                                      │
│  ┌────────────────────────────────┐ │ ← 字段开关列表
│  │  👤  头像           [● Switch]  │ │  Cell + Switch
│  ├────────────────────────────────┤
│  │  📛  昵称           [● Switch]  │ │
│  ├────────────────────────────────┤
│  │  ✉️  邮箱           [○ Switch]  │ │  Switch 未选 neutral-300
│  ├────────────────────────────────┤
│  │  💬  QQ 号          [○ Switch]  │ │
│  ├────────────────────────────────┤
│  │  💬  微信号         [○ Switch]  │ │
│  ├────────────────────────────────┤
│  │  📍  所在校区       [● Switch]  │ │
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  预览效果                              │  H4 text-primary
│  caption: 模拟其他用户查看你的主页       │  caption text-tertiary
│                                      │
│  ┌────────────────────────────────┐ │ ← 预览卡(模拟他人视角)
│  │  [头像 48]   张三              │ │  Avatar + H4
│  │             caption: 计算机学院    │ │  caption text-tertiary
│  │             [mint ✓ 已认证]     │ │  Tag mint
│  ├────────────────────────────────┤
│  │  ✉️  邮箱           (已隐藏)     │ │  caption text-placeholder
│  ├────────────────────────────────┤
│  │  💬  QQ 号          (已隐藏)     │ │  caption text-placeholder
│  ├────────────────────────────────┤
│  │  💬  微信号         (已隐藏)     │ │
│  ├────────────────────────────────┤
│  │  📍  所在校区       海甸校区     │ │  caption text-secondary
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │  shadow-card
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
总开关卡	Card + Switch	bg-card, radius-lg 12
总开关 Switch	Switch 选中	primary-500
字段开关列表	Cell × 6 + Switch	bg-card, border-light
字段 Switch(选中)	Switch	primary-500
字段 Switch(未选)	Switch	neutral-300
预览卡	Card + Avatar	bg-card, radius-lg 12, shadow-card
Avatar	Avatar circle 48	primary-50 底
昵称	H4	text-primary
单位	caption	text-tertiary
「已认证」Tag	Tag mint	mint-50 + mint-700
「已隐藏」文字	caption	text-placeholder
显示值	caption	text-secondary
交互路径
触发	行为
总开关切换	全部字段开关跟随(可单独再开启)
字段开关切换	预览区实时同步
预览卡点击	弹 Popover 提示「这就是他人看到的样子」
颜色配比自检
颜色	占比
bg / 文字	~ 90%
primary(Switch 选中 + Avatar 底)	~ 8%
mint(已认证 Tag)	~ 2%
orange	0%
主色 8% ✓ / 薄荷 2% ✓ / 橙 0% ✓

3. 消息中心 <Messages>
进入路径:首页 / 个人中心 通知 Badge 页面用途:通知列表 + 已读 / 未读 + 身份过滤 + 详情

布局说明 — 列表页
从上到下 4 个区块:

NavBar + 全部已读
身份过滤 Segment(全部 / 本科生 / 研究生 / 新生)
通知列表(按时间倒序,未读带红点)
上滑加载
线框 — 列表页
┌──────────────────────────────────────┐
│  [←]    消息中心       ✓ 全部已读     │  NavBar + 全部已读
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 身份过滤
│  │[●全部][本科生][研究生][新生]      │ │  Segment 横向
│  └────────────────────────────────┘ │  active primary-500
│                                      │
│  ┌────────────────────────────────┐ │ ← 通知 1(未读)
│  │ ● [icon] 系统通知    2 分钟前   │ │  红点 8×8 danger
│  ├────────────────────────────────┤
│  │  caption: 你的认证已通过,积分…   │ │  body text-primary
│  │  caption 14:30  系统              │ │  caption text-tertiary
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 通知 2(未读)
│  │ ● [icon] 课程提醒    1 小时前    │ │
│  ├────────────────────────────────┤
│  │  caption: 明天 8:00 高等数学…   │ │
│  │  caption 13:00  教务处           │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 通知 3(已读)
│  │   [icon] 活动通知    昨天       │ │  无红点
│  ├────────────────────────────────┤
│  │  caption: 新生辩论赛报名启动…   │ │  body text-tertiary
│  │  caption 昨天 11:05  校辩论队    │ │
│  └────────────────────────────────┘ │  bg neutral-50
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 通知 4(已读)
│  │   [icon] 失物招领    2 天前      │ │
│  ├────────────────────────────────┤
│  │  caption: 一教 305 拾到钱包…    │ │
│  │  caption 09-16 18:20  学工处     │ │
│  └────────────────────────────────┘ │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
线框 — 详情页
┌──────────────────────────────────────┐
│  [←]   通知详情       ↗分享  ⭐收藏 │  NavBar default
├──────────────────────────────────────┤
│  ┌────────────────────────────────┐ │ ← 标题区
│  │  [icon] 系统通知                │ │
│  │  你的认证已通过                  │ │  H2 text-primary
│  │  caption: 系统 · 2025-09-19 14:30│ │  caption tnum text-tertiary
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  各位同学:                             │  body 14/22 text-primary
│                                      │
│  你的学生身份认证已通过审核,           │
│  现在可以参与校园积分活动…            │
│                                      │
│  ┌────────────────────────────────┐ │ ← 内嵌图
│  │  16:9 图                         │ │  radius-md 8
│  └────────────────────────────────┘ │
│  caption: 积分功能入口示意             │  caption text-tertiary
│                                      │
│  ━━━━━━━━━━━━━━━━━━━                  │
│                                      │
│  来源  系统通知                       │  caption text-secondary
│  发布  2025-09-19 14:30              │  caption tnum text-tertiary
│  阅读  1284                          │  caption tnum text-tertiary
│                                      │
│  相关通知                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  课程提醒:明天 8:00 高等数学  › │ │  Cell
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 全部已读	text button	text-link primary-500
身份过滤 Segment	Segment 横向	active primary-500
通知卡(未读)	Cell + 红点	bg-card, radius-lg 12
红点	自定义 8×8	danger
未读正文	body	text-primary
已读通知卡	Cell	bg neutral-50
已读正文	body	text-tertiary
时间	caption tnum	text-tertiary
来源	caption	text-secondary
加载更多	Button weak	primary-50 + primary-500
详情标题区	Card	bg-card, radius-lg 12
主标题	H2	text-primary
正文	body	text-primary
内嵌图	Image	radius-md 8
来源信息	Cell	border-light
相关通知	Cell	border-light
分享 / 收藏	icon 24	text-tertiary / text-link
交互路径
触发	行为
身份 Segment 切换	列表过滤
点击通知	跳详情页 + 标记已读
全部已读	Toast success + 红点全消
详情分享 / 收藏	同快讯详情
长按通知	ActionSheet:删除 / 标为未读
颜色配比自检
颜色	占比
bg / 文字	~ 86%
primary(Segment + 链接 + 加载更多)	~ 11%
mint	0%
orange	0%
danger(未读红点)	~ 3%
主色 11% ✓ / 薄荷 0% ✓ / 橙 0% ✓

danger 是功能色,不计入主色配比。

4. 用户反馈 <Feedback>
进入路径:个人中心「反馈与建议」入口 页面用途:反馈提交 + 历史记录

布局说明 — 提交页
从上到下 4 个区块:

NavBar + 历史记录入口
反馈类型选择
反馈内容(必填)+ 联系方式(选填)
底部提交按钮
线框 — 提交页
┌──────────────────────────────────────┐
│  [←]  反馈与建议        📋 历史记录  │  NavBar + 历史入口
├──────────────────────────────────────┤
│                                      │
│  反馈类型                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │ [●功能bug][ 产品建议][ 体验问题][ 其他]│ │  Segment 横向
│  └────────────────────────────────┘ │  active primary-500
│                                      │ space-6
│  反馈内容 *                            │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 文本编辑器
│  │                                │ │  bg bg-card
│  │  请详细描述你遇到的问题…          │ │  placeholder text-placeholder
│  │                                │ │  border-default
│  │  (自动撑高)                       │ │  radius-md 8
│  │                                │ │  padding 16
│  └────────────────────────────────┘ │
│  caption: 0 / 500                    │  caption tnum text-tertiary
│                                      │ space-6
│  联系方式(选填)                        │  H4 text-primary
│  caption: 留下后我们可主动跟进          │  caption text-tertiary
│  ┌────────────────────────────────┐ │
│  │  QQ / 微信 / 邮箱(任选其一)      │ │  Input 48h
│  └────────────────────────────────┘ │  border-default
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  [留白 64h 底部固定条占位]              │
└──────────────────────────────────────┘

  ┌──────────────────────────────────┐  │ ← 固定底部
  │       [提交反馈]                  │  │  Button primary large
  └──────────────────────────────────┘  │  bg bg-card, shadow-tab
                                          │  90h 安全区
线框 — 历史记录页
┌──────────────────────────────────────┐
│  [←]        反馈历史记录              │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 反馈 1(已处理)
│  │ [icon] 功能 bug     [mint 已处理]│ │  Tag mint 已处理
│  ├────────────────────────────────┤
│  │  caption: 关于登录页面卡顿的反馈  │ │  body text-primary
│  │  caption 2025-09-15 14:23       │ │  caption tnum text-tertiary
│  │                                │ │
│  │  ┌──────────────────────────┐ │ │ ← 官方回复
│  │  │ 💬 官方回复                  │ │ │  Card.Tool 风格
│  │  │ body: 已修复,感谢反馈        │ │ │  bg mint-50 + mint-700
│  │  │ caption 2025-09-16 10:00  │ │ │  caption tnum
│  │  └──────────────────────────┘ │ │
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 反馈 2(待处理)
│  │ [icon] 产品建议   [orange 待处理]│ │  Tag orange 待处理
│  ├────────────────────────────────┤
│  │  caption: 希望增加课表导出功能   │ │  body text-primary
│  │  caption 2025-09-18 09:15       │ │
│  └────────────────────────────────┘ │
│                                      │ space-3
│  ┌────────────────────────────────┐ │ ← 反馈 3(待处理)
│  │ [icon] 体验问题   [orange 待处理]│ │
│  ├────────────────────────────────┤
│  │  caption: 工具箱加载速度偏慢     │ │
│  │  caption 2025-09-17 16:40       │ │
│  └────────────────────────────────┘ │
│                                      │
│  [加载更多 ↓]                           │  weak button
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 历史入口	text button	text-link primary-500
反馈类型 Segment	Segment 横向	active primary-500
文本编辑器	Input textarea	bg-card, border-default, radius-md 8
字数计数	caption tnum	text-tertiary
联系方式 Input	Input	bg-card, border-default
底部提交	Button primary large	primary-500, shadow-tab
历史列表 Cell	Cell + Tag	bg-card, border-light
「已处理」Tag	Tag mint	mint-50 + mint-700
「待处理」Tag	Tag orange	orange-50 + orange-700
官方回复卡	Card.Tool 风格	bg mint-50, mint-700 文
回复时间	caption tnum	text-tertiary
反馈时间	caption tnum	text-tertiary
加载更多	Button weak	primary-50 + primary-500
交互路径
触发	行为
类型切换	切换选中
提交反馈	Toast success「已提交,我们会尽快处理」
历史入口	跳历史记录页
点击历史项	弹 Popover 显示完整内容 + 官方回复
已处理项点击	跳完整回复
颜色配比自检
颜色(提交页)	占比
bg / 文字	~ 87%
primary(Segment + 链接 + CTA)	~ 11%
mint	0%
orange	0%
颜色(历史页)	占比
bg / 文字	~ 80%
primary(链接 + 加载更多)	~ 10%
mint(已处理 Tag + 官方回复卡)	~ 7%
orange(待处理 Tag)	~ 3%
两页主色 ≤25% ✓ / 薄荷 ≤10% ✓ / 橙 ≤5% ✓

5. 个人资料编辑 <ProfileEdit>
进入路径:个人中心头像 / 「我的资料」入口 页面用途:展示与修改昵称 / 头像 / 邮箱 / QQ / 微信号

布局说明
从上到下 4 个区块:

NavBar + 保存
头像编辑卡(大头像 + 换头像)
资料字段列表(每项一个编辑入口)
底部提示
线框
┌──────────────────────────────────────┐
│  [←]    编辑资料          ✓ 保存      │  NavBar + 保存
├──────────────────────────────────────┤
│                                      │
│  ┌────────────────────────────────┐ │ ← 头像卡
│  │                                │ │  bg bg-card, radius-xl 16
│  │       [头像 80]                │ │  Avatar circle 80
│  │       caption: 点击更换头像      │ │  caption text-link primary-500
│  │                                │ │
│  └────────────────────────────────┘ │  shadow-card
│                                      │ space-6
│  ━━━━━━━━━━━━━━━━━━━                  │  border-light
│                                      │
│  基本信息                              │  H4 text-primary
│  ┌────────────────────────────────┐ │ ← 资料字段 Cell
│  │  昵称                  张三  › │ │  Cell + 右值 + 箭头
│  ├────────────────────────────────┤
│  │  UID           2001004567  │ │  tnum text-tertiary 不可编辑
│  ├────────────────────────────────┤
│  │  学院    计算机科学与技术学院 › │ │
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│  联系方式                              │  H4 text-primary
│  ┌────────────────────────────────┐ │
│  │  邮箱           zhangsan@hainanu.edu ›│ │  tnum
│  ├────────────────────────────────┤
│  │  QQ 号             12345678  › │ │  tnum
│  ├────────────────────────────────┤
│  │  微信号           zhang_wechat › │ │
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ┌────────────────────────────────┐ │ ← 提示卡
│  │  💡 caption: 联系方式可在「隐私设置」│ │  Card.Tool 风格
│  │  caption: 中控制是否对外展示       │ │  bg primary-50
│  │  [前往隐私设置 ›]                │ │  text-link primary-500
│  └────────────────────────────────┘ │
│                                      │
└──────────────────────────────────────┘

   (点击字段后弹编辑弹层)

   ┌────────────────────────────────┐
   │  编辑昵称              [✓ 确定] │  NavBar 简化
   ├────────────────────────────────┤
   │  ┌──────────────────────────┐ │
   │  │  张三                      │ │  Input
   │  └──────────────────────────┘ │
   │  caption: 2 / 20              │  caption tnum
   │                                │
   │       [取消]    [确定]          │  Button secondary + primary
   └────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar 保存	text button	text-link primary-500
头像卡	Card + Avatar 80	bg-card, radius-xl 16, shadow-card
Avatar	Avatar circle 80	primary-50 底
「点击更换头像」	text button	text-link primary-500
分隔线	border-light	neutral-100
分组标题	H4	text-primary
资料字段 Cell	Cell + 右值 + 箭头	bg-card, border-light
字段值	caption tnum	text-secondary
UID(不可编辑)	caption tnum	text-tertiary
提示卡	Card.Tool	bg primary-50
「前往隐私设置」	text button	text-link primary-500
编辑弹层 Input	Input	bg-card, border-default
字数计数	caption tnum	text-tertiary
弹层按钮	Button secondary + primary	border-default / primary-500
交互路径
触发	行为
点击头像	ActionSheet:拍照 / 相册 / 默认头像
点击字段	弹编辑弹层(内嵌 Input)
保存(弹层)	Toast success → 字段值更新
保存(NavBar)	整体提交 → 返回个人中心
「前往隐私设置」	跳隐私设置页(本批 #2)
颜色配比自检
颜色	占比
bg / 文字	~ 85%
primary(链接 + 提示卡底 + CTA + Avatar 底)	~ 13%
mint	0%
orange	0%
主色 13% ✓ / 薄荷 0% ✓ / 橙 0% ✓

6. 设置页 <Settings>
进入路径:个人中心「系统设置」/ NavBar 设置 icon 页面用途:通用设置聚合 + 缓存 / 更新 / 退出

布局说明
从上到下 5 个区块:

NavBar default
通用设置分组(消息通知 / 隐私 / 通用 / 关于)
账号分组(清除缓存 / 检查更新)
退出登录
版本号
线框
┌──────────────────────────────────────┐
│  [←]              设置               │  NavBar default
├──────────────────────────────────────┤
│                                      │
│  ━━━ 通用 ━━━                          │  分组标题
│  ┌────────────────────────────────┐ │  caption text-secondary
│  │  🔔  消息通知             ›    │ │  Cell
│  │  caption: 推送 / 角标设置          │ │  caption text-tertiary
│  ├────────────────────────────────┤
│  │  🔒  隐私设置             ›    │ │
│  │  caption: 隐私模式 / 字段控制     │ │
│  ├────────────────────────────────┤
│  │  ⚙️  通用设置             ›    │ │
│  │  caption: 语言 / 字号 / 主题      │ │
│  ├────────────────────────────────┤
│  │  ℹ️  关于海大工坊          ›    │ │
│  │  caption: 版本说明 / 协议         │ │
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│  ━━━ 账号 ━━━                          │
│  ┌────────────────────────────────┐ │
│  │  🗑  清除缓存        12.3 MB │ │  Cell + 右值 tnum
│  ├────────────────────────────────┤
│  │  🔄  检查更新       [mint 最新]│ │  Tag mint 最新
│  └────────────────────────────────┘ │
│                                      │ space-6
│  ┌────────────────────────────────┐ │ ← 退出登录
│  │  🚪  退出登录                  │ │  Cell 文字 danger
│  └────────────────────────────────┘ │  bg bg-card, radius-lg 12
│                                      │ space-6
│           v 8.2.1                    │  label text-placeholder
│      © 海南大学 · 海大工坊            │  caption text-placeholder
│                                      │
└──────────────────────────────────────┘
组件 & Token 引用
区块	组件	Token
NavBar	NavBar default	bg-card
分组标题	caption	text-secondary
通用 Cell	Cell	bg-card, border-light
Cell 描述	caption	text-tertiary
缓存大小	caption tnum	text-secondary
「最新」Tag	Tag mint	mint-50 + mint-700
退出登录 Cell	Cell 文字	text-primary → danger(整行)
版本号	label	text-placeholder
版权	caption	text-placeholder
交互路径
触发	行为
消息通知 / 隐私 / 通用 / 关于	跳对应详情页
清除缓存	Dialog 二次确认 → Toast success「已清理 12.3 MB」
检查更新	loading → Toast info「已是最新版本」或弹更新 Dialog
退出登录	Dialog danger 二次确认 → 返回启动页
颜色配比自检
颜色	占比
bg / 文字	~ 90%
primary(箭头 + 链接点缀)	~ 7%
mint(最新 Tag)	~ 2%
orange	0%
danger(退出登录)	~ 1%
主色 7% ✓ / 薄荷 2% ✓ / 橙 0% ✓

danger 是功能色,不计入主色配比。

第六批真实页面与组件对照表
页面	区块	组件	Token 引用
认证中心	NavBar	NavBar default	bg-card
状态卡(四态)	Card + icon 64	bg-card, radius-xl 16, shadow-card	
待审核 icon	icon 64	primary-500	
已认证 icon	icon 64	mint-500	
驳回 icon	icon 64	danger	
主标题	H2	text-primary	
副标题	caption	text-tertiary	
表单 Input	Input	bg-card, border-default → primary-500	
Select / Cascader	Select + Cascader	bg-card, border-default	
图片上传	自定义组合	radius-md 8, border-default	
「已认证」Tag	Tag mint	mint-50 + mint-700	
「驳回」Tag	Tag danger	danger-bg + danger	
积分提示	H4	primary-500	
驳回原因卡	Card	bg danger-bg, radius-md 8	
剩余次数	caption tnum	text-secondary	
申请详情链接	text button	text-link primary-500	
底部固定按钮	Button primary / secondary	bg-card, shadow-tab	
重新申请(用尽)	Button primary disabled	neutral-300 + text-disabled	
隐私设置	NavBar	NavBar default	bg-card
总开关卡	Card + Switch	bg-card, radius-lg 12	
总开关 Switch	Switch 选中	primary-500	
字段开关列表	Cell × 6 + Switch	bg-card, border-light	
字段 Switch(选中)	Switch	primary-500	
字段 Switch(未选)	Switch	neutral-300	
预览卡	Card + Avatar	bg-card, radius-lg 12, shadow-card	
Avatar	Avatar circle 48	primary-50 底	
「已认证」Tag	Tag mint	mint-50 + mint-700	
「已隐藏」文字	caption	text-placeholder	
显示值	caption	text-secondary	
消息中心	NavBar 全部已读	text button	text-link
身份过滤 Segment	Segment 横向	active primary-500	
通知卡(未读)	Cell + 红点	bg-card, radius-lg 12	
红点	自定义 8×8	danger	
未读正文	body	text-primary	
已读通知卡	Cell	bg neutral-50	
已读正文	body	text-tertiary	
时间	caption tnum	text-tertiary	
加载更多	Button weak	primary-50 + primary-500	
详情标题区	Card	bg-card, radius-lg 12	
详情主标题	H2	text-primary	
详情正文	body	text-primary	
内嵌图	Image	radius-md 8	
来源信息	Cell	border-light	
相关通知	Cell	border-light	
用户反馈	NavBar 历史入口	text button	text-link
反馈类型 Segment	Segment 横向	active primary-500	
文本编辑器	Input textarea	bg-card, border-default, radius-md 8	
字数计数	caption tnum	text-tertiary	
联系方式 Input	Input	bg-card, border-default	
底部提交	Button primary large	primary-500, shadow-tab	
历史列表 Cell	Cell + Tag	bg-card, border-light	
「已处理」Tag	Tag mint	mint-50 + mint-700	
「待处理」Tag	Tag orange	orange-50 + orange-700	
官方回复卡	Card.Tool	bg mint-50, mint-700 文	
回复时间	caption tnum	text-tertiary	
加载更多	Button weak	primary-50 + primary-500	
个人资料编辑	NavBar 保存	text button	text-link
头像卡	Card + Avatar 80	bg-card, radius-xl 16, shadow-card	
Avatar	Avatar circle 80	primary-50 底	
「点击更换头像」	text button	text-link	
资料字段 Cell	Cell + 右值 + 箭头	bg-card, border-light	
字段值	caption tnum	text-secondary	
UID(不可编辑)	caption tnum	text-tertiary	
提示卡	Card.Tool	bg primary-50	
「前往隐私设置」	text button	text-link	
编辑弹层 Input	Input	bg-card, border-default	
弹层按钮	Button secondary + primary	border-default / primary-500	
设置页	NavBar	NavBar default	bg-card
分组标题	caption	text-secondary	
通用 Cell	Cell	bg-card, border-light	
Cell 描述	caption	text-tertiary	
缓存大小	caption tnum	text-secondary	
「最新」Tag	Tag mint	mint-50 + mint-700	
退出登录 Cell	Cell 文字	text-primary → danger	
版本号	label	text-placeholder	
版权	caption	text-placeholder	
末尾:本批页面层级的交互细节说明(不改动组件库)
#	细节	所属页面	说明
1	四态切换	认证中心	同一页面内根据状态渲染不同卡,组件库不变
2	图片上传 3 宫格	认证中心	自定义组合,radius-md 8 占位,组件库不变
3	剩余次数置灰	认证中心	Button disabled 态,文案切换,组件库不变
4	隐私预览同步	隐私设置	字段 Switch 切换 → 预览区实时刷新,组件库不变
5	未读红点	消息中心	自定义 8×8 danger 圆点,组件库不变
6	已读灰底	消息中心	已读通知用 neutral-50 底 + text-tertiary,组件库不变
7	反馈类型 Tag 五色映射	用户反馈	已处理 mint / 待处理 orange,只复用已有色
8	官方回复卡	用户反馈	Card.Tool 风格,bg mint-50 + mint-700 文,组件库不变
9	字段编辑弹层	个人资料编辑	NavBar + Input + Button 组合,组件库不变
10	退出登录 danger 文字	设置页	Cell 整行文字转 danger,组件库不变
11	版本号 + 版权	设置页	label + caption 居中,组件库不变
海大工坊小程序 · 全部页面地图
以下为六批线框的全部页面清单,按模块分组归档,作为高保真阶段的执行索引。

一、框架页(第一批 · 3 个)
#	页面	关键模块
1	启动页(假期模式)	顶部品牌 + 倒计时 + 主按钮 + 新生入口
2	登录页	UID + 密码 + 第三方登录
3	首页框架(四身份 TabBar)	新生 / 本科生 / 研究生 / 访客
二、新生模块(第二批 · 5 个)
#	页面	关键模块
4	新生专题主页	4 主入口 + 副入口 + 公告
5	报到流程页	6 步竖排步骤条 + 总进度
6	来校路线页	4 校区切换 + 出行方式 + 路线列表
7	找室友 · 发布表单页	表单 + 联动选择器 + Tag 多选 + 图片上传
8	新生 FAQ 搜索列表页	搜索 + 分类 Tab + 手风琴
三、智慧海大 · 信息展示(第二批 · 3 个)
#	页面	关键模块
9	智慧海大主页	8 主入口 + 待办 + 业务 Cell
10	社区主页	搜索 + Banner + 5 版块 + 信息流
11	课表主页(周视图)	周次切换 + 星期 header + 课程格 + FAB
四、智慧海大 · 服务子页(第三批 · 5 个)
#	页面	关键模块
12	海大介绍 · 列表页	5 张图标卡片
13	海大介绍 · 详情页	富文本 / 图片瀑布流 两变体
14	电话簿	搜索 + 4 校区 Tab + 拨号
15	校历	图片模式(缩放/拖动)+ 日历模式(圆点标注)
16	校园地图	底部校区 Tab + 双指缩放 + 建筑气泡
五、智慧海大 · 数据库 / 校园服务(第三批 → 第四批 · 5 个 → 1 个)
#	页面	关键模块
17	校园数据库	5 分类入口 + 列表 + 详情统一模板
18	一卡通页面(第三批复用)	渐变卡 + 5 功能 + 流水
19	空教室查询页(第三批复用)	筛选 + 教室网格 + 节次对照
20	成绩与进度页(第三批复用)	学期选择 + GPA / 学分 + 成绩列表
21	校园出行主页	时刻表 / 车站信息 / 乘车指南 三 Tab
六、社区模块(第四批 · 5 个)
#	页面	关键模块
22	二手集市首页	搜索 + 分类 Tab + 2 列商品流
23	二手集市 · 商品详情页	图片轮播 + 价格 + 卖家 + 底部操作条
24	快讯列表页	类型 Tab + 时间线分组 + 卡片
25	快讯详情页	富文本 + 来源 + 底部操作条
26	校友圈主页(第五批复用)	帖子 / 表白墙双 Tab + PostItem + FAB
七、社区 · 帖子流(第五批 · 3 个)
#	页面	关键模块
27	帖子详情页	完整帖子 + 评论 + 底部操作条
28	发帖 / 发表白墙页	文本编辑器 + 9 宫格图片 + 版块 + Tag
29	课表详情 / 设置页	课程色条 + 周次网格 + 编辑 / 删除 / 导出
八、工具箱(第五批 · 1 个)
#	页面	关键模块
30	工具箱主页	免费 / 积分 / 已解锁三色分区宫格
九、个人中心(第五批 + 第六批 · 7 个)
#	页面	关键模块
31	个人中心主页	渐变用户卡 + 数据统计 + 8 功能 Cell
32	认证中心	四态切换 + 申请表单 + 驳回处理
33	隐私设置	总开关 + 字段开关 + 预览效果
34	个人资料编辑	头像 + 资料字段 + 编辑弹层
35	用户反馈 · 提交页	类型 + 内容 + 联系方式
36	用户反馈 · 历史页	已处理 / 待处理 Tag + 官方回复
37	设置页	通用 / 账号 / 退出登录
十、消息模块(第六批 · 2 个)
#	页面	关键模块
38	消息中心 · 列表页	身份过滤 + 未读红点 + 时间倒序
39	消息中心 · 详情页	标题 + 富文本 + 来源 + 相关通知
全部页面统计
维度	数量
总页面数	39 个
框架页	3
新生模块	5
智慧海大	11(主页 + 服务子页 + 数据库)
社区模块	8(主页 + 二手 + 快讯 + 校友圈 + 帖子)
课表模块	2(周视图 + 课程详情)
工具箱	1
个人中心	7
消息中心	2
全局一致性自检
检查项	状态
所有页面引用 Design Tokens	✓ 无新色值
所有页面引用既有组件库	✓ 无新组件
所有数字 tnum 等宽	✓
主色 ≤25%	✓ 全部页面通过
薄荷绿 ≤10%	✓ 全部页面通过
橙色 ≤5%	✓ 全部页面通过
课程色条三色限定(primary/mint/orange)	✓
Tab 标签五色映射(primary/mint/orange/danger)	✓
6 批线框阶段完成	✓
阶段总结
整个 海大工坊小程序低保真线框阶段 到此完成。

已完成产物:

Design Tokens(色彩 / 字体 / 间距 / 圆角 / 阴影 / 图标)
核心组件库(8 大类,37 个组件)
6 批线框,共 39 个页面,覆盖小程序全部真实页面