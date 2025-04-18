<template>
  <div class="profile-container" :style="backgroundStyle">
    <CCard class="profile-card">
      <CCardBody>
        <CRow class="align-items-center">
          <!-- Profile Photo Column -->
          <CCol lg="5" class="text-center">
            <div class="profile-photo-container">
              <div class="avatar-wrapper">
                <img :src="user.photo" alt="Profile Photo" class="profile-avatar" />
                <div class="change-photo-overlay" @click="editPhoto">
                  <CIcon name="cil-camera" size="xl" />
                  <span>Change Photo</span>
                </div>
              </div>
            </div>
          </CCol>

          <!-- Information Column -->
          <CCol lg="7">
            <div class="profile-info-section">
              <h4 class="profile-section-title">
                <CIcon name="cil-user" class="me-2" /> Professional Information
              </h4>
              
              <div class="profile-info-grid">
                <div class="info-label">First Name:</div>
                <div class="info-value">{{ user.firstName }}</div>
                
                <div class="info-label">Last Name:</div>
                <div class="info-value">{{ user.lastName }}</div>
                
                <div class="info-label">Email:</div>
                <div class="info-value">
                  <a :href="`mailto:${user.email}`">
                    <CIcon name="cil-envelope-open" class="me-2" />{{ user.email }}
                  </a>
                </div>
                
                <div class="info-label">Skills:</div>
                <div class="info-value">{{ user.skills }}</div>
                
                <div class="info-label">Hourly Rate:</div>
                <div class="info-value">${{ user.rate }}/hr</div>
                
                <div class="info-label">Experience:</div>
                <div class="info-value">{{ user.experience }} years</div>
                
                <div class="info-label">Portfolio:</div>
                <div class="info-value">{{ user.portfolio }}</div>
              </div>
              
              <CButton color="primary" class="mt-4 edit-btn" @click="editProfile">
                <CIcon name="cil-pencil" class="me-2" /> Edit Profile
              </CButton>
            </div>
          </CCol>
        </CRow>
      </CCardBody>

      <!-- Edit Profile Modal -->
      <CModal :visible="showEditModal" @close="closeModal" size="lg">
        <CModalHeader>
          <CModalTitle>Edit Profile</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="6" class="text-center">
              <div class="avatar-wrapper mb-4">
                <img :src="editUser.photo" alt="Profile Preview" class="profile-avatar" />
              </div>
              <CButton color="secondary" @click="editPhoto" class="w-100">
                <CIcon name="cil-camera" class="me-2" /> Change Photo
              </CButton>
            </CCol>
            <CCol md="6">
              <CForm>
                <div class="mb-3">
                  <CFormLabel>First Name</CFormLabel>
                  <CFormInput v-model="editUser.firstName" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Last Name</CFormLabel>
                  <CFormInput v-model="editUser.lastName" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Email</CFormLabel>
                  <CFormInput v-model="editUser.email" type="email" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Skills</CFormLabel>
                  <CFormInput v-model="editUser.skills" placeholder="e.g. Vue.js, UI/UX Design" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Hourly Rate ($)</CFormLabel>
                  <CFormInput v-model="editUser.rate" type="number" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Experience (years)</CFormLabel>
                  <CFormInput v-model="editUser.experience" type="number" />
                </div>
                <div class="mb-3">
                  <CFormLabel>Portfolio</CFormLabel>
                  <CFormInput v-model="editUser.portfolio" placeholder="Your portfolio name" />
                </div>
              </CForm>
            </CCol>
          </CRow>
        </CModalBody>
        <CModalFooter>
          <CButton color="secondary" @click="closeModal">Cancel</CButton>
          <CButton color="primary" @click="saveProfile">Save Changes</CButton>
        </CModalFooter>
      </CModal>

      <!-- Change Photo Modal -->
      <CModal :visible="showPhotoModal" @close="closePhotoModal" size="lg">
        <CModalHeader>
          <CModalTitle>Change Profile Photo</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <CRow>
            <CCol md="6" class="text-center">
              <div class="avatar-wrapper mb-4">
                <img :src="previewPhoto || user.photo" alt="Preview" class="profile-avatar" />
              </div>
              <CFormInput type="file" accept="image/*" @change="handlePhotoUpload" class="mb-3" />
              <CButton color="primary" @click="savePhoto" class="w-100" :disabled="!previewPhoto">
                Save Photo
              </CButton>
            </CCol>
            <CCol md="6" class="d-flex align-items-center">
              <div>
                <h5>Photo Guidelines</h5>
                <ul class="photo-tips">
                  <li><CIcon name="cil-check" /> Use high-quality images</li>
                  <li><CIcon name="cil-check" /> Face should be clearly visible</li>
                  <li><CIcon name="cil-check" /> Square images work best</li>
                  <li><CIcon name="cil-check" /> Max file size: 5MB</li>
                </ul>
                <div class="sample-photos">
                  <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Good example" />
                  <img src="https://images.unsplash.com/photo-1554151228-14d9def656e4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&q=80" alt="Good example" />
                </div>
              </div>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </CCard>
  </div>
