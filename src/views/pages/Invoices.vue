<template>
  <CContainer fluid class="mt-4 mb-5">
    <CCard class="shadow">
      <CCardHeader class="d-flex justify-content-between align-items-center bg-light py-3">
        <div>
         <!--  <CIcon name="cil-list-rich" class="me-2" /> -->
          <strong class="h4">My Invoices</strong>
        </div>
        <div>
          <CButton color="primary" size="sm">
          <!--   <CIcon name="cil-plus" class="me-1" /> -->
            New Invoice
          </CButton>
        </div>
      </CCardHeader>
      <CCardBody class="p-0">
        <CTable hover responsive striped bordered>
          <CTableHead class="table-light">
            <CTableRow>
              <CTableHeaderCell scope="col" class="w-10">#</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="w-20">Date</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="w-20 text-end">Amount</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="w-20">Status</CTableHeaderCell>
              <CTableHeaderCell scope="col" class="w-30 text-center">Actions</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow v-for="(invoice, index) in invoices" :key="index">
              <CTableDataCell class="fw-semibold">{{ invoice.id }}</CTableDataCell>
              <CTableDataCell>{{ formatDate(invoice.date) }}</CTableDataCell>
              <CTableDataCell class="text-end">{{ invoice.amount.toFixed(2) }} €</CTableDataCell>
              <CTableDataCell>
                <CBadge 
                  :color="getStatusColor(invoice.status)" 
                  class="py-1 px-2"
                  shape="rounded-pill"
                >
                 <!--  <CIcon :name="getStatusIcon(invoice.status)" class="me-1" /> -->
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
                 <!--    <CIcon name="cil-cloud-download" class="me-1" /> -->
                    Download
                  </CButton>
                  <CButton 
                    color="secondary" 
                    size="sm" 
                    variant="outline"
                    @click="viewDetails(invoice)"
                  >
                   <!--  <CIcon name="cil-description" class="me-1" /> -->
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
</template>

<script setup>
import { ref } from 'vue'
import {
  CContainer, CCard, CCardHeader, CCardBody, CCardFooter,
  CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell,
  CButton, CButtonGroup, CBadge, CPagination, CPaginationItem
} from '@coreui/vue'

const invoices = ref([
  { id: 'INV001', date: '2025-04-01', amount: 150.00, status: 'Paid' },
  { id: 'INV002', date: '2025-03-20', amount: 300.00, status: 'Pending' },
  { id: 'INV003', date: '2025-02-15', amount: 200.00, status: 'Paid' },
  { id: 'INV004', date: '2025-01-10', amount: 450.00, status: 'Cancelled' },
  { id: 'INV005', date: '2024-12-05', amount: 175.50, status: 'Paid' },
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

const getStatusIcon = (status) => {
  const statusIcons = {
    'Paid': 'cil-check-circle',
    'Pending': 'cil-clock',
    'Cancelled': 'cil-ban'
  }
  return statusIcons[status] || 'cil-info'
}

const downloadInvoice = (invoice) => {
  // Actual download implementation
  console.log(`Downloading invoice: ${invoice.id}`)
}

const viewDetails = (invoice) => {
  // Navigation to details page
  console.log(`Viewing details for: ${invoice.id}`)
}
</script>

<style scoped>
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
</style>