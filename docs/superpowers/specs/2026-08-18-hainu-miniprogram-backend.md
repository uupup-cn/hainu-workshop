# 海大工坊 · 微信小程序 — 后端设计文档

> 版本：v1.14
> 日期：2026-08-19
> 状态：初稿

---

## 1. 技术选型

| 项 | 选型 |
|:--|:-----|
| 运行时 | Node.js |
| 框架 | Express.js / Koa.js |
| 语言 | TypeScript |
| 数据库 | MySQL 8.0 |
| ORM | Prisma / TypeORM |
| 文件存储 | 本地文件系统 |
| 认证 | JWT（后台管理登录） |
| 部署环境 | Linux 服务器 |

---

## 2. 数据库设计

### 2.1 内容管理相关表

**guide_entries** — 入学指南条目

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| entry_key | VARCHAR(50) UNIQUE | 条目标识 |
| entry_title | VARCHAR(100) | 条目标题 |
| content | TEXT | 条目内容 |
| summary | VARCHAR(200) | 一句话简介（列表卡片展示） |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**life_topics** — 生活攻略主题

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus | ENUM | 校区 |
| topic_key | VARCHAR(50) | 主题标识 |
| topic_title | VARCHAR(100) | 主题标题 |
| content | TEXT | 主题内容 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**faq_categories** — FAQ 分类

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_name | VARCHAR(50) | 分类名称 |
| sort_order | INT | 排序 |
| created_at | DATETIME | 创建时间 |

**faq_questions** — FAQ 问题

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_id | INT FK | 关联分类 |
| question | VARCHAR(200) | 问题 |
| answer | TEXT | 答案 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**intro_entries** — 海大介绍条目

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| entry_key | VARCHAR(50) UNIQUE | 条目标识 |
| entry_title | VARCHAR(100) | 条目标题 |
| content | TEXT | 条目内容 |
| images | JSON | 关联图片列表 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**phonebook_categories** — 电话簿分类

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus_id | INT FK | 关联校区（由校区管理驱动） |
| category_name | VARCHAR(50) | 分类名称 |
| sort_order | INT | 排序 |
| created_at | DATETIME | 创建时间 |

**phonebook_entries** — 电话簿条目

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_id | INT FK | 关联电话簿分类 |
| department_name | VARCHAR(100) | 部门名称 |
| phone_number | VARCHAR(50) | 电话号码 |
| description | VARCHAR(200) | 备注说明 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**calendar_settings** — 校历设置

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| view_mode | ENUM | 展示模式(image/calendar) |
| image_url | VARCHAR(500) | 校历图片URL |
| calendar_data | JSON | 日历数据 |
| updated_at | DATETIME | 更新时间 |

**map_settings** — 校园地图设置

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus | ENUM | 校区 |
| map_image_url | VARCHAR(500) | 地图图片URL |
| updated_at | DATETIME | 更新时间 |

**map_markers** — 地图建筑标注

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| map_id | INT FK | 关联地图 |
| building_name | VARCHAR(100) | 建筑名称 |
| description | TEXT | 建筑简介 |
| position_x | DECIMAL(5,3) | X坐标百分比 |
| position_y | DECIMAL(5,3) | Y坐标百分比 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**bus_schedules** — 校车时刻表

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| line_name | VARCHAR(100) | 线路名称 |
| departure_time | VARCHAR(20) | 发车时间 |
| departure_place | VARCHAR(100) | 发车地点 |
| destination | VARCHAR(100) | 目的地 |
| notes | VARCHAR(200) | 备注 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**bus_stations** — 车站信息

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| station_name | VARCHAR(100) | 站名 |
| location_desc | VARCHAR(200) | 位置描述 |
| lines | VARCHAR(200) | 经过线路 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**bus_guide** — 乘车指南

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| content | TEXT | 指南内容 |
| updated_at | DATETIME | 更新时间 |

### 2.2 社区相关表

