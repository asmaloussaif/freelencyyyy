<template>
  <CRow>
    <CCol>
      <CCard class="offer-card">
        <CCardHeader class="offer-header">
          <h4 class="text-white">Available Projects for Freelancers</h4>
        </CCardHeader>

        <CCardBody>
          <!-- ✅ FILTER BAR -->
          <div class="d-flex gap-3 mb-3 flex-wrap">
            <div>
              <label class="form-label"> Budget (TD)</label>
              <input
                type="number"
                class="form-control"
                v-model="filters.maxBudget"
                placeholder="Enter max budget"
              />
            </div>

            <div>
              <label class="form-label">Deadline Before</label>
              <input
                type="date"
                class="form-control"
                v-model="filters.deadline"
              />
            </div>

            <div>
              <label class="form-label">Category</label>
              <select v-model="filters.category" class="form-select">
                <option value="">All</option>
                <option v-for="cat in categories" :key="cat" :value="cat">
                  {{ cat }}
                </option>
              </select>
            </div>

            <div>
              <label class="form-label d-block">Sort by Deadline</label>
              <CButton
                size="sm"
                color="info"
                @click="sortAsc = !sortAsc"
              >
                {{ sortAsc ? 'Oldest First' : 'Newest First' }}
              </CButton>
            </div>
          </div>

          <CAlert v-if="showAlert" color="success" dismissible class="mt-3">
            Successfully applied to the project!
          </CAlert>

          <CTable striped hover responsive class="offer-table">
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Title</CTableHeaderCell>
                <CTableHeaderCell scope="col">Category</CTableHeaderCell>
                <CTableHeaderCell scope="col">Budget</CTableHeaderCell>
                <CTableHeaderCell scope="col">Deadline</CTableHeaderCell>
                <CTableHeaderCell scope="col">Action</CTableHeaderCell>
              </CTableRow>
            </CTableHead>

            <CTableBody>
              <CTableRow v-for="(offer, index) in filteredOffers" :key="offer.id">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>
                  <CIcon icon="cil-lightbulb" class="me-2 text-info" />
                  {{ offer.titre }}
                </CTableDataCell>
                <CTableDataCell>
                  <span class="badge bg-info">
                    {{ offer.categorie ?? 'Non spécifiée' }}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{{ offer.budget }} TND</CTableDataCell>
                <CTableDataCell>{{ formatDate(offer.date_limite) }}</CTableDataCell>
                <CTableDataCell>
                  <template v-if="appliedProjectIds.includes(offer.id)">
                    <CBadge color="success">Already Applied</CBadge>
                  </template>
                  <template v-else>
                    <CButton
                      color="primary"
                      variant="outline"
                      size="sm"
                      @click="applyToOffer(offer.id)"
                    >
                      <CIcon icon="cil-paper-plane" class="me-2" /> Apply
                    </CButton>
                  </template>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>

  <CModal :visible="showModal" @close="closeModal">
    <CModalHeader><CModalTitle>Motivation</CModalTitle></CModalHeader>
    <CModalBody>
      <CForm>
        <CFormTextarea
          v-model="motivation"
          label="Enter your motivation"
          rows="4"
          placeholder="Why are you applying for this project?"
        />
      </CForm>
    </CModalBody>
    <CModalFooter>
      <CButton color="secondary" @click="closeModal">Close</CButton>
      <CButton color="primary" @click="submitApplication">Send</CButton>
    </CModalFooter>
  </CModal>
</template>

<script setup>
import {
  CRow, CCol, CCard, CCardHeader, CCardBody,
  CAlert, CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CButton, CModal, CModalHeader,
  CModalTitle, CModalBody, CModalFooter, CForm, CFormTextarea,
  CBadge
} from '@coreui/vue'
import CIcon from '@coreui/icons-vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted, computed } from 'vue'

const authStore = useAuthStore()
const showModal = ref(false)
const selectedProjectId = ref(null)
const motivation = ref('')
const showAlert = ref(false)
const offers = ref([])
const filters = ref({ maxBudget: '', deadline: '', category: '' })
const sortAsc = ref(true)
const categories = ref([])

const appliedProjectIds = computed(() => authStore.appliedProjects)

const fetchProject = async () => {
  const token = authStore.token
  try {
    const res = await axios.get('http://localhost:8000/api/projects', {
      headers: { Authorization: `Bearer ${token}` },
    })

    const openProjects = res.data.filter(project => project.statut === 'open')

    offers.value = openProjects.map(project => ({
      id: project.id || '',
      titre: project.titre || '',
      categorie: project.categorie || '',
      budget: project.budget || '',
      date_limite: project.date_limite || '',
    }))

    categories.value = [...new Set(openProjects.map(p => p.categorie).filter(Boolean))]
  } catch (error) {
    console.error('Error fetching projects:', error)
  }
}

const filteredOffers = computed(() => {
  let result = offers.value.filter(offer => {
    const matchesBudget = !filters.value.maxBudget || parseFloat(offer.budget) <= parseFloat(filters.value.maxBudget)
    const matchesDeadline = !filters.value.deadline || new Date(offer.date_limite) <= new Date(filters.value.deadline)
    const matchesCategory = !filters.value.category || offer.categorie === filters.value.category
    return matchesBudget && matchesDeadline && matchesCategory
  })

  result.sort((a, b) => {
    const dateA = new Date(a.date_limite)
    const dateB = new Date(b.date_limite)
    return sortAsc.value ? dateA - dateB : dateB - dateA
  })

  return result
})

const applyToOffer = (projectId) => {
  selectedProjectId.value = projectId
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
  motivation.value = ''
  selectedProjectId.value = null
}

const submitApplication = async () => {
  const token = authStore.token
  try {
    await axios.post('http://localhost:8000/api/applications', {
      project_id: selectedProjectId.value,
      motivation: motivation.value,
    }, {
      headers: { Authorization: `Bearer ${token}` },
    })

    authStore.addAppliedProject(selectedProjectId.value)
    closeModal()
    showAlert.value = true
    setTimeout(() => (showAlert.value = false), 3000)
  } catch (error) {
    console.error('Failed to apply:', error)
    alert('Error submitting application.')
  }
}

const fetchAppliedProjects = async () => {
  try {
    const res = await axios.get('http://localhost:8000/api/my-applications', {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    const projectIds = res.data.map(app => app.project_id)
    authStore.setAppliedProjects(projectIds)
  } catch (error) {
    console.error('Failed to load applied projects:', error)
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

onMounted(() => {
  fetchProject()
  fetchAppliedProjects()
})
</script>

<style scoped>
.offer-card {
  background-color: #f4f7fc;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(1, 8, 45, 0.1);
}

.offer-header {
  background-color: #0f2573;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  color: white;
  padding: 15px;
}

.offer-table {
  background-color: white;
  color: #2225d8;
  border-collapse: collapse;
  width: 100%;
}

.offer-table th,
.offer-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #be95c4;
}

.offer-table tr:hover {
  background-color: #e1f0fe;
  transition: background-color 0.3s ease;
}

.badge {
  font-size: 0.9rem;
  background-color: #0f2573;
  color: white;
}

.offer-table tr:hover .badge {
  background-color: #3812f7;
}
</style>
