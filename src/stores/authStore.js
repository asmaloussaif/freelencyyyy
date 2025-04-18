// authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
  }),
  actions: {
    setAuth(token, role,user) {
      this.token = token
      this.role = role
      this.user=user
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('user', user)

    },
    logout() {
      this.token = null
      this.role = null
      this.user=null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    },
  },
})

