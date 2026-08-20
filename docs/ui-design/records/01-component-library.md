全局硬性约定(适用所有组件)
项	取值规则
颜色	只允许引用 Design Tokens,禁止出现新色值
圆角	只用 radius-sm 4 / radius-md 8 / radius-lg 12 / radius-xl 16 / radius-full 五档
字号	只用 display / h1-h4 / body-lg / body / caption / label / button 七个档
间距	只用 4 / 8 / 12 / 16 / 20 / 24 / 32px 六档
阴影	只用 shadow-xs / shadow-sm / shadow-card / shadow-md / shadow-float / shadow-tab 六档
图标	线描 24×24,1.5px 描边,默认色 text-secondary,圆角 round
数字	时间/节次/价格等数字开启 tnum 等宽
一、导航组件
1.1 顶部自定义导航栏 <NavBar>
变体 A · default(白底,通用页)

┌────────────────────────────────────┐
│  ←               海大工坊        ⋯ │  ← 44h 高
└────────────────────────────────────┘
   bg bg-card, 内容居中,文字 text-primary
变体 B · gradient(品牌头 / 运营活动页)

┌────────────────────────────────────┐
│  ←        海南大学 · 海大工坊        │
└────────────────────────────────────┘
   背景 linear-gradient primary-700 → primary-500
   文字 text-on-primary,返回箭头 white
变体 C · underline(浅色下划线,二级页)

┌────────────────────────────────────┐
│  ←  通知中心                    ⋯  │
│ ─────────────────────────────────── │  ← border-light 1px
└────────────────────────────────────┘
   bg bg-card
属性表

属性	类型	默认
title	string	—
variant	default | gradient | underline	default
showBack	boolean	true
transparent	boolean	false(透明时占位仍是内容区高度)
rightIcon / rightSlot	string / slot	—
bgColor	token	bg-card
titleColor	token	text-primary / text-on-primary(gradient)
规格

状态栏 44px(微信小程序原生) + 标题栏 44px = 总高 88px
字号:h4(16/24/600)
返回箭头:24×24,linear,text-secondary / text-on-primary
右侧图标:可选 24×24
1.2 底部 TabBar <TabBar>
┌────────────────────────────────────┐
│      │       │       │             │
│   ▢  │   ▢   │  ▢   │   ▢         │  图标 24×24
│      │       │       │             │
│   首页│  社区 │  课表 │   我的       │  caption(12/18)
└────────────────────────────────────┘
   ↑ shadow-tab 顶部细影
   ↑ 底部 padding-bottom: env(safe-area-inset-bottom)
属性

属性	类型
tabs	TabItem[](icon, iconActive, label, badge?)
activeIndex	number
视觉规则

状态	图标色	文字色
选中	primary-500(实心)	primary-500
未选中	neutral-500(线性)	neutral-500
规格

总高 56(Tab)+ 34(安全区) = 90px
四 Tab 等分,无横向间距
Badge 红色圆点 8×8,右上偏移 -4,-2
二、按钮 <Button>
类型 5 变体
变体	默认	按下	禁用
primary 主按钮	bg primary-500, text white	bg primary-700	bg neutral-300, text neutral-500
secondary 次按钮	bg bg-card, text primary-500, border-default 1px	bg primary-50, border-default	border-light, text text-disabled
weak 弱按钮	bg primary-50, text primary-500	bg primary-100	bg neutral-100, text text-disabled
danger 危险按钮	bg danger, text white	bg #C72626	bg neutral-300
text 文字按钮	bg transparent, text primary-500	text primary-700	text text-disabled
尺寸 3 档
尺寸	高度	水平 padding	字号
large	48px	24px	button(16/24/500)
default	40px	20px	button(16/24/500)
small	32px	12px	h4(16/24/600)
圆角统一 radius-md 8px。

状态机
状态	描述
default	默认
pressed	按下(透明度 + 背景色加深,过渡 150ms)
disabled	不可点击(透明度自动应用或调中性色)
loading	主区转 16px spinner,文字保留,不可重复点击
属性表
属性	类型	默认
variant	primary | secondary | weak | danger | text	primary
size	large | default | small	default
block	boolean	false
loading	boolean	false
disabled	boolean	false
icon	string(图标名)	—
iconPosition	left | right	left
onClick	function	—
原型(主按钮 large)

