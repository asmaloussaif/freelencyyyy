<template>
  <div class="management-container">
    <!-- Header with title and controls -->
    <div class="header">
      <div class="title-section">
        <h2 class="title">
          <span class="icon">👥</span>
          Customer & Freelancer Management
        </h2>
        <p class="subtitle">Manage all platform users</p>
      </div>
      
      <div class="controls">
        <div class="search-filter">
          <input 
            type="text" 
            v-model="searchQuery" 
            placeholder="Search users..." 
            class="search-input"
          >
          <select v-model="roleFilter" class="role-filter">
            <option value="all">All Roles</option>
            <option value="client">Clients</option>
            <option value="freelancer">Freelancers</option>
          </select>
          <select v-model="statusFilter" class="status-filter">
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>
    </div>

    <!-- User Table -->
    <div class="table-responsive">
      <table class="user-table">
        <thead>
          <tr class="header-row">
            <th @click="sortBy('name')">
              User 
              <span v-if="sortKey === 'name'" class="sort-icon">
                {{ sortOrder === 1 ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('email')">
              Email 
              <span v-if="sortKey === 'email'" class="sort-icon">
                {{ sortOrder === 1 ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('role')">
              Role 
              <span v-if="sortKey === 'role'" class="sort-icon">
                {{ sortOrder === 1 ? '↑' : '↓' }}
              </span>
            </th>
            <th @click="sortBy('active')">
              Status 
              <span v-if="sortKey === 'active'" class="sort-icon">
                {{ sortOrder === 1 ? '↑' : '↓' }}
              </span>
            </th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in filteredUsers" 
            :key="user.id"
            :class="{'inactive-row': !user.active, 'user-card': true}"
          >
            <td>
              <div class="user-cell">
                <img :src="user.avatar" class="user-avatar" />
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-id">ID: {{ user.id }}</span>
                </div>
              </div>
            </td>
            <td class="user-email">
              {{ user.email }}
            </td>
            <td>
              <span :class="'role-badge ' + (user.role === 'client' ? 'client' : 'freelancer')">
                {{ user.role === 'client' ? 'Client' : 'Freelancer' }}
              </span>
            </td>
            <td>
              <span :class="'status-badge ' + (user.active ? 'active' : 'inactive')">
                <span class="status-dot"></span>
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button 
                @click="toggleStatus(user.id)"
                :class="['action-btn', user.active ? 'suspend-btn' : 'activate-btn']"
              >
                {{ user.active ? 'Suspend' : 'Activate' }}
              </button>
              <button class="action-btn view-btn">
                View Profile
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers.length === 0" class="empty-state">
      <div class="empty-icon">👻</div>
      <h3>No users found</h3>
      <p>Try adjusting your search filters</p>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button class="page-btn" :disabled="currentPage === 1" @click="prevPage">
        Previous
      </button>
      <span class="page-info">Page {{ currentPage }} of {{ totalPages }}</span>
      <button class="page-btn" :disabled="currentPage === totalPages" @click="nextPage">
        Next
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref('name')
const sortOrder = ref(1) // 1 = asc, -1 = desc
const currentPage = ref(1)
const itemsPerPage = 5

onMounted(() => {
  users.value = [
    { id: 1, name: 'Asma Khan', email: 'asma@example.com', role: 'client', active: true, avatar: 'https://i.pravatar.cc/100?img=5' },
    { id: 2, name: 'Khaled Ahmed', email: 'khaled@example.com', role: 'freelancer', active: false, avatar: 'https://i.pravatar.cc/100?img=10' },
    { id: 3, name: 'Lina Mahmoud', email: 'lina@example.com', role: 'client', active: true, avatar: 'https://i.pravatar.cc/100?img=15' },
    { id: 4, name: 'Omar Farouk', email: 'omar@example.com', role: 'freelancer', active: true, avatar: 'https://i.pravatar.cc/100?img=20' },
    { id: 5, name: 'Yasmine Belhaj', email: 'yasmine@example.com', role: 'client', active: false, avatar: 'https://i.pravatar.cc/100?img=25' },
  ]
})

const filteredUsers = computed(() => {
  let result = users.value
  
  // Apply filters
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(user => 
      user.name.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    )
  }
  
  if (roleFilter.value !== 'all') {
    result = result.filter(user => user.role === roleFilter.value)
  }
  
  if (statusFilter.value !== 'all') {
    const activeFilter = statusFilter.value === 'active'
    result = result.filter(user => user.active === activeFilter)
  }
  
  // Apply sorting
  return result.sort((a, b) => {
    if (a[sortKey.value] < b[sortKey.value]) return -1 * sortOrder.value
    if (a[sortKey.value] > b[sortKey.value]) return 1 * sortOrder.value
    return 0
  })
})

const totalPages = computed(() => {
  return Math.ceil(filteredUsers.value.length / itemsPerPage)
})

const paginatedUsers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return filteredUsers.value.slice(start, end)
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
  const user = users.value.find(u => u.id === id)
  if (user) user.active = !user.active
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}
</script>

<style scoped>
.management-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 28px;
  overflow: hidden;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 24px;
}

.title-section {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 28px;
}

.subtitle {
  color: #6c757d;
  font-size: 14px;
  margin: 0;
  margin-left: 40px;
}

.controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.search-filter {
  display: flex;
  gap: 12px;
  width: 100%;
}

.search-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  transition: border 0.2s;
}

