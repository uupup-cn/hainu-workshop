import type { FormRules } from 'element-plus'

export type SystemParamDialogMode = 'add' | 'edit'

export const valueTypeOptions = [
  { label: '单行文本', value: 'STRING' },
  { label: '多行文本', value: 'TEXT' },
  { label: '数字', value: 'NUMBER' },
  { label: '布尔值', value: 'BOOLEAN' },
  { label: 'JSON 对象', value: 'JSON' }
] satisfies Array<{ label: string; value: Api.Settings.SystemParamValueType }>

/**
 * 创建参数管理搜索表单的默认值，保证重置和初始化使用同一份结构。
 * @returns 参数查询表单初始值。
 */
export function createSystemParamSearchForm(): Api.Settings.SystemParamSearchParams {
  return {
    current: 1,
    size: 10,
    keyword: '',
    groupCode: '',
    valueType: undefined,
    enabled: undefined,
    builtIn: undefined
  }
}

/**
 * 创建参数编辑表单的默认值。
 * @returns 参数新增/编辑表单初始值。
 */
export function createSystemParamForm() {
  return {
    name: '',
    key: '',
    groupCode: '',
    groupName: '',
    valueType: 'STRING' as Api.Settings.SystemParamValueType,
    value: '',
    defaultValue: '',
    optionsText: '',
    sort: 1,
    enabled: true,
    builtIn: false,
    remark: ''
  }
}

/**
 * 获取参数值类型的中文展示名称。
 * @param value 参数值类型枚举。
 * @returns 参数值类型名称。
 */
export function resolveValueTypeLabel(value: Api.Settings.SystemParamValueType) {
  return valueTypeOptions.find((item) => item.value === value)?.label || value
}

/**
 * 获取参数值类型对应的标签颜色。
 * @param value 参数值类型枚举。
 * @returns Element Plus 标签类型。
 */
export function resolveValueTypeTag(value: Api.Settings.SystemParamValueType) {
  switch (value) {
    case 'NUMBER':
      return 'success'
    case 'BOOLEAN':
      return 'warning'
    case 'JSON':
      return 'danger'
    case 'TEXT':
      return 'info'
    default:
      return 'primary'
  }
}

/**
 * 创建参数表单校验规则，并根据当前参数类型动态校验参数值。
 * @param getForm 获取最新表单状态的方法。
 * @returns Element Plus 表单校验规则。
 */
export function createSystemParamRules(
  getForm: () => ReturnType<typeof createSystemParamForm>
): FormRules {
  /**
   * 校验参数键名和分组编码，限制为稳定的程序可读标识。
   */
  const validateKey = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!String(value || '').trim()) {
      callback(new Error('请输入参数键名'))
      return
    }
    if (!/^[a-zA-Z][a-zA-Z0-9._-]*$/.test(value.trim())) {
      callback(new Error('仅支持字母、数字、点、下划线和中划线，且需以字母开头'))
      return
    }
    callback()
  }

  /**
   * 校验扩展配置，允许为空，非空时必须是 JSON 对象。
   */
  const validateOptions = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    if (!String(value || '').trim()) {
      callback()
      return
    }
    try {
      const parsed = JSON.parse(value)
      if (Array.isArray(parsed) || typeof parsed !== 'object' || parsed === null) {
        callback(new Error('扩展配置必须是 JSON 对象'))
        return
      }
      callback()
    } catch {
      callback(new Error('扩展配置不是合法 JSON'))
    }
  }

  /**
   * 按参数值类型校验参数值内容。
   */
  const validateValue = (_rule: unknown, value: string, callback: (error?: Error) => void) => {
    const normalized = String(value || '').trim()
    if (!normalized) {
      callback(new Error('请输入参数值'))
      return
    }

    if (getForm().valueType === 'NUMBER' && Number.isNaN(Number(normalized))) {
      callback(new Error('数字类型参数值必须是有效数字'))
      return
    }

    if (getForm().valueType === 'JSON') {
      try {
        JSON.parse(normalized)
      } catch {
        callback(new Error('JSON 类型参数值格式错误'))
        return
      }
    }

    callback()
  }

  return {
    name: [{ required: true, message: '请输入参数名称', trigger: 'blur' }],
    key: [{ validator: validateKey, trigger: 'blur' }],
    groupCode: [{ validator: validateKey, trigger: 'blur' }],
    groupName: [{ required: true, message: '请输入分组名称', trigger: 'blur' }],
    valueType: [{ required: true, message: '请选择参数类型', trigger: 'change' }],
    value: [{ validator: validateValue, trigger: 'blur' }],
    optionsText: [{ validator: validateOptions, trigger: 'blur' }]
  }
}

/**
 * 将表单状态转换为后端接口需要的提交载荷。
 * @param form 参数表单状态。
 * @returns 参数创建/更新载荷。
 */
export function buildSystemParamPayload(form: ReturnType<typeof createSystemParamForm>) {
  const optionsText = String(form.optionsText || '').trim()
  return {
    name: form.name.trim(),
    key: form.key.trim(),
    groupCode: form.groupCode.trim(),
    groupName: form.groupName.trim(),
    valueType: form.valueType,
    value: String(form.value || '').trim(),
    defaultValue: String(form.defaultValue || '').trim(),
    options: optionsText ? JSON.parse(optionsText) : undefined,
    sort: form.sort,
    enabled: form.enabled,
    builtIn: form.builtIn,
    remark: String(form.remark || '').trim()
  } satisfies Api.Settings.SystemParamPayload
}
