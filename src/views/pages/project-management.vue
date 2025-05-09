<template>
  <div class="container my-4">
    <CCard class="shadow rounded-4" style="border-color: #ade1fb">
      <CCardHeader
        class="rounded-top-4 py-3 px-4"
        style="background: linear-gradient(to right, #266ca9, #0f2573); color: white"
      >
        <h4 class="mb-0">Project Management</h4>
      </CCardHeader>
      <CCardBody class="p-4">
        <CRow class="mb-4 g-3">
          <CCol :md="4">
            <CFormInput
              v-model="search"
              placeholder="Search by project name..."
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #ade1fb; background-color: #f0f8ff"
            />
          </CCol>
          <CCol :md="4">
            <CFormSelect
              v-model="statusFilter"
              class="shadow-sm rounded-pill border-0 px-4 py-2"
              style="border-color: #ade1fb; background-color: #f0f8ff; color: #041d56"
            >
              <option value="">All Status</option>
              <option value="pending">open</option>
              <option value="in_progress">in_progress</option>
              <option value="finished">completed</option>
            </CFormSelect>
          </CCol>

          <CCol :md="4">
            <CButton
              color="success"
              class="shadow-sm rounded-pill px-4"
              @click="openAddModal"
              style="background-color: #28a745; border-color: #28a745"
            >
              + Add Project
            </CButton>
          </CCol>
        </CRow>

        <div v-if="filteredProjects.length">
          <CTable hover responsive class="rounded-3 overflow-hidden shadow-sm">
            <CTableHead style="background-color: #e1f0ff">
              <CTableRow>
                <CTableHeaderCell style="color: #041d56">Project Name</CTableHeaderCell>
                <CTableHeaderCell style="color: #041d56">Date</CTableHeaderCell>
                <CTableHeaderCell style="color: #041d56">Budget</CTableHeaderCell>
                <CTableHeaderCell style="color: #041d56">Status</CTableHeaderCell>
                <CTableHeaderCell style="color: #041d56">Freelancer</CTableHeaderCell>
                <CTableHeaderCell style="color: #041d56">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow
                v-for="project in filteredProjects"
                :key="project.id"
                style="background-color: white"
              >
                <CTableDataCell style="color: #266ca9">{{ project.titre }}</CTableDataCell>
                <CTableDataCell style="color: #266ca9">{{
                  formatDate(project.date)
                }}</CTableDataCell>
                <CTableDataCell style="color: #266ca9">TND {{ project.budget }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge :style="statusStyle(project.status)" class="text-capitalize px-3 py-1">
                    {{ project.status.replace('_', ' ') }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <span v-if="project.status !== 'pending'" style="color: #266ca9">{{
                    project.freelancer
                  }}</span>
                  <span v-else style="color: #7d9fc7">-</span>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton
                    color="primary"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    style="background-color: #266ca9; border-color: #266ca9"
                    @click="openViewModal(project)"
                  >
                    View
                  </CButton>

                  <CButton
                    color="dark"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="editProject(project.id)"
                    style="background-color: #041d56; border-color: #041d56"
                  >
                    Edit
                  </CButton>
                  <CButton
                    color="danger"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="openDeleteModal(project.id)"
                  >
                    Delete
                  </CButton>
                  <CButton
                    v-if="project.status === 'finished'"
                    color="secondary"
                    size="sm"
                    class="shadow-sm rounded-pill px-3"
                    @click="openRatingModal(project)"
                    style="background-color: #0f2573; border-color: #0f2573"
                  >
                    {{ project.rating ? project.rating + ' ★' : 'Rate' }}
                  </CButton>
                  <CButton
                    v-if="transactionMap[project.id] === false"
                    color="primary"
                    size="sm"
                    class="me-2 shadow-sm rounded-pill px-3"
                    @click="opentransactionModal(project)"
                  >
                    Add Transaction
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </div>
        <div v-else class="text-center py-5" style="color: #266ca9; font-size: 1.25rem">
          No projects found.
        </div>
      </CCardBody>
    </CCard>

    <!-- Rating Modal -->
    <CModal alignment="center" :visible="ratingModalVisible" @close="ratingModalVisible = false">
      <CModalHeader style="background-color: #e1f0ff; border-color: #ade1fb">
        <CModalTitle style="color: #041d56">Rate Freelancer</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="text-center">
          <p class="mb-3" style="color: #041d56">
            How would you rate {{ selectedProject?.freelancer }}?
          </p>
          <div class="d-flex justify-content-center gap-2">
            <CButton
              v-for="star in 5"
              :key="star"
              :style="
                star <= tempRating
                  ? { backgroundColor: '#266CA9', borderColor: '#266CA9' }
                  : { backgroundColor: '#E1F0FF', borderColor: '#ADE1FB', color: '#041D56' }
              "
              shape="rounded-pill"
              size="lg"
              @click="tempRating = star"
            >
              ★
            </CButton>
          </div>
        </div>
      </CModalBody>
      <CModalFooter style="background-color: #f0f8ff; border-color: #ade1fb">
        <CButton
          color="outline-dark"
          @click="ratingModalVisible = false"
          style="border-color: #266ca9; color: #266ca9"
        >
          Close
        </CButton>
        <CButton
          color="primary"
          @click="submitRating"
          style="background-color: #0f2573; border-color: #0f2573"
        >
          Submit
        </CButton>
      </CModalFooter>
    </CModal>
    <CModal alignment="center" :visible="addModalVisible" @close="addModalVisible = false">
      <CModalHeader style="background-color: #e1f0ff">
        <CModalTitle style="color: #041d56">Add New Project</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput v-model="newProject.titre" label="Title" class="mb-3" />
          <CFormTextarea v-model="newProject.description" label="Description" class="mb-3" />
          <CFormSelect v-model="newProject.categorie" label="Category" class="mb-3">
            <option value="">Select category</option>
            <option value="web">Web</option>
            <option value="mobile">Mobile</option>
            <option value="design">Design</option>
            <!-- Ajoute d'autres options si nécessaire -->
          </CFormSelect>
          <CFormInput v-model="newProject.budget" label="Budget" type="number" class="mb-3" />
          <CFormInput v-model="newProject.date_limite" label="Deadline" type="date" class="mb-3" />
        </CForm>
      </CModalBody>
      <CModalFooter style="background-color: #f0f8ff">
        <CButton color="secondary" @click="addModalVisible = false">Cancel</CButton>
        <CButton color="primary" @click="submitNewProject">Save</CButton>
      </CModalFooter>
    </CModal>

    <CModal alignment="center" :visible="viewModalVisible" @close="viewModalVisible = false">
      <CModalHeader>
        <CModalTitle>Project Details</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p><strong>Name:</strong> {{ selectedProject?.titre }}</p>
        <p><strong>Budget:</strong> TND {{ selectedProject?.budget }}</p>
        <p><strong>Date:</strong> {{ selectedProject?.date }}</p>
        <p><strong>Status:</strong> {{ selectedProject?.status }}</p>
        <p><strong>Category:</strong> {{ selectedProject?.categorie }}</p>
        <p><strong>Description:</strong> {{ selectedProject?.description }}</p>
        <p><strong>Deadline:</strong> {{ selectedProject?.date_limite }}</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="viewModalVisible = false">Close</CButton>
      </CModalFooter>
    </CModal>
    <CModal :visible="projectModalVisible" @close="projectModalVisible = false">
      <CModalHeader>
        <CModalTitle>{{ isEditing ? 'Edit Project' : 'Add Project' }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormInput
          class="mb-3"
          label="Title"
          v-model="newProject.titre"
          placeholder="Enter title"
        />
        <CFormInput
          class="mb-3"
          label="Description"
          v-model="newProject.description"
          placeholder="Enter description"
        />
        <CFormInput
          class="mb-3"
          label="Category"
          v-model="newProject.categorie"
          placeholder="Enter category"
        />
        <CFormInput
          class="mb-3"
          type="number"
          label="Budget"
          v-model="newProject.budget"
          placeholder="Enter budget"
        />
        <CFormInput class="mb-3" type="date" label="Deadline" v-model="newProject.date_limite" />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="projectModalVisible = false">Cancel</CButton>
        <CButton color="primary" @click="submitEditProject">
          {{ isEditing ? 'Save Changes' : 'Add Project' }}
        </CButton>
      </CModalFooter>
    </CModal>
    <CModal :visible="confirmDeleteModalVisible" @close="confirmDeleteModalVisible = false">
      <CModalHeader>
        <CModalTitle>Confirm Deletion</CModalTitle>
      </CModalHeader>
      <CModalBody>
        Are you sure you want to delete this project? This action cannot be undone.
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="confirmDeleteModalVisible = false">Cancel</CButton>
        <CButton color="danger" @click="confirmDelete">Delete</CButton>
      </CModalFooter>
    </CModal>
    <CModal :visible="transactionModalVisible" @close="transactionModalVisible = false">
      <CModalHeader>
        <CModalTitle>Add Transaction</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-3">
          <label class="form-label">Freelancer</label>
          <input type="text" class="form-control" v-model="selectedFreelancerName" disabled />
        </div>
        <div class="mb-3">
          <label class="form-label">Budget</label>
          <input type="number" class="form-control" v-model="transactionAmount" min="1" />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="transactionModalVisible = false">Cancel</CButton>
        <CButton color="primary" @click="saveTransaction">Save</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
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
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/vue'
import { ref, computed, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { reactive } from 'vue'
const search = ref('')
const statusFilter = ref('')
const ratingModalVisible = ref(false)
const tempRating = ref(0)
const selectedProject = ref(null)
const authStore = useAuthStore()
const projects = ref([])
const confirmDeleteModalVisible = ref(false)
const projectToDelete = ref(null)
const transactionModalVisible = ref(false)
const selectedFreelancerId = ref(null)
const selectedFreelancerName = ref('')
const transactionAmount = ref('')
const statusStyle = (status) => {
  switch (status) {
    case 'open':
      return {
        backgroundColor: '#E1F0FF',
        color: '#266CA9',
        border: '1px solid #ADE1FB',
      }
    case 'in_progress':
      return {
        backgroundColor: '#FFF3CD',
        color: '#856404',
        border: '1px solid #FFC107',
      }
    case 'completed':
      return {
        backgroundColor: '#D4EDDA',
        color: '#155724',
        border: '1px solid #28A745',
      }
    default:
      return {
        backgroundColor: '#F0F8FF',
        color: '#266CA9',
        border: '1px solid #ADE1FB',
      }
  }
}
const transactionMap = ref({})
const checkTransactionForProject = async (projectId) => {
  try {
    const res = await axios.get(`http://127.0.0.1:8000/api/payments/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })

    transactionMap.value[projectId] = !!res.data
  } catch (err) {
    transactionMap.value[projectId] = false
  }
}
const fetchProjects = async () => {
  try {
    const response = await axios.get('http://localhost:8000/api/myProjects', {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    console.log(response.data)

    projects.value = response.data.map((project) => ({
      id: project.id,
      titre: project.titre,
      date: project.created_at.split('T')[0],
      budget: project.budget,
      status: project.statut,
      freelancer: project.selected_application.freelancer
        ? `${project.selected_application.freelancer.name} ${project.selected_application.freelancer.lastName}`
        : '',
      freelancerID: project.selected_application.freelancer
        ? project.selected_application.freelancer.id
        : null,
      rating: project.note ?? null,
      categorie: project.categorie || '',
      description: project.description,
      date_limite: project.date_limite || '',
    }))
  } catch (error) {
    console.error('Failed to fetch client projects:', error)
  }
}

const filteredProjects = computed(() => {
  return projects.value.filter((p) => {
    const matchesSearch = p.titre.toLowerCase().includes(search.value.toLowerCase())
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

onMounted(async () => {
  await fetchProjects()

  for (const project of projects.value) {
    await checkTransactionForProject(project.id)
  }
})
const addModalVisible = ref(false)

const openAddModal = () => {
  addModalVisible.value = true
}
const newProject = ref({
  id: null,
  titre: '',
  description: '',
  categorie: '',
  budget: null,
  date_limite: '',
})

const isEditing = ref(false)
const projectModalVisible = ref(false)

const submitNewProject = async () => {
  try {
    const response = await axios.post('http://localhost:8000/api/projects', newProject.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    projects.value.push(response.data.project)
    resetProjectForm()
  } catch (error) {
    console.error('Error adding project:', error)
  }
}
const submitEditProject = async () => {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/projects/${newProject.value.id}`,
      newProject.value,
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
        },
      },
    )
    const index = projects.value.findIndex((p) => p.id === newProject.value.id)
    if (index !== -1) projects.value[index] = response.data.project
    resetProjectForm()
  } catch (error) {
    console.error('Error editing project:', error)
  }
}
const viewModalVisible = ref(false)
const resetProjectForm = () => {
  projectModalVisible.value = false
  isEditing.value = false
  fetchProjects()
  Object.assign(newProject.value, {
    id: null,
    titre: '',
    description: '',
    categorie: '',
    budget: null,
    date_limite: '',
  })
}
const openViewModal = (project) => {
  selectedProject.value = project
  viewModalVisible.value = true
}
const editProject = (projectId) => {
  const project = projects.value.find((p) => p.id === projectId)
  console.log(project)

  if (project) {
    Object.assign(newProject.value, { ...project })
    isEditing.value = true
    projectModalVisible.value = true
  }
}
const openDeleteModal = (projectId) => {
  projectToDelete.value = projectId
  confirmDeleteModalVisible.value = true
}
const confirmDelete = async () => {
  try {
    await axios.delete(`http://localhost:8000/api/projects/${projectToDelete.value}`, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
      },
    })
    projects.value = projects.value.filter((p) => p.id !== projectToDelete.value)
    confirmDeleteModalVisible.value = false
    fetchProjects()
  } catch (error) {
    console.error('Failed to delete project:', error)
  }
}
const projectId = ref(null)
const opentransactionModal = (project) => {
  projectId.value = project.id
  selectedFreelancerId.value = project.freelancerID
  selectedFreelancerName.value = `${project.freelancer} `
  transactionAmount.value = project.budget
  transactionModalVisible.value = true
}

