import { createI18n } from 'vue-i18n'
import zhCN from './zh-CN'
import enUS from './en-US'
import { storage } from '@/utils/storage'
import { LANGUAGE_KEY } from '@/utils/constants'

const defaultLocale = storage.get<string>(LANGUAGE_KEY) || 'zh-CN'

const i18n = createI18n({
  legacy: false,
  locale: defaultLocale,
  fallbackLocale: 'zh-CN',
  messages: {
    'zh-CN': zhCN,
    'en-US': enUS,
  },
})

export default i18n
