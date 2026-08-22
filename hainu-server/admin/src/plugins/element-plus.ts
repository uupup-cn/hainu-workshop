import i18n from '@/locales'
import { LanguageEnum } from '@/enums/appEnum'

type ElMessageBoxInstance =
  (typeof import('element-plus/es/components/message-box'))['ElMessageBox']
type MessageBoxMethod = ElMessageBoxInstance['confirm']
type MessageBoxArgs = Parameters<MessageBoxMethod>
type MessageBoxOptions = NonNullable<MessageBoxArgs[2]>

let localePatchTask: Promise<void> | undefined

const getMessageBoxLocale = () => {
  const locale =
    typeof i18n.global.locale === 'string' ? i18n.global.locale : i18n.global.locale.value

  return locale === LanguageEnum.EN
    ? {
        confirmButtonText: 'OK',
        cancelButtonText: 'Cancel'
      }
    : {
        confirmButtonText: '确认',
        cancelButtonText: '取消'
      }
}

const withLocalizedButtons = (options?: MessageBoxOptions): MessageBoxOptions => ({
  ...getMessageBoxLocale(),
  ...options
})

const scheduleIdleTask = (task: () => void) => {
  const idleCallback = globalThis.requestIdleCallback

  if (typeof idleCallback === 'function') {
    idleCallback(() => task(), { timeout: 1500 })
    return
  }

  globalThis.setTimeout(task, 300)
}

const patchMessageBoxMethod = (
  ElMessageBox: ElMessageBoxInstance,
  methodName: 'alert' | 'confirm' | 'prompt'
) => {
  const originalMethod = ElMessageBox[methodName].bind(ElMessageBox)

  ElMessageBox[methodName] = ((...args: MessageBoxArgs) => {
    const [message, title, options] = args
    return originalMethod(message, title, withLocalizedButtons(options))
  }) as MessageBoxMethod
}

export const setupElementPlusLocale = () => {
  localePatchTask ??= new Promise<void>((resolve) => {
    scheduleIdleTask(resolve)
  }).then(async () => {
    const { ElMessageBox } = await import('element-plus/es/components/message-box/index.mjs')

    patchMessageBoxMethod(ElMessageBox, 'alert')
    patchMessageBoxMethod(ElMessageBox, 'confirm')
    patchMessageBoxMethod(ElMessageBox, 'prompt')
  })

  return localePatchTask
}
