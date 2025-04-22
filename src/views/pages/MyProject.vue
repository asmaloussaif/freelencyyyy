<template>
  <CContainer class="py-4">
    <h2 class="mb-4 fw-bold text-primary">My Projects</h2>

    <CTable hover responsive bordered class="shadow-sm">
      <CTableHead color="light">
        <CTableRow>
          <CTableHeaderCell>Project Name</CTableHeaderCell>
          <CTableHeaderCell>End Date</CTableHeaderCell>
          <CTableHeaderCell>Amount</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Client Name</CTableHeaderCell>
          <CTableHeaderCell>Rate Client</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="project in projects" :key="project.id">
          <CTableDataCell>{{ project.name }}</CTableDataCell>
          <CTableDataCell>{{ formatDate(project.end_date) }}</CTableDataCell>
          <CTableDataCell>{{ formatCurrency(project.amount) }}</CTableDataCell>
          <CTableDataCell>
            <CBadge :color="statusColor(project.status)">
              {{ project.status }}
            </CBadge>
          </CTableDataCell>
          <CTableDataCell>{{ project.client_name }}</CTableDataCell>
          <CTableDataCell>
            <CButton
              v-if="project.status === 'Finished'"
              color="info"
              size="sm"
              @click="openRatingModal(project)"
            >
              Rate
            </CButton>
            <span v-else class="text-muted">—</span>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- Rating Modal -->
    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <strong>Rate {{ selectedProject?.client_name }}</strong>
      </CModalHeader>
      <CModalBody>
        <div class="star-rating text-center">
          <span
            v-for="star in 5"
            :key="star"
            class="star"
            :class="{ filled: star <= ratingValue }"
            @click="ratingValue = star"
          >
            ★
          </span>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Cancel</CButton>
        <CButton color="primary" @click="submitRating">Submit</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableBody,
  CTableDataCell,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/vue'
import { format } from 'date-fns'

const projects = ref([])

onMounted(() => {
  projects.value = [
    {
      id: 1,
      name: 'E-commerce Website',
      end_date: '2025-04-28',
      amount: 1500,
      status: 'Finished',
      client_name: 'Olivia Smith',
    },
    {
      id: 2,
      name: 'Mobile App Development',
      end_date: '2025-05-15',
      amount: 2200,
      status: 'In Progress',
      client_name: 'Daniel Clark',
    },
  ]
})

const formatDate = (dateStr) => format(new Date(dateStr), 'MMM dd, yyyy')

const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount)

const statusColor = (status) => {
  return status === 'Finished' ? 'success' : 'warning'
}

// Rating logic
const showModal = ref(false)
const selectedProject = ref(null)
const ratingValue = ref(0)

const openRatingModal = (project) => {
  selectedProject.value = project
  ratingValue.value = 0
  showModal.value = true
}

const submitRating = () => {
  if (ratingValue.value === 0) {
    alert('Please select a star rating.')
    return
  }

  const ratingData = {
    projectId: selectedProject.value.id,
    clientName: selectedProject.value.client_name,
    rating: ratingValue.value,
  }

  console.log('Submitted rating:', ratingData)

  // Replace with API call to backend
  // await axios.post('/api/ratings', ratingData)

  showModal.value = false
}
</script>

<style scoped>
.star-rating {
  font-size: 2rem;
  user-select: none;
}

.star {
  cursor: pointer;
  color: #ccc;
  transition: color 0.2s;
}

.star.filled {
  color: #facc15; /* Yellow-400 */
}
</style>
