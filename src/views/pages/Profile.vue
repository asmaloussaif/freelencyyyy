<template>
  <div class="profile-container" :style="backgroundStyle">
    <CCard class="profile-card">
      <CCardBody>
        <CRow class="align-items-center">
          <!-- Profile Photo Column -->
          <CCol lg="5" class="text-center">
            <CCard class="profile-photo-card mb-4">
              <CCardBody>
                <div class="avatar-wrapper">
                  <img :src="user.photo" alt="Profile Photo" class="profile-avatar" />
                  <div class="change-photo-overlay" @click="editPhoto">
                    <CIcon name="cil-camera" size="xl" />
                    <span>Change Photo</span>
                  </div>
                </div>
              </CCardBody>
            </CCard>
            
            <CCard class="stats-card">
              <CCardBody>
                <div class="profile-stats">
                  <div class="stat-item">
                    <div class="stat-value">{{ user.experience }}+</div>
                    <div class="stat-label">Years Experience</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">{{ completedProjects }}</div>
                    <div class="stat-label">Projects Done</div>
                  </div>
                  <div class="stat-item">
                    <div class="stat-value">${{ user.rate }}/hr</div>
                    <div class="stat-label">Hourly Rate</div>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>

          <!-- Information Column -->
          <CCol lg="7">
            <CCard class="info-card">
              <CCardBody>
                <div class="profile-info-section">
                  <h4 class="profile-section-title mb-4">
                    <CIcon name="cil-user" class="me-2" /> Professional Information
                  </h4>
                  
                  <CCard class="mb-3">
                    <CCardBody>
                      <div class="info-item">
                        <div class="info-label">Full Name:</div>
                        <div class="info-value">{{ user.firstName }} {{ user.lastName }}</div>
                      </div>
                    </CCardBody>
                  </CCard>
                  
                  <CCard class="mb-3">
                    <CCardBody>
                      <div class="info-item">
                        <div class="info-label">Email:</div>
                        <div class="info-value">
                          <a :href="`mailto:${user.email}`">
                            <CIcon name="cil-envelope-open" class="me-2" />{{ user.email }}
                          </a>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                  
                  <CCard class="mb-3">
                    <CCardBody>
                      <div class="info-item">
                        <div class="info-label">Skills:</div>
                        <div class="info-value">
                          <CBadge v-for="(skill, index) in user.skills.split(',')" 
                                  :key="index" 
                                  color="primary" 
                                  shape="rounded-pill" 
                                  class="me-2 mb-2">
                            {{ skill.trim() }}
                          </CBadge>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                  
                  <CCard class="mb-4">
                    <CCardBody>
                      <div class="info-item">
                        <div class="info-label">My Projects:</div>
                        <div class="info-value">
                          <div v-for="project in user.projects" :key="project.name" class="project-item">
                            <span class="project-name">{{ project.name }}</span>
                            <CBadge :color="project.status === 'Completed' ? 'success' : 'warning'">
                              {{ project.status }}
                            </CBadge>
                          </div>
                        </div>
                      </div>
                    </CCardBody>
                  </CCard>
                  
                  <div class="profile-actions">
                    <CButton color="primary" class="edit-btn" @click="editProfile">
                      <CIcon name="cil-pencil" class="me-2" /> Edit Profile
                    </CButton>
                    <CButton color="light" variant="outline" class="ms-3 download-btn">
                      <CIcon name="cil-cloud-download" class="me-2" /> Download CV
                    </CButton>
                  </div>
                </div>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CCardBody>

      <!-- Edit Profile Modal -->
      <CModal :visible="showEditModal" @close="closeModal" size="lg" backdrop="static">
        <CModalHeader closeButton>
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
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>First Name</CFormLabel>
                    <CFormInput v-model="editUser.firstName" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Last Name</CFormLabel>
                    <CFormInput v-model="editUser.lastName" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Email</CFormLabel>
                    <CFormInput v-model="editUser.email" type="email" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Skills (comma separated)</CFormLabel>
                    <CFormInput v-model="editUser.skills" placeholder="e.g. Vue.js, UI/UX Design, JavaScript" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Hourly Rate ($)</CFormLabel>
                    <CFormInput v-model="editUser.rate" type="number" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Experience (years)</CFormLabel>
                    <CFormInput v-model="editUser.experience" type="number" />
                  </CCardBody>
                </CCard>
                
                <CCard class="mb-3">
                  <CCardBody>
                    <CFormLabel>Projects</CFormLabel>
                    <div v-for="(project, index) in editUser.projects" :key="index" class="mb-2">
                      <CRow class="g-2">
                        <CCol sm="8">
                          <CFormInput v-model="project.name" placeholder="Project name" />
                        </CCol>
                        <CCol sm="4">
                          <CFormSelect v-model="project.status">
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                          </CFormSelect>
                        </CCol>
                      </CRow>
                    </div>
                    <CButton color="light" size="sm" @click="addProject">
                      <CIcon name="cil-plus" /> Add Project
                    </CButton>
                  </CCardBody>
                </CCard>
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
      <CModal :visible="showPhotoModal" @close="closePhotoModal" size="lg" backdrop="static">
        <CModalHeader closeButton>
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
              <CCard>
                <CCardBody>
                  <h5>Photo Guidelines</h5>
                  <ul class="photo-tips">
                    <li><CIcon name="cil-check" /> Use high-quality images</li>
                    <li><CIcon name="cil-check" /> Face should be clearly visible</li>
                    <li><CIcon name="cil-check" /> Square images work best</li>
                    <li><CIcon name="cil-check" /> Max file size: 5MB</li>
                  </ul>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
        </CModalBody>
      </CModal>
    </CCard>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/authStore'

