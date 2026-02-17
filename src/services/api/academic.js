import { http } from './client'

const base = '/api/v1/academic'

/** @returns {Promise<{ data: { data: any[], current_page, last_page, per_page, total }, success, message }>} */
function unwrap(res) {
  return res.data
}

export const academicApi = {
  // Martial Arts
  getArts(params = {}) {
    return http.get(`${base}/martial-arts`, { params }).then(unwrap)
  },
  getArt(id) {
    return http.get(`${base}/martial-arts/${id}`).then(unwrap)
  },
  createArt(data) {
    return http.post(`${base}/martial-arts`, data).then(unwrap)
  },
  updateArt(id, data) {
    return http.put(`${base}/martial-arts/${id}`, data).then(unwrap)
  },
  deleteArt(id) {
    return http.delete(`${base}/martial-arts/${id}`).then(unwrap)
  },

  // Grades
  getGrades(params = {}) {
    return http.get(`${base}/grades`, { params }).then(unwrap)
  },
  getGrade(id) {
    return http.get(`${base}/grades/${id}`).then(unwrap)
  },
  createGrade(data) {
    return http.post(`${base}/grades`, data).then(unwrap)
  },
  updateGrade(id, data) {
    return http.put(`${base}/grades/${id}`, data).then(unwrap)
  },
  deleteGrade(id) {
    return http.delete(`${base}/grades/${id}`).then(unwrap)
  },

  // Exams
  getExams(params = {}) {
    return http.get(`${base}/exams`, { params }).then(unwrap)
  },
  getExam(id) {
    return http.get(`${base}/exams/${id}`).then(unwrap)
  },
  createExam(data) {
    return http.post(`${base}/exams`, data).then(unwrap)
  },
  evaluateExam(id, data) {
    return http.put(`${base}/exams/${id}/evaluate`, data).then(unwrap)
  },
  deleteExam(id) {
    return http.delete(`${base}/exams/${id}`).then(unwrap)
  },

  // Progress
  getProgress(params = {}) {
    return http.get(`${base}/progress`, { params }).then(unwrap)
  },
  createProgress(data) {
    return http.post(`${base}/progress`, data).then(unwrap)
  },
}
