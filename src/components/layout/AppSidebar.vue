<template>
  <aside
    class="w-16 sm:w-20 lg:w-64 bg-surface border-r border-border-subtle flex flex-col z-20 h-screen sticky top-0 transition-all duration-300 flex-shrink-0 overflow-hidden"
  >
    <div class="h-14 sm:h-16 flex items-center justify-center lg:justify-start lg:px-6 border-b border-border-subtle shrink-0">
      <div class="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
        <span class="material-symbols-outlined text-[18px]">temple_buddhist</span>
      </div>
      <span class="ml-3 font-serif font-bold text-lg text-gray-900 hidden lg:block tracking-tight">Zen Dojo</span>
    </div>
    <nav class="flex-1 py-6 px-3 space-y-1 overflow-y-auto">
      <router-link
        to="/"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
        :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Dashboard' }"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">dashboard</span>
        <span class="ml-3 hidden lg:block">Dashboard</span>
      </router-link>
      <router-link
        :to="{ name: 'Students' }"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
        :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Students' }"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">groups</span>
        <span class="ml-3 hidden lg:block">Alumnos</span>
      </router-link>
      <router-link
        :to="{ name: 'Senseis' }"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
        :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Senseis' }"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">sports_martial_arts</span>
        <span class="ml-3 hidden lg:block">Senseis</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Académico</span>
      </div>
      <router-link :to="{ name: 'MartialArts' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'MartialArts' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">sports_martial_arts</span>
        <span class="ml-3 hidden lg:block">Artes marciales</span>
      </router-link>
      <router-link :to="{ name: 'Grades' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Grades' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">military_tech</span>
        <span class="ml-3 hidden lg:block">Grados</span>
      </router-link>
      <router-link :to="{ name: 'Exams' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Exams' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">assignment</span>
        <span class="ml-3 hidden lg:block">Exámenes</span>
      </router-link>
      <router-link :to="{ name: 'Progress' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Progress' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">trending_up</span>
        <span class="ml-3 hidden lg:block">Progreso</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Operaciones</span>
      </div>
      <router-link :to="{ name: 'Rooms' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Rooms' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">meeting_room</span>
        <span class="ml-3 hidden lg:block">Salas</span>
      </router-link>
      <router-link :to="{ name: 'ClasesHorarios' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'ClasesHorarios' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">calendar_month</span>
        <span class="ml-3 hidden lg:block">Clases y horarios</span>
      </router-link>
      <router-link :to="{ name: 'Attendance' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Attendance' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">how_to_reg</span>
        <span class="ml-3 hidden lg:block">Asistencia</span>
      </router-link>
      <router-link :to="{ name: 'Leads' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Leads' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">person_search</span>
        <span class="ml-3 hidden lg:block">Leads (CRM)</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Finanzas</span>
      </div>
      <router-link :to="{ name: 'Branches' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Branches' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">business</span>
        <span class="ml-3 hidden lg:block">Sucursales</span>
      </router-link>
      <router-link :to="{ name: 'Plans' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Plans' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">subscriptions</span>
        <span class="ml-3 hidden lg:block">Planes</span>
      </router-link>
      <router-link :to="{ name: 'Enrollments' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Enrollments' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">school</span>
        <span class="ml-3 hidden lg:block">Matrículas</span>
      </router-link>
      <router-link :to="{ name: 'Invoices' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Invoices' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">receipt</span>
        <span class="ml-3 hidden lg:block">Facturas</span>
      </router-link>
      <router-link :to="{ name: 'Payments' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Payments' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">payments</span>
        <span class="ml-3 hidden lg:block">Pagos</span>
      </router-link>
      <router-link :to="{ name: 'Debts' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Debts' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">warning</span>
        <span class="ml-3 hidden lg:block">Deudas</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Caja</span>
      </div>
      <router-link :to="{ name: 'Registers' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Registers' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">point_of_sale</span>
        <span class="ml-3 hidden lg:block">Cajas</span>
      </router-link>
      <router-link :to="{ name: 'Sessions' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Sessions' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">event_available</span>
        <span class="ml-3 hidden lg:block">Sesiones</span>
      </router-link>
      <router-link :to="{ name: 'Movements' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Movements' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">swap_horiz</span>
        <span class="ml-3 hidden lg:block">Movimientos</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Legal</span>
      </div>
      <router-link :to="{ name: 'Documents' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Documents' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">description</span>
        <span class="ml-3 hidden lg:block">Documentos</span>
      </router-link>
      <router-link :to="{ name: 'SignedDocuments' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'SignedDocuments' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">draw</span>
        <span class="ml-3 hidden lg:block">Firmados</span>
      </router-link>
      <div class="pt-2 pb-1 px-3 hidden lg:block">
        <span class="text-[10px] font-semibold text-text-muted uppercase tracking-wider">Inventario</span>
      </div>
      <router-link :to="{ name: 'InventoryCategories' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'InventoryCategories' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">category</span>
        <span class="ml-3 hidden lg:block">Categorías</span>
      </router-link>
      <router-link :to="{ name: 'Suppliers' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Suppliers' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">local_shipping</span>
        <span class="ml-3 hidden lg:block">Proveedores</span>
      </router-link>
      <router-link :to="{ name: 'Products' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'Products' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">inventory_2</span>
        <span class="ml-3 hidden lg:block">Productos</span>
      </router-link>
      <router-link :to="{ name: 'StockMovements' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'StockMovements' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">swap_vert</span>
        <span class="ml-3 hidden lg:block">Mov. stock</span>
      </router-link>
      <router-link :to="{ name: 'StockAlerts' }" class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors" :class="{ 'bg-gray-50 text-primary font-medium': $route.name === 'StockAlerts' }">
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">notification_important</span>
        <span class="ml-3 hidden lg:block">Alertas stock</span>
      </router-link>
    </nav>
    <div class="p-4 border-t border-border-subtle">
      <a
        href="#"
        class="flex items-center px-2 py-2 rounded-md text-text-muted hover:text-gray-900 group transition-colors"
      >
        <span class="material-symbols-outlined text-xl sm:text-2xl group-hover:text-primary">settings</span>
        <span class="ml-3 hidden lg:block text-sm">Settings</span>
      </a>
      <button
        type="button"
        class="flex items-center px-2 py-2 mt-1 rounded-md text-text-muted hover:text-gray-900 group transition-colors w-full text-left"
        @click="handleLogout"
      >
        <span class="material-symbols-outlined text-xl sm:text-2xl group-hover:text-primary">logout</span>
        <span class="ml-3 hidden lg:block text-sm">Logout</span>
      </button>
    </div>
  </aside>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()

function handleLogout() {
  authStore.logout()
  router.push({ name: 'Login' })
}
</script>
