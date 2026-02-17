<template>
  <header
    class="bg-surface/90 backdrop-blur-md border-b border-border-subtle h-14 sm:h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 gap-2 sm:gap-4 sticky top-0 z-30 shrink-0"
  >
    <h2 class="text-base sm:text-lg lg:text-xl font-serif font-bold text-gray-800 truncate min-w-0">
      Sensei Dashboard
    </h2>
    <div class="flex items-center gap-2 sm:gap-4 lg:gap-6 shrink-0">
      <div class="relative hidden sm:block">
        <span class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <span class="material-symbols-outlined text-gray-400 text-[18px] sm:text-[20px]">search</span>
        </span>
        <input
          v-model="searchQuery"
          type="text"
          class="block w-32 sm:w-44 lg:w-64 pl-9 sm:pl-10 pr-3 py-1.5 sm:py-2 border border-gray-200 rounded-full leading-5 bg-gray-50 placeholder-gray-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-colors"
          placeholder="Search student or class..."
        />
      </div>
      <button
        type="button"
        class="relative p-1.5 sm:p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none flex-shrink-0"
      >
        <span class="material-symbols-outlined text-[22px] sm:text-[24px]">notifications</span>
        <span class="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 block h-2 w-2 rounded-full bg-primary ring-2 ring-white" />
      </button>
      <div class="flex items-center gap-2 sm:gap-3 border-l border-gray-200 pl-2 sm:pl-4 lg:pl-6">
        <div class="text-right hidden sm:block max-w-[120px] lg:max-w-none truncate">
          <p class="text-xs sm:text-sm font-medium text-gray-900 truncate">{{ user?.name ?? 'Admin Dojo' }}</p>
          <p class="text-[10px] sm:text-xs text-gray-500 truncate">{{ user?.role ?? 'Head Instructor' }}</p>
        </div>
        <img
          alt="Instructor Profile"
          class="h-8 w-8 sm:h-9 sm:w-9 rounded-full object-cover border border-gray-200 shadow-sm flex-shrink-0"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuB9W9UGM7IHZFj8xPxX-uUED_65D6HCd4n76w6XhNKBkWFR0xlU3G5vHpWljkqG4SWnPLxpKfAVxnMlgo23J4KL3EejYj6IOHeTgpPAkhQMEWQhfghd4-Qj9wHZbna9FodlrbzYt5eNheyZwcQvsLRfTgz7mLUsF5jF0TG_znsq3BH8mfLq8q2vEg-fX9Qrj7IVFSyO4OZlRMF9lboYiNLpQWgRxIi-5csUMEr5elPWupTrQBPI9rXDLqS80eh9vLm9Ola7T0zfxfw"
        />
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const searchQuery = ref('')
const authStore = useAuthStore()
const user = computed(() => authStore.user)
</script>
