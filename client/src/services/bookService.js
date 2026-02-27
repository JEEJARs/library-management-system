import api from './api'

export const bookService = {
  async getAllBooks(params = {}) {
    const response = await api.get('/books', { params })
    return response.data
  },

  async createBook(bookData) {
    const response = await api.post('/books', bookData)
    return response.data
  },

  async updateBook(id, bookData) {
    const response = await api.put(`/books/${id}`, bookData)
    return response.data
  },

  async deleteBook(id) {
    const response = await api.delete(`/books/${id}`)
    return response.data
  },

  async getTopBorrowedBooks() {
    const response = await api.get('/books/top-borrowed')
    return response.data
  }
}
