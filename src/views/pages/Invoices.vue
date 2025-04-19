<template>
  <div class="page-background">
    <CContainer fluid class="pt-4 pb-5">
      <CCard class="shadow">
        <CCardHeader class="d-flex justify-content-between align-items-center bg-light py-3">
          <div>
            <strong class="h4">My Invoices</strong>
          </div>
        </CCardHeader>
        <CCardBody class="p-0">
          <CTable hover responsive striped bordered>
            <CTableHead class="table-light">
              <CTableRow>
                <CTableHeaderCell scope="col" class="w-10">Invoice ID</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-20">Project Name</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15">Date</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15 text-end">Amount</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-15">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col" class="w-25 text-center">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(invoice, index) in invoices" :key="index">
                <CTableDataCell class="fw-semibold">{{ invoice.id }}</CTableDataCell>
                <CTableDataCell>{{ invoice.projectName }}</CTableDataCell>
                <CTableDataCell>{{ formatDate(invoice.date) }}</CTableDataCell>
                <CTableDataCell class="text-end">{{ invoice.amount.toFixed(2) }} €</CTableDataCell>
                <CTableDataCell>
                  <CBadge 
                    :color="getStatusColor(invoice.status)" 
                    class="py-1 px-2"
                    shape="rounded-pill"
                  >
                    {{ invoice.status }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell class="text-center">
                  <CButtonGroup>
                    <CButton 
                      color="primary" 
                      size="sm" 
                      @click="downloadInvoice(invoice)"
                      class="me-2"
                    >
                      Download
                    </CButton>
                    <CButton 
                      color="secondary" 
                      size="sm" 
                      variant="outline"
                      @click="viewDetails(invoice)"
                    >
                      Details
                    </CButton>
                  </CButtonGroup>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
        <CCardFooter class="bg-light py-3">
          <div class="d-flex justify-content-between align-items-center">
            <div class="text-muted small">
              Showing {{ invoices.length }} invoices
            </div>
            <CPagination size="sm">
              <CPaginationItem>Previous</CPaginationItem>
              <CPaginationItem active>1</CPaginationItem>
              <CPaginationItem>2</CPaginationItem>
              <CPaginationItem>3</CPaginationItem>
              <CPaginationItem>Next</CPaginationItem>
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
  CButton, CButtonGroup, CBadge, CPagination, CPaginationItem
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
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 1rem;
}

.table-responsive {
  border-radius: 0.375rem;
  overflow: hidden;
}

.table thead th {
  border-bottom-width: 2px;
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.5px;
}

.table tbody tr {
  transition: background-color 0.2s ease;
}

.table tbody tr:hover {
  background-color: rgba(0, 123, 255, 0.05);
}

.badge {
  font-weight: 500;
  letter-spacing: 0.5px;
}

.text-end {
  text-align: end;
}

/* Card styling */
.shadow {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.05) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .page-background {
    padding: 0.5rem;
  }
  
  .table thead th {
    font-size: 0.65rem;
  }
  
  .table tbody td {
    font-size: 0.85rem;
    padding: 0.5rem;
  }
  
  .btn {
    padding: 0.25rem 0.5rem;
    font-size: 0.75rem;
  }
}
</style>