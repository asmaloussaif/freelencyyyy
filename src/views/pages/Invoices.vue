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
                  <CTableDataCell>{{ payment.project?.titre || 'N/A' }}</CTableDataCell>
                  <CTableDataCell v-if="role === 'freelancer'">
                    {{ payment.client?.lastName }} {{ payment.client?.name }}
                  </CTableDataCell>
                  <CTableDataCell v-else>
                    {{ payment.freelancer?.lastName }} {{ payment.freelancer?.name }}
                  </CTableDataCell>
                  <CTableDataCell>{{ payment.montant }} TD</CTableDataCell>
                  <CTableDataCell>
                    <CBadge :color="statusColor(payment.statut)">
                      {{ payment.statut === 'Paid' ? 'Paid' : 'Unpaid' }}
                    </CBadge>
                  </CTableDataCell>
                  <CTableDataCell>{{ formatDate(payment.created_at) }}</CTableDataCell>
                  <CTableDataCell>
                    <CButton
                      v-if="role === 'freelancer'"
                      class="btn-update"
                      @click="openStatusModal(payment)"
                      >Update</CButton
                    >
                    <CButton
                      v-if="role === 'client'"
                      class="btn-update"
                      @click="openDetailModal(payment)"
                      >Show Detail</CButton
                    >
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>

            <!-- Status Modal -->
            <CModal :visible="statusModalVisible" @close="statusModalVisible = false">
              <CModalHeader><CModalTitle>Change Status</CModalTitle></CModalHeader>
              <CModalBody>
                <label class="form-label">Select New Status</label>
                <select v-model="selectedStatus" class="form-select">
                  <option disabled value="">-- Choose status --</option>
                  <option value="Unpaid">Unpaid</option>
                  <option value="Paid">Paid</option>
                </select>
              </CModalBody>
              <CModalFooter>
                <CButton class="btn-cancel" @click="statusModalVisible = false">Cancel</CButton>
                <CButton class="btn-save" @click="saveStatus">Save</CButton>
              </CModalFooter>
            </CModal>

            <!-- Detail Modal (Client View) -->
            <CModal
              :visible="detailModalVisible"
              @close="detailModalVisible = false"
              class="styled-modal"
            >
              <CModalHeader><CModalTitle>Invoice Detail</CModalTitle></CModalHeader>
              <CModalBody v-if="selectedPayment" class="modal-body-custom">
                <p><strong>Project:</strong> {{ selectedPayment.project?.title }}</p>
                <p>
                  <strong>Freelancer:</strong> {{ selectedPayment.freelancer?.name }}
                  {{ selectedPayment.freelancer?.lastName }}
                </p>
                <p><strong>Amount:</strong> {{ selectedPayment.montant }} TD</p>
                <p>
                  <strong>Status:</strong>
                  {{ selectedPayment.statut === 'finished' ? 'Paid' : 'Unpaid' }}
                </p>
                <p><strong>Deadline:</strong> {{ formatDate(selectedPayment.created_at) }}</p>
                <p><strong>Description:</strong> {{ selectedPayment.description || 'N/A' }}</p>
              </CModalBody>
              <CModalFooter>
                <CButton class="btn-cancel" @click="detailModalVisible = false">Close</CButton>
              </CModalFooter>
            </CModal>

            <!-- Add Facture Modal -->
            <CModal
              :visible="factureModalVisible"
              @close="resetFactureForm"
              class="styled-modal"
            >
              <CModalHeader><CModalTitle>Add Facture</CModalTitle></CModalHeader>
              <CModalBody class="modal-body-custom">
                <!-- Select Project -->
                <div class="mb-3">
                  <label class="form-label">Project</label>
                  <select
                    class="form-control custom-input"
                    v-model="newFacture.project_id"
                    @change="onProjectSelect"
                  >
                    <option disabled value="">-- Select Project --</option>
                    <option v-for="project in unpaidProject" :key="project.id" :value="project.id">
                      {{ project.titre }}
                    </option>
                  </select>
                </div>

                <!-- Amount -->
                <div class="mb-3">
                  <label class="form-label">Amount</label>
                  <input
                    type="number"
                    class="form-control custom-input"
                    v-model="newFacture.montant"
                    placeholder="e.g. 200"
                  />
                </div>

                <!-- Description -->
                <div class="mb-3">
                  <label class="form-label">Description</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    v-model="newFacture.description"
                    placeholder="Description"
                  />
                </div>

                <!-- Deadline -->
                <div class="mb-3">
                  <label class="form-label">Deadline</label>
                   <input type="date" class="form-control custom-input" v-model="newFacture.date_limite" />
                </div>

                <!-- Client Name (Read Only) -->
                <div class="mb-3">
                  <label class="form-label">Client name</label>
                  <input
                    type="text"
                    class="form-control custom-input"
                    :value="selectedClientName"
                    readonly
                    placeholder="Client name"
                  />
                </div>
              </CModalBody>

              <CModalFooter>
              <CButton class="btn-cancel" @click="resetFactureForm">Cancel</CButton>
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
const factureModalVisible = ref(false)
const detailModalVisible = ref(false)

