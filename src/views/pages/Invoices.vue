<template>
  <div class="container py-4">
    <div class="header-section">
      <h2 class="section-title">My Payments</h2>

      <!-- Button visible only for freelancers -->
      <div v-if="role === 'freelancer'">
        <CButton class="add-facture-btn" color="primary" @click="factureModalVisible = true">
          + Add Facture
        </CButton>
      </div>
    </div>

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
                  <CTableHeaderCell>Project</CTableHeaderCell>
                  <CTableHeaderCell v-if="role === 'freelancer'">Client</CTableHeaderCell>
                  <CTableHeaderCell v-else-if="role === 'client'">Freelancer</CTableHeaderCell>
                  <CTableHeaderCell>Amount</CTableHeaderCell>
                  <CTableHeaderCell>Status</CTableHeaderCell>
                  <CTableHeaderCell>Deadline payment</CTableHeaderCell>
                  <CTableHeaderCell>Action</CTableHeaderCell>
                </CTableRow>
              </CTableHead>
              <CTableBody>
                <CTableRow v-for="(payment, index) in payments" :key="payment.id">
                  <CTableDataCell>{{ index + 1 }}</CTableDataCell>
                  <CTableDataCell>{{ payment.project?.title || 'N/A' }}</CTableDataCell>
                  <CTableDataCell v-if="role === 'freelancer'">
                    {{ payment.client?.lastName }} {{ payment.client?.name }}
                  </CTableDataCell>
                  <CTableDataCell v-else>
                    {{ payment.freelancer?.lastName }} {{ payment.freelancer?.name }}
                  </CTableDataCell>
                  <CTableDataCell>{{ payment.montant }} TD</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="statusColor(payment.statut)">
                      {{ payment.statut === 'finished' ? 'Paid' : 'Unpaid' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{{ formatDate(payment.created_at) }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton class="btn-update" @click="openStatusModal(payment)">Update</CButton>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <!-- Status Modal -->
            <CModal :visible="statusModalVisible" @close="statusModalVisible = false">
              <CModalHeader>
                <CModalTitle>Change Status</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <label class="form-label">Select New Status</label>
                <select v-model="selectedStatus" class="form-select">
                  <option disabled value="">-- Choose status --</option>
                  <option value="cancelled">Paid</option>
                  <option value="finished">Unpaid</option>
                </select>
              </CModalBody>
              <CModalFooter>
  <CButton class="btn-cancel" @click="statusModalVisible = false">Cancel</CButton>
  <CButton class="btn-save" @click="saveStatus">Save</CButton>
</CModalFooter>

            </CModal>

            <!-- Add Facture Modal -->
            <CModal :visible="factureModalVisible" @close="factureModalVisible = false">
              <CModalHeader>
                <CModalTitle>Add Facture</CModalTitle>
              </CModalHeader>
              <CModalBody>
                <div class="mb-3">
                  <label class="form-label">Project</label>
                  <input type="text" class="form-control" v-model="newFacture.project" placeholder="Project name" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <input type="number" class="form-control" v-model="newFacture.amount" placeholder="e.g. 200" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Deadline</label>
                  <input type="date" class="form-control" v-model="newFacture.deadline" />
                </div>
                <div class="mb-3">
                  <label class="form-label">Client name</label>
                  <input type="text" class="form-control" placeholder="Client name" />
                </div>
              </CModalBody>
              <CModalFooter>
  <CButton class="btn-cancel" @click="factureModalVisible = false">Cancel</CButton>
  <CButton class="btn-submit" @click="submitFacture">Submit</CButton>
</CModalFooter>

            </CModal>

          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const authStore = useAuthStore()
const payments = ref([])
const role = computed(() => authStore.role)

const statusModalVisible = ref(false)
const selectedStatus = ref('')
const selectedPayment = ref(null)
const factureModalVisible = ref(false)

const newFacture = ref({
  project: '',
  amount: '',
  deadline: '',
})

const fetchPayments = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/payments/history', { headers })
    payments.value = response.data
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}

function formatDate(dateString) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(dateString).toLocaleDateString('fr-FR', options)
}

const statusColor = (status) => {
  return status === 'finished' ? 'success' : 'warning'
}

const openStatusModal = (payment) => {
  selectedPayment.value = payment
  selectedStatus.value = ''
  statusModalVisible.value = true
}

const saveStatus = async () => {
  if (!selectedStatus.value) return
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

const submitFacture = async () => {
  const headers = { Authorization: `Bearer ${authStore.token}` }
  try {
    await axios.post('http://127.0.0.1:8000/api/factures', {
      ...newFacture.value,
    }, { headers })
    factureModalVisible.value = false
    showSuccessToast('Facture submitted successfully!')
    fetchPayments()
  } catch (error) {
    console.error(error)
    showSuccessToast('Failed to submit facture', true)
  }
}

const showSuccessToast = (message, isError = false) => {
  const toast = document.createElement('div')
  toast.innerHTML = `
    <div class="toast align-items-center text-white ${isError ? 'bg-danger' : 'bg-success'} border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
      </div>
    </div>`
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}

onMounted(fetchPayments)
</script>

<style scoped>
.section-title {
  color: #0e2fa6;
  font-weight: bold;
}

.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.add-facture-btn {
  font-weight: 500;
  border-radius: 8px;
  padding: 8px 16px;
  background-color: #17308b;
}

.btn-update {
  background-color: #0b1f67;
  color: white;
  border: none;
  padding: 5px 12px;
  border-radius: 6px;
  transition: background-color 0.3s ease;
}

.btn-update:hover {
  background-color: #3a89dd;
}
.btn-cancel {
  background-color: #1b0b5f;
  color: #fff;
  border: none;
}

.btn-cancel:hover {
  background-color: #092052;
}

.btn-submit {
  background-color: #3a89dd;
  color: #fff;
  border: none;
}

.btn-submit:hover {
  background-color: #212bba;
}
.btn-cancel {
  background-color: #0b1f67;
  color: #fff;
  border: none;
}

.btn-cancel:hover {
  background-color: #092052;
}

.btn-save {
  background-color: #3a89dd;
  color: #fff;
  border: none;
}

.btn-save:hover {
  background-color: #3a89dd;
}


</style>

