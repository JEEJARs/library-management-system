<template>
  <div id="app">
    <nav v-if="isAuthenticated" class="navbar">
      <div class="navbar-content">
        <router-link to="/" class="navbar-brand">Library System</router-link>
        <ul class="navbar-nav">
          <li class="nav-item">
            <router-link to="/books" class="nav-link">Books</router-link>
          </li>
          <li v-if="role === 'admin'" class="nav-item">
            <router-link to="/book-management" class="nav-link">Book Management</router-link>
          </li>
          <li v-if="role === 'admin'" class="nav-item">
            <router-link to="/admin/returns" class="nav-link">Returns</router-link>
          </li>
          <li v-if="role === 'admin'" class="nav-item">
            <router-link to="/admin/history" class="nav-link">History</router-link>
          </li>
          <li v-if="role === 'user'" class="nav-item">
            <router-link to="/borrow" class="nav-link">Borrow</router-link>
          </li>
          <li v-if="role === 'user'" class="nav-item">
            <router-link to="/return" class="nav-link">Return</router-link>
          </li>
          <li v-if="role === 'user'" class="nav-item">
            <router-link to="/history" class="nav-link">History</router-link>
          </li>
        </ul>
        <div class="navbar-user">
          <div class="user-info">
            <span class="user-name">{{ user?.full_name }}</span>
            <span class="user-role">({{ role?.toUpperCase() }})</span>
          </div>
          <button @click="handleLogout" class="logout-btn">Logout</button>
        </div>
      </div>
    </nav>
    
    <div class="container">
      <router-view />
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'

export default {
  name: 'App',
  computed: {
    ...mapGetters(['isAuthenticated', 'user', 'role'])
  },
  methods: {
    ...mapActions(['logout']),
    
    async handleLogout() {
      await this.logout()
      this.$router.push('/login')
    }
  }
}
</script>
