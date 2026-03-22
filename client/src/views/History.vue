<template>
  <div class="card">
    <h2>ประวัติการยืมหนังสือของฉัน</h2>
    
    <div v-if="loading" class="text-center">กำลังโหลด...</div>
    
    <div v-else-if="error" class="alert alert-danger">
      {{ error }}
    </div>
    
    <table v-else-if="history.length > 0" class="table">
      <thead>
        <tr>
          <th>รหัสหนังสือ</th>
          <th>ชื่อหนังสือ</th>
          <th>วันยืม</th>
          <th>วันคืน</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in history" :key="record.id">
          <td>{{ record.Book.book_id }}</td>
          <td>{{ record.Book.title }}</td>
          <td>{{ record.borrow_date }}</td>
          <td>{{ record.return_date || '-' }}</td>
          <td>
            <span :class="getStatusClass(record)">
              {{ getStatusText(record) }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    
    <div v-else class="text-center">
      ไม่พบประวัติการยืมหนังสือ
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { borrowService } from '../services/borrowService'

export default {
  name: 'History',
  data() {
    return {
      history: [],
      loading: false,
      error: ''
    }
  },
  computed: {
    ...mapGetters(['user'])
  },
  async mounted() {
    await this.fetchHistory()
  },
  methods: {
    async fetchHistory() {
      if (!this.user || !this.user.student_id) {
        this.error = 'ไม่พบข้อมูลผู้ใช้ กรุณาเข้าสู่ระบบใหม่'
        return
      }
      
      this.loading = true
      this.error = ''
      
      try {
        this.history = await borrowService.getUserHistory(this.user.student_id)
      } catch (error) {
        console.error('Error fetching history:', error)
        this.error = 'ไม่สามารถโหลดประวัติการยืมได้'
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
