<template>
  <div class="profile-wrapper">
    <!-- Titre principal -->
    <h2 class="page-title">👤 Profile</h2>

    <CCard class="profile-card position-relative">
    <!-- Bouton Modifier -->
    <CButton
      color="dark"
      variant="outline"
      class="modify-btn position-absolute"
      @click="openModal"
    >
      ✏️ Modify Profile
    </CButton>

    <CCardBody>
      <CRow>
        <!-- Colonne gauche -->
        <CCol md="4" class="text-center d-flex flex-column align-items-center">
          <CAvatar size="l" src="/src/assets/images/user.jpg" class="custom-avatar" />

          <h5 class="name">{{ freelance.user.name || '' }} {{ freelance.user.lastName || '' }}</h5>
          <p class="title">{{ freelance.titre }}</p>
          <CBadge class="rate-badge">💰 {{ freelance.note }} TND/h</CBadge>

          <!-- Affichage de la note -->
          <div class="rating">
            <span v-for="star in 5" :key="star" class="star" :class="{ 'filled': star <= freelance.note }">
              ★
            </span>
          </div>
        </CCol>

        <!-- Colonne droite -->
        <CCol md="8">
          <!-- Skills -->
          <section class="profile-section">
            <h6>🧠 Skills</h6>
            <div class="mb-3">
              <CBadge
                v-for="(skill, index) in skillsList"
                :key="index"
                color="info"
                class="me-1 mb-1"
              >
                {{ skill }}
              </CBadge>
            </div>
          </section>

          <!-- Experience -->
          <section class="profile-section">
            <h6>💼 Experience</h6>
            <p>{{ freelance.experience || 'No experience provided' }}</p>
          </section>

          <!-- Portfolio -->
          <section class="profile-section">
            <h6>🖼️ Portfolio</h6>
            <ul>
              <li v-if="freelance.portfolio">
                <a :href="freelance.portfolio" target="_blank">{{ freelance.portfolio }}</a>
              </li>
              <li v-else>No portfolio provided</li>
            </ul>
          </section>
        </CCol>
      </CRow>
    </CCardBody>
  </CCard>

    <!-- Modal Modification -->
    <CModal :visible="visible" @close="visible = false">
      <CModalHeader>
        <CModalTitle>Modify Profile</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <CForm>
          <CFormInput v-model="editedProfile.titre" label="Title" class="mb-3" />
         
          <CFormTextarea v-model="skillsInput" label="Skills (comma-separated)" class="mb-3" />  
          <CFormInput v-model="editedProfile.portfolio" label="Portfolio Link "class="mb-3" /> 
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" @click="closeModal">Cancel</CButton>
        <CButton color="primary" @click="updateProfile">Save Changes</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
import { ref, onMounted } from 'vue'
import { defineComponent, computed, h, resolveComponent } from 'vue'
const visible = ref(false)
const skillsInput = ref('')

const freelance = ref({
  id: '',
  user_id: '',
  titre:'',
  competences: '',
  experience:'',
  portfolio: '',
  user: {}
})

function closeModal() {
  visible.value = false
}
const updateProfile = async () => {
  const token = authStore.token
  const profileId = freelance.value.id
  try {
    const res = await axios.put(`http://localhost:8000/api/profile/${profileId}`, editedProfile.value, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
    fetchProfile(userId) 
    visible.value = false
    console.log('Freelancer profile updated successfully')
  } catch (error) {
    console.error('Error updating freelance profile:', error.response?.data || error)
  }
}
const skillsList = computed(() => {
  return freelance.value.competences
    ? freelance.value.competences.split(',').map(skill => skill.trim())
    : []
})
const fetchProfile = async (id) => {
  const token = authStore.token

  try {
    const res = await axios.get(`http://localhost:8000/api/profile/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    freelance.value = res.data
    console.log(res.data)
  } catch (error) {
    console.error('Error fetching profile:', error)
  }
}

const authStore = useAuthStore()
  
const userId = authStore.user.id


   
onMounted(() => {
  fetchProfile(userId) 
})

const editedProfile = ref({ ...freelance.value })

function openModal() {
  editedProfile.value = { ...freelance.value }
  skillsInput.value = freelance.value.competences 
  visible.value = true
}
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
 background-color: rgb(53 153 255);
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