**marketplace_items** — 二手集市商品

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| title | VARCHAR(100) | 商品标题 |
| description | TEXT | 商品描述 |
| price | DECIMAL(10,2) | 价格 |
| images | JSON | 图片URL列表 |
| contact | VARCHAR(100) | 联系方式 |
| category_id | INT FK | 关联商品分类 |
| status | ENUM | 状态(active/auto_off/sold/removed) |
| published_at | DATETIME | 上架时间 |
| auto_off_at | DATETIME | 自动下架时间 |
| expire_at | DATETIME | 过期时间 |
| user_id | INT FK | 发布用户 |
| view_count | INT | 浏览量（默认0，用于智能排序） |
| user_identity | ENUM | 发布者身份(undergrad/grad) |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**marketplace_categories** — 商品分类

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_name | VARCHAR(50) | 分类名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**reports** — 通用举报表（商品/帖子/表白墙/评论）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| target_type | ENUM | 举报对象类型(item/post/confession/comment) |
| target_id | INT | 被举报对象ID |
| reporter_user_id | INT FK | 举报用户 |
| reason | VARCHAR(100) | 举报理由（垃圾广告/人身攻击/色情低俗/虚假信息/其他） |
| detail | TEXT | 补充说明 |
| status | ENUM | 状态(pending/handled/ignored) |
| handle_result | VARCHAR(200) | 处理结果（下架/删除/忽略 + 备注） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**news** — 快讯

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| title | VARCHAR(200) | 标题 |
| content | TEXT | 内容（富文本） |
| target | ENUM | 发布类型(all_student/freshman/undergrad/grad) |
| status | ENUM | 状态(draft/published/archived) |
| is_pinned | TINYINT(1) | 是否置顶 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| published_at | DATETIME | 发布时间 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**alumni_sections** — 校友圈版块

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| section_name | VARCHAR(50) | 版块名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**alumni_posts** — 校友圈帖子/表白墙

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| type | ENUM | 类型(post/confession) |
| section_id | INT FK NULL | 版块ID（帖子必填，表白墙为空） |
| user_id | INT FK | 发布用户 |
| title | VARCHAR(200) NULL | 标题（帖子必填，表白墙为空） |
| content | TEXT | 描述内容 |
| images | JSON | 图片列表（表白墙用，最多 9 张，九宫格展示） |
| is_anonymous | TINYINT(1) | 是否匿名（表白墙可用） |
| is_pinned | TINYINT(1) | 是否置顶（后台操作） |
| like_count | INT | 点赞数（默认0） |
| comment_count | INT | 评论数（默认0） |
| last_comment_at | DATETIME | 最后评论时间（用于排序） |
| is_active | TINYINT(1) | 是否显示 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**alumni_comments** — 校友圈评论

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| post_id | INT FK | 关联帖子/表白墙 |
| user_id | INT FK | 评论用户 |
| content | TEXT | 评论内容 |
| parent_id | INT FK NULL | 父评论ID（楼中楼回复，顶级评论为空） |
| is_anonymous | TINYINT(1) | 是否匿名 |
| created_at | DATETIME | 创建时间 |

**alumni_likes** — 校友圈点赞

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| post_id | INT FK | 关联帖子/表白墙 |
| user_id | INT FK | 点赞用户 |
| created_at | DATETIME | 创建时间 |

**community_modules** — 社区模块功能启停

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| module_key | VARCHAR(50) UNIQUE | 模块标识 |
| module_name | VARCHAR(100) | 模块名称 |
| is_enabled | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2.3 课表相关表

**courses** — 课程

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| course_name | VARCHAR(100) | 课程名称 |
| teacher | VARCHAR(50) | 授课教师 |
| location | VARCHAR(100) | 上课地点 |
| weeks | VARCHAR(50) | 上课周次 |
| day_of_week | TINYINT | 星期(1-7) |
| start_section | TINYINT | 开始节次 |
| end_section | TINYINT | 结束节次 |
| color_id | INT FK | 关联课程颜色 |
| user_id | INT FK UNIQUE | 所属用户（每人仅1条） |
| user_identity | ENUM | 用户身份(undergrad/grad) |
| source | ENUM | 来源(diy/import/replicate) |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**course_colors** — 课程颜色库

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| color_name | VARCHAR(50) | 颜色名称 |
| color_value | VARCHAR(20) | 颜色值（如 #FF6B6B） |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**semesters** — 学期管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| semester_name | VARCHAR(50) | 学期名称（如 2026-2027-1） |
| start_date | DATE | 开始日期 |
| end_date | DATE | 结束日期 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**term_weeks** — 学期周制

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| semester_id | INT FK | 关联学期 |
| week_number | TINYINT | 周次编号 |
| start_date | DATE | 该周开始日期 |
| end_date | DATE | 该周结束日期 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**sections** — 节次管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| section_number | TINYINT | 节次编号 |
| start_time | VARCHAR(10) | 开始时间（如 08:00） |
| end_time | VARCHAR(10) | 结束时间 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**share_codes** — 课表分享码

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| share_code | VARCHAR(20) UNIQUE | 分享码 |
| owner_user_id | INT FK | 分享者用户 |
| owner_identity | ENUM | 分享者身份(undergrad/grad) |
| snapshot | JSON | 课表快照数据（生成时拍取） |
| expire_at | DATETIME | 过期时间（生成后15天） |
| status | ENUM | 状态(active/disabled) |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2.3b 工具相关表

