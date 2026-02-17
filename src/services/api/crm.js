import { http } from './client'

const base = '/api/v1/crm'

function unwrap(res) {
  return res.data
}

export const crmApi = {
  getLeads(params = {}) {
    return http.get(`${base}/leads`, { params }).then(unwrap)
  },
  createLead(data) {
    return http.post(`${base}/leads`, data).then(unwrap)
  },
  updateLead(id, data) {
    return http.put(`${base}/leads/${id}`, data).then(unwrap)
  },
  convertLead(id, data) {
    return http.put(`${base}/leads/${id}/convert`, data).then(unwrap)
  },
}
