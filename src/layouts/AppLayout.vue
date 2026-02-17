<template>
  <div class="min-h-screen flex font-sans text-text-main antialiased bg-gray-50 overflow-x-hidden">
    <div class="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <img
        alt="Dojo Background"
        class="w-full h-full object-cover opacity-10 blur-[4px]"
        src="https://lh3.googleusercontent.com/aida-public/AB6AXuBUe3VeZgxXRN0-4YgpgbWyJLG5zgjqRvcbfZM8KpAy7YaPu0BI28rsMPJKQSaRanuRNQ8BswyTbIhfBz3X3YXnOvMSmU9OsJnsy_P-xvwwA9mwHERaZvGZiQMMLhIaHZz0fEe9BGbIL1k--nKe-01sOm11cXpE5I9d5R_jWScSttyk15GIOR_esPLwCtYWw82mGecWTxtZ2-baq9y49XkRhGHCHYqn-uMKw6XUA-cZcUux6Eie3u3knyPwcb5JVRJEBbZVNl9WRxk"
      />
      <div class="absolute inset-0 bg-white/80 mix-blend-lighten" />
    </div>
    <AppSidebar />
    <div class="flex-1 flex flex-col min-h-screen min-w-0 relative z-10">
      <AppHeader />
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto overflow-x-hidden w-full">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppHeader from '@/components/layout/AppHeader.vue'
</script>