.search-input:focus {
  border-color: #4361ee;
}

.role-filter, .status-filter {
  padding: 10px 12px;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  outline: none;
  background: white;
  cursor: pointer;
}

.table-responsive {
  overflow-x: auto;
  margin-bottom: 24px;
}

/* Enhanced Table Styling */
.user-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 10px;
}

.user-table .header-row {
  background-color: #f8f9fa !important;
}

.user-table .header-row th {
  border: none;
  padding: 14px 16px;
}

.user-card {
  background: white;
  border: 1px solid #333; /* Solid black border */
  border-radius: 8px;
  transition: all 0.2s ease;
}

.user-card:hover {
  border-color: #111; /* Darker border on hover */
  box-shadow: 0 3px 10px rgba(0,0,0,0.1);
}

.user-table td {
  padding: 14px 16px;
  border: none;
  vertical-align: middle;
}

/* Rounded corners for first/last cells */
.user-table td:first-child {
  border-top-left-radius: 8px;
  border-bottom-left-radius: 8px;
}

.user-table td:last-child {
  border-top-right-radius: 8px;
  border-bottom-right-radius: 8px;
}

.inactive-row {
  opacity: 0.8;
  background-color: #f8f9fa;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

.user-details {
  display: flex;
  flex-direction: column;
}

.user-name {
  font-weight: 500;
  color: #212529;
}

.user-id {
  font-size: 12px;
  color: #6c757d;
}

.user-email {
  color: #4361ee;
}

.role-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: capitalize;
}

.role-badge.client {
  background-color: #e6f2ff;
  color: #0066cc;
}

.role-badge.freelancer {
  background-color: #e6f7ff;
  color: #0099cc;
}

.status-badge {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 500;
}

.status-badge.active {
  background-color: #e6f7e6;
  color: #2e7d32;
}

.status-badge.inactive {
  background-color: #f5f5f5;
  color: #616161;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.status-badge.active .status-dot {
  background-color: #2e7d32;
}

.status-badge.inactive .status-dot {
  background-color: #616161;
}

.action-btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  border: none;
  margin-right: 8px;
}

.suspend-btn {
  background-color: #fff0f0;
  color: #d32f2f;
}

.suspend-btn:hover {
  background-color: #ffdddd;
}

.activate-btn {
  background-color: #f0fff4;
  color: #2e7d32;
}

.activate-btn:hover {
  background-color: #e0ffe0;
}

.view-btn {
  background-color: #f0f4ff;
  color: #4361ee;
}

.view-btn:hover {
  background-color: #e0e8ff;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6c757d;
  text-align: center;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

.empty-state h3 {
  margin: 8px 0;
  color: #495057;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 16px;
  margin-top: 24px;
}

.page-btn {
  padding: 8px 16px;
  border: 1px solid #e9ecef;
  background: white;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  background: #f8f9fa;
  border-color: #dee2e6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-info {
  font-size: 14px;
  color: #6c757d;
}

@media (max-width: 768px) {
  .search-filter {
    flex-direction: column;
  }
  
  .header {
    gap: 16px;
  }
  
  .title {
    font-size: 20px;
  }
}
</style>