<template>
  <div class="card">
    <h2>คืนหนังสือ</h2>
    
    <div v-if="loading" class="text-center">
      กำลังโหลดข้อมูลหนังสือที่ยืม...
    </div>
    
    <div v-else-if="borrowedBooks.length > 0">
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>
      
      <form @submit.prevent="handleReturn">
        <div class="form-group">
          <label>เลือกหนังสือที่ต้องการคืน:</label>
          <div class="book-selection-list">
            <div v-for="book in borrowedBooks" :key="book.id" class="book-item">
              <label class="book-checkbox-label">
                <input 
                  type="checkbox" 
                  :value="book.id" 
                  v-model="selectedBooks"
                  class="book-checkbox"
                  @change="onCheckboxChange"
                />
                <div class="book-info">
                  <span class="book-title">{{ book.Book.title }}</span>
                  <span class="book-details">{{ book.Book.book_id }} - {{ book.Book.Category?.name }} (ครบกำหนด: {{ book.due_date }})</span>
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
          {{ loading ? 'กำลังดำเนินการ...' : `ขอคืนหนังสือ (${selectedBooks.length} เล่ม)` }}
        </button>
      </form>
      
      <div style="margin-top: 30px;">
        <h3>หนังสือที่ยืมอยู่</h3>
        <table class="table">
          <thead>
            <tr>
              <th>รหัสหนังสือ</th>
              <th>ชื่อหนังสือ</th>
              <th>หมวดหมู่</th>
              <th>วันยืม</th>
              <th>วันครบกำหนด</th>
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
    </div>
    
    <div v-else class="text-center">
      <h3>ไม่มีหนังสือที่ต้องคืน</h3>
      <p>ตอนนี้คุณไม่มีหนังสือที่ยืมอยู่</p>
      <p>สามารถเข้าไปดูหนังสือที่มีให้ยืมได้ที่หน้า Books</p>
      <router-link to="/books" class="btn">ดูหนังสือทั้งหมด</router-link>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { borrowService } from '../services/borrowService'

export default {
  name: 'Return',
  data() {
    return {
      borrowedBooks: [],
      selectedBooks: [],
      loading: false,
      error: '',
      success: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  async mounted() {
    await this.fetchBorrowedBooks()
  },
  methods: {
    async fetchBorrowedBooks() {
      this.loading = true
      this.error = ''
      
      try {
        if (!this.user || !this.user.student_id) {
          this.error = 'ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่'
          console.error('No user or student_id found')
          return
        }
        
        console.log('=== RETURN PAGE DEBUG ===')
        console.log('Current user:', this.user)
        console.log('Student ID:', this.user.student_id)
        console.log('User role:', this.user.role)
        
        const history = await borrowService.getUserHistory(this.user.student_id)
        console.log('Raw history from API:', history)
        
        this.borrowedBooks = history.filter(book => !book.return_confirmed)
        console.log('Filtered borrowed books (return_confirmed = false):', this.borrowedBooks)
        
        this.selectedBooks = []
      } catch (error) {
        console.error('Error fetching borrowed books:', error)
        this.error = error.response?.data?.message || 'ไม่สามารถโหลดข้อมูลได้'
        this.borrowedBooks = []
      } finally {
        this.loading = false
      }
    },
    
    onCheckboxChange() {
      console.log('Checkbox changed, selectedBooks:', this.selectedBooks)
    },
    
    async handleReturn() {
      if (!this.user || !this.user.student_id) {
        this.error = 'User information not found. Please login again.'
        return
      }
      
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await borrowService.returnRequest({
          student_id: this.user.student_id,
          book_ids: this.selectedBooks
        })
        
        this.success = 'Return request submitted successfully! Please wait for admin confirmation.'
        this.selectedBooks = []
        
        await this.fetchBorrowedBooks()
      } catch (error) {
        console.error('Error submitting return request:', error)
        this.error = error.response?.data?.message || 'Return request failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
