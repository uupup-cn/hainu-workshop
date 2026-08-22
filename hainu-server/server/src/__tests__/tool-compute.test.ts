// 工具计算内核纯函数测试（无数据库依赖，可直接本地运行）
import { describe, it, expect } from 'vitest';
import { computeToolResult } from '../utils/tool-compute';

describe('摇骰子 dice', () => {
  it('未传 count 时默认掷 1 枚', () => {
    const r = computeToolResult('dice', {});
    expect(r.count).toBe(1);
    expect(r.rolls).toHaveLength(1);
    expect(r.total).toBe(r.rolls[0]);
  });
  it('count=10 时返回 10 个 1-6 的点数且 total 为总和', () => {
    const r = computeToolResult('dice', { count: 10 });
    expect(r.count).toBe(10);
    expect(r.rolls).toHaveLength(10);
    for (const v of r.rolls) expect(v).toBeGreaterThanOrEqual(1), expect(v).toBeLessThanOrEqual(6);
    expect(r.total).toBe(r.rolls.reduce((a: number, b: number) => a + b, 0));
  });
  it('多次掷骰分布均落在 1-6', () => {
    for (let i = 0; i < 30; i++) {
      const r = computeToolResult('dice', { count: 10 });
      for (const v of r.rolls) expect(v).toBeGreaterThanOrEqual(1), expect(v).toBeLessThanOrEqual(6);
    }
  });
  it('count 越界（0 / 11）与非整数抛错', () => {
    expect(() => computeToolResult('dice', { count: 0 })).toThrow('骰子数量必须在 1-10 范围内');
    expect(() => computeToolResult('dice', { count: 11 })).toThrow('骰子数量必须在 1-10 范围内');
    expect(() => computeToolResult('dice', { count: 2.5 })).toThrow('骰子数量必须为整数');
  });
});

describe('科学计算器 calculator', () => {
  it('基础四则运算与优先级', () => {
    expect(computeToolResult('calculator', { expression: '1+2*3' }).value).toBe(7);
    expect(computeToolResult('calculator', { expression: '(1+2)*3' }).value).toBe(9);
    expect(computeToolResult('calculator', { expression: '(1+2)*(3+4)' }).value).toBe(21);
    expect(computeToolResult('calculator', { expression: '7/2' }).value).toBe(3.5);
    expect(computeToolResult('calculator', { expression: '10%3' }).value).toBe(1);
  });
  it('幂运算右结合与一元负号（-3^2 = -(3^2)）', () => {
    expect(computeToolResult('calculator', { expression: '-3^2' }).value).toBe(-9);
    expect(computeToolResult('calculator', { expression: '2^3^2' }).value).toBe(512);
    expect(computeToolResult('calculator', { expression: '2^-3' }).value).toBe(0.125);
    expect(computeToolResult('calculator', { expression: '--5' }).value).toBe(5);
    expect(computeToolResult('calculator', { expression: '-(3+4)' }).value).toBe(-7);
    expect(computeToolResult('calculator', { expression: '2*-3' }).value).toBe(-6);
  });
  it('小数与科学计数法', () => {
    expect(computeToolResult('calculator', { expression: '0.1+0.2' }).value).toBe(0.3);
    expect(computeToolResult('calculator', { expression: '1e3+1' }).value).toBe(1001);
    expect(computeToolResult('calculator', { expression: '2.5e-1*4' }).value).toBe(1);
    expect(computeToolResult('calculator', { expression: '.5+1.5' }).value).toBe(2);
  });
  it('三角函数与反三角函数', () => {
    expect(computeToolResult('calculator', { expression: 'sin(pi)' }).value).toBeCloseTo(0, 5);
    expect(computeToolResult('calculator', { expression: 'cos(0)' }).value).toBe(1);
    expect(computeToolResult('calculator', { expression: 'tan(0)' }).value).toBe(0);
    expect(computeToolResult('calculator', { expression: 'asin(1)' }).value).toBeCloseTo(Math.PI / 2, 10);
    expect(computeToolResult('calculator', { expression: 'acos(1)' }).value).toBeCloseTo(0, 10);
    expect(computeToolResult('calculator', { expression: 'atan(1)' }).value).toBeCloseTo(Math.PI / 4, 10);
  });
  it('对数、幂、绝对值与指数函数', () => {
    expect(computeToolResult('calculator', { expression: 'log(e)' }).value).toBeCloseTo(1, 10);
    expect(computeToolResult('calculator', { expression: 'log10(1000)' }).value).toBe(3);
    expect(computeToolResult('calculator', { expression: 'log2(8)' }).value).toBe(3);
    expect(computeToolResult('calculator', { expression: 'sqrt(16)' }).value).toBe(4);
    expect(computeToolResult('calculator', { expression: 'abs(-5)' }).value).toBe(5);
    expect(computeToolResult('calculator', { expression: 'exp(0)' }).value).toBe(1);
  });
  it('常量与函数嵌套', () => {
    expect(computeToolResult('calculator', { expression: 'pi' }).value).toBeCloseTo(Math.PI, 10);
    expect(computeToolResult('calculator', { expression: 'e' }).value).toBeCloseTo(Math.E, 10);
    expect(computeToolResult('calculator', { expression: 'sqrt(abs(-16))' }).value).toBe(4);
    expect(computeToolResult('calculator', { expression: 'sin(pi/2)+log10(100)' }).value).toBeCloseTo(3, 10);
  });
  it('返回值携带原始表达式', () => {
    const r = computeToolResult('calculator', { expression: '1+2' });
    expect(r.expression).toBe('1+2');
    expect(r.value).toBe(3);
  });
  it('除零抛出中文错误', () => {
    expect(() => computeToolResult('calculator', { expression: '1/0' })).toThrow('除数不能为零');
    expect(() => computeToolResult('calculator', { expression: '5%0' })).toThrow('除数不能为零');
  });
  it('非法表达式抛错', () => {
    expect(() => computeToolResult('calculator', { expression: '1+' })).toThrow('表达式不合法');
    expect(() => computeToolResult('calculator', { expression: '1 2' })).toThrow('表达式不合法');
    expect(() => computeToolResult('calculator', { expression: '(1+2' })).toThrow('括号不匹配');
    expect(() => computeToolResult('calculator', { expression: '1+2)' })).toThrow('括号不匹配');
    expect(() => computeToolResult('calculator', { expression: '' })).toThrow('表达式不能为空');
    expect(() => computeToolResult('calculator', { expression: '1@2' })).toThrow('包含非法字符');
    expect(() => computeToolResult('calculator', { expression: 'sqrt(-1)' })).toThrow('计算结果不是有效数字');
  });
  it('未知函数抛出中文错误', () => {
    expect(() => computeToolResult('calculator', { expression: 'foo(1)' })).toThrow('未知的函数或常量: foo');
  });
});

