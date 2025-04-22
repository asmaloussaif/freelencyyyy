<template>
  <div class="container my-4">
    <CCard class="shadow rounded-4 border-0">
      <CCardHeader class="bg-primary text-white rounded-top-4 py-3 px-4">
        <h4 class="mb-0">Project Management</h4>
      </CCardHeader>
      <CCardBody class="p-4">
        <CRow class="mb-4 g-3">
          <CCol :md="6">
            <CFormInput
              v-model="search"
              placeholder="Search by project name..."
              class="shadow-sm rounded-pill border-0 px-4 py-2"
            />
          </CCol>
          <CCol :md="6">
            <CFormSelect
              v-model="statusFilter"
              class="shadow-sm rounded-pill border-0 px-4 py-2"
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
            <CTableHead class="table-light">
              <CTableRow>
                <CTableHeaderCell>Project Name</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Budget</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Freelancer</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="project in filteredProjects" :key="project.id">
                <CTableDataCell>{{ project.name }}</CTableDataCell>
                <CTableDataCell>{{ formatDate(project.date) }}</CTableDataCell>
                <CTableDataCell>\${{ project.budget }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge
                    :color="getStatusColor(project.status)"
                    class="text-capitalize px-3 py-1"
                  >
                    {{ project.status.replace('_', ' ') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <span v-if="project.status !== 'pending'">{{ project.freelancer }}</span>
                  <span v-else class="text-muted">-</span>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" size="sm" class="me-2 shadow-sm rounded-pill px-3">
                    View
                  </CButton>
                  <CButton
                    color="dark"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="deleteProject(project.id)"
                  >
                    Delete
                  </CButton>
                  <CButton
                    color="secondary"
                    size="sm"
                    class="shadow-sm rounded-pill px-3"
                    @click="openRatingModal(project)"
                  >
                    {{ project.rating ? project.rating + ' ★' : 'Rate' }}
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
        <div v-else class="text-center py-5 text-muted fs-5">
          No projects found.
        </div>
      </CCardBody>
    </CCard>

    <!-- Rating Modal -->
    <CModal alignment="center" :visible="ratingModalVisible" @close="ratingModalVisible = false">
      <CModalHeader>
        <CModalTitle>Rate Freelancer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="text-center">
          <p class="mb-3">How would you rate {{ selectedProject?.freelancer }}?</p>
          <div class="d-flex justify-content-center gap-2">
            <CButton
              v-for="star in 5"
              :key="star"
              :color="star <= tempRating ? 'warning' : 'secondary'"
              shape="rounded-pill"
              size="lg"
              @click="tempRating = star"
            >
              ★
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="outline-dark" @click="ratingModalVisible = false">Close</CButton>
        <CButton color="primary" @click="submitRating">Submit</CButton>
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

const getStatusColor = (status) => {
  switch (status) {
    case 'pending':
      return 'secondary'
    case 'in_progress':
      return 'warning'
    case 'finished':
      return 'success'
    default:
      return 'light'
  }
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

h4 {
  font-weight: 600;
  letter-spacing: 0.5px;
}

.text-capitalize {
  text-transform: capitalize;
}

.table-light {
  background-color: #f8f9fa !important;
}
</style>
