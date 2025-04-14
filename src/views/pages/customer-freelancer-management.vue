<template>
    <div class="container mt-4">
      <CCard>
        <CCardHeader>
          <strong>Gestion des Utilisateurs (Clients & Freelancers)</strong>
        </CCardHeader>
        <CCardBody>
          <CTable striped hover responsive>
            <CTableHead>
              <CTableRow>
                <CTableHeaderCell>Nom</CTableHeaderCell>
                <CTableHeaderCell>Email</CTableHeaderCell>
                <CTableHeaderCell>Rôle</CTableHeaderCell>
                <CTableHeaderCell>Status</CTableHeaderCell>
                <CTableHeaderCell>Actions</CTableHeaderCell>
              </CTableRow>
            </CTableHead>
            <CTableBody>
              <CTableRow v-for="user in users" :key="user.id">
                <CTableDataCell>{{ user.name }}</CTableDataCell>
                <CTableDataCell>{{ user.email }}</CTableDataCell>
                <CTableDataCell>
                  <CBadge :color="user.role === 'client' ? 'info' : 'warning'">
                    {{ user.role }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CBadge :color="user.active ? 'success' : 'secondary'">
                    {{ user.active ? 'Actif' : 'Inactif' }}
                  </CBadge>
                </CTableDataCell>
                <CTableDataCell>
                  <CButton color="danger" size="sm" @click="deleteUser(user.id)">Supprimer</CButton>
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
    CBadge,
  } from '@coreui/vue'
  import { ref, onMounted } from 'vue'
  
  const users = ref([])
  
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/api/users')
      const data = await response.json()
      users.value = data
    } catch (error) {
      console.error('Erreur de chargement des utilisateurs :', error)
    }
  }
  
  const deleteUser = async (id) => {
    if (!confirm("Confirmer la suppression de l'utilisateur ?")) return
  
    try {
      await fetch(`http://127.0.0.1:8000/api/users/${id}`, {
        method: 'DELETE',
      })
      users.value = users.value.filter((u) => u.id !== id)
    } catch (error) {
      console.error("Erreur lors de la suppression :", error)
    }
  }
  
  onMounted(() => {
    fetchUsers()
  })
  </script>
  
  <style scoped>
  .container {
    max-width: 1100px;
    margin: auto;
  }
  </style>
  