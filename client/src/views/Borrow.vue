<template>
  <div class="card">
    <h2>Borrow Books</h2>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>
    
    <form @submit.prevent="handleBorrow">
      <div class="form-group">
        <label>Student ID:</label>
        <input 
          v-model="studentId" 
          type="text" 
          required 
          placeholder="Enter your student ID"
        />
      </div>
      
      <div class="form-group">
        <label>Select Books to Borrow:</label>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">
          <div v-for="book in availableBooks" :key="book.id" style="margin-bottom: 10px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input 
                type="checkbox" 
                :value="book.id" 
                v-model="selectedBooks"
                style="margin-right: 10px;"
              />
              <span>{{ book.book_id }} - {{ book.title }} ({{ book.Category?.name }})</span>
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
</template>

<script>
import { bookService } from '../services/bookService'
import { borrowService } from '../services/borrowService'

export default {
  name: 'Borrow',
  data() {
    return {
      studentId: '',
      selectedBooks: [],
      availableBooks: [],
      loading: false,
      error: '',
      success: ''
    }
  },
  async mounted() {
    await this.fetchAvailableBooks()
  },
  methods: {
    async fetchAvailableBooks() {
      try {
        const allBooks = await bookService.getAllBooks()
        this.availableBooks = allBooks.filter(book => book.status === 'available')
      } catch (error) {
        console.error('Error fetching books:', error)
      }
    },
    
    async handleBorrow() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await borrowService.borrowBooks({
          student_id: this.studentId,
          book_ids: this.selectedBooks
        })
        
        this.success = 'Books borrowed successfully!'
        this.studentId = ''
        this.selectedBooks = []
        
        await this.fetchAvailableBooks()
      } catch (error) {
        this.error = error.response?.data?.message || 'Borrow failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
