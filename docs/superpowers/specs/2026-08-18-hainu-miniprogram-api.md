# 海大工坊 · 微信小程序 — API 文档

> 版本：v2.0
> 日期：2026-08-19
> 状态：初稿

---

## 1. 通用规范

### 1.1 基础路径

所有 API 接口均以 /api/v1 为前缀。

### 1.2 请求格式

- Content-Type: application/json
- 登录后请求头需携带：Authorization: Bearer <token>
- 未登录小程序端首次访问：携带小程序授权凭证（code）完成注册/登录

### 1.3 响应格式

成功响应：
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

错误响应：
```json
{
  "code": 40001,
  "message": "错误描述",
  "data": null
}
```

### 1.4 通用错误码

| code | 说明 |
|:----|:-----|
| 0 | 成功 |
| 40001 | 参数错误 |
| 40002 | 未授权 |
| 40003 | 资源不存在 |
| 40004 | 权限不足 |
| 40005 | 功能不在开放时间范围内 |
| 40006 | 分享码无效或已停用 |
| 40007 | 分享码身份不匹配 |
| 40008 | 修改次数已用完 |
| 40009 | 已存在发布信息，每人仅可发布1条 |
| 40010 | 需要登录后访问 |
| 40011 | 分享码数量已达上限 |
| 40012 | 课程时间冲突 |
| 40013 | 积分不足，无法使用工具 |
| 50000 | 服务器内部错误 |

---

## 2. 用户与认证接口

### 2.1 注册与登录

#### POST /api/v1/auth/register
小程序授权登录注册（仅小程序端）

- 请求体：微信授权凭证 code + 用户授权信息 + 已选身份 identity
- 身份来源一：启动页 [新生入口] 快捷注册（身份固定为 freshman）
- 首次授权：自动注入已选身份创建用户（UID 自动生成、默认密码随机生成），返回用户信息 + token
- 已存在用户：直接登录，返回用户信息 + token
- **登录态**：返回的 token 长期有效，小程序端本地保存，下次打开自动恢复登录态

#### POST /api/v1/auth/login
UID + 密码登录（网页端/小程序端通用）

请求体：
```json
{
  "uid": "00001",
  "password": "xxx"
}
```

### 2.2 个人信息

#### GET /api/v1/user/profile
获取个人信息（含 UID、默认密码、积分、认证状态）

#### PUT /api/v1/user/profile
补全/修改个人信息（邮箱、QQ、微信号、昵称、头像）

#### PUT /api/v1/user/password
修改密码

#### GET /api/v1/user/public/:uid
查看其他用户主页（受隐私设置控制，仅返回对外展示字段）

### 2.3 隐私设置

#### GET /api/v1/user/privacy
获取隐私设置

#### PUT /api/v1/user/privacy
更新隐私设置（privacy_enabled + 对外展示字段开关）

### 2.4 认证

#### POST /api/v1/user/auth-apply
提交认证申请（姓名、学号、专业、证明图片）

#### GET /api/v1/user/auth-status
获取认证状态（未认证/待审核/已认证）

#### GET /api/v1/user/points
获取积分信息（状态 + 积分值）

### 2.5 通知中心

#### GET /api/v1/notifications?page=1&size=20
获取通知列表（按推送对象过滤，时间倒序，含已读/未读状态）

#### GET /api/v1/notifications/:id
获取通知详情

#### PUT /api/v1/notifications/:id/read
标记通知为已读

#### GET /api/v1/notifications/unread-count
获取未读通知数量

### 2.6 用户反馈

#### POST /api/v1/user/feedback
提交反馈

请求体：
```json
{
  "content": "反馈内容",
  "contact": "联系方式（选填）"
}
```

#### GET /api/v1/user/feedback?page=1&size=20
获取我的反馈历史（含处理状态）

---

## 3. 内容管理接口

### 3.1 入学指南

#### GET /api/v1/guide/entries
获取入学指南条目列表

#### GET /api/v1/guide/entries/:key
获取单个入学指南条目详情

