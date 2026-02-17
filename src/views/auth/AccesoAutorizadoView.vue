<template>
  <div class="w-full max-w-[420px] bg-surface shadow-soft flex flex-col items-center justify-center py-16 px-12 rounded-lg overflow-hidden">
    <div class="w-20 h-20 mx-auto mb-8 bg-primary text-white rounded-full flex items-center justify-center shadow-md">
      <span class="material-symbols-outlined text-4xl">check_circle</span>
    </div>
    <h1 class="text-3xl sm:text-4xl font-serif font-bold text-primary tracking-tight text-center mb-2">
      Acceso autorizado
    </h1>
    <p class="text-text-muted text-sm text-center mb-10">
      Redireccionando al sistema...
    </p>
    <div class="w-full max-w-[200px] h-1 bg-gray-100 rounded-full overflow-hidden">
      <div
        class="h-full bg-primary rounded-full animate-pulse"
        style="width: 100%"
      />
    </div>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

onMounted(() => {
  const timer = setTimeout(() => {
    router.push({ name: 'Dashboard' })
  }, 2500)
  return () => clearTimeout(timer)
})
</script>
