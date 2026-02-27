import { createStore } from 'vuex'
import { authService } from '../services/authService'

export default createStore({
  state: {
    user: null,
    token: null,
    role: null
  },
  
  getters: {
    isAuthenticated: state => !!state.token,
    user: state => state.user,
    role: state => state.role,
    isAdmin: state => state.role === 'admin',
    isUser: state => state.role === 'user'
  },
  
  mutations: {
    SET_USER(state, user) {
      state.user = user
    },
    SET_TOKEN(state, token) {
      state.token = token
    },
    SET_ROLE(state, role) {
      state.role = role
    },
    CLEAR_AUTH(state) {
      state.user = null
      state.token = null
      state.role = null
    }
  },
  
  actions: {
    async login({ commit }, credentials) {
      try {
        const response = await authService.login(credentials)
        const { token, user } = response
        
        authService.saveAuthData(token, user)
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        commit('SET_ROLE', user.role)
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    async register({ commit }, userData) {
      try {
        const response = await authService.register(userData)
        const { token, user } = response
        
        authService.saveAuthData(token, user)
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        commit('SET_ROLE', user.role)
        
        return response
      } catch (error) {
        throw error
      }
    },
    
    logout({ commit }) {
      authService.logout()
      commit('CLEAR_AUTH')
    },
    
    initializeAuth({ commit }) {
      const token = authService.getToken()
      const user = authService.getUser()
      const role = authService.getRole()
      
      if (token && user && role) {
        commit('SET_TOKEN', token)
        commit('SET_USER', user)
        commit('SET_ROLE', role)
      }
    }
  }
})
