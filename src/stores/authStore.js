// stores/authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: null,
    role: null, 
  }),
  actions: {
    setAuth(token, role) {
      this.token = token
      this.role = role
    },
    logout() {
      this.token = null
      this.role = null
    },
  },
})
