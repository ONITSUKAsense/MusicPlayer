import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User } from '@/types/music'
import { storage } from '@/utils/storage'
import { TOKEN_KEY, USER_KEY } from '@/utils/constants'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(storage.get<User>(USER_KEY))
  const token = ref<string | null>(storage.get<string>(TOKEN_KEY))

  const isLoggedIn = computed(() => !!token.value && !!user.value)
  const isVip = computed(() => user.value?.isVip ?? false)

  function setUser(userData: User) {
    user.value = userData
    storage.set(USER_KEY, userData)
  }

  function setToken(newToken: string) {
    token.value = newToken
    storage.set(TOKEN_KEY, newToken)
  }

  function login(userData: User, newToken: string) {
    setUser(userData)
    setToken(newToken)
  }

  function logout() {
    user.value = null
    token.value = null
    storage.remove(TOKEN_KEY)
    storage.remove(USER_KEY)
  }

  function updateUser(partial: Partial<User>) {
    if (user.value) {
      Object.assign(user.value, partial)
      storage.set(USER_KEY, user.value)
    }
  }

  return {
    user,
    token,
    isLoggedIn,
    isVip,
    setUser,
    setToken,
    login,
    logout,
    updateUser,
  }
})
