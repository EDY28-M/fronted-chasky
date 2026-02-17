import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authApi } from '@/services/api/auth'

export const useAuthStore = defineStore('auth', () => {
  const token = ref(localStorage.getItem('token') || null)
  const user = ref(JSON.parse(localStorage.getItem('user') || 'null'))

  const isAuthenticated = computed(() => !!token.value)

  async function login(email, password) {
    const res = await authApi.login(email, password)
    // Laravel BaseController returns { success, message, data: { user, token, token_type } }
    const payload = res.data ?? res
    token.value = payload.token ?? payload.access_token
    user.value = payload.user ?? { name: 'Usuario', roles: [], permissions: [] }
    localStorage.setItem('token', token.value)
    localStorage.setItem('user', JSON.stringify(user.value))
  }

  async function logout() {
    try {
      await authApi.logout()
    } catch (_) {
      // ignore (token may already be invalid)
    }
    token.value = null
    user.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  return { token, user, isAuthenticated, login, logout }
})
