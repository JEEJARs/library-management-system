<template>
  <div class="container">
    <div class="card" style="max-width: 400px; margin: 50px auto;">
      <h2 style="text-align: center; margin-bottom: 30px;">Library Login</h2>
      
      <div v-if="error" class="alert alert-danger">
        {{ error }}
      </div>
      
      <div v-if="success" class="alert alert-success">
        {{ success }}
      </div>
      
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label>Email:</label>
          <input 
            v-model="form.email" 
            type="email" 
            required 
            placeholder="Enter your email"
          />
        </div>
        
        <div class="form-group">
          <label>Password:</label>
          <input 
            v-model="form.password" 
            type="password" 
            required 
            placeholder="Enter your password"
          />
        </div>
        
        <button type="submit" class="btn" style="width: 100%;" :disabled="loading">
          {{ loading ? 'Loading...' : 'Login' }}
        </button>
      </form>
      
      <div style="margin-top: 20px; text-align: center;">
        <p>Don't have an account? 
          <a href="#" @click.prevent="showRegister = !showRegister">Register here</a>
        </p>
      </div>
      
      <div v-if="showRegister" style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd;">
        <h3 style="text-align: center; margin-bottom: 20px;">Register</h3>
        <form @submit.prevent="handleRegister">
          <div class="form-group">
            <label>Student ID (8 digits, starts with 63, 64, 65, or 66):</label>
            <input 
              v-model="registerForm.student_id" 
              type="text" 
              required 
              placeholder="64000001"
              maxlength="8"
              pattern="(63|64|65|66)[0-9]{6}"
            />
          </div>
          
          <div class="form-group">
            <label>Full Name:</label>
            <input 
              v-model="registerForm.full_name" 
              type="text" 
              required 
              placeholder="Enter your full name"
            />
          </div>
          
          <div class="form-group">
            <label>Email:</label>
            <input 
              v-model="registerForm.email" 
              type="email" 
              required 
              placeholder="Enter your email"
            />
          </div>
          
          <div class="form-group">
            <label>Password:</label>
            <input 
              v-model="registerForm.password" 
              type="password" 
              required 
              placeholder="Enter your password"
            />
          </div>
          
          <button type="submit" class="btn btn-success" style="width: 100%;" :disabled="loading">
            {{ loading ? 'Loading...' : 'Register' }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
    return {
      form: {
        email: '',
        password: ''
      },
      registerForm: {
        student_id: '',
        full_name: '',
        email: '',
        password: ''
      },
      loading: false,
      error: '',
      success: '',
      showRegister: false
    }
  },
  methods: {
    ...mapActions(['login', 'register']),
    
    async handleSubmit() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await this.login(this.form)
        const user = JSON.parse(localStorage.getItem('user'))
        this.$router.push(user.role === 'admin' ? '/books' : '/books')
      } catch (error) {
        this.error = error.response?.data?.message || 'Login failed'
      } finally {
        this.loading = false
      }
    },
    
    async handleRegister() {
      this.loading = true
      this.error = ''
      this.success = ''
      
      try {
        await this.register(this.registerForm)
        this.success = 'Registration successful! Redirecting...'
        this.showRegister = false
        setTimeout(() => {
          this.$router.push('/books')
        }, 1500)
      } catch (error) {
        this.error = error.response?.data?.message || 'Registration failed'
      } finally {
        this.loading = false
      }
    }
  }
}
</script>
