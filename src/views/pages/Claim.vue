<template>
  <div class="container">
    <CCard class="mb-4 shadow-lg rounded">
      <CCardHeader class="bg-primary text-white">
        <strong>Claims</strong>
      </CCardHeader>
      <CCardBody class="p-4">
        <!-- Claim Form -->
        <CForm @submit.prevent="submitClaim">
          <CRow class="mb-3">
            <CCol :md="6">
              <CFormLabel for="subject" class="fw-bold">Subject</CFormLabel>
              <CFormInput
                id="subject"
                v-model="form.subject"
                placeholder="Claim subject"
                required
                class="shadow-sm"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel for="description" class="fw-bold">Description</CFormLabel>
              <CFormTextarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Describe your claim"
                required
                class="shadow-sm"
              />
            </CCol>
          </CRow>
          <CButton color="primary" type="submit" class="w-100 py-2 mt-3 shadow-sm">Submit</CButton>
        </CForm>

        <hr class="my-4" />

        <!-- Claims List -->
        <div v-if="claims.length">
          <h5 class="mb-3">Claims History</h5>
          <div class="claim-list">
            <CCard
              v-for="claim in claims"
              :key="claim.id"
              class="mb-3 p-3 shadow-sm rounded"
            >
              <div class="d-flex justify-content-between align-items-center">
                <div>
                  <h6 class="mb-1 text-dark">{{ claim.subject }}</h6>
                  <p class="mb-0 text-muted">{{ claim.description }}</p>
                  <small class="text-muted">By: {{ claim.user?.name || 'Unknown User' }}</small>
                </div>
                <CButton
                  color="danger"
                  size="sm"
                  @click="deleteClaim(claim.id)"
                  class="shadow-sm"
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
  user_id: 1, // 📝 Replace with the logged-in user's ID
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

CCardHeader {
  border-radius: 10px 10px 0 0;
}

.claim-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.claim-list .card {
  border: 1px solid #ddd;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.claim-list .card:hover {
  transform: scale(1.05);
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

CCard {
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

CCard:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
}

h5 {
  font-size: 1.25rem;
  font-weight: 600;
}

small {
  font-size: 0.875rem;
  color: #6c757d;
}

.text-muted {
  color: #6c757d;
}

button:focus,
input:focus,
textarea:focus {
  box-shadow: 0 0 0 0.2rem rgba(0, 123, 255, 0.25);
}

.shadow-sm {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.12), 0 1px 2px rgba(0, 0, 0, 0.24);
}

.fw-bold {
  font-weight: 700;
}
</style>
