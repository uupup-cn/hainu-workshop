import App from './App.vue'
import { createApp } from 'vue'
import { initStore } from './store'                 // Store
import { initRouter } from './router'               // Router
import language from './locales'                    // 国际化
import { LanguageEnum } from './enums/appEnum'
import { useSiteSettingsStore } from './store/modules/site-settings'
import { useUserStore } from './store/modules/user'
import '@styles/core/tailwind.css'                  // tailwind
import '@styles/index.scss'                         // 样式
import { setupGlobDirectives } from './directives'
import { setupErrorHandle } from './utils/sys/error-handle'
import { setupElementPlusLocale } from './plugins/element-plus'
import './utils/ui/iconify-loader'

document.addEventListener(
  'touchstart',
  function () {},
  { passive: false }
)

const bootstrap = async () => {
  const app = createApp(App)

  initStore(app)
  initRouter(app)
  setupGlobDirectives(app)
  setupErrorHandle(app)
  void setupElementPlusLocale()
  app.use(language)
  app.mount('#app')

  const userStore = useUserStore()
  const siteSettingsStore = useSiteSettingsStore()

  void siteSettingsStore.loadPublicSiteSettings().then(() => {
    if (!userStore.isLogin) {
      const targetLanguage =
        siteSettingsStore.publicConfig.defaultLanguage === 'en' ? LanguageEnum.EN : LanguageEnum.ZH

      userStore.setLanguage(targetLanguage)
    }
  })
}

bootstrap()
