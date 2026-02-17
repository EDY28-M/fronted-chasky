import { http } from './client'

const base = '/api/v1/members'

function unwrap(res) {
  return res.data
}

export const membersApi = {
  // Students (alumnos)
  getStudents(params = {}) {
    return http.get(`${base}/students`, { params }).then(unwrap)
  },
  getStudent(id) {
    return http.get(`${base}/students/${id}`).then(unwrap)
  },
  createStudent(data) {
    return http.post(`${base}/students`, data).then(unwrap)
  },
  updateStudent(id, data) {
    return http.put(`${base}/students/${id}`, data).then(unwrap)
  },
  deleteStudent(id) {
    return http.delete(`${base}/students/${id}`).then(unwrap)
  },

  // Senseis
  getSenseis(params = {}) {
    return http.get(`${base}/senseis`, { params }).then(unwrap)
  },
  getSensei(id) {
    return http.get(`${base}/senseis/${id}`).then(unwrap)
  },
  createSensei(data) {
    return http.post(`${base}/senseis`, data).then(unwrap)
  },
  updateSensei(id, data) {
    return http.put(`${base}/senseis/${id}`, data).then(unwrap)
  },
  deleteSensei(id) {
    return http.delete(`${base}/senseis/${id}`).then(unwrap)
  },
}
