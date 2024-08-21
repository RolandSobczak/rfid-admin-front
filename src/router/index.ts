/**
 * router/index.ts
 *
 * Automatic routes for `./src/pages/*.vue`
 */

// Composabls
import { createRouter, createWebHistory } from 'vue-router/auto'
import { setupLayouts } from 'virtual:generated-layouts'
import { DefaultLayout, AuthLayout } from '@/layouts'

const customRoutes = [
  {
    path: '/',
    name: 'tenants',
    component: DefaultLayout,
    // meta: { requiresAuth: true }, // Example of adding custom meta info
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/pages/index.vue'),
      },
      {
        path: 'users',
        name: 'Users',
        component: () => import('@/pages/users.vue'),
      },
      {
        path: 'logs',
        name: 'Logs',
        component: () => import('@/pages/logs.vue'),
      },
      {
        path: 'backups',
        name: 'Backups',
        component: () => import('@/pages/backups.vue'),
      },
      {
        path: 'schedulers',
        name: 'Schedulers',
        component: () => import('@/pages/schedulers.vue'),
      },
    ],
  },
  {
    path: '/sign-in',
    component: AuthLayout,
    children: [
      {
        path: '',
        name: 'SignIn',
        component: () => import('@/pages/auth/signin.vue'), // Lazy-loaded
      },
    ],
    // meta: { requiresAuth: true }, // Example of adding custom meta info
  },
];

// Combine the automatically generated routes with the custom ones
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: customRoutes,
})

router.beforeEach(async (to, from) => {
  if (
    !true && to.name !== 'SignIn'
  ) {
    return { name: 'SignIn' }
  }
})

// Workaround for https://github.com/vitejs/vite/issues/11804
router.onError((err, to) => {
  if (err?.message?.includes?.('Failed to fetch dynamically imported module')) {
    if (!localStorage.getItem('vuetify:dynamic-reload')) {
      console.log('Reloading page to fix dynamic import error')
      localStorage.setItem('vuetify:dynamic-reload', 'true')
      location.assign(to.fullPath)
    } else {
      console.error('Dynamic import error, reloading page did not fix it', err)
    }
  } else {
    console.error(err)
  }
})

router.isReady().then(() => {
  localStorage.removeItem('vuetify:dynamic-reload')
})

export default router
