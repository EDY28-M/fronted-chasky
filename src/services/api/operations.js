import { http } from './client'

const base = '/api/v1/operations'

function unwrap(res) {
  return res.data
}

export const operationsApi = {
  // Rooms
  getRooms(params = {}) {
    return http.get(`${base}/rooms`, { params }).then(unwrap)
  },
  getRoom(id) {
    return http.get(`${base}/rooms/${id}`).then(unwrap)
  },
  createRoom(data) {
    return http.post(`${base}/rooms`, data).then(unwrap)
  },
  updateRoom(id, data) {
    return http.put(`${base}/rooms/${id}`, data).then(unwrap)
  },
  deleteRoom(id) {
    return http.delete(`${base}/rooms/${id}`).then(unwrap)
  },

  // Classes
  getClasses(params = {}) {
    return http.get(`${base}/classes`, { params }).then(unwrap)
  },
  getClass(id) {
    return http.get(`${base}/classes/${id}`).then(unwrap)
  },
  createClass(data) {
    return http.post(`${base}/classes`, data).then(unwrap)
  },
  updateClass(id, data) {
    return http.put(`${base}/classes/${id}`, data).then(unwrap)
  },
  deleteClass(id) {
    return http.delete(`${base}/classes/${id}`).then(unwrap)
  },

  // Schedules
  getSchedules(params = {}) {
    return http.get(`${base}/schedules`, { params }).then(unwrap)
  },
  createSchedule(data) {
    return http.post(`${base}/schedules`, data).then(unwrap)
  },
  updateSchedule(id, data) {
    return http.put(`${base}/schedules/${id}`, data).then(unwrap)
  },
  deleteSchedule(id) {
    return http.delete(`${base}/schedules/${id}`).then(unwrap)
  },

  // Attendance
  getAttendance(params = {}) {
    return http.get(`${base}/attendance`, { params }).then(unwrap)
  },
  createAttendance(data) {
    return http.post(`${base}/attendance`, data).then(unwrap)
  },
  bulkAttendance(records) {
    return http.post(`${base}/attendance/bulk`, { records }).then(unwrap)
  },
}