</template>

<!-- <script>
import { ref, computed } from 'vue'

export default {
  name: 'UserProfile',
  setup() {
    // High-quality profile photo
    const profilePhoto = 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&q=80'
    
     const user = ref({
      firstName: 'Ming',
      lastName: 'Tang',
      email: 'mtng@gmail.com',
      skills: 'Vue.js, UI/UX Design, JavaScript, CSS',
      rate: 75,
      experience: 5,
      portfolio: 'mingtang-portfolio',
      photo: profilePhoto
    }) 
    const user = ref(null)
    const fetchUserData = async () => {
      try {
        const response = await axios.get('https://your-api.com/api/user-profile/2') 
        user.value = response.data
      } catch (error) {
        console.error('Failed to fetch user data:', error)
      }
    }
        onMounted(() => {
      fetchUserData()
    })


    const showEditModal = ref(false)
    const showPhotoModal = ref(false)
    const previewPhoto = ref(null)
    const editUser = ref({})
    const newPhoto = ref(null)

    const backgroundStyle = computed(() => ({
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url('https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1470&q=80')`,
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed',
      minHeight: '100vh',
      padding: '2rem'
    }))

    const editProfile = () => {
      editUser.value = { ...user.value }
      showEditModal.value = true
    }

    const editPhoto = () => {
      showPhotoModal.value = true
      showEditModal.value = false
    }

    const closeModal = () => {
      showEditModal.value = false
    }

    const closePhotoModal = () => {
      showPhotoModal.value = false
      previewPhoto.value = null
    }

    const saveProfile = () => {
      user.value = { ...editUser.value }
      closeModal()
    }

    const handlePhotoUpload = (event) => {
      const file = event.target.files[0]
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('File size should be less than 5MB')
          return
        }
        const reader = new FileReader()
        reader.onload = (e) => {
          previewPhoto.value = e.target.result
          newPhoto.value = file
        }
        reader.readAsDataURL(file)
      }
    }

    const savePhoto = () => {
      if (previewPhoto.value) {
        user.value.photo = previewPhoto.value
        if (showEditModal.value) {
          editUser.value.photo = previewPhoto.value
        }
      }
      closePhotoModal()
      if (!showEditModal.value) {
        showEditModal.value = true
      }
    }

    return {
      user,
      showEditModal,
      showPhotoModal,
      previewPhoto,
      editUser,
      backgroundStyle,
      editProfile,
      editPhoto,
      closeModal,
      closePhotoModal,
      saveProfile,
      handlePhotoUpload,
      savePhoto
    }
  }
}
</script> -->
<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useAuthStore } from '@/stores/authStore'
// Main user data
const user = ref({
  firstName: '',
  lastName: '',
  email: '',
  skills: '',
  rate: 0,
  experience: 0,
  portfolio: '',
  photo: ''
})


const editUser = ref({ ...user.value })
const previewPhoto = ref(null)
const showEditModal = ref(false)
const showPhotoModal = ref(false)

const backgroundStyle = {
  background: '#f7f7f7',
  padding: '2rem'
}
const authStore = useAuthStore()
// API call to fetch user data
const fetchUserData = async () => {
  try {
    const token = authStore.token 
    const response = await axios.get('http://127.0.0.1:8000/api/profile/1', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    user.value = response.data
    editUser.value = { ...response.data }
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

// Photo Modal Handlers
const editPhoto = () => {
  showPhotoModal.value = true
}

const handlePhotoUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      previewPhoto.value = reader.result
    }
    reader.readAsDataURL(file)
  }
}

const savePhoto = () => {
  if (previewPhoto.value) {
    user.value.photo = previewPhoto.value
    showPhotoModal.value = false
    previewPhoto.value = null
  }
}

const closePhotoModal = () => {
  showPhotoModal.value = false
  previewPhoto.value = null
}

// Edit Modal Handlers
const editProfile = () => {
  editUser.value = { ...user.value }
  showEditModal.value = true
}

const closeModal = () => {
  showEditModal.value = false
}

const saveProfile = () => {
  user.value = { ...editUser.value }
  showEditModal.value = false
}

// Fetch data when component mounts
onMounted(() => {
  fetchUserData()
})
</script>
<style scoped>
/* Your existing styles remain unchanged */
.profile-container {
  padding: 2rem;
  background-size: cover;
  background-position: center;
  background-attachment: fixed;
  min-height: 100vh;
}

.profile-card {
  border-radius: 18px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.2);
  border: none;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.95);
  max-width: 1200px;
  margin: 0 auto;
  backdrop-filter: blur(5px);
}

.profile-photo-container {
  padding: 2rem;
  position: relative;
}

.avatar-wrapper {
  position: relative;
  width: 320px;
  height: 320px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.profile-avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.change-photo-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  color: white;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s ease;
  cursor: pointer;
}

.change-photo-overlay:hover {
  opacity: 1;
}

.change-photo-overlay span {
  margin-top: 10px;
  font-weight: 500;
}

.profile-info-section {
  padding: 3rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.05);
  height: 100%;
}

.profile-section-title {
  color: #2c3e50;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #f1f3f5;
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 1.5rem;
}

.profile-info-grid {
  display: grid;
  grid-template-columns: 140px 1fr;
  gap: 1.5rem;
  align-items: start;
}

.info-label {
  font-weight: 600;
  color: #495057;
  padding: 0.8rem 0;
  font-size: 1.1rem;
}

.info-value {
  padding: 0.8rem 1.2rem;
  background-color: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;
  color: #495057;
  font-size: 1.1rem;
}

.edit-btn {
  border-radius: 12px;
  padding: 0.8rem 2.2rem;
  font-weight: 500;
  transition: all 0.3s ease;
  font-size: 1.1rem;
  box-shadow: 0 4px 12px rgba(50, 31, 219, 0.2);
}

.edit-btn:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 16px rgba(50, 31, 219, 0.3);
}

a {
  color: #321fdb;
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
}

a:hover {
  color: #1a1491;
  text-decoration: underline;
}

.photo-tips {
  list-style: none;
  padding-left: 0;
}

.photo-tips li {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
}

.photo-tips .c-icon {
  margin-right: 10px;
  color: #2eb85c;
}

.sample-photos {
  display: flex;
  gap: 15px;
  margin-top: 20px;
}

.sample-photos img {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #e9ecef;
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .avatar-wrapper {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 768px) {
  .profile-card {
    border-radius: 12px;
  }
  
  .avatar-wrapper {
    width: 240px;
    height: 240px;
  }
  
  .profile-info-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
  
  .info-label {
    padding: 0.5rem 0 0.2rem;
  }
  
  .profile-info-section,
  .profile-photo-container {
    padding: 1.5rem;
  }
}

@media (max-width: 576px) {
  .avatar-wrapper {
    width: 200px;
    height: 200px;
  }
  
  .profile-container {
    padding: 1rem;
  }
}
</style>