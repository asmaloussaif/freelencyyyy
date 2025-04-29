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
            <CImage
              :src="freelancer.photo"
              fluid
              class="profile-photo mb-3"
              alt="Freelancer Photo"
            />

            <h5 class="name">{{ freelancer.name }}</h5>
            <p class="title">{{ freelancer.title }}</p>
            <CBadge color="primary" class="rate-badge">💰 {{ freelancer.rate }} TND/h</CBadge>

            <!-- Affichage de la note -->
            <div class="rating">
              <span v-for="star in 5" :key="star" class="star" :class="{'filled': star <= freelancer.rating}">
                ★
              </span>
            </div>
          </CCol>

          <!-- Colonne droite -->
          <CCol md="8">
            <section class="profile-section">
              <h6>🧠 Skills</h6>
              <div class="mb-3">
                <CBadge
                  v-for="skill in freelancer.skills"
                  :key="skill"
                  color="info"
                  class="me-1 mb-1"
                >
                  {{ skill }}
                </CBadge>
              </div>
            </section>

            <section class="profile-section">
              <h6>💼 Experience</h6>
              <ul>
                <li v-for="exp in freelancer.experience" :key="exp">{{ exp }}</li>
              </ul>
            </section>

            <section class="profile-section">
              <h6>🖼️ Portfolio</h6>
              <ul>
                <li v-for="item in freelancer.portfolio" :key="item.title">
                  <strong>{{ item.title }}</strong> - 
                  <a :href="item.link" target="_blank" class="link">View</a>
                </li>
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
          <CFormInput v-model="edited.name" label="Name" class="mb-3" />
          <CFormInput v-model="edited.title" label="Title" class="mb-3" />
          <CFormInput v-model="edited.rate" label="Rate (TND/h)" type="number" class="mb-3" />
          <CFormTextarea v-model="skillsInput" label="Skills (comma-separated)" class="mb-3" />

          <!-- Input changement de photo -->
          <CFormInput type="file" accept="image/*" label="Change Photo" @change="onPhotoSelected" />
        </CForm>
      </CModalBody>
      <CModalFooter>
        <CButton color="primary" @click="saveChanges">Save</CButton>
        <CButton color="secondary" @click="visible = false">Cancel</CButton>
      </CModalFooter>
    </CModal>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const visible = ref(false)
const skillsInput = ref('')

const freelancer = ref({
  name: 'Sarah Lee',
  title: 'Full Stack Developer',
  photo: 'https://via.placeholder.com/150',
  rate: 35,
  rating: 4,  // Assuming the rating is out of 5
  skills: ['Vue.js', 'Laravel', 'Tailwind CSS', 'Docker'],
  experience: ['3 years at DevTech Solutions', 'Freelance projects on Upwork and Fiverr'],
  portfolio: [
    { title: 'E-commerce App', link: 'https://project1.example.com' },
    { title: 'Portfolio Website', link: 'https://project2.example.com' },
  ],
})

const edited = ref({ ...freelancer.value })

function openModal() {
  edited.value = { ...freelancer.value }
  skillsInput.value = freelancer.value.skills.join(', ')
  visible.value = true
}

function saveChanges() {
  freelancer.value = {
    ...edited.value,
    skills: skillsInput.value.split(',').map(s => s.trim()),
  }
  visible.value = false
}

function onPhotoSelected(event) {
  const file = event.target.files[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = () => {
      edited.value.photo = reader.result
    }
    reader.readAsDataURL(file)
  }
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
  background-color: #E1F0FF;
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
</style>