### 3.2 生活攻略

#### GET /api/v1/life/campuses
获取校区列表

#### GET /api/v1/life/topics?campus=:campus
获取指定校区下的主题列表

#### GET /api/v1/life/topics/:key
获取单个主题详情

### 3.3 FAQ

#### GET /api/v1/faq/categories
获取FAQ分类列表

#### GET /api/v1/faq/questions?category_id=:id&keyword=:keyword
获取问题列表，支持按分类和关键词搜索

#### GET /api/v1/faq/questions/:id
获取单个问题详情

### 3.4 海大介绍

#### GET /api/v1/intro/entries
获取海大介绍条目列表

#### GET /api/v1/intro/entries/:key
获取单个条目详情

### 3.5 电话簿

#### GET /api/v1/phonebook/categories
获取电话簿分类列表（由校区管理驱动）

#### GET /api/v1/phonebook/entries?category_id=:id&keyword=:keyword
获取电话条目列表，支持按分类和关键词搜索

### 3.6 校历

#### GET /api/v1/calendar
获取校历设置（包含展示模式和对应数据）

### 3.7 校园地图

#### GET /api/v1/maps
获取所有校区地图列表

#### GET /api/v1/maps/:campus
获取指定校区地图（含标注点列表）

### 3.8 校园出行

#### GET /api/v1/bus/schedules
获取校车时刻表列表

#### GET /api/v1/bus/stations
获取车站信息列表

#### GET /api/v1/bus/guide
获取乘车指南

---

## 4. 找室友接口

### 4.1 功能状态

#### GET /api/v1/roommate/status
获取找室友功能是否在开放时间范围内

### 4.2 数据源（多级联动）

#### GET /api/v1/roommate/campuses
获取校区列表

#### GET /api/v1/roommate/colleges?campus_id=:id
根据校区获取书院列表

#### GET /api/v1/roommate/departments?campus_id=:id
根据校区获取学院列表

#### GET /api/v1/roommate/majors?department_id=:id
根据学院获取专业列表

#### GET /api/v1/roommate/buildings?college_id=:id
根据书院获取楼栋号列表

### 4.3 发布信息

#### GET /api/v1/roommate/posts?page=1&size=20
获取找室友信息列表（分页）

#### GET /api/v1/roommate/posts/:id
获取找室友信息详情

#### POST /api/v1/roommate/posts
发布找室友信息

请求体：
```json
{
  "name": "张三",
  "contact": "QQ:12345678",
  "campus_id": 1,
  "college_id": 2,
  "department_id": 3,
  "major_id": 5,
  "building_id": 8,
  "room_number": "A栋301"
}
```

#### GET /api/v1/roommate/posts/my
获取我的找室友信息（无则返回空）

#### PUT /api/v1/roommate/posts/:id
修改我的找室友信息

- 校验修改次数：已修改次数 >= max_modify_count 时返回 40008（修改次数已用完）
- 请求体字段与 POST 发布一致


### 4.4 自动匹配

#### POST /api/v1/roommate/posts/match
提交表单后自动匹配已有数据（不含自己刚发布的这条）

- 匹配室友：同校区 + 同书院 + 同楼栋 + 同寝室号
- 匹配同专业：同学院 + 同专业

响应：
```json
{  "code": 0,  "data": {    "roommate_matches": [],      // 匹配到的室友卡片    "major_matches": [],       // 匹配到的同专业名单    "has_roommate": false,    "has_major_match": false  }}```

- has_roommate=true：展示「室友匹配结果」+ 室友快捷卡片
- has_roommate=false 且 has_major_match=true：提示「暂无室友匹配，已找到同专业同学」+ 同专业名单卡片
- 两者均为 false：展示「暂无匹配」+ 「进入列表页」快捷入口

---

## 5. 社区模块接口

### 5.1 二手集市

#### GET /api/v1/marketplace/categories
获取商品分类列表

#### GET /api/v1/marketplace/items?category=:cat&keyword=:keyword&page=1&size=20
获取商品列表，支持分类筛选和关键词搜索，分页（需登录，游客返回 40010）

