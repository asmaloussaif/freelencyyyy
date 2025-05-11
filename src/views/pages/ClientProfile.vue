<template>
  <div class="profile-wrapper">
    <h2 class="page-title">👤 Client Profile</h2>

    <CCard class="profile-card position-relative">
      <CButton
        color="dark"
        variant="outline"
        class="modify-btn position-absolute"
        @click="openEditProfileModal"
      >
        ✏️ Modify Profile
      </CButton>

      <CCardBody>
        <CRow>
          <!-- Left Column -->
          <CCol md="4" class="text-center d-flex flex-column align-items-center">
            <CAvatar size="l" src="/src/assets/images/user.jpg" class="custom-avatar" />
            <h5 class="name">{{ profile.first_name }} {{ profile.last_name }}</h5>
            <p class="title">{{ profile.entreprise }}</p>
            <CBadge color="primary" class="rate-badge">⭐ {{ profile.note }}/5</CBadge>

            <div class="rating mt-2">
              <span v-for="star in 5" :key="star" class="star" :class="{ filled: star <= profile.note }">★</span>
            </div>
          </CCol>

          <!-- Right Column -->
          <CCol md="8">
            <section class="profile-section">
              <h6>🏢 Company Description</h6>
              <p>{{ profile.description_entreprise || 'No description provided' }}</p>
            </section>

            <section class="profile-section">
              <h6>📌 Client Needs</h6>
              <p>{{ profile.besoins || 'No needs specified' }}</p>
            </section>

            <section class="profile-section">
              <h6>📧 Email</h6>
              <p>{{ profile.email }}</p>
            </section>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>

    <!-- Edit Modal -->
    <CModal :visible="isModalVisible" @close="closeModal">
      <CModalHeader>
        <CModalTitle>Edit Profile</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput v-model="editedProfile.first_name" label="First Name" class="mb-3" />
          <CFormInput v-model="editedProfile.last_name" label="Last Name" class="mb-3" />
          <CFormInput v-model="editedProfile.email" label="Email" class="mb-3" />
          <CFormInput v-model="editedProfile.entreprise" label="Company Name" class="mb-3" />
          <CFormTextarea v-model="editedProfile.description_entreprise" label="Company Description" class="mb-3" />
          <CFormTextarea v-model="editedProfile.besoins" label="Client Needs" class="mb-3" />
          <CFormInput v-model="editedProfile.note" label="Rating" type="number" class="mb-3" />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Cancel</CButton>
        <CButton color="primary" @click="saveChanges">Save Changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>


<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'

const isModalVisible = ref(false)
const authStore = useAuthStore()
const userId = authStore.user.id

const profile = ref({
  first_name: '',
  last_name: '',
  email: '',
  entreprise: '',
  description_entreprise: '',
  besoins: '',
  note: '',
})

const editedProfile = ref({ ...profile.value })

const fetchProfile = async () => {
  try {
    const res = await axios.get(`http://localhost:8000/api/client-profile/${userId}`, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    profile.value = res.data
  } catch (err) {
    console.error('Error fetching profile:', err)
  }
}

const openEditProfileModal = () => {
  editedProfile.value = { ...profile.value }
  isModalVisible.value = true
}

const closeModal = () => {
  isModalVisible.value = false
}

const saveChanges = async () => {
  try {
    const res = await axios.put(`http://localhost:8000/api/client-profile/${userId}`, editedProfile.value, {
      headers: { Authorization: `Bearer ${authStore.token}` },
    })
    profile.value = { ...editedProfile.value }
    isModalVisible.value = false
  } catch (err) {
    console.error('Error updating client profile:', err)
  }
}

onMounted(() => {
  fetchProfile()
})
</script>


<style scoped>
.profile-wrapper {
  background-color: #F8FAFF;
  padding: 2rem;
}

.page-title {
  font-size: 1.8rem;
  font-weight: bold;
  color: #0F2573;
  margin-bottom: 1rem;
}

.profile-card {
  background-color: white;
  border: none;
  border-radius: 1rem;
  box-shadow: 0 4px 12px rgba(15, 37, 115, 0.1);
  transition: all 0.3s ease;
  position: relative;
}

.modify-btn {
  top: 1rem;
  right: 1rem;
  z-index: 10;
  padding: 0.4rem 1rem;
  border-radius: 0.8rem;
  font-size: 0.9rem;
}

.profile-photo {
  border-radius: 50%;
  width: 120px;
  height: 120px;
  object-fit: cover;
  border: 3px solid #0F2573;
}

.name {
  color: #0F2573;
  font-weight: 600;
}

.title {
  color: #5E548E;
  font-size: 0.95rem;
}

.rate-badge {
  background-color: #0F2573;
  color: white;
  font-size: 0.85rem;
  padding: 0.4rem 0.6rem;
  border-radius: 0.6rem;
}

.rating {
  margin-top: 1rem;
}

.star {
  font-size: 1.5rem;
  color: #B0B0B0;
  margin-right: 0.2rem;
}

.star.filled {
  color: #FFD700;
}

.profile-section {
  margin-bottom: 1.5rem;
}

.link {
  color: #0F2573;
  text-decoration: underline;
}
.custom-avatar {
  width: 150px;     
  height: 150px;
  display: contents;    
  margin-top: 20px;   
}
</style>
