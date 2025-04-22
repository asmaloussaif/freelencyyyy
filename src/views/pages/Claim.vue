<template>
  <div class="container">
    <CCard class="mb-4 shadow rounded-4 overflow-hidden">
      <CCardHeader class="bg-gradient bg-primary text-white py-3 px-4">
        <h4 class="mb-0 fw-semibold">📝 Submit a Claim</h4>
      </CCardHeader>

      <CCardBody class="p-4">
        <!-- Claim Form -->
        <CForm @submit.prevent="submitClaim">
          <CRow class="g-4">
            <CCol :md="6">
              <CFormLabel for="subject" class="fw-bold">Subject</CFormLabel>
              <CFormInput
                id="subject"
                v-model="form.subject"
                placeholder="Enter the subject of your claim"
                required
                class="form-control-lg shadow-sm"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel for="description" class="fw-bold">Description</CFormLabel>
              <CFormTextarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Provide more details about your claim"
                required
                class="form-control-lg shadow-sm"
              />
            </CCol>
          </CRow>

          <CButton color="primary" type="submit" class="w-100 py-2 mt-4 shadow-sm fs-5">
            Submit Claim
          </CButton>
        </CForm>

        <hr class="my-5" />

        <!-- Claims List -->
        <div v-if="claims.length">
          <h5 class="mb-4 fw-bold text-primary">📂 Your Claim History</h5>
          <div class="claim-list">
            <CCard
              v-for="claim in claims"
              :key="claim.id"
              class="claim-card p-3 shadow-sm border-0 rounded-3"
            >
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-semibold text-dark">{{ claim.subject }}</h6>
                  <p class="mb-2 text-muted">{{ claim.description }}</p>
                  <small class="text-muted">👤 {{ claim.user?.name || 'Unknown User' }}</small>
                </div>
                <CButton
                  color="danger"
                  size="sm"
                  @click="deleteClaim(claim.id)"
                  class="px-3 shadow-sm"
                >
                  Delete
                </CButton>
              </div>
            </CCard>
          </div>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
} from '@coreui/vue'

const form = ref({
  subject: '',
  description: '',
  user_id: 1, // 🔒 Replace with the authenticated user's ID
})

const claims = ref([])

const fetchClaims = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/claims')
    claims.value = await res.json()
  } catch (error) {
    console.error('Error loading claims', error)
  }
}

const submitClaim = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/claims', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error('Error submitting the claim.')
    form.value.subject = ''
    form.value.description = ''
    await fetchClaims()
  } catch (error) {
    console.error('Error submitting claim', error)
  }
}

const deleteClaim = async (id) => {
  try {
    await fetch(`http://127.0.0.1:8000/api/claims/${id}`, {
      method: 'DELETE',
    })
    await fetchClaims()
  } catch (error) {
    console.error('Error deleting claim', error)
  }
}

onMounted(() => {
  fetchClaims()
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}

h5,
h6 {
  font-weight: 600;
}

.claim-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.claim-card {
  background-color: #fdfdfd;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.claim-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.08);
}

button:focus,
input:focus,
textarea:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}
</style>
