import type { Router } from 'vue-router'

export function setupRouterGuards(router: Router) {
  router.beforeEach((to, _from, next) => {
    document.title = to.meta.title
      ? `${to.meta.title} | Aurora`
      : 'Aurora'
    next()
  })
}
