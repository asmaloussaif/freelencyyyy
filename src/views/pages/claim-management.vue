<!-- Template section - defines the component's HTML structure -->
<template>
  <!-- Main container div with claims-container class -->
  <div class="claims-container">
    
    <!-- Header section containing title and search bar -->
    <div class="header">
      <!-- Page title with icon -->
      <h2 class="title">
        <span class="icon">📋</span>
        Claims Management
      </h2>
      
      <!-- Search bar component -->
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

    <!-- Responsive table container -->
    <div class="table-responsive">
      <!-- Claims table -->
      <table class="claims-table">
        <!-- Table header -->
        <thead>
          <tr>
            <!-- Sortable columns with click handlers -->
            <th @click="sortBy('id')">ID <span v-if="sortKey === 'id'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th @click="sortBy('subject')">Subject <span v-if="sortKey === 'subject'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th>Description</th>
            <th @click="sortBy('status')">Status <span v-if="sortKey === 'status'" class="sort-icon">{{ sortOrder === 1 ? '↑' : '↓' }}</span></th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>
        
        <!-- Table body with dynamic data -->
        <tbody>
          <!-- Table row for each claim, with dynamic class based on status -->
          <tr 
            v-for="claim in filteredClaims" 
            :key="claim.id"
            :class="'status-' + claim.status"
          >
            <!-- Claim ID cell -->
            <td>#{{ claim.id }}</td>
            
            <!-- Claim subject cell -->
            <td>{{ claim.subject }}</td>
            
            <!-- Claim description cell with ellipsis for long text -->
            <td class="description">{{ claim.description }}</td>
            
            <!-- Status cell with colored badge -->
            <td>
              <span :class="'status-badge ' + getStatusColor(claim.status)">
                {{ claim.status.toUpperCase() }}
              </span>
            </td>
            
            <!-- User cell with avatar -->
            <td>
              <div class="user-cell">
                <span class="user-avatar">{{ getUserInitial(claim.user.name) }}</span>
                {{ claim.user.name }}
              </div>
            </td>
            
            <!-- Action buttons cell -->
            <td>
              <div class="action-buttons">
                <!-- Resolve button -->
                <button 
                  class="btn resolve-btn" 
                  @click="resolveClaim(claim.id)"
                  :disabled="claim.status === 'resolved'"
                >
                  <span class="btn-icon">✓</span> Resolve
                </button>
                
                <!-- Reject button -->
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

    <!-- Empty state shown when no claims match search -->
    <div v-if="filteredClaims.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No claims found</p>
    </div>
  </div>
</template>

<!-- Script section - component logic -->
<script>
// Import required Vue functions
import { ref, computed, onMounted } from 'vue'

export default {
  setup() {
    // Reactive data properties
    const claims = ref([])
    const searchQuery = ref('')
    const sortKey = ref('id')
    const sortOrder = ref(1) // 1 = asc, -1 = desc

    // Initialize with sample data when component mounts
    onMounted(() => {
      claims.value = [
        { 
          id: 1, 
          subject: 'Payment delay', 
          description: 'Freelancer did not pay on time despite multiple reminders', 
          status: 'pending', 
          user: { name: 'Sami Ben' } 
        },
        { 
          id: 2, 
          subject: 'Bug report', 
          description: 'Critical functionality not working as described', 
          status: 'resolved', 
          user: { name: 'Mira Chen' } 
        },
        { 
          id: 3, 
          subject: 'Refund request', 
          description: 'Service not delivered as promised', 
          status: 'pending', 
          user: { name: 'Alex Johnson' } 
        },
        { 
          id: 4, 
          subject: 'Account issue', 
          description: 'Cannot access my account after password reset', 
          status: 'rejected', 
          user: { name: 'Taylor Smith' } 
        },
      ]
    })

    // Computed property for filtered and sorted claims
    const filteredClaims = computed(() => {
      let result = claims.value
      
      // Apply search filter if query exists
      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(claim => 
          claim.subject.toLowerCase().includes(query) ||
          claim.description.toLowerCase().includes(query) ||
          claim.user.name.toLowerCase().includes(query)
        )
      }
      
      // Apply sorting
      return result.sort((a, b) => {
        if (a[sortKey.value] < b[sortKey.value]) return -1 * sortOrder.value
        if (a[sortKey.value] > b[sortKey.value]) return 1 * sortOrder.value
        return 0
      })
    })

    // Method to handle column sorting
    const sortBy = (key) => {
      if (sortKey.value === key) {
        sortOrder.value *= -1
      } else {
        sortKey.value = key
        sortOrder.value = 1
      }
    }

    // Method to get status badge color class
    const getStatusColor = (status) => {
      switch (status) {
        case 'pending': return 'pending'
        case 'resolved': return 'resolved'
        case 'rejected': return 'rejected'
        default: return ''
      }
    }

    // Method to get user initials for avatar
    const getUserInitial = (name) => {
      return name.split(' ').map(n => n[0]).join('')
    }

    // Method to resolve a claim
    const resolveClaim = (id) => {
      const claim = claims.value.find(c => c.id === id)
      if (claim) claim.status = 'resolved'
    }

    // Method to reject a claim
    const rejectClaim = (id) => {
      const claim = claims.value.find(c => c.id === id)
      if (claim) claim.status = 'rejected'
    }

    // Expose properties and methods to template
    return {
      claims,
      searchQuery,
      sortKey,
      sortOrder,
      filteredClaims,
      sortBy,
      getStatusColor,
      getUserInitial,
      resolveClaim,
      rejectClaim
    }
  }
}
</script>

