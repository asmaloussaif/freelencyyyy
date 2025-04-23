<template>
  <div class="container my-4">
    <CCard class="shadow rounded-4" style="border-color: #E2C3FF;">
      <CCardHeader class="rounded-top-4 py-3 px-4" style="background: linear-gradient(to right, #6E3FB4, #8A4EBF); color: white;">
        <h4 class="mb-0">Project Management</h4>
      </CCardHeader>
      <CCardBody class="p-4">
        <CRow class="mb-4 g-3">
          <CCol :md="6">
            <CFormInput
              v-model="search"
              placeholder="Search by project name..."
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #E2C3FF; background-color: #F5E9FF;"
            />
          </CCol>
          <CCol :md="6">
            <CFormSelect
              v-model="statusFilter"
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #E2C3FF; background-color: #F5E9FF; color: #4A2C7A;"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="finished">Finished</option>
            </CFormSelect>
          </CCol>
        </CRow>

        <div v-if="filteredProjects.length">
          <CTable hover responsive class="rounded-3 overflow-hidden shadow-sm">
            <CTableHead style="background-color: #F0D9FF;">
              <CTableRow>
                <CTableHeaderCell style="color: #4A2C7A;">Project Name</CTableHeaderCell>
                <CTableHeaderCell style="color: #4A2C7A;">Date</CTableHeaderCell>
                <CTableHeaderCell style="color: #4A2C7A;">Budget</CTableHeaderCell>
                <CTableHeaderCell style="color: #4A2C7A;">Status</CTableHeaderCell>
                <CTableHeaderCell style="color: #4A2C7A;">Freelancer</CTableHeaderCell>
                <CTableHeaderCell style="color: #4A2C7A;">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow 
                v-for="project in filteredProjects" 
                :key="project.id"
                style="background-color: white;"
              >
                <CTableDataCell style="color: #6E3FB4;">{{ project.name }}</CTableDataCell>
                <CTableDataCell style="color: #6E3FB4;">{{ formatDate(project.date) }}</CTableDataCell>
                <CTableDataCell style="color: #6E3FB4;">\${{ project.budget }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :style="statusStyle(project.status)"
                    class="text-capitalize px-3 py-1"
                  >
                    {{ project.status.replace('_', ' ') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <span v-if="project.status !== 'pending'" style="color: #6E3FB4;">{{ project.freelancer }}</span>
                  <span v-else style="color: #A78BC9;">-</span>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    color="primary" 
                    size="sm" 
                    class="me-2 shadow-sm rounded-pill px-3"
                    style="background-color: #6E3FB4; border-color: #6E3FB4;"
                  >
                    View
                  </CButton>
                  <CButton
                    color="dark"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="deleteProject(project.id)"
                    style="background-color: #4A2C7A; border-color: #4A2C7A;"
                  >
                    Delete
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    class="shadow-sm rounded-pill px-3"
                    @click="openRatingModal(project)"
                    style="background-color: #8A4EBF; border-color: #8A4EBF;"
                  >
                    {{ project.rating ? project.rating + ' ★' : 'Rate' }}
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
        <div v-else class="text-center py-5" style="color: #8A4EBF; font-size: 1.25rem;">
          No projects found.
        </div>
      </CCardBody>
    </CCard>

    <!-- Rating Modal -->
    <CModal alignment="center" :visible="ratingModalVisible" @close="ratingModalVisible = false">
      <CModalHeader style="background-color: #F0D9FF; border-color: #E2C3FF;">
        <CModalTitle style="color: #5E2B97;">Rate Freelancer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="text-center">
          <p class="mb-3" style="color: #4A2C7A;">How would you rate {{ selectedProject?.freelancer }}?</p>
          <div class="d-flex justify-content-center gap-2">
            <CButton
              v-for="star in 5"
              :key="star"
              :style="star <= tempRating ? 
                { backgroundColor: '#8A4EBF', borderColor: '#8A4EBF' } : 
                { backgroundColor: '#E2C3FF', borderColor: '#E2C3FF', color: '#4A2C7A' }"
              shape="rounded-pill"
              size="lg"
              @click="tempRating = star"
            >
              ★
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter style="background-color: #F5E9FF; border-color: #E2C3FF;">
        <CButton 
          color="outline-dark" 
          @click="ratingModalVisible = false"
          style="border-color: #8A4EBF; color: #8A4EBF;"
        >
          Close
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
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CFormInput,
  CFormSelect,
  CButton,
  CRow,
  CCol,
  CTable,
  CTableHead,
  CTableBody,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CBadge,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
} from '@coreui/vue'

const search = ref('')
const statusFilter = ref('')
const ratingModalVisible = ref(false)
const tempRating = ref(0)
const selectedProject = ref(null)

const projects = ref([])

const statusStyle = (status) => {
  switch(status) {
    case 'pending':
      return {
        backgroundColor: '#F0D9FF',
        color: '#5E2B97',
        border: '1px solid #8A4EBF'
      }
    case 'in_progress':
      return {
        backgroundColor: '#FFF3CD',
        color: '#856404',
        border: '1px solid #FFC107'
      }
    case 'finished':
      return {
        backgroundColor: '#D4EDDA',
        color: '#155724',
        border: '1px solid #28A745'
      }
    default:
      return {
        backgroundColor: '#F5E9FF',
        color: '#6E3FB4',
        border: '1px solid #D9B3FF'
      }
  }
}

const fetchProjects = async () => {
  projects.value = [
    {
      id: 1,
      name: 'Website Redesign',
      date: '2025-04-01',
      budget: 1500,
      status: 'in_progress',
      freelancer: 'John Doe',
      rating: null,
    },
    {
      id: 2,
      name: 'Mobile App UI',
      date: '2025-03-15',
      budget: 800,
      status: 'finished',
      freelancer: 'Jane Smith',
      rating: 4,
    },
    {
      id: 3,
      name: 'Logo Design',
      date: '2025-04-10',
      budget: 200,
      status: 'pending',
      freelancer: '',
      rating: null,
    },
  ]
}

const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    const matchesSearch = p.name.toLowerCase().includes(search.value.toLowerCase())
    const matchesStatus = statusFilter.value ? p.status === statusFilter.value : true
    return matchesSearch && matchesStatus
  })
})

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString(undefined, options)
}

const deleteProject = (id) => {
  projects.value = projects.value.filter((p) => p.id !== id)
}

const openRatingModal = (project) => {
  selectedProject.value = project
  tempRating.value = project.rating || 0
  ratingModalVisible.value = true
}

const submitRating = () => {
  if (selectedProject.value) {
    selectedProject.value.rating = tempRating.value
  }
  ratingModalVisible.value = false
}

onMounted(fetchProjects)
</script>

<style scoped>
.container {
  max-width: 1100px;
}

/* Table hover effect */
.table-hover tbody tr:hover {
  background-color: #FAF2FF !important;
}

/* Form placeholders */
::placeholder {
  color: #A78BC9 !important;
  opacity: 1;
}

/* Badge styling */
.badge {
  border-radius: 12px;
  font-weight: 500;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
  display: inline-flex;
  align-items: center;
  transition: all 0.2s ease;
}

.badge::before {
  content: '';
  display: inline-block;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-right: 6px;
}

.badge[style*="pending"]::before {
  background-color: #5E2B97;
}

.badge[style*="in_progress"]::before {
  background-color: #856404;
}

.badge[style*="finished"]::before {
  background-color: #155724;
}

/* Focus states */
button:focus,
input:focus,
select:focus {
  box-shadow: 0 0 0 0.2rem rgba(110, 63, 180, 0.25) !important;
  border-color: #8A4EBF !important;
}
</style>