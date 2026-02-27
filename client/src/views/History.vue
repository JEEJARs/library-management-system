<template>
  <div class="card">
    <h2>Borrowing History</h2>
    
    <div class="form-group">
      <label>Enter Student ID:</label>
      <input 
        v-model="studentId" 
        type="text" 
        placeholder="Enter student ID"
        @input="fetchHistory"
      />
    </div>
    
    <div v-if="loading" class="text-center">Loading...</div>
    
    <table v-else-if="history.length > 0" class="table">
      <thead>
        <tr>
          <th>Book ID</th>
          <th>Category</th>
          <th>Title</th>
          <th>Borrow Date</th>
          <th>Return Date</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in history" :key="record.id">
          <td>{{ record.Book.book_id }}</td>
          <td>{{ record.Book.Category?.name || 'N/A' }}</td>
          <td>{{ record.Book.title }}</td>
          <td>{{ record.borrow_date }}</td>
          <td>{{ record.return_date || 'Not returned' }}</td>
          <td>
            <span :class="getStatusClass(record)">
              {{ getStatusText(record) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else-if="studentId && !loading" class="text-center">
      No history found for this student ID.
    </div>
    
    <div v-else class="text-center">
      Please enter a student ID to view borrowing history.
    </div>
  </div>
</template>

<script>
import { borrowService } from '../services/borrowService'

export default {
  name: 'History',
  data() {
    return {
      studentId: '',
      history: [],
      loading: false
    }
  },
  methods: {
    async fetchHistory() {
      if (!this.studentId) {
        this.history = []
        return
      }
      
      this.loading = true
      try {
        this.history = await borrowService.getUserHistory(this.studentId)
      } catch (error) {
        console.error('Error fetching history:', error)
        this.history = []
      } finally {
        this.loading = false
      }
    },
    
    getStatusClass(record) {
      if (record.return_confirmed) {
        return 'status-available'
      }
      
      const today = new Date()
      const dueDate = new Date(record.due_date)
      
      if (dueDate < today) {
        return 'status-overdue'
      }
      
      return 'status-borrowed'
    },
    
    getStatusText(record) {
      if (record.return_confirmed) {
        return 'RETURNED'
      }
      
      const today = new Date()
      const dueDate = new Date(record.due_date)
      
      if (dueDate < today) {
        return 'OVERDUE'
      }
      
      return 'BORROWED'
    }
  }
}
</script>