// Main user data
const user = ref({
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  skills: 'Vue.js, UI/UX Design, JavaScript',
  rate: 85,
  experience: 5,
  photo: 'https://randomuser.me/api/portraits/men/32.jpg',
  projects: [
    { name: 'E-commerce Platform', status: 'Completed' },
    { name: 'Portfolio Website', status: 'Completed' },
    { name: 'Task Management App', status: 'In Progress' }
  ]
})

const editUser = ref(JSON.parse(JSON.stringify(user.value)))
const previewPhoto = ref(null)
const showEditModal = ref(false)
const showPhotoModal = ref(false)
const authStore = useAuthStore()

// Computed properties
const completedProjects = computed(() => {
  return user.value.projects.filter(p => p.status === 'Completed').length
})

const backgroundStyle = {
  background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
  padding: '2rem',
  minHeight: '100vh'
}

// API call to fetch user data
const fetchUserData = async () => {
  try {
    const token = authStore.token 
    const response = await axios.get('http://127.0.0.1:8000/api/profile/1', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    user.value = { ...user.value, ...response.data }
    editUser.value = JSON.parse(JSON.stringify(user.value))
  } catch (error) {
    console.error('Error fetching user data:', error)
  }
}

// Project management
const addProject = () => {
  editUser.value.projects.push({ name: '', status: 'In Progress' })
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
    editUser.value.photo = previewPhoto.value
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
  editUser.value = JSON.parse(JSON.stringify(user.value))
  showEditModal.value = true
}

const closeModal = () => {
  showEditModal.value = false
}

const saveProfile = () => {
  user.value = JSON.parse(JSON.stringify(editUser.value))
  showEditModal.value = false
}

// Fetch data when component mounts
onMounted(() => {
  fetchUserData()
})
</script>

<style scoped>
.profile-container {
  padding: 2rem;
  min-height: 100vh;
  background-color: #FAF5FF; /* Very light purple background */
}

.profile-card {
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(151, 96, 208, 0.12); /* Purple shadow */
  border: none;
  overflow: hidden;
  background: white;
  max-width: 1200px;
  margin: 0 auto;
}

.profile-photo-card,
.stats-card,
.info-card {
  border-radius: 12px;
  box-shadow: none;
  border: 1px solid #E2C3FF; /* Light purple border */
  margin-bottom: 1.5rem;
  background-color: #FDFCFF; /* Slightly off-white with purple tint */
}

.profile-photo-card {
  padding: 1rem;
}

.stats-card {
  padding: 1rem;
}

.info-card {
  padding: 2rem;
}

.avatar-wrapper {
  position: relative;
  width: 240px;
  height: 240px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 8px 25px rgba(151, 96, 208, 0.15); /* Purple shadow */
  transition: all 0.3s ease;
  border: 5px solid white;
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
  background: rgba(110, 63, 180, 0.7); /* Medium-dark purple overlay */
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
  font-size: 0.9rem;
}

.profile-stats {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
}

.stat-item {
  text-align: center;
  padding: 1rem;
  background: rgba(237, 231, 246, 0.7); /* Light purple background */
  border-radius: 10px;
  flex: 1;
}

.stat-value {
  font-size: 1.4rem;
  font-weight: 600;
  color: #6E3FB4; /* Medium-dark purple */
}

.stat-label {
  font-size: 0.85rem;
  color: #8A4EBF; /* Medium purple */
}

.profile-info-section {
  height: 100%;
}

.profile-section-title {
  color: #5E2B97; /* Deep purple */
  font-weight: 600;
  display: flex;
  align-items: center;
  font-size: 1.35rem;
}

.info-item {
  display: grid;
  grid-template-columns: 120px 1fr;
  gap: 1rem;
  align-items: center;
}

.info-label {
  font-weight: 600;
  color: #4A2C7A; /* Dark purple */
  font-size: 0.95rem;
}

.info-value {
  color: #6E3FB4; /* Medium-dark purple */
  font-size: 0.95rem;
}

.project-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.6rem 0;
  border-bottom: 1px dashed #E2C3FF; /* Light purple border */
}

