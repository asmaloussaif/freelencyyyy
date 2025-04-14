<template>
    <div class="container">
      <CCard>
        <CCardHeader>
          <strong>Project Management</strong>
        </CCardHeader>
        <CCardBody>
          <CTable hover responsive bordered>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell scope="col">#</CTableHeaderCell>
                <CTableHeaderCell scope="col">Project Title</CTableHeaderCell>
                <CTableHeaderCell scope="col">Client</CTableHeaderCell>
                <CTableHeaderCell scope="col">Start Date</CTableHeaderCell>
                <CTableHeaderCell scope="col">Deadline</CTableHeaderCell>
                <CTableHeaderCell scope="col">Status</CTableHeaderCell>
                <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="(project, index) in projects" :key="project.id">
                <CTableHeaderCell scope="row">{{ index + 1 }}</CTableHeaderCell>
                <CTableDataCell>{{ project.title }}</CTableDataCell>
                <CTableDataCell>{{ project.client }}</CTableDataCell>
                <CTableDataCell>{{ project.startDate }}</CTableDataCell>
                <CTableDataCell>{{ project.deadline }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge :color="project.status === 'In Progress' ? 'warning' : 'success'">
                    {{ project.status }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton size="sm" color="info">View</CButton>
                  <CButton size="sm" color="danger" class="ms-2">Delete</CButton>
                </CTableDataCell>
              </CTableRow>
            </CTableBody>
          </CTable>
        </CCardBody>
      </CCard>
    </div>
  </template>
  
  <script setup>
  import {
    CCard,
    CCardHeader,
    CCardBody,
    CTable,
    CTableHead,
    CTableBody,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CButton,
    CBadge
  } from '@coreui/vue'
  
  import { ref } from 'vue'
  
  const projects = ref([
    {
      id: 1,
      title: 'Landing Page Redesign',
      client: 'TechCorp Inc.',
      startDate: '2025-03-01',
      deadline: '2025-04-15',
      status: 'In Progress'
    },
    {
      id: 2,
      title: 'Mobile App UI/UX',
      client: 'HealthMate',
      startDate: '2025-02-10',
      deadline: '2025-03-30',
      status: 'Completed'
    }
  ])
  </script>
  
  <style scoped>
  .container {
    padding: 20px;
    font-family: 'Poppins', sans-serif;
  }
  </style>
  