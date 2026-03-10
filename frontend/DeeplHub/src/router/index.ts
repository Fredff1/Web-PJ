import { createRouter, createWebHistory } from 'vue-router'
import { routes } from './routes'
import { getToken } from '@/utils/token'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
})

router.beforeEach((to) => {
  const authenticated = Boolean(getToken())

  if (to.meta.requiresAuth && !authenticated) {
    return {
      name: 'login',
      query: {
        redirect: to.fullPath,
      },
    }
  }

  if (to.meta.guestOnly && authenticated) {
    return {
      name: 'home',
    }
  }

  return true
})

export default router
