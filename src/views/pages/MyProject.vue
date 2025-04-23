<template>
  <CContainer class="py-4">
    <h2 class="mb-4 fw-bold" style="color: #5E2B97;">My Projects</h2>

    <CTable hover responsive bordered class="shadow-sm" style="border-color: #E2C3FF;">
      <CTableHead style="background-color: #F0D9FF;">
        <CTableRow>
          <CTableHeaderCell style="color: #4A2C7A;">Project Name</CTableHeaderCell>
          <CTableHeaderCell style="color: #4A2C7A;">End Date</CTableHeaderCell>
          <CTableHeaderCell style="color: #4A2C7A;">Amount</CTableHeaderCell>
          <CTableHeaderCell style="color: #4A2C7A;">Status</CTableHeaderCell>
          <CTableHeaderCell style="color: #4A2C7A;">Client Name</CTableHeaderCell>
          <CTableHeaderCell style="color: #4A2C7A;">Rate Client</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="project in projects" :key="project.id">
          <CTableDataCell style="color: #6E3FB4;">{{ project.name }}</CTableDataCell>
          <CTableDataCell style="color: #6E3FB4;">{{ formatDate(project.end_date) }}</CTableDataCell>
          <CTableDataCell style="color: #6E3FB4;">{{ formatCurrency(project.amount) }}</CTableDataCell>
          <CTableDataCell>
            <CBadge :style="statusStyle(project.status)">
              {{ project.status }}
            </CBadge>
          </CTableDataCell>
          <CTableDataCell style="color: #6E3FB4;">{{ project.client_name }}</CTableDataCell>
          <CTableDataCell>
            <CButton
              v-if="project.status === 'Finished'"
              color="info"
              size="sm"
              @click="openRatingModal(project)"
              style="background-color: #6E3FB4; border-color: #6E3FB4;"
            >
              Rate
            </CButton>
            <span v-else style="color: #8A4EBF;">—</span>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- Rating Modal -->
    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader style="background-color: #F0D9FF; border-color: #E2C3FF;">
        <strong style="color: #5E2B97;">Rate {{ selectedProject?.client_name }}</strong>
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
      <CModalFooter style="background-color: #F5E9FF; border-color: #E2C3FF;">
        <CButton 
          color="secondary" 
          @click="showModal = false"
          style="background-color: #8A4EBF; border-color: #8A4EBF;"
        >
          Cancel
        </CButton>
        <CButton 
          color="primary" 
          @click="submitRating"
          style="background-color: #5E2B97; border-color: #5E2B97;"
        >
          Submit
        </CButton>
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

const statusStyle = (status) => {
  switch(status) {
    case 'Finished':
      return {
        backgroundColor: '#D4EDDA',
        color: '#155724',
        border: '1px solid #28A745'
      }
    case 'In Progress':
      return {
        backgroundColor: '#F0D9FF',
        color: '#5E2B97',
        border: '1px solid #8A4EBF'
      }
    default:
      return {
        backgroundColor: '#F5E9FF',
        color: '#6E3FB4',
        border: '1px solid #D9B3FF'
      }
  }
}

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
  color: #D9B3FF; /* Light purple */
  transition: color 0.2s;
}

.star.filled {
  color: #8A4EBF; /* Medium purple */
}

/* Table hover effect */
.table-hover tbody tr:hover {
  background-color: #FAF2FF !important;
}

/* Badge styling */
.badge {
  padding: 0.5rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
}

.badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.badge[style*="Finished"]::before {
  background-color: #155724;
}

.badge[style*="In Progress"]::before {
  background-color: #5E2B97;
}
</style>