<template>
    <div class="container">
      <h2 class="mb-4">Invoice Management</h2>
      <CCard>
        <CCardBody>
          <CInputGroup class="mb-3">
            <CInputGroupText>
              <CIcon :icon="cilSearch" size="sm" />
            </CInputGroupText>
            <CFormInput v-model="search" placeholder="Search invoice by project or status..." />
          </CInputGroup>
  
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>#</CTableHeaderCell>
                <CTableHeaderCell>Project</CTableHeaderCell>
                <CTableHeaderCell>Amount</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Date</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(invoice, index) in filteredInvoices" :key="invoice.id">
                <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                <CTableDataCell>{{ invoice.project }}</CTableDataCell>
                <CTableDataCell>{{ invoice.amount }} $</CTableDataCell>
                <CTableDataCell>
                  <span :class="invoice.status === 'Paid' ? 'badge bg-success' : 'badge bg-warning text-dark'">
                    {{ invoice.status }}
                  </span>
                </CTableDataCell>
                <CTableDataCell>{{ invoice.date }}</CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="info" @click="viewInvoice(invoice)">View</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
  
      <!-- Modal -->
      <CModal :visible="modalVisible" @close="modalVisible = false">
        <CModalHeader>
          <CModalTitle>Invoice Details</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p><strong>Project:</strong> {{ selectedInvoice.project }}</p>
          <p><strong>Amount:</strong> {{ selectedInvoice.amount }} $</p>
          <p><strong>Status:</strong> {{ selectedInvoice.status }}</p>
          <p><strong>Date:</strong> {{ selectedInvoice.date }}</p>
          <p><strong>Description:</strong> {{ selectedInvoice.description }}</p>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="modalVisible = false">Close</CButton>
        </CModalFooter>
      </CModal>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue'
  import {
    CCard,
    CCardBody,
    CFormInput,
    CInputGroup,
    CInputGroupText,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableBody,
    CTableDataCell,
    CButton,
    CModal,
    CModalHeader,
    CModalTitle,
    CModalBody,
    CModalFooter,
  } from '@coreui/vue'
  import { CIcon } from '@coreui/icons-vue'
  import { cilSearch } from '@coreui/icons'
  
  const search = ref('')
  const modalVisible = ref(false)
  const selectedInvoice = ref({})
  
  const invoices = ref([
    {
      id: 1,
      project: 'E-commerce Website',
      amount: 1200,
      status: 'Paid',
      date: '2025-04-01',
      description: 'Final invoice for the project development.',
    },
    {
      id: 2,
      project: 'Mobile App UI Design',
      amount: 800,
      status: 'Pending',
      date: '2025-04-10',
      description: '50% payment pending after design delivery.',
    },
  ])
  
  const filteredInvoices = computed(() => {
    return invoices.value.filter((invoice) =>
      invoice.project.toLowerCase().includes(search.value.toLowerCase()) ||
      invoice.status.toLowerCase().includes(search.value.toLowerCase())
    )
  })
  
  const viewInvoice = (invoice) => {
    selectedInvoice.value = invoice
    modalVisible.value = true
  }
  </script>
  
  <style scoped>
  .container {
    font-family: 'Poppins', sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    padding: 24px;
  }
  
  h2 {
    font-weight: 600;
    font-size: 26px;
  }
  
  .badge {
    font-size: 13px;
    padding: 5px 10px;
    border-radius: 12px;
  }
  </style>
  