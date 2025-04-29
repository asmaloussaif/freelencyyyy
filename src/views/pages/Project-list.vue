<template>
  <div class="container py-4">
    <!-- Project List -->
    <CCard class="mb-4 shadow-sm" style="background-color: #F8FAFF; border-color: #E2C3FF;">
      <CCardBody>
        <h4 class="fw-bold" style="color: #1F4788;">Your Projects</h4>
        <CRow class="mt-3">
          <CCol
            v-for="project in projects"
            :key="project.id"
            :md="4"
            class="mb-4"
          >
            <CCard class="h-100 shadow-sm hover-card" style="border-color: #E2C3FF; background-color: #E1F0FF;">
              <CCardBody>
                <h5 class="fw-bold mb-1" style="color: #3A6BB5;">{{ project.name }}</h5>
                <p class="mb-1" style="color: #6A9BD9;">Date: {{ formatDate(project.date) }}</p>
                <p class="mb-2" style="color: #4A8ED8;">Budget: {{ project.budget }} TND</p>
                <p class="mb-2" style="color: #4A8ED8;">
                  Status: <strong :style="{ color: getStatusColor(project.status) }">{{ project.status }}</strong>
                </p>
                <div v-if="project.status === 'In Progress' || project.status === 'Finished'">
                  <p class="mb-2" style="color: #4A8ED8;">
                    Freelancer: <strong>{{ project.freelancer?.name || 'N/A' }}</strong>
                  </p>
                </div>
                <CButton
                  v-if="project.status === 'In Progress' || project.status === 'Finished'"
                  color="primary"
                  class="w-100 shadow-sm"
                  style="background-color: #4A8ED8; border-color: #4A8ED8;"
                  @click="viewProjectDetails(project)"
                >
                  View Project Details
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>

        <!-- No projects -->
        <div v-if="projects.length === 0" class="text-center mt-5" style="color: #6A9BD9;">
          <p>You don't have any projects yet.</p>
        </div>
      </CCardBody>
    </CCard>

    <!-- Modal -->
    <CModal v-model:visible="isModalVisible" size="lg">
      <CModalHeader>
        <CModalTitle>Project Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div v-if="selectedProject">
          <p><strong>Name:</strong> {{ selectedProject.name }}</p>
          <p><strong>Date:</strong> {{ formatDate(selectedProject.date) }}</p>
          <p><strong>Budget:</strong> {{ selectedProject.budget }} TND</p>
          <p><strong>Status:</strong> {{ selectedProject.status }}</p>
          <p><strong>Freelancer:</strong> {{ selectedProject.freelancer?.name || 'N/A' }}</p>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Close</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import {
  CCard, CCardBody, CButton, CRow, CCol,
  CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter
} from '@coreui/vue'
import { ref } from 'vue'

// Sample project data
const projects = ref([
  {
    id: 1,
    name: 'E-commerce Website',
    date: '2025-04-15',
    budget: 2000,
    status: 'In Progress',
    freelancer: { name: 'John Doe' },
  },
  {
    id: 2,
    name: 'Mobile App Development',
    date: '2025-03-10',
    budget: 3000,
    status: 'Finished',
    freelancer: { name: 'Lisa Smith' },
  },
  {
    id: 3,
    name: 'SEO Optimization',
    date: '2025-01-20',
    budget: 1500,
    status: 'Pending',
    freelancer: null,
  },
])

// Modal logic
const isModalVisible = ref(false)
const selectedProject = ref(null)

const viewProjectDetails = (project) => {
  selectedProject.value = project
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
}

// Helpers
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US')
}

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#6A9BD9'
    case 'In Progress': return '#A9C9F2'
    case 'Finished': return '#1F4788'
    default: return '#4A8ED8'
  }
}
</script>
