<template>
  <div class="card">
    <h2>ประวัติการยืมหนังสือทั้งหมด</h2>
    
    <div v-if="loading" class="text-center">กำลังโหลด...</div>
    
    <table v-else-if="history.length > 0" class="table">
      <thead>
        <tr>
          <th>วันที่</th>
          <th>รหัสหนังสือ</th>
          <th>ชื่อหนังสือ</th>
          <th>ผู้ยืม</th>
          <th>รหัสนิสิต</th>
          <th>วันยืม</th>
          <th>วันคืน</th>
          <th>สถานะ</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="record in history" :key="record.id">
          <td>{{ getTransactionDate(record) }}</td>
          <td>{{ record.Book.book_id }}</td>
          <td>{{ record.Book.title }}</td>
          <td>{{ record.User.full_name }}</td>
          <td>{{ record.User.student_id }}</td>
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
import { borrowService } from '../services/borrowService'

export default {
  name: 'AdminHistory',
  data() {
    return {
      history: [],
      loading: false
    }
  },
  async mounted() {
    await this.fetchHistory()
  },
  methods: {
    async fetchHistory() {
      this.loading = true
      try {
        this.history = await borrowService.getAdminHistory()
      } catch (error) {
        console.error('Error fetching history:', error)
      } finally {
        this.loading = false
      }
    },
    
    getTransactionDate(record) {
      return record.return_date || record.borrow_date
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