describe('证件照生成 id-photo', () => {
  it('一寸规格：295×413px 25×35mm', () => {
    const r = computeToolResult('id-photo', { size: 'one' });
    expect(r).toMatchObject({ size: 'one', name: '一寸', widthPx: 295, heightPx: 413, widthMm: 25, heightMm: 35 });
  });
  it('二寸规格：413×579px 35×49mm', () => {
    const r = computeToolResult('id-photo', { size: 'two' });
    expect(r).toMatchObject({ size: 'two', name: '二寸', widthPx: 413, heightPx: 579, widthMm: 35, heightMm: 49 });
  });
  it('小二寸规格：413×531px 35×45mm', () => {
    const r = computeToolResult('id-photo', { size: 'small-two' });
    expect(r).toMatchObject({ size: 'small-two', name: '小二寸', widthPx: 413, heightPx: 531, widthMm: 35, heightMm: 45 });
  });
  it('非法尺寸抛错', () => {
    expect(() => computeToolResult('id-photo', { size: 'three' })).toThrow('不支持的证件照尺寸');
    expect(() => computeToolResult('id-photo', {})).toThrow('不支持的证件照尺寸');
  });
});

describe('命运转盘 wheel', () => {
  it('从选项中随机挑选并返回索引与总数', () => {
    const opts = ['红色', '绿色', '蓝色'];
    for (let i = 0; i < 20; i++) {
      const r = computeToolResult('wheel', { options: opts });
      expect(opts).toContain(r.picked);
      expect(r.index).toBe(opts.indexOf(r.picked));
      expect(r.total).toBe(3);
    }
  });
  it('空字符串与纯空白选项会被去除', () => {
    const r = computeToolResult('wheel', { options: ['', '  ', '奖品A', '奖品B'] });
    expect(['奖品A', '奖品B']).toContain(r.picked);
    expect(r.total).toBe(2);
  });
  it('去空后不足 2 项抛错', () => {
    expect(() => computeToolResult('wheel', { options: ['唯一'] })).toThrow('至少需要 2 项');
    expect(() => computeToolResult('wheel', { options: ['a', ''] })).toThrow('至少需要 2 项');
    expect(() => computeToolResult('wheel', { options: [] })).toThrow('至少需要 2 项');
  });
});

