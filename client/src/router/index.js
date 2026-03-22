import { createRouter, createWebHistory } from 'vue-router'
import { authService } from '../services/authService'
import Login from '../views/Login.vue'
import Books from '../views/Books.vue'
import BookManagement from '../views/BookManagement.vue'
import Borrow from '../views/Borrow.vue'
import Return from '../views/Return.vue'
import History from '../views/History.vue'
import AdminReturns from '../views/AdminReturns.vue'
import AdminHistory from '../views/AdminHistory.vue'

const routes = [
  {
    path: '/login',
    name: 'Login',
    component: Login,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    redirect: '/books'
  },
  {
    path: '/books',
    name: 'Books',
    component: Books,
    meta: { requiresAuth: true }
  },
  {
    path: '/book-management',
    name: 'BookManagement',
    component: BookManagement,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/borrow',
    name: 'Borrow',
    component: Borrow,
    meta: { requiresAuth: true, userOnly: true }
  },
  {
    path: '/return',
    name: 'Return',
    component: Return,
    meta: { requiresAuth: true, userOnly: true }
  },
  {
    path: '/history',
    name: 'History',
    component: History,
    meta: { requiresAuth: true, userOnly: true }
  },
  {
    path: '/admin/returns',
    name: 'AdminReturns',
    component: AdminReturns,
    meta: { requiresAuth: true, adminOnly: true }
  },
  {
    path: '/admin/history',
    name: 'AdminHistory',
    component: AdminHistory,
    meta: { requiresAuth: true, adminOnly: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const token = authService.getToken()
  const user = authService.getUser()
  const role = authService.getRole()

  if (to.meta.requiresAuth && !token) {
    next('/login')
  } else if (to.meta.requiresGuest && token) {
    const redirectPath = role === 'admin' ? '/books' : '/books'
    next(redirectPath)
  } else if (to.meta.adminOnly && role !== 'admin') {
    next('/books')
  } else if (to.meta.userOnly && role !== 'user') {
    next('/books')
  } else {
    next()
  }
})

export default router
