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
            <div class="filter-select">
              <label>Status:</label>
              <select v-model="statusFilter" class="status-filter">
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
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
            <th @click="sortBy('active')" class="sortable">
              <div class="th-content">
                Status
                <span v-if="sortKey === 'active'" class="sort-icon">
                  {{ sortOrder === 1 ? '↑' : '↓' }}
                </span>
              </div>
            </th>
            <th class="actions-header">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="user in paginatedUsers" 
            :key="user.id"
            :class="['user-card', {'inactive-row': !user.active}]"
          >
            <td>
              <div class="user-cell">
                <div class="avatar-wrapper">
                  <img :src="user.avatar" class="user-avatar" />
                  <span v-if="user.active" class="online-indicator"></span>
                </div>
                <div class="user-details">
                  <span class="user-name">{{ user.name }}</span>
                  <span class="user-id">ID: {{ user.id }}</span>
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
            <td>
              <span :class="['status-badge', user.active ? 'active' : 'inactive']">
                <span class="status-dot"></span>
                {{ user.active ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="actions-cell">
              <div class="action-buttons">
                <button 
                  @click="toggleStatus(user.id)"
                  :class="['action-btn', user.active ? 'suspend-btn' : 'activate-btn']"
                >
                  <span class="btn-icon">{{ user.active ? '⏸️' : '▶️' }}</span>
                  {{ user.active ? 'Suspend' : 'Activate' }}
                </button>
                <button class="action-btn view-btn" @click="viewProfile(user.id)">
                  <span class="btn-icon">👁️</span>
                  View
                </button>
                <button class="action-btn message-btn" @click="sendMessage(user.id)">
                  <span class="btn-icon">✉️</span>
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty State -->
    <div v-if="filteredUsers.length === 0" class="empty-state">
      <div class="empty-icon">👻</div>
      <h3>No users found matching your criteria</h3>
      <p>Try adjusting your search filters or <a href="#" @click.prevent="resetFilters">reset all filters</a></p>
    </div>

    <!-- Pagination -->
    <div class="pagination">
      <button 
        class="page-btn prev-btn" 
        :disabled="currentPage === 1" 
        @click="prevPage"
      >
        <span class="page-icon">◀</span> Previous
      </button>
      <div class="page-numbers">
        <button 
          v-for="page in visiblePages" 
          :key="page"
          :class="['page-number', {active: currentPage === page}]"
          @click="goToPage(page)"
        >
          {{ page }}
        </button>
        <span v-if="showEllipsis" class="ellipsis">...</span>
      </div>
      <button 
        class="page-btn next-btn" 
        :disabled="currentPage === totalPages" 
        @click="nextPage"
      >
        Next <span class="page-icon">▶</span>
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { format } from 'date-fns'

const users = ref([])
const searchQuery = ref('')
const roleFilter = ref('all')
const statusFilter = ref('all')
const sortKey = ref('name')
const sortOrder = ref(1) // 1 = asc, -1 = desc
const currentPage = ref(1)
const itemsPerPage = 10
const maxVisiblePages = 5

onMounted(() => {
  users.value = [
    { 
      id: 1, 
      name: 'Asma Khan', 
      email: 'asma@example.com', 
      role: 'client', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=5',
      joinDate: '2023-05-15'
    },
    { 
      id: 2, 
      name: 'Khaled Ahmed', 
      email: 'khaled@example.com', 
      role: 'freelancer', 
      active: false, 
      avatar: 'https://i.pravatar.cc/150?img=10',
      joinDate: '2023-06-22'
    },
    { 
      id: 3, 
      name: 'Lina Mahmoud', 
      email: 'lina@example.com', 
      role: 'client', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=15',
      joinDate: '2023-07-10'
    },
    { 
      id: 4, 
      name: 'Omar Farouk', 
      email: 'omar@example.com', 
      role: 'freelancer', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=20',
      joinDate: '2023-08-05'
    },
    { 
      id: 5, 
      name: 'Yasmine Belhaj', 
      email: 'yasmine@example.com', 
      role: 'client', 
      active: false, 
      avatar: 'https://i.pravatar.cc/150?img=25',
      joinDate: '2023-09-18'
    },
    { 
      id: 6, 
      name: 'Rami Nasr', 
      email: 'rami@example.com', 
      role: 'freelancer', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=30',
      joinDate: '2023-10-22'
    },
    { 
      id: 7, 
      name: 'Nadia Fares', 
      email: 'nadia@example.com', 
      role: 'client', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=35',
      joinDate: '2023-11-14'
    },
    { 
      id: 8, 
      name: 'Karim Said', 
      email: 'karim@example.com', 
      role: 'freelancer', 
      active: false, 
      avatar: 'https://i.pravatar.cc/150?img=40',
      joinDate: '2023-12-03'
    },
    { 
      id: 9, 
      name: 'Leila Mansour', 
      email: 'leila@example.com', 
      role: 'client', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=45',
      joinDate: '2024-01-19'
    },
    { 
      id: 10, 
      name: 'Tariq Jabbar', 
      email: 'tariq@example.com', 
      role: 'freelancer', 
      active: true, 
      avatar: 'https://i.pravatar.cc/150?img=50',
      joinDate: '2024-02-27'
    }
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

const visiblePages = computed(() => {
  const pages = []
  const half = Math.floor(maxVisiblePages / 2)
  let start = Math.max(1, currentPage.value - half)
  let end = Math.min(totalPages.value, start + maxVisiblePages - 1)
  
  if (end - start + 1 < maxVisiblePages) {
    start = Math.max(1, end - maxVisiblePages + 1)
  }
  
  for (let i = start; i <= end; i++) {
    pages.push(i)
  }
  
  return pages
})

const showEllipsis = computed(() => {
  return totalPages.value > maxVisiblePages && 
         Math.max(...visiblePages.value) < totalPages.value
})

const sortBy = (key) => {
  if (sortKey.value === key) {
    sortOrder.value *= -1
  } else {
    sortKey.value = key
    sortOrder.value = 1
  }
  currentPage.value = 1
}

const toggleStatus = (id) => {
  const user = users.value.find(u => u.id === id)
  if (user) user.active = !user.active
}

const viewProfile = (id) => {
  // In a real app, this would navigate to the user's profile
  console.log(`Viewing profile for user ${id}`)
}

const sendMessage = (id) => {
  // In a real app, this would open a messaging interface
  console.log(`Sending message to user ${id}`)
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

const prevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToPage = (page) => {
  currentPage.value = page
}

const resetFilters = () => {
  searchQuery.value = ''
  roleFilter.value = 'all'
  statusFilter.value = 'all'
  currentPage.value = 1
}

const formatDate = (dateStr) => {
  return format(new Date(dateStr), 'MMM d, yyyy')
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
  color: #0F2573;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 12px;
}

.icon {
  font-size: 36px;
  color: #4A90E2;
}

.badge-count {
  background-color: #E1F0FF;
  border-radius: 20px;
  padding: 8px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #0F2573;
}

.badge-count .count {
  font-weight: 700;
  font-size: 18px;
  color: #4A90E2;
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
  border: 1px solid #C5D9E3;
  border-radius: 10px;
  font-size: 15px;
  transition: all 0.3s ease;
  background-color: #F8FAFF;
}

.search-input:focus {
  outline: none;
  border-color: #4A90E2;
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
  color: #4A5568;
  font-weight: 500;
}

.role-filter,
.status-filter {
  padding: 10px 16px;
  border: 1px solid #C5D9E3;
  border-radius: 8px;
  font-size: 14px;
  background-color: white;
  color: #2D3748;
  transition: all 0.3s ease;
  cursor: pointer;
}

.role-filter:hover,
.status-filter:hover {
  border-color: #4A90E2;
}

.role-filter:focus,
.status-filter:focus {
  outline: none;
  border-color: #4A90E2;
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
  background-color: #F0F7FF;
  color: #0F2573;
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
  background-color: #E1F0FF;
}

.sort-icon {
  font-size: 12px;
  color: #4A90E2;
}

.actions-header {
  text-align: center;
}

.user-table td {
  padding: 16px;
  border-bottom: 1px solid #EDF2F7;
  vertical-align: middle;
}

.user-card:hover {
  background-color: #F8FAFF !important;
}

.inactive-row {
  opacity: 0.8;
  background-color: #F9F9F9;
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
  border: 2px solid #E1F0FF;
}

.online-indicator {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 12px;
  height: 12px;
  background-color: #4CAF50;
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
  color: #0F2573;
}

.user-id,
.user-join-date {
  font-size: 12px;
  color: #718096;
}

.user-email {
  color: #4A5568;
}

.email-link {
  color: #4A90E2;
  text-decoration: none;
  transition: color 0.2s ease;
}

.email-link:hover {
  color: #0F2573;
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
  background-color: #E1F0FF;
  color: #0F2573;
}

.role-badge.freelancer {
  background-color: #0F2573;
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
  background-color: #E6FFED;
  color: #1A6D3F;
}

.status-badge.inactive {
  background-color: #FFF5F5;
  color: #C53030;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  display: inline-block;
}

.status-badge.active .status-dot {
  background-color: #38A169;
}

.status-badge.inactive .status-dot {
  background-color: #E53E3E;
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
  background-color: #F6AD55;
  color: #7B341E;
}

.suspend-btn:hover {
  background-color: #ED8936;
}

.activate-btn {
  background-color: #68D391;
  color: #22543D;
}

.activate-btn:hover {
  background-color: #48BB78;
}

.view-btn {
  background-color: #E1F0FF;
  color: #0F2573;
}

.view-btn:hover {
  background-color: #C5D9E3;
}

.message-btn {
  background-color: transparent;
  color: #4A90E2;
  padding: 8px;
}

.message-btn:hover {
  background-color: #E1F0FF;
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
  color: #C5D9E3;
}

.empty-state h3 {
  color: #0F2573;
  margin-bottom: 8px;
}

.empty-state p {
  color: #718096;
  margin-bottom: 0;
}

.empty-state a {
  color: #4A90E2;
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
  border: 1px solid #C5D9E3;
  background-color: white;
  color: #4A5568;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-btn:hover:not(:disabled) {
  background-color: #E1F0FF;
  color: #0F2573;
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
  color: #4A5568;
}

.page-number:hover {
  background-color: #E1F0FF;
  color: #0F2573;
}

.page-number.active {
  background-color: #0F2573;
  color: white;
  border-color: #0F2573;
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
</style>