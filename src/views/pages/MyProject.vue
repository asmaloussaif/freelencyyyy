<template>
  <div class="container">
    <h2 class="mb-4">My Projects</h2>

    <CCard class="mb-4">
      <CCardBody>
        <CDataTable
          :items="projects"
          :fields="fields"
          hover
          striped
          bordered
          responsive
        >
          <template #status="{ item }">
            <CBadge :color="getStatusColor(item.status)">{{ item.status }}</CBadge>
          </template>

          <template #actions="{ item }">
            <CButton size="sm" color="info" @click="viewDetails(item)">View</CButton>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>

    <!-- Modal for project details -->
    <CModal :visible="modalVisible" @close="modalVisible = false">
      <CModalHeader>
        <CModalTitle>Project Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>Title:</strong> {{ selectedProject.title }}</p>
        <p><strong>Description:</strong> {{ selectedProject.description }}</p>
        <p><strong>Status:</strong> {{ selectedProject.status }}</p>
        <p><strong>Client:</strong> {{ selectedProject.client_name }}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="modalVisible = false">Close</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CCard,
  CCardBody,
  CDataTable,
  CBadge,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
} from '@coreui/vue'
import axios from 'axios'

const projects = ref([])
const modalVisible = ref(false)
const selectedProject = ref({})

const fields = [
  { key: 'title', label: 'Project Title' },
  { key: 'client_name', label: 'Client' },
  { key: 'status', label: 'Status' },
  { key: 'actions', label: 'Actions', _style: 'width: 100px' },
]

const getStatusColor = (status) => {
  switch (status) {
    case 'In Progress':
      return 'warning'
    case 'Completed':
      return 'success'
    case 'Pending':
      return 'secondary'
    default:
      return 'primary'
  }
}

const viewDetails = (project) => {
  selectedProject.value = project
  modalVisible.value = true
}

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/freelancer-projects')
    projects.value = response.data
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1100px;
  margin: auto;
  font-family: 'Poppins', sans-serif;
}
</style>
