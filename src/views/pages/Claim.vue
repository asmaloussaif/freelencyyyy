<template>
  <div class="container">
    <CCard class="mb-4 shadow rounded-4 overflow-hidden" style="border-color: #E2C3FF;">
      <CCardHeader class="py-3 px-4" style="background: linear-gradient(to right, #6E3FB4, #8A4EBF); color: white;">
        <h4 class="mb-0 fw-semibold">📝 Submit a Claim</h4>
      </CCardHeader>

      <CCardBody class="p-4">
        <!-- Claim Form -->
        <CForm @submit.prevent="submitClaim">
          <CRow class="g-4">
            <CCol :md="6">
              <CFormLabel for="subject" class="fw-bold" style="color: #4A2C7A;">Subject</CFormLabel>
              <CFormInput
                id="subject"
                v-model="form.subject"
                placeholder="Enter the subject of your claim"
                required
                class="form-control-lg shadow-sm"
                style="border-color: #E2C3FF; background-color: #F5E9FF;"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel for="description" class="fw-bold" style="color: #4A2C7A;">Description</CFormLabel>
              <CFormTextarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Provide more details about your claim"
                required
                class="form-control-lg shadow-sm"
                style="border-color: #E2C3FF; background-color: #F5E9FF;"
              />
            </CCol>
          </CRow>

          <CButton 
            type="submit" 
            class="w-100 py-2 mt-4 shadow-sm fs-5"
            style="background-color: #5E2B97; border-color: #5E2B97;"
          >
            Submit Claim
          </CButton>
        </CForm>

        <hr class="my-5" style="border-color: #E2C3FF;" />

        <!-- Claims List -->
        <div v-if="claims.length">
          <h5 class="mb-4 fw-bold" style="color: #5E2B97;">📂 Your Claim History</h5>
          <div class="claim-list">
            <CCard
              v-for="claim in claims"
              :key="claim.id"
              class="claim-card p-3 shadow-sm rounded-3"
              style="border: 1px solid #E2C3FF;"
            >
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-semibold" style="color: #4A2C7A;">{{ claim.subject }}</h6>
                  <p class="mb-2" style="color: #6E3FB4;">{{ claim.description }}</p>
                  <small style="color: #8A4EBF;">👤 {{ claim.user?.name || 'Unknown User' }}</small>
                </div>
                <CButton
                  color="danger"
                  size="sm"
                  @click="deleteClaim(claim.id)"
                  class="px-3 shadow-sm"
                  style="background-color: #8A4EBF; border-color: #8A4EBF;"
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

.claim-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.claim-card {
  background-color: #FDFCFF;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.claim-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(151, 96, 208, 0.15);
  border-color: #8A4EBF !important;
}

button:focus,
input:focus,
textarea:focus {
  box-shadow: 0 0 0 0.2rem rgba(110, 63, 180, 0.25) !important;
  border-color: #8A4EBF !important;
}

::placeholder {
  color: #A78BC9 !important;
  opacity: 1;
}
</style>