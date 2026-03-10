import type { RouteRecordRaw } from 'vue-router'

export const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
    meta: {
      guestOnly: true,
    },
  },
  {
    path: '/',
    component: () => import('@/layouts/MainLayout.vue'),
    meta: {
      requiresAuth: true,
    },
    children: [
      {
        path: '',
        redirect: {
          name: 'home',
        },
      },
      {
        path: 'home',
        name: 'home',
        component: () => import('@/views/HomeView.vue'),
      },
      {
        path: 'assistant',
        name: 'assistant',
        component: () => import('@/views/AssistantView.vue'),
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/home',
  },
]
