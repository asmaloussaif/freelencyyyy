<template>
  <div class="client-profile">
    <!-- Titre du Profil -->
    <h2 class="page-title">👤 Client Profile</h2>

    <!-- Section des informations client -->
    <CCard class="profile-card">
      <CCardHeader>
        <h5 class="section-title">Client Information</h5>
      </CCardHeader>
      <CCardBody>
        <CRow>
          <CCol md="4">
            <!-- Photo de Profil -->
            <CAvatar size="l" src="/src/assets/images/user.jpg" class="custom-avatar" />
            <CButton color="primary" class="mt-3" @click="openEditProfileModal" style="margin-left: 100px;"
              >Modify Profile</CButton
            >
          </CCol>
          <CCol md="8">
            <div class="mb-3">
              <CFormLabel for="entreprise">Company Name</CFormLabel>
              <CFormInput
                id="entreprise"
                v-model="profile.entreprise"
                placeholder="Enter your company name"
                disabled
              />
            </div>
            <div class="mb-3">
              <CFormLabel for="description-entreprise">Company Description</CFormLabel>
              <CFormTextarea
                id="description-entreprise"
                v-model="profile.description_entreprise"
                rows="5"
                placeholder="Enter a description of your company"
                disabled
              />
            </div>
            <div class="mb-3">
              <CFormLabel for="besoins">Client Needs</CFormLabel>
              <CFormTextarea
                id="besoins"
                v-model="profile.besoins"
                rows="5"
                placeholder="Enter your needs"
                disabled
              />
            </div>
            <div class="mb-3">
              <CFormLabel for="note">Company Rating</CFormLabel>
              <CFormInput
                id="note"
                v-model="profile.note"
                placeholder="Company rating (out of 5)"
                disabled
              />
            </div>
          </CCol>
          
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Modal pour modifier le profil -->
    <CModal v-model:visible="isModalVisible" size="lg">
      <CModalHeader close-button>
        <CModalTitle>Edit Profile</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div class="mb-3">
          <CFormLabel for="editCompanyName">Company Name</CFormLabel>
          <CFormInput
            id="editCompanyName"
            v-model="editedProfile.entreprise"
            placeholder="Enter your company name"
          />
        </div>
        <div class="mb-3">
          <CFormLabel for="editCompanyDescription">Company Description</CFormLabel>
          <CFormTextarea
            id="editCompanyDescription"
            v-model="editedProfile.description_entreprise"
            rows="5"
            placeholder="Enter a description of your company"
          />
        </div>
        <div class="mb-3">
          <CFormLabel for="editNeeds">Client Needs</CFormLabel>
          <CFormTextarea
            id="editNeeds"
            v-model="editedProfile.besoins"
            rows="5"
            placeholder="Enter your needs"
          />
        </div>
        <div class="mb-3">
          <CFormLabel for="editRating">Company Rating</CFormLabel>
          <CFormInput
            id="editRating"
            v-model="editedProfile.note"
            placeholder="Company rating (out of 5)"
          />
        </div>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Cancel</CButton>
        <CButton color="primary" @click="updateProfile">Save Changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import {
  CAvatar,
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
} from '@coreui/vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'

const profile = ref({
    id:'',
    entreprise: '',
    description_entreprise: '',
    besoins: '',
  note: '',
})

const editedProfile = ref({ ...profile.value })
const isModalVisible = ref(false)

function openEditProfileModal() {
  console.log('Opening Modal with profile data:', profile.value) 
  editedProfile.value = { ...profile.value } 
  isModalVisible.value = true
}

function closeModal() {
  isModalVisible.value = false
}
const updateProfile = async (id) => {
  const token = authStore.token
  const profileId = profile.value.id 
  try {
    const res = await axios.put(`http://localhost:8000/api/profile/${profileId}`, editedProfile.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    profile.value = res.data
    isModalVisible.value = false // Ferme le modal si succès
    console.log('Profile updated successfully')
  } catch (error) {
    console.error('Error updating profile:', error.response?.data || error)
  }
}
const fetchProfile = async (id) => {
  const token = authStore.token

  try {
    const res = await axios.get(`http://localhost:8000/api/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    profile.value = res.data
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

const authStore = useAuthStore()
  
const userId = authStore.user.id

console.log('log',userId)
   
onMounted(() => {
  fetchProfile(userId) // Replace with dynamic user ID if needed
})
</script>

<style scoped>
.client-profile {
  padding: 2rem;
}

.page-title {
  font-size: 2rem;
  font-weight: bold;
  color: #0f2573;
  margin-bottom: 1rem;
}

.profile-card {
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: 1.2rem;
  color: #5e548e;
  font-weight: 500;
}

.c-button {
  font-size: 0.9rem;
  padding: 0.5rem 1rem;
  border-radius: 0.8rem;
  margin-top: 1rem;
}

.c-avatar {
  margin-bottom: 1rem;
}

.c-modal-title {
  font-size: 1.5rem;
  color: #0f2573;
}

.c-input,
.c-textarea {
  margin-bottom: 1rem;
}
.custom-avatar {
  width: 150px;     
  height: 150px;
  display: contents;    
  margin-top: 20px;   
}
</style>
