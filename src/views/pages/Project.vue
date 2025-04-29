<template>
  <CRow>
    <CCol>
      <CCard class="offer-card">
        <CCardHeader class="offer-header">
          <h4 class="text-white">Available Projects for Freelancers</h4>
        </CCardHeader>
        <CCardBody>
          <CAlert
            v-if="showAlert"
            color="success"
            dismissible
            class="mt-3"
          >
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
              <CTableRow v-for="(offer, index) in offers" :key="index">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>
                  <CIcon icon="cil-lightbulb" class="me-2 text-info" />
                  {{ offer.title }}
                </CTableDataCell>
                <CTableDataCell>
                  <span class="badge bg-info">{{ offer.category }}</span>
                </CTableDataCell>
                <CTableDataCell>{{ offer.budget }} TND</CTableDataCell> <!-- Updated to TND -->
                <CTableDataCell>{{ offer.deadline }}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="primary" variant="outline" size="sm" @click="applyToOffer">
                    <CIcon icon="cil-paper-plane" class="me-2" /> Apply
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </CCol>
  </CRow>
</template>

<script setup>
import {
  CRow, CCol, CCard, CCardHeader, CCardBody, CAlert,
  CTable, CTableHead, CTableRow, CTableHeaderCell,
  CTableBody, CTableDataCell, CButton,
} from '@coreui/vue'

import CIcon from '@coreui/icons-vue'
import { ref } from 'vue'

const offers = [
  { title: 'Develop a Task Management System', category: 'Software Engineering', budget: '4000', deadline: '2025-05-20' },
  { title: 'Create a Machine Learning Model', category: 'Artificial Intelligence', budget: '5300', deadline: '2025-05-18' },
  { title: 'Build a Secure API with Laravel', category: 'Backend Development', budget: '3400', deadline: '2025-05-22' },
  { title: 'Web Scraping Bot for Market Data', category: 'Data Science', budget: '2700', deadline: '2025-05-25' },
]

const showAlert = ref(false)

function applyToOffer() {
  showAlert.value = true
  setTimeout(() => {
    showAlert.value = false
  }, 3000)
}
</script>

<style scoped>
.offer-card {
  background-color: #F4F7FC;
  border-radius: 1rem;
  box-shadow: 0 0 15px rgba(1, 8, 45, 0.1);
}

.offer-header {
  background-color: #0F2573;
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  color: white;
  padding: 15px;
}

.offer-table {
  background-color: white;
  color: #333;
  border-collapse: collapse;
  width: 100%;
}

.offer-table th, .offer-table td {
  padding: 10px;
  text-align: left;
  border-bottom: 1px solid #BE95C4;
}

.offer-table tr:hover {
  background-color: #E1F0FE;
  transition: background-color 0.3s ease;
}

.badge {
  font-size: 0.9rem;
  background-color: #0F2573;
  color: white;
}

.offer-table tr:hover .badge {
  background-color: #5E548E;
}
</style>
