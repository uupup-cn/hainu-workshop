# 海大工坊 · 小程序组件审查结论

> 日期：2026-08-21
> 状态：已执行（按最终建议方案）

---

## 一、审查结论

组件库与项目页面功能整体匹配度较高，存在以下需要处理的问题：

| 类型 | 结论 |
|:----|:----|
| 缺失组件 | 富文本 / 图片上传 / 图片轮播 / 日期选择器需要补齐 |
| 组件边界混乱 | 页面型伪组件混入 `<组件>` 命名，需从组件库移除 |
| 已剔除场景 | 一卡通、空教室、成绩页面相关组件不需要进入组件库 |

---

## 二、组件库最终范围（28 个）

### 保留的真实组件（24 个）

导航与布局：`NavBar`、`TabBar`、`PageHeader`、`Segment`
按钮与反馈：`Button`、`Toast`、`Loading`、`Empty`、`Skeleton`、`Dialog`、`ActionSheet`、`Popover`
内容展示：`Card`（含 Standard / Grid / Tool / Image）、`Cell`、`Tag`、`Badge`、`Avatar`、`Progress`
表单与选择：`Input`、`Search`、`Select`、`Cascader`、`Switch`
列表与业务卡：`MessageItem`、`PostItem`、`CampusCard`、`CourseCard`

### 新增组件（4 个）

1. `RichText` —— 富文本渲染
2. `ImageUploader` —— 多图上传（3/9 张限制）
3. `ImagePreview` —— 图片缩放 / 拖动 / 轮播预览
4. `DatePickerCell` —— 校历/周次/节次等日期标记与选择

> 合计：24 + 4 = 28 个真实组件。

---

## 三、不新增的组件（用组合实现）

以下交互**不要新增组件**，用既有组件组合：

- 步骤条：`Cell + 圆点 + 连接线`
- 时间轴：`Card + 圆点 + 连线`
- 手风琴：`Cell + 受控展开`
- FAB：`Button + shadow-float`
- 图片上传预览：`Image + ActionSheet`
- 地图图层：`Switch + Icon`
- 周次网格：`自定义圆点 + tnum`

---

## 四、不进入组件库的页面型伪组件

以下是从线框记录中出现的 `<XXX>` 伪组件，**不属于组件库**，应视作页面（Page Template）：

`FreshmanHub`、`SmartHNU`、`EnrollmentFlow`、`ScheduleWeek`、`RoommatePost`、`Route`、`Market`、`AboutDetail`、`CampusDB`、`NewsDetail`、`PostEditor`、`Feedback`、`Messages`、`Privacy`、`ProfileEdit`、`Settings`、`Verify` 等。

规则：只有可复用于 2 个及以上页面的抽象，才进入组件库；单页面块一律视为页面模板。

---

## 五、已剔除的页面相关组件

不进入组件库：

- 一卡通钱包 / 流水
- 空教室点名 / 教室网格
- 成绩 / GPA / 学分进度

原因：真实设计文档未定义这些独立页面，已在 UI 设计进度清单中标记「不需要」。