#### GET /api/v1/marketplace/items/:id
获取商品详情

#### POST /api/v1/marketplace/items
发布商品

请求体：
```json
{
  "title": "二手教材",
  "description": "九成新",
  "price": 15.00,
  "images": ["url1", "url2"],
  "contact": "微信:xxx",
  "category_id": 1
}
```

#### PUT /api/v1/marketplace/items/:id/off
手动下架商品

#### DELETE /api/v1/marketplace/items/:id
删除商品

#### PUT /api/v1/marketplace/items/:id/relist
重新上架商品

#### GET /api/v1/marketplace/my-items
获取我的发布列表

### 5.2 商品举报

#### POST /api/v1/marketplace/items/:id/report
举报商品（举报理由：垃圾广告/人身攻击/色情低俗/虚假信息/其他 + 补充说明）

请求体：
```json
{
  "reason": "虚假信息",
  "detail": "补充说明"
}
```

### 5.3 社区模块启停

#### GET /api/v1/community/modules
获取社区模块启停状态列表

---

### 5.4 快讯

#### GET /api/v1/news?target=:target&page=1&size=20
获取快讯列表（按用户身份过滤展示，支持类型筛选，分页；需登录，游客返回 40010）

#### GET /api/v1/news/:id
获取快讯详情

### 5.5 校友圈

#### GET /api/v1/alumni/sections
获取版块列表（需登录）

#### GET /api/v1/alumni/posts?type=post&section_id=:id&page=1&size=20
获取帖子列表（按活跃时间倒序，活跃时间=max(发布时间, 最后评论时间)；需登录）

#### GET /api/v1/alumni/posts?type=confession&page=1&size=20
获取表白墙列表（按发布时间倒序；需登录）

#### GET /api/v1/alumni/posts/:id
获取帖子/表白墙详情（需登录）

#### POST /api/v1/alumni/posts
发布帖子/表白墙（需已认证）

请求体：
```json
{
  "type": "post",
  "section_id": 1,
  "title": "帖子标题",
  "content": "描述内容",
  "images": [],
  "is_anonymous": false
}
```

#### DELETE /api/v1/alumni/posts/:id
删除自己的帖子/表白墙

#### POST /api/v1/alumni/posts/:id/like
点赞

#### DELETE /api/v1/alumni/posts/:id/like
取消点赞

#### GET /api/v1/alumni/posts/:id/comments?page=1&size=20
获取评论列表（需登录）

#### POST /api/v1/alumni/posts/:id/comments
发表评论（需已认证，支持 parent_id 回复评论形成楼中楼）

#### DELETE /api/v1/alumni/comments/:id
删除自己的评论

#### POST /api/v1/alumni/posts/:id/report
举报帖子/表白墙（举报理由：垃圾广告/人身攻击/色情低俗/虚假信息/其他 + 补充说明）

#### POST /api/v1/alumni/comments/:id/report
举报评论（举报理由同上）

---
### 5.6 抽奖

#### GET /api/v1/lottery/activities
获取上架活动列表（需登录）

#### GET /api/v1/lottery/activities/:id
获取活动详情（含奖品+概率，需登录）

#### POST /api/v1/lottery/activities/:id/draw
抽奖（检查时间/次数/积分，返回结果，需登录）

响应：
```json
{
  "code": 0,
  "data": {
    "is_win": true,
    "prize": {
      "name": "奖品名称",
      "image": "https://..."
    },
    "points_consumed": 0
  }
}
```

#### GET /api/v1/lottery/my-records
我的抽奖记录（需登录）

---
## 6. 工具箱接口

### 6.1 工具分类与列表

#### GET /api/v1/tools/categories
获取工具分类列表

#### GET /api/v1/tools?category_id=:id
获取工具列表（按分类，需登录）

#### GET /api/v1/tools/:key
获取工具详情（需登录）

### 6.2 使用工具

#### POST /api/v1/tools/:key/use
使用工具（检查积分/扣费/解锁/记录使用）

