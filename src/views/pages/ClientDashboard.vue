<template>
    <div class="container py-4">
      <!-- Filters -->
      <CCard class="mb-4 shadow-sm">
        <CCardBody>
          <CRow class="gy-3">
            <CCol :md="3">
              <CFormLabel class="fw-bold">Skill</CFormLabel>
              <CFormSelect v-model="filters.skill" class="shadow-sm">
                <option value="">All Skills</option>
                <option v-for="skill in skillOptions" :key="skill" :value="skill">
                  {{ skill }}
                </option>
              </CFormSelect>
            </CCol>
  
            <CCol :md="3">
              <CFormLabel class="fw-bold">Experience</CFormLabel>
              <CFormSelect v-model="filters.experience" class="shadow-sm">
                <option value="">Any Level</option>
                <option>Junior</option>
                <option>Mid-level</option>
                <option>Senior</option>
              </CFormSelect>
            </CCol>
  
            <CCol :md="3">
              <CFormLabel class="fw-bold">Max Rate ($/hr)</CFormLabel>
              <CFormInput
                type="number"
                v-model="filters.rate"
                placeholder="e.g. 50"
                class="shadow-sm"
              />
            </CCol>
  
            <CCol :md="3" class="d-flex align-items-end">
              <CButton color="primary" class="w-100 shadow-sm" @click="applyFilters">
                Filter
              </CButton>
            </CCol>
          </CRow>
        </CCardBody>
      </CCard>
  
      <!-- Freelancers List -->
      <CRow>
        <CCol
          v-for="freelancer in filteredFreelancers"
          :key="freelancer.id"
          :md="4"
          class="mb-4"
        >
          <CCard class="h-100 shadow-sm hover-card">
            <CCardBody>
              <h5 class="fw-bold mb-1">{{ freelancer.name }}</h5>
              <p class="text-muted mb-2">{{ freelancer.skill }}</p>
              <p class="mb-1">
                Experience: <strong>{{ freelancer.experience }}</strong>
              </p>
              <p class="mb-3">
                Rate: <strong>${{ freelancer.rate }}/hr</strong>
              </p>
              <CButton color="success" class="w-100">Send Offer</CButton>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
  
      <!-- No results message -->
      <div v-if="filteredFreelancers.length === 0" class="text-center mt-5 text-muted">
        <p>No freelancers match your criteria.</p>
      </div>
    </div>
  </template>
  
  <script setup>
  import {
    CCard,
    CCardBody,
    CButton,
    CFormInput,
    CFormSelect,
    CFormLabel,
    CRow,
    CCol,
  } from '@coreui/vue'
  import { ref, computed } from 'vue'
  
  // Filters state
  const filters = ref({
    skill: '',
    experience: '',
    rate: null,
  })
  
  // Skill options
  const skillOptions = [
    'Web Developer',
    'Graphic Designer',
    'Mobile Developer',
    'Writer',
    'Data Analyst',
  ]
  
  // Example freelancers
  const freelancers = ref([
    { id: 1, name: 'John Doe', skill: 'Web Developer', experience: 'Senior', rate: 50 },
    { id: 2, name: 'Lisa Smith', skill: 'Graphic Designer', experience: 'Mid-level', rate: 35 },
    { id: 3, name: 'Ahmed Ali', skill: 'Mobile Developer', experience: 'Junior', rate: 25 },
    { id: 4, name: 'Sara Johnson', skill: 'Writer', experience: 'Senior', rate: 45 },
    { id: 5, name: 'Marc Dupont', skill: 'Data Analyst', experience: 'Mid-level', rate: 40 },
  ])
  
  // Filtered freelancers
  const filteredFreelancers = computed(() => {
    return freelancers.value.filter((f) => {
      return (
        (!filters.value.skill || f.skill === filters.value.skill) &&
        (!filters.value.experience || f.experience === filters.value.experience) &&
        (!filters.value.rate || f.rate <= filters.value.rate)
      )
    })
  })
  
  const applyFilters = () => {
    // Computed will auto update the list
  }
  </script>
  
  <style scoped>
  .container {
    max-width: 1200px;
    margin: auto;
  }
  
  .hover-card:hover {
    transform: translateY(-5px);
    transition: 0.3s ease;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .fw-bold {
    font-weight: 600;
  }
  
  .text-muted {
    color: #6c757d;
  }
  </style>
  