describe('舒尔特方格 schulte', () => {
  it('5×5 网格各评级档位（基准 13.75s）', () => {
    expect(computeToolResult('schulte', { grid: 5, timeMs: 13000 }).rating).toBe('优秀');
    expect(computeToolResult('schulte', { grid: 5, timeMs: 13750 }).rating).toBe('优秀'); // 边界：恰好等于基准
    expect(computeToolResult('schulte', { grid: 5, timeMs: 15000 }).rating).toBe('良好');
    expect(computeToolResult('schulte', { grid: 5, timeMs: 20625 }).rating).toBe('良好'); // 边界：1.5 倍基准
    expect(computeToolResult('schulte', { grid: 5, timeMs: 25000 }).rating).toBe('中等');
    expect(computeToolResult('schulte', { grid: 5, timeMs: 27500 }).rating).toBe('中等'); // 边界：2 倍基准
    expect(computeToolResult('schulte', { grid: 5, timeMs: 27501 }).rating).toBe('继续训练');
    expect(computeToolResult('schulte', { grid: 5, timeMs: 60000 }).rating).toBe('继续训练');
  });
  it('6×6 网格基准 19.8s', () => {
    expect(computeToolResult('schulte', { grid: 6, timeMs: 19800 }).rating).toBe('优秀');
    expect(computeToolResult('schulte', { grid: 6, timeMs: 39601 }).rating).toBe('继续训练');
  });
  it('返回 grid/timeMs/seconds 字段', () => {
    const r = computeToolResult('schulte', { grid: 5, timeMs: 13750 });
    expect(r.grid).toBe(5);
    expect(r.timeMs).toBe(13750);
    expect(r.seconds).toBe(14);
  });
  it('网格越界（4 / 11 / 非整数）抛错', () => {
    expect(() => computeToolResult('schulte', { grid: 4, timeMs: 1000 })).toThrow('网格规格必须在 5-10 范围内');
    expect(() => computeToolResult('schulte', { grid: 11, timeMs: 1000 })).toThrow('网格规格必须在 5-10 范围内');
    expect(() => computeToolResult('schulte', { grid: 5.5, timeMs: 1000 })).toThrow('网格规格必须为整数');
  });
  it('timeMs 非正数抛错', () => {
    expect(() => computeToolResult('schulte', { grid: 5, timeMs: 0 })).toThrow('完成用时必须大于 0');
    expect(() => computeToolResult('schulte', { grid: 5, timeMs: -100 })).toThrow('完成用时必须大于 0');
  });
});

describe('SBTI 人格测试 sbti', () => {
  const entjScores = { E: 10, I: 5, S: 3, N: 7, T: 8, F: 2, J: 6, P: 4 };
  it('按各维倾向计算 4 字母类型与百分比', () => {
    const r = computeToolResult('sbti', { scores: entjScores });
    expect(r.type).toBe('ENTJ');
    expect(r.typeName).toBe('指挥官');
    expect(r.dimensions).toHaveLength(4);
    expect(r.dimensions[0]).toMatchObject({ name: 'E/I', first: 'E', second: 'I', firstPct: 67, secondPct: 33 });
    expect(r.dimensions[1]).toMatchObject({ name: 'S/N', first: 'N', second: 'S', firstPct: 70, secondPct: 30 });
    expect(r.dimensions[2]).toMatchObject({ name: 'T/F', first: 'T', second: 'F', firstPct: 80, secondPct: 20 });
    expect(r.dimensions[3]).toMatchObject({ name: 'J/P', first: 'J', second: 'P', firstPct: 60, secondPct: 40 });
  });
  it('内向组合 INTJ 判型为建筑师', () => {
    const r = computeToolResult('sbti', { scores: { E: 2, I: 9, S: 1, N: 8, T: 7, F: 3, J: 5, P: 2 } });
    expect(r.type).toBe('INTJ');
    expect(r.typeName).toBe('建筑师');
  });
  it('平分维度取前侧字母且各 50%', () => {
    const r = computeToolResult('sbti', { scores: { E: 5, I: 5, S: 3, N: 7, T: 8, F: 2, J: 6, P: 4 } });
    expect(r.dimensions[0]).toMatchObject({ first: 'E', firstPct: 50, secondPct: 50 });
    expect(r.type).toBe('ENTJ');
  });
  it('缺少维度得分抛错', () => {
    const s: any = { ...entjScores }; delete s.P;
    expect(() => computeToolResult('sbti', { scores: s })).toThrow('维度得分不完整');
  });
});

