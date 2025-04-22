<template>
  <div class="claims-container">
    <!-- Header with title and search -->
    <div class="header">
      <h2 class="title">
        <span class="icon">📋</span>
        Claims Management
      </h2>
      <div class="search-bar">
        <input 
          type="text" 
          v-model="searchQuery" 
          placeholder="Search claims..." 
          class="search-input"
        >
        <button class="search-btn">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

    <!-- Claims Table -->
    <div class="table-responsive">
      <table class="claims-table">
        <thead>
          <tr>
            <th @click="sortBy('id')">ID <span v-if="sortKey === 'id'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th @click="sortBy('subject')">Subject <span v-if="sortKey === 'subject'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th>Description</th>
            <th @click="sortBy('status')">Status <span v-if="sortKey === 'status'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr 
            v-for="claim in filteredClaims" 
            :key="claim.id"
            :class="'status-' + claim.status"
          >
            <td>#{{ claim.id }}</td>
            <td>{{ claim.subject }}</td>
            <td class="description">{{ claim.description }}</td>
            <td>
              <span :class="'status-badge ' + getStatusColor(claim.status)">
                {{ claim.status.toUpperCase() }}
              </span>
            </td>
            <td>
              <div class="user-cell">
                <span class="user-avatar">{{ getUserInitial(claim.user.name) }}</span>
                {{ claim.user.name }}
              </div>
            </td>
            <td>
              <div class="action-buttons">
                <button 
                  class="btn resolve-btn" 
                  @click="resolveClaim(claim.id)"
                  :disabled="claim.status === 'resolved'"
                >
                  <span class="btn-icon">✓</span> Resolve
                </button>
                <button 
                  class="btn reject-btn" 
                  @click="rejectClaim(claim.id)"
                  :disabled="claim.status === 'rejected'"
                >
                  <span class="btn-icon">✗</span> Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Empty state -->
    <div v-if="filteredClaims.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No claims found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'

const claims = ref([])
const searchQuery = ref('')
const sortKey = ref('id')
const sortOrder = ref(1) // 1 = asc, -1 = desc

onMounted(() => {
  claims.value = [
    { id: 1, subject: 'Payment delay', description: 'Freelancer did not pay on time despite multiple reminders', status: 'pending', user: { name: 'Sami Ben' } },
    { id: 2, subject: 'Bug report', description: 'Critical functionality not working as described', status: 'resolved', user: { name: 'Mira Chen' } },
    { id: 3, subject: 'Refund request', description: 'Service not delivered as promised', status: 'pending', user: { name: 'Alex Johnson' } },
    { id: 4, subject: 'Account issue', description: 'Cannot access my account after password reset', status: 'rejected', user: { name: 'Taylor Smith' } },
  ]
})

const filteredClaims = computed(() => {
  let result = claims.value
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    result = result.filter(claim => 
      claim.subject.toLowerCase().includes(query) ||
      claim.description.toLowerCase().includes(query) ||
      claim.user.name.toLowerCase().includes(query)
    )
  }
  
  // Sorting
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

const getStatusColor = (status) => {
  switch (status) {
    case 'pending': return 'pending'
    case 'resolved': return 'resolved'
    case 'rejected': return 'rejected'
    default: return ''
  }
}

const getUserInitial = (name) => {
  return name.split(' ').map(n => n[0]).join('')
}

const resolveClaim = (id) => {
  const claim = claims.value.find(c => c.id === id)
  if (claim) claim.status = 'resolved'
}

const rejectClaim = (id) => {
  const claim = claims.value.find(c => c.id === id)
  if (claim) claim.status = 'rejected'
}
</script>

<style scoped>
.claims-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 24px;
  overflow: hidden;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

.title {
  font-size: 24px;
  font-weight: 600;
  color: #2c3e50;
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

.icon {
  font-size: 28px;
}

.search-bar {
  display: flex;
  align-items: center;
  background: #f8f9fa;
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #e9ecef;
}

.search-input {
  border: none;
  background: transparent;
  padding: 8px 12px;
  outline: none;
  width: 200px;
}

.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
}

.search-icon {
  font-size: 16px;
  opacity: 0.7;
}

.table-responsive {
  overflow-x: auto;
}

.claims-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

.claims-table th {
  background-color: #f8f9fa;
  color: #495057;
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  position: sticky;
  top: 0;
  cursor: pointer;
  user-select: none;
}

.claims-table th:hover {
  background-color: #e9ecef;
}

.sort-icon {
  margin-left: 4px;
  font-size: 12px;
}

.claims-table td {
  padding: 16px;
  border-bottom: 1px solid #e9ecef;
  vertical-align: middle;
}

.claims-table tr:last-child td {
  border-bottom: none;
}

.claims-table tr:hover {
  background-color: #f8f9fa;
}

.description {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.status-badge.pending {
  background-color: #fff3cd;
  color: #856404;
}

.status-badge.resolved {
  background-color: #d4edda;
  color: #155724;
}

.status-badge.rejected {
  background-color: #f8d7da;
  color: #721c24;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #e9ecef;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #495057;
}

.action-buttons {
  display: flex;
  gap: 8px;
}

.btn {
  padding: 8px 12px;
  border-radius: 6px;
  font-size: 12px;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  transition: all 0.2s ease;
  border: none;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.resolve-btn {
  background-color: #28a745;
  color: white;
}

.resolve-btn:hover:not(:disabled) {
  background-color: #218838;
}

.reject-btn {
  background-color: #dc3545;
  color: white;
}

.reject-btn:hover:not(:disabled) {
  background-color: #c82333;
}

.btn-icon {
  font-size: 14px;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #6c757d;
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  opacity: 0.5;
}

/* Row status colors */
tr.status-pending {
  border-left: 3px solid #ffc107;
}

tr.status-resolved {
  border-left: 3px solid #28a745;
}

tr.status-rejected {
  border-left: 3px solid #dc3545;
}
</style>