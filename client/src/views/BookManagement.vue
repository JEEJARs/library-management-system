<template>
  <div class="card">
    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px;">
      <h2>Book Management</h2>
      <button @click="showAddModal = true" class="btn btn-success">Add New Book</button>
    </div>
    
    <div v-if="loading" class="text-center">Loading...</div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th>Book ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.book_id }}</td>
          <td>{{ book.title }}</td>
          <td>{{ book.Category?.name || 'N/A' }}</td>
          <td>
            <span :class="getStatusClass(book.status)">
              {{ book.status.toUpperCase() }}
            </span>
          </td>
          <td>
            <button @click="editBook(book)" class="btn" style="margin-right: 10px;">Edit</button>
            <button @click="deleteBook(book.id)" class="btn btn-danger">Delete</button>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="books.length === 0 && !loading" class="text-center">
      No books found.
    </div>

    <!-- Add Book Modal -->
    <div v-if="showAddModal" class="modal">
      <div class="modal-content">
        <h3>Add New Book</h3>
        <form @submit.prevent="addBook">
          <div class="form-group">
            <label>Book ID:</label>
            <input v-model="newBook.book_id" type="text" required />
          </div>
          <div class="form-group">
            <label>Title:</label>
            <input v-model="newBook.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="newBook.category_id" required>
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="newBook.status" required>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success" :disabled="submitting">
              {{ submitting ? 'Adding...' : 'Add Book' }}
            </button>
            <button type="button" @click="showAddModal = false" class="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>

    <!-- Edit Book Modal -->
    <div v-if="showEditModal" class="modal">
      <div class="modal-content">
        <h3>Edit Book</h3>
        <form @submit.prevent="updateBook">
          <div class="form-group">
            <label>Book ID:</label>
            <input v-model="editingBook.book_id" type="text" required />
          </div>
          <div class="form-group">
            <label>Title:</label>
            <input v-model="editingBook.title" type="text" required />
          </div>
          <div class="form-group">
            <label>Category:</label>
            <select v-model="editingBook.category_id" required>
              <option value="">Select Category</option>
              <option v-for="category in categories" :key="category.id" :value="category.id">
                {{ category.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label>Status:</label>
            <select v-model="editingBook.status" required>
              <option value="available">Available</option>
              <option value="borrowed">Borrowed</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
          <div style="display: flex; gap: 10px;">
            <button type="submit" class="btn btn-success" :disabled="submitting">
              {{ submitting ? 'Updating...' : 'Update Book' }}
            </button>
            <button type="button" @click="showEditModal = false" class="btn">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { bookService } from '../services/bookService'
import { categoryService } from '../services/categoryService'

export default {
  name: 'BookManagement',
  data() {
    return {
      books: [],
      categories: [],
      loading: false,
      submitting: false,
      showAddModal: false,
      showEditModal: false,
      newBook: {
        book_id: '',
        title: '',
        category_id: '',
        status: 'available'
      },
      editingBook: null
    }
  },
  async mounted() {
    await this.fetchData()
  },
  methods: {
    async fetchData() {
      this.loading = true
      try {
        const [booksRes, categoriesRes] = await Promise.all([
          bookService.getAllBooks(),
          categoryService.getAllCategories()
        ])
        this.books = booksRes
        this.categories = categoriesRes
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        this.loading = false
      }
    },

    async addBook() {
      this.submitting = true
      try {
        await bookService.createBook(this.newBook)
        this.showAddModal = false
        this.resetNewBook()
        await this.fetchData()
      } catch (error) {
        console.error('Error adding book:', error)
        alert('Error adding book: ' + (error.response?.data?.message || error.message))
      } finally {
        this.submitting = false
      }
    },

    async updateBook() {
      this.submitting = true
      try {
        await bookService.updateBook(this.editingBook.id, this.editingBook)
        this.showEditModal = false
        this.editingBook = null
        await this.fetchData()
      } catch (error) {
        console.error('Error updating book:', error)
        alert('Error updating book: ' + (error.response?.data?.message || error.message))
      } finally {
        this.submitting = false
      }
    },

    async deleteBook(bookId) {
      if (!confirm('Are you sure you want to delete this book?')) {
        return
      }

      try {
        await bookService.deleteBook(bookId)
        await this.fetchData()
      } catch (error) {
        console.error('Error deleting book:', error)
        alert('Error deleting book: ' + (error.response?.data?.message || error.message))
      }
    },

    editBook(book) {
      this.editingBook = { ...book }
      this.showEditModal = true
    },

    resetNewBook() {
      this.newBook = {
        book_id: '',
        title: '',
        category_id: '',
        status: 'available'
      }
    },

    getStatusClass(status) {
      return {
        'status-available': status === 'available',
        'status-borrowed': status === 'borrowed',
        'status-overdue': status === 'overdue'
      }
    }
  }
}
</script>

<style scoped>
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 30px;
  border-radius: 8px;
  width: 90%;
  max-width: 500px;
}

.modal h3 {
  margin-bottom: 20px;
}
</style>