┌──────────────────────────────┐
│        立 即 登 录            │   48h
└──────────────────────────────┘
   bg primary-500 → 按下 primary-700
   文字 white,字号 button
   圆角 radius-md 8
三、卡片 <Card>
3.1 标准信息卡片 <Card.Standard>
┌──────────────────────────────┐
│  标题 H3(18/26/600)              │
│                              │   padding 16
│  描述 caption(14/22/400)       │
│  caption(多行...)              │
│                         ›    │
└──────────────────────────────┘
   bg bg-card, radius-lg 12, shadow-card
属性	类型
title, desc	string
arrow	boolean
onClick	func
padding	default | compact(12px)
3.2 图标入口卡片 <Card.Grid>
   边距 12px  ← 两两相邻卡片
┌────────────┬────────────┐
│   📚        │   🏠        │
│  primary-50 │  primary-50 │   48×48 圆角容器
└────────────┴────────────┘
│  新生攻略   │   生活服务   │   caption 12
└────────────┴────────────┘
   单卡 bg bg-card, radius-lg 12
   图标 24×24 居中,色 primary-500
属性	类型
icon, label	string
badge	BadgeItem
column	4(默认) | 5
onClick	func
3.3 工具卡片 <Card.Tool>
┌──────────────────────────────┐
│ ▣ [橙底]   校园 GPA 计算器  › │
│            实用工具日常必备     │   caption
└──────────────────────────────┘
   图标容器:bg orange-50,圆角 radius-md,内图 orange-500
   卡片:bg bg-card, radius-lg 12, shadow-card
   标签:主标题 H3(18/26/600),副标题 caption text-tertiary
属性	类型
icon, title, desc	string
accent	orange | mint | primary(默认 orange)
onClick	func
3.4 图片卡片 <Card.Image>
┌────────────────────────────┐
│ ┌─────────────────────────┐ │
│ │       16:9 图片           │ │   radius-md 8
│ │   [Tag 二手] 右上         │ │
│ └─────────────────────────┘ │
│ 标题 H4(16/24/600)              │   text-primary
│ caption 14/22 text-tertiary  │
└────────────────────────────┘
   外卡 radius-xl 16, shadow-card
   价格(可选):primary-500,字号 h4
属性	类型
image, title, desc, price	string / number
tags	TagItem[]
onClick	func
四、表单组件
4.1 输入框 <Input>
默认态

    标题 h4(16/24/600) [可选]
    ┌────────────────────────────────┐
    │  占位 text-placeholder             │
    └────────────────────────────────┘
聚焦态(边框转 primary-500,2px,内边距相应减少 1px 避免跳动) 错误态(边框转 danger,2px,底部 ⚠ + helper 文)

    ⚠ 学号格式错误     danger-caption
属性	类型	默认
label, placeholder	string	—
required	boolean	false
error	boolean | string	false
helper	string	—
maxLength	number	—
clearable	boolean	true
type	text/number/idcard/phone/password	text
disabled	boolean	false
规格

整组块高度:label 24 + gap 8 + input 48 = 80px
输入框:48px 高, bg bg-card, border-default 1px
padding:水平 16,垂直 12
字号:body(14/22),占位 text-placeholder
圆角:radius-md 8
4.2 搜索框 <Search>
┌──────────────────────────────────┐
│  🔍   搜索课表 / 同学 / 服务        │
└──────────────────────────────────┘
   高度 40,圆角 radius-full(默认) | radius-md(可选 square)
   bg neutral-100,无边框
   聚焦:bg bg-card, border primary-500 1.5px
   字号 body,占位 text-placeholder
   右侧可显清除按钮 (×) 16×16 text-tertiary
属性	类型	默认
placeholder	string	—
shape	round | square	round
readonly	boolean	false
showAction	boolean	false(显示右侧「取消」文字按钮)
onSearch / onChange / onClear	func	—
4.3 下拉选择器 <Select>
┌──────────────────────────────┐
│  选择校区                    ▼ │   48h
└──────────────────────────────┘
   bg bg-card, border-default 1px, radius-md 8
   字号 body,文字 text-primary,箭头 16 primary-500
   触发后从底部弹出 ActionSheet(见反馈组件)
