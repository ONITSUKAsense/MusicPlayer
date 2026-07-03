import { defineStore } from 'pinia'
import { ref, watch } from 'vue'
import { storage } from '@/utils/storage'

export const useThemeStore = defineStore('theme', () => {
  const themeMode = ref<'dark' | 'light'>(
    (storage.get<'dark' | 'light'>('theme')) || 'dark'
  )

  function applyTheme(mode: 'dark' | 'light') {
    document.documentElement.setAttribute('data-theme', mode)
  }

  // Apply immediately on store creation (no flash)
  applyTheme(themeMode.value)

  watch(themeMode, (v) => {
    storage.set('theme', v)
    applyTheme(v)
  })

  function toggleTheme() {
    themeMode.value = themeMode.value === 'dark' ? 'light' : 'dark'
  }

  return { themeMode, toggleTheme }
})
