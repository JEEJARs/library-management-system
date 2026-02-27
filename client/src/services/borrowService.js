import api from './api'

export const borrowService = {
  async borrowBooks(data) {
    const response = await api.post('/borrow/borrow', data)
    return response.data
  },

  async returnRequest(data) {
    const response = await api.post('/borrow/return-request', data)
    return response.data
  },

  async confirmReturn(data) {
    const response = await api.post('/borrow/confirm-return', data)
    return response.data
  },

  async getPendingReturns() {
    const response = await api.get('/borrow/pending-returns')
    return response.data
  },

  async getUserHistory(studentId) {
    const response = await api.get(`/borrow/history/${studentId}`)
    return response.data
  },

  async getAdminHistory() {
    const response = await api.get('/borrow/admin-history')
    return response.data
  },

  async getDashboardStats() {
    const response = await api.get('/borrow/dashboard-stats')
    return response.data
  }
}
