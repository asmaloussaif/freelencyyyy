<template>
  <div class="management-container">
    <!-- Header Section -->
    <div class="header">
      <div class="title-section">
        <div class="title-wrapper">
          <h2 class="title">
            <span class="icon">👥</span>
            Customer & Freelancer Management
          </h2>
          <div class="badge-count">
            <span class="count">{{ filteredUsers.length }}</span>
            <span>Total Users</span>
          </div>
        </div>
        <p class="subtitle">Manage platform users with ease and precision</p>
      </div>

      <div class="controls">
        <div class="search-filter">
          <div class="search-box">
            <span class="search-icon">🔍</span>
            <input
              type="text"
              v-model="searchQuery"
              placeholder="Search users by name or email..."
              class="search-input"
            />
          </div>
          <div class="filter-group">
            <div class="filter-select">
              <label>Role:</label>
              <select v-model="roleFilter" class="role-filter">
                <option value="all">All Roles</option>
                <option value="client">Clients</option>
                <option value="freelancer">Freelancers</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- User Table -->
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr class="header-row">
            <th @click="sortBy('name')" class="sortable">
              <div class="th-content">
                User
                <span v-if="sortKey === 'name'" class="sort-icon">
                  {{ sortOrder === 1 ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('email')" class="sortable">
              <div class="th-content">
                Email
                <span v-if="sortKey === 'email'" class="sort-icon">
                  {{ sortOrder === 1 ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th @click="sortBy('role')" class="sortable">
              <div class="th-content">
                Role
                <span v-if="sortKey === 'role'" class="sort-icon">
                  {{ sortOrder === 1 ? '↑' : '↓' }}
                </span>
              </div>
            </th>

            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in filteredUsers"
            :key="user.id"
            :class="['user-card', { 'inactive-row': !user.active }]"
          >
            <td>
              <div class="user-cell">
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-join-date">Joined: {{ formatDate(user.joinDate) }}</span>
                </div>
              </div>
            </td>
            <td class="user-email">
              <a :href="`mailto:${user.email}`" class="email-link">{{ user.email }}</a>
            </td>
            <td>
              <span :class="['role-badge', user.role]">
                {{ user.role === 'client' ? 'Client' : 'Freelancer' }}
                <span class="role-icon">{{ user.role === 'client' ? '👔' : '💻' }}</span>
              </span>
            </td>

            <td class="actions-cell">
              <div class="action-buttons">
                <button class="action-btn view-btn" @click="viewProfile(user.id, user.role)">
                  <span class="btn-icon">👁️</span>
                  View
                </button>
                <button class="action-btn message-btn" @click="goToChat">
                  <span class="btn-icon">✉️</span>
                </button>
                <button @click="deleteUser(user.id)" class="btn btn-danger">Delete user</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers.length === 0" class="empty-state">
      <h3>No users found matching your criteria</h3>
      <p>
        Try adjusting your search filters or
        <a href="#" @click.prevent="resetFilters">reset all filters</a>
      </p>
    </div>
  </div>
  <div v-if="showModal" class="modal">
    <div class="modal-content">
      <div v-if="role === 'freelancer'">
        <h3>Freelance Profile</h3>
        <p><strong>Titre:</strong> {{ freelance.titre }}</p>
        <p><strong>Compétences:</strong> {{ freelance.competences }}</p>
        <p><strong>Expérience:</strong> {{ freelance.experience }}</p>
        <p><strong>Portfolio:</strong> {{ freelance.portfolio }}</p>
        <p><strong>Note:</strong> {{ freelance.note }}</p>
      </div>

      <div v-else-if="role === 'client'">
        <h3>Client Profile</h3>
        <p><strong>Entreprise:</strong> {{ profile.entreprise }}</p>
        <p><strong>Description:</strong> {{ profile.description_entreprise }}</p>
        <p><strong>Besoins:</strong> {{ profile.besoins }}</p>
        <p><strong>Note:</strong> {{ profile.note }}</p>
      </div>
      <button @click="showModal = false">Close</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { useRouter } from 'vue-router'
const router = useRouter()
const authStore = useAuthStore()
const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref('name')
const sortOrder = ref(1)
const showModal = ref(false)

const fetchUser = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/users', { headers })
    users.value = response.data.map((user) => ({
      id: user.id,
      name: `${user.name} ${user.lastName ?? ''}`.trim(),
      email: user.email,
      role: user.role[0],
      joinDate: user.created_at,
    }))
  } catch (error) {
    console.error('Error fetching users:', error)
  }
}
const deleteUser = async (id) => {
  const confirmed = confirm('Are you sure you want to delete this user?')
  if (!confirmed) return

  const token = authStore.token

  try {
    await axios.delete(`http://localhost:8000/api/users/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    users.value = users.value.filter((user) => user.id !== id)
    fetchUser()
    alert('User deleted successfully!')
  } catch (error) {
    console.error('Error deleting user:', error)
    alert('Failed to delete user.')
  }
}

onMounted(() => {
  fetchUser()
})
const filteredUsers = computed(() => {
  let result = users.value

  // Apply filters
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(
      (user) => user.name.toLowerCase().includes(query) || user.email.toLowerCase().includes(query),
    )
  }

  if (roleFilter.value !== 'all') {
    result = result.filter((user) => user.role === roleFilter.value)
  }

  if (statusFilter.value !== 'all') {
    const activeFilter = statusFilter.value === 'active'
    result = result.filter((user) => user.active === activeFilter)
  }

  // Apply sorting
  return result.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return -1 * sortOrder.value
    if (a[sortKey.value] > b[sortKey.value]) return 1 * sortOrder.value
    return 0
  })
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
}

const toggleStatus = (id) => {
  const user = users.value.find((u) => u.id === id)
  if (user) user.active = !user.active
}

const freelance = ref({
  id: '',
  user_id: '',
  titre: '',
  competences: '',
  experience: '',
  portfolio: '',
  note: '',
})

const profile = ref({
  id: '',
  entreprise: '',
  description_entreprise: '',
  besoins: '',
  note: '',
})
const role = ref('')
const viewProfile = async (id, userRole) => {
  const token = authStore.token

  try {
    const response = await axios.get(`http://localhost:8000/api/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    console.log(response.data)
    role.value = userRole
    if (role.value === 'freelancer') {
      freelance.value = response.data
    } else if (role.value === 'client') {
      profile.value = response.data
    }

    showModal.value = true
  } catch (error) {
    console.error('Erreur lors de la récupération du profil :', error)
  }
}

const resetFilters = () => {
  searchQuery.value = ''
  roleFilter.value = 'all'
  statusFilter.value = 'all'
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
const goToChat = () => {
  router.push('/dashboard/inbox')
}
</script>

<style scoped>
.management-container {
  background: #ffffff;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 75, 145, 0.08);
  padding: 32px;
  overflow: hidden;
  font-family: 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 24px;
  margin-bottom: 32px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.title {
  font-size: 28px;
  font-weight: 700;
  color: #0f2573;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 36px;
  color: #4a90e2;
}

.badge-count {
  background-color: #e1f0ff;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0f2573;
}

.badge-count .count {
  font-weight: 700;
  font-size: 18px;
  color: #4a90e2;
}

.subtitle {
  color: #6c757d;
  font-size: 16px;
  margin: 0;
  font-weight: 400;
}

.controls {
  display: flex;
  gap: 16px;
}

.search-filter {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.search-box {
  position: relative;
  width: 100%;
}

.search-icon {
  position: absolute;
  left: 16px;
  top: 50%;
  transform: translateY(-50%);
  color: #6c757d;
}

.search-input {
  width: 100%;
  padding: 12px 16px 12px 48px;
  border: 1px solid #c5d9e3;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #f8faff;
}

.search-input:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.filter-group {
  display: flex;
  gap: 16px;
}

.filter-select {
  display: flex;
  align-items: center;
  gap: 8px;
}

.filter-select label {
  font-size: 14px;
  color: #4a5568;
  font-weight: 500;
}

.role-filter,
.status-filter {
  padding: 10px 16px;
  border: 1px solid #c5d9e3;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  color: #2d3748;
  transition: all 0.3s ease;
  cursor: pointer;
}

.role-filter:hover,
.status-filter:hover {
  border-color: #4a90e2;
}

.role-filter:focus,
.status-filter:focus {
  outline: none;
  border-color: #4a90e2;
  box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.2);
}

.table-responsive {
  width: 100%;
  overflow-x: auto;
  border-radius: 12px;
}

.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.user-table th {
  background-color: #f0f7ff;
  color: #0f2573;
  font-weight: 600;
  padding: 16px;
  text-align: left;
  position: sticky;
  top: 0;
}

.th-content {
  display: flex;
  align-items: center;
  gap: 8px;
}

.sortable {
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.sortable:hover {
  background-color: #e1f0ff;
}

.sort-icon {
  font-size: 12px;
  color: #4a90e2;
}

.actions-header {
  text-align: center;
}

.user-table td {
  padding: 16px;
  border-bottom: 1px solid #edf2f7;
  vertical-align: middle;
}

.user-card:hover {
  background-color: #f8faff !important;
}

.inactive-row {
  opacity: 0.8;
  background-color: #f9f9f9;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 16px;
}

.avatar-wrapper {
  position: relative;
}

.user-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e1f0ff;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #4caf50;
  border-radius: 50%;
  border: 2px solid white;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.user-name {
  font-weight: 600;
  color: #0f2573;
}

.user-id,
.user-join-date {
  font-size: 12px;
  color: #718096;
}

.user-email {
  color: #4a5568;
}

.email-link {
  color: #4a90e2;
  text-decoration: none;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #0f2573;
  text-decoration: underline;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.role-badge.client {
  background-color: #e1f0ff;
  color: #0f2573;
}

.role-badge.freelancer {
  background-color: #0f2573;
  color: white;
}

.role-icon {
  font-size: 14px;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 16px;
  font-size: 12px;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.status-badge.active {
  background-color: #e6ffed;
  color: #1a6d3f;
}

.status-badge.inactive {
  background-color: #fff5f5;
  color: z#c53030;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-badge.active .status-dot {
  background-color: #38a169;
}

.status-badge.inactive .status-dot {
  background-color: #e53e3e;
}

.actions-cell {
  text-align: center;
}

.action-buttons {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border: none;
}

.btn-icon {
  font-size: 14px;
}

.suspend-btn {
  background-color: #1b509f;
  color: #111a64;
}

.suspend-btn:hover {
  background-color: #09097b;
}

.activate-btn {
  background-color: #68d391;
  color: #22543d;
}

.activate-btn:hover {
  background-color: #48bb78;
}

.view-btn {
  background-color: #e1f0ff;
  color: #0f2573;
}

.view-btn:hover {
  background-color: #c5d9e3;
}

.message-btn {
  background-color: transparent;
  color: #4a90e2;
  padding: 8px;
}

.message-btn:hover {
  background-color: #e1f0ff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 0;
  text-align: center;
}

.empty-icon {
  font-size: 64px;
  margin-bottom: 16px;
  color: #c5d9e3;
}

.empty-state h3 {
  color: #0f2573;
  margin-bottom: 8px;
}

.empty-state p {
  color: #718096;
  margin-bottom: 0;
}

.empty-state a {
  color: #4a90e2;
  text-decoration: none;
  font-weight: 500;
}

.empty-state a:hover {
  text-decoration: underline;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  margin-top: 32px;
}

.page-btn {
  padding: 8px 16px;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border: 1px solid #c5d9e3;
  background-color: white;
  color: #4a5568;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background-color: #e1f0ff;
  color: #0f2573;
}

.page-icon {
  font-size: 12px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-number {
  min-width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  border: 1px solid transparent;
  background-color: transparent;
  color: #4a5568;
}

.page-number:hover {
  background-color: #e1f0ff;
  color: #0f2573;
}

.page-number.active {
  background-color: #0f2573;
  color: white;
  border-color: #0f2573;
}

.ellipsis {
  display: flex;
  align-items: center;
  padding: 0 8px;
  color: #718096;
}

@media (max-width: 768px) {
  .header {
    gap: 16px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .filter-group {
    flex-direction: column;
    gap: 12px;
  }

  .action-buttons {
    flex-direction: column;
    gap: 8px;
  }

  .pagination {
    flex-wrap: wrap;
  }
}
.modal {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 10px;
  width: 500px;
  max-width: 90%;
  min-height: 100px;
}
</style>