属性	类型
label, placeholder	string
options	{label,value}[]
value	string
disabled	boolean
4.4 联动选择器 <Cascader>
典型场景:年级 → 学院 → 专业 / 校区 → 楼栋 → 楼层

┌──────────────────────────────────┐
│  [一年级] [计算机] [软件工程]     │  ← 横向 Tab
├──────────────────────────────────┤
│                                  │
│   ● 软件工程           ✓        │   primary-50 底,primary-500 文
│   ○ 人工智能                     │   整行 48h
│   ○ 大数据                       │
│   ○ 网络空间安全                  │
│                                  │
├──────────────────────────────────┤
│         [        确 认        ]   │  主按钮 large,宽度 100%
└──────────────────────────────────┘
属性	类型
steps	string[] 步骤标题
options	三层数据
value	[step1, step2, step3]
confirmText	string
规格

容器:全屏 sheet,顶部圆角 radius-xl 16
横向 Tab:44h,选中下划线 3px primary-500
选中行:bg primary-50,文字 primary-500
未选中行:bg bg-card,文字 text-primary
底部 CTA:固定,主按钮 large
五、列表组件
5.1 设置项列表 <Cell>
Switch 形态

┌────────────────────────────────────┐
│ 🔔 消息通知           [●○]         │   56h
└────────────────────────────────────┘
箭头形态

┌────────────────────────────────────┐
│ 🔒 账号安全           [3]   ›     │
└────────────────────────────────────┘
纯文本形态

┌────────────────────────────────────┐
│ 清除缓存    12.3MB   ›             │
└────────────────────────────────────┘
   bg bg-card,分割线 border-light 1px
   图标 24×24 text-secondary
   标题 body(14/22/400) text-primary
   右侧 Switch / Badge / Arrow / 辅助文本
属性	类型
icon, title, desc, rightText	string
showArrow	boolean
showSwitch	boolean
switchChecked / switchDisabled	boolean
badge	string | number
onClick / onSwitch	func
5.2 消息/通知列表 <MessageItem>
┌──────────────────────────────────┐
│ [头像 40] 系统通知    2分钟前     │
│              明天 8:00 有高等数学   │   caption 14/22
│                                 │
│ ●(未读小圆点 primary-500)        │
└──────────────────────────────────┘
   头像 40×40 radius-full
   标题 h4,描述 caption,时间 caption text-tertiary
   未读小圆点 8×8 primary-500,左侧边距
