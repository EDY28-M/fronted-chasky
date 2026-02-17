import { http } from './client'

const base = '/api/v1/legal'

function unwrap(res) {
  return res.data
}

export const legalApi = {
  getDocuments(params = {}) {
    return http.get(`${base}/documents`, { params }).then(unwrap)
  },
  createDocument(data) {
    return http.post(`${base}/documents`, data).then(unwrap)
  },
  updateDocument(id, data) {
    return http.put(`${base}/documents/${id}`, data).then(unwrap)
  },

  getSignedDocuments(params = {}) {
    return http.get(`${base}/signed-documents`, { params }).then(unwrap)
  },
  createSignedDocument(data) {
    return http.post(`${base}/signed-documents`, data).then(unwrap)
  },
}