**tool_categories** — 工具分类

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_name | VARCHAR(50) | 分类名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**tools** — 工具列表

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| category_id | INT FK | 关联分类 |
| tool_name | VARCHAR(50) | 工具名称 |
| tool_key | VARCHAR(50) UNIQUE | 工具标识 |
| description | VARCHAR(200) | 工具描述 |
| icon | VARCHAR(500) | 工具图标 |
| points_enabled | TINYINT(1) | 是否开启积分消耗（默认0） |
| points_cost | INT | 积分消耗数（默认0） |
| points_mode | ENUM(per_use, one_time) | 积分消耗模式（默认 per_use） |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**tool_usage_log** — 工具使用记录

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| tool_id | INT FK | 关联工具 |
| user_id | INT FK | 使用用户 |
| points_consumed | INT | 消耗积分（默认0） |
| result_data | JSON | 结果数据（测试结果/成绩等） |
| is_shared | TINYINT(1) | 是否分享 |
| share_type | ENUM(link, poster, none) | 分享类型 |
| created_at | DATETIME | 创建时间 |

**tool_unlocks** — 工具解锁记录（一次性消耗模式）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| tool_id | INT FK | 关联工具 |
| user_id | INT FK | 解锁用户 |
| points_consumed | INT | 消耗的积分数 |
| created_at | DATETIME | 解锁时间 |

> UNIQUE(tool_id, user_id) - 每个用户每个工具仅解锁一次

**video_parse_lines** — 影视解析线路配置

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| line_name | VARCHAR(50) | 线路名称 |
| api_url | VARCHAR(500) | API 接口地址 |
| api_key | VARCHAR(200) | API 密钥（可空） |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2.4 找室友相关表

**roommate_settings** — 找室友功能配置

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| is_enabled | TINYINT(1) | 是否启用 |
| start_date | DATE | 功能开放开始日期 |
| end_date | DATE | 功能开放结束日期 |
| max_modify_count | INT | 信息修改次数上限（默认3） |
| updated_at | DATETIME | 更新时间 |

**campuses** — 校区（智慧校园数据）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus_name | VARCHAR(50) | 校区名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**colleges** — 书院（智慧校园数据）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus_id | INT FK | 关联校区 |
| college_name | VARCHAR(100) | 书院名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**departments** — 学院（智慧校园数据）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| campus_id | INT FK | 关联校区 |
| department_name | VARCHAR(100) | 学院名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**majors** — 专业（智慧校园数据）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| department_id | INT FK | 关联学院 |
| major_name | VARCHAR(100) | 专业名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**buildings** — 楼栋号（智慧校园数据）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| college_id | INT FK | 关联书院 |
| building_name | VARCHAR(100) | 楼栋名称/编号 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**roommate_posts** — 找室友发布信息

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| name | VARCHAR(50) | 姓名 |
| contact | VARCHAR(100) | QQ/微信号 |
| campus_id | INT FK | 校区 |
| college_id | INT FK | 书院 |
| department_id | INT FK | 学院 |
| major_id | INT FK | 专业 |
| building_id | INT FK | 楼栋号 |
| room_number | VARCHAR(50) | 寝室号 |
| user_id | INT FK | 所属用户 |
| is_active | TINYINT(1) | 是否显示 |
| modify_count | INT | 已修改次数（默认0，上限取 roommate_settings.max_modify_count） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

### 2.5 系统管理相关表

**system_settings** — 系统设置

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| setting_key | VARCHAR(50) UNIQUE | 设置键 |
| setting_value | VARCHAR(500) | 设置值 |
| updated_at | DATETIME | 更新时间 |

预定义设置键：campus_mode, holiday_type, semester_start, payment_miniprogram_path, payment_description, customer_service_contact, theme_color, launch_bg_image, about_us, app_version

