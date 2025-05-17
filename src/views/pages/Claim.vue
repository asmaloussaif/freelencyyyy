<template>
  <div class="container">
    <CCard class="mb-4 shadow rounded-4 overflow-hidden" style="border-color: #0f2573">
      <CCardHeader
        class="py-3 px-4"
        style="background: linear-gradient(to right, #0f2573, #266ca9); color: white"
      >
        <h4 class="mb-0 fw-semibold">📝 Submit a Claim</h4>
      </CCardHeader>

      <CCardBody class="p-4">
        <!-- Claim Form -->
        <CForm @submit.prevent="submitClaim">
          <CRow class="g-4">
            <CCol :md="6">
              <CFormLabel for="subject" class="fw-bold" style="color: #0f2573">Subject</CFormLabel>
              <CFormInput
                id="subject"
                v-model="form.sujet"
                placeholder="Enter the subject of your claim"
                required
                class="form-control-lg shadow-sm"
                style="border-color: #5e548e; background-color: #f0f8ff"
              />
            </CCol>
            <CCol :md="6">
              <CFormLabel for="description" class="fw-bold" style="color: #0f2573"
                >Description</CFormLabel
              >
              <CFormTextarea
                id="description"
                v-model="form.description"
                rows="3"
                placeholder="Provide more details about your claim"
                required
                class="form-control-lg shadow-sm"
                style="border-color: #5e548e; background-color: #f0f8ff"
              />
            </CCol>
          </CRow>

          <CButton
            type="submit"
            class="w-100 py-2 mt-4 shadow-sm fs-5"
            style="background-color:#238ae4  ; border-color: #a8d8ff"
          >
            Submit Claim
          </CButton>
            <CButton
    type="button"
    @click="cancelClaim"
    class="w-100 py-2 mt-2 shadow-sm fs-5"
    style="background-color:#100f65 ; border-color: #adb5bd; color: white"
  >
    Cancel
  </CButton>
        </CForm>

        <hr class="my-5" style="border-color: #5e548e" />

        <!-- Claims List -->
        <div v-if="claims.length">
          <h5 class="mb-4 fw-bold" style="color: #0f2573">📂 Your Claim History</h5>
          <div class="claim-list">
            <CCard
              v-for="claim in claims"
              :key="claim.id"
              class="claim-card p-3 shadow-sm rounded-3"
              style="border: 1px solid #5e548e"
            >
              <div class="d-flex justify-content-between align-items-start flex-wrap gap-2">
                <div class="flex-grow-1">
                  <h6 class="mb-1 fw-semibold" style="color: #0f2573">{{ claim.subject }}</h6>
                  <p class="mb-2" style="color: #266ca9">{{ claim.description }}</p>
                  <small style="color: #266ca9">👤 {{ claim.user?.name || 'Unknown User' }}</small>
                </div>
                <CButton
                  color="danger"
                  size="sm"
                  @click="deleteClaim(claim.id)"
                  class="px-3 shadow-sm"
                  style="background-color: #266ca9; border-color: #266ca9"
                >
                  Delete
                </CButton>
              </div>
            </CCard>
          </div>
        </div>
      </CCardBody>
      <CToaster placement="top-end">
        <CToast
          v-if="showToast"
          :color="toastColor"
          :autohide="true"
          :visible="true"
          @hidden="showToast = false"
        >
          <CToastHeader closeButton>
            <strong class="me-auto">Notification</strong>
          </CToastHeader>
          <CToastBody>{{ toastMessage }}</CToastBody>
        </CToast>
      </CToaster>
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
import axios from 'axios'
import { CToast, CToastBody, CToaster } from '@coreui/vue'
import { useAuthStore } from '@/stores/authStore'
const toastMessage = ref('')
const showToast = ref(false)
const toastColor = ref('success')
const authStore = useAuthStore()

const form = ref({
  sujet: '',
  description: '',
  user_id: authStore.user.id,
  statut:'pending'
})

const claims = ref([])


const submitClaim = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/api/reclamations', form.value, {
      headers: {
        Authorization: `Bearer ${authStore.token}`,
        'Content-Type': 'application/json',
      },
    })

    form.value = {
      sujet: '',
      description: '',
      user_id: authStore.user.id,
      statut:'pending'
    }

    toastMessage.value = 'Reclamation submitted successfully!'
    toastColor.value = 'success'
    showToast.value = true
  } catch (error) {
    console.error('Error submitting claim:', error)

    toastMessage.value = 'Failed to submit the claim.'
    toastColor.value = 'danger'
    showToast.value = true
  }
}
const cancelClaim = () => {
  form.value.sujet = ''
  form.value.description = ''
}


onMounted(() => {

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
  background-color: #f8fbfe;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.claim-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(15, 37, 115, 0.15);
  border-color: #100f65 !important;
}

button:focus,
input:focus,
textarea:focus {
  box-shadow: 0 0 0 0.2rem rgba(68, 154, 228, 0.881) !important;
  border-color: #238ae4 !important;
}

::placeholder {
  color: #2146b4 !important;
  opacity: 1;
}
</style>