请求体：
```json
{
  "params": {}
}
```

响应：
```json
{
  "code": 0,
  "data": {
    "result": {},
    "points_consumed": 0,
    "unlocked": false
  }
}
```

- 免费工具：points_consumed=0，直接返回结果
- per_use 模式：每次扣除 points_cost，积分不足返回 40013
- one_time 模式：已解锁返回 unlocked=true 且不扣分；未解锁则扣分并解锁

### 6.3 分享

#### POST /api/v1/tools/:key/share
生成分享（链接/海报）

请求体：
```json
{
  "share_type": "poster",
  "result_data": {}
}
```

响应：
```json
{
  "code": 0,
  "data": {
    "share_url": "https://...",
    "poster_url": "https://..."
  }
}
```

### 6.4 影视解析

#### GET /api/v1/tools/video-parse/lines
获取影视解析线路（已启用的，需登录）

#### POST /api/v1/tools/video-parse
影视解析（需登录）

请求体：
```json
{
  "video_url": "https://...",
  "line_id": 1
}
```

---
## 7. 课表模块接口

### 7.1 课程管理

#### GET /api/v1/courses
获取当前用户课表

- 游客访问：返回课表框架数据（节次、周布局结构），不含任何课程内容；需要完整课表需登录（未登录返回 40010）
- 已登录：返回完整课表

#### POST /api/v1/courses
添加课程（检测到同一时段冲突时返回 40012 + 冲突课程信息；请求体加 force_overwrite=true 时覆盖冲突课程）

请求体：
```json
{
  "course_name": "高等数学",
  "teacher": "张老师",
  "location": "3教-201",
  "weeks": "1-16",
  "day_of_week": 1,
  "start_section": 1,
  "end_section": 2,
  "color_id": 3
}
```

#### PUT /api/v1/courses/:id
编辑课程

#### DELETE /api/v1/courses/:id
删除课程

### 7.2 课表导入

#### POST /api/v1/courses/import
文件导入课表

### 7.3 课表分享

#### POST /api/v1/courses/share
生成课表分享码

- 通过 Token 识别用户身份，无需请求体传 device_id

响应：
```json
{
  "code": 0,
  "data": {
    "share_code": "A1B2C3"
  }
}
```

#### POST /api/v1/courses/replicate
输入分享码复刻课表

请求体：
```json
{
  "share_code": "A1B2C3"
}
```
- 通过 Token 识别用户身份，无需客户端传 user_identity

复刻时校验分享码身份与当前用户身份一致；不一致返回 40007，分享码无效/停用/过期返回 40006。

分享码规则：
- 快照模式：复刻时读取生成码时拍下的快照数据，非实时数据
- 有效期 15 天，过期返回 40006
- 每用户最多 3 个生效分享码，超出时返回 40011

---

## 8. 系统接口

### 8.1 系统设置

#### GET /api/v1/system/settings
获取系统设置（含缴费说明文案 payment_description）

---

## 9. 文件上传接口

### 9.1 图片上传

#### POST /api/v1/upload/image
上传图片

---

## 10. 管理后台接口

### 10.1 认证

#### POST /api/v1/admin/login
管理员登录

### 10.2 内容管理 CRUD

每个内容管理模块均提供以下 CRUD 接口：

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/guide/entries | 列表 |
| GET | /api/v1/admin/guide/entries/:id | 详情 |
| POST | /api/v1/admin/guide/entries | 新增 |
| PUT | /api/v1/admin/guide/entries/:id | 编辑 |
| DELETE | /api/v1/admin/guide/entries/:id | 删除 |

其他内容模块接口模式同上。

### 10.3 找室友管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/roommate/settings | 获取功能配置 |
| PUT | /api/v1/admin/roommate/settings | 更新功能配置（含 max_modify_count） |
| GET | /api/v1/admin/roommate/posts | 发布信息列表 |
| GET | /api/v1/admin/roommate/posts/:id | 发布信息详情 |
| DELETE | /api/v1/admin/roommate/posts/:id | 删除发布信息 |