5.3 评论区/帖子列表 <PostItem>
┌──────────────────────────────────────┐
│ [头像] @张三 · 5分钟前    [#新生]  │
│        内容正文...body 14/22       │
│        ┌────────────────┐         │
│        │   4:3 图片        │         │
│        └────────────────┘         │
│        💬 12   👍 34   ⭐ 收藏     │
└──────────────────────────────────────┘
   头像 40×40,Tag 可选 primary/mint/orange
   互动图标 16,数字 caption,色 text-tertiary
属性	类型
avatar, name, time, content	string
images	string[]
tags	TagItem[]
stats	{comment, like, star}
六、反馈组件
6.1 Toast
            ┌──────────────────┐
            │   ✓  操作成功      │
            └──────────────────┘
              bg rgba(0,0,0,0.78)
              文字 white caption
              图标 16 white
              radius-md 8
              padding 12/16
              距屏幕顶部 1/3 位置
变体	图标 / 背景
success	✓ white / 暗底
warning	⚠ white / 暗底
danger	✕ white / 暗底
info	ℹ white / 暗底
loading	spinner / 暗底
规格:居中浮起 1/3,自动消失 2000ms(可调),字号 caption

6.2 Loading
        全屏遮罩 bg-mask
        ┌──────────────────┐
        │      ⏳           │   spinner 三色环
        │   加载中...         │   caption text-secondary
        └──────────────────┘
          bg bg-card
          radius-md 12
          padding 20 / 24
spinner:24×24,主色环 primary → mint → orange 渐变描边,800ms 一圈

6.3 空状态 Empty
┌──────────────────────────────────┐
│                                  │
│       📭  (灰色插画 80×80)        │
│                                  │
│       暂无消息                   │   h3 text-secondary
│       去发起第一条消息吧           │   caption text-tertiary
│                                  │
│       [   立即发起   ]            │   weak button
└──────────────────────────────────┘
   插画:text-tertiary 单色
   按钮:weak,可省略
6.4 骨架屏 Skeleton
┌──────────────────────────────────┐
│ ████ ███                          │   块 radius-sm 4
│ ████████████                     │   bg neutral-200
│ ███████ ██████                   │   动画:渐变 shine
└──────────────────────────────────┘
   块高模拟文字 16/14/12
   颜色:neutral-200 + neutral-100 来回渐变 1200ms
6.5 Dialog 弹窗
        全屏 bg-mask
        ┌────────────────────────┐
        │                        │
        │      标题              │   h2(22/30/600)
        │                        │
        │  描述说明文字...        │   body text-secondary
        │                        │
        │ [取消]   [确认]        │   text + primary
        └────────────────────────┘
          bg bg-card, radius-xl 16
          宽 280,center, shadow-float
属性	类型
title, desc	string
variant	default | danger
confirmText, cancelText	string
onConfirm, onCancel	func
confirmDisabled	boolean
6.6 底部操作菜单 <ActionSheet>
┌────────────────────────────────────┐
│        标题(可选)                  │   caption text-tertiary
│                                    │
├────────────────────────────────────┤
│        操作 1                       │   body 16 text-primary  56h
├────────────────────────────────────┤
│        操作 2                       │
├────────────────────────────────────┤
│        取消                         │   danger
└────────────────────────────────────┘         ↑ radius-top 16
   bg bg-card
   底部安全区 env(safe-area-inset-bottom)
6.7 轻弹层 Popover
触发元素相对弹出的小气泡
bg bg-card, radius-lg 12, shadow-float
三角箭头 8×8,指向触发元素
用于「更多」按钮等
七、信息展示
7.1 Tag 标签 <Tag>
变体	背景	文字
primary	primary-50	primary-500
mint	mint-50	mint-700
orange	orange-50	orange-700
success	success-bg	success
warning	warning-bg	warning
danger	danger-bg	danger
   [新功能]    ← height 22, padding 0 8, radius-sm 4
                字号 label(11/16/500)
属性	类型	默认
type	6 变体	primary
size	default | small(20h)	default
closable	boolean	false
7.2 Badge 徽章 <Badge>
数字角标

   ┌─┐
   │12│   ← 圆角 radius-full,min-width 16,height 16
   └─┘    bg danger,文字 white label
红点

   •    ← 8×8 bg danger,圆点
属性	类型
count	number,>99 显示 99+
dot	boolean
max	number(默认 99)
7.3 头像 <Avatar>
尺寸	24 / 32 / 40 / 48 / 64 / 80
| 形状 | circle(默认,radius-full) | square(radius-md 8) |

| 来源 | src | text | icon |

┌──────────────┐
│   头像       │
│              │
│       ↘ V    │   ← 认证角标 bg mint-500
└──────────────┘
属性	类型
src / text / icon	string
size	6 档
shape	circle | square
verified	boolean
7.4 进度条 <Progress>
   ████████████░░░░░░░░░░░░     ← height 8,radius-full
   bg neutral-200                fg primary-500
属性	类型
percent	0-100
type	line(默认) | step(分段)
color	primary(默认) | mint | orange
八、布局组件
8.1 页面顶部标题区 <PageHeader>
┌──────────────────────────────────┐
│                                  │
│  [主图标 32×32 primary-50 底]      │
│                                  │
│  智慧海大                        │   display(28/36/600) text-primary
│  为你的校园生活加速               │   caption text-tertiary
│                                  │
└──────────────────────────────────┘
   padding:24 top / 32 bottom
   可选右下角[快捷操作]虚位
8.2 分类横向 Tab <Segment>
┌──────────────────────────────────┐
│ [全部●] [公告] [活动] [失物]     │   ← 横向滚动
└──────────────────────────────────┘
   高度 44,选中字号 h4 text-primary
   指示器 24×3,radius-sm,primary-500
   底部分割线 border-light
属性	类型
tabs	{label,value}[]
activeIndex	number
onChange	func
8.3 校区选择卡 <CampusCard>
(四个校区使用同一张卡片,统一规格)

┌──────────────────────────────────┐
│  🏛  椰风海韵 · 城西校区         │   顶行 H3 18/26/600
│      主校区,教学核心              │   caption 14/22 text-tertiary
│                              ✓  │   选中图标 primary-500 20×20
└──────────────────────────────────┘
   bg bg-card, radius-lg 12, shadow-card
   padding 16
   选中态:border primary-500 2px,左上角「已选」Tag primary
   未选中:border border-default 1px
属性	类型
campus	string(校区名)
desc	string
selected	boolean
onClick	func
8.4 课时卡片 <CourseCard>
(课表模块专用)

┌────────────────────────────────────┐
│▌ 高等数学                          │   ← 左侧 4px 色条,primary-500
│▌                                  │
│▌ 教师:李教授 · 教务楼 301        │   caption text-tertiary
│▌                                  │
│▌ ┌────┬────┬────┬────┬────┐      │   ← 周次滑动条 44h
│▌ │周一 │周二 │●周● │周四 │周五 │      │   选中 primary-50 背景
│▌ └────┴────┴────┴────┴────┘      │
│▌                                  │
│▌ 第 1-2 节 · 8:00 - 9:40         │   数字开启 tnum 等宽
└────────────────────────────────────┘
   bg bg-card, radius-lg 12, shadow-card
   padding:左 20(给色条), 上下右各 16
   课程类型色条:
     必修 → primary-500
     选修 → mint-500
     实验/实践 → orange-500
   周次选中块:bg primary-50,文字 primary-500 h4
属性	类型
title, teacher, location	string
weeks	string[]
activeWeek	number
period, time	string
type	required(主) | elective(薄荷) | lab(橙)
onClick	func
九、组件库速查表
组件	关键 Token 引用	典型场景
NavBar default	bg-card, text-primary	通用页
NavBar gradient	primary-500→primary-700, text-on-primary	品牌页/活动页
NavBar underline	bg-card, border-light	文档型页
TabBar	icon 24, caption 12, active primary-500	全站主框架
Button primary	primary-500 → primary-700, radius-md 8	关键操作
Button secondary	border-default + text primary-500	次要操作
Button weak	primary-50 + text primary-500	提示性操作
Button danger	danger	退出/删除
Button text	transparent + text primary-500	行内辅助
Card.Standard	bg-card, radius-lg 12, shadow-card	信息流
Card.Grid	primary-50 图标底, radius-lg 12	入口矩阵
Card.Tool	orange-50 装饰, radius-lg 12	工具箱
Card.Image	radius-md(内图 8) + radius-xl 16(外卡)	集市/室友
Input	border-default → primary-500 → danger, radius-md 8	表单
Search	neutral-100 bg, radius-full	搜索
Select	bg-card, border-default, radius-md 8	表单选择
Cascader	横向 Tab + 列表 + 主按钮	多级表单
Cell	bg-card + border-light 分隔	设置页
MessageItem	头像 40 + caption text-tertiary	通知
PostItem	头像 + 互动图标 16	社区/动态
Toast	rgba 黑底 + white 字, radius-md 8	全站
Loading	bg-mask + bg-card 居中	全站
Empty	中性插画 + h3 + weak button	空状态
Skeleton	neutral-200 ↔ neutral-100, radius-sm 4	加载
Dialog	bg-card + radius-xl 16 + shadow-float	重要确认
ActionSheet	bg-card + radius-top 16	操作菜单
Popover	bg-card + radius-lg 12 + shadow-float	轻弹层
Tag(6 色)	浅底 + 深文	标签
Badge	danger 红 + radius-full	数字提示
Avatar	6 尺寸 + circle/square	用户展示
Progress	neutral-200 bg + primary 进度	进度反馈
PageHeader	display 标题 + caption 副	模块页
Segment	横向 Tab + 24×3 指示器 primary-500	分类切换
CampusCard	bg-card + primary 边框, radius-lg 12	校区选择
CourseCard	radius-lg 12 + 4px 色条 + tnum 数字	课表
十、三条最高优先级约束(后续所有生成必须遵守)
颜色、字号、圆角、间距、阴影全部 Token 化 —— 任何页面、组件、文案里出现新的数值,先回查这张表。
主色面积不超过页面 25% —— 蓝用来点睛,不刷墙;薄荷绿 ≤ 10%、橙色 ≤ 5%。
跨端一致 —— 小程序 + Web 共用本组件库,只要写明引用哪个 Token,不需要重画。