**users** — 小程序用户

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| openid | VARCHAR(100) UNIQUE | 微信 openid（一个微信对应一个 UID，注册时获取） |
| uid | VARCHAR(20) UNIQUE | 身份码，注册时随机生成 6 位数字，与已生成 UID 记录去重 |
| nickname | VARCHAR(50) | 昵称 |
| avatar | VARCHAR(500) | 头像URL |
| email | VARCHAR(100) | 邮箱（可空） |
| qq | VARCHAR(50) | QQ号（可空） |
| wechat | VARCHAR(50) | 微信号（可空） |
| password_hash | VARCHAR(255) | 密码哈希（注册时随机生成默认密码） |
| identity | ENUM | 身份(freshman/undergrad/grad) |
| points_enabled | TINYINT(1) | 积分状态是否开启（默认0，认证通过后开启） |
| points | INT | 积分值（默认0） |
| auth_status | ENUM | 认证状态(unverified/pending/verified) |
| privacy_enabled | TINYINT(1) | 隐私模式开关（默认0） |
| last_identity_change | DATETIME | 最后一次身份修改时间（用于24小时冷却期判断） |
| privacy_fields | JSON | 对外展示字段开关配置 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**auth_applications** — 认证申请

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 关联用户 |
| real_name | VARCHAR(50) | 姓名 |
| student_no | VARCHAR(50) | 学号 |
| major | VARCHAR(100) | 专业 |
| proof_image | VARCHAR(500) | 证明图片URL（一卡通/数字认证截图） |
| status | ENUM | 状态(pending/approved/rejected) |
| review_remark | VARCHAR(200) | 审核备注 |
| reviewed_at | DATETIME | 审核时间 |
| reject_count | INT | 驳回次数（默认0，上限3次） |
| created_at | DATETIME | 创建时间 |

**admin_users** — 后台管理用户（替代 admins 表）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| username | VARCHAR(50) UNIQUE | 用户名 |
| password_hash | VARCHAR(255) | 密码哈希 |
| nickname | VARCHAR(50) | 昵称 |
| role_id | INT FK | 关联角色 |
| status | ENUM | 状态(active/disabled) |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**roles** — 角色

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| role_name | VARCHAR(50) | 角色名称 |
| role_key | VARCHAR(50) | 角色标识 |
| description | VARCHAR(200) | 描述 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**permissions** — 功能/权限

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| perm_name | VARCHAR(50) | 功能名称 |
| perm_key | VARCHAR(50) | 功能标识 |
| parent_id | INT | 父级功能ID（支持三级分类树） |
| sort_order | INT | 排序 |
| created_at | DATETIME | 创建时间 |

**dicts** — 字典管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| dict_type | VARCHAR(50) | 字典类型 |
| dict_label | VARCHAR(50) | 字典标签 |
| dict_value | VARCHAR(50) | 字典值 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**notification_types** — 通知类型

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| type_name | VARCHAR(50) | 类型名称 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |

**notifications** — 通知列表

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| type_id | INT FK | 关联通知类型 |
| title | VARCHAR(200) | 通知标题 |
| content | TEXT | 通知内容 |
| target | ENUM | 推送对象(all/undergrad/grad/freshman) |
| publish_time | DATETIME | 发布时间 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**uid_log** — 已生成 UID 记录

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| uid | VARCHAR(20) UNIQUE | 已生成的 UID |
| user_id | INT FK | 关联用户 |
| created_at | DATETIME | 生成时间 |

**points_log** — 积分变动记录

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 关联用户 |
| points | INT | 变动积分（正数获取/负数消耗） |
| reason | VARCHAR(50) | 变动原因（签到/发布商品/认证通过/手动调整） |
| created_at | DATETIME | 创建时间 |

**notification_reads** — 通知已读记录

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 关联用户 |
| notification_id | INT FK | 关联通知 |
| read_at | DATETIME | 已读时间 |

### 2.6 日志与监控相关表

**user_feedback** — 用户反馈

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 关联用户 |
| content | TEXT | 反馈内容 |
| contact | VARCHAR(100) | 联系方式 |
| status | ENUM | 状态(pending/processed) |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

**system_logs** — 系统日志

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| level | ENUM | 级别(info/warn/error) |
| module | VARCHAR(50) | 模块 |
| message | TEXT | 日志内容 |
| created_at | DATETIME | 创建时间 |

**login_logs** — 登录日志

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 后台用户ID |
| ip | VARCHAR(50) | 登录IP |
| user_agent | VARCHAR(255) | 浏览器标识 |
| status | ENUM | 状态(success/fail) |
| created_at | DATETIME | 创建时间 |

**operation_logs** — 操作日志

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| user_id | INT FK | 后台用户ID |
| module | VARCHAR(50) | 操作模块 |
| action | VARCHAR(100) | 操作动作 |
| detail | JSON | 操作详情 |
| ip | VARCHAR(50) | 操作IP |
| created_at | DATETIME | 创建时间 |

### 2.7 数据层级关系

```
校区 (campuses)
  ├── 书院 (colleges)      → 楼栋号 (buildings)
  └── 学院 (departments)   → 专业 (majors)

电话簿分类 (phonebook_categories) ← 校区 (campuses)
```

