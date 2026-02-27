<template>
  <div class="card">
    <h2>Return Books</h2>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>
    
    <form @submit.prevent="handleReturn">
      <div class="form-group">
        <label>Student ID:</label>
        <input 
          v-model="studentId" 
          type="text" 
          required 
          placeholder="Enter your student ID"
          @input="fetchBorrowedBooks"
        />
      </div>
      
      <div v-if="borrowedBooks.length > 0" class="form-group">
        <label>Select Books to Return:</label>
        <div style="max-height: 300px; overflow-y: auto; border: 1px solid #ddd; padding: 10px;">
          <div v-for="book in borrowedBooks" :key="book.id" style="margin-bottom: 10px;">
            <label style="display: flex; align-items: center; cursor: pointer;">
              <input 
                type="checkbox" 
                :value="book.id" 
                v-model="selectedBooks"
                style="margin-right: 10px;"
              />
              <span>
                {{ book.Book.book_id }} - {{ book.Book.title }} 
                (Due: {{ book.due_date }})
              </span>
            </label>
          </div>
        </div>
      </div>
      
      <button 
        v-if="borrowedBooks.length > 0"
        type="submit" 
        class="btn" 
        :disabled="loading || selectedBooks.length === 0"
      >
        {{ loading ? 'Processing...' : `Request Return (${selectedBooks.length} books)` }}
      </button>
    </form>
    
    <div v-if="borrowedBooks.length > 0" style="margin-top: 30px;">
      <h3>Currently Borrowed Books</h3>
      <table class="table">
        <thead>
          <tr>
            <th>Book ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Borrow Date</th>
            <th>Due Date</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="book in borrowedBooks" :key="book.id">
            <td>{{ book.Book.book_id }}</td>
            <td>{{ book.Book.title }}</td>
            <td>{{ book.Book.Category?.name || 'N/A' }}</td>
            <td>{{ book.borrow_date }}</td>
            <td>{{ book.due_date }}</td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <div v-if="studentId && borrowedBooks.length === 0 && !loading" class="text-center">
      No borrowed books found for this student ID.
    </div>
  </div>
</template>

<script>
import { borrowService } from '../services/borrowService'

export default {
  name: 'Return',
  data() {
    return {
      studentId: '',
      borrowedBooks: [],
      selectedBooks: [],
      loading: false,
      error: '',
      success: ''
    }
  },
  methods: {
    async fetchBorrowedBooks() {
      if (!this.studentId) {
        this.borrowedBooks = []
        return
      }
      
      this.loading = true
      try {
        const history = await borrowService.getUserHistory(this.studentId)
        this.borrowedBooks = history.filter(book => !book.return_confirmed)
        this.selectedBooks = []
      } catch (error) {
        console.error('Error fetching borrowed books:', error)
        this.borrowedBooks = []
      } finally {
        this.loading = false
      }
    },
    
    async handleReturn() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await borrowService.returnRequest({
          student_id: this.studentId,
          book_ids: this.selectedBooks
        })
        
        this.success = 'Return request submitted successfully! Please wait for admin confirmation.'
        this.selectedBooks = []
        
        await this.fetchBorrowedBooks()
      } catch (error) {
        this.error = error.response?.data?.message || 'Return request failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
