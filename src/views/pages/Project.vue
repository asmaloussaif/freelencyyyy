<template>
  <div class="container">
   
    <CCard class="mb-4">
      <CCardBody>
     
        <CInputGroup class="mb-3">
          <CInputGroupText>
            <CIcon :icon="cilSearch" size="sm" />
          </CInputGroupText>
          <CFormInput
          v-model="searchQuery"
          placeholder="Search for projects..."
          aria-label="Search"
        />
        </CInputGroup>

        
        <div v-for="(offer, index) in filteredOffers" :key="index" class="mb-4">
          <CCard class="p-3">
            <div class="d-flex justify-content-between">
             
              <div>
                <h4 class="mb-1">Title: {{ offer.title }}</h4>
                <p>{{ offer.description }}</p>
              </div>
             
              <div class="text-end">
                <span :class="offer.state === 'Open' ? 'badge bg-success' : 'badge bg-danger'">
                  {{ offer.state }}
                </span>
              </div>
            </div>

        
            <CButton color="primary" @click="openModal(offer)">
              Apply
            </CButton>
          </CCard>
        </div>
      </CCardBody>
    </CCard>

    <!-- Modal for Motivation Input -->
    <CModal :backdrop="false" :keyboard="false" :visible="modalVisible">
      <CModalHeader>
        <CModalTitle>Apply for Project: {{ selectedOffer?.title }}</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CFormTextarea
          v-model="motivationText"
          placeholder="Write your motivation here..."
          rows="5"
        />
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Cancel</CButton>
        <CButton color="primary" @click="submitApplication">Submit</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import {
  CCard,
  CCardBody,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CFormTextarea,
} from '@coreui/vue'

import { CIcon } from '@coreui/icons-vue'
import { cilSearch } from '@coreui/icons'
import { useAuthStore } from '@/stores/authStore'
import { defineComponent, computed, h, resolveComponent } from 'vue'
// Reactive variables
const offers = ref([])
const modalVisible = ref(false)
const motivationText = ref('')
const selectedOffer = ref(null)
const authStore = useAuthStore()
const searchQuery = ref('')
const filteredOffers = computed(() => {
  return offers.value.filter(offer =>
    offer.title.toLowerCase().includes(searchQuery.value.toLowerCase())
  )
})
const fetchProjects = async () => {
  try {
    const token = authStore.token 
    const response = await axios.get('http://127.0.0.1:8000/api/projects', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    offers.value = response.data.map(project => ({
      title: project.titre,
      description: project.description,
      state: project.statut === 'Open' ? 'Open' : 'Closed',
      id: project.id,
      client_id: project.client_id,
    }))
  } catch (error) {
    console.error('Failed to fetch projects:', error)
  }
}
const submitApplication = async () => {
  const token = authStore.token 
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/applications', {
      project_id: selectedOffer.value.id,
      motivation: motivationText.value,
      // freelancer_id will be handled automatically in the backend using Auth::id()
    }, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    console.log('Application submitted:', response.data)
    closeModal()
  } catch (error) {
    console.error('Failed to submit application:', error)
  }
}

onMounted(() => {
  fetchProjects()
})

const openModal = (offer) => {
  selectedOffer.value = offer
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
}


</script>


<style scoped>

.container {
  font-family: 'Poppins', sans-serif;
  max-width: 1200px;
  margin: 0 auto;
  padding: 24px;
  color: #333;
}

/* Headings */
.container h4 {
  font-size: 22px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  letter-spacing: 0.5px;
}

/* Paragraphs */
.container p {
  font-size: 15px;
  line-height: 1.6;
  color: #555;
  margin-bottom: 10px;
}

/* Badges */
.badge {
  font-size: 13px;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 500;
  text-transform: capitalize;
}

.badge.bg-success {
  background-color: #28a745;
  color: white;
}

.badge.bg-danger {
  background-color: #dc3545;
  color: white;
}

/* Inputs */
input[type='text'] {
  font-family: 'Poppins', sans-serif;
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  width: 100%;
}

input[type='text']:focus {
  outline: none;
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
}

/* Buttons */
button {
  font-family: 'Poppins', sans-serif;
  border-radius: 6px;
  padding: 10px 16px;
  background-color: #0d6efd;
  color: white;
  font-weight: 500;
  font-size: 14px;
  border: none;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

button:hover {
  background-color: #0b5ed7;
}

/* Modal content */
.modal-body {
  font-family: 'Poppins', sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: #444;
}
</style>
