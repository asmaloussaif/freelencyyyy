<template>
  <CContainer class="py-4">
    <!-- Header Section -->
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2 class="fw-bold m-0" style="color: #0f2573">My Projects</h2>
      <CBadge color="primary" shape="rounded-pill" style="background-color: #0f2573">
        {{ ongoingProjects.length }} Ongoing Projects
      </CBadge>
    </div>

    <!-- Ongoing Projects -->
    <CCard class="mb-4 border-0" style="box-shadow: 0 4px 20px rgba(15, 37, 115, 0.1)">
      <CCardBody class="p-4" style="background-color: #f8faff; border-radius: 12px">
        <h5 class="mb-3 fw-semibold" style="color: #0f2573">Ongoing Projects</h5>
        <CRow class="gy-3">
          <CCol v-for="project in ongoingProjects" :key="project.id" :md="4">
            <CCard class="h-100 border-0" style="box-shadow: 0 4px 12px rgba(15, 37, 115, 0.08)">
              <CCardBody class="p-4">
                <div class="mb-3">
                  <strong>{{ project.title }}</strong>
                  <p>{{ project.description }}</p>
                  <CBadge style="background-color: #ffb400; color: #fff; border-radius: 8px">
                    In Progress
                  </CBadge>
                </div>
                <div class="d-flex justify-content-between">
                  <span><strong>Client:</strong> {{ project.client }} {{ project.clientDetail.lastName }}</span>
                  <span><strong>Deadline:</strong> {{ project.deadline }}</span>
                </div>
                <CButton
                  class="w-100 mt-2 mb-2"
                  style="background-color: #0f2573; border-radius: 8px; color: white"
                  @click="viewProjectDetails(project.id)"
                >
                  View Details
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Completed Projects -->
    <CCard class="border-0" style="box-shadow: 0 4px 20px rgba(15, 37, 115, 0.1)">
      <CCardBody class="p-4" style="background-color: #f8faff; border-radius: 12px">
        <h5 class="mb-3 fw-semibold" style="color: #0f2573">Completed Projects</h5>
        <CRow class="gy-3">
          <CCol v-for="project in completedProjects" :key="project.id" :md="4">
            <CCard class="h-100 border-0" style="box-shadow: 0 4px 12px rgba(15, 37, 115, 0.08)">
              <CCardBody class="p-4">
                <div class="mb-3">
                  <strong>{{ project.title }}</strong>
                  <p>{{ project.description }}</p>
                  <CBadge style="background-color: #28a745; color: #fff; border-radius: 8px">
                    Completed
                  </CBadge>
                </div>
                <div class="d-flex justify-content-between">
                  <span><strong>Client:</strong> {{ project.client }} {{ project.clientDetail.lastName }}</span>
                  <span
                    ><strong>Completion Date:</strong> {{ formatDate(project.updated_at) }}</span
                  >
                </div>
                <CButton
                  class="w-100 mt-2 mb-2"
                  style="background-color: #0f2573; border-radius: 8px; color: white"
                  @click="viewProjectDetails(project.id)"
                >
                  View Details
                </CButton>
                <CButton color="success" class="w-100" @click="openRatingModal(project)">
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
              style="cursor: pointer; color: gold"
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
    <CModal
      alignment="center"
      backdrop="static"
      :visible="projectDetailsModalVisible"
      @close="projectDetailsModalVisible = false"
    >
      <CModalHeader>
        <strong>Project Details - {{ selectedProjectDetails?.title }}</strong>
      </CModalHeader>
      <CModalBody>
        <p><strong>Description:</strong> {{ selectedProjectDetails?.description }}</p>
        <p><strong>Category:</strong> {{ selectedProjectDetails?.projectDetail.categorie }}</p>
        <p><strong>Budget:</strong> {{ selectedProjectDetails?.projectDetail.budget }} $</p>
        <p><strong>Status:</strong> {{ selectedProjectDetails?.status }}</p>
        <p><strong>Deadline:</strong> {{ selectedProjectDetails?.deadline }}</p>

        <hr />
        <h6 class="mb-2"><strong>Client Information</strong></h6>
        <p>
          <strong>Name:</strong> {{ selectedProjectDetails?.clientDetail?.name }}
          {{ selectedProjectDetails?.clientDetail?.lastName }}
        </p>
        <p><strong>Email:</strong> {{ selectedProjectDetails?.clientDetail?.email }}</p>
       
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="projectDetailsModalVisible = false">Close</CButton>
      </CModalFooter>
    </CModal>
  </CContainer>
</template>

<script setup>
import {
  CContainer,
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
  CBadge,
  CModal,
  CModalHeader,
  CModalBody,
  CModalFooter,
} from '@coreui/vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const projects = ref([])
const authStore = useAuthStore()
const ongoingProjects = computed(() =>
  projects.value.filter((project) => project.status === 'in-progress'),
)

const completedProjects = computed(() =>
  projects.value.filter((project) => project.status === 'completed'),
)
const projectDetailsModalVisible = ref(false)
const selectedProjectDetails = ref(null)

const viewProjectDetails = (projectId) => {
  const project = [...ongoingProjects.value, ...completedProjects.value].find(
    (p) => p.id === projectId,
  )
  selectedProjectDetails.value = project
  console.log( selectedProjectDetails.value);
  
  projectDetailsModalVisible.value = true
}
const fetchAppliedProjects = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/my-applications', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    const projectIds = res.data.map((app) => app.project_id)
    authStore.setAppliedProjects(projectIds)
    projects.value = res.data.map((app) => ({
      id: app.id,
      title: app.project.titre,
      description: app.project.description,
      client: app.project.client?.name || 'Unknown Client',
      deadline: app.project.date_limite,
      status: app.statut,
      updated_at: app.updated_at,
      clientDetail:app.project.client,
      projectDetail:app.project   }))
  } catch (error) {
    console.error('Failed to load applied projects:', error)
  }
}
function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
onMounted(() => {
  fetchAppliedProjects()
})

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
