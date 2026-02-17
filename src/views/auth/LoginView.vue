<template>
  <div class="w-full max-w-[400px] bg-surface shadow-soft flex flex-col relative min-h-[600px] rounded-lg overflow-hidden">
    <div class="pt-16 pb-8 px-12 text-center flex-grow-0">
      <div
        class="w-16 h-16 mx-auto mb-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
      >
        <span class="material-symbols-outlined text-3xl">temple_buddhist</span>
      </div>
      <h1 class="text-4xl font-serif font-bold text-gray-900 tracking-tight mb-2">Zen Dojo</h1>
      <p
        class="text-text-muted text-xs uppercase tracking-[0.2em] font-medium border-t border-gray-100 pt-4 mt-2 inline-block px-4"
      >
        Instructor Portal
      </p>
    </div>
    <form class="flex flex-col px-12 pb-12 space-y-8 flex-grow justify-center" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-text-muted text-[11px] font-bold uppercase tracking-widest pl-1" for="email">
          Correo / Dojo ID
        </label>
        <input
          id="email"
          v-model="form.email"
          type="email"
          name="email"
          autocomplete="email"
          class="block w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200 ease-out rounded-sm"
          placeholder="email@ejemplo.com"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-text-muted text-[11px] font-bold uppercase tracking-widest pl-1" for="password">
          Passcode
        </label>
        <input
          id="password"
          v-model="form.password"
          type="password"
          name="password"
          autocomplete="current-password"
          class="block w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200 ease-out rounded-sm"
          placeholder="••••••••"
        />
      </div>
      <div class="flex justify-between items-center pt-1">
        <label class="flex items-center space-x-2 cursor-pointer group">
          <input v-model="form.remember" type="checkbox" class="form-checkbox h-3.5 w-3.5 text-primary border-gray-300 rounded focus:ring-primary focus:ring-opacity-25 transition-colors" />
          <span class="text-xs text-text-muted group-hover:text-gray-900 transition-colors select-none"
            >Remember me</span
          >
        </label>
        <router-link
          :to="{ name: 'RecuperarContrasena' }"
          class="text-xs text-text-muted hover:text-primary transition-colors font-medium border-b border-transparent hover:border-primary pb-0.5"
        >
          Recovery
        </router-link>
      </div>
      <p v-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full h-14 bg-primary hover:bg-primary-dark text-white font-sans font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl mt-6 flex items-center justify-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {{ loading ? '...' : 'Enter Dojo' }}
      </button>
    </form>
    <div class="bg-gray-50 py-4 text-center border-t border-gray-100">
      <p class="text-[10px] text-gray-400">Secure access for authorized personnel only</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const router = useRouter()
const authStore = useAuthStore()
const loading = ref(false)
const error = ref('')

const form = reactive({
  email: '',
  password: '',
  remember: false,
})

async function onSubmit() {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    router.push({ name: 'Dashboard' })
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Invalid credentials. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