---

## 3. 用户身份方案

小程序用户通过「身份选择 + 微信授权 + UID/密码」体系管理身份：

- **注册流程**：新用户首次进入 → 先选择身份（新生/本科生/研究生）→ 程序记忆 → 微信授权登录 → 自动注入已选身份保存 → 注册成功；暑假模式下未注册新用户可通过启动页 [新生入口] 快捷注册，身份直接固定为「新生」
- **UID**：注册时随机生成 6 位数字，默认密码随机生成，可在个人信息查看/修改
- **微信与 UID 绑定**：一个微信（openid）对应一个 UID，换微信号视为新用户注册新 UID；原 UID 可用密码登录网页端
- **登录方式**：UID + 密码（网页端）；微信授权（小程序端）
- **登录态保持**：小程序授权后长期保持登录态（Token 长期有效，可配置刷新策略），下次打开无需再次登录
- **在线用户判定**：最近 30 分钟内有 API 请求的用户视为在线
- **游客模式**：未授权登录的用户以游客身份访问：
  - 可浏览新生模块、智慧海大模块内容
  - 课表仅返回空框架数据（无课程内容）
  - 社区模块/找室友/个人设置等接口对游客返回「需登录」错误码
- **身份**（新生/本科生/研究生）注册时确认，可修改 3 次
- **认证状态与积分**：默认未认证 / 积分关闭；发布二手商品需已认证（后台人工审核）
- **隐私设置**：用户可控制对外展示信息

## 4. 部署架构

生产服务器：Nginx 反向代理 + Node.js API 服务 + MySQL + Web 管理后台

开发流程：本机 WSL（开发调试）→ 测试服务器（测试验证）→ 生产服务器（正式部署）

---

## 5. 文件存储

地图图片、校历图片、商品图片等均存储在服务器文件系统，通过 URL 访问。

**menus** — 菜单/功能管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| parent_id | INT | 父级菜单ID（一级菜单为0） |
| menu_name | VARCHAR(50) | 菜单名称 |
| menu_key | VARCHAR(50) UNIQUE | 菜单标识（路由/权限标识） |
| menu_type | ENUM | 目录(menu) / 页面(button) |
| icon | VARCHAR(100) | 菜单图标（为空则不显示） |
| path | VARCHAR(200) | 路由路径（页面菜单必填） |
| component | VARCHAR(200) | 组件路径（页面菜单必填） |
| sort_order | INT | 排序（升序） |
| is_visible | TINYINT(1) | 是否可见（1=显示 / 0=隐藏） |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

> 菜单数据与 `permissions` 表共用同一棵树结构。`permissions.perm_key` 与 `menus.menu_key` 一一对应。后台通过菜单树自动生成前端路由和按钮权限。

**role_permissions** — 角色权限关联（多对多）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| role_id | INT FK | 关联角色 |
| permission_id | INT FK | 关联权限 |

> 角色可分配多个权限（菜单+按钮）。`authList` 前端指令根据当前用户的权限树过滤可见按钮。

**role_users** — 后台用户角色关联（多对多）

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| admin_user_id | INT FK | 关联后台用户 |
| role_id | INT FK | 关联角色 |

> 一个后台用户可拥有多个角色。登录时合并所有角色权限去重。

**dict_types** — 字典类型管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| type_name | VARCHAR(50) | 类型名称 |
| type_key | VARCHAR(50) UNIQUE | 类型标识（如 identity_type / auth_status） |
| description | VARCHAR(200) | 描述 |
| sort_order | INT | 排序 |
| is_active | TINYINT(1) | 是否启用 |
| created_at | DATETIME | 创建时间 |
| updated_at | DATETIME | 更新时间 |

> dicts 表通过 dict_type 字段关联 dict_types.type_key，实现字典分类管理。

**files** — 文件管理

| 字段 | 类型 | 说明 |
|:----|:----|:------|
| id | INT PK AUTO | 主键 |
| original_name | VARCHAR(255) | 原始文件名 |
| stored_name | VARCHAR(255) | 存储文件名（UUID） |
| file_path | VARCHAR(500) | 存储路径 |
| file_size | BIGINT | 文件大小（字节） |
| mime_type | VARCHAR(100) | MIME 类型 |
| uploader_id | INT FK | 上传者（后台用户） |
| related_type | VARCHAR(50) | 关联业务类型（如 auth_application / tool_result） |
| related_id | INT | 关联业务ID |
| created_at | DATETIME | 创建时间 |

> 文件保留天数为 0 时永久保留。定时任务每天清理过期文件。