const saveTransaction = async () => {
  if (!selectedFreelancerId.value || !transactionAmount.value) return

  try {
    const response = await axios.post(
      'http://127.0.0.1:8000/api/payments',
      {
        freelancer_id: selectedFreelancerId.value,
        montant: transactionAmount.value,
        project_id: projectId.value,
      },
      {
        headers: {
          Authorization: `Bearer ${authStore.token}`,
          'Content-Type': 'application/json',
        },
      },
    )
    showSuccessToast('Transaction added successfully!')
    transactionModalVisible.value = false
  } catch (error) {
    console.error(error)
    showSuccessToast('Error adding transaction', true)
  }
}
const showSuccessToast = (message, isError = false) => {
  const toast = document.createElement('div')
  toast.innerHTML = `
    <div class="toast align-items-center text-white ${
      isError ? 'bg-danger' : 'bg-success'
    } border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">
          ${message}
        </div>
      </div>
    </div>
  `
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}
</script>

<style scoped>
.container {
  max-width: 1100px;
}

/* Table hover effect */
.table-hover tbody tr:hover {
  background-color: #f0f8ff !important;
}

/* Form placeholders */
::placeholder {
  color: #7d9fc7 !important;
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

.badge[style*='pending']::before {
  background-color: #266ca9;
}

.badge[style*='in_progress']::before {
  background-color: #856404;
}

.badge[style*='finished']::before {
  background-color: #155724;
}

/* Focus states */
button:focus,
input:focus,
select:focus {
  box-shadow: 0 0 0 0.2rem rgba(38, 108, 169, 0.25) !important;
  border-color: #266ca9 !important;
}
</style>
