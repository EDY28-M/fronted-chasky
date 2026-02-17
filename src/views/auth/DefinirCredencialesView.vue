<template>
  <div class="w-full max-w-[400px] bg-surface shadow-soft flex flex-col relative min-h-[640px] rounded-lg overflow-hidden">
    <div class="pt-16 pb-6 px-12 text-center flex-grow-0">
      <div
        class="w-16 h-16 mx-auto mb-6 bg-primary text-white rounded-full flex items-center justify-center shadow-md"
      >
        <span class="material-symbols-outlined text-3xl">temple_buddhist</span>
      </div>
      <h1 class="text-3xl font-serif font-bold text-gray-900 tracking-tight mb-2">Zen Dojo</h1>
      <p
        class="text-text-muted text-xs uppercase tracking-[0.2em] font-medium border-t border-gray-100 pt-4 mt-2 inline-block px-4"
      >
        Definir credenciales
      </p>
    </div>
    <p v-if="!hasToken && !isAuthenticated" class="px-12 text-sm text-text-muted text-center">
      Usa el enlace que enviamos a tu correo para restablecer la contraseña.
      <router-link :to="{ name: 'RecuperarContrasena' }" class="text-primary hover:underline">Solicitar nuevo enlace</router-link>
    </p>
    <form v-else class="flex flex-col px-12 pb-12 space-y-6 flex-grow justify-center" @submit.prevent="onSubmit">
      <div class="space-y-2">
        <label class="block text-text-muted text-[11px] font-bold uppercase tracking-widest pl-1" for="new-password">
          Nueva contraseña
        </label>
        <input
          id="new-password"
          v-model="form.newPassword"
          type="password"
          autocomplete="new-password"
          class="block w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200 ease-out rounded-sm"
          placeholder="••••••••"
        />
      </div>
      <div class="space-y-2">
        <label class="block text-text-muted text-[11px] font-bold uppercase tracking-widest pl-1" for="confirm-password">
          Confirmar contraseña
        </label>
        <input
          id="confirm-password"
          v-model="form.confirmPassword"
          type="password"
          autocomplete="new-password"
          class="block w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200 ease-out rounded-sm"
          placeholder="••••••••"
        />
      </div>
      <div class="space-y-2 pl-1">
        <div class="flex items-center gap-2">
          <span
            class="w-1.5 h-1.5 rounded-full transition-colors"
            :class="criteria.length ? 'bg-primary' : 'bg-gray-200'"
          />
          <span class="text-[11px] font-medium" :class="criteria.length ? 'text-gray-900' : 'text-text-muted'">
            8+ caracteres
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="w-1.5 h-1.5 rounded-full transition-colors"
            :class="criteria.upper ? 'bg-primary' : 'bg-gray-200'"
          />
          <span class="text-[11px] font-medium" :class="criteria.upper ? 'text-gray-900' : 'text-text-muted'">
            1 mayúscula
          </span>
        </div>
        <div class="flex items-center gap-2">
          <span
            class="w-1.5 h-1.5 rounded-full transition-colors"
            :class="criteria.number ? 'bg-primary' : 'bg-gray-200'"
          />
          <span class="text-[11px] font-medium" :class="criteria.number ? 'text-gray-900' : 'text-text-muted'">
            1 número
          </span>
        </div>
      </div>
      <p v-if="successMessage" class="text-sm text-green-600">{{ successMessage }}</p>
      <p v-else-if="error" class="text-sm text-red-600">{{ error }}</p>
      <button
        type="submit"
        :disabled="loading || !allCriteriaMet"
        class="w-full h-14 bg-primary hover:bg-primary-dark text-white font-sans font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl flex items-center justify-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {{ loading ? '...' : 'Actualizar credenciales' }}
      </button>
      <router-link
        :to="{ name: 'Login' }"
        class="text-center text-xs text-text-muted hover:text-primary transition-colors font-medium"
      >
        Cancelar
      </router-link>
    </form>
    <div class="bg-gray-50 py-4 text-center border-t border-gray-100">
      <p class="text-[10px] text-gray-400">Secure access for authorized personnel only</p>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { authApi } from '@/services/api/auth'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const form = reactive({
  email: route.query.email ?? '',
  token: route.query.token ?? '',
  newPassword: '',
  confirmPassword: '',
})
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

const hasToken = computed(() => !!(form.token && form.email))
const isAuthenticated = computed(() => authStore.isAuthenticated)

const criteria = computed(() => ({
  length: form.newPassword.length >= 8,
  upper: /[A-Z]/.test(form.newPassword),
  number: /\d/.test(form.newPassword),
}))

const allCriteriaMet = computed(
  () => criteria.value.length && criteria.value.upper && criteria.value.number
)

onMounted(() => {
  form.token = route.query.token ?? form.token
  form.email = route.query.email ?? form.email
})

async function onSubmit() {
  error.value = ''
  successMessage.value = ''
  if (form.newPassword !== form.confirmPassword) {
    error.value = 'Las contraseñas no coinciden'
    return
  }
  if (!allCriteriaMet.value) return
  if (!hasToken.value) {
    error.value = 'Falta el token. Usa el enlace de tu correo.'
    return
  }
  loading.value = true
  try {
    await authApi.resetPassword({
      email: form.email,
      token: form.token,
      password: form.newPassword,
      password_confirmation: form.confirmPassword,
    })
    successMessage.value = 'Contraseña actualizada. Redirigiendo al login...'
    setTimeout(() => router.push({ name: 'Login' }), 2000)
  } catch (e) {
    error.value = e.response?.data?.message ?? 'Error al actualizar. Intente de nuevo.'
  } finally {
    loading.value = false
  }
}
</script>
