<template>
  <div class="card">
    <h2>Pending Return Requests</h2>
    
    <div v-if="loading" class="text-center">Loading...</div>
    
    <div v-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <div v-if="success" class="alert alert-success">
      {{ success }}
    </div>
    
    <table v-if="pendingReturns.length > 0" class="table">
      <thead>
        <tr>
          <th>
            <input 
              type="checkbox" 
              @change="toggleSelectAll"
              :checked="selectedReturns.length === pendingReturns.length"
            />
          </th>
          <th>Book ID</th>
          <th>Title</th>
          <th>Category</th>
          <th>Borrower</th>
          <th>Student ID</th>
          <th>Borrow Date</th>
          <th>Due Date</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="returnReq in pendingReturns" :key="returnReq.id">
          <td>
            <input 
              type="checkbox" 
              :value="returnReq.id" 
              v-model="selectedReturns"
            />
          </td>
          <td>{{ returnReq.Book.book_id }}</td>
          <td>{{ returnReq.Book.title }}</td>
          <td>{{ returnReq.Book.Category?.name || 'N/A' }}</td>
          <td>{{ returnReq.User.full_name }}</td>
          <td>{{ returnReq.User.student_id }}</td>
          <td>{{ returnReq.borrow_date }}</td>
          <td>{{ returnReq.due_date }}</td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="pendingReturns.length > 0" style="margin-top: 20px;">
      <button 
        @click="confirmReturns" 
        class="btn btn-success"
        :disabled="selectedReturns.length === 0 || loading"
      >
        {{ loading ? 'Processing...' : `Confirm Selected Returns (${selectedReturns.length})` }}
      </button>
    </div>
    
    <div v-if="pendingReturns.length === 0 && !loading" class="text-center">
      No pending return requests.
    </div>
  </div>
</template>

<script>
import { borrowService } from '../services/borrowService'

export default {
  name: 'AdminReturns',
  data() {
    return {
      pendingReturns: [],
      selectedReturns: [],
      loading: false,
      error: '',
      success: ''
    }
  },
  async mounted() {
    await this.fetchPendingReturns()
  },
  methods: {
    async fetchPendingReturns() {
      this.loading = true
      try {
        this.pendingReturns = await borrowService.getPendingReturns()
      } catch (error) {
        console.error('Error fetching pending returns:', error)
        this.error = 'Failed to fetch pending returns'
      } finally {
        this.loading = false
      }
    },
    
    toggleSelectAll() {
      if (this.selectedReturns.length === this.pendingReturns.length) {
        this.selectedReturns = []
      } else {
        this.selectedReturns = this.pendingReturns.map(req => req.id)
      }
    },
    
    async confirmReturns() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await borrowService.confirmReturn({
          borrow_ids: this.selectedReturns
        })
        
        this.success = `Successfully confirmed ${this.selectedReturns.length} return(s)`
        this.selectedReturns = []
        
        await this.fetchPendingReturns()
      } catch (error) {
        this.error = error.response?.data?.message || 'Failed to confirm returns'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