### 10.4 智慧校园数据管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET / POST / PUT / DELETE | /api/v1/admin/campuses[/:id] | 校区 CRUD（联动电话簿分类） |
| GET / POST / PUT / DELETE | /api/v1/admin/colleges[/:id] | 书院 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/departments[/:id] | 学院 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/majors[/:id] | 专业 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/buildings[/:id] | 楼栋号 CRUD |

### 10.5 社区管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/marketplace/categories | 商品分类列表 |
| POST | /api/v1/admin/marketplace/categories | 新增分类 |
| PUT | /api/v1/admin/marketplace/categories/:id | 编辑分类 |
| DELETE | /api/v1/admin/marketplace/categories/:id | 删除分类 |
| GET | /api/v1/admin/marketplace/items | 商品列表 |
| GET | /api/v1/admin/marketplace/items/:id | 商品详情 |
| DELETE | /api/v1/admin/marketplace/items/:id | 删除商品 |
| PUT | /api/v1/admin/community/modules/:key | 启停社区功能 |
| GET / POST / PUT / DELETE | /api/v1/admin/news[/:id] | 快讯 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/alumni/sections[/:id] | 版块 CRUD |
| GET | /api/v1/admin/alumni/posts | 帖子/表白墙列表 |
| PUT | /api/v1/admin/alumni/posts/:id/pin | 帖子置顶/取消置顶 |
| DELETE | /api/v1/admin/alumni/posts/:id | 删除帖子/表白墙 |
| DELETE | /api/v1/admin/alumni/comments/:id | 删除评论 |
| POST | /api/v1/admin/lottery/activities | 创建活动（基础信息） |
| GET | /api/v1/admin/lottery/activities | 活动列表 |
| GET | /api/v1/admin/lottery/activities/:id | 活动详情 |
| PUT | /api/v1/admin/lottery/activities/:id/list | 上架 |
| DELETE | /api/v1/admin/lottery/activities/:id | 删除（仅未上架/已下架） |
| POST | /api/v1/admin/lottery/activities/:id/prizes | 添加奖品 |
| PUT | /api/v1/admin/lottery/prizes/:id | 编辑奖品 |
| DELETE | /api/v1/admin/lottery/prizes/:id | 删除奖品 |
| PUT | /api/v1/admin/lottery/activities/:id/description | 编辑活动说明 |
| GET | /api/v1/admin/lottery/activities/:id/winners | 中奖数据 |
| GET | /api/v1/admin/lottery/activities/:id/winners/export | 导出中奖数据（Excel） |
| GET | /api/v1/admin/reports | 举报列表（支持按 target_type 筛选：商品/帖子/表白墙/评论） |
| PUT | /api/v1/admin/reports/:id | 处理举报（下架/删除/忽略 + 备注）；处理完成后自动发送站内信通知举报者和被举报者双方 |

### 10.6 课表管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/courses | 课程库列表 |
| GET / POST / PUT / DELETE | /api/v1/admin/course-colors[/:id] | 课程颜色 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/semesters[/:id] | 学期 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/term-weeks[/:id] | 学期周制 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/sections[/:id] | 节次 CRUD |
| GET | /api/v1/admin/share-codes | 分享码列表 |
| PUT | /api/v1/admin/share-codes/:id/status | 启停分享码 |

### 10.7 工具管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET / POST / PUT / DELETE | /api/v1/admin/tool-categories[/:id] | 工具分类 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/tools[/:id] | 工具 CRUD（含积分配置） |
| GET | /api/v1/admin/tools/usage-log | 使用记录列表 |
| GET / POST / PUT / DELETE | /api/v1/admin/video-parse-lines[/:id] | 影视解析线路 CRUD |

