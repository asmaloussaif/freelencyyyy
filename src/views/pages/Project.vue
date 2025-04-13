<template>
  <div class="container">
    <!-- Offer List Card -->
    <CCard class="mb-4">
      <CCardBody>
        <!-- Search Bar with Search Icon -->
        <CInputGroup class="mb-3">
          <CInputGroupText>
            <CIcon :icon="cilSearch" size="sm" />
          </CInputGroupText>
          <CFormInput placeholder="Search for projects..." aria-label="Search" />
        </CInputGroup>

        <!-- Offer Card for Each Project -->
        <div v-for="(offer, index) in offers" :key="index" class="mb-4">
          <CCard class="p-3">
            <div class="d-flex justify-content-between">
              <!-- Title and Description -->
              <div>
                <h4 class="mb-1">Title: {{ offer.title }}</h4>
                <p>{{ offer.description }}</p>
              </div>
              <!-- Project State -->
              <div class="text-end">
                <span :class="offer.state === 'Open' ? 'badge bg-success' : 'badge bg-danger'">
                  {{ offer.state }}
                </span>
              </div>
            </div>

            <!-- Apply Button -->
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
import { ref } from 'vue'
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


const offers = ref([
  {
    title: 'Web Development Project',
    description: 'A challenging web development project using Vue.js.',
    state: 'Open',
  },
  {
    title: 'Mobile App Development',
    description: 'Create a mobile app for a healthcare startup.',
    state: 'Closed',
  },
])


const modalVisible = ref(false)
const motivationText = ref('')
const selectedOffer = ref(null)

const openModal = (offer) => {
  selectedOffer.value = offer
  modalVisible.value = true
}

const closeModal = () => {
  modalVisible.value = false
}

const clearModal = () => {
  motivationText.value = ''
  selectedOffer.value = null
}


const submitApplication = () => {
 
  console.log('Motivation:', motivationText.value)
  closeModal()
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
