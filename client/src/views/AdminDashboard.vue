<template>
  <div>
    <div class="card">
      <h2>Admin Dashboard</h2>
      
      <div v-if="loading" class="text-center">Loading...</div>
      
      <div v-else class="stats-grid">
        <div class="stat-card">
          <div class="stat-number stat-green">{{ stats.borrowedBooks }}</div>
          <div class="stat-label">Borrowed Books</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number stat-yellow">{{ stats.dueWithin3Days }}</div>
          <div class="stat-label">Due within 3 Days</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number stat-red">{{ stats.overdueBooks }}</div>
          <div class="stat-label">Overdue Books</div>
        </div>
        
        <div class="stat-card">
          <div class="stat-number">{{ totalUsers }}</div>
          <div class="stat-label">Total Users</div>
        </div>
      </div>
    </div>
    
    <div class="card">
      <h3>Top 10 Most Borrowed Books</h3>
      
      <div v-if="loadingTopBooks" class="text-center">Loading...</div>
      
      <table v-else class="table">
        <thead>
          <tr>
            <th>Rank</th>
            <th>Book ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Times Borrowed</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(book, index) in topBooks" :key="book.book_id">
            <td>{{ index + 1 }}</td>
            <td>{{ book.Book.book_id }}</td>
            <td>{{ book.Book.title }}</td>
            <td>{{ book.Book.Category?.name || 'N/A' }}</td>
            <td>{{ book.dataValues.borrow_count }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import { borrowService } from '../services/borrowService'
import { bookService } from '../services/bookService'
import api from '../services/api'

export default {
  name: 'AdminDashboard',
  data() {
    return {
      stats: {
        borrowedBooks: 0,
        dueWithin3Days: 0,
        overdueBooks: 0
      },
      topBooks: [],
      totalUsers: 0,
      loading: false,
      loadingTopBooks: false
    }
  },
  async mounted() {
    await this.fetchDashboardData()
  },
  methods: {
    async fetchDashboardData() {
      this.loading = true
      this.loadingTopBooks = true
      
      try {
        const [statsRes, topBooksRes, usersRes] = await Promise.all([
          borrowService.getDashboardStats(),
          bookService.getTopBorrowedBooks(),
          api.get('/users/total')
        ])
        
        this.stats = statsRes
        this.topBooks = topBooksRes
        this.totalUsers = usersRes.data.totalUsers
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        this.loading = false
        this.loadingTopBooks = false
      }
    }
  }
}
</script>