### 10.8 系统监控

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/online-users | 在线用户 |
| GET | /api/v1/admin/cache | 缓存管理 |
| DELETE | /api/v1/admin/cache | 清理缓存 |
| GET | /api/v1/admin/server-info | 服务器信息 |
| GET | /api/v1/admin/system-logs | 系统日志 |
| GET | /api/v1/admin/feedback | 用户反馈列表 |
| PUT | /api/v1/admin/feedback/:id | 处理反馈 |
| GET | /api/v1/admin/login-logs | 登录日志 |
| GET | /api/v1/admin/operation-logs | 操作日志 |

### 10.9 用户管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/users | 用户列表（搜索/筛选） |
| GET | /api/v1/admin/users/:id | 用户详情 |
| PUT | /api/v1/admin/users/:id | 编辑用户（身份/积分等） |
| DELETE | /api/v1/admin/users/:id | 删除用户 |
| GET | /api/v1/admin/auth-applications | 认证申请列表（待审核/全部） |
| GET | /api/v1/admin/auth-applications/:id | 认证申请详情 |
| PUT | /api/v1/admin/auth-applications/:id/review | 审核认证（通过/驳回 + 备注） |

审核通过时：认证状态转已认证、积分状态开启。

### 10.10 系统管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET / POST / PUT / DELETE | /api/v1/admin/users[/:id] | 用户 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/roles[/:id] | 角色 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/permissions[/:id] | 功能 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/dicts[/:id] | 字典 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/notification-types[/:id] | 通知类型 CRUD |
| GET / POST / PUT / DELETE | /api/v1/admin/notifications[/:id] | 通知 CRUD |
| GET | /api/v1/admin/system/settings | 获取系统设置 |
| PUT | /api/v1/admin/system/settings | 更新系统设置 |

### 10.11 菜单/功能管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/menus | 获取菜单树（含权限标识） |
| POST | /api/v1/admin/menus | 新增菜单 |
| PUT | /api/v1/admin/menus/:id | 更新菜单 |
| DELETE | /api/v1/admin/menus/:id | 删除菜单 |
| PUT | /api/v1/admin/menus/sort | 批量更新排序 |

### 10.12 角色权限分配

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/roles/:id/permissions | 获取角色已分配权限 |
| PUT | /api/v1/admin/roles/:id/permissions | 分配权限（全量覆盖） |
| GET | /api/v1/admin/roles/:id/users | 获取角色下用户 |
| POST | /api/v1/admin/roles/:id/users | 添加用户到角色 |
| DELETE | /api/v1/admin/roles/:id/users/:userId | 从角色移除用户 |

### 10.13 字典类型管理

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/dict-types | 获取字典类型列表 |
| POST | /api/v1/admin/dict-types | 新增字典类型 |
| PUT | /api/v1/admin/dict-types/:id | 更新字典类型 |
| DELETE | /api/v1/admin/dict-types/:id | 删除字典类型 |
| GET | /api/v1/admin/dicts/by-type/:type | 按类型获取字典数据 |

### 10.14 通知推送

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| POST | /api/v1/admin/notifications/push | 推送通知（按类型+推送对象） |
| GET | /api/v1/admin/notifications | 通知列表（分页+筛选） |
| PUT | /api/v1/admin/notifications/:id | 更新通知 |
| DELETE | /api/v1/admin/notifications/:id | 删除通知 |

### 10.15 站点设置（细分配置）

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/settings/group/:group | 按分组获取配置 |
| PUT | /api/v1/admin/settings/group/:group | 按分组更新配置 |
| GET | /api/v1/admin/settings/all | 获取所有配置（含分组） |

> 配置分组：`basic`（基本设置）/ `frontend`（前端配置）/ `file`（文件中心）/ `holiday`（假期开学）

### 10.16 文件中心

| 方法 | 路径 | 说明 |
|:----|:-----|:-----|
| GET | /api/v1/admin/files | 文件列表（分页+筛选） |
| POST | /api/v1/admin/files/upload | 上传文件 |
| GET | /api/v1/admin/files/:id/download | 下载文件 |
| DELETE | /api/v1/admin/files/:id | 删除文件 |
| GET | /api/v1/admin/files/stats | 文件统计（总大小/数量） |
