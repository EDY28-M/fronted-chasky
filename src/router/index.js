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
      // Members
      { path: 'students', name: 'Students', component: () => import('@/views/members/StudentsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'senseis', name: 'Senseis', component: () => import('@/views/members/SenseisView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Academic
      { path: 'martial-arts', name: 'MartialArts', component: () => import('@/views/academic/MartialArtsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'grades', name: 'Grades', component: () => import('@/views/academic/GradesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'exams', name: 'Exams', component: () => import('@/views/academic/ExamsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'progress', name: 'Progress', component: () => import('@/views/academic/ProgressView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Operations
      { path: 'rooms', name: 'Rooms', component: () => import('@/views/operations/RoomsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'clases-horarios', name: 'ClasesHorarios', component: () => import('@/views/operations/ClasesHorariosView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'classes', name: 'Classes', component: () => import('@/views/operations/ClassesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'schedules', name: 'Schedules', component: () => import('@/views/operations/SchedulesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'attendance', name: 'Attendance', component: () => import('@/views/operations/AttendanceView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // CRM
      { path: 'leads', name: 'Leads', component: () => import('@/views/crm/LeadsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Financial
      { path: 'branches', name: 'Branches', component: () => import('@/views/financial/BranchesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'plans', name: 'Plans', component: () => import('@/views/financial/PlansView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'enrollments', name: 'Enrollments', component: () => import('@/views/financial/EnrollmentsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'invoices', name: 'Invoices', component: () => import('@/views/financial/InvoicesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'payments', name: 'Payments', component: () => import('@/views/financial/PaymentsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'debts', name: 'Debts', component: () => import('@/views/financial/DebtsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Cash Register
      { path: 'registers', name: 'Registers', component: () => import('@/views/cashRegister/RegistersView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'sessions', name: 'Sessions', component: () => import('@/views/cashRegister/SessionsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'movements', name: 'Movements', component: () => import('@/views/cashRegister/MovementsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Legal
      { path: 'documents', name: 'Documents', component: () => import('@/views/legal/DocumentsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'signed-documents', name: 'SignedDocuments', component: () => import('@/views/legal/SignedDocumentsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      // Inventory
      { path: 'inventory/categories', name: 'InventoryCategories', component: () => import('@/views/inventory/CategoriesView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'inventory/suppliers', name: 'Suppliers', component: () => import('@/views/inventory/SuppliersView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'inventory/products', name: 'Products', component: () => import('@/views/inventory/ProductsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'inventory/movements', name: 'StockMovements', component: () => import('@/views/inventory/StockMovementsView.vue'), meta: { layout: 'app', requiresAuth: true } },
      { path: 'inventory/alerts', name: 'StockAlerts', component: () => import('@/views/inventory/StockAlertsView.vue'), meta: { layout: 'app', requiresAuth: true } },
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
