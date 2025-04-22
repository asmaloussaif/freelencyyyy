<template>
    <div class="container py-4">
      <!-- Project List -->
      <CCard class="mb-4 shadow-sm">
        <CCardBody>
          <h4 class="fw-bold">Your Projects</h4>
          <CRow class="mt-3">
            <CCol
              v-for="project in projects"
              :key="project.id"
              :md="4"
              class="mb-4"
            >
              <CCard class="h-100 shadow-sm hover-card">
                <CCardBody>
                  <h5 class="fw-bold mb-1">{{ project.name }}</h5>
                  <p class="text-muted mb-1">Date: {{ formatDate(project.date) }}</p>
                  <p class="mb-2">Budget: ${{ project.budget }}</p>
                  <p class="mb-2">Status: <strong>{{ project.status }}</strong></p>
                  <div v-if="project.status === 'In Progress' || project.status === 'Finished'">
                    <p class="mb-2">
                      Freelancer: <strong>{{ project.freelancer.name || 'N/A' }}</strong>
                    </p>
                  </div>
                  <CButton
                    v-if="project.status === 'In Progress' || project.status === 'Finished'"
                    color="primary"
                    class="w-100 shadow-sm"
                  >
                    View Project Details
                  </CButton>
                </CCardBody>
              </CCard>
            </CCol>
          </CRow>
          
          <!-- No projects message -->
          <div v-if="projects.length === 0" class="text-center mt-5 text-muted">
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
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  }
  
  .fw-bold {
    font-weight: 600;
  }
  
  .text-muted {
    color: #6c757d;
  }
  </style>
  