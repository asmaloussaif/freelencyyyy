<template>
  <div class="container py-4">
    <!-- Project List -->
    <CCard class="mb-4 shadow-sm" style="border-color: #E2C3FF;">
      <CCardBody>
        <h4 class="fw-bold" style="color: #5E2B97;">Your Projects</h4>
        <CRow class="mt-3">
          <CCol
            v-for="project in projects"
            :key="project.id"
            :md="4"
            class="mb-4"
          >
            <CCard class="h-100 shadow-sm hover-card" style="border-color: #E2C3FF;">
              <CCardBody>
                <h5 class="fw-bold mb-1" style="color: #4A2C7A;">{{ project.name }}</h5>
                <p class="mb-1" style="color: #8A4EBF;">Date: {{ formatDate(project.date) }}</p>
                <p class="mb-2" style="color: #6E3FB4;">Budget: ${{ project.budget }}</p>
                <p class="mb-2" style="color: #6E3FB4;">
                  Status: <strong :style="{ color: getStatusColor(project.status) }">{{ project.status }}</strong>
                </p>
                <div v-if="project.status === 'In Progress' || project.status === 'Finished'">
                  <p class="mb-2" style="color: #6E3FB4;">
                    Freelancer: <strong>{{ project.freelancer.name || 'N/A' }}</strong>
                  </p>
                </div>
                <CButton
                  v-if="project.status === 'In Progress' || project.status === 'Finished'"
                  color="primary"
                  class="w-100 shadow-sm"
                  style="background-color: #6E3FB4; border-color: #6E3FB4;"
                >
                  View Project Details
                </CButton>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
        
        <!-- No projects message -->
        <div v-if="projects.length === 0" class="text-center mt-5" style="color: #8A4EBF;">
          <p>You don't have any projects yet.</p>
        </div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import {
  CCard,
  CCardBody,
  CButton,
  CRow,
  CCol,
} from '@coreui/vue'
import { ref, computed } from 'vue'

// Sample projects data (should be fetched from an API)
const projects = ref([
  {
    id: 1,
    name: 'E-commerce Website',
    date: '2025-04-15',
    budget: 2000,
    status: 'In Progress',
    freelancer: { name: 'John Doe' },
  },
  {
    id: 2,
    name: 'Mobile App Development',
    date: '2025-03-10',
    budget: 3000,
    status: 'Finished',
    freelancer: { name: 'Lisa Smith' },
  },
  {
    id: 3,
    name: 'SEO Optimization',
    date: '2025-01-20',
    budget: 1500,
    status: 'Pending',
    freelancer: null,
  },
])

const getStatusColor = (status) => {
  switch(status) {
    case 'Pending': return '#8A4EBF';
    case 'In Progress': return '#F0D9FF';
    case 'Finished': return '#5E2B97';
    default: return '#6E3FB4';
  }
}

// Method to format date (you can customize this format)
const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-US')
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
  box-shadow: 0 8px 20px rgba(151, 96, 208, 0.15);
  border-color: #8A4EBF !important;
}

.fw-bold {
  font-weight: 600;
}

/* Focus states */
button:focus {
  box-shadow: 0 0 0 0.2rem rgba(110, 63, 180, 0.25) !important;
}

/* Form placeholders */
::placeholder {
  color: #A78BC9 !important;
  opacity: 1;
}
</style>