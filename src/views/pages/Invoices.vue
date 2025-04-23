<template>
  <div class="page-background">
    <CContainer fluid class="pt-4 pb-5">
      <CCard class="shadow-lg rounded-4 border-0">
        <CCardHeader class="d-flex justify-content-between align-items-center bg-dark text-white py-3 px-4 rounded-top-4">
          <strong class="h4 mb-0">My Invoices</strong>
        </CCardHeader>
        <CCardBody class="p-0 bg-gray-100">
          <CTable hover responsive striped bordered class="rounded-3 overflow-hidden">
            <CTableHead class="bg-gray-200">
              <CTableRow>
                <CTableHeaderCell scope="col" class="w-10">Invoice ID</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-20">Project Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15 text-end">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-25 text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody class="bg-white">
              <CTableRow v-for="(invoice, index) in invoices" :key="index">
                <CTableDataCell class="fw-semibold">{{ invoice.id }}</CTableDataCell>
                <CTableDataCell>{{ invoice.projectName }}</CTableDataCell>
                <CTableDataCell>{{ formatDate(invoice.date) }}</CTableDataCell>
                <CTableDataCell class="text-end">{{ invoice.amount.toFixed(2) }} €</CTableDataCell>
                <CTableDataCell>
                  <CBadge 
                    :color="getStatusColor(invoice.status)" 
                    class="py-1 px-2 text-capitalize"
                    shape="rounded-pill"
                  >
                    {{ invoice.status }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CButton 
                    color="purple" 
                    size="sm" 
                    class="me-2 shadow-sm rounded-pill px-3 text-white"
                    @click="downloadInvoice(invoice)"
                  >
                    Download
                  </CButton>
                  <CButton 
                    color="dark" 
                    variant="outline"
                    size="sm" 
                    class="shadow-sm rounded-pill px-3"
                    @click="viewDetails(invoice)"
                  >
                    Details
                  </CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
        <CCardFooter class="bg-gray-200 py-3 px-4">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-gray-600 small">
              Showing {{ invoices.length }} invoices
            </div>
            <CPagination size="sm">
              <CPaginationItem class="text-gray-700">Previous</CPaginationItem>
              <CPaginationItem active class="bg-purple text-white">1</CPaginationItem>
              <CPaginationItem class="text-gray-700">2</CPaginationItem>
              <CPaginationItem class="text-gray-700">3</CPaginationItem>
              <CPaginationItem class="text-gray-700">Next</CPaginationItem>
            </CPagination>
          </div>
        </CCardFooter>
      </CCard>
    </CContainer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import {
  CContainer, CCard, CCardHeader, CCardBody, CCardFooter,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CBadge, CPagination, CPaginationItem
} from '@coreui/vue'

const invoices = ref([
  { id: 'INV001', projectName: 'E-commerce Platform', date: '2025-04-01', amount: 150.00, status: 'Paid' },
  { id: 'INV002', projectName: 'Portfolio Website', date: '2025-03-20', amount: 300.00, status: 'Pending' },
  { id: 'INV003', projectName: 'Task Management App', date: '2025-02-15', amount: 200.00, status: 'Paid' },
  { id: 'INV004', projectName: 'CRM System', date: '2025-01-10', amount: 450.00, status: 'Cancelled' },
  { id: 'INV005', projectName: 'Mobile Application', date: '2024-12-05', amount: 175.50, status: 'Paid' },
])

const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('en-US', options)
}

const getStatusColor = (status) => {
  const statusColors = {
    'Paid': 'success',
    'Pending': 'warning',
    'Cancelled': 'danger'
  }
  return statusColors[status] || 'secondary'
}

const downloadInvoice = (invoice) => {
  console.log(`Downloading invoice: ${invoice.id}`)
}

const viewDetails = (invoice) => {
  console.log(`Viewing details for: ${invoice.id}`)
}
</script>

<style scoped>
.page-background {
  background: linear-gradient(135deg, #E2C3FF 0%, #F0D9FF 100%);
  min-height: 100vh;
  padding: 1rem;
}

.text-capitalize {
  text-transform: capitalize;
  color: #4A2C7A;
}

.shadow {
  box-shadow: 0 0.5rem 1rem rgba(151, 96, 208, 0.1) !important;
}

.table thead {
  background-color: #F0D9FF;
  color: #4A2C7A;
}

.table tbody td {
  background-color: #FFF;
  border-bottom: 1px solid #E2C3FF;
}

/* Button overrides */
.btn-info {
  background-color: #6E3FB4 !important;
  border-color: #6E3FB4 !important;
  color: #FFF !important;
  transition: all 0.3s ease;
}

.btn-info:hover {
  background-color: #5E2B97 !important;
  border-color: #5E2B97 !important;
}

.btn-outline-secondary {
  border-color: #8A4EBF !important;
  color: #8A4EBF !important;
  transition: all 0.3s ease;
}

.btn-outline-secondary:hover {
  background-color: #8A4EBF !important;
  color: #FFF !important;
}

/* Download Button - Fixed */
.download-btn {
  background-color: white !important;
  color: #6E3FB4 !important;
  border: 2px solid #6E3FB4 !important;
  border-radius: 10px !important;
  padding: 0.75rem 1.5rem !important;
  font-weight: 500 !important;
  transition: all 0.3s ease !important;
  box-shadow: 0 4px 12px rgba(110, 63, 180, 0.15) !important;
}

.download-btn:hover {
  background-color: #F5E9FF !important;
  color: #5E2B97 !important;
  border-color: #5E2B97 !important;
  transform: translateY(-2px) !important;
  box-shadow: 0 6px 16px rgba(110, 63, 180, 0.25) !important;
}

.download-btn:active {
  transform: translateY(0) !important;
  box-shadow: 0 2px 8px rgba(110, 63, 180,0.2) !important;
}

/* Card header */
.card-header {
  background-color: #5E2B97 !important;
  color: white !important;
  border-radius: 1rem 1rem 0 0;
  border-bottom: 2px solid #4A2C7A !important;
}

/* Table enhancements */
.table tbody tr:hover td {
  background-color: #FAF2FF;
}

.table thead th {
  border-bottom: 2px solid #8A4EBF;
}

.card {
  border: 1px solid #E2C3FF;
  border-radius: 1rem;
  overflow: hidden;
}

/* Focus states */
.btn:focus,
.form-control:focus {
  box-shadow: 0 0 0 0.25rem rgba(110, 63, 180, 0.25) !important;
  border-color: #8A4EBF !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-background {
    padding: 0.5rem;
  }

  .table thead th {
    font-size: 0.75rem;
    padding: 0.75rem 0.5rem;
  }

  .table tbody td {
    font-size: 0.85rem;
    padding: 0.5rem;
  }

  .btn {
    padding: 0.375rem 0.75rem;
    font-size: 0.75rem;
  }

  .card-header {
    padding: 0.75rem;
  }

  /* Mobile download button */
  .download-btn {
    padding: 0.5rem 1rem !important;
  }
}
</style>