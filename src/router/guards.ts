import type { Router } from 'vue-router'
import { useUserStore } from '@/stores/user'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    document.title = `${to.meta.title || 'Music Player'} | Music Player`

    const userStore = useUserStore()

    if (to.meta.requiresAuth && !userStore.isLoggedIn) {
      next({ name: 'Login', query: { redirect: to.fullPath } })
    } else {
      next()
    }
  })
}
