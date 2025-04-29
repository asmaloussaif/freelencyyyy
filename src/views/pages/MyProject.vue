<template>
  <CContainer class="py-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold m-0" style="color: #0F2573;">My Projects</h2>
      <CBadge color="primary" shape="rounded-pill" style="background-color: #0F2573;">
        {{ ongoingProjects.length }} Ongoing Projects
      </CBadge>
    </div>

    <!-- Ongoing Projects -->
    <CCard class="mb-4 border-0" style="box-shadow: 0 4px 20px rgba(15, 37, 115, 0.1);">
      <CCardBody class="p-4" style="background-color: #F8FAFF; border-radius: 12px;">
        <h5 class="mb-3 fw-semibold" style="color: #0F2573;">Ongoing Projects</h5>
        <CRow class="gy-3">
          <CCol v-for="project in ongoingProjects" :key="project.id" :md="4">
            <CCard class="h-100 border-0" style="box-shadow: 0 4px 12px rgba(15, 37, 115, 0.08);">
              <CCardBody class="p-4">
                <div class="mb-3">
                  <strong>{{ project.title }}</strong>
                  <p>{{ project.description }}</p>
                  <CBadge style="background-color: #FFB400; color: #fff; border-radius: 8px;">
                    In Progress
                  </CBadge>
                </div>
                <div class="d-flex justify-content-between">
                  <span><strong>Client:</strong> {{ project.client }}</span>
                  <span><strong>Deadline:</strong> {{ project.deadline }}</span>
                </div>
                <CButton class="w-100 mt-3"
                  style="background-color: #0F2573; border-radius: 8px; color: white;"
                  @click="viewProjectDetails(project.id)">
                  View Details
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Completed Projects -->
    <CCard class="border-0" style="box-shadow: 0 4px 20px rgba(15, 37, 115, 0.1);">
      <CCardBody class="p-4" style="background-color: #F8FAFF; border-radius: 12px;">
        <h5 class="mb-3 fw-semibold" style="color: #0F2573;">Completed Projects</h5>
        <CRow class="gy-3">
          <CCol v-for="project in completedProjects" :key="project.id" :md="4">
            <CCard class="h-100 border-0" style="box-shadow: 0 4px 12px rgba(15, 37, 115, 0.08);">
              <CCardBody class="p-4">
                <div class="mb-3">
                  <strong>{{ project.title }}</strong>
                  <p>{{ project.description }}</p>
                  <CBadge style="background-color: #28A745; color: #fff; border-radius: 8px;">
                    Completed
                  </CBadge>
                </div>
                <div class="d-flex justify-content-between">
                  <span><strong>Client:</strong> {{ project.client }}</span>
                  <span><strong>Completion Date:</strong> {{ project.completionDate }}</span>
                </div>
                <CButton class="w-100 mt-2 mb-2"
                  style="background-color: #0F2573; border-radius: 8px; color: white;"
                  @click="viewProjectDetails(project.id)">
                  View Details
                </CButton>
                <CButton color="success" class="w-100"
                  @click="openRatingModal(project)">
                  Rate Client
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- MODAL DE NOTATION CLIENT -->
    <CModal
      alignment="center"
      backdrop="static"
      :visible="ratingModalVisible"
      @close="ratingModalVisible = false"
    >
      <CModalHeader>
        <strong>Rate Client - {{ selectedProject?.client }}</strong>
      </CModalHeader>
      <CModalBody>
        <div class="text-center mb-3">
          <p class="mb-2">How was your experience with this client?</p>
          <div>
            <span
              v-for="i in 5"
              :key="i"
              class="fs-4"
              @click="rating = i"
              style="cursor: pointer; color: gold;"
            >
              <i :class="i <= rating ? 'fas fa-star' : 'far fa-star'"></i>
            </span>
          </div>
        </div>
        <div class="mb-3">
          <label class="form-label">Comment</label>
          <textarea
            class="form-control"
            rows="3"
            v-model="comment"
            placeholder="Write your feedback..."
          ></textarea>
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="ratingModalVisible = false">Cancel</CButton>
        <CButton color="primary" @click="submitRating">Submit</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import {
  CContainer, CCard, CCardBody, CButton, CRow, CCol, CBadge,
  CModal, CModalHeader, CModalBody, CModalFooter
} from '@coreui/vue'
import { ref, computed } from 'vue'

const projects = ref([
  { id: 1, title: 'Web Design for E-Commerce', description: 'Building a responsive website.', client: 'Client A', deadline: '2025-05-15', status: 'in-progress', completionDate: '' },
  { id: 2, title: 'Mobile App Development', description: 'Developing a fitness app.', client: 'Client B', deadline: '2025-06-01', status: 'completed', completionDate: '2025-04-20' },
  { id: 3, title: 'Logo Design', description: 'Creating a brand identity.', client: 'Client C', deadline: '2025-05-10', status: 'in-progress', completionDate: '' },
])

const ongoingProjects = computed(() => {
  return projects.value.filter(project => project.status === 'in-progress')
})

const completedProjects = computed(() => {
  return projects.value.filter(project => project.status === 'completed')
})

const viewProjectDetails = (id) => {
  console.log('Viewing project', id)
}

// Rating Modal Logic
const ratingModalVisible = ref(false)
const selectedProject = ref(null)
const rating = ref(0)
const comment = ref('')

const openRatingModal = (project) => {
  selectedProject.value = project
  rating.value = 0
  comment.value = ''
  ratingModalVisible.value = true
}

const submitRating = () => {
  console.log('Submitted rating:', {
    projectId: selectedProject.value.id,
    client: selectedProject.value.client,
    rating: rating.value,
    comment: comment.value,
  })
  ratingModalVisible.value = false
}
</script>

<style scoped>
.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 25px rgba(15, 37, 115, 0.15) !important;
}
.card {
  transition: all 0.3s ease;
}
.badge {
  padding: 6px 12px;
  font-weight: 500;
  letter-spacing: 0.3px;
}
</style>
