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
      <a
        href="#"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">groups</span>
        <span class="ml-3 hidden lg:block">Students</span>
      </a>
      <a
        href="#"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">calendar_month</span>
        <span class="ml-3 hidden lg:block">Schedule</span>
      </a>
      <a
        href="#"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">military_tech</span>
        <span class="ml-3 hidden lg:block">Promotions</span>
      </a>
      <a
        href="#"
        class="sidebar-item flex items-center px-3 py-3 rounded-md text-text-muted hover:bg-gray-50 hover:text-gray-900 group transition-colors"
      >
        <span class="material-symbols-outlined icon-box text-xl sm:text-2xl">payments</span>
        <span class="ml-3 hidden lg:block">Billing</span>
      </a>
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
