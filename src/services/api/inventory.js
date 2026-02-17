import { http } from './client'

const base = '/api/v1/inventory'

function unwrap(res) {
  return res.data
}

export const inventoryApi = {
  // Categories
  getCategories(params = {}) {
    return http.get(`${base}/categories`, { params }).then(unwrap)
  },
  createCategory(data) {
    return http.post(`${base}/categories`, data).then(unwrap)
  },
  updateCategory(id, data) {
    return http.put(`${base}/categories/${id}`, data).then(unwrap)
  },

  // Suppliers
  getSuppliers(params = {}) {
    return http.get(`${base}/suppliers`, { params }).then(unwrap)
  },
  createSupplier(data) {
    return http.post(`${base}/suppliers`, data).then(unwrap)
  },
  updateSupplier(id, data) {
    return http.put(`${base}/suppliers/${id}`, data).then(unwrap)
  },

  // Products
  getProducts(params = {}) {
    return http.get(`${base}/products`, { params }).then(unwrap)
  },
  createProduct(data) {
    return http.post(`${base}/products`, data).then(unwrap)
  },
  updateProduct(id, data) {
    return http.put(`${base}/products/${id}`, data).then(unwrap)
  },
  deleteProduct(id) {
    return http.delete(`${base}/products/${id}`).then(unwrap)
  },

  // Stock movements
  getStockMovements(params = {}) {
    return http.get(`${base}/stock-movements`, { params }).then(unwrap)
  },
  createStockMovement(data) {
    return http.post(`${base}/stock-movements`, data).then(unwrap)
  },

  getStockAlerts() {
    return http.get(`${base}/stock-alerts`).then(unwrap)
  },
}
