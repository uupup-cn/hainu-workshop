// 工具箱计算内核（PRD §3.6）：纯函数实现，无数据库依赖，便于单元测试
// 测试类工具采用「前端算维度分、后端出结果」的题库无关设计

// ========== 通用校验 ==========

/** 取必填数字，非数字或缺失时抛出中文错误 */
function requireNum(v: any, name: string): number {
  if (typeof v !== 'number' || !Number.isFinite(v)) throw new Error(`${name}必须为有效数字`);
  return v;
}

/** 校验数值区间（含边界），越界抛出中文错误 */
function assertRange(v: number, min: number, max: number, name: string): void {
  if (v < min || v > max) throw new Error(`${name}必须在 ${min}-${max} 范围内`);
}

// ========== 1. 摇骰子 ==========

function computeDice(params: any) {
  const count = params && params.count !== undefined ? params.count : 1;
  if (typeof count !== 'number' || !Number.isInteger(count)) throw new Error('骰子数量必须为整数');
  assertRange(count, 1, 10, '骰子数量');
  const rolls: number[] = [];
  for (let i = 0; i < count; i++) rolls.push(Math.floor(Math.random() * 6) + 1);
  return { rolls, total: rolls.reduce((a, b) => a + b, 0), count };
}

// ========== 2. 科学计算器（词法分析 + 调度场算法 + 求值器，禁止 eval） ==========

/** 支持的函数表（log 为自然对数） */
const CALC_FUNCS: Record<string, (x: number) => number> = {
  sin: Math.sin, cos: Math.cos, tan: Math.tan, asin: Math.asin, acos: Math.acos, atan: Math.atan,
  log: Math.log, log10: Math.log10, log2: Math.log2, sqrt: Math.sqrt, abs: Math.abs, exp: Math.exp,
};
/** 运算符定义：优先级 / 结合性 / 是否一元 / 计算函数 */
interface CalcOp { prec: number; right?: boolean; unary?: boolean; fn: (a: number, b: number) => number; }
/** 运算符表：一元负号与 ^ 同级右结合，保证 -3^2 = -(3^2) */
const CALC_OPS: Record<string, CalcOp> = {
  '+': { prec: 1, fn: (a, b) => a + b },
  '-': { prec: 1, fn: (a, b) => a - b },
  '*': { prec: 2, fn: (a, b) => a * b },
  '/': { prec: 2, fn: (a, b) => { if (b === 0) throw new Error('除数不能为零'); return a / b; } },
  '%': { prec: 2, fn: (a, b) => { if (b === 0) throw new Error('除数不能为零'); return a % b; } },
  '^': { prec: 3, right: true, fn: (a, b) => Math.pow(a, b) },
  'u-': { prec: 3, right: true, unary: true, fn: (a) => -a },
};