.project-item:last-child {
  border-bottom: none;
}

.project-name {
  flex-grow: 1;
  font-size: 0.9rem;
  color: #4A2C7A; /* Dark purple */
}

.profile-actions {
  display: flex;
  gap: 1rem;
  margin-top: 2rem;
}

.edit-btn {
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(110, 63, 180, 0.15); /* Purple shadow */
  background-color: #6E3FB4; /* Medium-dark purple */
  color: white;
}

.edit-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(110, 63, 180, 0.25); /* Purple shadow */
  background-color: #5E2B97; /* Darker purple */
}

.download-btn {
  border-radius: 10px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  transition: all 0.3s ease;
  background-color: #F0D9FF; /* Light purple */
  color: #5E2B97; /* Deep purple */
}

.download-btn:hover {
  transform: translateY(-2px);
  background: #E2C3FF; /* Slightly darker light purple */
}

a {
  color: #6E3FB4; /* Medium-dark purple */
  text-decoration: none;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
}

a:hover {
  color: #5E2B97; /* Deep purple */
  text-decoration: underline;
}

.photo-tips {
  list-style: none;
  padding-left: 0;
  margin-bottom: 0;
}

.photo-tips li {
  margin-bottom: 0.8rem;
  display: flex;
  align-items: center;
  font-size: 0.95rem;
  color: #6E3FB4; /* Medium-dark purple */
}

.photo-tips .c-icon {
  margin-right: 10px;
  color: #8A4EBF; /* Medium purple */
}

/* Responsive adjustments */
@media (max-width: 992px) {
  .avatar-wrapper {
    width: 200px;
    height: 200px;
  }
  
  .profile-stats {
    gap: 0.8rem;
  }
  
  .stat-item {
    padding: 0.8rem;
  }
  
  .stat-value {
    font-size: 1.2rem;
  }
}

@media (max-width: 768px) {
  .profile-card {
    border-radius: 12px;
  }
  
  .avatar-wrapper {
    width: 180px;
    height: 180px;
  }
  
  .info-item {
    grid-template-columns: 1fr;
    gap: 0.5rem;
  }
  
  .profile-info-section,
  .profile-photo-card {
    padding: 1.25rem;
  }
  
  .profile-actions {
    flex-direction: column;
    gap: 0.8rem;
  }
  
  .edit-btn, .download-btn {
    width: 100%;
  }
}

@media (max-width: 576px) {
  .avatar-wrapper {
    width: 160px;
    height: 160px;
  }
  
  .profile-container {
    padding: 1rem;
  }
  
  .stat-value {
    font-size: 1.1rem;
  }
  
  .stat-label {
    font-size: 0.8rem;
  }
  
  .profile-section-title {
    font-size: 1.2rem;
  }
}
</style>