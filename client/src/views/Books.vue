<template>
  <div class="card">
    <h2>รายการหนังสือ</h2>
    
    <div style="display: flex; gap: 20px; margin-bottom: 20px;">
      <div class="form-group" style="flex: 1;">
        <label>ค้นหาตามรหัสหรือชื่อหนังสือ:</label>
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="กรอกรหัสหรือชื่อหนังสือ"
          @input="fetchBooks"
        />
      </div>
      
      <div class="form-group" style="flex: 1;">
        <label>กรองตามหมวดหมู่:</label>
        <select v-model="selectedCategory" @change="fetchBooks">
          <option value="">ทุกหมวดหมู่</option>
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
        </select>
      </div>
    </div>
    
    <div v-if="loading" class="text-center">กำลังโหลด...</div>
    
    <table v-else class="table">
      <thead>
        <tr>
          <th style="width: 100px;">รหัสหนังสือ</th>
          <th style="width: 150px;">หมวดหมู่</th>
          <th>ชื่อหนังสือ</th>
          <th style="width: 100px;">สถานะ</th>
          <th style="width: 120px;">วันครบกำหนด</th>
          <th style="width: 200px;">ผู้ยืม</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="book in books" :key="book.id">
          <td>{{ book.book_id }}</td>
          <td>{{ book.Category?.name || 'N/A' }}</td>
          <td>{{ book.title }}</td>
          <td>
            <span :class="getStatusClass(book.status)">
              {{ book.status.toUpperCase() }}
            </span>
          </td>
          <td>{{ getDueDate(book) }}</td>
          <td>{{ getBorrowerInfo(book) }}</td>
        </tr>
      </tbody>
    </table>
    
    <div v-if="books.length === 0 && !loading" class="text-center">
      ไม่พบรายการหนังสือ
    </div>
  </div>
</template>

<script>
import { bookService } from '../services/bookService'
import { categoryService } from '../services/categoryService'

export default {
  name: 'Books',
  data() {
    return {
      books: [],
      categories: [],
      searchQuery: '',
      selectedCategory: '',
      loading: false
    }
  },
  async mounted() {
    await this.fetchCategories()
    await this.fetchBooks()
  },
  methods: {
    async fetchBooks() {
      this.loading = true
      try {
        const params = {}
        if (this.searchQuery) params.search = this.searchQuery
        if (this.selectedCategory) params.category_id = this.selectedCategory
        
        this.books = await bookService.getAllBooks(params)
      } catch (error) {
        console.error('Error fetching books:', error)
      } finally {
        this.loading = false
      }
    },
    
    async fetchCategories() {
      try {
        this.categories = await categoryService.getAllCategories()
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    
    getStatusClass(status) {
      return {
        'status-available': status === 'available',
        'status-borrowed': status === 'borrowed',
        'status-overdue': status === 'overdue'
      }
    },
    
    getDueDate(book) {
      if (book.Borrows && book.Borrows.length > 0) {
        return book.Borrows[0].due_date
      }
      return '-'
    },
    
    getBorrowerInfo(book) {
      if (book.Borrows && book.Borrows.length > 0) {
        const borrow = book.Borrows[0]
        return `${borrow.User.student_id} - ${borrow.User.full_name}`
      }
      return '-'
    }
  }
}
</script>
