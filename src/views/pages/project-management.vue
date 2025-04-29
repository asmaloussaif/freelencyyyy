<template>
  <div class="container my-4">
    <CCard class="shadow rounded-4" style="border-color: #ADE1FB;">
      <CCardHeader class="rounded-top-4 py-3 px-4" style="background: linear-gradient(to right, #266CA9, #0F2573); color: white;">
        <h4 class="mb-0">Project Management</h4>
      </CCardHeader>
      <CCardBody class="p-4">
        <CRow class="mb-4 g-3">
          <CCol :md="6">
            <CFormInput
              v-model="search"
              placeholder="Search by project name..."
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #ADE1FB; background-color: #F0F8FF;"
            />
          </CCol>
          <CCol :md="6">
            <CFormSelect
              v-model="statusFilter"
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #ADE1FB; background-color: #F0F8FF; color: #041D56;"
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
            <CTableHead style="background-color: #E1F0FF;">
              <CTableRow>
                <CTableHeaderCell style="color: #041D56;">Project Name</CTableHeaderCell>
                <CTableHeaderCell style="color: #041D56;">Date</CTableHeaderCell>
                <CTableHeaderCell style="color: #041D56;">Budget</CTableHeaderCell>
                <CTableHeaderCell style="color: #041D56;">Status</CTableHeaderCell>
                <CTableHeaderCell style="color: #041D56;">Freelancer</CTableHeaderCell>
                <CTableHeaderCell style="color: #041D56;">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow 
                v-for="project in filteredProjects" 
                :key="project.id"
                style="background-color: white;"
              >
                <CTableDataCell style="color: #266CA9;">{{ project.name }}</CTableDataCell>
                <CTableDataCell style="color: #266CA9;">{{ formatDate(project.date) }}</CTableDataCell>
                <CTableDataCell style="color: #266CA9;">\${{ project.budget }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :style="statusStyle(project.status)"
                    class="text-capitalize px-3 py-1"
                  >
                    {{ project.status.replace('_', ' ') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <span v-if="project.status !== 'pending'" style="color: #266CA9;">{{ project.freelancer }}</span>
                  <span v-else style="color: #7D9FC7;">-</span>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton 
                    color="primary" 
                    size="sm" 
                    class="me-2 shadow-sm rounded-pill px-3"
                    style="background-color: #266CA9; border-color: #266CA9;"
                  >
                    View
                  </CButton>
                  <CButton
                    color="dark"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="deleteProject(project.id)"
                    style="background-color: #041D56; border-color: #041D56;"
                  >
                    Delete
                  </CButton>
                  <CButton
  v-if="project.status === 'finished'"
  color="secondary"
  size="sm"
  class="shadow-sm rounded-pill px-3"
  @click="openRatingModal(project)"
  style="background-color: #0F2573; border-color: #0F2573;"
>
  {{ project.rating ? project.rating + ' ★' : 'Rate' }}
</CButton>

                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
        <div v-else class="text-center py-5" style="color: #266CA9; font-size: 1.25rem;">
          No projects found.
        </div>
      </CCardBody>
    </CCard>

    <!-- Rating Modal -->
    <CModal alignment="center" :visible="ratingModalVisible" @close="ratingModalVisible = false">
      <CModalHeader style="background-color: #E1F0FF; border-color: #ADE1FB;">
        <CModalTitle style="color: #041D56;">Rate Freelancer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="text-center">
          <p class="mb-3" style="color: #041D56;">How would you rate {{ selectedProject?.freelancer }}?</p>
          <div class="d-flex justify-content-center gap-2">
            <CButton
              v-for="star in 5"
              :key="star"
              :style="star <= tempRating ? 
                { backgroundColor: '#266CA9', borderColor: '#266CA9' } : 
                { backgroundColor: '#E1F0FF', borderColor: '#ADE1FB', color: '#041D56' }"
              shape="rounded-pill"
              size="lg"
              @click="tempRating = star"
            >
              ★
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter style="background-color: #F0F8FF; border-color: #ADE1FB;">
        <CButton 
          color="outline-dark" 
          @click="ratingModalVisible = false"
          style="border-color: #266CA9; color: #266CA9;"
        >
          Close
        </CButton>
        <CButton 
          color="primary" 
          @click="submitRating"
          style="background-color: #0F2573; border-color: #0F2573;"
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
        backgroundColor: '#E1F0FF',
        color: '#266CA9',
        border: '1px solid #ADE1FB'
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
        backgroundColor: '#F0F8FF',
        color: '#266CA9',
        border: '1px solid #ADE1FB'
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
  background-color: #F0F8FF !important;
}

/* Form placeholders */
::placeholder {
  color: #7D9FC7 !important;
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
  background-color: #266CA9;
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
  box-shadow: 0 0 0 0.2rem rgba(38, 108, 169, 0.25) !important;
  border-color: #266CA9 !important;
}
</style>