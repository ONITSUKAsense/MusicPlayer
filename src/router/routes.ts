import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('@/layouts/DefaultLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/home/index.vue'),
        meta: { title: '音乐播放器' },
      },
      {
        path: 'upload',
        name: 'Upload',
        component: () => import('@/pages/upload/index.vue'),
        meta: { title: '上传音乐' },
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/pages/settings/index.vue'),
        meta: { title: '设置' },
      },
      {
        path: 'about',
        name: 'About',
        component: () => import('@/pages/about/index.vue'),
        meta: { title: '关于' },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

export default routes
