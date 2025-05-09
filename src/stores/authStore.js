// authStore.js
import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    role: localStorage.getItem('role') || null,
    user: (() => {
      try {
        const storedUser = localStorage.getItem('user')
        return storedUser ? JSON.parse(storedUser) : null
      } catch (e) {
        console.error('Failed to parse user from localStorage', e)
        return null
      }
    })(),
    appliedProjects: [],
  }),

  actions: {
    setAuth(token, role, user) {
      this.token = token
      this.role = role
      this.user = user
      localStorage.setItem('token', token)
      localStorage.setItem('role', role)
      localStorage.setItem('user', JSON.stringify(user))
    },

    setAppliedProjects(projects) {
      this.appliedProjects = projects
    },

    addAppliedProject(id) {
      if (!this.appliedProjects.includes(id)) {
        this.appliedProjects.push(id)
      }
    },

    logout() {
      this.token = null
      this.role = null
      this.user = null
      localStorage.removeItem('token')
      localStorage.removeItem('role')
      localStorage.removeItem('user')
    },
  },
})
