import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import type { ThemeMode, Language } from '@/types/music'
import { storage } from '@/utils/storage'
import { THEME_KEY, LANGUAGE_KEY } from '@/utils/constants'
import i18n from '@/locales'

export const useThemeStore = defineStore('theme', () => {
  const themeMode = ref<ThemeMode>(storage.get<ThemeMode>(THEME_KEY) || 'dark')
  const language = ref<Language>(storage.get<Language>(LANGUAGE_KEY) || 'zh-CN')

  function setTheme(mode: ThemeMode) {
    themeMode.value = mode
    storage.set(THEME_KEY, mode)
    applyTheme()
  }

  function toggleTheme() {
    setTheme(themeMode.value === 'dark' ? 'light' : 'dark')
  }

  function setLanguage(lang: Language) {
    language.value = lang
    storage.set(LANGUAGE_KEY, lang)
    i18n.global.locale.value = lang
  }

  function applyTheme() {
    if (themeMode.value === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // Auto-apply on init
  applyTheme()

  watch(themeMode, () => {
    applyTheme()
  })

  return {
    themeMode,
    language,
    setTheme,
    toggleTheme,
    setLanguage,
  }
})
