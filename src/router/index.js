import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import LayoutWrapper from '@/layouts/LayoutWrapper.vue'

const routes = [
  {
    path: '/',
    component: LayoutWrapper,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/auth/LoginView.vue'),
        meta: { layout: 'auth', guest: true },
      },
      {
        path: 'recuperar-contrasena',
        name: 'RecuperarContrasena',
        component: () => import('@/views/auth/RecuperarContrasenaView.vue'),
        meta: { layout: 'auth', guest: true },
      },
      {
        path: 'definir-credenciales',
        name: 'DefinirCredenciales',
        component: () => import('@/views/auth/DefinirCredencialesView.vue'),
        meta: { layout: 'auth', guest: true },
      },
      {
        path: 'acceso-autorizado',
        name: 'AccesoAutorizado',
        component: () => import('@/views/auth/AccesoAutorizadoView.vue'),
        meta: { layout: 'auth', guest: true },
      },
      {
        path: '',
        name: 'Dashboard',
        component: () => import('@/views/dashboard/DashboardView.vue'),
        meta: { layout: 'app', requiresAuth: true },
      },
    ],
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, _from, next) => {
  const authStore = useAuthStore()
  const requiresAuth = to.matched.some((r) => r.meta.requiresAuth)
  const guestOnly = to.matched.some((r) => r.meta.guest)

  if (requiresAuth && !authStore.isAuthenticated) {
    next({ name: 'Login' })
    return
  }
  if (guestOnly && authStore.isAuthenticated && to.name === 'Login') {
    next({ name: 'Dashboard' })
    return
  }
  next()
})

export default router