const selectedStatus = ref('')
const selectedPayment = ref(null)

const unpaidProject = ref([])
const newFacture = ref({
  client_id: '',
  project_id: '',
  montant: '',
  description: '',
  date_limite: ''
})
const selectedClientName = ref('')
const resetFactureForm = () => {
  newFacture.value = {
    client_id: '',
    project_id: '',
    montant: '',
    description: '',
    date_limite: ''
  }
  selectedClientName.value = '' 
  factureModalVisible.value = false
}
const fetchPayments = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    const response = await axios.get('http://127.0.0.1:8000/api/payments/history', { headers })
    payments.value = response.data
    console.log(payments.value, ' payments.value')
  } catch (error) {
    console.error('Error fetching payments:', error)
  }
}
const fetechUnpaidProjectList = async () => {
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    const response = await axios.get('http://127.0.0.1:8000/api/unpaid_project', { headers })
    unpaidProject.value = response.data
  } catch (error) {
    console.error('Error fetching unpaid projects:', error)
  }
}

// When project is selected, update client name display
const onProjectSelect = () => {
  const selected = unpaidProject.value.find(p => p.id === newFacture.value.project_id)
  if (selected && selected.client) {
    selectedClientName.value = `${selected.client.name} ${selected.client.lastName || ''}`
    newFacture.value.client_id = selected.client.id 
  } else {
    selectedClientName.value = ''
    newFacture.value.client_id = ''
  }
}

const openStatusModal = (payment) => {
  selectedPayment.value = payment
  selectedStatus.value = ''
  statusModalVisible.value = true
}

const openDetailModal = (payment) => {
  selectedPayment.value = payment
  detailModalVisible.value = true
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
      },
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
  try {
    const headers = { Authorization: `Bearer ${authStore.token}` }
    await axios.post('http://127.0.0.1:8000/api/payments', newFacture.value, { headers })
    factureModalVisible.value = false
    showSuccessToast('Facture submitted successfully!')
    fetchPayments()
  } catch (error) {
    console.error(error)
    showSuccessToast('Failed to submit facture', true)
  }
}
const statusColor = (status) => (status === 'finished' ? 'success' : 'warning')

const formatDate = (date) => {
  const options = { year: 'numeric', month: 'short', day: 'numeric' }
  return new Date(date).toLocaleDateString('fr-FR', options)
}

const showSuccessToast = (message, isError = false) => {
  const toast = document.createElement('div')
  toast.innerHTML = `
    <div class="toast align-items-center text-white ${
      isError ? 'bg-danger' : 'bg-success'
    } border-0 show" role="alert">
      <div class="d-flex">
        <div class="toast-body">${message}</div>
      </div>
    </div>`
  document.body.appendChild(toast)
  setTimeout(() => toast.remove(), 3000)
}

onMounted(fetchPayments(), fetechUnpaidProjectList())
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
  background-color: #3a89dd;
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
  background-color: #0b1f67;
  color: #fff;
  border: none;
}

.btn-cancel:hover {
  background-color: #092052;
}

.btn-submit,
.btn-save {
  background-color: #3a89dd;
  color: #fff;
  border: none;
}

.btn-submit:hover,
.btn-save:hover {
  background-color: #212bba;
}
.styled-modal {
  --cui-modal-border-radius: 1rem;
  --cui-modal-padding: 1.5rem;
  --cui-modal-bg: #f8faff;
}

.modal-body-custom {
  padding: 1rem 1.5rem;
  background-color: #ffffff;
  border-radius: 1rem;
}

.custom-input {
  border-radius: 0.75rem;
  border: 1px solid #d6beda;
  padding: 0.6rem 1rem;
  background-color: #f8faff;
  transition: border-color 0.3s;
}

.custom-input:focus {
  outline: none;
  border-color: #9f86c0;
  box-shadow: 0 0 0 0.15rem rgba(159, 134, 192, 0.25);
}

.btn-cancel,
.btn-submit {
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 500;
  transition: background-color 0.3s;
}

.btn-cancel {
  background-color: #e1f0ff;
  color: #0f2573;
  border: none;
}

.btn-cancel:hover {
  background-color: #d0e8ff;
}

.btn-submit {
  background-color: #081681;
  color: white;
  border: none;
}

.btn-submit:hover {
  background-color: #3f3add;
}
</style>