/** 词法分析：表达式 → token 流（数字 / 运算符 / 括号 / 函数 / 常量） */
function tokenizeExpr(expr: string): any[] {
  const tokens: any[] = [];
  // 上一 token 是否为数字/右括号：用于区分二元减号与一元负号
  let prevIsValue = false;
  let i = 0;
  while (i < expr.length) {
    const ch = expr[i];
    if (ch === ' ') { i++; continue; }
    // 数字：小数 + 科学计数法（1e3 / 1.5E-2）
    if (/[0-9.]/.test(ch)) {
      const m = /^(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?/.exec(expr.slice(i));
      if (!m) throw new Error('数字格式不合法');
      tokens.push({ t: 'num', v: parseFloat(m[0]) });
      i += m[0].length;
      prevIsValue = true;
      continue;
    }
    // 标识符：函数名（可含数字，如 log10）或常量
    if (/[a-zA-Z]/.test(ch)) {
      const m = /^[a-zA-Z][a-zA-Z0-9]*/.exec(expr.slice(i))!;
      const name = m[0];
      const lower = name.toLowerCase();
      i += name.length;
      if (lower === 'pi') { tokens.push({ t: 'num', v: Math.PI }); prevIsValue = true; }
      else if (lower === 'e') { tokens.push({ t: 'num', v: Math.E }); prevIsValue = true; }
      else if (CALC_FUNCS[lower]) { tokens.push({ t: 'func', v: lower }); prevIsValue = false; }
      else throw new Error(`未知的函数或常量: ${name}`);
      continue;
    }
    if (ch === '(') { tokens.push({ t: 'op', v: '(' }); prevIsValue = false; i++; continue; }
    if (ch === ')') { tokens.push({ t: 'op', v: ')' }); prevIsValue = true; i++; continue; }
    if (ch === '+' || ch === '-' || ch === '*' || ch === '/' || ch === '%' || ch === '^') {
      // 减号出现在开头 / 运算符后 / 左括号后 → 一元负号
      if (ch === '-' && !prevIsValue) tokens.push({ t: 'op', v: 'u-' });
      else tokens.push({ t: 'op', v: ch });
      prevIsValue = false;
      i++;
      continue;
    }
    throw new Error(`包含非法字符: ${ch}`);
  }
  return tokens;
}

/** 调度场算法：token 流 → 逆波兰表达式（RPN） */
function toRpn(tokens: any[]): any[] {
  const out: any[] = [];
  const stack: any[] = [];
  for (const tk of tokens) {
    if (tk.t === 'num') { out.push(tk); continue; }
    if (tk.t === 'func') { stack.push(tk); continue; }
    const cur = CALC_OPS[tk.v];
    if (cur) {
      while (stack.length > 0) {
        const top = stack[stack.length - 1];
        if (top.t !== 'op' || top.v === '(') break;
        const topOp = CALC_OPS[top.v];
        // 栈顶优先级更高，或同级左结合时弹出
        if (topOp.prec > cur.prec || (topOp.prec === cur.prec && !cur.right)) out.push(stack.pop());
        else break;
      }
      stack.push(tk);
      continue;
    }
    if (tk.v === '(') { stack.push(tk); continue; }
    if (tk.v === ')') {
      while (stack.length > 0 && stack[stack.length - 1].v !== '(') out.push(stack.pop());
      if (stack.length === 0) throw new Error('表达式不合法：括号不匹配');
      stack.pop(); // 弹出 '('
      // 括号前若是函数则一并弹出
      if (stack.length > 0 && stack[stack.length - 1].t === 'func') out.push(stack.pop());
      continue;
    }
  }
  while (stack.length > 0) {
    const top = stack.pop();
    if (top.v === '(') throw new Error('表达式不合法：括号不匹配');
    out.push(top);
  }
  return out;
}

/** 求值器：计算 RPN，结果用 toPrecision(12) 消除浮点噪声 */
function evalRpn(rpn: any[]): number {
  const st: number[] = [];
  for (const tk of rpn) {
    if (tk.t === 'num') { st.push(tk.v); continue; }
    if (tk.t === 'func') {
      if (st.length < 1) throw new Error('表达式不合法');
      st.push(CALC_FUNCS[tk.v](st.pop()!));
      continue;
    }
    const op = CALC_OPS[tk.v];
    if (op.unary) {
      if (st.length < 1) throw new Error('表达式不合法');
      st.push(op.fn(st.pop()!, 0));
      continue;
    }
    if (st.length < 2) throw new Error('表达式不合法');
    const b = st.pop()!;
    const a = st.pop()!;
    st.push(op.fn(a, b));
  }
  if (st.length !== 1) throw new Error('表达式不合法');
  const v = st[0];
  if (!Number.isFinite(v)) throw new Error('计算结果不是有效数字');
  return Number.parseFloat(v.toPrecision(12));
}

function computeCalculator(params: any) {
  const expression = params && params.expression;
  if (typeof expression !== 'string' || expression.trim() === '') throw new Error('表达式不能为空');
  const value = evalRpn(toRpn(tokenizeExpr(expression)));
  return { expression, value };
}

// ========== 3. 证件照生成 ==========

/** 证件照规格：像素与毫米尺寸 */
interface IdPhotoSpec { name: string; widthPx: number; heightPx: number; widthMm: number; heightMm: number; }
/** 证件照规格表 */
const ID_PHOTO_SPECS: Record<string, IdPhotoSpec> = {
  one: { name: '一寸', widthPx: 295, heightPx: 413, widthMm: 25, heightMm: 35 },
  two: { name: '二寸', widthPx: 413, heightPx: 579, widthMm: 35, heightMm: 49 },
  'small-two': { name: '小二寸', widthPx: 413, heightPx: 531, widthMm: 35, heightMm: 45 },
};

function computeIdPhoto(params: any) {
  const size = params && params.size;
  const spec = ID_PHOTO_SPECS[size];
  if (!spec) throw new Error('不支持的证件照尺寸');
  return { size, ...spec };
}

// ========== 4. 命运转盘 ==========

function computeWheel(params: any) {
  const raw: any[] = (params && params.options) || [];
  if (!Array.isArray(raw)) throw new Error('转盘选项必须为数组');
  const options = raw.filter((o) => typeof o === 'string' && o.trim() !== '');
  if (options.length < 2) throw new Error('转盘选项至少需要 2 项');
  const index = Math.floor(Math.random() * options.length);
  return { picked: options[index], index, total: options.length };
}

// ========== 5. 舒尔特方格 ==========

function computeSchulte(params: any) {
  const grid = requireNum(params && params.grid, '网格规格');
  if (!Number.isInteger(grid)) throw new Error('网格规格必须为整数');
  assertRange(grid, 5, 10, '网格规格');
  const timeMs = requireNum(params && params.timeMs, '完成用时');
  if (timeMs <= 0) throw new Error('完成用时必须大于 0');
  // 评级基准秒数：grid*grid 个数字 × 单个 0.55 秒
  const base = grid * grid * 0.55;
  let rating: string;
  if (timeMs <= base * 1000) rating = '优秀';
  else if (timeMs <= base * 1.5 * 1000) rating = '良好';
  else if (timeMs <= base * 2 * 1000) rating = '中等';
  else rating = '继续训练';
  return { grid, timeMs, seconds: Math.round(timeMs / 1000), rating };
}

// ========== 6/7. SBTI / MBTI 人格测试（同一算法，16 型） ==========

/** 16 型人格中文名映射（标准 MBTI 命名） */
const MBTI_TYPE_NAMES: Record<string, string> = {
  INTJ: '建筑师', INTP: '逻辑学家', ENTJ: '指挥官', ENTP: '辩论家',
  INFJ: '提倡者', INFP: '调停者', ENFJ: '主人公', ENFP: '竞选者',
  ISTJ: '物流师', ISFJ: '守卫者', ESTJ: '总经理', ESFJ: '执政官',
  ISTP: '鉴赏家', ISFP: '探险家', ESTP: '企业家', ESFP: '表演者',
};

/** 四个维度的字母对（前者为 first 侧） */
const MBTI_PAIRS: Array<[string, string]> = [['E', 'I'], ['S', 'N'], ['T', 'F'], ['J', 'P']];

function computeMbti(params: any) {
  const scores = (params && params.scores) || {};
  for (const [a, b] of MBTI_PAIRS) {
    if (typeof scores[a] !== 'number' || typeof scores[b] !== 'number') throw new Error('维度得分不完整');
  }
  const dimensions = MBTI_PAIRS.map(([a, b]) => {
    const total = scores[a] + scores[b];
    const first = scores[a] >= scores[b] ? a : b; // 平分时取前侧字母
    const second = first === a ? b : a;
    const firstPct = total > 0 ? Math.round((scores[first] / total) * 100) : 50;
    return { name: `${a}/${b}`, first, firstPct, second, secondPct: 100 - firstPct };
  });
  const type = dimensions.map((d) => d.first).join('');
  return { dimensions, type, typeName: MBTI_TYPE_NAMES[type] };
}

// ========== 8. 黑暗三角人格测试 ==========

/** 分数 → 等级：<34 低 / <67 中 / ≥67 高 */
function scoreLevel(score: number): string {
  if (score < 34) return '低';
  if (score < 67) return '中';
  return '高';
}

const DARK_TRIAD_KEYS: Array<[string, string]> = [
  ['machiavellianism', '马基雅维利主义'],
  ['psychopathy', '精神病态'],
  ['narcissism', '自恋'],
];

function computeDarkTriad(params: any) {
  const scores = (params && params.scores) || {};
  const dimensions = DARK_TRIAD_KEYS.map(([key, name]) => {
    const score = requireNum(scores[key], `${name}得分`);
    assertRange(score, 0, 100, `${name}得分`);
    return { key, name, score, level: scoreLevel(score) };
  });
  const overallScore = dimensions.reduce((s, d) => s + d.score, 0) / dimensions.length;
  const overall = { score: Number.parseFloat(overallScore.toFixed(1)), level: scoreLevel(overallScore) };
  return { dimensions, overall };
}

// ========== 9. 七宗罪 VS 七美德 ==========

/** 七宗罪与对应七美德 */
const SEVEN_SINS: Array<{ key: string; sin: string; virtue: string }> = [
  { key: 'pride', sin: '傲慢', virtue: '谦逊' },
  { key: 'envy', sin: '嫉妒', virtue: '宽容' },
  { key: 'wrath', sin: '暴怒', virtue: '温和' },
  { key: 'sloth', sin: '懒惰', virtue: '勤勉' },
  { key: 'greed', sin: '贪婪', virtue: '慷慨' },
  { key: 'gluttony', sin: '暴食', virtue: '节制' },
  { key: 'lust', sin: '色欲', virtue: '贞洁' },
];

function computeSevenSins(params: any) {
  const scores = (params && params.scores) || {};
  const dimensions = SEVEN_SINS.map(({ key, sin, virtue }) => {
    const score = requireNum(scores[key], `${sin}得分`);
    assertRange(score, 0, 100, `${sin}得分`);
    return { key, sin, virtue, score };
  });
  // 得分最高的罪为主导倾向（并列时取顺序靠前的一项）
  const dominant = dimensions.reduce((max, d) => (d.score > max.score ? d : max), dimensions[0]);
  const summary = `你的主导倾向是「${dominant.sin}」，对应美德为「${dominant.virtue}」，可在生活中有意识地培养该美德。`;
  const dominantOut = { key: dominant.key, sin: dominant.sin, virtue: dominant.virtue, score: dominant.score };
  return { dimensions, dominant: dominantOut, summary };
}

// ========== 统一分发入口 ==========

/** 各 toolKey 对应的计算函数表 */
const TOOL_COMPUTERS: Record<string, (params: any) => any> = {
  dice: computeDice,
  calculator: computeCalculator,
  'id-photo': computeIdPhoto,
  wheel: computeWheel,
  schulte: computeSchulte,
  sbti: computeMbti,
  mbti: computeMbti,
  'dark-triad': computeDarkTriad,
  'seven-sins': computeSevenSins,
};

/** 工具计算入口：按 toolKey 分发到对应纯函数 */
export function computeToolResult(toolKey: string, params: any): any {
  const computer = TOOL_COMPUTERS[toolKey];
  if (!computer) throw new Error('未支持的工具');
  return computer(params || {});
}
