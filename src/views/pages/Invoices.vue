<template>
  <div class="container py-4">
    <h2 class="mb-4 text-primary-dark fw-bold">My Payments</h2>

    <CRow>
      <CCol cols="12">
        <CCard>
          <CCardHeader class="bg-light">
            <strong>Transaction History</strong>
          </CCardHeader>
          <CCardBody>
            <CTable striped hover responsive>
              <CTableHead>
                <CTableRow>
                  <CTableHeaderCell>#</CTableHeaderCell>
                  <CTableHeaderCell v-if="role === 'freelancer'">Client</CTableHeaderCell>
                  <CTableHeaderCell v-else-if="role === 'client'">Freelancer</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Date</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(payment, index) in payments" :key="payment.id">
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell v-if="role.value === 'freelancer'">
                    {{ payment.client.lastName }} {{ payment.client.name }}
                  </CTableDataCell>
                  <CTableDataCell v-else>
                    {{ payment.freelancer.lastName }} {{ payment.freelancer.name }}
                  </CTableDataCell>
                  <CTableDataCell>{{ payment.montant }} TND</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="statusColor(payment.statut)">
                      {{ payment.statut }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{{ formatDate(payment.created_at) }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton color="secondary" @click="openStatusModal(payment)">Close</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CModal :visible="statusModalVisible" @close="statusModalVisible = false">
              <CModalHeader>
                <CModalTitle>Change Status</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <label class="form-label">Select New Status</label>
                <select v-model="selectedStatus" class="form-select">
                  <option disabled value="">-- Choose status --</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="finished">Finished</option>
                </select>
              </CModalBody>
              <CModalFooter>
                <CButton color="secondary" @click="statusModalVisible = false">Cancel</CButton>
                <CButton color="primary" @click="saveStatus">Save</CButton>
              </CModalFooter>
            </CModal>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { defineComponent, computed, h, resolveComponent } from 'vue'
import { useAuthStore } from '@/stores/authStore'
import {
  CButton,
  CModal,
  CModalHeader,
  CModalTitle,
  CModalBody,
  CModalFooter,
  CToast,
  CToastHeader,
  CToastBody,
} from '@coreui/vue'
const payments = ref([])
const role = computed(() => authStore.role)
const authStore = useAuthStore()
const fetchPayments = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/payments/history', { headers })
    payments.value = response.data
    console.log(response.data, response)
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}
const statusColor = (status) => {
  switch (status) {
    case 'finished':
      return 'success'
    case 'on hold':
      return 'warning'
    case 'canceled':
      return 'danger'
    default:
      return 'secondary'
  }
}
const saveStatus = async () => {
  if (!selectedStatus.value) return
console.log(selectedPayment.value.id);

  try {
    await axios.put(
  `http://127.0.0.1:8000/api/payments/${selectedPayment.value.id}/status`,
  { statut: selectedStatus.value },
  {
    headers: {
      Authorization: `Bearer ${authStore.token}`,
      'Content-Type': 'application/json',
    },
  }
)
    statusModalVisible.value = false
    showSuccessToast('Status updated successfully!')
    fetchPayments()
  } catch (err) {
    console.error(err)
    showSuccessToast('Error updating status', true)
  }
}
const statusModalVisible = ref(false)
const selectedStatus = ref('')
const selectedPayment = ref(null)

const openStatusModal = (payment) => {
  selectedPayment.value = payment
  selectedStatus.value = ''
  statusModalVisible.value = true
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

onMounted(fetchPayments)
</script>

<style scoped>
.text-primary-dark {
  color: #0f2573;
}
</style>
