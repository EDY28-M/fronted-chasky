import { http } from './client'

const base = '/api/v1/financial'

function unwrap(res) {
  return res.data
}

export const financialApi = {
  // Branches
  getBranches(params = {}) {
    return http.get(`${base}/branches`, { params }).then(unwrap)
  },
  createBranch(data) {
    return http.post(`${base}/branches`, data).then(unwrap)
  },
  updateBranch(id, data) {
    return http.put(`${base}/branches/${id}`, data).then(unwrap)
  },

  // Plans (membership-plans)
  getPlans(params = {}) {
    return http.get(`${base}/membership-plans`, { params }).then(unwrap)
  },
  createPlan(data) {
    return http.post(`${base}/membership-plans`, data).then(unwrap)
  },
  updatePlan(id, data) {
    return http.put(`${base}/membership-plans/${id}`, data).then(unwrap)
  },

  // Enrollments
  getEnrollments(params = {}) {
    return http.get(`${base}/enrollments`, { params }).then(unwrap)
  },
  createEnrollment(data) {
    return http.post(`${base}/enrollments`, data).then(unwrap)
  },
  cancelEnrollment(id, data) {
    return http.put(`${base}/enrollments/${id}/cancel`, data).then(unwrap)
  },

  // Invoices
  getInvoices(params = {}) {
    return http.get(`${base}/invoices`, { params }).then(unwrap)
  },
  createInvoice(data) {
    return http.post(`${base}/invoices`, data).then(unwrap)
  },
  voidInvoice(id) {
    return http.post(`${base}/invoices/${id}/void`).then(unwrap)
  },

  // Payments
  getPayments(params = {}) {
    return http.get(`${base}/payments`, { params }).then(unwrap)
  },
  createPayment(data) {
    return http.post(`${base}/payments`, data).then(unwrap)
  },
  confirmPayment(id) {
    return http.post(`${base}/payments/${id}/confirm`).then(unwrap)
  },

  // Debts
  getDebts(params = {}) {
    return http.get(`${base}/debts`, { params }).then(unwrap)
  },
}
