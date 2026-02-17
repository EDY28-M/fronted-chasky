<template>
  <div class="w-full max-w-[400px] bg-surface shadow-soft flex flex-col relative min-h-[560px] rounded-lg overflow-hidden">
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
        Recuperar contraseña
      </p>
    </div>
    <form class="flex flex-col px-12 pb-12 space-y-6 flex-grow justify-center" @submit.prevent="onSubmit">
      <p class="text-text-muted text-sm text-center -mt-2">
        Ingrese su correo para recibir las instrucciones de restablecimiento.
      </p>
      <div class="space-y-2">
        <label class="block text-text-muted text-[11px] font-bold uppercase tracking-widest pl-1" for="email">
          Correo electrónico
        </label>
        <input
          id="email"
          v-model="email"
          type="email"
          autocomplete="email"
          class="block w-full border border-gray-300 bg-gray-50 px-4 py-3 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-primary focus:border-primary text-sm transition-all duration-200 ease-out rounded-sm"
          placeholder="email@ejemplo.com"
        />
      </div>
      <p v-if="message" :class="messageSuccess ? 'text-green-600' : 'text-red-600'" class="text-sm">
        {{ message }}
      </p>
      <button
        type="submit"
        :disabled="loading"
        class="w-full h-14 bg-primary hover:bg-primary-dark text-white font-sans font-semibold text-sm uppercase tracking-[0.15em] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl flex items-center justify-center rounded-sm disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {{ loading ? 'Enviando...' : 'Enviar instrucciones' }}
      </button>
      <router-link
        :to="{ name: 'Login' }"
        class="text-center text-xs text-text-muted hover:text-primary transition-colors font-medium"
      >
        ← Volver al inicio de sesión
      </router-link>
    </form>
    <div class="bg-gray-50 py-4 text-center border-t border-gray-100">
      <p class="text-[10px] text-gray-400">Secure access for authorized personnel only</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authApi } from '@/services/api/auth'

const router = useRouter()
const email = ref('')
const loading = ref(false)
const message = ref('')
const messageSuccess = ref(false)

async function onSubmit() {
  if (!email.value) {
    message.value = 'Ingrese su correo electrónico'
    messageSuccess.value = false
    return
  }
  loading.value = true
  message.value = ''
  try {
    const res = await authApi.forgotPassword(email.value)
    const payload = res.data ?? res
    message.value = payload?.message ?? 'Si el correo existe, recibirás las instrucciones.'
    messageSuccess.value = true
    // En modo desarrollo (APP_DEBUG), el API devuelve token: redirigir a definir credenciales
    const token = payload?.token ?? res?.token
    if (token) {
      router.push({
        name: 'DefinirCredenciales',
        query: { token, email: email.value },
      })
    }
  } catch (e) {
    const errMsg = e.response?.data?.message ?? e.response?.data?.errors?.email?.[0]
    message.value = errMsg ?? 'Error al enviar. Intente de nuevo.'
    messageSuccess.value = false
  } finally {
    loading.value = false
  }
}
</script>
