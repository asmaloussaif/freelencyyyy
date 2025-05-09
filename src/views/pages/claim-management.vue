<template>
  <div class="claims-container">
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
        />
        <button class="search-btn">
          <span class="search-icon">🔍</span>
        </button>
      </div>
    </div>

    <div class="table-responsive">
      <table class="claims-table">
        <thead>
          <tr>
            <th @click="sortBy('id')">
              ID
              <span v-if="sortKey === 'id'" class="sort-icon">{{
                sortOrder === 1 ? '↑' : '↓'
              }}</span>
            </th>
            <th @click="sortBy('sujet')">
              Subject
              <span v-if="sortKey === 'sujet'" class="sort-icon">{{
                sortOrder === 1 ? '↑' : '↓'
              }}</span>
            </th>
            <th>Description</th>
            <th @click="sortBy('statut')">
              Status
              <span v-if="sortKey === 'statut'" class="sort-icon">{{
                sortOrder === 1 ? '↑' : '↓'
              }}</span>
            </th>
            <th>User</th>
            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          <tr v-for="claim in filteredClaims" :key="claim.id" :class="'status-' + claim.statut">
            <td>#{{ claim.id }}</td>

            <td>{{ claim.sujet }}</td>

            <td class="description">{{ claim.description }}</td>

            <td>
              <span :class="'status-badge ' + getStatusColor(claim.statut)">
                {{ claim.statut.toUpperCase() }}
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
                  :disabled="claim.statut === 'resolved'"
                >
                  <span class="btn-icon">✓</span> Resolve
                </button>

                <button
                  class="btn reject-btn"
                  @click="rejectClaim(claim.id)"
                  :disabled="claim.statut === 'rejected'"
                >
                  <span class="btn-icon">✗</span> Reject
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="filteredClaims.length === 0" class="empty-state">
      <div class="empty-icon">📭</div>
      <p>No claims found</p>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()

export default {
  setup() {
    const claims = ref([])
    const searchQuery = ref('')
    const sortKey = ref('id')
    const sortOrder = ref(1)

    onMounted(async () => {
      await fetchClaims()
    })

    const fetchClaims = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/reclamations', {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })
        claims.value = response.data
      } catch (error) {
        console.error('Error fetching claims data:', error)
      }
    }

    const deleteClaim = async (id) => {
      try {
        await axios.delete(`http://localhost:8000/api/claims/${id}`, {
          headers: {
            Authorization: `Bearer ${authStore.token}`,
          },
        })

        await fetchClaims()
      } catch (error) {
        console.error('Error deleting claim', error)
      }
    }

    const filteredClaims = computed(() => {
      let result = claims.value

      if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(
          (claim) =>
            claim.sujet.toLowerCase().includes(query) ||
            claim.description.toLowerCase().includes(query) ||
            claim.user.name.toLowerCase().includes(query),
        )
      }

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
    const getStatusColor = (statut) => {
      switch (statut) {
        case 'pending':
          return 'pending'
        case 'resolved':
          return 'resolved'
        case 'rejected':
          return 'rejected'
        default:
          return ''
      }
    }

    const getUserInitial = (name) => {
      return name
        .split(' ')
        .map((n) => n[0])
        .join('')
    }

    const resolveClaim = async (id) => {
      try {
        await axios.put(
          `http://localhost:8000/api/reclamations/${id}`,
          { statut: 'resolved' },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        )
        await fetchClaims()
      } catch (error) {
        console.error('Error resolving claim:', error)
      }
    }

    const rejectClaim = async (id) => {
      try {
        await axios.put(
          `http://localhost:8000/api/reclamations/${id}`,
          { statut: 'rejected' },
          {
            headers: {
              Authorization: `Bearer ${authStore.token}`,
            },
          },
        )
        await fetchClaims() 
      } catch (error) {
        console.error('Error rejecting claim:', error)
      }
    }
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
      rejectClaim,
      deleteClaim,
    }
  },
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
  color: #1a365d; /* Dark blue */
  margin: 0;
  display: flex;
  align-items: center;
  gap: 10px;
}

/* Icon styling */
.icon {
  font-size: 28px;
  color: #2b6cb0; /* Medium blue */
}

/* Search bar styling */
.search-bar {
  display: flex;
  align-items: center;
  background: #ebf8ff; /* Very light blue */
  border-radius: 8px;
  padding: 4px;
  border: 1px solid #bee3f8; /* Light blue border */
}

/* Search input styling */
.search-input {
  border: none;
  background: transparent;
  padding: 8px 12px;
  outline: none;
  width: 200px;
  color: #2c5282; /* Dark blue text */
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
  color: #4299e1; /* Medium blue */
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
  background-color: #bee3f8; /* Light blue */
  color: #2c5282; /* Dark blue */
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
  background-color: #90cdf4; /* Slightly darker light blue */
}

/* Sort icon styling */
.sort-icon {
  margin-left: 4px;
  font-size: 12px;
  color: #3182ce; /* Medium blue */
}

/* Table cell styling */
.claims-table td {
  padding: 16px;
  border-bottom: 1px solid #e2e8f0; /* Very light gray-blue */
  vertical-align: middle;
}

/* Remove border from last row */
.claims-table tr:last-child td {
  border-bottom: none;
}

/* Row hover effect */
.claims-table tr:hover {
  background-color: #f7fafc; /* Very light blue */
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
  background-color: #fefcbf; /* Light yellow */
  color: #975a16; /* Dark yellow */
}

/* Resolved status styling */
.status-badge.resolved {
  background-color: #c6f6d5; /* Light green */
  color: #276749; /* Dark green */
}

/* Rejected status styling */
.status-badge.rejected {
  background-color: #fed7d7; /* Light red */
  color: #9b2c2c; /* Dark red */
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
  background-color: #90cdf4; /* Light blue */
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  color: #1a365d; /* Dark blue */
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
  background-color: #38a169; /* Green */
  color: white;
}

/* Resolve button hover effect */
.resolve-btn:hover:not(:disabled) {
  background-color: #2f855a; /* Darker green */
}

/* Reject button styling */
.reject-btn {
  background-color: #e53e3e; /* Red */
  color: white;
}

/* Reject button hover effect */
.reject-btn:hover:not(:disabled) {
  background-color: #c53030; /* Darker red */
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
  color: #cbd5e0; /* Light gray-blue */
}

/* Pending row indicator */
tr.status-pending {
  border-left: 3px solid #d69e2e; /* Yellow */
}

/* Resolved row indicator */
tr.status-resolved {
  border-left: 3px solid #38a169; /* Green */
}

/* Rejected row indicator */
tr.status-rejected {
  border-left: 3px solid #e53e3e; /* Red */
}
</style>