<!-- Scoped styles - only affect this component -->
<style scoped>
/* Main container styling */
.claims-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.08);
  padding: 24px;
  overflow: hidden;
}

/* Header section styling */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}

/* Title styling */
.title {
  font-size: 24px;
  font-weight: 600;
  color: #1A365D; /* Dark blue */
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Icon styling */
.icon {
  font-size: 28px;
  color: #2B6CB0; /* Medium blue */
}

/* Search bar styling */
.search-bar {
  display: flex;
  align-items: center;
  background: #EBF8FF; /* Very light blue */
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #BEE3F8; /* Light blue border */
}

/* Search input styling */
.search-input {
  border: none;
  background: transparent;
  padding: 8px 12px;
  outline: none;
  width: 200px;
  color: #2C5282; /* Dark blue text */
}

/* Search placeholder styling */
.search-input::placeholder {
  color: #718096; /* Grayish blue */
}

/* Search button styling */
.search-btn {
  background: transparent;
  border: none;
  cursor: pointer;
  padding: 8px;
  display: flex;
  align-items: center;
}

/* Search icon styling */
.search-icon {
  font-size: 16px;
  color: #4299E1; /* Medium blue */
}

/* Table container styling */
.table-responsive {
  overflow-x: auto;
}

/* Main table styling */
.claims-table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 14px;
}

/* Table header styling */
.claims-table th {
  background-color: #BEE3F8; /* Light blue */
  color: #2C5282; /* Dark blue */
  font-weight: 600;
  padding: 12px 16px;
  text-align: left;
  position: sticky;
  top: 0;
  cursor: pointer;
  user-select: none;
}

/* Table header hover effect */
.claims-table th:hover {
  background-color: #90CDF4; /* Slightly darker light blue */
}

/* Sort icon styling */
.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #3182CE; /* Medium blue */
}

/* Table cell styling */
.claims-table td {
  padding: 16px;
  border-bottom: 1px solid #E2E8F0; /* Very light gray-blue */
  vertical-align: middle;
}

/* Remove border from last row */
.claims-table tr:last-child td {
  border-bottom: none;
}

/* Row hover effect */
.claims-table tr:hover {
  background-color: #F7FAFC; /* Very light blue */
}

/* Description cell styling */
.description {
  max-width: 250px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* Status badge base styling */
.status-badge {
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

/* Pending status styling */
.status-badge.pending {
  background-color: #FEFCBF; /* Light yellow */
  color: #975A16; /* Dark yellow */
}

/* Resolved status styling */
.status-badge.resolved {
  background-color: #C6F6D5; /* Light green */
  color: #276749; /* Dark green */
}

/* Rejected status styling */
.status-badge.rejected {
  background-color: #FED7D7; /* Light red */
  color: #9B2C2C; /* Dark red */
}

/* User cell styling */
.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* User avatar styling */
.user-avatar {
  width: 32px;
  height: 32px;
  background-color: #90CDF4; /* Light blue */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #1A365D; /* Dark blue */
}

/* Action buttons container */
.action-buttons {
  display: flex;
  gap: 8px;
}

/* Base button styling */
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

/* Disabled button styling */
.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

/* Resolve button styling */
.resolve-btn {
  background-color: #38A169; /* Green */
  color: white;
}

/* Resolve button hover effect */
.resolve-btn:hover:not(:disabled) {
  background-color: #2F855A; /* Darker green */
}

/* Reject button styling */
.reject-btn {
  background-color: #E53E3E; /* Red */
  color: white;
}

/* Reject button hover effect */
.reject-btn:hover:not(:disabled) {
  background-color: #C53030; /* Darker red */
}

/* Button icon styling */
.btn-icon {
  font-size: 14px;
}

/* Empty state styling */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #718096; /* Grayish blue */
}

/* Empty state icon */
.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
  color: #CBD5E0; /* Light gray-blue */
}

/* Pending row indicator */
tr.status-pending {
  border-left: 3px solid #D69E2E; /* Yellow */
}

/* Resolved row indicator */
tr.status-resolved {
  border-left: 3px solid #38A169; /* Green */
}

/* Rejected row indicator */
tr.status-rejected {
  border-left: 3px solid #E53E3E; /* Red */
}
</style>