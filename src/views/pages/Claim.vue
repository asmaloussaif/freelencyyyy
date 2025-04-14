<template>
  <div class="container">
    <CCard class="mb-4">
      <CCardHeader>
        <strong>Réclamations</strong>
      </CCardHeader>
      <CCardBody>
        <!-- Formulaire de réclamation -->
        <CForm @submit.prevent="submitClaim">
          <CRow class="mb-3">
            <CCol :md="6">
              <CFormLabel>Sujet</CFormLabel>
              <CFormInput v-model="form.sujet" placeholder="Sujet de la réclamation" required />
            </CCol>
            <CCol :md="6">
              <CFormLabel>Description</CFormLabel>
              <CFormTextarea v-model="form.description" rows="3" required />
            </CCol>
          </CRow>
          <CButton color="primary" type="submit">Envoyer</CButton>
        </CForm>

        <hr class="my-4" />

        <!-- Liste des réclamations -->
        <div v-if="reclamations.length">
          <h5>Historique des réclamations</h5>
          <CCard v-for="reclamation in reclamations" :key="reclamation.id" class="mb-3 p-3">
            <div class="d-flex justify-content-between align-items-center">
              <div>
                <h6 class="mb-1">{{ reclamation.sujet }}</h6>
                <p class="mb-0">{{ reclamation.description }}</p>
                <small class="text-muted">Par : {{ reclamation.user?.name || 'Utilisateur inconnu' }}</small>
              </div>
              <CButton color="danger" size="sm" @click="deleteReclamation(reclamation.id)">Supprimer</CButton>
            </div>
          </CCard>
        </div>
        <div v-else class="text-muted mt-3">Aucune réclamation trouvée.</div>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CCard,
  CCardBody,
  CCardHeader,
  CForm,
  CFormInput,
  CFormTextarea,
  CFormLabel,
  CButton,
  CRow,
  CCol,
} from '@coreui/vue'

const form = ref({
  sujet: '',
  description: '',
  user_id: 1, // 📝 Remplace avec l'ID de l'utilisateur connecté
})

const reclamations = ref([])

const fetchReclamations = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/reclamations')
    reclamations.value = await res.json()
  } catch (error) {
    console.error('Erreur lors du chargement des réclamations', error)
  }
}

const submitClaim = async () => {
  try {
    const res = await fetch('http://127.0.0.1:8000/api/reclamations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form.value),
    })
    if (!res.ok) throw new Error('Erreur lors de l’envoi de la réclamation.')
    form.value.sujet = ''
    form.value.description = ''
    await fetchReclamations()
  } catch (error) {
    console.error('Erreur lors de l’envoi', error)
  }
}

const deleteReclamation = async (id) => {
  try {
    await fetch(`http://127.0.0.1:8000/api/reclamations/${id}`, {
      method: 'DELETE',
    })
    await fetchReclamations()
  } catch (error) {
    console.error('Erreur lors de la suppression', error)
  }
}

onMounted(() => {
  fetchReclamations()
})
</script>

<style scoped>
.container {
  max-width: 900px;
  margin: 0 auto;
  padding: 1rem;
}
</style>
