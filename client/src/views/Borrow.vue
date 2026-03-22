<template>
  <div class="card">
    <h2>Borrow Books</h2>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>
    
    <div v-if="loading" class="text-center">
      Loading available books...
    </div>
    
    <div v-else>
      <form @submit.prevent="handleBorrow">
        <div class="form-group">
          <label>Select Books to Borrow:</label>
          <div class="book-selection-list">
            <div v-for="book in availableBooks" :key="book.id" class="book-item">
              <label class="book-checkbox-label">
                <input 
                  type="checkbox" 
                  :value="book.id" 
                  v-model="selectedBooks"
                  class="book-checkbox"
                />
                <div class="book-info">
                  <span class="book-title">{{ book.title }}</span>
                  <span class="book-details">{{ book.book_id }} - {{ book.Category?.name }}</span>
                </div>
              </label>
            </div>
          </div>
        </div>
        
        <button 
          type="submit" 
          class="btn" 
          :disabled="loading || selectedBooks.length === 0"
        >
          {{ loading ? 'Processing...' : `Borrow Selected Books (${selectedBooks.length})` }}
        </button>
      </form>
      
      <div style="margin-top: 30px;">
        <h3>Available Books</h3>
        <table class="table">
          <thead>
            <tr>
              <th>Book ID</th>
              <th>Title</th>
              <th>Category</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in availableBooks" :key="book.id">
              <td>{{ book.book_id }}</td>
              <td>{{ book.title }}</td>
              <td>{{ book.Category?.name || 'N/A' }}</td>
              <td>
                <span class="status-available">{{ book.status.toUpperCase() }}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { bookService } from '../services/bookService'
import { borrowService } from '../services/borrowService'

export default {
  name: 'Borrow',
  data() {
    return {
      selectedBooks: [],
      availableBooks: [],
      loading: false,
      error: '',
      success: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  async mounted() {
    await this.fetchAvailableBooks()
  },
  methods: {
    async fetchAvailableBooks() {
      this.loading = true
      try {
        const allBooks = await bookService.getAllBooks()
        this.availableBooks = allBooks.filter(book => book.status === 'available')
      } catch (error) {
        console.error('Error fetching books:', error)
        this.error = 'Failed to fetch available books'
      } finally {
        this.loading = false
      }
    },
    
    async handleBorrow() {
      if (!this.user || !this.user.student_id) {
        this.error = 'User information not found. Please login again.'
        return
      }
      
      console.log('Borrowing books for student:', this.user.student_id)
      console.log('Selected books:', this.selectedBooks)
      
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        const result = await borrowService.borrowBooks({
          student_id: this.user.student_id,
          book_ids: this.selectedBooks
        })
        
        console.log('Borrow result:', result)
        
        this.success = 'Books borrowed successfully!'
        this.selectedBooks = []
        
        await this.fetchAvailableBooks()
      } catch (error) {
        console.error('Error borrowing books:', error)
        this.error = error.response?.data?.message || 'Borrow failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