describe('MBTI 人格测试 mbti', () => {
  it('与 SBTI 相同算法：同一得分得到同一类型', () => {
    const scores = { E: 4, I: 6, S: 8, N: 2, T: 1, F: 9, J: 2, P: 8 };
    const r = computeToolResult('mbti', { scores });
    expect(r.type).toBe('ISFP');
    expect(r.typeName).toBe('探险家');
    const s2 = computeToolResult('sbti', { scores });
    expect(r.type).toBe(s2.type);
    expect(r.dimensions).toEqual(s2.dimensions);
  });
  it('缺少维度得分抛错', () => {
    const scores = { E: 1, I: 2, S: 3, N: 4, T: 5, F: 6, J: 7 };
    expect(() => computeToolResult('mbti', { scores })).toThrow('维度得分不完整');
  });
});

describe('黑暗三角人格 dark-triad', () => {
  it('三项得分与等级（低/中/高）计算', () => {
    const r = computeToolResult('dark-triad', { scores: { machiavellianism: 20, psychopathy: 50, narcissism: 80 } });
    expect(r.dimensions).toHaveLength(3);
    expect(r.dimensions[0]).toMatchObject({ key: 'machiavellianism', name: '马基雅维利主义', score: 20, level: '低' });
    expect(r.dimensions[1]).toMatchObject({ key: 'psychopathy', name: '精神病态', score: 50, level: '中' });
    expect(r.dimensions[2]).toMatchObject({ key: 'narcissism', name: '自恋', score: 80, level: '高' });
    expect(r.overall.score).toBe(50);
    expect(r.overall.level).toBe('中');
  });
  it('等级边界：34 进入中档，67 进入高档', () => {
    const r = computeToolResult('dark-triad', {
      scores: { machiavellianism: 33.9, psychopathy: 34, narcissism: 66.9 }
    });
    expect(r.dimensions[0].level).toBe('低');
    expect(r.dimensions[1].level).toBe('中');
    expect(r.dimensions[2].level).toBe('中');
    const r2 = computeToolResult('dark-triad', { scores: { machiavellianism: 67, psychopathy: 67, narcissism: 100 } });
    expect(r2.dimensions[0].level).toBe('高');
    expect(r2.overall.score).toBeCloseTo(78, 1);
    expect(r2.overall.level).toBe('高');
  });
  it('缺少维度或超出 0-100 抛错', () => {
    expect(() => computeToolResult('dark-triad', { scores: { machiavellianism: 10, psychopathy: 20 } })).toThrow();
    const bad = { machiavellianism: 101, psychopathy: 20, narcissism: 30 };
    expect(() => computeToolResult('dark-triad', { scores: bad })).toThrow('范围内');
  });
});

describe('七宗罪VS七美德 seven-sins', () => {
  const fullScores = { pride: 80, envy: 10, wrath: 20, sloth: 30, greed: 40, gluttony: 50, lust: 60 };
  it('七个维度返回罪与对应美德', () => {
    const r = computeToolResult('seven-sins', { scores: fullScores });
    expect(r.dimensions).toHaveLength(7);
    expect(r.dimensions[0]).toMatchObject({ key: 'pride', sin: '傲慢', virtue: '谦逊', score: 80 });
    expect(r.dimensions[3]).toMatchObject({ key: 'sloth', sin: '懒惰', virtue: '勤勉', score: 30 });
    expect(r.dimensions[6]).toMatchObject({ key: 'lust', sin: '色欲', virtue: '贞洁', score: 60 });
  });
  it('得分最高的罪判定为主导倾向并写入 summary', () => {
    const r = computeToolResult('seven-sins', { scores: fullScores });
    expect(r.dominant).toMatchObject({ key: 'pride', sin: '傲慢', virtue: '谦逊', score: 80 });
    expect(r.summary).toContain('傲慢');
    expect(r.summary).toContain('谦逊');
  });
  it('并列最高时取顺序靠前的一项', () => {
    const r = computeToolResult('seven-sins', {
      scores: { pride: 10, envy: 99, wrath: 5, sloth: 30, greed: 99, gluttony: 50, lust: 60 }
    });
    expect(r.dominant).toMatchObject({ key: 'envy', sin: '嫉妒', virtue: '宽容' });
  });
  it('缺少维度抛错', () => {
    const s: any = { ...fullScores }; delete s.greed;
    expect(() => computeToolResult('seven-sins', { scores: s })).toThrow();
  });
});

describe('未知工具', () => {
  it('未支持的 toolKey 抛错', () => {
    expect(() => computeToolResult('foo-tool', {})).toThrow('未支持的工具');
  });
});
