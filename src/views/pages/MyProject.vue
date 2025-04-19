<template>
  <div class="container">
    <h2 class="mb-4 text-primary fw-bold">Offers</h2>

    <CCard class="shadow-sm mb-4">
      <CCardBody>
        <CDataTable
          :items="offers"
          :fields="fields"
          hover
          striped
          bordered
          responsive
        >
          <template #actions="{ item }">
            <CButton color="success" size="sm" class="me-2" @click="acceptOffer(item)">
              Accept
            </CButton>
            <CButton color="danger" size="sm" @click="refuseOffer(item)">
              Refuse
            </CButton>
          </template>
        </CDataTable>
      </CCardBody>
    </CCard>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  CCard,
  CCardBody,
  CDataTable,
  CButton,
} from '@coreui/vue'
import axios from 'axios'

const offers = ref([])

const fields = [
  { key: 'project_name', label: 'Project Name' },
  { key: 'client_name', label: 'Client Name' },
  { key: 'budget', label: 'Budget (€)' },
  { key: 'date_finished', label: 'Date of Finished' },
  { key: 'actions', label: 'Actions', _style: 'width: 150px' }
]

const acceptOffer = (offer) => {
  console.log('Accepted offer:', offer)
  // call API or show confirmation message here
}

const refuseOffer = (offer) => {
  console.log('Refused offer:', offer)
  // call API or show confirmation message here
}

onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/api/freelancer-offers')
    offers.value = response.data
  } catch (error) {
    console.error('Error fetching offers:', error)
  }
})
</script>

<style scoped>
.container {
  padding: 20px;
  max-width: 1100px;
  margin: auto;
  font-family: 'Poppins', sans-serif;
}
</style>
