<template>
    <div class="container mt-4">
      <CCard>
        <CCardHeader>
          <strong>Gestion des Réclamations</strong>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Sujet</CTableHeaderCell>
                <CTableHeaderCell>Description</CTableHeaderCell>
                <CTableHeaderCell>Utilisateur</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="claim in claims" :key="claim.id">
                <CTableDataCell>{{ claim.sujet }}</CTableDataCell>
                <CTableDataCell>{{ claim.description }}</CTableDataCell>
                <CTableDataCell>{{ claim.user?.name }}</CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" size="sm" @click="deleteClaim(claim.id)">Supprimer</CButton>
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
    CCardBody,
    CCardHeader,
    CTable,
    CTableHead,
    CTableRow,
    CTableHeaderCell,
    CTableDataCell,
    CTableBody,
    CButton,
  } from '@coreui/vue'
  import { ref, onMounted } from 'vue'
  
  const claims = ref([])
  
  const fetchClaims = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/reclamations')
      const data = await response.json()
      claims.value = data
    } catch (error) {
      console.error('Erreur lors du chargement des réclamations :', error)
    }
  }
  
  const deleteClaim = async (id) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer cette réclamation ?')) return
  
    try {
      await fetch(`http://127.0.0.1:8000/api/reclamations/${id}`, {
        method: 'DELETE',
      })
      claims.value = claims.value.filter((c) => c.id !== id)
    } catch (error) {
      console.error('Erreur lors de la suppression :', error)
    }
  }
  
  onMounted(() => {
    fetchClaims()
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 1100px;
    margin: auto;
  }
  </style>
  