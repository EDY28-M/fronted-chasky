import { http } from './client'

export const authApi = {
  async login(email, password) {
    const { data } = await http.post('/api/v1/auth/login', {
      email,
      password,
    })
    return data
  },
  logout() {
    return http.post('/api/v1/auth/logout')
  },
  me() {
    return http.get('/api/v1/auth/me')
  },
  async forgotPassword(email) {
    const { data } = await http.post('/api/v1/auth/forgot-password', { email })
    return data
  },
  async resetPassword({ email, token, password, password_confirmation }) {
    const { data } = await http.post('/api/v1/auth/reset-password', {
      email,
      token,
      password,
      password_confirmation,
    })
    return data
  },
  async changePassword({ current_password, password, password_confirmation }) {
    const { data } = await http.put('/api/v1/auth/password', {
      current_password,
      password,
      password_confirmation,
    })
    return data
  },
}
