import { http } from './client'

const base = '/api/v1/cash-register'

function unwrap(res) {
  return res.data
}

export const cashRegisterApi = {
  // Registers
  getRegisters(params = {}) {
    return http.get(`${base}/registers`, { params }).then(unwrap)
  },
  createRegister(data) {
    return http.post(`${base}/registers`, data).then(unwrap)
  },
  updateRegister(id, data) {
    return http.put(`${base}/registers/${id}`, data).then(unwrap)
  },

  // Sessions
  openSession(data) {
    return http.post(`${base}/sessions/open`, data).then(unwrap)
  },
  closeSession(id, data) {
    return http.post(`${base}/sessions/${id}/close`, data).then(unwrap)
  },

  // Movements
  getMovements(params = {}) {
    return http.get(`${base}/movements`, { params }).then(unwrap)
  },
  createMovement(data) {
    return http.post(`${base}/movements`, data).then(unwrap)
  },
}
