<template>
  <CContainer>
    <h4 class="mb-4">Projects with Applications</h4>
    <CTable hover responsive>
      <CTableHead>
        <CTableRow>
          <CTableHeaderCell>#</CTableHeaderCell>
          <CTableHeaderCell>Project Title</CTableHeaderCell>
          <CTableHeaderCell>Status</CTableHeaderCell>
          <CTableHeaderCell>Proposals Number</CTableHeaderCell>
          <CTableHeaderCell>Actions</CTableHeaderCell>
        </CTableRow>
      </CTableHead>
      <CTableBody>
        <CTableRow v-for="(item, index) in projects" :key="item.project_id">
          <CTableDataCell>{{ index + 1 }}</CTableDataCell>
          <CTableDataCell>{{ item.project.titre }}</CTableDataCell>
          <CTableDataCell>
            <CBadge :color="getStatusColor(item.project.statut)">
              {{ item.project.statut }}
            </CBadge>
          </CTableDataCell>
          <CTableDataCell>{{ item.freelancer_count }}</CTableDataCell>
          <CTableDataCell>
            <CButton color="info" size="sm" @click="openModal(item)">View Proposal Details</CButton>
          </CTableDataCell>
        </CTableRow>
      </CTableBody>
    </CTable>

    <!-- Proposals Modal -->
    <CModal :visible="showModal" @close="showModal = false">
      <CModalHeader>
        <CModalTitle>Project Proposals</CModalTitle>
      </CModalHeader>

      <CModalBody>
        <div v-if="selectedProject?.applications?.length">
          <div
            v-for="(application, index) in selectedProject.applications"
            :key="index"
            class="mb-3 p-3 border rounded"
          >
            <h6>{{ application.freelancer?.name }} {{ application.freelancer?.lastName }}</h6>
            <p><strong>Email:</strong> {{ application.freelancer?.email }}</p>

            <div class="d-flex gap-2 mt-2">
              <CButton color="success" size="sm" @click="confirmAction(application.id, 'accepted')">Accept</CButton>
              <CButton color="info" size="sm" @click="goToChat">Chat</CButton>
              <CButton color="danger" size="sm" @click="confirmAction(application.id, 'refuse')">refuse</CButton>
            </div>
          </div>
        </div>
        <div v-else>
          <p>No proposals received yet.</p>
        </div>
      </CModalBody>

      <CModalFooter>
        <CButton color="secondary" @click="showModal = false">Close</CButton>
      </CModalFooter>
    </CModal>

    <!-- Confirmation Modal -->
    <CModal :visible="showConfirmModal" @close="showConfirmModal = false">
      <CModalHeader>
        <CModalTitle>Confirm Action</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Are you sure you want to <strong>{{ selectedStatus }}</strong> this application?</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="showConfirmModal = false">Cancel</CButton>
        <CButton color="primary" @click="submitStatusUpdate">Confirm</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import {
  CContainer,
  CTable,
  CTableHead,
  CTableRow,
  CTableHeaderCell,
  CTableDataCell,
  CTableBody,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CBadge,
} from '@coreui/vue'

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/authStore'

const router = useRouter()
const authStore = useAuthStore()

const projects = ref([])
const showModal = ref(false)
const showConfirmModal = ref(false)
const selectedProject = ref(null)
const selectedApplicationId = ref(null)
const selectedStatus = ref('accepted')

const openModal = (project) => {
  selectedProject.value = project
  showModal.value = true
}

const goToChat = () => {
  router.push('/dashboard/inbox')
}

const getStatusColor = (status) => {
  switch (status?.toLowerCase()) {
    case 'open':
      return 'success'
    case 'in progress':
      return 'warning'
    case 'closed':
    case 'completed':
      return 'secondary'
    default:
      return 'primary'
  }
}

const fetchAppliedProjects = async () => {
  try {
    const res = await axios.get('http://127.0.0.1:8000/api/application_project', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    projects.value = res.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

onMounted(() => {
  fetchAppliedProjects()
})

const confirmAction = (applicationId, status) => {
  selectedApplicationId.value = applicationId
  selectedStatus.value = status
  showConfirmModal.value = true
}

const submitStatusUpdate = async () => {
  try {
    await axios.put(
      `http://127.0.0.1:8000/api/applications/${selectedApplicationId.value}/status`,
      { statut: selectedStatus.value },
      { headers: { Authorization: `Bearer ${authStore.token}` } }
    )
    showConfirmModal.value = false
    showModal.value = false
    await fetchAppliedProjects()
  } catch (error) {
    console.error('Status update failed:', error)
  }
}
</script>

<style scoped>
/* Container Styling */
.c-container {
  background-color: #f8faff;
  padding: 2rem;
  border-radius: 12px;
}

/* Page Title */
.page-title {
  background-color: #e1f0ff;
  color: #0f2573;
  padding: 1rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  font-size: 1.3rem;
  margin-bottom: 1.5rem;
}

/* Proposal Card */
.proposal-card {
  background-color: white;
  border: 1px solid #be95c4;
  border-left: 5px solid #0f2573;
  border-radius: 10px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
}

.proposal-card:hover {
  background-color: #e1f0ff;
}

/* Buttons */
.btn-primary,
.btn-success,
.btn-info,
.btn-danger {
  background-color: #0f2573 !important;
  color: white;
  border: none !important;
}

.btn-primary:hover,
.btn-success:hover,
.btn-info:hover,
.btn-danger:hover {
  background-color: #191627 !important;
}

/* Status Badges */
.badge-success {
  background-color: #5e548e !important;
  color: white;
}

/* Table Row Hover */
.table-hover tbody tr:hover {
  background-color: #e1f0ff;
  transition: background 0.3s ease;
}
</style>
