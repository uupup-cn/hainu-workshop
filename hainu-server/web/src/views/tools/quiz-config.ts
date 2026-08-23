/**
 * 测评类工具（SBTI / MBTI / 黑暗三角 / 七宗罪）示例题库与计分配置
 * 页面标注「示例题库 · 正式题库接入后自动替换」
 */

export interface QuizQuestion {
  /** 题目文案 */
  text: string
  /** 计分维度 key（如 E / machiavellianism / pride） */
  dim: string
  /** 正向题 1 / 反向题 -1，得分 = 同意度(-2~+2) × dir */
  dir: 1 | -1
}

export interface QuizConfig {
  title: string
  /** 结果渲染变体：mbti=16 型 / levels=维度分+等级 / sins=主导罪+七维条形 */
  variant: 'mbti' | 'levels' | 'sins'
  questions: QuizQuestion[]
  /** 答案数组 → use(key, {scores}) 的 scores 映射 */
  mapScores: (answers: number[]) => Record<string, number>
}

/** 各维度原始分求和（同意度 × dir 累加） */
function sumByDim(questions: QuizQuestion[], answers: number[]): Record<string, number> {
  const sums: Record<string, number> = {}
  questions.forEach((q, i) => {
    sums[q.dim] = (sums[q.dim] || 0) + (answers[i] || 0) * q.dir
  })
  return sums
}

/** 各维度归一化到 0-100：(平均分 + 2) / 4 × 100 */
function percentByDim(questions: QuizQuestion[], answers: number[]): Record<string, number> {
  const sums = sumByDim(questions, answers)
  const counts: Record<string, number> = {}
  questions.forEach((q) => {
    counts[q.dim] = (counts[q.dim] || 0) + 1
  })
  const out: Record<string, number> = {}
  for (const k of Object.keys(sums)) {
    const avg = sums[k] / counts[k]
    out[k] = Math.min(100, Math.max(0, Math.round(((avg + 2) / 4) * 100)))
  }
  return out
}

/** SBTI / MBTI 共用题库（维度 E/I/S/N/T/F/J/P，各 1 题，共 8 题） */
const MBTI_QUESTIONS: QuizQuestion[] = [
  { text: '我喜欢结识新朋友，在人群中感到充满活力', dim: 'E', dir: 1 },
  { text: '长时间独处让我感到放松和充实', dim: 'I', dir: 1 },
  { text: '我更关注事物的具体细节和实际经验', dim: 'S', dir: 1 },
  { text: '我常常想象各种可能性与未来的图景', dim: 'N', dir: 1 },
  { text: '做决定时我更依赖逻辑分析而非人情', dim: 'T', dir: 1 },
  { text: '做决定时我会优先考虑他人的感受', dim: 'F', dir: 1 },
  { text: '我喜欢提前制定计划并按计划执行', dim: 'J', dir: 1 },
  { text: '我享受随性灵活、临场发挥的生活方式', dim: 'P', dir: 1 },
]

/** 黑暗三角题库（马基雅维利主义 / 精神病态 / 自恋，共 8 题） */
const DARK_TRIAD_QUESTIONS: QuizQuestion[] = [
  { text: '为了达成目标，适当地利用他人是可以接受的', dim: 'machiavellianism', dir: 1 },
  { text: '与人交往时，我会刻意保留关键信息', dim: 'machiavellianism', dir: 1 },
  { text: '计划出现意外时，我总能保持冷静不为所动', dim: 'machiavellianism', dir: -1 },
  { text: '看到别人陷入困境时，我大多无动于衷', dim: 'psychopathy', dir: 1 },
  { text: '我偶尔会冲动行事而不太考虑后果', dim: 'psychopathy', dir: 1 },
  { text: '我觉得自己比身边大多数人更出色', dim: 'narcissism', dir: 1 },
  { text: '我喜欢成为大家关注的焦点', dim: 'narcissism', dir: 1 },
  { text: '听到批评时，我的第一反应是对方不懂欣赏', dim: 'narcissism', dir: 1 },
]

/** 七宗罪题库（傲慢/嫉妒/暴怒/懒惰/贪婪/暴食/色欲，共 8 题） */
const SEVEN_SINS_QUESTIONS: QuizQuestion[] = [
  { text: '我常觉得自己比身边的人更有资格获得好机会', dim: 'pride', dir: 1 },
  { text: '看到朋友过得比我好，我心里会不太舒服', dim: 'envy', dir: 1 },
  { text: '排队被人插队时，我会立刻火冒三丈', dim: 'wrath', dir: 1 },
  { text: '能拖到明天的事，我绝不今天做', dim: 'sloth', dir: 1 },
  { text: '打折促销时，我总忍不住囤一堆用不上的东西', dim: 'greed', dir: 1 },
  { text: '心情不好时，我会用大吃一顿来安慰自己', dim: 'gluttony', dir: 1 },
  { text: '遇到心动的人或物，我容易产生强烈的渴望', dim: 'lust', dir: 1 },
  { text: '我常常觉得自己的表现不如身边的人', dim: 'pride', dir: -1 },
]

export const QUIZ_CONFIGS: Record<string, QuizConfig> = {
  sbti: {
    title: 'SBTI 性格测试',
    variant: 'mbti',
    questions: MBTI_QUESTIONS,
    mapScores: (answers) => sumByDim(MBTI_QUESTIONS, answers),
  },
  mbti: {
    title: 'MBTI 人格测试',
    variant: 'mbti',
    questions: MBTI_QUESTIONS,
    mapScores: (answers) => sumByDim(MBTI_QUESTIONS, answers),
  },
  'dark-triad': {
    title: '黑暗三角人格测试',
    variant: 'levels',
    questions: DARK_TRIAD_QUESTIONS,
    mapScores: (answers) => percentByDim(DARK_TRIAD_QUESTIONS, answers),
  },
  'seven-sins': {
    title: '七宗罪 VS 七美德',
    variant: 'sins',
    questions: SEVEN_SINS_QUESTIONS,
    mapScores: (answers) => percentByDim(SEVEN_SINS_QUESTIONS, answers),
  },
}
